import re
import json

def extract_schema(filepath, outpath):
    with open(filepath, 'r') as f:
        content = f.read()

    match = re.search(r'PER_LESSON_SCHEMA:\s*({.*)', content, re.DOTALL)
    if not match:
        match = re.search(r'export const PER_LESSON_SCHEMA = ({.*)', content, re.DOTALL)
    
    if not match: return
    s = match.group(1)
    
    depth = 0
    in_str = False
    escape = False
    end_idx = -1
    for i, c in enumerate(s):
        if escape:
            escape = False
            continue
        if c == '\\':
            escape = True
            continue
        if c == '"' or c == "'":
            in_str = not in_str
            continue
        if not in_str:
            if c == '{': depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    end_idx = i
                    break
    obj_str = s[:end_idx+1]
    
    # We will just write obj_str to a js file and evaluate it
    js_code = f"const obj = {obj_str};\nconsole.log(JSON.stringify(obj, null, 2));"
    with open('temp.js', 'w') as f:
        f.write(js_code)

import subprocess

extract_schema('direct_instructions_markdown/prompts.js', 'direct_schema.json')
subprocess.run(['node', 'temp.js'], stdout=open('direct_schema.json', 'w'))

extract_schema('collaborative_markdown/prompts_collaborative.js', 'collab_schema.json')
subprocess.run(['node', 'temp.js'], stdout=open('collab_schema.json', 'w'))

