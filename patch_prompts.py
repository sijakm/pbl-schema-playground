import re

with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/markdown_unit_plans/inquiry_markdown/prompts_inquiry.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update x-format for phases to use loc.PhaseNamePurpose
phases = [
    'OrientationPhase', 'ConceptualizationPhase', 
    'InvestigationPhase', 'ConclusionPhase', 'DiscussionPhase'
]

for phase in phases:
    # replace x-format: "### {green}({loc.<phase>})\n\n**{loc.Purpose}:** {value.Purpose}..."
    # with x-format: "### {green}({loc.<phase>})\n\n{loc.<phase>Purpose}..."
    old_xformat = f'"x-format": "### {{green}}({{loc.{phase}}})\\n\\n**{{loc.Purpose}}:** {{value.Purpose}}'
    new_xformat = f'"x-format": "### {{green}}({{loc.{phase}}})\\n\\n{{loc.{phase}Purpose}}'
    content = content.replace(old_xformat, new_xformat)
    
    # Remove Purpose property definition from the phase
    # This requires careful regex or string replacement.
    # We look for "Purpose": { ... },
    if phase == 'OrientationPhase':
        content = content.replace(
'''          "Purpose": {
            "type": "string",
            "description": "Word for Word: 'Purpose: Students are introduced to a real mystery that sparks curiosity and motivates investigation. They recognize the problem and activate prior knowledge to prepare for deeper inquiry.'"
          },
''', '')
    elif phase == 'ConceptualizationPhase':
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

# Remove Purpose from required arrays
# Looking for "required": [\n          "Purpose",\n          "Materials",
content = content.replace(
'''        "required": [
          "Purpose",
          "Materials",''',
'''        "required": [
          "Materials",''')

# Add x-format to Engage
content = content.replace(
'''              "Engage": {
                "type": "object",
                "properties": {''',
'''              "Engage": {
                "type": "object",
                "x-format": "**{loc.EngageTitle}**\\n\\n**{loc.Say}:** {value.Prompt}\\n\\n{loc.FacilitationMovesLabel}\\n\\n{value.FacilitationMoves}\\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {''')

# Add x-format to Connect
content = content.replace(
'''              "Connect": {
                "type": "object",
                "properties": {''',
'''              "Connect": {
                "type": "object",
                "x-format": "**{loc.ConnectTitle}**\\n\\n**{loc.Say}:** {value.Prompt}\\n\\n{loc.FacilitationMovesLabel}\\n\\n{value.FacilitationMoves}\\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {''')

# Add x-format to Activate
content = content.replace(
'''              "Activate": {
                "type": "object",
                "properties": {''',
'''              "Activate": {
                "type": "object",
                "x-format": "**{loc.ActivateTitle}**\\n\\n**{loc.Say}:** {value.Prompt}\\n\\n{loc.FacilitationMovesLabel}\\n\\n{value.FacilitationMoves}\\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {''')

# Add x-format to Probe
content = content.replace(
'''              "Probe": {
                "type": "object",
                "properties": {''',
'''              "Probe": {
                "type": "object",
                "x-format": "**{loc.ProbeTitle}**\\n\\n**{loc.Say}:** {value.Prompt}\\n\\n{loc.FacilitationMovesLabel}\\n\\n{value.FacilitationMoves}\\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}\\n\\n{value.Closing}",
                "properties": {''')


with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/markdown_unit_plans/inquiry_markdown/prompts_inquiry.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("prompts updated")
