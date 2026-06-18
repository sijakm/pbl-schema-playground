const fs = require('fs');

const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

const content = fs.readFileSync('../shared/defaults.js', 'utf8');
const jsonStr = content.replace('window.APP_DEFAULTS = ', '').replace(/;\s*$/, '');
let defaults = JSON.parse(jsonStr);

delete defaults['ro'];

async function translateText(text, targetLangName) {
  const prompt = `Translate the following text to ${targetLangName}. Preserve any English names, technical terms, symbols (like 'x' for checkboxes), standard codes (like SC.8.N.1.1), and line breaks. If it's a student's name like Abigail Nguyen, do not translate it. Keep exact bullet point formatting.\n\nText to translate:\n\n${text}`;
  
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    })
  });
  
  const json = await response.json();
  if (json.choices && json.choices[0]) {
    return json.choices[0].message.content.trim();
  } else {
    throw new Error(`OpenAI Error: ${JSON.stringify(json)}`);
  }
}

async function run() {
  defaults['id'] = {};
  for (const [key, value] of Object.entries(defaults['en'])) {
    console.log(`Translating ${key}...`);
    defaults['id'][key] = await translateText(value, "Indonesian");
  }

  const fileContent = `window.APP_DEFAULTS = ${JSON.stringify(defaults, null, 2)};`;
  fs.writeFileSync('../shared/defaults.js', fileContent, 'utf-8');
  console.log("Translations saved to ../shared/defaults.js");
}

run();
