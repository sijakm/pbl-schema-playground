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

# Added "tata bahasa" to match Indonesian
search_pattern = re.compile(r'(^[ \t]*-.*(?:grammati|gramati|gramatikal|граммати|грамати|tata bahasa).*)$', re.IGNORECASE | re.MULTILINE)

count = 0
for folder in playgrounds:
    if not os.path.exists(folder): continue
    
    prompt_files = [f for f in os.listdir(folder) if f.startswith("prompts_") and f.endswith(".js")]
    for pf in prompt_files:
        filepath = os.path.join(folder, pf)
        
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
        
        lines = content.split('\n')
        new_lines = []
        changed = 0
        i = 0
        while i < len(lines):
            line = lines[i]
            new_lines.append(line)
            if search_pattern.match(line):
                if i + 1 < len(lines) and ("Kako" in lines[i+1] or "Како" in lines[i+1] or "Cómo" in lines[i+1] or "Как" in lines[i+1] or "Bagaimana" in lines[i+1] or "How" in lines[i+1]):
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
