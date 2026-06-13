import re
import json

path = "prompts_inquiry.js"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract STEP0_SCHEMA and PER_LESSON_SCHEMA strings
step0_match = re.search(r'STEP0_SCHEMA:\s*(\{.*?\})\s*,\s*PER_LESSON_SCHEMA:', content, re.DOTALL)
per_lesson_match = re.search(r'PER_LESSON_SCHEMA:\s*(\{.*?\})\s*\}\s*;\s*$', content, re.DOTALL)

if not step0_match or not per_lesson_match:
    print("Could not parse schemas")
    exit(1)

step0_json = step0_match.group(1)
per_lesson_json = per_lesson_match.group(1)

# Hack to load JS object as JSON: we might have trailing commas or missing quotes on keys.
# Let's hope it's well-formed JSON.
try:
    step0 = json.loads(step0_json)
    per_lesson = json.loads(per_lesson_json)
except Exception as e:
    print("JSON parsing failed. JS is not strict JSON.", e)
    # We will just write the x-format manually using regex to be safe
    pass

# Safe regex approach:
# For STEP0_SCHEMA:
step0_replacements = [
    (r'"EssentialQuestions":\s*\{', r'"EssentialQuestions": {\n            "x-format": "### 💭{loc.EssentialQuestions}\\n\\n{items}",'),
    (r'"StudentLearningObjectives":\s*\{', r'"StudentLearningObjectives": {\n            "x-format": "### 🎯{loc.StudentLearningObjectives}\\n\\n{items}",'),
    (r'"StandardsAligned":\s*\{', r'"StandardsAligned": {\n            "x-format": "### 📏{loc.StandardsAligned}\\n\\n{items}",'),
    (r'"KeyVocabulary":\s*\{', r'"KeyVocabulary": {\n            "x-format": "### 🔤{loc.KeyVocabulary}\\n\\n{items}",'),
    (r'"Lessons":\s*\{', r'"Lessons": {\n        "x-format": false,'),
    # Add x-format to items
    (r'"items":\s*\{\s*"type":\s*"string"\s*\}', r'"items": { "x-format": "- {value}", "type": "string" }')
]

for old, new in step0_replacements:
    step0_json = re.sub(old, new, step0_json)

# For PER_LESSON_SCHEMA
per_lesson_replacements = [
    (r'"AssessPriorKnowledge":\s*\{\s*"type":\s*"string",', r'"AssessPriorKnowledge": {\n        "x-format": "### 💡 {loc.AssessPriorKnowledge}\\n\\n{value}",\n        "type": "string",'),
    (r'"EssentialQuestions":\s*\{', r'"EssentialQuestions": {\n        "x-format": "### 💭 {loc.EssentialQuestions}\\n\\n{items}",'),
    (r'"StudentLearningObjectives":\s*\{', r'"StudentLearningObjectives": {\n        "x-format": "### 🎯 {loc.StudentLearningObjectives}\\n\\n{items}",'),
    (r'"StandardsAligned":\s*\{', r'"StandardsAligned": {\n        "x-format": "### 📏 {loc.StandardsAligned}\\n\\n{items}",'),
    (r'"KeyVocabulary":\s*\{', r'"KeyVocabulary": {\n        "x-format": "### 🔤 {loc.KeyVocabulary}\\n\\n{items}",'),
    
    # Phase headers
    (r'"OrientationPhase":\s*\{\s*"type":\s*"object",', r'"OrientationPhase": {\n        "x-format": "### {green}({loc.OrientationPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}",\n        "type": "object",'),
    
    (r'"ConceptualizationPhase":\s*\{\s*"type":\s*"object",', r'"ConceptualizationPhase": {\n        "x-format": "### {green}({loc.ConceptualizationPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}",\n        "type": "object",'),
    
    (r'"InvestigationPhase":\s*\{\s*"type":\s*"object",', r'"InvestigationPhase": {\n        "x-format": "### {green}({loc.InvestigationPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}\\n\\n{value.AnticipatedMisconceptions}\\n\\n{value.Differentiation}\\n\\n{value.AccommodationsAndModifications}\\n\\n{value.QuickCheck}",\n        "type": "object",'),
    
    (r'"ConclusionPhase":\s*\{\s*"type":\s*"object",', r'"ConclusionPhase": {\n        "x-format": "### {green}({loc.ConclusionPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}",\n        "type": "object",'),
    
    (r'"DiscussionPhase":\s*\{\s*"type":\s*"object",', r'"DiscussionPhase": {\n        "x-format": "### {green}({loc.DiscussionPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}",\n        "type": "object",'),
    
    (r'"ReviewAndSpacedRetrieval":\s*\{\s*"type":\s*"object",', r'"ReviewAndSpacedRetrieval": {\n        "x-format": "### 🧠 {loc.ReviewAndSpacedRetrieval}\\n\\n{value.TeacherNotes}\\n\\n{value.ActiveRecall}\\n\\n{value.EssentialQuestionConnection}\\n\\n{value.SpacedRetrieval}",\n        "type": "object",'),
    
    (r'"FormativeAssessment":\s*\{\s*"type":\s*"string",', r'"FormativeAssessment": {\n        "x-format": "### ✅ {loc.FormativeAssessment}\\n\\n{value}",\n        "type": "string",'),
    
    (r'"StudentPractice":\s*\{\s*"type":\s*"object",', r'"StudentPractice": {\n        "x-format": "### 🖋️ {loc.StudentPractice}\\n\\n**{loc.TeacherNotes}:** {value.TeacherNotes}\\n\\n{value.Tasks}\\n\\n**🔎 {loc.Reflection}:**\\n\\n{value.Reflection}",\n        "type": "object",'),

    # Array formatting: Materials
    (r'"Materials":\s*\{\s*"type":\s*"array",', r'"Materials": {\n            "x-format": "{items}",\n            "type": "array",'),

    # Add general array items formatting
    (r'"items":\s*\{\s*"type":\s*"string"\s*\}', r'"items": { "x-format": "- {value}", "type": "string" }')
]

for old, new in per_lesson_replacements:
    per_lesson_json = re.sub(old, new, per_lesson_json)

# Now, replace in the main content
new_content = content[:step0_match.start(1)] + step0_json + content[step0_match.end(1):per_lesson_match.start(1)] + per_lesson_json + content[per_lesson_match.end(1):]

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Patched prompts_inquiry.js successfully.")
