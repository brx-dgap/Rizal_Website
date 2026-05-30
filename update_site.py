import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Include Lucide Icons script
lucide_script = '<script src="https://unpkg.com/lucide@latest"></script>\n  <script src="script.js"></script>'
html = html.replace('<script src="script.js"></script>', lucide_script)

# 2. Replace emojis with lucide icons
emoji_map = {
    '⚜': 'award', '🪶': 'feather', '📖': 'book-open', '🏡': 'home', '⚖️': 'scale',
    '🌟': 'star', '✍️': 'pen-tool', '👥': 'users', '📜': 'scroll', '🖼️': 'image',
    '🗺️': 'map', '📕': 'book', '⚡': 'zap', '🏛️': 'landmark', '📚': 'library',
    '🤝': 'handshake', '🌿': 'leaf', '⚕️': 'activity', '🏫': 'school', '🛠️': 'hammer',
    '🔬': 'microscope', '🕊️': 'bird', '🌱': 'sprout', '💊': 'pill', '📱': 'smartphone',
    '💧': 'droplet', '🌾': 'wheat', '🔭': 'telescope', '🎭': 'smile', '📋': 'clipboard',
    '🕯️': 'flame', '🔥': 'flame', '🇵🇭': 'flag', '💫': 'sparkles', '🌍': 'globe',
    '🧠': 'brain', '👤': 'user', '👑': 'crown', '🌺': 'flower', '📌': 'pin', '🎨': 'palette'
}

for emoji, icon in emoji_map.items():
    html = html.replace(emoji, f'<i data-lucide="{icon}"></i>')

# Replace exact em-dash phrases to make sense
html = html.replace('June 19, 1861 — December 30, 1896', 'June 19, 1861 to December 30, 1896')
html = html.replace('1892–1896', '1892 to 1896')
html = html.replace('Dec 30, 1896 —', 'Dec 30, 1896 :')
html = html.replace('Dec. 26, 1896 —', 'Dec. 26, 1896 :')
html = html.replace('Dec. 30, 1896 —', 'Dec. 30, 1896 :')
html = html.replace('June 12, 1898 —', 'June 12, 1898 :')
html = html.replace(' — ', ' : ')
html = html.replace('—', ':')

# 3. Replace image placeholders with real images
# Portrait
html = re.sub(
    r'<img\s+src="images/rizal-portrait\.jpg"[^>]*>',
    r'<img src="images/rizal_portrait.png" alt="Portrait of Dr. José Rizal" style="width:100%; height:auto; object-fit:cover;" />',
    html
)
html = re.sub(r'<div class="img-placeholder" style="width:340px; height:280px; display:none;">.*?</div>', '', html, flags=re.DOTALL)
html = re.sub(r'<div class="img-placeholder" style="width:340px; height:280px;">.*?</div>', '', html, flags=re.DOTALL)

# Travel Map
html = re.sub(
    r'<div class="img-placeholder"[^>]*>.*?Vintage Map: Rizal\'s Travel Routes.*?</div>',
    r'<img src="images/rizal_travel_map.png" alt="Rizal Travel Map" style="width:100%; height:auto; border-radius:12px; border:2px solid var(--accent-gold);" />',
    html,
    flags=re.DOTALL
)

# El Fili Cover
html = re.sub(
    r'<div class="img-placeholder"[^>]*>.*?Original Cover.*?El Filibusterismo.*?</div>',
    r'<img src="images/el_filibusterismo_cover.png" alt="El Filibusterismo Cover" style="width:100%; height:auto; border-radius:12px; border:2px solid var(--accent-gold);" />',
    html,
    flags=re.DOTALL
)

# Modern Editorial Cartoon -> Wikimedia Image of La Solidaridad or related
html = re.sub(
    r'<div class="img-placeholder"[^>]*>.*?Modern Editorial Cartoon.*?</div>',
    r'<img src="https://upload.wikimedia.org/wikipedia/commons/7/77/La_Solidaridad_issue_1.jpg" alt="La Solidaridad" style="width:100%; height:260px; object-fit:cover; border-radius:12px; border:2px solid var(--accent-gold);" />',
    html,
    flags=re.DOTALL
)

# Dapitan Relief Map / Waterworks (Since we generated waterworks, I'll use it here)
html = re.sub(
    r'<div class="img-placeholder"[^>]*>.*?Relief Map of Mindanao.*?</div>',
    r'<img src="images/dapitan_waterworks.png" alt="Dapitan Waterworks" style="width:100%; height:240px; object-fit:cover; border-radius:12px; border:2px solid var(--accent-gold);" />',
    html,
    flags=re.DOTALL
)

# Dapitan School -> Wikimedia Rizal Shrine
html = re.sub(
    r'<div class="img-placeholder"[^>]*>.*?Rizal\'s School in Dapitan.*?</div>',
    r'<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Rizal_Shrine_Dapitan.jpg/800px-Rizal_Shrine_Dapitan.jpg" alt="Rizal Shrine Dapitan" style="width:100%; height:240px; object-fit:cover; border-radius:12px; border:2px solid var(--accent-gold);" />',
    html,
    flags=re.DOTALL
)

# Infographic Community Proposal (Keep placeholder as user might want to make their own diagram, or use a generic image)
html = re.sub(
    r'<div class="img-placeholder mt-8"[^>]*>.*?Infographic Diagram.*?</div>',
    r'<div class="card mt-8 text-center" style="background: rgba(26,54,93,0.05); border: 2px dashed var(--accent-gold); padding: 40px;"><i data-lucide="bar-chart" style="width:48px; height:48px; color:var(--accent-navy); margin-bottom:12px;"></i><h4 style="color:var(--accent-navy); font-family:var(--font-serif); font-size:1.2rem;">Community Project Framework</h4><p style="color:var(--text-muted); font-size:0.9rem;">(Visual diagram to be implemented)</p></div>',
    html,
    flags=re.DOTALL
)

# Execution Bagumbayan
html = re.sub(
    r'<div class="img-placeholder"[^>]*>.*?Rizal\'s Execution at Bagumbayan.*?</div>',
    r'<img src="images/bagumbayan_execution.png" alt="Execution at Bagumbayan" style="width:100%; height:280px; object-fit:cover; border-radius:12px; border:2px solid var(--accent-gold);" />',
    html,
    flags=re.DOTALL
)

# Mi Ultimo Adios Manuscript
html = re.sub(
    r'<div class="img-placeholder"[^>]*>.*?Mi Último Adiós Manuscript.*?</div>',
    r'<img src="https://upload.wikimedia.org/wikipedia/commons/6/60/Mi_%C3%BAltimo_adi%C3%B3s.jpg" alt="Mi Ultimo Adios Manuscript" style="width:100%; height:180px; object-fit:cover; border-radius:12px; border:2px solid var(--accent-gold); opacity:0.85;" />',
    html,
    flags=re.DOTALL
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('script.js', 'r', encoding='utf-8') as f:
    script = f.read()

if 'lucide.createIcons()' not in script:
    script = script.replace(
        "console.log(", 
        "lucide.createIcons();\n  console.log("
    )
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(script)
