window.defaultPrompt = `
Create unit plan and inquiry lessons using info below:

Unit Subject: Earth & Space Science (Gravity & Orbits)
Unit Name: Gravity at Work: Modeling Motion in Our Solar System
Unit Description/Instruction: Students will investigate how gravity affects motion in the solar system and create a model that explains and predicts orbital motion. The final product should be a clear model (physical and/or digital) plus a short explanation for a community audience, using evidence from observations and simple data. Emphasize sensemaking, modeling, and communication.
Number of Lessons Plans to create: 1
Grade Level: The student is in the 1st grade of middle school, which consists of 4 grades total.
Duration of class period in minutes: 45
Resources/Media to use: Short NASA gravity/orbit visuals, images of the solar system, classroom manipulatives (string/balls), simple browser-based orbit simulations, chart paper, student science notebooks.
Unit Content: No attached unit text provided.

Standards (use verbatim if present):
MS-ESS1-2 Develop and use a model to describe the role of gravity in the motions within galaxies and the solar system.

Students with learning plans (use verbatim; if none, treat as empty):
Student Name: Maria Valdez
Plan: Provide a partially pre-labeled orbit map and sentence frames for explanations.

Student Name: Jacob Garrow
Plan: Allow speech-to-text for reasoning and labeling.

Student Name: Ava Lund
Plan: Supply bilingual planet labels and a visual flow chart showing Sun → Planets → Moons.

You are tasked with designing a detailed inquiry-style unit and lesson plans using cognitive science principles. 

Global Output Rules (apply to everything)

1. Follow the exact section order and headings shown below.
2. Do not add extra sections or rename headings.
3. Use clear teacher-facing prose and student-facing directions where specified.
4. Include specific examples, scripts, and expected answers (not placeholders like "e.g.").
5. Before introducing any new concept or content, include an Attention Reset activity designed to re-engage students, increase cognitive focus, and prepare working memory for new learning.
   * movement-based, sensory, or novelty-driven
   * take 20–45 seconds
   * require minimal materials
   * directly connect to the lesson’s core idea and smoothly transition students into the upcoming content.
   * Language to use: Attention Reset & Interactive Activity: This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview. (same language here for every attention reset & interactivity)
6. Include interleaving: When providing practice problems, mix strategies, content, skills rather than blocking to help students learn to know when to apply a skill.
7. Ensure transfer knowledge is embedded throughout so students can apply knowledge in various ways and under different circumstances using real-world application of skills and promoting critical thinking and problem solving.
8. Cultural Relevance & Inclusion:
   a. Incorporate multiple perspectives and reflect on the impacts for all involved.
   b. Content should connect with students from varied backgrounds and communities to create culturally relevant and culturally responsive lessons.
   c. Avoid stereotypes.

Output rule:
Return ONLY JSON that validates against the response schema.
`;


