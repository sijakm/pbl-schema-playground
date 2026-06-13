import re

with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/markdown_unit_plans/inquiry_markdown/prompts_inquiry.js', 'r', encoding='utf-8') as f:
    content = f.read()

# REVERT ConceptualizationPhase
if '{loc.ConceptualizationPhasePurpose}' in content:
    content = content.replace(
        '"x-format": "### {green}({loc.ConceptualizationPhase})\\n\\n{loc.ConceptualizationPhasePurpose}',
        '"x-format": "### {green}({loc.ConceptualizationPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}'
    )
    content = content.replace(
'''      "ConceptualizationPhase": {
        "x-format": "### {green}({loc.ConceptualizationPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}",
        "type": "object",
        "description": "",
        "properties": {''',
'''      "ConceptualizationPhase": {
        "x-format": "### {green}({loc.ConceptualizationPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}",
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for word 'Purpose: Students generate meaningful research questions, select a central question to investigate, and create an action plan that will guide their inquiry process.'"
          },'''
    )
    # Add to required
    content = re.sub(
        r'("ConceptualizationPhase": \{.*?)"required": \[\s*"Materials",',
        r'\1"required": [\n          "Purpose",\n          "Materials",',
        content,
        flags=re.DOTALL
    )

# REVERT InvestigationPhase
if '{loc.InvestigationPhasePurpose}' in content:
    content = content.replace(
        '"x-format": "### {green}({loc.InvestigationPhase})\\n\\n{loc.InvestigationPhasePurpose}',
        '"x-format": "### {green}({loc.InvestigationPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}'
    )
    content = content.replace(
'''      "InvestigationPhase": {
        "x-format": "### {green}({loc.InvestigationPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}\\n\\n{value.AnticipatedMisconceptions}\\n\\n{value.Differentiation}\\n\\n{value.AccommodationsAndModifications}\\n\\n{value.QuickCheck}",
        "type": "object",
        "description": "",
        "properties": {''',
'''      "InvestigationPhase": {
        "x-format": "### {green}({loc.InvestigationPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}\\n\\n{value.AnticipatedMisconceptions}\\n\\n{value.Differentiation}\\n\\n{value.AccommodationsAndModifications}\\n\\n{value.QuickCheck}",
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Write word for word: Purpose: Students actively explore the phenomenon through observation, model analysis, and evidence collection, building a data set they will later use to form conclusions"
          },'''
    )
    # Add to required
    content = re.sub(
        r'("InvestigationPhase": \{.*?)"required": \[\s*"Materials",',
        r'\1"required": [\n          "Purpose",\n          "Materials",',
        content,
        flags=re.DOTALL
    )

# REVERT ConclusionPhase
if '{loc.ConclusionPhasePurpose}' in content:
    content = content.replace(
        '"x-format": "### {green}({loc.ConclusionPhase})\\n\\n{loc.ConclusionPhasePurpose}',
        '"x-format": "### {green}({loc.ConclusionPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}'
    )
    content = content.replace(
'''      "ConclusionPhase": {
        "x-format": "### {green}({loc.ConclusionPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}",
        "type": "object",
        "description": "",
        "properties": {''',
'''      "ConclusionPhase": {
        "x-format": "### {green}({loc.ConclusionPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}",
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Write word for word: Purpose: Students analyze their collected data and use evidence to answer the research question, forming a clear explanation based on their findings."
          },'''
    )
    # Add to required
    content = re.sub(
        r'("ConclusionPhase": \{.*?)"required": \[\s*"Materials",',
        r'\1"required": [\n          "Purpose",\n          "Materials",',
        content,
        flags=re.DOTALL
    )

# REVERT DiscussionPhase
if '{loc.DiscussionPhasePurpose}' in content:
    content = content.replace(
        '"x-format": "### {green}({loc.DiscussionPhase})\\n\\n{loc.DiscussionPhasePurpose}',
        '"x-format": "### {green}({loc.DiscussionPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}'
    )
    content = content.replace(
'''      "DiscussionPhase": {
        "x-format": "### {green}({loc.DiscussionPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}",
        "type": "object",
        "properties": {''',
'''      "DiscussionPhase": {
        "x-format": "### {green}({loc.DiscussionPhase})\\n\\n**{loc.Purpose}:** {value.Purpose}\\n\\n**📚 {loc.Materials}**\\n\\n{value.Materials}\\n\\n**📋 {loc.InstructionsForTeachers}**\\n\\n{value.InstructionsForTeachers}",
        "type": "object",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Write word for word: Purpose: Help students shift from what they figured out to why it matters."
          },'''
    )
    # Add to required
    content = re.sub(
        r'("DiscussionPhase": \{.*?)"required": \[\s*"Materials",',
        r'\1"required": [\n          "Purpose",\n          "Materials",',
        content,
        flags=re.DOTALL
    )


with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/markdown_unit_plans/inquiry_markdown/prompts_inquiry.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Reverted other phases.")
