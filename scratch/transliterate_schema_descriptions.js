const fs = require('fs');
const path = require('path');

const srToCyrl = {
  // digraphs first
  "lj": "љ", "Lj": "Љ", "LJ": "Љ",
  "nj": "њ", "Nj": "Њ", "NJ": "Њ",
  "dž": "џ", "Dž": "Џ", "DŽ": "Џ",
  
  "a": "а", "b": "б", "v": "в", "g": "г", "d": "д", "đ": "ђ", "e": "е", "ž": "ж", "z": "з", "i": "и", "j": "ј", "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "r": "р", "s": "с", "t": "т", "ć": "ћ", "u": "у", "f": "ф", "h": "х", "c": "ц", "č": "ч", "š": "ш",
  "A": "А", "B": "Б", "V": "В", "G": "Г", "D": "Д", "Đ": "Ђ", "E": "Е", "Ž": "Ж", "Z": "З", "I": "И", "J": "Ј", "K": "К", "L": "Л", "M": "М", "N": "Н", "O": "О", "P": "П", "R": "Р", "S": "С", "T": "Т", "Ć": "Ћ", "U": "У", "F": "Ф", "H": "Х", "C": "Ц", "Č": "Ч", "Š": "Ш"
};

const cyrlToSr = {};
for (const key in srToCyrl) {
  cyrlToSr[srToCyrl[key]] = key;
}

function transliterate(text) {
  let res = "";
  let i = 0;
  while (i < text.length) {
    let char2 = text.substring(i, i + 2);
    let char1 = text.substring(i, i + 1);
    if (srToCyrl[char2]) {
      res += srToCyrl[char2];
      i += 2;
    } else if (srToCyrl[char1]) {
      res += srToCyrl[char1];
      i += 1;
    } else {
      res += char1;
      i += 1;
    }
  }
  return res;
}

function revertCyrillic(str) {
  return str.split("").map(c => cyrlToSr[c] || c).join("");
}

const keysToFix = [
  "STEP0_PROMPT_TEMPLATE", "PER_LESSON_PROMPT_TEMPLATE", "HTML_LESSON_PROMPT_TEMPLATE", "UNIT_COMMON_HTML_PROMPT_TEMPLATE",
  "STEP0_SCHEMA", "PER_LESSON_SCHEMA", "UnitPlanResponse", "LabUnitPlanResponse", "UnitDescription", "Description",
  "EssentialQuestions", "StudentLearningObjectives", "StandardsAligned", "KeyVocabulary", "Lessons", "lessonNumber",
  "lessonTitle", "lessonOutline", "lessonName", "lessonDescription", "AssessPriorKnowledge", "OrientationPhase", "Purpose", "Materials", "InstructionsForTeachers",
  "Instructions", "ExpectedStudentResponses", "FinalInvestigationQuestion", "Research", "AnticipatedMisconceptions",
  "Misconception", "TeacherResponse", "Hypothesize", "Experiment", "QuickCheck", "Question", "Differentiation",
  "LanguageLearners", "AdditionalScaffolding", "GoDeeper", "AccommodationsAndModifications", "GeneralSupports",
  "IndividualSupports", "Analyze", "Share", "ReviewAndSpacedRetrieval", "FormativeAssessment", "StudentPractice",
  "UnitTitle", "JsonResponse", "window.labPromptsSR", "window.labPromptsSR_CYRL",
  "title", "type", "object", "properties", "array", "string", "integer", "items", "minItems", "maxItems", "required",
  "additionalProperties", "x-removablePaths", "description", "false", "true", "null",
  "UL lista", "ASSESS PRIOR KNOWLEDGE", "UNIT PLAN JSON", "Quick Check", "Say:", "DOK"
];

// Sort keys in descending order of length to avoid prefix issues
keysToFix.sort((a, b) => b.length - a.length);

function hasCyrillic(str) {
  return /[\u0400-\u04FF]/.test(str);
}

function transliterateText(text) {
  let cyrl = transliterate(text);
  
  // Revert placeholders like {{$Subject}}
  cyrl = cyrl.replace(/\{\{\$.*?\}\}/g, (match) => {
    return revertCyrillic(match);
  });
  
  // Revert placeholders like {Purpose}
  cyrl = cyrl.replace(/\{[A-Za-z0-9_.]+\}/g, (match) => {
    return revertCyrillic(match);
  });

  // Revert technical keysToFix
  keysToFix.forEach(key => {
    const cyrlKey = transliterate(key);
    const regex = new RegExp(cyrlKey, 'g');
    cyrl = cyrl.replace(regex, key);
  });
  
  return cyrl;
}

function processFile(filePath) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    return;
  }
  
  const content = fs.readFileSync(absolutePath, 'utf8');
  const lines = content.split('\n');
  
  let inStep0Schema = false;
  let inPerLessonSchema = false;
  let modifiedCount = 0;
  
  // Match lines like: "description": "value"
  // Group 1: key prefix + opening quote
  // Group 2: string value
  // Group 3: closing quote + trailing punctuation (like comma)
  const descRegex = /^(\s*"description"\s*:\s*")([\s\S]*?)("\s*,?\s*)$/;
  
  const updatedLines = lines.map((line, index) => {
    const lineNum = index + 1;
    
    // Track if we are inside the schemas
    if (line.includes('STEP0_SCHEMA:')) {
      inStep0Schema = true;
    }
    if (line.includes('PER_LESSON_SCHEMA:')) {
      inPerLessonSchema = true;
      inStep0Schema = false;
    }
    
    // Check for end of schemas or other boundaries if needed
    // In this file, schemas are near the end. STEP0_SCHEMA ends, then PER_LESSON_SCHEMA starts.
    // The main object closes at the very end.
    
    if (inStep0Schema || inPerLessonSchema) {
      const match = line.match(descRegex);
      if (match) {
        const prefix = match[1];
        const val = match[2];
        const suffix = match[3];
        
        if (hasCyrillic(val)) {
          console.log(`Line ${lineNum}: Already in Cyrillic. Leaving unchanged.`);
          return line;
        } else {
          // If empty string, no need to transliterate
          if (val.trim() === "") {
            console.log(`Line ${lineNum}: Empty description. Leaving unchanged.`);
            return line;
          }
          
          const transliterated = transliterateText(val);
          console.log(`Line ${lineNum}: Transliterating Latin to Cyrillic.`);
          console.log(`  Before: "${val}"`);
          console.log(`  After:  "${transliterated}"`);
          modifiedCount++;
          return `${prefix}${transliterated}${suffix}`;
        }
      }
    }
    
    return line;
  });
  
  if (modifiedCount > 0) {
    fs.writeFileSync(absolutePath, updatedLines.join('\n'), 'utf8');
    console.log(`Successfully updated ${modifiedCount} description(s) in ${filePath}.`);
  } else {
    console.log(`No Latin descriptions found to update in ${filePath}.`);
  }
}

// Run the script on lab/prompts_sr_cyrl.js
const targetFile = path.join(__dirname, '../lab/prompts_sr_cyrl.js');
console.log(`Processing file: ${targetFile}`);
processFile(targetFile);
