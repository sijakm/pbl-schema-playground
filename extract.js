const fs = require('fs');
const path = require('path');

const files = [
  'markdown_unit_plans/inquiry_markdown/prompts_inquiry.js',
  'markdown_unit_plans/collaborative_markdown/prompts_collaborative.js',
  'markdown_unit_plans/lab_markdown/prompts_lab.js',
  'markdown_unit_plans/pbl_markdown/prompts_pbl.js',
  'markdown_unit_plans/lecture_markdown/prompts_lecture.js',
  'markdown_unit_plans/direct_instructions_markdown/prompts.js'
];

let globalWindow = {};
global.window = globalWindow;

const allStrings = new Set();

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  try {
    eval(content);
  } catch (e) {
    console.error(`Error evaluating ${f}:`, e);
  }
});

function extractDescriptions(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach(extractDescriptions);
  } else {
    for (let key in obj) {
      if (key === 'description' && typeof obj[key] === 'string') {
        allStrings.add(obj[key]);
      }
      extractDescriptions(obj[key]);
    }
  }
}

for (let key in globalWindow) {
  const fileObj = globalWindow[key];
  if (fileObj.STEP0_PROMPT_TEMPLATE) allStrings.add(fileObj.STEP0_PROMPT_TEMPLATE);
  if (fileObj.PER_LESSON_PROMPT_TEMPLATE) allStrings.add(fileObj.PER_LESSON_PROMPT_TEMPLATE);
  if (fileObj.STEP0_SCHEMA) extractDescriptions(fileObj.STEP0_SCHEMA);
  if (fileObj.PER_LESSON_SCHEMA) extractDescriptions(fileObj.PER_LESSON_SCHEMA);
}

fs.writeFileSync('english_strings.json', JSON.stringify(Array.from(allStrings), null, 2));
console.log(`Extracted ${allStrings.size} unique strings to english_strings.json`);