window.unitDescriptionPrompt = function (jsonText) {
    const parsed = JSON.parse(jsonText);
  
    const payload = {
      UnitTitle: parsed.UnitTitle,
      UnitDescription: parsed.UnitDescription,
      EssentialQuestions: parsed.EssentialQuestions || [],
      StudentLearningObjectives: parsed.StudentLearningObjectives || [],
      StandardsAligned: parsed.StandardsAligned || [],
      KeyVocabulary: parsed.KeyVocabulary || [],
      AssessPriorKnowledge: parsed.AssessPriorKnowledge || ""
    };
  
    return `
  You are a professional instructional HTML formatter writing for classroom teachers.
  
  You will receive a structured JSON payload representing high-level unit information.
  
  CRITICAL RULES
  - Output ONLY valid HTML.
  - Do NOT add explanations or commentary.
  - Do NOT invent content.
  - Do NOT repeat sections.
  - Allowed tags ONLY:
  <p>, <h2>, <h3>, <strong>, <em>, <span>, <ol>, <ul>, <li>
  - Lists may ONLY contain <li> as direct children.
  - NO nested lists.
  - NO <p> inside <li>.
  
  --------------------------------
  SECTION 1: UNIT DESCRIPTION
  --------------------------------
  Render using EXACT template:
  
  <h2><strong>Unit Description: {UnitTitle}</strong></h2>
  <p>{UnitDescription}</p>
  
  --------------------------------
  SECTION 2: ESSENTIAL QUESTIONS
  --------------------------------
  <h3><span>Essential Questions</span></h3>
  Render as an unordered list.
  
  --------------------------------
  SECTION 3: STUDENT LEARNING OBJECTIVES
  --------------------------------
  <h3><span>Student Learning Objectives</span></h3>
  Render as an unordered list.
  
  --------------------------------
  SECTION 4: STANDARDS ALIGNED
  --------------------------------
  <h3><span>Standards Aligned</span></h3>
  Render as an unordered list.
  
  --------------------------------
  SECTION 5: KEY VOCABULARY
  --------------------------------
  <h3><span>Key Vocabulary</span></h3>
  Render as an ordered list.
  
  --------------------------------
  SECTION 6: ASSESS PRIOR KNOWLEDGE
  --------------------------------
  ONLY render this section if AssessPriorKnowledge is NOT an empty string.
  
  HARD STRUCTURE (MUST FOLLOW EXACTLY):
  
  <h3><span>💡 Assess Prior Knowledge</span></h3>
  
  <p><strong>Purpose:</strong> Activating student's prior knowledge helps teachers uncover existing ideas, partial understandings, and misconceptions. This information supports instructional decisions and provides a foundation for sensemaking and model development throughout the unit.</p>
  
  Then render:
  
  <p><strong>Say:</strong></p>
  - One or more <p> elements synthesizing teacher talk
  - Even if "Say:" does not explicitly appear in the input
  
  Student tasks / prompts / statements:
  - Render as <ol> or <ul>
  - Each item must be ONE <li>
  - NO other tags inside <li>
  
  Expected responses:
  <p>✅ Expected Student Responses</p>
  <ul>
    <li>...</li>
  </ul>
  
  Alternate options (if present):
  <p><strong>Alternate Options:</strong></p>
  <ul>
    <li>...</li>
  </ul>
  
  --------------------------------
  INPUT JSON:
  ${JSON.stringify(payload)}
  `.trim();
  };
  

  window.buildOrientationPhasePrompt = function (jsonText) {
    const parsed = JSON.parse(jsonText);
  
    const payload = {
      Purpose: parsed.OrientationPhase.Purpose,
      Materials: parsed.OrientationPhase.Materials || [],
      InstructionsForTeachers: parsed.OrientationPhase.InstructionsForTeachers
    };

    console.log("Orientation Phase Payload:", payload);
  
    return `
  You are a professional instructional HTML formatter writing for classroom teachers.
  
  CRITICAL RULES
  - Output ONLY valid HTML.
  - Do NOT add explanations or commentary.
  - Do NOT invent content.
  - Allowed tags ONLY:
  <p>, <h3>, <strong>, <em>, <span>, <ul>, <li>
  - Lists may ONLY contain <li> as direct children.
  - NO nested lists.
  - NO <p> inside <li>.
  
  --------------------------------
  SECTION: ORIENTATION PHASE – DEFINE THE PROBLEM
  --------------------------------
  
  <h3><span>Orientation Phase – Define the Problem</span></h3>
  
  <p><strong>Purpose:</strong> Students are introduced to a real mystery that sparks curiosity and motivates investigation. They recognize the problem and activate prior knowledge to prepare for deeper inquiry.</p>
  
  <p><strong>Materials:</strong></p>
  <ul>
  ${payload.Materials.map(m => `<li>${m}</li>`).join("")}
  </ul>
  
  <p><strong>Instructions for Teachers</strong></p>
  
  <p><strong>Engage – Introduce the phenomenon in a way that sparks curiosity without explaining it.</strong></p>
  <ul>
  <li>Say: Invite students to closely observe the visual phenomenon and share what they notice without offering explanations.</li>
  <li>Prompt observation with questions such as: What stands out to you? What seems surprising or worth investigating?</li>
  <li>Display or project the core visual related to the phenomenon.</li>
  <li>Facilitation move: Invite quiet observation before discussion.</li>
  <li>Facilitation move: Ask open noticing questions such as “What patterns or motions stand out to you?” and “What makes you say that?”</li>
  <li>Record student observations publicly without confirming or correcting.</li>
  </ul>
  
  <p><strong>Connect – Help students link their observations to the broader mystery that will anchor the investigation.</strong></p>
  <ul>
  <li>Say: Ask students what questions are forming based on their observations.</li>
  <li>Prompt wondering with questions such as: What do you wonder about how this works? What seems unclear or puzzling?</li>
  <li>Point to specific parts of the visual when students reference details.</li>
  <li>Facilitation move: Encourage students to generate multiple possible questions.</li>
  <li>Facilitation move: Prompt reasoning with “What might be influencing what you’re seeing?”</li>
  <li>Cluster similar student questions to highlight emerging themes.</li>
  </ul>
  
  <p><strong>Activate – Shift students into collaborative sensemaking.</strong></p>
  <ul>
  <li>Say: Turn students to a partner or small group to discuss initial ideas or hypotheses.</li>
  <li>Prompt students to support ideas using evidence from the visual or observations.</li>
  <li>Facilitation move: Encourage students to reference the model or image directly.</li>
  <li>Facilitation move: Circulate and ask guiding questions such as “What evidence supports your idea?” and “What might help refine your thinking?”</li>
  <li>Invite a few groups to share different hypotheses without evaluating them.</li>
  <li>Expected student responses may include ideas about forces, motion, balance, or multiple factors acting together.</li>
  </ul>
  
  <p><strong>Probe – Encourage refinement of thinking by pushing students to examine assumptions.</strong></p>
  <ul>
  <li>Say: Reference a common student idea and ask what might cause that outcome.</li>
  <li>Ask probing questions such as: What makes a path curve instead of going straight?</li>
  <li>Facilitation move: Challenge assumptions with “What would happen if that force disappeared?”</li>
  <li>Encourage modeling gestures to show predicted motion or change.</li>
  <li>Prompt evidence-based reasoning by asking what in the visual supports their idea.</li>
  <li>Expected student responses may include ideas about forces pulling, motion continuing, or changes in direction.</li>
  </ul>
  
  --------------------------------
  INPUT JSON:
  ${JSON.stringify(payload)}
  `.trim();
  };

  window.buildConceptualizationPhase = function (jsonText) {
    const parsed = JSON.parse(jsonText);
  
    const payload = {
      Purpose: parsed.ConceptualizationPhase.Purpose,
      Materials: parsed.ConceptualizationPhase.Materials || [],
      InstructionsForTeachers: parsed.ConceptualizationPhase.InstructionsForTeachers
    };
  
    console.log("Conceptualization Phase Payload:", payload);
  
    return `
  You are a professional instructional HTML formatter writing for classroom teachers.
  
  CRITICAL RULES
  - Output ONLY valid HTML.
  - Do NOT add explanations or commentary.
  - Do NOT invent content.
  - Allowed tags ONLY:
  <p>, <h3>, <strong>, <em>, <span>, <ul>, <li>
  - Lists may ONLY contain <li> as direct children.
  - NO nested lists.
  - NO <p> inside <li>.
  
  --------------------------------
  SECTION: CONCEPTUALIZATION PHASE – RESEARCH QUESTION + ACTION PLAN
  --------------------------------
  
  <h3>
    <span style="color: rgb(115, 191, 39);">
      Conceptualization Phase – Research Question + Action Plan (10 min)
    </span>
  </h3>
  
  <p><strong>Purpose:</strong> Students generate meaningful research questions, select a central question to investigate, and create an action plan that will guide their inquiry process.</p>
  
  <p><strong>Materials:</strong></p>
  <ul>
  ${payload.Materials.map(m => `<li>${m}</li>`).join("")}
  </ul>
  
  <p><strong>Instructions for Teachers</strong></p>
  
  <p><strong>Guide Question Generation – Introduce the inquiry by prompting curiosity, not delivering content.</strong></p>
  <ul>
  <li>Say: Explain that scientists begin investigations by asking questions that help them make sense of what they observe.</li>
  <li>Invite students to examine the phenomenon and brainstorm as many questions as possible.</li>
  <li>Prompt question generation with open-ended cues such as: What are you wondering? What seems interesting, surprising, or puzzling?</li>
  <li>Record all student-generated questions publicly without judging, ranking, or refining them yet.</li>
  <li>Facilitation move: Encourage volume and variety of questions to surface student curiosity.</li>
  </ul>
  
  <p><strong>Identify Research Question – Help students collaboratively decide which question is most useful for investigation.</strong></p>
  <ul>
  <li>Say: Ask students to review the list of questions and consider which ones would help them understand the core problem more deeply.</li>
  <li>Support students in sorting questions into categories such as cause, effect, mechanism, prediction, or evidence.</li>
  <li>Facilitation move: Ask which questions could be explored using models, data, or observations.</li>
  <li>Guide students to discuss and nominate a strong candidate research question.</li>
  <li>Teacher charts and confirms the final class research question without evaluating correctness.</li>
  </ul>
  
  <p><strong>Create an Action Plan – Support students in designing their own investigation rather than giving them the plan.</strong></p>
  <ul>
  <li>Say: Explain that scientists design an action plan before collecting evidence.</li>
  <li>Prompt students to decide what they will observe during the investigation.</li>
  <li>Guide students to identify what they will test or compare.</li>
  <li>Ask students to clarify what evidence they need to collect to answer their research question.</li>
  <li>Encourage students to document thinking, track evidence, and revise ideas as their investigation unfolds.</li>
  </ul>
  
  --------------------------------
  INPUT JSON:
  ${JSON.stringify(payload)}
  `.trim();
  };
  
  
  window.buildInvestigationPhasePrompt = function (jsonText) {
    const parsed = JSON.parse(jsonText);
  
    const payload = {
      Purpose: parsed["Investigation Phase"].Purpose,
      Materials: parsed["Investigation Phase"].Materials || [],
      InstructionsForTeachers: parsed["Investigation Phase"].InstructionsForTeachers,
      AnticipatedMisconceptions: parsed["Investigation Phase"].AnticipatedMisconceptions,
      Differentiation: parsed["Investigation Phase"].Differentiation,
      Accommodations: parsed["Investigation Phase"].AccommodationsAndModifications,
      QuickCheck: parsed["Investigation Phase"].QuickCheck
    };
  
    console.log("Investigation Phase Payload:", payload);
  
    return `
  You are a professional instructional HTML formatter writing for classroom teachers.
  
  CRITICAL RULES
  - Output ONLY valid HTML
  - Do NOT add explanations or commentary
  - Do NOT invent instructional ideas
  - Allowed tags ONLY:
  <p>, <h3>, <strong>, <em>, <span>, <ul>, <li>
  - Lists may ONLY contain <li> as direct children
  - NO nested lists
  - NO <p> inside <li>
  
  --------------------------------
  SECTION: INVESTIGATION PHASE
  --------------------------------
  
  <h3>
    <span style="color: rgb(115, 191, 39);">
      Investigation Phase – Explore + Research + Experiment + Collect Data (15 min)
    </span>
  </h3>
  
  <p><strong>Purpose:</strong> Students actively explore the phenomenon through observation, model analysis, and evidence collection, building a data set they will later use to form conclusions.</p>
  
  <p><strong>Materials:</strong></p>
  <ul>
  ${payload.Materials.map(m => `<li>${m}</li>`).join("")}
  </ul>
  
  <p><strong>Instructions for Teachers</strong></p>
  
  <p><strong>Launch the Investigation – Introduce the task without explaining content.</strong></p>
  <ul>
  <li>Say: Position students as investigators and explain that their role is to explore the model and gather evidence.</li>
  <li>Display or distribute the investigation materials and reference model.</li>
  <li>Prompt students to look for anything that does not match expectations or reference examples.</li>
  <li>Emphasize that errors or mismatches are clues meant to spark thinking.</li>
  </ul>
  
  <p><strong>Collaboration Expectations – Establish shared responsibility.</strong></p>
  <ul>
  <li>Frame the investigation as interdependent work where every student contributes.</li>
  <li>Require students to identify inaccuracies or mismatches in the model.</li>
  <li>Direct students to record observations and evidence in a structured data table.</li>
  <li>Have students compare their findings to a reference example and justify claims using evidence.</li>
  <li>Encourage use of sentence starters such as “I think ___ because ___.”</li>
  <li>Use participation structures (e.g., talking chips) to ensure equitable contribution.</li>
  </ul>
  
  <p><strong>Circulation Prompts – Use only while circulating.</strong></p>
  <ul>
  <li>Conceptual Prompt: What evidence tells you this part of the model is incorrect?</li>
  <li>Conceptual Prompt: How does gravity help explain what you are observing?</li>
  <li>Reasoning Prompt: How does changing distance affect motion in this model?</li>
  <li>Reasoning Prompt: What would happen if this object had no forward motion?</li>
  <li>Collaboration Prompt: Who has not contributed yet, and how will you include them?</li>
  </ul>
  
  <p><strong>Anticipated Misconceptions</strong></p>
  <ul>
  <li>${payload.AnticipatedMisconceptions}</li>
  </ul>
  
  <p><strong>Differentiation</strong></p>
  <ul>
  <li>${payload.Differentiation}</li>
  </ul>
  
  <p><strong>Accommodations & Modifications</strong></p>
  
  <p><strong>General Supports:</strong></p>
  <ul>
  <li>${payload.Accommodations.General}</li>
  </ul>
  
  <p><strong>Individual Supports:</strong></p>
  <ul>
  ${payload.Accommodations.IndividualSupport.map(
    s => `<li><strong>${s.StudentName}:</strong> ${s.Plan}</li>`
  ).join("")}
  </ul>
  
  <p><strong>Quick Check</strong></p>
  <ul>
  <li>${payload.QuickCheck}</li>
  </ul>
  
  --------------------------------
  INPUT JSON:
  ${JSON.stringify(payload)}
  `.trim();
  };
  
  
  window.buildConclusionPhasePrompt = function (jsonText) {
    const parsed = JSON.parse(jsonText);
  
    const payload = {
      Purpose: parsed.ConclusionPhase.Purpose,
      Materials: parsed.ConclusionPhase.Materials || [],
      InstructionsForTeachers: parsed.ConclusionPhase.InstructionsForTeachers
    };
  
    console.log("Conclusion Phase Payload:", payload);
  
    return `
  You are a professional instructional HTML formatter writing for classroom teachers.
  
  CRITICAL RULES
  - Output ONLY valid HTML
  - Do NOT add explanations or commentary
  - Do NOT invent content
  - Allowed tags ONLY:
  <p>, <h3>, <strong>, <em>, <span>, <ul>, <li>
  - Lists may ONLY contain <li> as direct children
  - NO nested lists
  - NO <p> inside <li>
  
  --------------------------------
  SECTION: CONCLUSION PHASE
  --------------------------------
  
  <h3>
    <span style="color: rgb(115, 191, 39);">
      Conclusion Phase – Analyze Findings + Answer Research Question (5 min)
    </span>
  </h3>
  
  <p><strong>Purpose:</strong> Students analyze their collected data and use evidence to answer the research question, forming a clear explanation based on their findings.</p>
  
  <p><strong>Materials:</strong></p>
  <ul>
  ${payload.Materials.map(m => `<li>${m}</li>`).join("")}
  </ul>
  
  <p><strong>Instructions for Teachers</strong></p>
  
  <ul>
  <li>Say: Invite students to revisit the research question and consider how their collected evidence helps answer it.</li>
  <li>Say: Prompt students to review their notes and data and identify patterns they notice across observations.</li>
  <li>Encourage students to discuss emerging ideas in small groups and compare explanations.</li>
  <li>Say: Ask students to justify ideas by responding to prompts such as “What evidence supports this idea?”</li>
  <li>Guide students to refine explanations through peer discussion without confirming or correcting ideas.</li>
  <li>Say: Instruct students to write an explanation independently, using evidence to support each claim.</li>
  <li>Have students share their written explanation with a partner or small group.</li>
  </ul>
  
  <p><strong>Expected Student Responses</strong></p>
  <ul>
  <li>References to specific observations or data points as evidence.</li>
  <li>Claims that are supported by patterns noticed across the investigation.</li>
  <li>Explanations that connect evidence to conclusions.</li>
  <li>Use of reasoning language such as “because,” “this shows,” or “based on our data.”</li>
  </ul>
  
  --------------------------------
  INPUT JSON:
  ${JSON.stringify(payload)}
  `.trim();
  };
  
  window.buildDiscussionPhasePrompt = function (jsonText) {
    const parsed = JSON.parse(jsonText);
  
    const payload = {
      Purpose: parsed.DiscussionPhase.Purpose,
      Materials: parsed.DiscussionPhase.Materials || [],
      InstructionsForTeachers: parsed.DiscussionPhase.InstructionsForTeachers,
      TranscendentThinking: parsed.DiscussionPhase.TranscendentThinking
    };
  
    console.log("Discussion Phase Payload:", payload);
  
    return `
  You are a professional instructional HTML formatter writing for classroom teachers.
  
  CRITICAL RULES
  - Output ONLY valid HTML
  - Do NOT add explanations or commentary
  - Do NOT invent content
  - Allowed tags ONLY:
  <p>, <h3>, <strong>, <em>, <span>, <ul>, <li>
  - Lists may ONLY contain <li> as direct children
  - NO nested lists
  - NO <p> inside <li>
  
  --------------------------------
  SECTION: DISCUSSION PHASE
  --------------------------------
  
  <h3>
    <span style="color: rgb(115, 191, 39);">
      Discussion Phase – Implications + Meaning + Future Use (5 min)
    </span>
  </h3>
  
  <p><strong>Purpose:</strong> Help students shift from what they figured out to why it matters.</p>
  
  <p><strong>Materials:</strong></p>
  <ul>
  ${payload.Materials.map(m => `<li>${m}</li>`).join("")}
  </ul>
  
  <p><strong>Instructions for Teachers</strong></p>
  <ul>
  <li>Say: Prompt students to move beyond restating findings and begin explaining why their new understanding matters.</li>
  <li>Facilitate partner or small-group discussion focused on applying learning to broader situations or future contexts.</li>
  <li>Use prompts that encourage students to extend their reasoning into real-world or future-oriented scenarios.</li>
  <li>Guide discussion with questions that push application, such as how this understanding could inform decisions or solve problems.</li>
  <li>Support meaning-making by helping students generate their own examples rather than providing examples for them.</li>
  <li>Circulate to listen, ask follow-up questions, and prompt students to justify ideas using evidence from the investigation.</li>
  </ul>
  
  <p><strong>Expected Student Responses</strong></p>
  <ul>
  <li>Students describe how their understanding could apply beyond the immediate investigation.</li>
  <li>Students connect findings to real-world decisions, future scenarios, or broader ideas.</li>
  <li>Students explain why the learning matters using evidence from their work.</li>
  <li>Students propose implications or consequences based on their new understanding.</li>
  </ul>
  
  <p><strong>Transcendent Thinking</strong></p>
  <ul>
  <li>Say: Invite students to reflect on how this understanding connects to larger purposes, future challenges, or meaningful real-world applications.</li>
  <li>Prompt students to write or share one sentence explaining why this learning matters beyond the classroom.</li>
  <li>Expected responses highlight long-term impact, relevance to future decisions, or connections to larger systems or ideas.</li>
  </ul>
  
  --------------------------------
  INPUT JSON:
  ${JSON.stringify(payload)}
  `.trim();
  };
  

  window.buildReviewAndSpacedRetrievalPrompt = function (jsonText) {
    const parsed = JSON.parse(jsonText);
  
    const payload = {
      Materials: parsed.ReviewAndSpacedRetrieval.Materials || [],
      InstructionsForTeachers: parsed.ReviewAndSpacedRetrieval.InstructionsForTeachers
    };
  
    console.log("Review & Spaced Retrieval Payload:", payload);
  
    return `
  You are a professional instructional writer creating teacher-facing classroom materials.
  
  CRITICAL RULES
  - Output ONLY plain text.
  - Do NOT use HTML.
  - Do NOT add explanations or commentary.
  - Do NOT invent content beyond the provided structure.
  - Use clear section labels and teacher-facing language.
  - ALL teacher prompts MUST begin with "Say:".
  - ALL Expected Student Responses must be clearly labeled and include 2–3 examples.
  
  --------------------------------
  SECTION: REVIEW & SPACED RETRIEVAL (5 MIN)
  --------------------------------
  
  Materials:
  ${payload.Materials.length ? payload.Materials.map(m => `- ${m}`).join("\n") : "- None"}
  
  Teacher Notes:
  This brief review strengthens long-term retention through active recall and spaced retrieval. By revisiting key ideas without notes, students strengthen memory pathways and reinforce connections between today’s learning and prior concepts. The inclusion of transcendent reflection supports deeper understanding by helping students recognize why the learning matters beyond the immediate lesson and how it connects to larger ideas over time.
  
  Instructions for Teachers
  
  1. Active Recall
  Say: Before we wrap up, turn to a partner and answer this question together: ${payload.InstructionsForTeachers.ActiveRecall.Question}
  
  Expected Student Responses:
  ${payload.InstructionsForTeachers.ActiveRecall.ExpectedStudentResponses.map(r => `- ${r}`).join("\n")}
  
  2. Correct Common Misconceptions
  Say: If you hear students say ideas such as “things move only because something pushes them” or “objects stop moving when forces stop,” respond by reminding them that objects can already be in motion and that forces can change direction without stopping motion. Emphasize that correcting ideas helps strengthen understanding.
  
  3. Essential Question Connection
  Say: Think back to our unit’s essential question. How does today’s investigation help you better understand that question?
  
  Expected Student Responses:
  - Students explain how the investigation helped clarify a larger pattern or relationship.
  - Students connect today’s learning to a broader system or recurring idea.
  - Students describe how evidence helped them understand the essential question more clearly.
  
  4. Transcendent Thinking
  Say: Take 30 seconds to think silently, then share: Why does this learning matter outside of science class? How might this understanding shape future decisions or discoveries?
  
  Expected Student Responses:
  - It helps people make safer or smarter real-world decisions.
  - It supports future exploration or innovation.
  - It helps explain how the world or universe works.
  
  5. Spaced Retrieval (Draws from Unit 3, Lesson 2)
  Say: ${payload.InstructionsForTeachers.SpacedRetrieval.TeacherSay}
  
  Expected Student Responses:
  ${payload.InstructionsForTeachers.SpacedRetrieval.ExpectedStudentResponses.map(r => `- ${r}`).join("\n")}
  
  --------------------------------
  INPUT JSON:
  ${JSON.stringify(payload)}
  `.trim();
  };
  

  window.buildFormativeAssessmentPrompt = function (jsonText) {
    const parsed = JSON.parse(jsonText);
  
    const payload = {
      FormativeAssessment: parsed.FormativeAssessment
    };
  
    console.log("Formative Assessment Payload:", payload);
  
    return `
  You are a professional instructional HTML formatter writing for classroom teachers.
  
  CRITICAL RULES
  - Output ONLY valid HTML.
  - Do NOT add explanations or commentary.
  - Do NOT invent content.
  - Allowed tags ONLY:
  <p>, <h3>, <strong>, <span>, <ul>, <li>
  - Lists may ONLY contain <li> as direct children.
  - NO nested lists.
  - NO <p> inside <li>.
  
  --------------------------------
  SECTION: FORMATIVE ASSESSMENT
  --------------------------------
  
  <h3><span>Formative Assessment</span></h3>
  
  <p>
  <strong>Purpose:</strong> This formative assessment checks student understanding across increasing levels of cognitive demand and provides teachers with real-time insight into student reasoning to inform next instructional steps.
  </p>
  
  <p>
  Teachers may use the prompts below during discussion, small-group work, or as a brief written check to monitor understanding and adjust instruction.
  </p>
  
  <p><strong>Prompt 1 (DOK 1):</strong></p>
  <p>{Extract and render the first DOK 1 question from the input text.}</p>
  
  <p><strong>Expected Student Responses</strong></p>
  <ul>
  <li>{Extract 1–2 expected responses for Prompt 1}</li>
  </ul>
  
  <p><strong>Prompt 2 (DOK 2):</strong></p>
  <p>{Extract and render the DOK 2 question from the input text.}</p>
  
  <p><strong>Expected Student Responses</strong></p>
  <ul>
  <li>{Extract 1–2 expected responses for Prompt 2}</li>
  </ul>
  
  <p><strong>Prompt 3 (DOK 3):</strong></p>
  <p>{Extract and render the DOK 3 question from the input text.}</p>
  
  <p><strong>Expected Student Responses</strong></p>
  <ul>
  <li>{Extract 1–2 expected responses for Prompt 3}</li>
  </ul>
  
  <p><strong>Prompt 4 (DOK 4):</strong></p>
  <p>{Extract and render the DOK 4 question from the input text.}</p>
  
  <p><strong>Expected Student Responses</strong></p>
  <ul>
  <li>{Extract 1–2 expected responses for Prompt 4}</li>
  </ul>
  
  <p>
  This formative assessment may be implemented as a brief exit ticket, think-pair-share discussion, or oral check-in to support instructional decision-making.
  </p>
  
  --------------------------------
  INPUT JSON:
  ${JSON.stringify(payload)}
  `.trim();
  };
  

  window.buildStudentPracticePrompt = function (jsonText) {
    const parsed = JSON.parse(jsonText);
  
    const payload = {
      StudentPractice: parsed.StudentPractice || ""
    };
  
    console.log("Student Practice Payload:", payload);
  
    return `
  You are a professional instructional HTML formatter writing for classroom teachers.
  
  CRITICAL RULES:
  - Output ONLY valid HTML.
  - Do NOT add explanations or commentary.
  - Do NOT invent content.
  - Use ONLY the content provided in the input.
  - Allowed HTML tags ONLY:
  <p>, <h3>, <strong>, <em>, <span>, <ul>, <li>
  - Lists may ONLY contain <li> as direct children.
  - NO nested lists.
  - NO <p> inside <li>.
  
  --------------------------------
  SECTION: STUDENT PRACTICE
  --------------------------------
  
  RENDER STRUCTURE (MUST FOLLOW EXACTLY):
  
  1) Section heading:
  <h3><span>Student Practice</span></h3>
  
  2) Render the content using this REQUIRED structure:
  
  - Teacher Notes paragraph
  - Task 1 (DOK 2) with directions
  - Expected Student Responses (as a <ul>)
  - Task 2 (DOK 3) with directions
  - Expected Student Responses (as a <ul>)
  - Task 3 (DOK 3) with directions and required elements
  - Expected Student Responses (as a <ul>)
  - Final Reflection prompt as a single paragraph
  
  3) Expected Student Responses blocks MUST:
  - Be preceded by:
  <p><strong>Expected Student Responses</strong></p>
  - Contain ONLY a <ul> with <li> items
  - Include 3–4 bullets per task
  
  4) The Reflection MUST:
  - Appear at the end
  - Be labeled:
  <p><strong>Reflection:</strong></p>
  - Contain ONE reflective or transcendent-thinking prompt
  
  DO NOT:
  - Add extra tasks
  - Add DOK labels not present
  - Add emojis or icons
  - Reorder sections
  - Modify meaning
  
  --------------------------------
  INPUT TEXT:
  ${payload.StudentPractice}
  `.trim();
  };
  