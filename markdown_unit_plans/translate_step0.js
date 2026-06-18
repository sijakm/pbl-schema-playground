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

async function translateText(text, targetLangName) {
  const prompt = `Translate the following educational prompt template into ${targetLangName}. 
CRITICAL RULES:
1. DO NOT translate any parameters enclosed in double curly braces (e.g., {{$Subject}}, {{$Name}}). Keep them exactly as they are.
2. Maintain the original tone and instructions.

Text to translate:
${text}
`;

  const body = {
    model: "gpt-5.4-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "TranslationResponse",
        strict: true,
        schema: {
          type: "object",
          properties: {
            translated_string: {
              type: "string",
              description: "The translated string with placeholders perfectly preserved."
            }
          },
          required: ["translated_string"],
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
    return parsed.translated_string;
  } catch(e) {
    throw new Error("Failed to parse JSON from response: " + rawContent);
  }
}

async function processAll() {
  for (const dir of directories) {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) continue;
    
    // Find all js files in this directory
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.js'));
    
    for (const file of files) {
      const langDef = targetLangs.find(l => file.includes(l.ext + '.js'));
      if (!langDef) continue; // Skip english or unknown
      
      const fullPath = path.join(dirPath, file);
      console.log(`Processing ${file} for ${langDef.name}...`);
      
      const content = fs.readFileSync(fullPath, 'utf8');
      
      let globalWindow = {};
      global.window = globalWindow;
      try {
        eval(content);
      } catch (e) {
        console.error(`Error parsing ${file}:`, e);
        continue;
      }
      
      const exportedKey = Object.keys(globalWindow)[0];
      if (!exportedKey) continue;
      
      const obj = globalWindow[exportedKey];
      if (!obj.STEP0_PROMPT_TEMPLATE) {
        console.log(`  No STEP0_PROMPT_TEMPLATE found, skipping.`);
        continue;
      }
      
      // Look up English file to get original string, or just use current (since it is 1/1 copied)
      const textToTranslate = obj.STEP0_PROMPT_TEMPLATE;
      
      try {
        console.log(`  Calling OpenAI...`);
        const translatedText = await translateText(textToTranslate, langDef.name);
        
        // Re-serialize
        let newContent = `window.${exportedKey} = {\n`;
        
        ['STEP0_PROMPT_TEMPLATE', 'PER_LESSON_PROMPT_TEMPLATE'].forEach(tmplKey => {
          if (obj[tmplKey]) {
            let stringVal = tmplKey === 'STEP0_PROMPT_TEMPLATE' ? translatedText : obj[tmplKey];
            newContent += `  ${tmplKey}: \`${stringVal.replace(/\`/g, '\\`')}\`,\n`;
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
        console.log(`  Done writing translated STEP0 to ${file}`);
        
      } catch(err) {
        console.error(`  Failed on ${file}:`, err.message);
      }
    }
  }
}

processAll().then(() => console.log("All finished!"));
