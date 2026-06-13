import React, { useState, useEffect } from 'react';
import { MarkdownEditorView, useMarkdownEditor } from '@gravity-ui/markdown-editor';
import { Button, TextInput, TextArea, Select } from '@gravity-ui/uikit';

const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";

async function callResponsesApiStream(params) {
  const { endpoint, apiKey, model, prompt, schemaName, schemaObj, signal } = params;
  const body = {
    model,
    stream: true,
    reasoning: { effort: "low" },
    input: [{ role: "user", content: prompt }]
  };
  if (schemaObj) {
    body.text = {
      format: {
        type: "json_schema",
        name: schemaName || "Response",
        schema: schemaObj,
        strict: true
      }
    };
  }
  return await window.apiClient.stream({
    endpoint, apiKey, body, signal,
    onDelta: params.onDelta,
    onUsage: (usage) => { if (window.TokenManager) new window.TokenManager().add(usage); },
    onError: (err) => { throw new Error(err.message || "Unknown error"); }
  });
}

function createLimiter(maxConcurrent = 4) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= maxConcurrent) return;
    const item = queue.shift();
    if (!item) return;
    active++;
    item()
      .catch(() => { })
      .finally(() => {
        active--;
        next();
      });
  };

  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push(async () => {
        try { resolve(await fn()); }
        catch (e) { reject(e); }
      });
      next();
    });
  };
}

async function withRetry(taskFn, label, log, timeoutMs = 180000, maxRetries = 2) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      log(`[timeout] ${label} (Attempt ${attempt}) timed out after ${timeoutMs / 1000}s. Retrying...`);
      controller.abort();
    }, timeoutMs);

    try {
      const result = await taskFn(controller.signal);
      clearTimeout(timeoutId);
      return result;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
      if (attempt < maxRetries) {
        const reason = (controller.signal.aborted) ? "Timeout" : (err.message || "Unknown error");
        log(`[retry] ${label} failed (${reason}). Starting attempt ${attempt + 1}...`);
      }
    }
  }
  throw lastError;
}

