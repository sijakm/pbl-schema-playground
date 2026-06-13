import json

# 1. Update translations.json
with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/SharedGeneratorApi/translations.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

additions = {
    "en": {
        "GuideQuestionGenerationTitle": "Guide Question Generation – Introduce the inquiry by prompting curiosity, not delivering content.",
        "IdentifyResearchQuestionTitle": "Identify Research Question – Help students collaboratively decide which question is most useful for investigation.",
        "CreateAnActionPlanTitle": "Create an Action Plan – Support students in designing their own investigation rather than giving them the plan."
    },
    "sr-Latn": {
        "GuideQuestionGenerationTitle": "Usmeravanje generisanja pitanja – Uvedite istraživanje podstičući radoznalost, umesto pukog prenošenja sadržaja.",
        "IdentifyResearchQuestionTitle": "Identifikovanje istraživačkog pitanja – Pomozite učenicima da zajednički odluče koje pitanje je najkorisnije za istraživanje.",
        "CreateAnActionPlanTitle": "Kreiranje akcionog plana – Podržite učenike u osmišljavanju sopstvenog istraživanja umesto da im date gotov plan."
    },
    "sr-Cyrl": {
        "GuideQuestionGenerationTitle": "Усмеравање генерисања питања – Уведите истраживање подстичући радозналост, уместо пуког преношења садржаја.",
        "IdentifyResearchQuestionTitle": "Идентификовање истраживачког питања – Помозите ученицима да заједнички одлуче које питање је најкорисније за истраживање.",
        "CreateAnActionPlanTitle": "Креирање акционог плана – Подржите ученике у осмишљавању сопственог истраживања уместо да им дате готов план."
    },
    "id": {
        "GuideQuestionGenerationTitle": "Panduan Pembuatan Pertanyaan – Perkenalkan inkuiri dengan memancing rasa ingin tahu, bukan menyampaikan materi.",
        "IdentifyResearchQuestionTitle": "Identifikasi Pertanyaan Penelitian – Bantu siswa berkolaborasi untuk memutuskan pertanyaan mana yang paling berguna untuk diselidiki.",
        "CreateAnActionPlanTitle": "Buat Rencana Aksi – Dukung siswa dalam merancang investigasi mereka sendiri daripada memberi mereka rencana yang sudah jadi."
    },
    "es": {
        "GuideQuestionGenerationTitle": "Guía para la Generación de Preguntas – Introduzca la indagación fomentando la curiosidad, no entregando contenido.",
        "IdentifyResearchQuestionTitle": "Identificar la Pregunta de Investigación – Ayude a los estudiantes a decidir colaborativamente qué pregunta es más útil para la investigación.",
        "CreateAnActionPlanTitle": "Crear un Plan de Acción – Apoye a los estudiantes en el diseño de su propia investigación en lugar de darles el plan hecho."
    },
    "ru": {
        "GuideQuestionGenerationTitle": "Руководство по созданию вопросов – Начните исследование, пробуждая любопытство, а не просто излагая материал.",
        "IdentifyResearchQuestionTitle": "Определение исследовательского вопроса – Помогите учащимся совместно решить, какой вопрос наиболее полезен для исследования.",
        "CreateAnActionPlanTitle": "Создание плана действий – Поддержите учащихся в разработке собственного исследования, а не давайте им готовый план."
    }
}

for lang, keys in additions.items():
    if lang in data:
        data[lang].update(keys)

with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/SharedGeneratorApi/translations.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)


# 2. Update prompts_inquiry.js
with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/markdown_unit_plans/inquiry_markdown/prompts_inquiry.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add x-format to GuideQuestionGeneration
content = content.replace(
'''              "GuideQuestionGeneration": {
                "type": "object",
                "properties": {''',
'''              "GuideQuestionGeneration": {
                "type": "object",
                "x-format": "**{loc.GuideQuestionGenerationTitle}**\\n\\n**{loc.Say}:** {value.Prompt}\\n\\n{loc.FacilitationMovesLabel}\\n\\n{value.FacilitationMoves}\\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {''')

# Add x-format to IdentifyResearchQuestion
content = content.replace(
'''              "IdentifyResearchQuestion": {
                "type": "object",
                "properties": {''',
'''              "IdentifyResearchQuestion": {
                "type": "object",
                "x-format": "**{loc.IdentifyResearchQuestionTitle}**\\n\\n**{loc.Say}:** {value.Prompt}\\n\\n{loc.FacilitationMovesLabel}\\n\\n{value.FacilitationMoves}\\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {''')

# Add x-format to CreateAnActionPlan
content = content.replace(
'''              "CreateAnActionPlan": {
                "type": "object",
                "properties": {''',
'''              "CreateAnActionPlan": {
                "type": "object",
                "x-format": "**{loc.CreateAnActionPlanTitle}**\\n\\n**{loc.Say}:** {value.Prompt}\\n\\n{loc.FacilitationMovesLabel}\\n\\n{value.FacilitationMoves}\\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {''')

with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/markdown_unit_plans/inquiry_markdown/prompts_inquiry.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Translations and formatting updated for Conceptualization Phase.")
