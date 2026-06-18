import os
import re

# We will go through all playgrounds and fix App.jsx and prompt scripts.

playgrounds = [
    ('direct_instructions_markdown', 'direct_instructions'),
    ('inquiry_markdown', 'inquiry'),
    ('lab_markdown', 'lab'),
    ('collaborative_markdown', 'collaborative'),
    ('pbl_markdown', 'pbl')
]

for folder, name in playgrounds:
    # 1. Fix prompt files
    prompt_files = [f for f in os.listdir(folder) if f.startswith(f"prompts_{name}")]
    for pf in prompt_files:
        lang = pf.replace(f"prompts_{name}", "").replace(".js", "").strip("_")
        if not lang:
            lang = "en"
            
        expected_var = f"window.prompts_{name}_{lang}"
        if lang == "en":
            expected_var = f"window.prompts_{name}"
            
        filepath = os.path.join(folder, pf)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # find window.pblPrompts_ensrLatn = {
        # or window.promptsid = {
        content = re.sub(r'window\.[a-zA-Z0-9_]+\s*=\s*\{', f'{expected_var} = {{', content, count=1)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
    # 2. Fix App.jsx
    app_jsx_path = os.path.join(folder, "src", "App.jsx")
    with open(app_jsx_path, 'r', encoding='utf-8') as f:
        app_content = f.read()
        
    # fix imports to include defaults.js
    if "import '../../shared/defaults.js';" not in app_content:
        app_content = "import '../../shared/defaults.js';\n" + app_content
        
    # fix the checks
    checks = f"""
      let p = window.prompts_{name};
      if (language === 'sr-Latn') p = window.prompts_{name}_sr_Latn;
      else if (language === 'sr-Cyrl') p = window.prompts_{name}_sr_Cyrl;
      else if (language === 'es') p = window.prompts_{name}_es;
      else if (language === 'ru') p = window.prompts_{name}_ru;
      else if (language === 'id') p = window.prompts_{name}_id;
      if (!p) p = window.prompts_{name};
"""
    # Replace the old try block part
    app_content = re.sub(r'let p = window\.[a-zA-Z0-9_]+;\s*if\s*\(language[\s\S]*?if\s*\(!p\).*?;', checks.strip(), app_content)
    
    with open(app_jsx_path, 'w', encoding='utf-8') as f:
        f.write(app_content)

print("Fixed prompt variable names and App.jsx files.")
