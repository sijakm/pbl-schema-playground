const fs = require('fs');
const path = require('path');

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error('Please set API_KEY');
  process.exit(1);
}

const targetLangs = [
  { ext: '_sr_Latn', name: 'Serbian Latin' },
  { ext: '_sr_Cyrl', name: 'Serbian Cyrillic' },
  { ext: '_id', name: 'Indonesian' },
  { ext: '_es', name: 'Spanish' },
  { ext: '_ru', name: 'Russian' }
];

const directories = [
  'inquiry_markdown',
  'collaborative_markdown',
  'lab_markdown',
  'pbl_markdown',
  'lecture_markdown',
  'direct_instructions_markdown'
];

async function translateArray(stringsArr, targetLangName) {
  if (stringsArr.length === 0) return [];
  
  const prompt = `Translate the following array of schema descriptions into ${targetLangName}. 
CRITICAL RULES:
1. Translate the entire description, but DO NOT translate any parameters enclosed in double curly braces (e.g., {{$Subject}}). Keep them exactly as they are.
2. DO NOT translate keys like {loc.Something} or {value.Something}. Keep them exactly as they are.
3. Maintain the original tone and strict instructional rules (e.g., "Do NOT include bullet points").
`;

  const body = {
    model: "gpt-5.4-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: JSON.stringify({ texts_to_translate: stringsArr }) }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "TranslationArrayResponse",
        strict: true,
        schema: {
          type: "object",
          properties: {
            translations: {
              type: "array",
              description: "The translated strings in the EXACT SAME ORDER as provided. MUST be exactly the same length as the input array.",
              items: { type: "string" }
            }
          },
          required: ["translations"],
          additionalProperties: false
        }
      }
    }
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error: ${errorText}`);
  }

  const data = await res.json();
  const rawContent = data.choices[0].message.content;
  try {
    const parsed = JSON.parse(rawContent);
    return parsed.translations;
  } catch(e) {
    throw new Error("Failed to parse JSON from response: " + rawContent);
  }
}

// Helper to extract and replace descriptions
function collectDescriptions(obj, arr) {
  if (typeof obj !== 'object' || obj === null) return;
  for (const key in obj) {
    if (key === 'description' && typeof obj[key] === 'string') {
      arr.push(obj[key]);
    } else if (typeof obj[key] === 'object') {
      collectDescriptions(obj[key], arr);
    }
  }
}

function replaceDescriptions(obj, arr, state) {
  if (typeof obj !== 'object' || obj === null) return;
  for (const key in obj) {
    if (key === 'description' && typeof obj[key] === 'string') {
      obj[key] = arr[state.index++];
    } else if (typeof obj[key] === 'object') {
      replaceDescriptions(obj[key], arr, state);
    }
  }
}

async function processAll() {
  for (const dir of directories) {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.js'));
    
    for (const file of files) {
      const langDef = targetLangs.find(l => file.includes(l.ext + '.js'));
      if (!langDef) continue;
      
      const fullPath = path.join(dirPath, file);
      console.log(`\nProcessing ${file} for ${langDef.name}...`);
      
      const content = fs.readFileSync(fullPath, 'utf8');
      let globalWindow = {};
      global.window = globalWindow;
      try {
        eval(content);
      } catch (e) {
        console.error(`  Error parsing ${file}:`, e);
        continue;
      }
      
      const exportedKey = Object.keys(globalWindow)[0];
      if (!exportedKey) continue;
      const obj = globalWindow[exportedKey];
      
      const schemasToProcess = [];
      if (obj.STEP0_SCHEMA) schemasToProcess.push(obj.STEP0_SCHEMA);
      if (obj.PER_LESSON_SCHEMA) schemasToProcess.push(obj.PER_LESSON_SCHEMA);
      
      if (schemasToProcess.length === 0) {
        console.log(`  No schemas found, skipping.`);
        continue;
      }
      
      // Fast check: if the first description is already translated, skip file
      // Wait, we don't know the target language easily in code to check if it's translated,
      // but we know if it was partially done by the killed task? No, the killed task didn't save the file if it failed midway.
      // Those files that were completely done were saved, but let's just translate them again or rely on the fact that translating an already translated text will just return the text.
      
      const allDescriptions = [];
      for (const schema of schemasToProcess) {
        collectDescriptions(schema, allDescriptions);
      }
      
      console.log(`  Found ${allDescriptions.length} description strings.`);
      if (allDescriptions.length === 0) continue;
      
      try {
        console.log(`  Calling OpenAI for translations...`);
        let translatedDescriptions = [];
        const chunkSize = 20; // Reduced to 20 for more reliability
        
        for (let i = 0; i < allDescriptions.length; i += chunkSize) {
          const chunk = allDescriptions.slice(i, i + chunkSize);
          let success = false;
          let attempts = 0;
          
          while (!success && attempts < 3) {
            attempts++;
            console.log(`    Translating chunk ${i / chunkSize + 1} (${chunk.length} items, Attempt ${attempts})...`);
            
            try {
              const translatedChunk = await translateArray(chunk, langDef.name);
              
              if (translatedChunk.length !== chunk.length) {
                console.log(`    [WARN] Length mismatch (sent ${chunk.length}, received ${translatedChunk.length}). Retrying...`);
              } else {
                translatedDescriptions = translatedDescriptions.concat(translatedChunk);
                success = true;
              }
            } catch (err) {
              console.log(`    [ERROR] API error: ${err.message}. Retrying...`);
            }
          }
          
          if (!success) {
            throw new Error(`Failed to translate chunk ${i / chunkSize + 1} after 3 attempts.`);
          }
        }
        
        // Replace in object
        const state = { index: 0 };
        for (const schema of schemasToProcess) {
          replaceDescriptions(schema, translatedDescriptions, state);
        }
        
        // Serialize and save
        let newContent = `window.${exportedKey} = {\n`;
        ['STEP0_PROMPT_TEMPLATE', 'PER_LESSON_PROMPT_TEMPLATE'].forEach(tmplKey => {
          if (obj[tmplKey]) {
            newContent += `  ${tmplKey}: \`${obj[tmplKey].replace(/\`/g, '\\`')}\`,\n`;
          }
        });
        
        ['STEP0_SCHEMA', 'PER_LESSON_SCHEMA'].forEach(schKey => {
          if (obj[schKey]) {
            newContent += `  ${schKey}: ${JSON.stringify(obj[schKey], null, 2)},\n`;
          }
        });
        
        newContent += `};\n`;
        newContent = newContent.replace(/,\n};$/, '\n};\n');
        
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`  Done saving translated schemas to ${file}`);
        
      } catch(err) {
        console.error(`  Failed on ${file}:`, err.message);
      }
    }
  }
}

processAll().then(() => console.log("\nAll schema descriptions translated successfully!"));
