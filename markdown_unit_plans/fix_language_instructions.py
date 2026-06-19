import os
import re

playgrounds = [
    'direct_instructions_markdown',
    'inquiry_markdown',
    'lab_markdown',
    'collaborative_markdown',
    'pbl_markdown'
]

instruction = "\n\nCRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested."

for folder in playgrounds:
    prompt_files = [f for f in os.listdir(folder) if f.startswith("prompts_") and f.endswith(".js")]
    for pf in prompt_files:
        # Skip English prompts since they don't need translation
        if pf == f"prompts_{folder.replace('_markdown', '')}.js" or pf.endswith("_en.js"):
            continue
            
        filepath = os.path.join(folder, pf)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # We will append the instruction right before the closing backtick of STEP0_PROMPT_TEMPLATE and PER_LESSON_PROMPT_TEMPLATE
        # Find: `, (end of STEP0)
        # Find: ` (end of PER_LESSON, which is before the trailing comma or end of file)

        # Regex to replace the closing backtick of a template that ends with `
        # Actually, it's safer to just replace `\n\nOUTPUT REQUIREMENTS:` or `\n\nZAHTEVI ZA IZLAZ:` etc. 
        # But wait, we can just insert it before the closing backtick.
        content = re.sub(r'(`\s*,)', instruction + r'\1', content)
        # For the last template, it ends with `\n  }\n' or similar
        content = re.sub(r'(`\s*\n\s*\}?)$', instruction + r'\1', content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Added language instruction to all non-English prompt files.")
