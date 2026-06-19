import os
import re

folder = 'lecture_markdown'
name = 'lecture'

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
        
    # find window.pblPrompts_ensrLatn = { or window.promptsid = {
    content = re.sub(r'window\.[a-zA-Z0-9_]+\s*=\s*\{', f'{expected_var} = {{', content, count=1)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
# 2. Fix App.jsx checks & add import
app_jsx_path = os.path.join(folder, "src", "App.jsx")
with open(app_jsx_path, 'r', encoding='utf-8') as f:
    app_content = f.read()
    
if "import '../../../shared/defaults.js';" not in app_content:
    app_content = "import '../../../shared/defaults.js';\n" + app_content
    
checks = f"""
      let p = window.prompts_{name};
      if (language === 'sr-Latn') p = window.prompts_{name}_sr_Latn;
      else if (language === 'sr-Cyrl') p = window.prompts_{name}_sr_Cyrl;
      else if (language === 'es') p = window.prompts_{name}_es;
      else if (language === 'ru') p = window.prompts_{name}_ru;
      else if (language === 'id') p = window.prompts_{name}_id;
      if (!p) p = window.prompts_{name};
"""
app_content = re.sub(r'let p = window\.[a-zA-Z0-9_]+;\s*if\s*\(language[\s\S]*?if\s*\(!p\).*?;', checks.strip(), app_content)

# 3. Add detailed logs
rep_stream = """
  console.log(`=== OPENAI REQUEST: ${schemaName || "Response"} ===`);
  console.log(JSON.stringify(body, null, 2));
  const responseText = await window.apiClient.stream({
    endpoint, apiKey, body, signal,
    onDelta: params.onDelta,
    onUsage: (usage) => { if (window.TokenManager) new window.TokenManager().add(usage); },
    onError: (err) => { throw new Error(err.message || "Unknown error"); }
  });
  console.log(`=== OPENAI RESPONSE: ${schemaName || "Response"} ===`);
  console.log(responseText);
  return responseText;
}"""
app_content = re.sub(r'return\s+await\s+window\.apiClient\.stream\(\{[^}]+\}\);?\s*\}', rep_stream.strip(), app_content)

net_req_pattern = r'const resStep0 = await fetch\("http://localhost:5000/api/[a-z]+/generate/step0", \{\s*method: "POST",\s*headers: \{ "Content-Type": "application/json" \},\s*body: (JSON\.stringify\(\{[^}]+\}\))\s*\}\);'
def repl_net_step0(m):
    body_str = m.group(1)
    url_match = re.search(r'http://localhost:5000/api/[a-z]+/generate/step0', m.group(0))
    return f"""console.log(`=== .NET API REQUEST: Step 0 ===`);
          console.log({body_str});
          const resStep0 = await fetch("{url_match.group(0)}", {{
            method: "POST",
            headers: {{ "Content-Type": "application/json" }},
            body: {body_str}
          }});"""
app_content = re.sub(net_req_pattern, repl_net_step0, app_content)

app_content = re.sub(r'currentMarkdown = dataStep0\.markdown;', r'console.log(`=== .NET API RESPONSE: Step 0 ===`);\n            console.log(dataStep0);\n            currentMarkdown = dataStep0.markdown;', app_content)

net_les_pattern = r'const res = await fetch\("http://localhost:5000/api/[a-z]+/generate/lessons", \{\s*method: "POST",\s*headers: \{ "Content-Type": "application/json" \},\s*body: (JSON\.stringify\(\{[^}]+\}\))\s*\}\);'
def repl_net_les(m):
    body_str = m.group(1)
    url_match = re.search(r'http://localhost:5000/api/[a-z]+/generate/lessons', m.group(0))
    return f"""console.log(`=== .NET API REQUEST: Lessons ===`);
          console.log({body_str});
          const res = await fetch("{url_match.group(0)}", {{
            method: "POST",
            headers: {{ "Content-Type": "application/json" }},
            body: {body_str}
          }});"""
app_content = re.sub(net_les_pattern, repl_net_les, app_content)
app_content = re.sub(r'const data = await res\.json\(\);(\s*)const finalMarkdown', r'const data = await res.json();\1console.log(`=== .NET API RESPONSE: Lessons ===`);\1console.log(data);\1const finalMarkdown', app_content)

with open(app_jsx_path, 'w', encoding='utf-8') as f:
    f.write(app_content)
    
# 4. Fix vite.config.js
vite_path = os.path.join(folder, "vite.config.js")
config = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..', '../..', '../../..']
    }
  }
})
"""
with open(vite_path, 'w') as f:
    f.write(config)

print("lecture_markdown fully patched!")
