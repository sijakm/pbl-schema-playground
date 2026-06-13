const fs = require('fs');

function extractSchema(filepath) {
    const content = fs.readFileSync(filepath, 'utf8');
    // Extract PER_LESSON_SCHEMA: { ... }
    // It's part of a module.exports or const. Let's just find the string.
    let startStr = "PER_LESSON_SCHEMA:";
    let startIndex = content.indexOf(startStr);
    if (startIndex === -1) {
        startStr = "export const PER_LESSON_SCHEMA =";
        startIndex = content.indexOf(startStr);
    }
    
    if (startIndex !== -1) {
        // We will just read the file, remove the 'export const ... =' and evaluate it in a context
        // But since it has other stuff, it's easier to use a regex to grab the object and JSON.parse it if it's strictly JSON,
        // but it's JS. Let's just find all "propertyName": { or propertyName: {
        const matches = [...content.matchAll(/[\"\'\s]?([a-zA-Z0-9_]+)[\"\'\s]?\s*:\s*\{/g)];
        let keys = new Set();
        for (const match of matches) {
            keys.add(match[1]);
        }
        console.log("=== " + filepath + " ===");
        console.log(Array.from(keys).join(', '));
    }
}

extractSchema('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/direct_instructions_markdown/prompts.js');
extractSchema('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/collaborative_markdown/prompts_collaborative.js');
