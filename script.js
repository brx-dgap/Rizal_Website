/**
 * ============================================================
 * RIZAL DIGITAL LEGACY EXHIBIT — script.js
 * Tab-switching logic, sidebar controls, scroll-to-top, and
 * progressive enhancement utilities.
 * ============================================================
 */

'use strict';

/* ── DOM References ─────────────────────────────────────── */
const sidebar        = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const hamburgerBtn   = document.getElementById('hamburger-btn');
const allNavItems    = document.querySelectorAll('.nav-item');
const allPanels      = document.querySelectorAll('.content-panel');
const mainContent    = document.querySelector('.main-content');

/* ─────────────────────────────────────────────────────────────
   PANEL SWITCHING
   - Called by each nav-item's onclick="switchPanel(this)"
   - Removes .active from all nav-items and panels, then adds
     it to the clicked item and its target panel.
───────────────────────────────────────────────────────────── */
function switchPanel(clickedNavItem) {
  const targetPanelId = clickedNavItem.getAttribute('data-panel');
  const targetPanel   = document.getElementById(targetPanelId);

  if (!targetPanel) {
    console.warn('[RizalExhibit] Panel not found:', targetPanelId);
    return;
  }

  /* 1. Deactivate all nav items */
  allNavItems.forEach(item => {
    item.classList.remove('active');
    item.removeAttribute('aria-current');
  });

  /* 2. Deactivate all content panels */
  allPanels.forEach(panel => {
    panel.classList.remove('active');
  });

  /* 3. Activate the clicked nav item */
  clickedNavItem.classList.add('active');
  clickedNavItem.setAttribute('aria-current', 'true');

  /* 4. Activate the target panel */
  targetPanel.classList.add('active');

  /* 5. Scroll content area back to top */
  mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  /* 6. On mobile: close the sidebar after selection */
  if (window.innerWidth <= 768) {
    closeSidebar();
  }

  /* 7. Update browser URL hash (for bookmarking/linking) */
  history.replaceState(null, '', `#${targetPanelId}`);
}

/* ─────────────────────────────────────────────────────────────
   MOBILE SIDEBAR TOGGLE
───────────────────────────────────────────────────────────── */
function toggleSidebar() {
  const isOpen = sidebar.classList.contains('open');
  if (isOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('visible');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; /* Prevent background scroll on mobile */
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('visible');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ─────────────────────────────────────────────────────────────
   DEEP-LINK SUPPORT
   If the URL contains a hash (e.g. #panel-s2), activate that
   panel on page load automatically.
───────────────────────────────────────────────────────────── */
function activatePanelFromHash() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;

  const targetNav = document.querySelector(`[data-panel="${hash}"]`);
  if (targetNav) {
    switchPanel(targetNav);
  }
}

/* ─────────────────────────────────────────────────────────────
   KEYBOARD NAVIGATION
   Allow arrow keys to move between nav items for accessibility.
───────────────────────────────────────────────────────────── */
allNavItems.forEach((item, index) => {
  item.addEventListener('keydown', (e) => {
    let targetIndex = null;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (index + 1) % allNavItems.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (index - 1 + allNavItems.length) % allNavItems.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = allNavItems.length - 1;
    }

    if (targetIndex !== null) {
      allNavItems[targetIndex].focus();
    }
  });
});

/* ─────────────────────────────────────────────────────────────
   TIMELINE ANIMATION OBSERVER
   Trigger the CSS timeline animation only when the timeline
   is scrolled into the viewport (Intersection Observer).
───────────────────────────────────────────────────────────── */
function initTimelineObserver() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (!timelineItems.length) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  timelineItems.forEach(item => {
    /* Pause animation by default; play on scroll-into-view */
    item.style.animationPlayState = 'paused';
    observer.observe(item);
  });
}

/* ─────────────────────────────────────────────────────────────
   CARD ENTRANCE ANIMATIONS
   Animate cards sliding up when they enter the viewport.
───────────────────────────────────────────────────────────── */
function initCardAnimations() {
  const animatableElements = document.querySelectorAll(
    '.issue-card, .contribution-card, .sector-card, .pledge-card, .team-card, .charge-card, .pillar-card'
  );

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${idx * 0.06}s, transform 0.5s ease ${idx * 0.06}s`;

        /* Use a tiny delay to allow the transition to register */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        });

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  animatableElements.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   SCROLL-TO-TOP BUTTON
   Appears when the user scrolls down > 400px.
───────────────────────────────────────────────────────────── */
function initScrollToTop() {
  /* Create button */
  const btn = document.createElement('button');
  btn.id = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Scroll back to top');
  btn.innerHTML = '↑';
  btn.style.cssText = `
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 44px;
    height: 44px;
    background: var(--accent-navy);
    color: var(--accent-gold);
    border: 2px solid var(--accent-gold);
    border-radius: 50%;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(26,54,93,0.3);
    z-index: 200;
    transition: all 0.3s ease;
    font-family: var(--font-sans);
  `;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  });

  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'var(--accent-gold)';
    btn.style.color = 'var(--accent-navy)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'var(--accent-navy)';
    btn.style.color = 'var(--accent-gold)';
  });

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   ACTIVE NAV HIGHLIGHT FROM SCROLL
   Optional: If all panels were on one page (not used in tab
   mode), this would track scroll position. Kept as a utility.
───────────────────────────────────────────────────────────── */
function updateNavHighlight(panelId) {
  allNavItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-panel') === panelId);
  });
}

/* ─────────────────────────────────────────────────────────────
   WINDOW RESIZE HANDLER
   Reset sidebar state when resizing from mobile back to desktop.
───────────────────────────────────────────────────────────── */
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeSidebar();
  }
});

/* ─────────────────────────────────────────────────────────────
   IMAGE ERROR GRACEFUL FALLBACK
   If any real image fails to load, show the placeholder style.
───────────────────────────────────────────────────────────── */
function initImageFallbacks() {
  document.querySelectorAll('img[src]').forEach(img => {
    img.addEventListener('error', function () {
      const parent = this.parentElement;
      if (parent && parent.classList.contains('member-photo-wrap')) {
        parent.innerHTML = `
          <div class="photo-icon" aria-hidden="true">👤</div>
          <div style="font-size:0.68rem; color:var(--accent-bronze);">Photo not found</div>
        `;
      } else if (parent && parent.classList.contains('member-avatar-placeholder')) {
        this.style.display = 'none';
        parent.textContent = '👤';
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   INIT — Called when DOM is ready
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Activate panel from URL hash (deep-link support) */
  activatePanelFromHash();

  /* Start scroll-based features */
  initScrollToTop();

  /* Initialize timeline and card entrance animations */
  initTimelineObserver();
  initCardAnimations();

  /* Image error fallbacks */
  initImageFallbacks();

  /* Close sidebar if clicking outside of it on mobile */
  document.addEventListener('click', (e) => {
    if (
      window.innerWidth <= 768 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      closeSidebar();
    }
  });

  lucide.createIcons();
  console.log(
    '%c⚜ Rizal Digital Legacy Exhibit%c loaded successfully.',
    'color:#1a365d; font-weight:bold; font-size:14px;',
    'color:#6b7280;'
  );
});

/* Expose switchPanel, toggleSidebar, closeSidebar globally
   (required because they are called via inline onclick attributes) */
window.switchPanel    = switchPanel;
window.toggleSidebar  = toggleSidebar;
window.closeSidebar   = closeSidebar;
