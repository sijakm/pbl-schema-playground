import os
import re

playgrounds = [
    'direct_instructions_markdown',
    'inquiry_markdown',
    'lab_markdown',
    'collaborative_markdown',
    'pbl_markdown',
    'lecture_markdown'
]

# Regex matches: - followed by any chars, then quotes How quotes, any chars, quotes Why quotes, any chars to end of line
# E.g. - Svako pitanje MORA počinjati sa „How” ili „Why”.
pattern = re.compile(r'^[ \t]*-[ \t]*.*(?:How|HOW|how).*(?:Why|WHY|why).*$', re.IGNORECASE | re.MULTILINE)

count = 0
for folder in playgrounds:
    prompt_files = [f for f in os.listdir(folder) if f.startswith("prompts_") and f.endswith(".js")]
    for pf in prompt_files:
        filepath = os.path.join(folder, pf)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # We will replace the entire line with an empty string
        new_content, num_subs = pattern.subn('', content)
        
        # also we want to remove the blank lines left behind
        new_content = re.sub(r'\n{3,}', '\n\n', new_content)
        
        if num_subs > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Patched {filepath} ({num_subs} replacements)")
            count += num_subs

print(f"Total lines removed: {count}")
