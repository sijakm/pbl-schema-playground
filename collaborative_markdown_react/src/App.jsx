import { useState, useRef, useCallback, useEffect } from "react";
import { marked } from "marked";
import JSZip from "jszip";
import logo from "./assets/logo.png";
import { promptsEN } from "./prompts_en";
import { promptsSR } from "./prompts_sr";
import {
  DEFAULT_ENDPOINT,
  MODEL_PRICING,
  fillTemplate,
  callResponsesApiStream,
  createLimiter,
  withRetry,
  buildUnitCommonJson,
  generateMarkdown,
} from "./chainLogic";

const DEFAULTS = {
  en: {
    subject: "Physical Science (Molecules & Structures)",
    name: "Building Blocks: Modeling Atomic Composition",
    gradeLevel: "Middle School (6th-8th Grade)",
    standards: "MS-PS1-1 Develop models to describe the atomic composition of simple molecules and extended structures.",
    userPrompt: "Students will develop and use models to describe the atomic composition of simple molecules and extended structures. They will differentiate between molecules and extended structures (like crystals) and understand how the arrangement of atoms affects properties. Emphasize physical modeling and structural reasoning.",
    learningPlans: "Student Name: Maria Valdez\nPlan: Provide partially pre-labeled atomic models and sentence frames for structure descriptions.\n\nStudent Name: Jacob Garrow\nPlan: Allow speech-to-text for explaining structural differences.\n\nStudent Name: Ava Lund\nPlan: Supply bilingual atomic symbol charts and visual color-coded maps for molecules.",
    mediaContext: "Molecular model kits (balls and sticks), periodic table charts, images of crystal structures (e.g., salt, diamond), interactive online molecular builders (like PhET), student science journals.",
    attachedUnit: "No attached unit text provided.",
  },
  sr: {
    subject: "Fizičke nauke (Molekuli i strukture)",
    name: "Gradivni blokovi: Modeliranje atomskog sastava",
    gradeLevel: "Osnovna škola (6-8. razred)",
    standards: "MS-PS1-1 Razviti modele za opisivanje atomskog sastava jednostavnih molekula i proširenih struktura.",
    userPrompt: "Učenici će razvijati i koristiti modele da opišu atomski sastav jednostavnih molekula i proširenih struktura. Oni će razlikovati molekule i proširene strukture (poput kristala) i razumeti kako raspored atoma utiče na svojstva. Naglasite fizičko modeliranje i strukturno zaključivanje.",
    learningPlans: "Ime učenika: Maria Valdez\nPlan: Obezbedite delimično unapred označene atomske modele i okvire rečenica za opise strukture.\n\nIme učenika: Jacob Garrow\nPlan: Dozvolite funkciju govora u tekst za objašnjavanje strukturnih razlika.\n\nIme učenika: Ava Lund\nPlan: Obezbedite dvojezične grafikone atomskih simbola i vizuelne mape za molekule obeležene bojom.",
    mediaContext: "Modeli molekula (kuglice i štapići), tabele periodnog sistema, slike kristalnih struktura (npr. so, dijamant), interaktivni onlajn alati za izgradnju molekula (poput PhET-a), učenički naučni dnevnici.",
    attachedUnit: "Nije obezbeđen tekst priložene jedinice.",
  },
};

