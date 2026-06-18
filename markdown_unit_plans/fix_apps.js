const fs = require('fs');
const path = require('path');

const apps = [
  'direct_instructions_markdown/src/App.jsx',
  'inquiry_markdown/src/App.jsx',
  'lab_markdown/src/App.jsx',
  'collaborative_markdown/src/App.jsx',
  'pbl_markdown/src/App.jsx'
];

for (const app of apps) {
  const p = path.join(__dirname, app);
  let content = fs.readFileSync(p, 'utf8');

  // Replace RO option and ID
  content = content.replace('<Select.Option value="ro">Română</Select.Option>', '');

  // For step 0 prompt log
  if (!content.includes('=== FIRST REQUEST (STEP 0) PROMPT ===')) {
    content = content.replace(
      /const step0Prompt = window\.utils\.fillTemplate\(p\.STEP0_PROMPT_TEMPLATE, vars\);/,
      `const step0Prompt = window.utils.fillTemplate(p.STEP0_PROMPT_TEMPLATE, vars);\n        console.log("=== FIRST REQUEST (STEP 0) PROMPT ===");\n        console.log(step0Prompt);`
    );
  }

  // For per lesson prompt log (not in pbl)
  if (app !== 'pbl_markdown/src/App.jsx') {
    if (!content.includes('=== SUBSEQUENT REQUEST (LESSON) PROMPT ===')) {
      content = content.replace(
        /const perLessonPrompt = window\.utils\.fillTemplate\(p\.PER_LESSON_PROMPT_TEMPLATE, perLessonVars\);/,
        `const perLessonPrompt = window.utils.fillTemplate(p.PER_LESSON_PROMPT_TEMPLATE, perLessonVars);\n              console.log("=== SUBSEQUENT REQUEST (LESSON) PROMPT ===");\n              console.log(perLessonPrompt);`
      );
    }
  }

  fs.writeFileSync(p, content, 'utf8');
  console.log(`Updated ${app}`);
}
