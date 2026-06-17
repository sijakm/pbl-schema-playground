import json
import os

path = '/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/SharedGeneratorApi/translations.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_keys_en = {
    "AlignedAssessmentEvidenceAndCriteriaForSuccess": "Aligned Assessment/Evidence & Criteria for Success",
    "AlignedAssessmentPurposeValue": "To ensure that all assessments and success criteria are intentionally and transparently aligned with the unit's learning objectives, providing accurate measures of student understanding while creating opportunities for students to coconstruct criteria with the teacher—thereby increasing clarity, ownership, and self-regulation as they work toward high-quality, standards-based outcomes.",
    "FormativeAssessmentRubric": "Formative Assessment Rubric",
    "StudentLearningObjective": "Student Learning Objective",
    "SuccessCriteria": "Success Criteria",
    "PointOfDemonstration": "Point of Demonstration",
    "Criterion": "Criterion",
    "Novice": "Novice",
    "Apprentice": "Apprentice",
    "Practitioner": "Practitioner",
    "Expert": "Expert",
    "AuthenticAudiencePurposeValue": "To identify and engage an authentic audience beyond the classroom that deepens the relevance and real-world impact of student work, while empowering students to participate in selecting stakeholders, experts, or community members whose involvement enhances ownership, motivation, and the quality of final deliverables.",
    "StudentParticipationInAudienceSelection": "Student Participation in Audience Selection"
}

# For other languages, I will just use the English ones for now, or just leave them to fallback to EN. 
# But let's copy them to all languages so they exist.
for lang in data.keys():
    for k, v in new_keys_en.items():
        if k not in data[lang]:
            data[lang][k] = v

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Assessment translations added successfully.")
