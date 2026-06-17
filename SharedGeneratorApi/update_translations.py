import json
import os

path = '/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/SharedGeneratorApi/translations.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_keys = {
  "en": {
    "StudentEngagement": "Student Engagement",
    "Relevance": "Relevance"
  },
  "sr-Latn": {
    "StudentEngagement": "Angažovanje učenika",
    "Relevance": "Relevantnost"
  },
  "sr-Cyrl": {
    "StudentEngagement": "Ангажовање ученика",
    "Relevance": "Релевантност"
  },
  "id": {
    "StudentEngagement": "Keterlibatan Siswa",
    "Relevance": "Relevansi"
  },
  "es": {
    "StudentEngagement": "Participación del estudiante",
    "Relevance": "Relevancia"
  },
  "ru": {
    "StudentEngagement": "Вовлеченность учащихся",
    "Relevance": "Актуальность"
  }
}

for lang, keys in new_keys.items():
    if lang in data:
        for k, v in keys.items():
            data[lang][k] = v

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Translations updated!")
