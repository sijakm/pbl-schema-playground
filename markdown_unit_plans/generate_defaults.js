const fs = require('fs');

const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

const englishDefaults = {
  subject: "Science",
  name: "Engineering and Innovation in Ancient Egypt",
  standards: "SC.8.N.1.1: Define a problem, conduct investigations, use appropriate reference materials, and report, display, and argue the findings of an investigation to draw conclusions. \nSC.8.P.8.4: Classify and compare substances based on physical properties. \nSC.8.P.9.2: Distinct between physical and chemical changes. \nSC.8.E.5.12: Summarize the effects of space exploration on the economy and culture of Florida. \nSS.8.A.1.2: Analyze charts, graphs, maps, photographs, and timelines; determine cause and effect.",
  userPrompt: "Use the first three days of the media shared to create 3 lessons that align with the media. You must use the same objectives that are in the media attached.",
  learningPlans: "Student Name: Abigail Nguyen \nPlan: Accommodations & Modifications \nInstruction \nx Word-to-word dictionary \nx Colored screens, changing font, changing text size, etc \nx Read aloud assignments \nx Rewording and simplification of instructions \nx Other: Sentence frames and starters \n  \nEnvironment & Setting \nx Proximity to teacher, white/interactive board, charts, posters, etc \n  \nFormative Assessments \nx Read aloud items and choices (not reading tests) \nx Word-to-word dictionary \nx Colored screens, changing font, changing text size, etc \n  \nSummative Assessments \nx Read aloud items and choices (not reading tests) \nx Word-to-word dictionary* \n  \n*Not allowed on WIDA ACCESS \n  \nStudent Name: Charles Alvarez \nPlan: Accommodations & Modifications \nPre-teach or re-teach key vocabulary or concepts \nCheck for understanding frequently and privately \nBreak tasks into smaller, manageable steps \nSpeech-to-text for writing tasks \n  \nAssessment Accommodations & Modifications \nAllow oral responses instead of written \nRe-read test questions or directions aloud \n  \nStudent Name: Emily Carter \nPlan: Accommodations & Modifications \n  \nInstruction \nx Word-to-word dictionary \nx Colored screens, changing font, changing text size, etc \nx Read aloud assignments \nx Rewording and simplification of instructions \nx Other: Sentence frames and starters \n  \nEnvironment & Setting \nx Proximity to teacher, white/interactive board, charts, posters, etc \n  \nFormative Assessments \nx Read aloud items and choices (not reading tests) \nx Word-to-word dictionary \nx Colored screens, changing font, changing text size, etc \n  \nSummative Assessments \nx Read aloud items and choices (not reading tests) \nx Word-to-word dictionary* \n  \n*Not allowed on WIDA ACCESS",
  mediaContext: "Science: Engineering and Innovation Science — Engineering and Innovation in Ancient Egypt Subject:  \n\nScience Grade Level: Middle School (Grade 8)  \n\nDuration: 5 class periods (45 minutes each)  \n\nStandards ● SC.8.N.1.1 – Scientific inquiry: define a problem, conduct investigations, analyze and evaluate results. ● SC.8.P.8.4 – Classify/compare substances based on physical properties. ● SC.8.P.9.2 – Distinguish physical vs. chemical changes. ● SC.8.E.5.12 – Summarize the effects of space exploration on the economy and culture of Florida. ● SS.8.A.1.2 – Analyze charts, graphs, maps, photographs and timelines; determine cause and effect.  \n\nObjectives ● Understand how Egyptians engineered tools and systems to manage water and construction. ● Construct and test models (shadufs, pyramids, irrigation canals, simple machines). ● Analyze stability, force distribution, and mechanical advantage. ● Compare tools and machines based on efficiency. ● Apply physical science and engineering principles to historical innovation. ● Design original inventions inspired by ancient techniques and justify scientific reasoning.  \n\nDay 1: Water Engineering – The Shaduf Challenge  \n\nMaterials: ● Wooden dowels, string, rulers ● Small plastic buckets or cups ● Water bins or containers ● Timers, measuring cups ● Clipboards for data collection ● Projector or smartboard for visuals  \n\nHook - Desert Water Challenge (15 minutes): ● Students are introduced to a scenario: “Your village must lift water from a 20-foot well to survive. You can only use ancient tools. What will you design?” ● Discuss the daily reliance on the Nile and the ingenuity behind early water engineering.  \n\nIntroduction (15 minutes): ● Provide background on ancient Egyptian irrigation systems and the shaduf—a lever based device used to raise water from the Nile. ● Show video clips from PBS Learning Media: Engineering Egypt or National Geographic: Nile River.  \n\nDirect Instruction & Demonstration (15 minutes): ● Explain the mechanics of levers (fulcrum, load, effort) and how they apply to the shaduf. Introduce variables such as arm length and counterweight size.  \n\nHands-On Activity: Build & Test a Shaduf (30 minutes) ● In teams, students construct a simple shaduf using provided materials. ● Each group tests how much water they can lift, how high, and how fast. ● Students record data on lift efficiency and make adjustments to optimize performance.  \n\nClosure and Reflection (15 minutes) Class discussion: ● What design choices made the shaduf more efficient? ● How do simple machines help solve real-world problems? ● Introduce the concept of mechanical advantage.  \n\nAssessment Students complete an annotated diagram labeling all lever components in their design and explain how mechanical advantage played a role.  \n\nDay 2: Pyramid Physics – Why They Last  \n\nMaterials: ● Foam or wooden blocks (triangles, squares, pyramids) ● Protractors and rulers ● Force diagram templates ● Images of pyramids and construction illustrations ● Poster paper or whiteboards for drawing ● Building materials (e.g., sugar cubes, cardboard, modeling clay) \n\n Hook (10 minutes): Shape Stability Test ● Using blocks, students build towers using different shapes—triangles, squares, pyramids. ● Then, they apply pressure to test stability and record which shape holds up best.  \n\nIntroduction (10 minutes): ● Show images and theories about pyramid construction from TED-Ed: Pyramid Engineering and the Smithsonian Museum. ● Discuss why the pyramid shape has endured for millennia. Direct Instruction (10 minutes): Review key scientific terms: force, gravity, load distribution, and center of mass. Introduce force diagrams and how pressure disperses in triangular vs. rectangular shapes.  \n\nHands-On Activity (45 minutes): Build & Analyze Pyramids: ● Students build small pyramid models using different materials and design techniques. ● They draw and label force diagrams showing how weight is distributed through the structure. ● Compare pyramid shapes to other unstable structures.  \n\nClosure and Reflection (15 minutes): ● Discuss: Why did the pyramid shape survive natural forces? ● How do geometry and materials affect architectural endurance? ● What modern structures borrow from ancient design?  \n\nAssessment: ● Students write a brief scientific explanation answering: “Why have pyramids stood the test of time?” ● Responses must use at least 3 scientific vocabulary terms introduced in the lesson.  \n\nDay 3: Irrigation Innovation – Water Flow Engineering  \n\nMaterials: ● Aluminum foil, sand, plastic trays ● Water pitchers or droppers ● Rulers, timers ● Clipboards and canal data logs  \n\nHook (5 min): ● Image of Nile River farmland. ● Ask: \"How would you get water from the river to your crops without pumps?\"  \n\nMini-Lesson (10 min): ● Introduce canals, basins, and sluices. ● Show diagrams of Egyptian irrigation.  \n\nDesign Lab (20 min): In teams, students sculpt canal networks in trays using foil and sand.  \n\nTesting (5 min): Pour water and time how long it takes to reach the end. Record water loss, travel time.  \n\nReflection & Share (5 min): What made some canal systems more efficient? Assessment: Annotated model sketch + flow data."
};

const languages = {
  "es": "Spanish",
  "ro": "Romanian",
  "ru": "Russian",
  "sr-Latn": "Serbian Latin (sr-Latn)",
  "sr-Cyrl": "Serbian Cyrillic (sr-Cyrl)"
};

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
  const defaults = { en: englishDefaults };
  
  for (const [langCode, langName] of Object.entries(languages)) {
    console.log(`Translating to ${langCode}...`);
    defaults[langCode] = {};
    for (const [key, value] of Object.entries(englishDefaults)) {
      console.log(`  Translating ${key}...`);
      defaults[langCode][key] = await translateText(value, langName);
    }
  }

  const fileContent = `window.APP_DEFAULTS = ${JSON.stringify(defaults, null, 2)};`;
  fs.writeFileSync('../shared/defaults.js', fileContent, 'utf-8');
  console.log("Translations saved to ../shared/defaults.js");
}

run();
