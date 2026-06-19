const fs = require('fs');
const path = require('path');

const dir = '/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/markdown_unit_plans/lab_markdown';

const files = fs.readdirSync(dir).filter(f => f.startsWith('prompts_lab') && f.endsWith('.js'));

const replacements = [
  {
    search: "### {green}(Question (5 min))\\n\\n**{loc.Purpose}:** Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation.\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}",
    replace: "### {green}({loc.LabQuestionTitle})\\n\\n**{loc.Purpose}:** {loc.LabQuestionPurpose}\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}"
  },
  {
    search: "### {green}(Research (5 min))\\n\\n**{loc.Purpose}:** Gather background information, vocabulary, and prior knowledge needed to understand the topic and prepare for informed investigation.\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}",
    replace: "### {green}({loc.LabResearchTitle})\\n\\n**{loc.Purpose}:** {loc.LabResearchPurpose}\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}"
  },
  {
    search: "### {green}(Hypothesize (5 min))\\n\\n**{loc.Purpose}:** Develop a testable prediction or claim based on their research and reasoning, setting a clear expectation for what they believe will happen.\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}",
    replace: "### {green}({loc.LabHypothesizeTitle})\\n\\n**{loc.Purpose}:** {loc.LabHypothesizePurpose}\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}"
  },
  {
    search: "### {green}(Experiment (20 min))\\n\\n**{loc.Purpose}:** Carry out a structured investigation- hands-on, simulated, or analytical- to test their hypothesis and gather evidence through observation or measurement.\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}",
    replace: "### {green}({loc.LabExperimentTitle})\\n\\n**{loc.Purpose}:** {loc.LabExperimentPurpose}\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}"
  },
  {
    search: "### {green}(Analyze (5 min))\\n\\n**{loc.Purpose}:** Interpret the data they collected, identify patterns, evaluate their hypothesis, and construct evidence-based conclusions.\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}",
    replace: "### {green}({loc.LabAnalyzeTitle})\\n\\n**{loc.Purpose}:** {loc.LabAnalyzePurpose}\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}"
  },
  {
    search: "### {green}(Share (5 min))\\n\\n**{loc.Purpose}:** Communicate their findings clearly to others, using evidence to explain what they discovered, why it matters, and how it contributes to deeper understanding.\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}",
    replace: "### {green}({loc.LabShareTitle})\\n\\n**{loc.Purpose}:** {loc.LabSharePurpose}\\n\\n{value.Materials}\\n\\n{value.InstructionsForTeachers}"
  }
];

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  replacements.forEach(({ search, replace }) => {
    if (content.includes(search)) {
      content = content.replace(search, replace);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${f}`);
  }
});
