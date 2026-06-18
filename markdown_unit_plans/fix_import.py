import os

playgrounds = [
    'direct_instructions_markdown',
    'inquiry_markdown',
    'lab_markdown',
    'collaborative_markdown',
    'pbl_markdown'
]

for folder in playgrounds:
    app_jsx_path = os.path.join(folder, "src", "App.jsx")
    with open(app_jsx_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the incorrect import path
    content = content.replace("import '../../shared/defaults.js';", "import '../../../shared/defaults.js';")
    
    with open(app_jsx_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed import path in App.jsx files")
