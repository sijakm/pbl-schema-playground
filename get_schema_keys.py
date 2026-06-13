import re
import json
import sys

def get_keys(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    match = re.search(r'PER_LESSON_SCHEMA:\s*({.*)', content, re.DOTALL)
    if not match:
        match = re.search(r'export const PER_LESSON_SCHEMA = ({.*)', content, re.DOTALL)
        
    if not match:
        print("not found in", filepath)
        return
        
    s = match.group(1)
    
    # Simple nested brace parser
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
        if c == '"':
            in_str = not in_str
            continue
        if in_str:
            continue
            
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                end_idx = i
                break
                
    schema_str = s[:end_idx+1]
    
    # Instead of json.parse, we will just find all properties under "LessonDescription" -> "properties"
    # Find "LessonDescription": { ... "properties": {
    ld_match = re.search(r'\"LessonDescription\"\s*:\s*{(.*?\"properties\"\s*:\s*{)', schema_str, re.DOTALL)
    if not ld_match:
        print("LessonDescription not found in", filepath)
        return
        
    start_idx = ld_match.end()
    
    depth = 1
    in_str = False
    escape = False
    
    # We want to find keys exactly at depth 1 within the properties object
    keys = []
    current_key = None
    key_pattern = r'^\s*\"([a-zA-Z0-9_]+)\"\s*:\s*{$'
    
    buf = ""
    for c in schema_str[start_idx:]:
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
                    # check what was right before {
                    m = re.search(r'\"([a-zA-Z0-9_]+)\"\s*:\s*{$', buf)
                    if m:
                        keys.append(m.group(1))
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
                    
    print(f"=== {filepath} ===")
    for k in keys:
        print(k)

get_keys('direct_instructions_markdown/prompts.js')
get_keys('collaborative_markdown/prompts_collaborative.js')
