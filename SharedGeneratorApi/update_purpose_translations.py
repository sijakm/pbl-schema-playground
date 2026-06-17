import json
import os

path = '/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/SharedGeneratorApi/translations.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

purpose_texts = {
  "DrivingQuestionPurposeValue": "To provide a clear, tightly aligned focal point that anchors the unit’s core problem, directs student inquiry toward the specific knowledge and skills they must develop, and ensures that all project work—including investigation, modeling, and application—coherently contributes to answering a meaningful, real-world question.",
  "ProblemPurposeValue": "To clearly articulate a focused, high-impact real-world problem that anchors the unit, guides students toward meaningful solution development, and enables teachers to identify authentic audiences and contexts that transform the project from theoretical study into purposeful, actionable work with tangible relevance.",
  "ProjectPurposeValue": "To outline how students will actively engage with a clearly defined, locally relevant problem through a structured yet flexible project pathway that balances student choice with shared focus, ensures consistent opportunities for making thinking visible, and provides the necessary scaffolds for students to develop, refine, and implement their own evidence-based solutions.",
  "PlacePurposeValue": "To identify the specific community contexts, physical locations, and authentic audiences that will deepen student relevance, strengthen the real-world problem at the center of the unit, and inform targeted learning experiences—such as fieldwork, local partnerships, and public presentations—so that the project remains grounded in the actual place where students live, learn, and design solutions."
}

# Add these to all languages (we'll just use the English text for now as a fallback)
for lang in data.keys():
    for k, v in purpose_texts.items():
        data[lang][k] = v

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Translations updated!")
