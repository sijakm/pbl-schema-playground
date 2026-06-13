const fs = require('fs');

function dump(filepath, outpath) {
    let content = fs.readFileSync(filepath, 'utf8');
    // Extract everything inside PER_LESSON_SCHEMA: { ... }
    // It is an object. We can use a regex to find the start, and then brace matching to extract the string.
    let startStr = "PER_LESSON_SCHEMA: {";
    let startIndex = content.indexOf(startStr);
    if (startIndex === -1) {
        startStr = "export const PER_LESSON_SCHEMA = {";
        startIndex = content.indexOf(startStr);
    }
    
    if (startIndex === -1) return;
    
    let objectStart = startIndex + startStr.length - 1;
    let depth = 0;
    let inStr = false;
    let escape = false;
    let endIndex = -1;
    
    for (let i = objectStart; i < content.length; i++) {
        let c = content[i];
        if (escape) {
            escape = false;
            continue;
        }
        if (c === '\\') {
            escape = true;
            continue;
        }
        if (c === '"' || c === "'") {
            inStr = !inStr;
            continue;
        }
        if (!inStr) {
            if (c === '{') depth++;
            else if (c === '}') {
                depth--;
                if (depth === 0) {
                    endIndex = i;
                    break;
                }
            }
        }
    }
    
    let objStr = content.substring(objectStart, endIndex + 1);
    
    // Evaluate objStr
    try {
        let evalStr = 'const obj = ' + objStr + '; obj;';
        let result = eval(evalStr);
        fs.writeFileSync(outpath, JSON.stringify(result, null, 2));
    } catch(e) {
        console.error(e);
    }
}

dump('direct_instructions_markdown/prompts.js', 'direct_schema.json');
dump('collaborative_markdown/prompts_collaborative.js', 'collab_schema.json');
