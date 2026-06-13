import re

with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/markdown_unit_plans/inquiry_markdown/prompts_inquiry.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace specific patterns
content = content.replace("(starting with 'Say:')", "(do NOT include the 'Say:' prefix)")
content = content.replace("('Say:')", "(do NOT include the 'Say:' prefix)")
content = content.replace("A 'Say:' statement", "A statement (do NOT include the 'Say:' prefix)")
content = content.replace("'Say:' prompt", "prompt (do NOT include the 'Say:' prefix)")
content = content.replace("'Say:' question", "question (do NOT include the 'Say:' prefix)")
content = content.replace("Include scripts starting with 'Say:' (e.g., 'Say: Take 30 seconds to look silently...').", 
                          "Include scripts (do NOT include the 'Say:' prefix, e.g., 'Take 30 seconds to look silently...').")
content = content.replace("starting with 'Say:'.", "(do NOT include the 'Say:' prefix).")
content = content.replace("use 'Say:' statements for teacher prompts", "provide direct teacher prompts without the 'Say:' prefix")
content = content.replace("E.g. 'Say: \"Before we build...\"'", "E.g. '\"Before we build...\"'")

with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/markdown_unit_plans/inquiry_markdown/prompts_inquiry.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Say prefixes removed.")
