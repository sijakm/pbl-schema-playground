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

# The regex maps language to the sentence we search for
# To make it robust, we'll just search for the "question mark" list item which usually ends with '?' or something similar
search_patterns = {
    'sr_Latn': r'(- Svako pitanje MORA biti potpuna, gramatički ispravna rečenica koja se završava znakom pitanja\.)',
    'sr_Cyrl': r'(- Свако питање МОРА бити потпуна, граматички исправна реченица која се завршава знаком питања\.)',
    'es': r'(- Cada pregunta DEBE ser una oración completa y gramaticalmente correcta que termine con un signo de interrogación\.)',
    'ru': r'(- Каждый вопрос ДОЛЖЕН быть полным, грамматически правильным предложением, заканчивающимся вопросительным знаком\.)',
    'id': r'(- Setiap pertanyaan WAJIB berupa kalimat lengkap dan secara gramatikal benar yang diakhiri dengan tanda tanya\.)',
    'en': r'(- Each question MUST be a complete, grammatically correct sentence ending with a question mark\.)'
}

count = 0
for folder in playgrounds:
    prompt_files = [f for f in os.listdir(folder) if f.startswith("prompts_") and f.endswith(".js")]
    for pf in prompt_files:
        filepath = os.path.join(folder, pf)
        
        # Determine language
        lang = 'en'
        for key in ['sr_Latn', 'sr_Cyrl', 'es', 'ru', 'id']:
            if pf.endswith(f"_{key}.js"):
                lang = key
                break
                
        # Handle _en.js explicitly if it exists
        if pf.endswith("_en.js"):
            lang = 'en'

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        pattern = search_patterns[lang]
        replacement = r'\1\n' + translations[lang]

        # Use re.subn to replace and count occurrences
        new_content, num_subs = re.subn(pattern, replacement, content)
        
        # In PBL markdown, there might be other question rules, but the python regex should match exactly the list item
        # because we escaped the text literally.
        
        if num_subs > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Restored How/Why in {filepath} ({num_subs} replacements)")
            count += num_subs

print(f"Total restorations: {count}")
