import json
import os
import sys
import urllib.request
import urllib.error

# Setup your API Key
api_key = os.environ.get("API_KEY")
if not api_key:
    print("Please set the API_KEY environment variable. Usage:")
    print('API_KEY="sk-..." python3 translate_strings.py')
    sys.exit(1)

def translate_chunk_openai(chunk, api_key):
    url = "https://api.openai.com/v1/chat/completions"
    
    target_langs = ["sr-Latn (Serbian Latin)", "sr-Cyrl (Serbian Cyrillic)", "id (Indonesian)", "es (Spanish)", "ru (Russian)"]
    
    prompt = f"""
Translate the following array of English strings into {', '.join(target_langs)}.
IMPORTANT RULES:
1. Preserve all placeholders exactly as they are (e.g., {{{{$Subject}}}}, {{{{$Name}}}}). Do NOT translate them.
2. Return ONLY a valid JSON object where the keys are the original English strings.
3. The value for each key must be an object with language codes as keys ("sr-Latn", "sr-Cyrl", "id", "es", "ru") and the translated string as values.
4. Output must be raw JSON. Do not wrap in markdown ```json blocks.

Here are the strings to translate:
{json.dumps(chunk, indent=2)}
"""

    data = {
        "model": "gpt-4o",
        "messages": [
            {"role": "system", "content": "You are a professional JSON translator that exactly preserves JSON structure and template placeholders."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1
    }

    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"))
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {api_key}")

    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode("utf-8"))
            content = result["choices"][0]["message"]["content"].strip()
            
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
                
            return json.loads(content)
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode("utf-8"))
        raise e

def main():
    if not os.path.exists("english_strings.json"):
        print("english_strings.json not found. Run the extraction script first.")
        sys.exit(1)

    with open("english_strings.json", "r") as f:
        english_strings = json.load(f)

    translation_dict = {}
    if os.path.exists("translation_dict.json"):
        with open("translation_dict.json", "r") as f:
            translation_dict = json.load(f)
            
    lang_keys = ["sr-Latn", "sr-Cyrl", "id", "es", "ru"]

    chunk_size = 5
    total = len(english_strings)
    
    for i in range(0, total, chunk_size):
        chunk = english_strings[i:i+chunk_size]
        
        to_translate = []
        for eng in chunk:
            if eng not in translation_dict or len(translation_dict[eng]) < len(lang_keys):
                to_translate.append(eng)
                
        if not to_translate:
            continue
            
        print(f"Translating chunk {i//chunk_size + 1}/{(total//chunk_size) + 1} ({len(to_translate)} strings)...")
        
        try:
            translated_chunk = translate_chunk_openai(to_translate, api_key)
            for eng, translations in translated_chunk.items():
                translation_dict[eng] = translations
                
            with open("translation_dict.json", "w", encoding="utf-8") as out:
                json.dump(translation_dict, out, ensure_ascii=False, indent=2)
                
        except Exception as e:
            print("Stopping due to error. Try running the script again to resume.")
            sys.exit(1)

    print("Translation complete! Saved to translation_dict.json")
    print("Now run: node markdown_unit_plans/translate_prompts.js to generate the files.")

if __name__ == "__main__":
    main()
