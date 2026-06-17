import json

with open("SharedGeneratorApi/translations.json", "r") as f:
    translations = json.load(f)

new_keys = {
    "BigIdeasAndEssentialQuestionsAmp": "Big Ideas & Essential Questions",
    "BigIdeasPurpose": "To establish the broad, enduring concepts that anchor the unit’s learning outcomes, guide the development of essential questions and assessments, and provide students with overarching frameworks that connect all tasks, skills, and activities into meaningful, transferable understanding.",
    "BigIdeaLabel": "Big Idea:",
    "EssentialQuestionLabel": "Essential Question:",
    "StudentsWillUnderstandThatLabel": "Students will understand that...",
    "StudentsWillKnowThatLabel": "Students will know that...",
    "StudentsWillBeAbleToLabel": "Students will be able to..."
}

for lang in translations:
    for k, v in new_keys.items():
        if k not in translations[lang]:
            translations[lang][k] = v

with open("SharedGeneratorApi/translations.json", "w") as f:
    json.dump(translations, f, indent=2, ensure_ascii=False)
