import { useState, useRef, useCallback, useEffect } from "react";
import { marked } from "marked";
import JSZip from "jszip";
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
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [tokenUsage, setTokenUsage] = useState({ input: 0, output: 0, total: 0, calls: 0 });
  const [showTokens, setShowTokens] = useState(false);

  const abortRef = useRef(null);
  const editorRef = useRef(null);
  const ckeditorRef = useRef(null);
  const isInitializingRef = useRef(false);
  const logEndRef = useRef(null);

  // Prefill from config
  useEffect(() => {
    if (window.LOCAL_CONFIG?.apiKey && !apiKey) {
      setApiKey(window.LOCAL_CONFIG.apiKey);
    }
  }, []);

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    setMarkdownOutput("");
    setPreviewHtml("");
    setTokenUsage({ input: 0, output: 0, total: 0, calls: 0 });
    setShowTokens(false);
    setStatus("Running…");

    const controller = new AbortController();
    abortRef.current = controller;

    const endpoint = DEFAULT_ENDPOINT;
    const prompts = lang === "en" ? promptsEN : promptsSR;

    const accumUsage = { input: 0, output: 0, total: 0, calls: 0 };
    const onUsage = (u) => {
      accumUsage.input += u.input_tokens || 0;
      accumUsage.output += u.output_tokens || 0;
      accumUsage.total += u.total_tokens || 0;
      accumUsage.calls += 1;
      setTokenUsage({ ...accumUsage });
    };

    const t0Total = performance.now();

    try {
      // Step 0
      addLog("[1/3] Step 0: generating unit outline JSON…");
      const t0 = performance.now();
      const step0Prompt = fillTemplate(prompts.STEP0_PROMPT_TEMPLATE, vars);
      const step0JsonText = await withRetry(
        (signal) => callResponsesApiStream({ endpoint, apiKey, model, prompt: step0Prompt, schemaName: "UnitPlanResponse", schemaObj: prompts.STEP0_SCHEMA, signal, onUsage }),
        "Step 0 Outline",
        controller.signal,
        180000, 2,
        addLog
      );

      let step0Obj;
      try { step0Obj = JSON.parse(step0JsonText); }
      catch { throw new Error("Step 0 did not return valid JSON."); }

      setStep0Json(JSON.stringify(step0Obj, null, 2));
      addLog(`[OK] Step 0 JSON received. (${fmtMs(performance.now() - t0)})`);

      const unitCommonJson = buildUnitCommonJson(step0Obj, vars.Name);

      // Per-lesson JSON (parallel)
      const lessons = Array.isArray(step0Obj?.Lessons) ? step0Obj.Lessons : [];
      const limit = createLimiter(25);
      addLog(`[2/3] Generating lesson JSON in parallel (${lessons.length} lessons)…`);
      const tJson0 = performance.now();

      const lessonJsonPromises = lessons.map((L, i) =>
        limit(() =>
          withRetry(async (signal) => {
            const ti0 = performance.now();
            const perLessonVars = {
              ...vars,
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
            });
            const lessonObj = JSON.parse(lessonJsonText);
            addLog(`[OK] Lesson ${i + 1}/${lessons.length} JSON done. (${fmtMs(performance.now() - ti0)})`);
            return lessonObj;
          }, `Lesson ${i + 1} JSON`, controller.signal, 180000, 2, addLog)
        )
      );

      const lessonJsons = await Promise.all(lessonJsonPromises);
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

  const pricing = MODEL_PRICING[model] || { input: 0, output: 0 };
  const inputCost = (tokenUsage.input / 1_000_000) * pricing.input;
  const outputCost = (tokenUsage.output / 1_000_000) * pricing.output;
  const totalCost = inputCost + outputCost;
  const fmt = (n) => n.toLocaleString("en-US");
  const fmtUSD = (n) => (n < 0.01 ? "< $0.01" : `$${n.toFixed(4)}`);

  return (
    <div className="app-root">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-title-block">
            <h1 className="header-title">
              Collaborative Playground
              <span className="header-badge">Collaborative</span>
            </h1>
            <p className="header-subtitle">
              Runs: Step 0 outline JSON → per-lesson JSON → Markdown Output with CKEditor
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Config Card */}
        <section className="card section-config">
          <div className="card-header">
            <span className="card-icon">🔑</span>
            <h2 className="card-title">OpenAI / Proxy</h2>
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
        <section className="card section-inputs">
          <div className="card-header">
            <span className="card-icon">📝</span>
            <h2 className="card-title">Input Variables</h2>
            <p className="card-subtitle">Values substituted into prompt templates via <code>{"{{$Variable}}"}</code> placeholders.</p>
          </div>

          <div className="inputs-grid">
            <div>
              <label className="field-label" htmlFor="subject">Unit Subject</label>
              <input id="subject" className="field-input" value={subject} onChange={(e) => setSubject(e.target.value)} />

              <label className="field-label" htmlFor="unitName">Unit Name</label>
              <input id="unitName" className="field-input" value={unitName} onChange={(e) => setUnitName(e.target.value)} />

              <label className="field-label" htmlFor="gradeLevel">Grade Level</label>
              <input id="gradeLevel" className="field-input" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} />

              <div className="row-2col">
                <div>
                  <label className="field-label" htmlFor="classDuration">Class Duration (min)</label>
                  <input id="classDuration" type="number" min="1" className="field-input" value={classDuration} onChange={(e) => setClassDuration(e.target.value)} />
                </div>
                <div>
                  <label className="field-label" htmlFor="numberOfLessons">Number of Lessons</label>
                  <input id="numberOfLessons" type="number" min="1" className="field-input" value={numberOfLessons} onChange={(e) => setNumberOfLessons(e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="standards">Standards</label>
              <textarea id="standards" className="field-textarea h-sm" value={standards} onChange={(e) => setStandards(e.target.value)} />

              <label className="field-label" htmlFor="userPrompt">Unit Description / Instruction</label>
              <textarea id="userPrompt" className="field-textarea h-lg" value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} />

              <label className="field-label" htmlFor="learningPlans">Students with individualized support</label>
              <textarea id="learningPlans" className="field-textarea h-sm" value={learningPlans} onChange={(e) => setLearningPlans(e.target.value)} />
            </div>
          </div>

          <label className="field-label" htmlFor="mediaContext">Resources / Media to use</label>
          <textarea id="mediaContext" className="field-textarea h-sm" value={mediaContext} onChange={(e) => setMediaContext(e.target.value)} />

          <label className="field-label" htmlFor="attachedUnit">Unit Content (AttachedUnit)</label>
          <textarea id="attachedUnit" className="field-textarea h-md" value={attachedUnit} onChange={(e) => setAttachedUnit(e.target.value)} />

          <label className="field-label" htmlFor="attachedLesson">Attached Lesson Content (optional)</label>
          <textarea id="attachedLesson" className="field-textarea h-sm" value={attachedLesson} onChange={(e) => setAttachedLesson(e.target.value)} />

          <label className="field-label" htmlFor="unitEq">Unit Essential Questions (optional; used only by Review & Spaced Retrieval)</label>
          <textarea
            id="unitEq"
            className="field-textarea h-xs"
            placeholder={'Example: ["How... ?","How... ?","Why... ?"]'}
            value={unitEssentialQuestions}
            onChange={(e) => setUnitEssentialQuestions(e.target.value)}
          />
        </section>

        {/* Actions */}
        <section className="actions-bar">
          <button
            id="runChainBtn"
            className={`btn btn-primary ${isRunning ? "btn-running" : ""}`}
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

        {/* Token Summary */}
        {showTokens && (
          <section className="token-summary">
            <div className="ts-title">📊 Token Usage Summary</div>
            <div className="ts-grid">
              <div className="ts-stat">
                <div className="ts-label">Input Tokens</div>
                <div className="ts-value">{fmt(tokenUsage.input)}</div>
                <div className="ts-sub">{fmtUSD(inputCost)}</div>
              </div>
              <div className="ts-stat">
                <div className="ts-label">Output Tokens</div>
                <div className="ts-value">{fmt(tokenUsage.output)}</div>
                <div className="ts-sub">{fmtUSD(outputCost)}</div>
              </div>
              <div className="ts-stat">
                <div className="ts-label">Total Tokens</div>
                <div className="ts-value">{fmt(tokenUsage.total)}</div>
              </div>
              <div className="ts-stat">
                <div className="ts-label">API Calls</div>
                <div className="ts-value">{tokenUsage.calls}</div>
                <div className="ts-sub">{model}</div>
              </div>
            </div>
            <div className="ts-cost-bar">
              <span className="ts-cost-label">💵 Estimated Total Cost</span>
              <span className="ts-cost-value">${totalCost.toFixed(4)}</span>
            </div>
          </section>
        )}

        {/* Log */}
        <section className="card section-log">
          <div className="card-header">
            <span className="card-icon">🖥</span>
            <h2 className="card-title">Log</h2>
          </div>
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
        </section>

        {/* Step 0 JSON */}
        {step0Json && (
          <section className="card section-json">
            <div className="card-header">
              <span className="card-icon">📄</span>
              <h2 className="card-title">Step 0 JSON (UnitPlanResponse)</h2>
            </div>
            <pre className="json-box">{step0Json}</pre>
          </section>
        )}

        {/* Markdown Output */}
        {markdownOutput && (
          <section className="card section-markdown">
            <div className="card-header">
              <span className="card-icon">📝</span>
              <h2 className="card-title">Markdown Output</h2>
            </div>
            <textarea className="md-box" readOnly value={markdownOutput} />
          </section>
        )}

        {/* CKEditor / Preview */}
        <section className="card section-editor">
          <div className="card-header" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="card-icon">✏️</span>
              <h2 className="card-title">CKEditor / Markdown Preview</h2>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {isEditing && previewHtml && (
                <button id="finishEditBtn" className="btn btn-success btn-sm" onClick={handleFinishEdit}>
                  Završi uređivanje
                </button>
              )}
              {!isEditing && previewHtml && (
                <button id="editAgainBtn" className="btn btn-info btn-sm" onClick={handleEditAgain}>
                  Uredi ponovo
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
