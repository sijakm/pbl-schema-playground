const fs = require('fs');

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

// Read Latin prompts
const latinPath = '/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/lab/prompts_sr.js';
let content = fs.readFileSync(latinPath, 'utf8');

// First replace header so it doesn't get messed up
content = content.replace('window.labPromptsSR = {', 'window.labPromptsSR_CYRL = {');

// Transliterate the entire text to Cyrillic
let cyrlContent = transliterate(content);

// 1. Revert placeholders like {{$Subject}}
cyrlContent = cyrlContent.replace(/\{\{\$.*?\}\}/g, (match) => {
  return revertCyrillic(match);
});

// 2. Revert double/triple braces placeholders like {Purpose}, {{{JsonResponse}}}
// (Removed to avoid matching JSON leaf objects in schemas; they are covered by keysToFix and regex for {{$...}})

// 3. Revert HTML tags (including attributes like style="...")
cyrlContent = cyrlContent.replace(/<[^>]+>/g, (match) => {
  return revertCyrillic(match);
});

// 4. Revert key words, JSON properties, and specific technical phrases
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
  // Common placeholders and phrases
  "UL lista", "ASSESS PRIOR KNOWLEDGE", "UNIT PLAN JSON", "Quick Check", "Say:", "DOK"
];

// Sort keys in descending order of length to avoid prefix matching issues (e.g. LabUnitPlanResponse matching UnitPlanResponse first)
keysToFix.sort((a, b) => b.length - a.length);

keysToFix.forEach(key => {
  const cyrlKey = transliterate(key);
  const regex = new RegExp(cyrlKey, 'g');
  cyrlContent = cyrlContent.replace(regex, key);
});

// Write Cyrillic prompts
const cyrlPath = '/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/lab/prompts_sr_cyrl.js';
fs.writeFileSync(cyrlPath, cyrlContent, 'utf8');
console.log('Transliteration completed successfully.');

