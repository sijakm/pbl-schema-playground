import json

with open("SharedGeneratorApi/translations.json", "r") as f:
    translations = json.load(f)

new_keys = {
    "PurposeLabel": "Purpose:"
}

for lang in translations:
    for k, v in new_keys.items():
        if k not in translations[lang]:
            translations[lang][k] = v

with open("SharedGeneratorApi/translations.json", "w") as f:
    json.dump(translations, f, indent=2, ensure_ascii=False)