function fmtMs(ms) {
  if (!Number.isFinite(ms)) return "—";
  if (ms < 1000) return `${ms.toFixed(0)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

export default function App() {
  const [lang, setLang] = useState("sr");
  const [apiKey, setApiKey] = useState(window.LOCAL_CONFIG?.apiKey || "");
  const [model, setModel] = useState("gpt-5.4-mini");

  const d = DEFAULTS[lang];
  const [subject, setSubject] = useState(d.subject);
  const [unitName, setUnitName] = useState(d.name);
  const [gradeLevel, setGradeLevel] = useState(d.gradeLevel);
  const [classDuration, setClassDuration] = useState("45");
  const [numberOfLessons, setNumberOfLessons] = useState("1");
  const [standards, setStandards] = useState(d.standards);
  const [userPrompt, setUserPrompt] = useState(d.userPrompt);
  const [learningPlans, setLearningPlans] = useState(d.learningPlans);
  const [mediaContext, setMediaContext] = useState(d.mediaContext);
  const [attachedUnit, setAttachedUnit] = useState(d.attachedUnit);
  const [attachedLesson, setAttachedLesson] = useState("");
  const [unitEssentialQuestions, setUnitEssentialQuestions] = useState("");

  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [logLines, setLogLines] = useState([]);
  const [step0Json, setStep0Json] = useState("");
  const [lessonsJsons, setLessonsJsons] = useState([]);
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [tokenUsage, setTokenUsage] = useState({ input: 0, output: 0, total: 0, calls: 0, cached: 0 });
  const [showTokens, setShowTokens] = useState(false);
  const [isInputsCollapsed, setIsInputsCollapsed] = useState(true);

  const abortRef = useRef(null);
  const editorRef = useRef(null);
  const ckeditorRef = useRef(null);
  const isInitializingRef = useRef(false);
  const logEndRef = useRef(null);
  const resultsRef = useRef(null);

  // Prefill from config
  useEffect(() => {
    if (window.LOCAL_CONFIG?.apiKey && !apiKey) {
      setApiKey(window.LOCAL_CONFIG.apiKey);
    }
  }, []);

  // Auto-scroll log (internal scroll only)
  useEffect(() => {
    if (logEndRef.current) {
      const container = logEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [logLines]);

  // Init CKEditor safely
  useEffect(() => {
    if (!editorRef.current || ckeditorRef.current || isInitializingRef.current) return;
    if (typeof CKEDITOR === "undefined") return;

    isInitializingRef.current = true;

    CKEDITOR.ClassicEditor.create(editorRef.current, {
      licenseKey: "GPL",
      toolbar: {
        items: [
          "findAndReplace", "selectAll", "|", "heading", "|",
          "bold", "italic", "strikethrough", "underline", "subscript", "superscript", "code", "removeFormat", "|",
          "bulletedList", "numberedList", "todoList", "|", "outdent", "indent", "|", "undo", "redo", "-",
          "fontSize", "fontFamily", "fontColor", "fontBackgroundColor", "highlight", "|",
          "alignment", "|", "link", "uploadImage", "blockQuote", "insertTable", "mediaEmbed", "codeBlock", "htmlEmbed", "|",
          "specialCharacters", "horizontalLine", "pageBreak", "|", "sourceEditing",
        ],
        shouldNotGroupWhenFull: true,
      },
      image: {
        toolbar: ["imageStyle:inline", "imageStyle:block", "imageStyle:side", "|", "toggleImageCaption", "imageTextAlternative"],
      },
      table: { contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableProperties", "tableCellProperties"] },
      list: { properties: { styles: true, startIndex: true, reversed: true } },
      mediaEmbed: { previewsInData: true },
      removePlugins: [
        "AIAssistant", "CKBox", "CKFinder", "EasyImage",
        "RealTimeCollaborativeComments", "RealTimeCollaborativeTrackChanges",
        "RealTimeCollaborativeRevisionHistory", "PresenceList", "Comments",
        "TrackChanges", "TrackChangesData", "RevisionHistory", "Pagination",
        "WProofreader", "MathType", "SlashCommand", "Template", "DocumentOutline",
        "FormatPainter", "TableOfContents", "PasteFromOfficeEnhanced", "CaseChange",
      ],
      htmlSupport: { allow: [{ name: /.*/, attributes: true, classes: true, styles: true }] },
    })
      .then((editor) => {
        ckeditorRef.current = editor;
        isInitializingRef.current = false;
      })
      .catch((err) => {
        console.error("CKEditor error", err);
        isInitializingRef.current = false;
      });

    return () => {
      if (ckeditorRef.current) {
        const instance = ckeditorRef.current;
        ckeditorRef.current = null;
        instance.destroy().catch(e => console.error("Cleanup error:", e));
      }
    };
  }, []);

  function addLog(line) {
    setLogLines((prev) => [...prev, line]);
  }

  function handleLangChange(newLang) {
    setLang(newLang);
    const d = DEFAULTS[newLang];
    setSubject(d.subject);
    setUnitName(d.name);
    setGradeLevel(d.gradeLevel);
    setStandards(d.standards);
    setUserPrompt(d.userPrompt);
    setLearningPlans(d.learningPlans);
    setMediaContext(d.mediaContext);
    setAttachedUnit(d.attachedUnit);
  }

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleRunChain = useCallback(async () => {
    if (isRunning) return;
    const vars = {
      Subject: subject.trim(),
      Name: unitName.trim(),
      UserPrompt: userPrompt.trim(),
      GradeLevel: gradeLevel.trim(),
      ClassDuration: classDuration.trim(),
      NumberOfItems: numberOfLessons.trim(),
      Standards: standards.trim(),
      LearningPlans: learningPlans.trim(),
      MediaContext: mediaContext.trim(),
      AttachedUnit: attachedUnit.trim(),
      AttachedLesson: attachedLesson.trim(),
    };

    if (!vars.Subject || !vars.Name || !vars.UserPrompt || !vars.GradeLevel || !vars.ClassDuration || !vars.NumberOfItems) {
      alert("Please fill in at least: Subject, Name, UserPrompt, GradeLevel, ClassDuration, NumberOfItems.");
      return;
    }

    setIsRunning(true);
    setLogLines([]);
    setStep0Json("");
    setLessonsJsons([]);
    setMarkdownOutput("");
    setPreviewHtml("");
    setTokenUsage({ input: 0, output: 0, total: 0, calls: 0, cached: 0 });
    setShowTokens(false);
    setStatus("Running…");
    setProgress(5);

    const controller = new AbortController();
    abortRef.current = controller;

    const endpoint = DEFAULT_ENDPOINT;
    const prompts = lang === "en" ? promptsEN : promptsSR;

    let currentStep = 0;
    let step0FinalTokens = 0;
    let totalOutputTokens = 0;

    const accumUsage = { input: 0, output: 0, total: 0, calls: 0, cached: 0 };
    const onUsage = (u) => {
      accumUsage.input += (u.input_tokens || u.prompt_tokens || 0);
      accumUsage.output += (u.output_tokens || u.completion_tokens || 0);
      accumUsage.total += (u.total_tokens || 0);
      accumUsage.calls += 1;
      
      // Handle both input_tokens_details and prompt_tokens_details for cached
      const cached = u.input_tokens_details?.cached_tokens || u.prompt_tokens_details?.cached_tokens || 0;
      accumUsage.cached += cached;

      console.log("Usage raw object:", u);
      setTokenUsage({ ...accumUsage });
    };

    let numLessons = parseInt(numberOfLessons);

    const onChunk = (chunk) => {
      totalOutputTokens += (chunk.length / 4);
      if (currentStep === 0) {
        // Step 0: Target 500 tokens, map to 5-20%
        const p = 5 + Math.min(15, (totalOutputTokens / 500) * 15);
        setProgress(Math.floor(p));
      } else {
        // Step 1: Target numLessons * 3500 tokens, map to 20-98%
        const lessonTokens = totalOutputTokens - step0FinalTokens;
        const target = numLessons * 3500;
        const p = 20 + Math.min(78, (lessonTokens / target) * 78);
        setProgress(Math.floor(p));
      }
    };

    const t0Total = performance.now();

    try {
      // Step 0
      addLog("[1/3] Step 0: generating unit outline JSON…");
      const t0 = performance.now();
      const step0Prompt = fillTemplate(prompts.STEP0_PROMPT_TEMPLATE, vars);
      const step0JsonText = await withRetry(
        (signal) => callResponsesApiStream({ 
          endpoint, apiKey, model, prompt: step0Prompt, 
          schemaName: "UnitPlanResponse", schemaObj: prompts.STEP0_SCHEMA, 
          signal, onUsage, onChunk 
        }),
        "Step 0 Outline",
        controller.signal,
        180000, 2,
        addLog
      );

      let step0Obj;
      try { step0Obj = JSON.parse(step0JsonText); }
      catch { throw new Error("Step 0 did not return valid JSON."); }
      
      step0FinalTokens = totalOutputTokens;
      currentStep = 1;
      const actualLessons = Array.isArray(step0Obj?.Lessons) ? step0Obj.Lessons : [];
      if (actualLessons.length > 0) numLessons = actualLessons.length;

      setStep0Json(JSON.stringify(step0Obj, null, 2));
      addLog(`[OK] Step 0 JSON received. (${fmtMs(performance.now() - t0)})`);
      setProgress(20);

      const unitCommonJson = buildUnitCommonJson(step0Obj, vars.Name);

      // Per-lesson JSON (parallel)
      const lessons = Array.isArray(step0Obj?.Lessons) ? step0Obj.Lessons : [];
      const limit = createLimiter(25);
      addLog(`[2/3] Generating lesson JSON in parallel (${lessons.length} lessons)…`);
      const tJson0 = performance.now();
      setProgress(21);

      let lessonsCompleted = 0;

      const lessonJsonPromises = lessons.map((L, i) =>
        limit(() =>
          withRetry(async (signal) => {
            const ti0 = performance.now();
            const perLessonVars = {
              ...vars,
              Name: L.lessonTitle ?? vars.Name,
              UnitEssentialQuestions: (step0Obj?.UnitDescription?.EssentialQuestions || []).join("\n"),
              ParentUnitData: `UNIT DESCRIPTION: ${step0Obj.UnitDescription.Description}\n\nCURRENT LESSON CONTEXT:\n- Lesson Number: ${L.lessonNumber ?? (i + 1)}\n- Lesson Title: ${L.lessonTitle ?? ""}\n- Lesson Outline: ${L.lessonOutline ?? ""}`,
            };
            const perLessonPrompt = fillTemplate(prompts.PER_LESSON_PROMPT_TEMPLATE, perLessonVars);
            const lessonJsonText = await callResponsesApiStream({
              endpoint, apiKey, model,
              prompt: perLessonPrompt,
              schemaName: "LessonPlanResponse",
              schemaObj: prompts.PER_LESSON_SCHEMA,
              signal,
              onUsage,
              onChunk,
            });
            const lessonObj = JSON.parse(lessonJsonText);
            lessonsCompleted++;
            addLog(`[OK] Lesson ${i + 1}/${lessons.length} JSON done. (${fmtMs(performance.now() - ti0)})`);
            return lessonObj;
          }, `Lesson ${i + 1} JSON`, controller.signal, 180000, 2, addLog)
        )
      );

      const lessonJsons = await Promise.all(lessonJsonPromises);
      setLessonsJsons(lessonJsons);
      addLog(`[OK] All lesson JSON done. (${fmtMs(performance.now() - tJson0)})`);

      // Step 3: Markdown
      addLog("[3/3] Generating final Markdown locally…");
      const finalMarkdown = generateMarkdown(unitCommonJson, lessonJsons, lang);
      setMarkdownOutput(finalMarkdown);

      const html = marked.parse(finalMarkdown);
      setPreviewHtml(html);

      if (ckeditorRef.current) {
        ckeditorRef.current.setData(html);
        setIsEditing(true);
      }

      addLog(`\nTOTAL: ${fmtMs(performance.now() - t0Total)}`);
      setShowTokens(true);
      setStatus("Done.");
      setProgress(100);
    } catch (err) {
      if (controller.signal.aborted) {
        setStatus("Canceled.");
        addLog("[canceled]");
      } else {
        setStatus("Error.");
        addLog("[error] " + (err?.message || String(err)));
      }
    } finally {
      setIsRunning(false);
      abortRef.current = null;
    }
  }, [isRunning, lang, apiKey, model, subject, unitName, gradeLevel, classDuration, numberOfLessons, standards, userPrompt, learningPlans, mediaContext, attachedUnit, attachedLesson]);

  async function handleDownloadPrompts() {
    try {
      if (typeof JSZip === "undefined") { alert("JSZip not loaded."); return; }
      const zipEN = new JSZip();
      const zipSR = new JSZip();
      const addFiles = (zip, obj) => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === "object" && value !== null) zip.file(`${key}.json`, JSON.stringify(value, null, 2));
          else if (typeof value === "string") zip.file(`${key}.txt`, value);
        }
      };
      addFiles(zipEN, promptsEN);
      addFiles(zipSR, promptsSR);
      const contentEN = await zipEN.generateAsync({ type: "blob" });
      const contentSR = await zipSR.generateAsync({ type: "blob" });
      const save = (blob, name) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
      save(contentEN, "collaborative_prompts_en.zip");
      setTimeout(() => save(contentSR, "collaborative_prompts_sr.zip"), 500);
      addLog("[OK] Prompts downloaded.");
    } catch (err) {
      addLog("[error] Failed to download prompts: " + err.message);
    }
  }

  function handleFinishEdit() {
    if (!ckeditorRef.current) return;
    setPreviewHtml(ckeditorRef.current.getData());
    setIsEditing(false);
  }

  function handleEditAgain() {
    setIsEditing(true);
  }

  const pricing = MODEL_PRICING[model] || { input: 0, output: 0, cached: 0 };
  const inputCost = ((tokenUsage.input - tokenUsage.cached) / 1_000_000) * pricing.input;
  const cachedCost = (tokenUsage.cached / 1_000_000) * (pricing.cached || pricing.input * 0.5);
  const outputCost = (tokenUsage.output / 1_000_000) * pricing.output;
  const totalCost = inputCost + cachedCost + outputCost;
  const fmt = (n) => n.toLocaleString("en-US");
  const fmtUSD = (n) => `$${n.toFixed(4)}`;

  const [activeTab, setActiveTab] = useState("log");

  // Switch to JSON tab when step 0 completes, if user hasn't switched away from Log?
  // Actually let's keep it simple: just show the UI for tabs.

  return (
    <div className="app-root">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo-group">
            <div className="logo-icon">
              <img src={logo} alt="CheckIT Logo" className="brand-logo-img" />
            </div>
            <div className="brand-stack">
              <div className="brand-main">CheckIT <span className="brand-light">Prompts Playground</span></div>
              <div className="brand-feature">Collaborative Unit Plan</div>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">


        {/* Config Card */}
        <section className="card section-config">
          <div className="card-header">
            <div className="card-icon">🔑</div>
            <div>
              <h2 className="card-title">OpenAI / Proxy</h2>
              <p className="card-subtitle">Server and model configurations</p>
            </div>
          </div>
          <div className="form-grid">

            <div className="form-col">
              <label className="field-label" htmlFor="apiKey">Access Password</label>
              <input
                id="apiKey"
                type="password"
                className="field-input"
                placeholder="Enter password…"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="form-col">
              <label className="field-label" htmlFor="languageSelect">Jezik / Language</label>
              <select
                id="languageSelect"
                className="field-input"
                value={lang}
                onChange={(e) => handleLangChange(e.target.value)}
              >
                <option value="sr">Srpski</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="form-col">
              <label className="field-label" htmlFor="modelSelect">OpenAI Model</label>
              <select id="modelSelect" className="field-input" value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="gpt-5.4-mini">gpt-5.4-mini (default)</option>
                <option value="gpt-5.4-nano">gpt-5.4-nano</option>
                <option value="gpt-5.4">gpt-5.4</option>
                <option value="gpt-5-mini">gpt-5-mini</option>
                <option value="gpt-5.2">gpt-5.2</option>
              </select>
            </div>
          </div>
        </section>

        {/* Input Variables Card */}
        <section className={`card section-inputs ${isInputsCollapsed ? "collapsed" : ""}`}>
          <div className="card-header selectable" onClick={() => setIsInputsCollapsed(!isInputsCollapsed)}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
              <div className="card-icon">📝</div>
              <div>
                <h2 className="card-title">Input Variables</h2>
                <p className="card-subtitle">Values substituted into prompt templates via <code>{"{{$Variable}}"}</code> placeholders.</p>
              </div>
            </div>
            
            <div className="header-extra" onClick={(e) => e.stopPropagation()}>
              <div className="field-group-header">
                <label className="field-label-header">Number of lessons</label>
                <select 
                  className="field-input-header" 
                  value={numberOfLessons} 
                  onChange={(e) => setNumberOfLessons(e.target.value)}
                >
                  {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={`collapse-arrow ${isInputsCollapsed ? "" : "open"}`}>
              <span className="collapse-text">{isInputsCollapsed ? "Show fields" : "Hide fields"}</span>
              ▼
            </div>
          </div>

          {!isInputsCollapsed && (
            <div className="card-content-fade">
              <div className="inputs-grid">
                <div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="subject">Unit Subject</label>
                    <input id="subject" className="field-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="unitName">Unit Name</label>
                    <input id="unitName" className="field-input" value={unitName} onChange={(e) => setUnitName(e.target.value)} />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="gradeLevel">Grade Level</label>
                    <input id="gradeLevel" className="field-input" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="classDuration">Duration (min)</label>
                    <input id="classDuration" type="number" min="1" className="field-input" value={classDuration} onChange={(e) => setClassDuration(e.target.value)} />
                  </div>
                </div>

                <div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="standards">Standards</label>
                    <textarea id="standards" className="field-textarea h-sm" value={standards} onChange={(e) => setStandards(e.target.value)} />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="userPrompt">Unit Description / Instruction</label>
                    <textarea id="userPrompt" className="field-textarea h-lg" value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="learningPlans">Students with individualized support</label>
                    <textarea id="learningPlans" className="field-textarea h-sm" value={learningPlans} onChange={(e) => setLearningPlans(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="mediaContext">Resources / Media to use</label>
                <textarea id="mediaContext" className="field-textarea h-sm" value={mediaContext} onChange={(e) => setMediaContext(e.target.value)} />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="attachedUnit">Unit Content (AttachedUnit)</label>
                <textarea id="attachedUnit" className="field-textarea h-md" value={attachedUnit} onChange={(e) => setAttachedUnit(e.target.value)} />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="attachedLesson">Attached Lesson Content (optional)</label>
                <textarea id="attachedLesson" className="field-textarea h-sm" value={attachedLesson} onChange={(e) => setAttachedLesson(e.target.value)} />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="unitEq">Unit Essential Questions (optional)</label>
                <textarea
                  id="unitEq"
                  className="field-textarea h-xs"
                  placeholder={'Example: ["How... ?","How... ?","Why... ?"]'}
                  value={unitEssentialQuestions}
                  onChange={(e) => setUnitEssentialQuestions(e.target.value)}
                />
              </div>
            </div>
          )}
        </section>

        {/* Actions */}
        <section className="actions-bar">
          <button
            id="runChainBtn"
            className={`btn btn-primary ${isRunning ? "btn-running" : ""}`}
            style={{ minWidth: "160px", padding: "12px 24px" }}
            onClick={handleRunChain}
            disabled={isRunning}
          >
            {isRunning ? (
              <><span className="spinner" /> Running…</>
            ) : (
              "▶ Run Chain"
            )}
          </button>
          <button id="cancelBtn" className="btn btn-danger" onClick={handleCancel} disabled={!isRunning}>
            ✕ Cancel
          </button>
          <button id="downloadPromptsBtn" className="btn btn-secondary" onClick={handleDownloadPrompts}>
            ⬇ Download Prompts
          </button>
          {status && (
            <span className={`status-badge ${status === "Done." ? "status-done" : status === "Canceled." ? "status-cancel" : status.startsWith("Error") ? "status-error" : "status-running"}`}>
              {status}
            </span>
          )}
        </section>


        {/* Outputs grouped in Tabs */}
        <section className="card section-outputs-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === "log" ? "active" : ""}`}
              onClick={() => setActiveTab("log")}
            >
              Execution Log
            </button>
            <button 
              className={`tab-btn ${activeTab === "json" ? "active" : ""}`}
              disabled={!step0Json}
              onClick={() => setActiveTab("json")}
            >
              Unit Description JSON
            </button>
            <button 
              className={`tab-btn ${activeTab === "markdown" ? "active" : ""}`}
              disabled={!markdownOutput}
              onClick={() => setActiveTab("markdown")}
            >
              Markdown Source
            </button>
            {lessonsJsons.map((L, idx) => (
              <button 
                key={idx}
                className={`tab-btn ${activeTab === `lesson-${idx}` ? "active" : ""}`}
                onClick={() => setActiveTab(`lesson-${idx}`)}
              >
                Lesson {idx + 1} JSON
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === "log" && (
              <div className="tab-pane">
                {isRunning && (
                  <div className="progress-container">
                    <div className="progress-bar-wrapper">
                      <div className="progress-bar" style={{ width: `${progress}%` }}>
                        <div className="progress-shimmer" />
                      </div>
                    </div>
                    <div className="progress-info">
                      <span className="progress-label">Generating teaching materials…</span>
                      <span className="progress-perc">{progress}%</span>
                    </div>
                  </div>
                )}
                <div className="log-box">
                  {logLines.length === 0 ? (
                    <span className="log-empty">Run the chain to see logs here…</span>
                  ) : (
                    logLines.map((line, i) => (
                      <div key={i} className={`log-line ${line.startsWith("[error]") ? "log-error" : line.startsWith("[OK]") || line.startsWith("TOTAL") ? "log-ok" : line.startsWith("[canceled]") ? "log-cancel" : ""}`}>
                        {line}
                      </div>
                    ))
                  )}
                  <div ref={logEndRef} />
                </div>

                {/* Token Summary inside Log tab */}
                {showTokens && (
                  <section className="token-summary">
                    <div className="ts-title">📊 Token Usage Summary</div>
                    <div className="ts-grid">
                      <div className="ts-stat">
                        <div className="ts-label">Input Tokens (${pricing.input}/1M)</div>
                        <div className="ts-value">{fmt(tokenUsage.input - tokenUsage.cached)}</div>
                        <div className="ts-sub">{fmtUSD(inputCost)}</div>
                      </div>
                      <div className="ts-stat">
                        <div className="ts-label">Cached Input (${pricing.cached}/1M)</div>
                        <div className="ts-value">{fmt(tokenUsage.cached)}</div>
                        <div className="ts-sub">{fmtUSD(cachedCost)}</div>
                      </div>
                      <div className="ts-stat">
                        <div className="ts-label">Output Tokens (${pricing.output}/1M)</div>
                        <div className="ts-value">{fmt(tokenUsage.output)}</div>
                        <div className="ts-sub">{fmtUSD(outputCost)}</div>
                      </div>
                      <div className="ts-stat">
                        <div className="ts-label">Total Tokens</div>
                        <div className="ts-value">{fmt(tokenUsage.total)}</div>
                      </div>
                    </div>
                    <div className="ts-cost-bar">
                      <span className="ts-cost-label">Estimated Total Cost</span>
                      <span className="ts-cost-value">${totalCost.toFixed(4)}</span>
                    </div>
                  </section>
                )}
              </div>
            )}

            {activeTab === "json" && step0Json && (
              <div className="tab-pane">
                <pre className="json-box">{step0Json}</pre>
              </div>
            )}

            {activeTab === "markdown" && markdownOutput && (
              <div className="tab-pane">
                <textarea className="md-box" readOnly value={markdownOutput} />
              </div>
            )}

            {lessonsJsons.map((L, idx) => (
              activeTab === `lesson-${idx}` && (
                <div key={idx} className="tab-pane">
                  <pre className="json-box">{JSON.stringify(L, null, 2)}</pre>
                </div>
              )
            ))}
          </div>
        </section>

        {/* CKEditor / Preview */}
        <section className="card section-editor" ref={resultsRef}>
          <div className="card-header" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="card-icon">✏️</div>
              <div>
                <h2 className="card-title">CKEditor / Markdown Preview</h2>
                <p className="card-subtitle">Final generated teaching materials</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {isEditing && previewHtml && (
                <button id="finishEditBtn" className="btn btn-success" onClick={handleFinishEdit}>
                  Finish Editing
                </button>
              )}
              {!isEditing && previewHtml && (
                <button id="editAgainBtn" className="btn btn-info" onClick={handleEditAgain}>
                  Edit Again
                </button>
              )}
            </div>
          </div>


          {/* CKEditor mount point – always in DOM so editor stays alive */}
          <div
            style={{ display: isEditing ? "block" : "none" }}
          >
            <div ref={editorRef} id="editor" />
          </div>

          {/* Preview HTML */}
          {!isEditing && previewHtml && (
            <div
              id="markdownPreview"
              className="preview-html"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          )}

          {!previewHtml && (
            <div className="editor-placeholder">
              Generate a lesson plan to see the preview here.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
