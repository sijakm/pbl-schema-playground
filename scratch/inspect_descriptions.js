const fs = require('fs');

const cyrlFile = '/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/lab/prompts_sr_cyrl.js';
const content = fs.readFileSync(cyrlFile, 'utf8');

// Mock window to run the file
const window = {};
eval(content);

const prompts = window.labPromptsSR_CYRL;

function hasCyrillic(str) {
  return /[\u0400-\u04FF]/.test(str);
}

function findDescriptions(obj, path = '') {
  const results = [];
  if (typeof obj !== 'object' || obj === null) return results;

  for (const key in obj) {
    const currentPath = path ? `${path}.${key}` : key;
    if (key === 'description' && typeof obj[key] === 'string') {
      results.push({
        path: currentPath,
        value: obj[key],
        isCyrillic: hasCyrillic(obj[key])
      });
    } else if (typeof obj[key] === 'object') {
      results.push(...findDescriptions(obj[key], currentPath));
    }
  }
  return results;
}

console.log('--- STEP0_SCHEMA (Latin only) ---');
const step0Descs = findDescriptions(prompts.STEP0_SCHEMA);
step0Descs.forEach(d => {
  if (!d.isCyrillic) {
    console.log(`Path: ${d.path}`);
    console.log(`Value: "${d.value}"`);
    console.log('---------------------');
  }
});

console.log('\n--- PER_LESSON_SCHEMA (Latin only) ---');
const perLessonDescs = findDescriptions(prompts.PER_LESSON_SCHEMA);
perLessonDescs.forEach(d => {
  if (!d.isCyrillic) {
    console.log(`Path: ${d.path}`);
    console.log(`Value: "${d.value}"`);
    console.log('---------------------');
  }
});