export default function App() {
  const editor = useMarkdownEditor({ allowHTML: false });

  const [apiKey, setApiKey] = useState(window.LOCAL_CONFIG?.apiKey || "");
  const [model, setModel] = useState("gpt-5.4-mini");
  const [statusMsg, setStatusMsg] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [language, setLanguage] = useState("en");
  
  const [subject, setSubject] = useState("Science");
  const [name, setName] = useState("Engineering & Innovation in Ancient Egypt");
  const [gradeLevel, setGradeLevel] = useState("8");
  const [classDuration, setClassDuration] = useState("45");
  const [numberOfLessons, setNumberOfLessons] = useState("3");
  
  const [standards, setStandards] = useState("SC.8.N.1.1: Define a problem, conduct investigations, use appropriate reference materials, and report, display, and argue the findings of an investigation to draw conclusions. \nSC.8.P.8.4: Classify and compare substances based on physical properties. \nSC.8.P.9.2: Distinct between physical and chemical changes. \nSC.8.E.5.12: Summarize the effects of space exploration on the economy and culture of Florida. \nSS.8.A.1.2: Analyze charts, graphs, maps, photographs, and timelines; determine cause and effect.");
  const [userPrompt, setUserPrompt] = useState("Use the first three days of the media shared to create 3 lessons that align with the media. You must use the same objectives that are in the media attached.");
  const [learningPlans, setLearningPlans] = useState("Student Name: Abigail Nguyen \nPlan: Accommodations & Modifications \nInstruction \nx Word-to-word dictionary \nx Colored screens, changing font, changing text size, etc \nx Read aloud assignments \nx Rewording and simplification of instructions \nx Other: Sentence frames and starters \n  \nEnvironment & Setting \nx Proximity to teacher, white/interactive board, charts, posters, etc \n  \nFormative Assessments \nx Read aloud items and choices (not reading tests) \nx Word-to-word dictionary \nx Colored screens, changing font, changing text size, etc \n  \nSummative Assessments \nx Read aloud items and choices (not reading tests) \nx Word-to-word dictionary* \n  \n*Not allowed on WIDA ACCESS \n  \nStudent Name: Charles Alvarez \nPlan: Accommodations & Modifications \nPre-teach or re-teach key vocabulary or concepts \nCheck for understanding frequently and privately \nBreak tasks into smaller, manageable steps \nSpeech-to-text for writing tasks \n  \nAssessment Accommodations & Modifications \nAllow oral responses instead of written \nRe-read test questions or directions aloud \n  \nStudent Name: Emily Carter \nPlan: Accommodations & Modifications \n  \nInstruction \nx Word-to-word dictionary \nx Colored screens, changing font, changing text size, etc \nx Read aloud assignments \nx Rewording and simplification of instructions \nx Other: Sentence frames and starters \n  \nEnvironment & Setting \nx Proximity to teacher, white/interactive board, charts, posters, etc \n  \nFormative Assessments \nx Read aloud items and choices (not reading tests) \nx Word-to-word dictionary \nx Colored screens, changing font, changing text size, etc \n  \nSummative Assessments \nx Read aloud items and choices (not reading tests) \nx Word-to-word dictionary* \n  \n*Not allowed on WIDA ACCESS");
  const [mediaContext, setMediaContext] = useState("Science: Engineering and Innovation Science — Engineering and Innovation in Ancient Egypt Subject:  \n\nScience Grade Level: Middle School (Grade 8)  \n\nDuration: 5 class periods (45 minutes each)  \n\nStandards ● SC.8.N.1.1 – Scientific inquiry: define a problem, conduct investigations, analyze and evaluate results. ● SC.8.P.8.4 – Classify/compare substances based on physical properties. ● SC.8.P.9.2 – Distinguish physical vs. chemical changes. ● SC.8.E.5.12 – Summarize the effects of space exploration on the economy and culture of Florida. ● SS.8.A.1.2 – Analyze charts, graphs, maps, photographs and timelines; determine cause and effect.  \n\nObjectives ● Understand how Egyptians engineered tools and systems to manage water and construction. ● Construct and test models (shadufs, pyramids, irrigation canals, simple machines). ● Analyze stability, force distribution, and mechanical advantage. ● Compare tools and machines based on efficiency. ● Apply physical science and engineering principles to historical innovation. ● Design original inventions inspired by ancient techniques and justify scientific reasoning.  \n\nDay 1: Water Engineering – The Shaduf Challenge  \n\nMaterials: ● Wooden dowels, string, rulers ● Small plastic buckets or cups ● Water bins or containers ● Timers, measuring cups ● Clipboards for data collection ● Projector or smartboard for visuals  \n\nHook - Desert Water Challenge (15 minutes): ● Students are introduced to a scenario: “Your village must lift water from a 20-foot well to survive. You can only use ancient tools. What will you design?” ● Discuss the daily reliance on the Nile and the ingenuity behind early water engineering.  \n\nIntroduction (15 minutes): ● Provide background on ancient Egyptian irrigation systems and the shaduf—a lever based device used to raise water from the Nile. ● Show video clips from PBS Learning Media: Engineering Egypt or National Geographic: Nile River.  \n\nDirect Instruction & Demonstration (15 minutes): ● Explain the mechanics of levers (fulcrum, load, effort) and how they apply to the shaduf. Introduce variables such as arm length and counterweight size.  \n\nHands-On Activity: Build & Test a Shaduf (30 minutes) ● In teams, students construct a simple shaduf using provided materials. ● Each group tests how much water they can lift, how high, and how fast. ● Students record data on lift efficiency and make adjustments to optimize performance.  \n\nClosure and Reflection (15 minutes) Class discussion: ● What design choices made the shaduf more efficient? ● How do simple machines help solve real-world problems? ● Introduce the concept of mechanical advantage.  \n\nAssessment Students complete an annotated diagram labeling all lever components in their design and explain how mechanical advantage played a role.  \n\nDay 2: Pyramid Physics – Why They Last  \n\nMaterials: ● Foam or wooden blocks (triangles, squares, pyramids) ● Protractors and rulers ● Force diagram templates ● Images of pyramids and construction illustrations ● Poster paper or whiteboards for drawing ● Building materials (e.g., sugar cubes, cardboard, modeling clay) \n\n Hook (10 minutes): Shape Stability Test ● Using blocks, students build towers using different shapes—triangles, squares, pyramids. ● Then, they apply pressure to test stability and record which shape holds up best.  \n\nIntroduction (10 minutes): ● Show images and theories about pyramid construction from TED-Ed: Pyramid Engineering and the Smithsonian Museum. ● Discuss why the pyramid shape has endured for millennia. Direct Instruction (10 minutes): Review key scientific terms: force, gravity, load distribution, and center of mass. Introduce force diagrams and how pressure disperses in triangular vs. rectangular shapes.  \n\nHands-On Activity (45 minutes): Build & Analyze Pyramids: ● Students build small pyramid models using different materials and design techniques. ● They draw and label force diagrams showing how weight is distributed through the structure. ● Compare pyramid shapes to other unstable structures.  \n\nClosure and Reflection (15 minutes): ● Discuss: Why did the pyramid shape survive natural forces? ● How do geometry and materials affect architectural endurance? ● What modern structures borrow from ancient design?  \n\nAssessment: ● Students write a brief scientific explanation answering: “Why have pyramids stood the test of time?” ● Responses must use at least 3 scientific vocabulary terms introduced in the lesson.  \n\nDay 3: Irrigation Innovation – Water Flow Engineering  \n\nMaterials: ● Aluminum foil, sand, plastic trays ● Water pitchers or droppers ● Rulers, timers ● Clipboards and canal data logs  \n\nHook (5 min): ● Image of Nile River farmland. ● Ask: \"How would you get water from the river to your crops without pumps?\"  \n\nMini-Lesson (10 min): ● Introduce canals, basins, and sluices. ● Show diagrams of Egyptian irrigation.  \n\nDesign Lab (20 min): In teams, students sculpt canal networks in trays using foil and sand.  \n\nTesting (5 min): Pour water and time how long it takes to reach the end. Record water loss, travel time.  \n\nReflection & Share (5 min): What made some canal systems more efficient? Assessment: Annotated model sketch + flow data.");
  
  const [markdown, setMarkdown] = useState("");
  const [step0Json, setStep0Json] = useState("");
  const [lessonsBundle, setLessonsBundle] = useState("");
  const [logText, setLogText] = useState("");

  const log = (msg) => {
    setLogText(prev => prev + msg + "\n");
  };

  const handleRunChain = async () => {
    setIsRunning(true);
    setStatusMsg("Running...");
    log("Starting chain...");
    try {
      if (window.utils && window.apiClient && window.promptsEN) {
        log("Global utils found. Running full chain.");
        const endpoint = DEFAULT_ENDPOINT;
        const p = window.promptsEN;
        const vars = {
          Subject: subject,
          Name: name,
          UserPrompt: userPrompt,
          GradeLevel: gradeLevel,
          ClassDuration: classDuration,
          NumberOfItems: numberOfLessons,
          Standards: standards,
          LearningPlans: learningPlans,
          MediaContext: mediaContext,
          AttachedUnit: "",
          AttachedLesson: ""
        };

        // Step 0
        log("[1/5] Step 0: generating unit outline JSON…");
        const step0Prompt = window.utils.fillTemplate(p.STEP0_PROMPT_TEMPLATE, vars);
        const step0JsonText = await withRetry((signal) =>
          callResponsesApiStream({
            endpoint, apiKey, model,
            prompt: step0Prompt,
            schemaName: "UnitPlanResponse",
            schemaObj: p.STEP0_SCHEMA,
            signal
          }), "Step 0 Outline", log);

        const step0Obj = JSON.parse(step0JsonText);
        setStep0Json(JSON.stringify(step0Obj, null, 2));
        log("[OK] Step 0 JSON received.");

        // Fetch Step 0 Markdown immediately
        log("Calling .NET API to generate Step 0 Markdown...");
        let currentMarkdown = "";
        try {
          const resStep0 = await fetch("http://localhost:5000/api/collaborative/generate/step0", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              UnitTitle: name,
              Step0Json: JSON.stringify(step0Obj, null, 2),
              Language: language
            })
          });
          if (resStep0.ok) {
            const dataStep0 = await resStep0.json();
            currentMarkdown = dataStep0.markdown;
            setMarkdown(currentMarkdown);
            if (editor) {
              editor.clear();
              editor.replace(currentMarkdown);
            }
            log("[OK] Step 0 Markdown generated and displayed.");
          } else {
            log("[WARN] Failed to generate Step 0 Markdown.");
          }
        } catch (err) {
          log("[WARN] Error fetching Step 0 Markdown: " + err.message);
        }


        // Lessons
        const lessonsList = Array.isArray(step0Obj?.Lessons) ? step0Obj.Lessons : [];
        const limit = createLimiter(4);
        log(`[3/5] Generating lesson JSON in parallel (${lessonsList.length} lessons)…`);

        const lessonJsonPromises = lessonsList.map((L, i) =>
          limit(() =>
            withRetry(async (signal) => {
              const perLessonVars = {
                ...vars,
                UnitEssentialQuestions: (step0Obj?.UnitDescription?.EssentialQuestions || []).join("\\n"),
                ParentUnitData: `UNIT DESCRIPTION: ${step0Obj.UnitDescription.Description}\\n\\nCURRENT LESSON CONTEXT (MUST follow these constraints):\\n- Lesson Number: ${L.lessonNumber ?? (i + 1)}\\n- Lesson Title: ${L.lessonTitle ?? ""}\\n- Lesson Outline: ${L.lessonOutline ?? ""}`
              };

              const perLessonPrompt = window.utils.fillTemplate(p.PER_LESSON_PROMPT_TEMPLATE, perLessonVars);
              const lessonJsonText = await callResponsesApiStream({
                endpoint, apiKey, model,
                prompt: perLessonPrompt,
                schemaName: "LessonPlanResponse",
                schemaObj: p.PER_LESSON_SCHEMA,
                signal
              });

              let lessonObj = JSON.parse(lessonJsonText);
              log(`[OK] Lesson ${i + 1}/${lessonsList.length} JSON done.`);
              return lessonObj;
            }, `Lesson ${i + 1} JSON`, log)
          )
        );

        const lessonJsons = await Promise.all(lessonJsonPromises);
        log("[OK] All lesson JSON done.");
        setLessonsBundle(lessonJsons.map((obj, i) => `=== Lesson ${i + 1} ===\\n${JSON.stringify(obj, null, 2)}`).join('\\n\\n'));

        // .NET API
        log("Calling .NET API to generate Markdown for lessons...");
        const res = await fetch("http://localhost:5000/api/collaborative/generate/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            LessonJsons: lessonJsons.map(obj => JSON.stringify(obj, null, 2)),
            Language: language
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          const finalMarkdown = currentMarkdown + "\n" + data.markdown;
          setMarkdown(finalMarkdown);
          if (editor) {
            editor.clear();
            editor.replace(finalMarkdown);
          }
          log("[OK] Lessons Markdown generated by .NET API and appended.");
        } else {
          setMarkdown("# Failed to fetch from .NET API\nCheck your .NET server running on port 5000.");
        }
      } else {
        log("Using fallback mock data.");
        setMarkdown("# Generated Unit Plan\\nThis is a fallback markdown since global scripts weren't found.");
      }
      setStatusMsg("Done.");
    } catch (e) {
      log("Error: " + e.message);
      setStatusMsg("Error.");
      setMarkdown("# Error\\nAn error occurred while running the chain.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '8px' }}>Collaborative Playground</h1>
      <p style={{ color: '#6e6e73' }}>React + Gravity UI Refactor</p>

      <div style={{ background: '#fff', border: '1px solid #d2d2d7', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <h3>OpenAI / Proxy</h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label>Access Password</label>
            <TextInput value={apiKey} onUpdate={setApiKey} type="password" placeholder="Enter password..." />
          </div>
          <div>
            <label>OpenAI Model</label>
            <Select value={[model]} onUpdate={v => setModel(v[0])}>
              <Select.Option value="gpt-5.4-mini">gpt-5.4-mini</Select.Option>
              <Select.Option value="gpt-5.4">gpt-5.4</Select.Option>
            </Select>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #d2d2d7', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <h3>Input variables</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label>Unit Subject</label>
            <TextInput value={subject} onUpdate={setSubject} />
          </div>
          <div>
            <label>Unit Name</label>
            <TextInput value={name} onUpdate={setName} />
          </div>
          <div>
            <label>Grade Level</label>
            <TextInput value={gradeLevel} onUpdate={setGradeLevel} />
          </div>
          <div>
            <label>Class Duration (minutes)</label>
            <TextInput type="number" value={classDuration} onUpdate={setClassDuration} />
          </div>
          <div>
            <label>Requested Number of Lessons</label>
            <TextInput type="number" value={numberOfLessons} onUpdate={setNumberOfLessons} />
          </div>
        </div>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label>Standards</label>
            <TextArea value={standards} onUpdate={setStandards} minRows={3} />
          </div>
          <div>
            <label>User Prompt</label>
            <TextArea value={userPrompt} onUpdate={setUserPrompt} minRows={3} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
        <Select value={[language]} onUpdate={v => setLanguage(v[0])} width={180}>
          <Select.Option value="en">English</Select.Option>
          <Select.Option value="sr-Latn">Srpska latinica</Select.Option>
          <Select.Option value="sr-Cyrl">Srpska ćirilica</Select.Option>
          <Select.Option value="id">Bahasa Indonesia</Select.Option>
          <Select.Option value="es">Español</Select.Option>
          <Select.Option value="ru">Русский</Select.Option>
        </Select>
        <Button view="action" size="l" onClick={handleRunChain} loading={isRunning}>Run Chain</Button>
        <Button view="outlined-danger" size="l" disabled={!isRunning}>Cancel</Button>
        <span style={{ alignSelf: 'center', color: '#6e6e73' }}>{statusMsg}</span>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Log</h3>
        <TextArea value={logText} minRows={5} maxRows={10} readOnly />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3>Gravity UI Markdown Editor</h3>
        <div style={{ border: '2px solid #28a745', borderRadius: '8px', overflow: 'hidden' }}>
          <MarkdownEditorView
            stickyToolbar={true}
            editor={editor}
          />
        </div>
      </div>
    </div>
  );
}
