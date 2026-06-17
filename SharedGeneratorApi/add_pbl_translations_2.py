import json
import os

path = '/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/SharedGeneratorApi/translations.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_keys_en = {
  "GuidingQuestionForTeacherPlanning": "Guiding Question for Teacher Planning",
  "TeachersMayConsider": "Teachers may consider:"
}

new_keys_sr_latn = {
  "GuidingQuestionForTeacherPlanning": "Vodeće pitanje za planiranje nastavnika",
  "TeachersMayConsider": "Nastavnici mogu razmotriti:"
}

new_keys_sr_cyrl = {
  "GuidingQuestionForTeacherPlanning": "Водеће питање за планирање наставника",
  "TeachersMayConsider": "Наставници могу размотрити:"
}

new_keys_id = {
  "GuidingQuestionForTeacherPlanning": "Pertanyaan Panduan untuk Perencanaan Guru",
  "TeachersMayConsider": "Guru dapat mempertimbangkan:"
}

new_keys_es = {
  "GuidingQuestionForTeacherPlanning": "Pregunta guía para la planificación del maestro",
  "TeachersMayConsider": "Los maestros pueden considerar:"
}

new_keys_ru = {
  "GuidingQuestionForTeacherPlanning": "Наводящий вопрос для планирования учителя",
  "TeachersMayConsider": "Учителя могут рассмотреть:"
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
