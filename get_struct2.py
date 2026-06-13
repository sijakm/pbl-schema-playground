import re
import json

def get_keys(filepath, parent_key):
    with open(filepath, 'r') as f:
        content = f.read()

    match = re.search(r'PER_LESSON_SCHEMA:\s*({.*)', content, re.DOTALL)
    if not match: return
    s = match.group(1)
    
    # Just look for '"parent_key": {' and extract all property keys within its 'properties'
    match = re.search(f'\"{parent_key}\"\\s*:\\s*{{(.*?\"properties\"\\s*:\\s*{{)', s, re.DOTALL)
    if not match: return
    start_idx = match.end()
    
    depth = 1
    in_str = False
    escape = False
    keys = []
    buf = ""
    for c in s[start_idx:]:
        if escape:
            escape = False
            buf += c
            continue
        if c == '\\':
            escape = True
            buf += c
            continue
        if c == '"':
            in_str = not in_str
            buf += c
            continue
            
        buf += c
        if not in_str:
            if c == '{':
                depth += 1
                if depth == 2:
                    m = re.search(r'\"([a-zA-Z0-9_]+)\"\s*:\s*{$', buf)
                    if m: keys.append(m.group(1))
            elif c == '}':
                depth -= 1
                if depth == 0: break
    print(parent_key, ":", keys)

get_keys('direct_instructions_markdown/prompts.js', 'Reflection')
get_keys('direct_instructions_markdown/prompts.js', 'EarlyFinishers')
