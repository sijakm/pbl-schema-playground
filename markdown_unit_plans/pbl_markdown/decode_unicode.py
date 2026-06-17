import json
import codecs

with open("prompts_pbl.js", "r", encoding="utf-8") as f:
    content = f.read()

# Using unicode_escape codec to decode
decoded_content = codecs.decode(content.encode("utf-8"), "unicode_escape").decode("utf-8")

with open("prompts_pbl.js", "w", encoding="utf-8") as f:
    f.write(decoded_content)
