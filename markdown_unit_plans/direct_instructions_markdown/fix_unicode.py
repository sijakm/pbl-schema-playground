import re

def repl(m):
    s = m.group(0)
    # python 3 encodes/decodes surrogate pairs correctly if we use 'utf-16' -> 'utf-8' but 'unicode_escape' works too?
    # Actually, in Python 3, decode('unicode_escape') on surrogate pairs returns surrogate characters, not the combined character.
    # We should encode to utf-16-le then decode.
    # Better yet, just let python's json load and dump handle it! But we want ensure_ascii=False.
    pass

import json
with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/direct_instructions_markdown/prompts.js', 'r', encoding='utf-8') as f:
    text = f.read()

# We can replace \uD83D\uDCAD manually or use a more robust way.
# Since it's just a few known emojis, we can also let a JS script do it.
