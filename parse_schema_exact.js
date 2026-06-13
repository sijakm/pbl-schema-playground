import fs from 'fs';

global.window = {};

async function check() {
    try {
        const collab = await import('./collaborative_markdown/prompts_collaborative.js');
        console.log("=== COLLAB ===");
        console.log(Object.keys(collab.PER_LESSON_SCHEMA.properties.LessonDescription.properties).join('\n'));
    } catch(e) { console.error("Error collab", e.message); }

    try {
        const direct = await import('./direct_instructions_markdown/prompts.js');
        console.log("=== DIRECT ===");
        console.log(Object.keys(direct.PER_LESSON_SCHEMA.properties.LessonDescription.properties).join('\n'));
    } catch(e) { console.error("Error direct", e.message); }
}

check();
