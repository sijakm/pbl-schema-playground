import re

with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/markdown_unit_plans/inquiry_markdown/prompts_inquiry.js', 'r', encoding='utf-8') as f:
    content = f.read()

phases = [
    'ConceptualizationPhase', 
    'InvestigationPhase', 'ConclusionPhase', 'DiscussionPhase'
]

for phase in phases:
    # 1. replace x-format: "### {green}({loc.<phase>})\n\n**{loc.Purpose}:** {value.Purpose}..."
    # with x-format: "### {green}({loc.<phase>})\n\n{loc.<phase>Purpose}..."
    old_xformat = f'"x-format": "### {{green}}({{loc.{phase}}})\\n\\n**{{loc.Purpose}}:** {{value.Purpose}}'
    new_xformat = f'"x-format": "### {{green}}({{loc.{phase}}})\\n\\n{{loc.{phase}Purpose}}'
    content = content.replace(old_xformat, new_xformat)
    
    # 2. Remove Purpose property definition from the phase
    if phase == 'ConceptualizationPhase':
        content = content.replace(
'''          "Purpose": {
            "type": "string",
            "description": "Word for word 'Purpose: Students generate meaningful research questions, select a central question to investigate, and create an action plan that will guide their inquiry process.'"
          },
''', '')
    elif phase == 'InvestigationPhase':
        content = content.replace(
'''          "Purpose": {
            "type": "string",
            "description": "Write word for word: Purpose: Students actively explore the phenomenon through observation, model analysis, and evidence collection, building a data set they will later use to form conclusions"
          },
''', '')
    elif phase == 'ConclusionPhase':
        content = content.replace(
'''          "Purpose": {
            "type": "string",
            "description": "Write word for word: Purpose: Students analyze their collected data and use evidence to answer the research question, forming a clear explanation based on their findings."
          },
''', '')
    elif phase == 'DiscussionPhase':
        content = content.replace(
'''          "Purpose": {
            "type": "string",
            "description": "Write word for word: Purpose: Help students shift from what they figured out to why it matters."
          },
''', '')

# 3. Remove Purpose from required arrays
# Because we restored it using "\n          "Purpose",\n          "Materials",", we can just string replace it out.
content = content.replace(
'''        "required": [
          "Purpose",
          "Materials",''',
'''        "required": [
          "Materials",''')


with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/markdown_unit_plans/inquiry_markdown/prompts_inquiry.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied Purpose translation to all other phases.")
