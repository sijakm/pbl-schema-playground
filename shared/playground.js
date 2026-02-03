(function () {
    "use strict";
  
    const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";
  
    function normalizeConfig(cfg) {
      cfg = cfg || {};
      return {
        title: cfg.title ?? "JSON Schema Playground",
        subtitle:
          cfg.subtitle ??
          "Edit the prompt and schema descriptions, then stream the response into the output.",
        pillText: cfg.pillText ?? "Streaming",
  
        endpoint: cfg.endpoint ?? DEFAULT_ENDPOINT,
        schemaResponseName: cfg.schemaResponseName ?? "Response",
  
        masterSchema: cfg.masterSchema, // REQUIRED
        defaultPrompt: cfg.defaultPrompt ?? "",
  
        requireApiKey: !!cfg.requireApiKey,
  
        invalidCharRules: {
          allowNewlines: !!cfg.invalidCharRules?.allowNewlines,
          allowTabs: !!cfg.invalidCharRules?.allowTabs,
          allowNonASCII: !!cfg.invalidCharRules?.allowNonASCII
        },
  
        // optional override if you want completely custom validation:
        findInvalidChars: cfg.findInvalidChars,
  
        htmlPrompts: Array.isArray(cfg.htmlPrompts) ? cfg.htmlPrompts : [],
        renderParallel: cfg.renderParallel !== false,
  
        progressRenderIntervalMs: cfg.progressRenderIntervalMs ?? 500,
        stuckSeconds: cfg.stuckSeconds ?? 30,
        stuckCheckIntervalMs: cfg.stuckCheckIntervalMs ?? 4000,
        maxWhitespaceDeltas: cfg.maxWhitespaceDeltas ?? 1000,
  
        onReady: cfg.onReady
      };
    }
  
    function initPlayground(rawConfig) {
      const cfg = normalizeConfig(rawConfig);
  
      if (!cfg.masterSchema) {
        alert("Missing masterSchema in PLAYGROUND_CONFIG.");
        return;
      }
  
      // --- DOM helpers ---
      const $ = (id) => document.getElementById(id);
  
      const els = {
        pageTitle: () => $("pageTitle"),
        pagePill: () => $("pagePill"),
        pageSubtitle: () => $("pageSubtitle"),
  
        apiKey: () => $("apiKey"),
        modelSelect: () => $("modelSelect"),
        prompt: () => $("prompt"),
  
        descriptions: () => $("descriptions"),
        finalSchema: () => $("finalSchema"),
  
        output: () => $("output"),
        htmlOutput: () => $("htmlOutput"),
        htmlPreview: () => $("htmlPreview"),
  
        status: () => $("status"),
  
        runBtn: () => $("runBtn"),
        renderBtn: () => $("renderBtn"),
        cancelBtn: () => $("cancelBtn")
      };
  
      // --- state ---
      let timerInterval = null;
      let startTime = null;
  
      let lastJsonText = "";
      let lastJsonObject = null;
      let lastRenderedHtml = "";
  
      let parsedMasterSchema = null;
      let lastEditedSchema = null;
  
      let currentAbortController = null;
      let activeAbortControllers = [];
  
      // --- UI text ---
      document.title = cfg.title;
      if (els.pageTitle()) els.pageTitle().textContent = cfg.title;
      if (els.pageSubtitle()) els.pageSubtitle().textContent = cfg.subtitle;
      if (els.pagePill()) els.pagePill().textContent = cfg.pillText || "";
  
      function setRenderEnabled(enabled) {
        const btn = els.renderBtn();
        if (btn) btn.disabled = !enabled;
      }
  
      function setUiRunning(isRunning) {
        const runBtn = els.runBtn();
        const renderBtn = els.renderBtn();
        const cancelBtn = els.cancelBtn();
  
        if (runBtn) runBtn.disabled = isRunning;
        if (cancelBtn) cancelBtn.disabled = !isRunning;
  
        if (renderBtn) renderBtn.disabled = isRunning || !lastJsonObject;
      }
  
      // --- Timer ---
      function startTimer() {
        startTime = Date.now();
        const status = els.status();
        if (!status) return;
  
        if (timerInterval) clearInterval(timerInterval);
  
        timerInterval = setInterval(() => {
          const elapsedMs = Date.now() - startTime;
          const totalSeconds = Math.floor(elapsedMs / 1000);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
  
          status.textContent = `Running… ${minutes}:${String(seconds).padStart(
            2,
            "0"
          )}`;
        }, 500);
      }
  
      function stopTimer(finalMessage) {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
  
        const status = els.status();
        if (!status || !startTime) return;
  
        const elapsedMs = Date.now() - startTime;
        const totalSeconds = Math.floor(elapsedMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
  
        const label = finalMessage ? `${finalMessage} ` : "";
        status.textContent = `${label}(${minutes}:${String(seconds).padStart(
          2,
          "0"
        )})`;
      }
  
      // --- invalid char validation ---
      function defaultFindInvalidChars(text) {
        const issues = [];
  
        if (/[\u201C\u201D]/.test(text)) issues.push("Smart double quotes");
        if (/[\u2018\u2019]/.test(text)) issues.push("Smart single quotes");
        if (/[\u2013\u2014]/.test(text)) issues.push("Long dash (– or —)");
        if (/…/.test(text)) issues.push("Ellipsis (…)");
  
        if (/[\u2028\u2029]/.test(text)) issues.push("Invalid line separator");
  
        if (!cfg.invalidCharRules.allowNewlines && /[\r\n]/.test(text)) {
          issues.push("Line breaks are not allowed");
        }
        if (!cfg.invalidCharRules.allowTabs && /\t/.test(text)) {
          issues.push("Tabs are not allowed");
        }
  
        if (!cfg.invalidCharRules.allowNonASCII) {
          let t = text;
          if (cfg.invalidCharRules.allowNewlines) t = t.replace(/\r?\n/g, "");
          if (cfg.invalidCharRules.allowTabs) t = t.replace(/\t/g, "");
          if (/[^\x20-\x7E]/.test(t)) issues.push("Non-ASCII characters");
        }
  
        return issues;
      }
  
      const findInvalidChars =
        typeof cfg.findInvalidChars === "function"
          ? cfg.findInvalidChars
          : defaultFindInvalidChars;
  
      // --- schema description collection ---
      function collectDescriptions(schema, path = [], result = []) {
        if (!schema || typeof schema !== "object") return result;
  
        if (typeof schema.description === "string") {
          result.push({
            path: [...path, "description"],
            value: schema.description
          });
        }
  
        if (schema.properties) {
          for (const key in schema.properties) {
            collectDescriptions(schema.properties[key], [...path, "properties", key], result);
          }
        }
  
        if (schema.items) {
          collectDescriptions(schema.items, [...path, "items"], result);
        }
  
        return result;
      }
  
      function setValueAtPath(obj, path, value) {
        let current = obj;
        for (let i = 0; i < path.length - 1; i++) current = current[path[i]];
        current[path[path.length - 1]] = value;
      }
  
      function renderDescriptionEditor() {
        const container = els.descriptions();
        if (!container) return;
        container.innerHTML = "";
  
        const descriptions = collectDescriptions(parsedMasterSchema);
  
        descriptions.forEach((item) => {
          const wrapper = document.createElement("div");
          wrapper.style.marginBottom = "16px";
  
          const label = document.createElement("label");
          label.innerText = item.path
            .filter((p) => !["properties", "items", "description"].includes(p))
            .join(" → ");
          label.style.display = "block";
          label.style.fontWeight = "bold";
          label.style.marginBottom = "4px";
  
          const textarea = document.createElement("textarea");
          textarea.rows = 2;
          textarea.style.resize = "vertical";
          textarea.style.width = "100%";
          textarea.value = item.value;
          textarea.dataset.path = JSON.stringify(item.path);
  
          const warning = document.createElement("div");
          warning.style.color = "#b00020";
          warning.style.fontSize = "12px";
          warning.style.marginTop = "4px";
          warning.style.display = "none";
  
          const validateAndPaint = () => {
            const problems = findInvalidChars(textarea.value);
            if (problems.length > 0) {
              textarea.style.border = "2px solid #b00020";
              warning.style.display = "block";
              warning.textContent = "Invalid characters detected: " + problems.join(", ");
            } else {
              textarea.style.border = "";
              warning.style.display = "none";
              warning.textContent = "";
            }
          };
  
          textarea.addEventListener("input", validateAndPaint);
  
          wrapper.appendChild(label);
          wrapper.appendChild(textarea);
          wrapper.appendChild(warning);
          container.appendChild(wrapper);
  
          validateAndPaint();
        });
      }
  
      // --- copy schema ---
      function copySchema() {
        const textarea = els.finalSchema();
        if (!textarea || !textarea.value) {
          alert("Schema is empty.");
          return;
        }
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        navigator.clipboard
          .writeText(textarea.value)
          .then(() => alert("Schema copied to clipboard ✅"))
          .catch(() => alert("Failed to copy schema."));
      }
  
      // --- SSE parsing ---
      function parseSseLines(buffer) {
        const events = [];
        const parts = buffer.split("\n");
        const rest = parts.pop() ?? "";
  
        for (const line of parts) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (data) events.push(data);
        }
  
        return { events, rest };
      }
  
      function isUserNearBottom(el, threshold = 40) {
        return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      }
  
      // --- cancel ---
      function cancelRun() {
        if (currentAbortController) currentAbortController.abort();
        for (const ac of activeAbortControllers) {
          try { ac.abort(); } catch {}
        }
        activeAbortControllers = [];
      }
  
      // --- run main (schema -> JSON) ---
      async function run() {
        const output = els.output();
        const promptEl = els.prompt();
        const apiKeyEl = els.apiKey();
        const modelEl = els.modelSelect();
  
        if (!output || !promptEl || !modelEl) {
          alert("Missing required DOM elements (output/prompt/modelSelect).");
          return;
        }
  
        const invalidFields = [];
        document.querySelectorAll("#descriptions textarea").forEach((t) => {
          if (findInvalidChars(t.value).length > 0) invalidFields.push(t);
        });
  
        if (invalidFields.length > 0) {
          alert("Some fields contain invalid characters. Please fix highlighted fields.");
          return;
        }
  
        const schema = JSON.parse(JSON.stringify(parsedMasterSchema));
        document.querySelectorAll("#descriptions textarea").forEach((textarea) => {
          const path = JSON.parse(textarea.dataset.path);
          setValueAtPath(schema, path, textarea.value.trim());
        });
        lastEditedSchema = schema;
  
        if (els.finalSchema()) {
          els.finalSchema().value = JSON.stringify(schema, null, 2);
        }
  
        const apiKey = apiKeyEl ? apiKeyEl.value.trim() : "";
        const model = modelEl.value;
        const prompt = promptEl.value;
  
        output.value = "";
        setRenderEnabled(false);
        startTimer();
        setUiRunning(true);
  
        if (cfg.requireApiKey && !apiKey) {
          output.value = "API key is required.";
          stopTimer("Stopped");
          setUiRunning(false);
          return;
        }
  
        currentAbortController = new AbortController();
        const { signal } = currentAbortController;
  
        let lastDeltaAt = Date.now();
        let consecutiveWhitespaceCount = 0;
  
        const stuckInterval = setInterval(() => {
          const diff = Date.now() - lastDeltaAt;
          if (diff > cfg.stuckSeconds * 1000) {
            output.value += `\n\n[⚠️ No streamed output for ${(diff / 1000).toFixed(
              0
            )}s — The model is still thinking 🤔]\n`;
            output.scrollTop = output.scrollHeight;
            lastDeltaAt = Date.now();
          }
        }, cfg.stuckCheckIntervalMs);
  
        try {
          const response = await fetch(cfg.endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
            },
            signal,
            body: JSON.stringify({
              model,
              stream: true,
              reasoning: { effort: "low" },
              input: [{ role: "user", content: prompt }],
              text: {
                format: {
                  type: "json_schema",
                  name: cfg.schemaResponseName,
                  schema,
                  strict: true
                }
              }
            })
          });
  
          if (!response.ok) {
            const errText = await response.text().catch(() => "");
            output.value =
              `HTTP ${response.status} ${response.statusText}\n\n` +
              (errText || "(no body)");
            stopTimer("Error");
            return;
          }
  
          if (!response.body) {
            output.value = "No response body (stream not available in this environment).";
            stopTimer("Error");
            return;
          }
  
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";
          let finalText = "";
  
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
  
            buffer += decoder.decode(value, { stream: true });
            const parsed = parseSseLines(buffer);
            buffer = parsed.rest;
  
            for (const raw of parsed.events) {
              if (raw === "[DONE]") break;
  
              let evt;
              try { evt = JSON.parse(raw); } catch { continue; }
  
              if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
                lastDeltaAt = Date.now();
  
                if (evt.delta.trim().length === 0) consecutiveWhitespaceCount++;
                else consecutiveWhitespaceCount = 0;
  
                if (consecutiveWhitespaceCount >= cfg.maxWhitespaceDeltas) {
                  alert(
                    "⚠️ Model output stalled.\n\n" +
                      "Too many empty / whitespace tokens were received.\n" +
                      "The request was stopped. Please run again."
                  );
                  currentAbortController.abort();
                  break;
                }
  
                const shouldAutoScroll = isUserNearBottom(output);
                output.value += evt.delta;
                finalText += evt.delta;
                if (shouldAutoScroll) output.scrollTop = output.scrollHeight;
                continue;
              }
  
              if (evt.type === "response.refusal.delta" && typeof evt.delta === "string") {
                lastDeltaAt = Date.now();
                output.value += evt.delta;
                output.scrollTop = output.scrollHeight;
                continue;
              }
  
              if (evt.type === "error") {
                lastDeltaAt = Date.now();
                output.value += `\n\n[ERROR]\n${JSON.stringify(evt, null, 2)}\n`;
                output.scrollTop = output.scrollHeight;
                continue;
              }
            }
          }
  
          try {
            const parsedJson = JSON.parse(finalText);
            const pretty = JSON.stringify(parsedJson, null, 2);
  
            output.value = pretty;
            lastJsonObject = parsedJson;
            lastJsonText = pretty;
  
            setRenderEnabled(true);
          } catch {
            output.value +=
              "\n\n[⚠️ Could not parse JSON at end — leaving raw streamed output as-is.]\n";
            lastJsonObject = null;
            lastJsonText = "";
            setRenderEnabled(false);
          }
  
          stopTimer("Completed");
        } catch (err) {
          if (err?.name === "AbortError") {
            output.value += "\n\n[Cancelled]\n";
            stopTimer("Cancelled");
          } else {
            output.value += `\n\n[Fetch error]\n${err?.message || String(err)}\n`;
            stopTimer("Error");
          }
        } finally {
          clearInterval(stuckInterval);
          currentAbortController = null;
          setUiRunning(false);
        }
      }
  
      // --- render HTML (parallel prompts) ---
      async function renderHtml() {
        const output = els.output();
        const htmlOutput = els.htmlOutput();
        const htmlPreview = els.htmlPreview();
        const apiKeyEl = els.apiKey();
        const modelEl = els.modelSelect();
  
        if (!output || !htmlOutput || !modelEl) {
          alert("Missing required DOM elements for HTML rendering.");
          return;
        }
  
        const apiKey = apiKeyEl ? apiKeyEl.value.trim() : "";
        const model = modelEl.value;
  
        if (cfg.requireApiKey && !apiKey) {
          alert("API key is required.");
          return;
        }
  
        if (!lastJsonText || !lastJsonObject) {
          alert("No valid JSON found yet. Run the generation first.");
          return;
        }
  
        if (!cfg.htmlPrompts.length) {
          alert("No htmlPrompts configured for this playground.");
          return;
        }
  
        htmlOutput.value = "";
        lastRenderedHtml = "";
        if (htmlPreview) htmlPreview.srcdoc = "";
  
        output.value += "\n\n=== Rendering HTML (PARALLEL) ===\n";
        output.value +=
          "\n[progress] " +
          cfg.htmlPrompts.map((p) => `${p.name}:-`).join("  ");
        output.scrollTop = output.scrollHeight;
  
        startTimer();
        setUiRunning(true);
  
        let lastProgressRenderAt = 0;
        const htmlByPrompt = new Map();
        const progressMap = new Map();
  
        try {
          const tasks = cfg.htmlPrompts.map((p) => (async () => {
            const ac = new AbortController();
            activeAbortControllers.push(ac);
  
            let localHtml = "";
            let consecutiveWhitespaceCount = 0;
  
            const response = await fetch(cfg.endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
              },
              signal: ac.signal,
              body: JSON.stringify({
                model,
                stream: true,
                reasoning: { effort: "low" },
                input: [{ role: "user", content: p.build(lastJsonText, lastJsonObject) }]
              })
            });
  
            if (!response.ok || !response.body) {
              throw new Error(`${p.name} failed to start`);
            }
  
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";
  
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
  
              buffer += decoder.decode(value, { stream: true });
              const parsed = parseSseLines(buffer);
              buffer = parsed.rest;
  
              for (const raw of parsed.events) {
                if (raw === "[DONE]") break;
  
                let evt;
                try { evt = JSON.parse(raw); } catch { continue; }
  
                if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
                  if (evt.delta.trim().length === 0) consecutiveWhitespaceCount++;
                  else consecutiveWhitespaceCount = 0;
  
                  if (consecutiveWhitespaceCount >= cfg.maxWhitespaceDeltas) {
                    ac.abort();
                    throw new Error(`${p.name} stalled (whitespace flood)`);
                  }
  
                  localHtml += evt.delta;
                  progressMap.set(p.key, localHtml.length);
  
                  const now = Date.now();
                  if (now - lastProgressRenderAt > cfg.progressRenderIntervalMs) {
                    lastProgressRenderAt = now;
  
                    const progressLine = cfg.htmlPrompts
                      .map((x) => {
                        const v = progressMap.get(x.key);
                        return `${x.name}:${v ? Math.round(v / 1000) + "k" : "-"}`;
                      })
                      .join("  ");
  
                    output.value = output.value.replace(/\n\[progress][^\n]*$/, "");
                    output.value += `\n[progress] ${progressLine}`;
                    output.scrollTop = output.scrollHeight;
                  }
                }
              }
            }
  
            htmlByPrompt.set(p.key, localHtml);
          })());
  
          if (cfg.renderParallel) {
            await Promise.all(tasks);
          } else {
            for (const t of tasks) await t;
          }
  
          lastRenderedHtml = cfg.htmlPrompts
            .map((p) => htmlByPrompt.get(p.key) || "")
            .join("");
  
          htmlOutput.value = lastRenderedHtml;
          if (htmlPreview) htmlPreview.srcdoc = lastRenderedHtml;
  
          output.value += "\n\n=== HTML Render Completed ===\n";
          stopTimer("Completed");
        } catch (err) {
          if (err?.name === "AbortError") {
            output.value += "\n\n[HTML Render Cancelled]\n";
            stopTimer("Cancelled");
          } else {
            output.value += `\n\n[HTML Render Error]\n${err?.message || String(err)}\n`;
            stopTimer("Error");
          }
        } finally {
          for (const ac of activeAbortControllers) {
            try { ac.abort(); } catch {}
          }
          activeAbortControllers = [];
          setUiRunning(false);
        }
      }
  
      function loadJsonAndEnableRender(jsonTextOrObj) {
        try {
          const parsed =
            typeof jsonTextOrObj === "string"
              ? JSON.parse(jsonTextOrObj)
              : jsonTextOrObj;
  
          lastJsonObject = parsed;
          lastJsonText = JSON.stringify(parsed, null, 2);
          setRenderEnabled(true);
  
          console.log("✅ JSON loaded. You can now click Render HTML.");
        } catch (e) {
          console.error("❌ Invalid JSON:", e);
        }
      }
  
      // --- init parse schema + first render ---
      try {
        parsedMasterSchema =
          typeof cfg.masterSchema === "string"
            ? JSON.parse(cfg.masterSchema)
            : cfg.masterSchema;
      } catch (e) {
        console.error("❌ Schema invalid:", e);
        alert("Schema failed to load.");
        return;
      }
  
      if (els.prompt()) els.prompt().value = cfg.defaultPrompt || "";
      renderDescriptionEditor();
      setRenderEnabled(false);
      setUiRunning(false);
  
      // expose for console / optional inline handlers
      window.run = run;
      window.renderHtml = renderHtml;
      window.cancelRun = cancelRun;
      window.copySchema = copySchema;
      window.loadJsonAndEnableRender = loadJsonAndEnableRender;
  
      // optional: auto-wire buttons (no inline onclick needed)
      const rb = els.runBtn();
      if (rb && !rb.getAttribute("onclick")) rb.addEventListener("click", run);
  
      const rdb = els.renderBtn();
      if (rdb && !rdb.getAttribute("onclick")) rdb.addEventListener("click", renderHtml);
  
      const cb = els.cancelBtn();
      if (cb && !cb.getAttribute("onclick")) cb.addEventListener("click", cancelRun);
  
      const copyBtn = $("copySchemaBtn");
      if (copyBtn && !copyBtn.getAttribute("onclick")) copyBtn.addEventListener("click", copySchema);
  
      if (typeof cfg.onReady === "function") {
        try { cfg.onReady(); } catch (e) { console.warn("onReady failed:", e); }
      }
    }
  
    window.initPlayground = initPlayground;
  })();
  