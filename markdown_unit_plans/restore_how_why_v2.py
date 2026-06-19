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

translations = {
    'sr_Latn': r'- Svako pitanje MORA počinjati sa „Kako” ili „Zašto”.',
    'sr_Cyrl': r'- Свако питање МОРА почињати са „Како” или „Зашто”.',
    'es': r'- Cada pregunta DEBE comenzar con "Cómo" o "Por qué".',
    'ru': r'- Каждый вопрос ДОЛЖЕН начинаться с «Как» или «Почему».',
    'id': r'- Setiap pertanyaan WAJIB diawali dengan "Bagaimana" atau "Mengapa".',
    'en': r'- Each question MUST begin with either "How" or "Why".'
}

# The line we are looking for is the one with the grammatical requirement
search_pattern = re.compile(r'(^[ \t]*-.*(?:grammati|gramati|gramatikal).*)$', re.IGNORECASE | re.MULTILINE)

count = 0
for folder in playgrounds:
    # Handle inquiry and pbl later if needed, but they didn't have this rule as bullet points
    if not os.path.exists(folder): continue
    
    prompt_files = [f for f in os.listdir(folder) if f.startswith("prompts_") and f.endswith(".js")]
    for pf in prompt_files:
        filepath = os.path.join(folder, pf)
        
        # Determine language
        lang = 'en'
        for key in ['sr_Latn', 'sr_Cyrl', 'es', 'ru', 'id']:
            if pf.endswith(f"_{key}.js"):
                lang = key
                break
                
        if pf.endswith("_en.js"):
            lang = 'en'

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        insertion = translations[lang]
        
        if insertion in content:
            # Maybe it's partially there, let's just count how many times and skip those
            pass
            
        def repl(match):
            line = match.group(1)
            # If the insertion is already right after, don't duplicate
            # We'll just replace the line and add the insertion if not present
            return f'{line}\n{insertion}'

        # We need to split and check to avoid duplication if it's already there
        lines = content.split('\n')
        new_lines = []
        changed = 0
        i = 0
        while i < len(lines):
            line = lines[i]
            new_lines.append(line)
            # if we match the grammar rule
            if search_pattern.match(line):
                # check if next line is already the insertion or similar
                if i + 1 < len(lines) and ("Kako" in lines[i+1] or "Како" in lines[i+1] or "Cómo" in lines[i+1] or "Как" in lines[i+1] or "Bagaimana" in lines[i+1] or "How" in lines[i+1]) and ("Zašto" in lines[i+1] or "Зашто" in lines[i+1] or "Por" in lines[i+1] or "Почему" in lines[i+1] or "Mengapa" in lines[i+1] or "Why" in lines[i+1]):
                    # already there, skip
                    pass
                else:
                    new_lines.append(insertion)
                    changed += 1
            i += 1

        if changed > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write('\n'.join(new_lines))
            print(f"Restored How/Why in {filepath} ({changed} replacements)")
            count += changed

print(f"Total new restorations: {count}")
