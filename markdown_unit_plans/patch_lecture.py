import os
import re

folder = 'lecture_markdown'
instruction = "\n\nCRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested."

prompt_files = [f for f in os.listdir(folder) if f.startswith("prompts_") and f.endswith(".js")]
for pf in prompt_files:
    if pf == f"prompts_lecture.js" or pf.endswith("_en.js"):
        continue
        
    filepath = os.path.join(folder, pf)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = re.sub(r'(`\s*,)', instruction + r'\1', content)
    content = re.sub(r'(`\s*\n\s*\}?)$', instruction + r'\1', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Added language instruction to all lecture_markdown prompt files.")
