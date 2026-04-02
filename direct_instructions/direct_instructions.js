(() => {
  "use strict";

  // ---- Defaults ----
  const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";

  // ---- DOM helpers ----
  const $ = (id) => document.getElementById(id);

  const els = {
    apiKey: () => $("apiKey"),
    endpoint: () => $("endpoint"),
    model: () => $("modelSelect"),

    subject: () => $("subject"),
    name: () => $("name"),
    gradeLevel: () => $("gradeLevel"),
    classDuration: () => $("classDuration"),
    numberOfLessons: () => $("numberOfLessons"),
    standards: () => $("standards"),
    userPrompt: () => $("userPrompt"),
    learningPlans: () => $("learningPlans"),
    mediaContext: () => $("mediaContext"),
    attachedUnit: () => $("attachedUnit"),
    attachedLesson: () => $("attachedLesson"),
    unitEssentialQuestions: () => $("unitEssentialQuestions"),

    runChainBtn: () => $("runChainBtn"),
    cancelBtn: () => $("cancelBtn"),
    downloadPromptsBtn: () => $("downloadPromptsBtn"),
    status: () => $("status"),

    log: () => $("log"),
    step0Json: () => $("step0Json"),
    unitHtml: () => $("unitHtml"),
    lessonsBundle: () => $("lessonsBundle"),
    finalHtml: () => $("finalHtml"),
    htmlPreview: () => $("htmlPreview"),

    // Toggles
    toggleInputVariablesHeader: () => $("toggleInputVariablesHeader"),
    toggleInputVariablesBtn: () => $("toggleInputVariablesBtn"),
    inputVariablesContainer: () => $("inputVariablesContainer"),

    // Schema Editor
    toggleSchemaEditorHeader: () => $("toggleSchemaEditorHeader"),
    toggleSchemaEditorBtn: () => $("toggleSchemaEditorBtn"),
    schemaEditorContainer: () => $("schemaEditorContainer"),
    schemaStep0Tab: () => $("schemaStep0Tab"),
    schemaPerLessonTab: () => $("schemaPerLessonTab"),
    schemaStep0Editor: () => $("schemaStep0Editor"),
    schemaPerLessonEditor: () => $("schemaPerLessonEditor"),
    copySchemaBtn: () => $("copySchemaBtn")
  };

  // ---- state ----
  let currentAbortController = null;
  let isRunning = false;

  // ---- token usage tracking ----
  const tokenUsage = { input: 0, output: 0, total: 0, calls: 0 };

  function resetTokenUsage() {
    tokenUsage.input = 0; tokenUsage.output = 0; tokenUsage.total = 0; tokenUsage.calls = 0;
    const panel = $("tokenSummary");
    if (panel) panel.style.display = "none";
  }

  function addTokenUsage(usage) {
    if (!usage) return;
    tokenUsage.input += usage.input_tokens || 0;
    tokenUsage.output += usage.output_tokens || 0;
    tokenUsage.total += usage.total_tokens || 0;
    tokenUsage.calls += 1;
  }

  const MODEL_PRICING = {
    "gpt-5.4":       { input: 2.50,  output: 15.00 },
    "gpt-5.4-mini":  { input: 0.75,  output: 4.50  },
    "gpt-5.4-nano":  { input: 0.20,  output: 1.25  },
    "gpt-5-mini":    { input: 0.75,  output: 4.50  },
    "gpt-5.2":       { input: 2.50,  output: 15.00 }
  };

  function updateTokenSummaryUI(model) {
    const pricing = MODEL_PRICING[model] || { input: 0, output: 0 };
    const inputCost  = (tokenUsage.input  / 1_000_000) * pricing.input;
    const outputCost = (tokenUsage.output / 1_000_000) * pricing.output;
    const totalCost  = inputCost + outputCost;

    const fmt = n => n.toLocaleString("en-US");
    const fmtUSD = n => n < 0.01 ? `< $0.01` : `$${n.toFixed(4)}`;

    const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };

    set("tsInput",        fmt(tokenUsage.input));
    set("tsInputCost",    fmtUSD(inputCost));
    set("tsOutput",       fmt(tokenUsage.output));
    set("tsOutputCost",   fmtUSD(outputCost));
    set("tsTotal",        fmt(tokenUsage.total));
    set("tsTotalCost",    `${tokenUsage.calls} call${tokenUsage.calls !== 1 ? "s" : ""}`);
    set("tsCallCount",    String(tokenUsage.calls));
    set("tsModel",        model);
    set("tsTotalCostValue", `$${totalCost.toFixed(4)}`);

    const panel = $("tokenSummary");
    if (panel) panel.style.display = "block";
  }

  // ---- timing helpers ----
  function nowMs() {
    return (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
  }
  function fmtMs(ms) {
    if (!Number.isFinite(ms)) return "—";
    if (ms < 1000) return `${ms.toFixed(0)} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  }

  function setStatus(msg) {
    const el = els.status();
    if (el) el.textContent = msg || "";
  }

  function logLine(line) {
    const log = els.log();
    if (!log) return;
    log.value += (log.value ? "\n" : "") + line;
    log.scrollTop = log.scrollHeight;
  }

  function setRunning(running) {
    isRunning = running;
    const runBtn = els.runChainBtn();
    const cancelBtn = els.cancelBtn();
    if (runBtn) runBtn.disabled = running;
    if (cancelBtn) cancelBtn.disabled = !running;
  }

  const SchemaEditor = {
    schemas: { step0: null, perLesson: null, templates: { step0: "", perLesson: "" } },
    listenersBound: false,

    init() {
      const lang = document.getElementById('languageSelect')?.value || 'sr';
      const p = lang === 'sr' ? window.promptsSR : window.promptsEN;
      if (p) {
        this.schemas.step0 = JSON.parse(JSON.stringify(p.STEP0_SCHEMA));
        this.schemas.perLesson = JSON.parse(JSON.stringify(p.PER_LESSON_SCHEMA));
        this.schemas.templates.step0 = p.STEP0_PROMPT_TEMPLATE;
        this.schemas.templates.perLesson = p.PER_LESSON_PROMPT_TEMPLATE;
      }
      this.render();
      this.bindEvents();
    },

    render() {
      const renderTab = (type, container) => {
        const schema = this.schemas[type];
        const template = this.schemas.templates[type];

        container.innerHTML = `
          <!-- Template Section -->
          <div class="schema-section">
            <div class="schema-section-header">
              <strong>Prompt Template</strong>
              <button class="btn btn-outline btn-pill" onclick="SchemaEditor.copyTemplateUI('${type}')">Copy Template</button>
            </div>
            <textarea class="prompt-template-textarea" data-type="${type}">${template}</textarea>
          </div>

          <!-- Schema Section -->
          <div class="schema-section" style="border-bottom: none;">
            <div class="schema-section-header">
              <strong>JSON Output Schema (Instructions)</strong>
              <div>
                <button class="btn btn-success btn-pill" onclick="SchemaEditor.addPropertyUI('${type}', '')">+ Add Top-Level Property</button>
                <button class="btn btn-outline btn-pill" onclick="SchemaEditor.copySchemaUI('${type}')">Copy Schema JSON</button>
              </div>
            </div>
            <div class="schema-tree-root">
              ${this.renderNode(type, schema, "", [], "")}
            </div>
          </div>
        `;

        // Resize and Listen to Template
        const templateTa = container.querySelector(".prompt-template-textarea");
        if (templateTa) {
          this.autoResize(templateTa);
          templateTa.addEventListener("input", (e) => {
            this.schemas.templates[type] = e.target.value;
            this.autoResize(e.target);
          });
        }

        // Resize and Listen to Schema textareas
        setTimeout(() => {
          container.querySelectorAll(".schema-textarea").forEach(ta => this.autoResize(ta));
        }, 10);

        container.querySelectorAll(".schema-textarea").forEach(ta => {
          ta.addEventListener("input", (e) => {
            this.updateDescription(type, e.target.dataset.path, e.target.value);
            this.autoResize(e.target);
          });
        });

        // Toggle buttons
        container.querySelectorAll(".node-header.collapsible").forEach(header => {
          header.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn")) return;
            header.classList.toggle("collapsed");
            const children = header.nextElementSibling;
            if (children) {
              children.classList.toggle("hidden");
              if (!children.classList.contains("hidden")) {
                children.querySelectorAll(".schema-textarea").forEach(ta => this.autoResize(ta));
              }
            }
          });
        });
      };

      if (els.schemaStep0Editor()) renderTab("step0", els.schemaStep0Editor());
      if (els.schemaPerLessonEditor()) renderTab("perLesson", els.schemaPerLessonEditor());
    },

    renderNode(type, node, name, pathArr, inheritedColor) {
      const isRoot = pathArr.length === 0;
      const depth = pathArr.length;
      let colorClass = inheritedColor;
      if (depth === 2 && pathArr[0] === "properties") colorClass = this.getPhaseColor(name);

      const label = isRoot ? "Root Object" : name;
      const nodeType = node.type || (node.properties ? "object" : "unknown");
      const isCollapsible = node.properties || (node.items && node.items.properties);

      let parentName = "";
      if (depth >= 4) parentName = pathArr[depth - 2];

      let html = `<div class="schema-field-group">`;
      html += `
        <div class="node-header ${isCollapsible ? "collapsible" : ""}" data-path="${pathArr.join(".")}">
          <div class="field-header" style="flex: 1;">
            <div>
              <span class="schema-label">${this.formatLabel(label)}</span>
              <span class="schema-type-badge">${nodeType}</span>
              ${parentName && node.description !== undefined ? `<span class="schema-phase-badge">${this.formatLabel(parentName)}</span>` : ""}
            </div>
            <div class="node-actions">
               ${nodeType === "object" ? `<button class="btn btn-success btn-pill" style="width: 24px; height: 24px; padding: 0;" title="Add Child" onclick="SchemaEditor.addPropertyUI('${type}', '${pathArr.join(".")}')">+</button>` : ""}
               ${isRoot ? "" : `<button class="btn btn-danger btn-pill" style="width: 24px; height: 24px; padding: 0;" title="Delete" onclick="SchemaEditor.removePropertyUI('${type}', '${pathArr.join(".")}')">−</button>`}
            </div>
          </div>
        </div>
      `;

      html += `<div class="children-container ${isCollapsible ? "schema-tree-node" : ""} ${colorClass}">`;
      if (node.description !== undefined) {
        html += `<textarea class="schema-textarea" data-path="${pathArr.join(".")}">${node.description}</textarea>`;
      }
      if (node.properties) {
        for (const key in node.properties) {
          html += this.renderNode(type, node.properties[key], key, [...pathArr, "properties", key], colorClass);
        }
      }
      if (node.items) {
        if (node.items.properties || node.items.description !== undefined) {
          html += this.renderNode(type, node.items, name + " Item", [...pathArr, "items"], colorClass);
        }
      }
      html += `</div></div>`;
      return html;
    },

    getPhaseColor(name) {
      const colors = {
        Question: "color-blue", Research: "color-green", Hypothesize: "color-orange",
        Experiment: "color-purple", Analyze: "color-pink", Share: "color-teal",
        ReviewAndSpacedRetrieval: "color-gray", StudentPractice: "color-gray", FormativeAssessment: "color-gray",
        UnitDescription: "color-blue", Lessons: "color-green"
      };
      return colors[name] || "color-gray";
    },

    bindEvents() {
      // Toggle Schema Editor
      const seHeader = els.toggleSchemaEditorHeader();
      const seContainer = els.schemaEditorContainer();
      const seBtn = els.toggleSchemaEditorBtn();
      if (seHeader && seContainer && seBtn) {
        seHeader.addEventListener("click", () => {
          const isHidden = seContainer.style.display === "none";
          seContainer.style.display = isHidden ? "block" : "none";
          seBtn.textContent = isHidden ? "Hide Editor" : "Show Editor";
        });
      }

      const step0Tab = els.schemaStep0Tab();
      const perLessonTab = els.schemaPerLessonTab();
      if (step0Tab && perLessonTab) {
        step0Tab.addEventListener("click", () => {
          step0Tab.classList.add("active-tab");
          perLessonTab.classList.remove("active-tab");
          els.schemaStep0Editor().style.display = "block";
          els.schemaPerLessonEditor().style.display = "none";
          setTimeout(() => {
            els.schemaStep0Editor().querySelectorAll("textarea").forEach(ta => this.autoResize(ta));
          }, 0);
        });
        perLessonTab.addEventListener("click", () => {
          perLessonTab.classList.add("active-tab");
          step0Tab.classList.remove("active-tab");
          els.schemaPerLessonEditor().style.display = "block";
          els.schemaStep0Editor().style.display = "none";
          setTimeout(() => {
            els.schemaPerLessonEditor().querySelectorAll("textarea").forEach(ta => this.autoResize(ta));
          }, 0);
        });
      }

      this.listenersBound = true;
    },

    autoResize(ta) {
      if (!ta || ta.offsetHeight === 0) return;
      ta.style.height = "1px";
      ta.style.height = (ta.scrollHeight + 2) + "px";
    },

    updateDescription(type, path, val) {
      const schema = this.schemas[type];
      const parts = path.split(".");
      let curr = schema;
      for (const p of parts) curr = curr[p];
      curr.description = val;
    },

    addPropertyUI(type, parentPath) {
      const name = prompt("Name of the new property (e.g. LessonSummary):");
      if (!name) return;
      const t = prompt("Type (string / number / integer / object / array):", "string");
      if (!t) return;
      this.addProperty(type, parentPath, name, t);
      this.render();
    },

    addProperty(type, parentPath, name, propType) {
      const schema = this.schemas[type];
      let parentObj = schema;
      if (parentPath) {
        const parts = parentPath.split(".");
        for (const p of parts) parentObj = parentObj[p];
      }
      if (!parentObj.properties) parentObj.properties = {};
      if (!parentObj.required) parentObj.required = [];
      const newProp = { type: propType, description: "" };
      if (propType === "object") {
        newProp.properties = {};
        newProp.required = [];
        newProp.additionalProperties = false;
      } else if (propType === "array") {
        newProp.items = { type: "string" };
      }
      parentObj.properties[name] = newProp;
      if (!parentObj.required.includes(name)) parentObj.required.push(name);
      if (parentObj.type === "object") parentObj.additionalProperties = false;
    },

    removePropertyUI(type, path) {
      if (confirm(`Are you sure you want to delete ${path}?`)) {
        this.removeProperty(type, path);
        this.render();
      }
    },

    removeProperty(type, path) {
      const schema = this.schemas[type];
      const parts = path.split(".");
      const propName = parts.pop();
      let parentObj = schema;
      for (const p of parts) parentObj = parentObj[p];
      if (parentObj.properties) delete parentObj.properties[propName];
      if (parentObj.required) parentObj.required = parentObj.required.filter(r => r !== propName);
    },

    copyTemplateUI(type) {
      const text = this.schemas.templates[type];

      // Detect required placeholders based on EXACT lists provided by user
      const required = type === "step0" 
        ? ["Subject", "Name", "UserPrompt", "GradeLevel", "ClassDuration", "Standards", "LearningPlans", "MediaContext", "AttachedUnit", "NumberOfItems"]
        : ["Subject", "Name", "UserPrompt", "GradeLevel", "ClassDuration", "MediaContext", "ParentUnitData", "Standards", "AttachedLesson", "UnitEssentialQuestions", "LearningPlans"];

      const missing = required.filter(key => {
        // Regex to match {{key}}, {{$key}}, {{{key}}}, etc.
        const regex = new RegExp(`\\{\\{\\{?\\$?${key}\\}\\}\\}?`, "i");
        return !regex.test(text);
      });

      if (missing.length > 0) {
        const msg = `WARNING: The following required variables are missing from your template: ${missing.join(", ")}.\n\nThis will likely break the generation process because the AI won't receive these parameters.\n\nDo you still want to copy to clipboard?`;
        if (!confirm(msg)) return;
      }

      navigator.clipboard.writeText(text).then(() => {
        alert("Template copied to clipboard!");
      });
    },

    copySchemaUI(type) {
      const modified = this.schemas[type];
      const json = JSON.stringify(modified, null, 2);
      navigator.clipboard.writeText(json).then(() => {
        alert("Schema JSON copied to clipboard!");
      });
    },

    getModifiedSchema(type) {
      return JSON.parse(JSON.stringify(this.schemas[type]));
    },

    getModifiedTemplate(type) {
      return this.schemas.templates[type];
    },

    formatLabel(pathOrName) {
      const name = pathOrName.split(".").pop();
      return name.replace(/([A-Z])/g, " $1").trim();
    }
  };

  // Expose to window globally for onclick handlers in index.html
  window.SchemaEditor = SchemaEditor;

  // ---- flexible template substitution ----
  function fillTemplate(tpl, vars) {
    // Supports {{$Key}}, {{Key}}, and {{{Key}}}
    return tpl.replace(/\{\{\{?\$?([A-Za-z0-9_]+)\}\}\}?/g, (match, key) => {
      const v = vars[key];
      return v === undefined || v === null ? match : String(v);
    });
  }

  // ---- SSE parsing ----
  function parseSseLines(text) {
    const events = [];
    let rest = text;

    while (true) {
      const idx = rest.indexOf("\n\n");
      if (idx === -1) break;

      const chunk = rest.slice(0, idx);
      rest = rest.slice(idx + 2);

      const lines = chunk.split("\n");
      for (const ln of lines) {
        const m = ln.match(/^data:\s?(.*)$/);
        if (m) events.push(m[1]);
      }
    }

    return { events, rest };
  }

  async function callResponsesApiStream({ endpoint, apiKey, model, prompt, schemaName, schemaObj, signal }) {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

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

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}${errText ? `\n${errText}` : ""}`);
    }
    if (!res.body) throw new Error("No response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    let finalText = "";
    let streamClosed = false;

    try {
      while (!streamClosed) {
        const { value, done } = await reader.read();
        if (done) {
          streamClosed = true;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parsed = parseSseLines(buffer);
        buffer = parsed.rest;

        for (const raw of parsed.events) {
          if (raw === "[DONE]") {
            streamClosed = true;
            break;
          }

          let evt;
          try {
            evt = JSON.parse(raw);
          } catch (e) {
            console.warn("Ignored non-JSON event:", raw);
            continue;
          }

          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            finalText += evt.delta;
          }

          if (evt.type === "response.completed" && evt.response?.usage) {
            addTokenUsage(evt.response.usage);
          }

          if (evt.type === "response.error") {
            throw new Error(evt.error?.message || "Unknown model error");
          }
        }
      }

      if (buffer.trim() && !streamClosed) {
        const lines = buffer.split("\n");
        for (const ln of lines) {
          const m = ln.match(/^data:\s?(.*)$/);
          const raw = m ? m[1] : ln.trim();
          if (raw === "[DONE]") break;
          try {
            const evt = JSON.parse(raw);
            if (evt.delta) finalText += evt.delta;
          } catch { }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return finalText;
  }

  function buildVarsFromUi() {
    return {
      Subject: els.subject()?.value?.trim() || "",
      Name: els.name()?.value?.trim() || "",
      UserPrompt: els.userPrompt()?.value?.trim() || "",
      GradeLevel: els.gradeLevel()?.value?.trim() || "",
      ClassDuration: els.classDuration()?.value?.trim() || "",
      NumberOfItems: els.numberOfLessons()?.value?.trim() || "",
      Standards: els.standards()?.value?.trim() || "",
      LearningPlans: els.learningPlans()?.value?.trim() || "",
      MediaContext: els.mediaContext()?.value?.trim() || "",
      AttachedUnit: els.attachedUnit()?.value?.trim() || "",
      AttachedLesson: els.attachedLesson()?.value?.trim() || ""
    };
  }

  function readUnitEQsOptional() {
    const raw = els.unitEssentialQuestions()?.value?.trim();
    if (!raw) return "";
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return JSON.stringify(arr);
    } catch { }
    return raw;
  }

  function buildUnitCommonJson(step0Obj, unitTitle) {
    return {
      UnitTitle: unitTitle,
      UnitDescription: step0Obj?.UnitDescription?.Description || "",
      EssentialQuestions: step0Obj?.UnitDescription?.EssentialQuestions || [],
      StudentLearningObjectives: step0Obj?.UnitDescription?.StudentLearningObjectives || [],
      StandardsAligned: step0Obj?.UnitDescription?.StandardsAligned || [],
      KeyVocabulary: step0Obj?.UnitDescription?.KeyVocabulary || []
    };
  }

  function dbg(label, payload) {
    console.log(`[DBG] ${label}`, payload);
  }

  function previewText(s, n = 400) {
    if (typeof s !== "string") return s;
    return s.length <= n ? s : s.slice(0, n) + "…";
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

  async function withRetry(taskFn, label, timeoutMs = 180000, maxRetries = 2) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        logLine(`[timeout] ${label} (Attempt ${attempt}) timed out after ${timeoutMs / 1000}s. Retrying...`);
        controller.abort();
      }, timeoutMs);

      try {
        const onGlobalAbort = () => controller.abort();
        if (currentAbortController) {
          currentAbortController.signal.addEventListener("abort", onGlobalAbort, { once: true });
        }

        const result = await taskFn(controller.signal);
        clearTimeout(timeoutId);
        if (currentAbortController) {
          currentAbortController.signal.removeEventListener("abort", onGlobalAbort);
        }
        return result;
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;

        const isGlobalAbort = currentAbortController && currentAbortController.signal.aborted;
        if (isGlobalAbort) throw err;

        if (attempt < maxRetries) {
          const reason = (controller.signal.aborted && !isGlobalAbort) ? "Timeout" : (err.message || "Unknown error");
          logLine(`[retry] ${label} failed (${reason}). Starting attempt ${attempt + 1}...`);
        }
      }
    }
    throw lastError;
  }

  async function runChain() {
    if (isRunning) return;

    const lang = document.getElementById('languageSelect')?.value || 'sr';
    const prompts = lang === 'sr' ? window.promptsSR : window.promptsEN;
    const {
      UNIT_COMMON_HTML_PROMPT_TEMPLATE,
      HTML_LESSON_PROMPT_TEMPLATE
    } = prompts;
    
    // Fallbacks just in case SchemaEditor isn't ready
    const STEP0_PROMPT_TEMPLATE = (window.SchemaEditor && window.SchemaEditor.getModifiedTemplate("step0")) || prompts.STEP0_PROMPT_TEMPLATE;
    const STEP0_SCHEMA = (window.SchemaEditor && window.SchemaEditor.getModifiedSchema("step0")) || prompts.STEP0_SCHEMA;
    const PER_LESSON_PROMPT_TEMPLATE = (window.SchemaEditor && window.SchemaEditor.getModifiedTemplate("perLesson")) || prompts.PER_LESSON_PROMPT_TEMPLATE;
    const PER_LESSON_SCHEMA = (window.SchemaEditor && window.SchemaEditor.getModifiedSchema("perLesson")) || prompts.PER_LESSON_SCHEMA;

    const HARDCODED_PASSWORD = ""; // Enter password here while working locally
    const apiKey = HARDCODED_PASSWORD || els.apiKey()?.value?.trim() || "";
    const endpoint = (els.endpoint()?.value?.trim() || DEFAULT_ENDPOINT).trim();
    const model = els.model()?.value || "gpt-5.4-mini";

    const vars = buildVarsFromUi();
    const numLessons = parseInt(vars.NumberOfItems, 10);

    if (!vars.Subject || !vars.Name || !vars.UserPrompt || !vars.GradeLevel || !vars.ClassDuration || !vars.NumberOfItems) {
      alert("Please fill in at least: Subject, Name, UserPrompt, GradeLevel, ClassDuration, NumberOfItems.");
      return;
    }

    if (els.log()) els.log().value = "";
    if (els.step0Json()) els.step0Json().value = "";
    if (els.unitHtml()) els.unitHtml().value = "";
    if (els.lessonsBundle()) els.lessonsBundle().value = "";
    if (els.finalHtml()) els.finalHtml().value = "";
    if (els.htmlPreview()) els.htmlPreview().srcdoc = "";
    resetTokenUsage();

    setRunning(true);
    setStatus("Running…");
    currentAbortController = new AbortController();

    const timings = {
      step0_outline_ms: 0,
      unit_common_html_ms: 0,
      per_lesson_json_ms: [],
      per_lesson_html_ms: [],
      all_lessons_json_parallel_ms: 0,
      all_lessons_html_parallel_ms: 0,
      join_final_ms: 0,
      total_ms: 0
    };
    const tTotal0 = nowMs();

    try {
      // ---- Step 0: outline ----
      const t0 = nowMs();
      logLine("[1/5] Step 0: generating unit outline JSON…");
      const step0Prompt = fillTemplate(STEP0_PROMPT_TEMPLATE, vars);
      console.log("[DEBUG] Step 0 Prompt (Unit Outline):", step0Prompt);

      const step0JsonText = await withRetry((signal) =>
        callResponsesApiStream({
          endpoint, apiKey, model,
          prompt: step0Prompt,
          schemaName: "UnitPlanResponse",
          schemaObj: STEP0_SCHEMA,
          signal
        }), "Step 0 Outline");

      let step0Obj;
      try {
        step0Obj = JSON.parse(step0JsonText);
      } catch (e) {
        throw new Error("Step 0 did not return valid JSON.\n\n" + step0JsonText.slice(0, 1200));
      }

      if (els.step0Json()) els.step0Json().value = JSON.stringify(step0Obj, null, 2);
      timings.step0_outline_ms = nowMs() - t0;
      logLine(`[OK] Step 0 JSON received. (${fmtMs(timings.step0_outline_ms)})`);

      // ---- Common unit HTML ----
      const t1 = nowMs();
      logLine("[2/5] Rendering common unit HTML…");
      const unitCommonJson = buildUnitCommonJson(step0Obj, vars.Name);
      const unitHtmlPrompt = fillTemplate(UNIT_COMMON_HTML_PROMPT_TEMPLATE, {
        UnitCommonJson: JSON.stringify(unitCommonJson),
        JsonResponse: JSON.stringify(unitCommonJson) // direct_instructions.js use JsonResponse
      });
      console.log("[DEBUG] Unit Common HTML Prompt:", unitHtmlPrompt);

      const unitHtml = await withRetry((signal) =>
        callResponsesApiStream({
          endpoint, apiKey, model,
          prompt: unitHtmlPrompt,
          signal
        }), "Unit Common HTML");

      if (els.unitHtml()) els.unitHtml().value = unitHtml;
      timings.unit_common_html_ms = nowMs() - t1;
      logLine(`[OK] Common unit HTML received. (${fmtMs(timings.unit_common_html_ms)})`);

      // ---- Per-lesson JSON (PARALLEL) ----
      const lessons = Array.isArray(step0Obj?.Lessons) ? step0Obj.Lessons : [];
      const limit = createLimiter(4);
      const tJsonAll0 = nowMs();
      logLine(`[3/5] Generating lesson JSON in parallel (${lessons.length} lessons)…`);

      const lessonJsonPromises = lessons.map((L, i) =>
        limit(() =>
          withRetry(async (signal) => {
            const ti0 = nowMs();
            const perLessonVars = {
              ...vars,
              UnitEssentialQuestions: (step0Obj?.UnitDescription?.EssentialQuestions || []).join("\n"),
              // Since the prompt file cannot be changed, we include both unit and lesson-specific 
              // context in the ParentUnitData field which is present in the original template.
              ParentUnitData: `UNIT DESCRIPTION: ${step0Obj.UnitDescription.Description}\n\nCURRENT LESSON CONTEXT (MUST follow these constraints):\n- Lesson Number: ${L.lessonNumber ?? (i + 1)}\n- Lesson Title: ${L.lessonTitle ?? ""}\n- Lesson Outline: ${L.lessonOutline ?? ""}`
            };

            const perLessonPrompt = fillTemplate(PER_LESSON_PROMPT_TEMPLATE, perLessonVars);
            console.log(`[DEBUG] Lesson ${i + 1} JSON Prompt:`, perLessonPrompt);

            const lessonJsonText = await callResponsesApiStream({
              endpoint, apiKey, model,
              prompt: perLessonPrompt,
              schemaName: "LessonPlanResponse",
              schemaObj: PER_LESSON_SCHEMA,
              signal
            });

            let lessonObj = JSON.parse(lessonJsonText);
            const dur = nowMs() - ti0;
            timings.per_lesson_json_ms[i] = dur;
            logLine(`[OK] Lesson ${i + 1}/${lessons.length} JSON done. (${fmtMs(dur)})`);
            return lessonObj;
          }, `Lesson ${i + 1} JSON`)
        )
      );

      const lessonJsons = await Promise.all(lessonJsonPromises);
      timings.all_lessons_json_parallel_ms = nowMs() - tJsonAll0;
      logLine(`[OK] All lesson JSON done. (${fmtMs(timings.all_lessons_json_parallel_ms)})`);

      // ---- Per-lesson HTML (PARALLEL) ----
      const tHtmlAll0 = nowMs();
      logLine(`[4/5] Rendering lesson HTML in parallel…`);
      const lessonHtmlPromises = lessonJsons.map((lessonObj, i) =>
        limit(() =>
          withRetry(async (signal) => {
            const ti0 = nowMs();
            const lessonHtmlPrompt = fillTemplate(HTML_LESSON_PROMPT_TEMPLATE, {
              LessonInquiryJson: JSON.stringify(lessonObj), // for compatibility
              JsonResponse: JSON.stringify(lessonObj),      // expected by direct_instructions prompts
              LessonNumber: i + 1,
              LessonTitle: step0Obj?.Lessons?.[i]?.lessonTitle || ""
            });
            console.log(`[DEBUG] Lesson ${i + 1} HTML Prompt:`, lessonHtmlPrompt);

            const lessonHtml = await callResponsesApiStream({
              endpoint, apiKey, model,
              prompt: lessonHtmlPrompt,
              signal
            });

            const dur = nowMs() - ti0;
            timings.per_lesson_html_ms[i] = dur;
            logLine(`[OK] Lesson ${i + 1}/${lessonJsons.length} HTML done. (${fmtMs(dur)})`);
            return lessonHtml;
          }, `Lesson ${i + 1} HTML`)
        )
      );

      const lessonHtmls = await Promise.all(lessonHtmlPromises);
      timings.all_lessons_html_parallel_ms = nowMs() - tHtmlAll0;

      // Bundle debug output
      if (els.lessonsBundle()) {
        els.lessonsBundle().value = lessonJsons.map((obj, i) =>
          `=== Lesson ${i + 1} JSON ===\n${JSON.stringify(obj, null, 2)}\n\n=== Lesson ${i + 1} HTML ===\n${lessonHtmls[i]}`
        ).join("\n\n");
      }

      // ---- Join final HTML ----
      const tJoin0 = nowMs();
      logLine("[5/5] Joining final HTML…");
      const finalHtml = [unitHtml, ...lessonHtmls].join("\n");
      if (els.finalHtml()) els.finalHtml().value = finalHtml;
      if (els.htmlPreview()) els.htmlPreview().srcdoc = finalHtml;

      timings.join_final_ms = nowMs() - tJoin0;
      timings.total_ms = nowMs() - tTotal0;

      logLine("\n===== TIMING SUMMARY =====");
      logLine(`Step 0 (outline): ${fmtMs(timings.step0_outline_ms)}`);
      logLine(`Unit common HTML: ${fmtMs(timings.unit_common_html_ms)}`);
      logLine(`All lessons JSON (parallel): ${fmtMs(timings.all_lessons_json_parallel_ms)}`);
      logLine(`All lessons HTML (parallel): ${fmtMs(timings.all_lessons_html_parallel_ms)}`);
      logLine(`TOTAL: ${fmtMs(timings.total_ms)}`);
      logLine("==========================");

      updateTokenSummaryUI(model);

      setStatus("Done.");
      logLine("[OK] Done.");
    } catch (err) {
      if (currentAbortController?.signal?.aborted) {
        setStatus("Canceled.");
        logLine("[canceled]");
      } else {
        setStatus("Error.");
        logLine("[error] " + (err?.message || String(err)));
        console.error(err);
      }
    } finally {
      setRunning(false);
      currentAbortController = null;
    }
  }

  function cancel() {
    if (currentAbortController) currentAbortController.abort();
  }

  async function downloadPrompts() {
    try {
      if (typeof JSZip === "undefined") {
        alert("JSZip library not loaded. Check your internet connection or CDN link.");
        return;
      }

      const zipEN = new JSZip();
      const zipSR = new JSZip();

      // window.promptsEN and window.promptsSR are defined in prompts.js / prompts_sr.js
      const pEN = window.promptsEN || {};
      const pSR = window.promptsSR || {};

      const addFiles = (zip, obj) => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === "object" && value !== null) {
            zip.file(`${key}.json`, JSON.stringify(value, null, 2));
          } else if (typeof value === "string") {
            zip.file(`${key}.txt`, value);
          }
        }
      };

      addFiles(zipEN, pEN);
      addFiles(zipSR, pSR);

      const contentEN = await zipEN.generateAsync({ type: "blob" });
      const contentSR = await zipSR.generateAsync({ type: "blob" });

      const saveZip = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };

      saveZip(contentEN, "direct_instructions_prompts_en.zip");
      setTimeout(() => {
        saveZip(contentSR, "direct_instructions_prompts_sr.zip");
      }, 500);

      logLine("[OK] Prompts downloaded successfully.");
    } catch (err) {
      logLine("[error] Failed to download prompts: " + err.message);
      console.error(err);
    }
  }

  function onReady() {
    const runBtn = els.runChainBtn();
    const cancelBtn = els.cancelBtn();
    const downloadBtn = els.downloadPromptsBtn();
    if (runBtn) runBtn.addEventListener("click", runChain);
    if (cancelBtn) cancelBtn.addEventListener("click", cancel);
    if (downloadBtn) downloadBtn.addEventListener("click", downloadPrompts);

    // Toggle Input Variables
    const ivHeader = els.toggleInputVariablesHeader();
    const ivContainer = els.inputVariablesContainer();
    const ivBtn = els.toggleInputVariablesBtn();
    if (ivHeader && ivContainer && ivBtn) {
      ivHeader.addEventListener("click", () => {
        const isHidden = ivContainer.style.display === "none";
        ivContainer.style.display = isHidden ? "block" : "none";
        ivBtn.textContent = isHidden ? "Hide Editor" : "Show Editor";
      });
    }

    SchemaEditor.init();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady);
  else onReady();
})();