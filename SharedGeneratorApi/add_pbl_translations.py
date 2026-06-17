import json
import os

path = '/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/SharedGeneratorApi/translations.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# The new keys to add for PBL
new_keys_en = {
  "ConceptsOrSkillsEmphasized": "Concepts or skills emphasized",
  "CollaborationAndVisibleThinking": "Collaboration & visible thinking"
}

new_keys_sr_latn = {
  "ConceptsOrSkillsEmphasized": "Istaknuti koncepti ili veštine",
  "CollaborationAndVisibleThinking": "Saradnja i vidljivo razmišljanje"
}

new_keys_sr_cyrl = {
  "ConceptsOrSkillsEmphasized": "Истакнути концепти или вештине",
  "CollaborationAndVisibleThinking": "Сарадња и видљиво размишљање"
}

new_keys_id = {
  "ConceptsOrSkillsEmphasized": "Konsep atau keterampilan yang ditekankan",
  "CollaborationAndVisibleThinking": "Kolaborasi & pemikiran yang terlihat"
}

new_keys_es = {
  "ConceptsOrSkillsEmphasized": "Conceptos o habilidades enfatizadas",
  "CollaborationAndVisibleThinking": "Colaboración y pensamiento visible"
}

new_keys_ru = {
  "ConceptsOrSkillsEmphasized": "Особое внимание уделяется концепциям или навыкам",
  "CollaborationAndVisibleThinking": "Сотрудничество и видимое мышление"
}

maps = {
  "en": new_keys_en,
  "sr-Latn": new_keys_sr_latn,
  "sr-Cyrl": new_keys_sr_cyrl,
  "id": new_keys_id,
  "es": new_keys_es,
  "ru": new_keys_ru
}

for lang, new_keys in maps.items():
    if lang in data:
        for k, v in new_keys.items():
            data[lang][k] = v

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Translations updated!")
