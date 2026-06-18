const fs = require('fs');
const path = require('path');

const targetLangs = ['sr-Latn', 'sr-Cyrl', 'id', 'es', 'ru'];

// The JS files we want to process
const sourceFiles = [
  'inquiry_markdown/prompts_inquiry.js',
  'collaborative_markdown/prompts_collaborative.js',
  'lab_markdown/prompts_lab.js',
  'pbl_markdown/prompts_pbl.js',
  'lecture_markdown/prompts_lecture.js',
  'direct_instructions_markdown/prompts.js'
];

// Load the dictionary (we will map english strings to translated strings here)
// For now, let's assume we have a dictionary file `translation_dict.json` 
// Format: { "English String": { "sr-Latn": "...", "es": "..." } }
let translationDict = {};
if (fs.existsSync('translation_dict.json')) {
  translationDict = JSON.parse(fs.readFileSync('translation_dict.json', 'utf8'));
}

function processFile(relPath) {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) return;
  
  const content = fs.readFileSync(fullPath, 'utf8');
  let globalWindow = {};
  global.window = globalWindow;
  
  try {
    eval(content);
  } catch (e) {
    console.error(`Error parsing ${relPath}:`, e);
    return;
  }
  
  const exportedKey = Object.keys(globalWindow)[0];
  if (!exportedKey) return;
  const originalObj = globalWindow[exportedKey];
  
  targetLangs.forEach(lang => {
    // Deep clone the original object
    const translatedObj = JSON.parse(JSON.stringify(originalObj));
    
    // Function to traverse and translate
    function translateNode(node) {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) {
        node.forEach(translateNode);
      } else {
        for (let k in node) {
          if (k === 'description' && typeof node[k] === 'string') {
            const eng = node[k];
            if (translationDict[eng] && translationDict[eng][lang]) {
              node[k] = translationDict[eng][lang];
            }
          }
          translateNode(node[k]);
        }
      }
    }
    
    translateNode(translatedObj);
    
    // Also translate the big prompt templates
    ['STEP0_PROMPT_TEMPLATE', 'PER_LESSON_PROMPT_TEMPLATE'].forEach(tmplKey => {
      if (translatedObj[tmplKey]) {
        const eng = translatedObj[tmplKey];
        if (translationDict[eng] && translationDict[eng][lang]) {
          translatedObj[tmplKey] = translationDict[eng][lang];
        }
      }
    });
    
    // Generate the new file
    const newExportedKey = exportedKey.replace(/EN$/, '') + lang.replace('-', '');
    
    // Serialize object back to JS string
    let newContent = `window.${newExportedKey} = {\n`;
    
    // Template strings
    ['STEP0_PROMPT_TEMPLATE', 'PER_LESSON_PROMPT_TEMPLATE'].forEach(tmplKey => {
      if (translatedObj[tmplKey]) {
        newContent += `  ${tmplKey}: \`${translatedObj[tmplKey].replace(/\`/g, '\\`')}\`,\n`;
      }
    });
    
    // Schemas
    ['STEP0_SCHEMA', 'PER_LESSON_SCHEMA'].forEach(schKey => {
      if (translatedObj[schKey]) {
        newContent += `  ${schKey}: ${JSON.stringify(translatedObj[schKey], null, 2)},\n`;
      }
    });
    
    newContent += `};\n`;
    
    // Clean up trailing comma
    newContent = newContent.replace(/,\n};$/, '\n};\n');
    
    // Determine new file name
    const dir = path.dirname(fullPath);
    const ext = path.extname(fullPath);
    const base = path.basename(fullPath, ext);
    let langSuffix = lang;
    if (lang === 'sr-Latn') langSuffix = 'sr_Latn';
    if (lang === 'sr-Cyrl') langSuffix = 'sr_Cyrl';
    
    const newFileName = `${base}_${langSuffix}${ext}`;
    const newFullPath = path.join(dir, newFileName);
    
    fs.writeFileSync(newFullPath, newContent, 'utf8');
    console.log(`Created ${newFullPath}`);
  });
}

sourceFiles.forEach(processFile);
console.log('All files processed.');
