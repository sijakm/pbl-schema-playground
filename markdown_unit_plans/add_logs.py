import os
import re

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

    # 1. Modify callResponsesApiStream
    # Find `return await window.apiClient.stream(`
    # and replace with logging logic.
    replacement = """
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
    
    # We need to replace the old return await ...
    # We'll use regex.
    pattern = r'return\s+await\s+window\.apiClient\.stream\(\{[^}]+\}\);?\s*\}'
    if re.search(pattern, content):
        content = re.sub(pattern, replacement.strip(), content)

    # 2. Add .NET API logs for Step 0
    net_req_pattern = r'const resStep0 = await fetch\("http://localhost:5000/api/[a-z]+/generate/step0", \{\s*method: "POST",\s*headers: \{ "Content-Type": "application/json" \},\s*body: (JSON\.stringify\(\{[^}]+\}\))\s*\}\);'
    
    def repl_net_step0(m):
        body_str = m.group(1)
        url_match = re.search(r'http://localhost:5000/api/[a-z]+/generate/step0', m.group(0))
        url = url_match.group(0)
        return f"""console.log(`=== .NET API REQUEST: Step 0 ===`);
          console.log({body_str});
          const resStep0 = await fetch("{url}", {{
            method: "POST",
            headers: {{ "Content-Type": "application/json" }},
            body: {body_str}
          }});"""
    content = re.sub(net_req_pattern, repl_net_step0, content)

    # Add .NET API response log for Step 0
    net_res_pattern = r'currentMarkdown = dataStep0\.markdown;'
    content = re.sub(net_res_pattern, r'console.log(`=== .NET API RESPONSE: Step 0 ===`);\n            console.log(dataStep0);\n            currentMarkdown = dataStep0.markdown;', content)

    # 3. Add .NET API logs for Lessons
    net_les_pattern = r'const res = await fetch\("http://localhost:5000/api/[a-z]+/generate/lessons", \{\s*method: "POST",\s*headers: \{ "Content-Type": "application/json" \},\s*body: (JSON\.stringify\(\{[^}]+\}\))\s*\}\);'
    
    def repl_net_les(m):
        body_str = m.group(1)
        url_match = re.search(r'http://localhost:5000/api/[a-z]+/generate/lessons', m.group(0))
        url = url_match.group(0)
        return f"""console.log(`=== .NET API REQUEST: Lessons ===`);
          console.log({body_str});
          const res = await fetch("{url}", {{
            method: "POST",
            headers: {{ "Content-Type": "application/json" }},
            body: {body_str}
          }});"""
    content = re.sub(net_les_pattern, repl_net_les, content)

    # Add .NET API response log for Lessons
    net_les_res_pattern = r'const data = await res\.json\(\);(\s*)const finalMarkdown'
    content = re.sub(net_les_res_pattern, r'const data = await res.json();\1console.log(`=== .NET API RESPONSE: Lessons ===`);\1console.log(data);\1const finalMarkdown', content)

    with open(app_jsx_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Added detailed logs to App.jsx files.")
