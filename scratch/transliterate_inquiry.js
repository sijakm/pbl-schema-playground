const srToCyrl = {
  "a": "а", "b": "б", "v": "в", "g": "г", "d": "д", "đ": "ђ", "e": "е", "ž": "ж", "z": "з", "i": "и", "j": "ј", "k": "к", "l": "л", "lj": "љ", "m": "м", "n": "н", "nj": "њ", "o": "о", "p": "п", "r": "р", "s": "с", "t": "т", "ć": "ћ", "u": "у", "f": "ф", "h": "х", "c": "ц", "č": "ч", "dž": "џ", "š": "ш",
  "A": "А", "B": "Б", "V": "В", "G": "Г", "D": "Д", "Đ": "Ђ", "E": "Е", "Ž": "Ж", "Z": "З", "I": "И", "J": "Ј", "K": "К", "L": "Л", "LJ": "Љ", "M": "М", "N": "Н", "NJ": "Њ", "O": "О", "P": "П", "R": "Р", "S": "С", "T": "Т", "Ć": "Ћ", "U": "У", "F": "Ф", "H": "Х", "C": "Ц", "Č": "Ч", "DŽ": "Џ", "Š": "Ш"
};

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

const fs = require('fs');
let content = fs.readFileSync('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/inquiry/prompts_sr.js', 'utf8');
content = content.replace('window.promptsSR = {', 'window.promptsSR_CYRL = {');

// We need to be careful NOT to transliterate keys or placeholders.
// A simple approach is to transliterate everything and then fix placeholders and keys.
// But placeholders like {{$Subject}} should not be touched.
// Actually, it's safer to transliterate only the values in the object, but that's hard with a raw JS file.

// Let's try a regex approach for values and text.
// Or just transliterate the whole file and then fix known non-transliterated strings.

let cyrlContent = transliterate(content);

// Fix keys and standard parts
cyrlContent = cyrlContent.replace(/\{\{\$.*?\}\}/g, (match) => {
    // Revert placeholders
    return match.replace(/а/g, 'a').replace(/б/g, 'b').replace(/в/g, 'v').replace(/г/g, 'g').replace(/д/g, 'd').replace(/ђ/g, 'đ').replace(/е/g, 'e').replace(/ж/g, 'ž').replace(/з/g, 'z').replace(/и/g, 'i').replace(/ј/g, 'j').replace(/к/g, 'k').replace(/л/g, 'l').replace(/љ/g, 'lj').replace(/м/g, 'm').replace(/н/g, 'n').replace(/њ/g, 'nj').replace(/о/g, 'o').replace(/п/g, 'p').replace(/р/g, 'r').replace(/с/g, 's').replace(/т/g, 't').replace(/ћ/g, 'ć').replace(/у/g, 'u').replace(/ф/g, 'f').replace(/х/g, 'h').replace(/ц/g, 'c').replace(/ч/g, 'č').replace(/џ/g, 'dž').replace(/ш/g, 'š')
                .replace(/А/g, 'A').replace(/Б/g, 'B').replace(/В/g, 'V').replace(/Г/g, 'G').replace(/Д/g, 'D').replace(/Ђ/g, 'Đ').replace(/Е/g, 'E').replace(/Ж/g, 'Ž').replace(/З/g, 'Z').replace(/И/g, 'I').replace(/Ј/g, 'J').replace(/К/g, 'K').replace(/Л/g, 'L').replace(/Љ/g, 'LJ').replace(/М/g, 'M').replace(/Н/g, 'N').replace(/Њ/g, 'NJ').replace(/О/g, 'O').replace(/П/g, 'P').replace(/Р/g, 'R').replace(/С/g, 'S').replace(/Т/g, 'T').replace(/Ћ/g, 'Ć').replace(/У/g, 'U').replace(/Ф/g, 'F').replace(/Х/g, 'H').replace(/Ц/g, 'C').replace(/Ч/g, 'Č').replace(/Џ/g, 'DŽ').replace(/Ш/g, 'Š');
});

// Fix common technical terms/keys
const keysToFix = [
    "window.promptsSR_CYRL",
    "STEP0_PROMPT_TEMPLATE", "PER_LESSON_PROMPT_TEMPLATE", "HTML_LESSON_PROMPT_TEMPLATE", "UNIT_COMMON_HTML_PROMPT_TEMPLATE",
    "STEP0_SCHEMA", "PER_LESSON_SCHEMA", "UnitPlanResponse", "InquiryUnitPlanResponse", "UnitDescription", "Description",
    "EssentialQuestions", "StudentLearningObjectives", "StandardsAligned", "KeyVocabulary", "Lessons", "lessonNumber",
    "lessonTitle", "lessonOutline", "AssessPriorKnowledge", "OrientationPhase", "Purpose", "Materials", "InstructionsForTeachers",
    "Engage", "Prompt", "FacilitationMoves", "PromptingOptions", "Connect", "Activate", "Probe", "Closing", "ConceptualizationPhase",
    "GuideQuestionGeneration", "IdentifyResearchQuestion", "CreateAnActionPlan", "InvestigationPhase", "LaunchInvestigation",
    "CollaborationExpectations", "CirculationPrompts", "Conceptual", "Reasoning", "Collaboration", "AnticipatedMisconceptions",
    "Misconception", "TeacherResponse", "Differentiation", "LanguageLearners", "Strategies", "SentenceStarters",
    "AdditionalScaffolding", "Checklist", "GoDeeper", "AdvancedQuestion", "ExpectedResponses", "AccommodationsAndModifications",
    "General", "IndividualSupport", "StudentName", "Plan", "item", "subItems", "QuickCheck", "Question", "ExpectedResponses",
    "ConclusionPhase", "OpeningScript", "ProbingQuestions", "WritingPrompt", "CollaborationInstruction", "Guardrail",
    "ExpectedStudentResponses", "DiscussionPhase", "TranscendentThinking", "ReviewAndSpacedRetrieval", "ActiveRecall",
    "EssentialQuestionConnection", "SpacedRetrieval", "TeacherSay", "FormativeAssessment", "StudentPractice", "Tasks", "TaskTitle",
    "Instruction", "SuccessCriteria", "Reflection", "Prompts", "UnitTitle", "UnitCommonJson", "LessonInquiryJson",
    "title", "type", "object", "properties", "array", "string", "integer", "items", "minItems", "maxItems", "required",
    "additionalProperties", "x-removablePaths", "description", "false", "true", "null", "SpacedLearningAndRetrieval"
];

// Sort keys in descending order of length to avoid prefix matching issues
keysToFix.sort((a, b) => b.length - a.length);

keysToFix.forEach(key => {
    const cyrlKey = transliterate(key);
    const regex = new RegExp(cyrlKey, 'g');
    cyrlContent = cyrlContent.replace(regex, key);
});

fs.writeFileSync('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/inquiry/prompts_sr_cyrl.js', cyrlContent);
