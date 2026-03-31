(() => {
    "use strict";

    const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";
    const $ = (id) => document.getElementById(id);

    const els = {
        apiKey: () => $("apiKey"),
        model: () => $("modelSelect"),
        language: () => $("languageSelect"),
        lessonName: () => $("workItemTitle"),
        subject: () => $("subject"),
        gradeLevel: () => $("gradeLevel"),
        lessonDescription: () => $("lessonDescription"),
        lessonContext: () => $("lessonContext"),
        questionList: () => $("questionList"),
        promptTemplate: () => $("promptTemplate"),
        schemaTemplate: () => $("schemaTemplate"),
        runBtn: () => $("runBtn"),
        cancelBtn: () => $("cancelBtn"),
        status: () => $("status"),
        log: () => $("log"),
        jsonOutput: () => $("jsonOutput"),
        previewContainer: () => $("previewContainer")
    };

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

    function logLine(line) {
        const log = els.log();
        if (!log) return;
        log.value += (log.value ? "\n" : "") + line;
        log.scrollTop = log.scrollHeight;
    }

    function setStatus(msg) {
        const el = els.status();
        if (el) el.textContent = msg || "";
    }

    function setRunning(running) {
        isRunning = running;
        els.runBtn().disabled = running;
        els.cancelBtn().disabled = !running;
    }

    function fillTemplate(tpl, vars) {
        return tpl.replace(/\{([A-Za-z0-9_]+)\}/g, (match, key) => {
            const v = vars[key];
            return v === undefined || v === null ? match : String(v);
        });
    }

    function updateTemplates(lang) {
        const p = window.hintsPrompts[lang] || window.hintsPrompts.en;
        
        // Update Templates
        els.promptTemplate().value = (p.HINTS_PROMPT || "").trim();
        els.schemaTemplate().value = JSON.stringify(p.HINTS_SCHEMA, null, 2);
        
        // Update Lesson Context
        els.lessonContext().value = (window.hintsPrompts.lessonContext[lang] || window.hintsPrompts.lessonContext.en).trim();
        
        // Update Meta Variables
        if (p.meta) {
            els.lessonName().value = p.meta.workItemTitle;
            els.subject().value = p.meta.subject;
            els.gradeLevel().value = p.meta.gradeLevel;
            els.lessonDescription().value = p.meta.lessonDescription;
        }

        // Update Question List
        populateQuestions(lang);
    }

    function populateQuestions(lang) {
        const container = els.questionList();
        container.innerHTML = "";
        const questions = window.hintsPrompts.sampleQuestions[lang] || window.hintsPrompts.sampleQuestions.en;
        
        questions.forEach((q, i) => {
            const div = document.createElement("div");
            div.className = "question-check-item";
            div.innerHTML = `
                <input type="checkbox" id="q-${i}" value="${i}" checked />
                <label for="q-${i}">
                    <strong>${q.questionType === 1 ? '[MC]' : (q.questionType === 4 ? '[TF]' : '[OR]')}</strong> 
                    ${q.question}
                </label>
            `;
            container.appendChild(div);
        });
    }

    function renderPreview(data, questions) {
        const container = els.previewContainer();
        container.innerHTML = "";

        if (!data || !data.hints || !Array.isArray(data.hints)) {
            container.innerHTML = "<p style='color:red;'>Invalid response format: 'hints' array missing.</p>";
            return;
        }

        const lang = els.language().value;
        const labels = window.hintsPrompts[lang]?.labels || window.hintsPrompts.en.labels;

        data.hints.forEach((hint, idx) => {
            const q = questions[idx] || { question: "Unknown Question" };
            const card = document.createElement("div");
            card.className = "hint-card";
            card.innerHTML = `<h4 style="margin-top:0;">Question ${idx + 1}: ${q.question}</h4>`;

            const sections = [
                { label: "💡 INITIAL HINT", content: hint.initial_hint, class: "hint-1" },
                { label: "💡 FOLLOW-UP HINT", content: hint.follow_up_hint, class: "hint-2" },
                { label: "📘 RE-TEACH", content: hint.reteach_hint, class: "reteach" }
            ];

            sections.forEach(s => {
                const sec = document.createElement("div");
                sec.className = `hint-section ${s.class}`;
                sec.innerHTML = `
                    <div class="hint-label">${s.label}</div>
                    <div class="hint-content">${s.content}</div>
                `;
                card.appendChild(sec);
            });

            // Validation section (Correct Answer)
            if (q.correctAnswerText) {
                const validationSec = document.createElement("div");
                validationSec.style.marginTop = "15px";
                validationSec.style.padding = "12px";
                validationSec.style.background = "#f0f0f0";
                validationSec.style.borderRadius = "8px";
                validationSec.style.border = "1px solid #ddd";
                validationSec.innerHTML = `
                    <div style="font-size: 13px; font-weight: bold; color: #666; margin-bottom: 5px;">${labels.correctAnswer}</div>
                    <div style="font-size: 14px; color: #111; font-weight: 600;">${q.correctAnswerText}</div>
                `;
                card.appendChild(validationSec);
            }

            container.appendChild(card);
        });
    }

    async function callApiStream({ endpoint, apiKey, model, prompt, schemaObj, signal }) {
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
                    name: "HintsResponse",
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

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let finalText = "";
        let streamClosed = false;

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

        try {
            while (!streamClosed) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const parsed = parseSseLines(buffer);
                buffer = parsed.rest;
                for (const raw of parsed.events) {
                    if (raw === "[DONE]") { streamClosed = true; break; }
                    let evt;
                    try { evt = JSON.parse(raw); } catch { continue; }
                    if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
                        finalText += evt.delta;
                    }
                    if (evt.type === "response.completed" && evt.response?.usage) {
                        addTokenUsage(evt.response.usage);
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
        return finalText;
    }

    async function run() {
        if (isRunning) return;

        const apiKey = els.apiKey().value.trim();
        const model = els.model().value;
        const lang = els.language().value;

        // Collect selected questions
        const selectedIndices = Array.from(els.questionList().querySelectorAll("input:checked")).map(i => parseInt(i.value));
        const questionsSource = window.hintsPrompts.sampleQuestions[lang] || window.hintsPrompts.sampleQuestions.en;
        const selectedQuestions = selectedIndices.map(i => questionsSource[i]);

        if (selectedQuestions.length === 0) {
            alert("Please select at least one question.");
            return;
        }

        const vars = {
            subject: els.subject().value,
            lesson_context: els.lessonContext().value,
            lesson_name: els.lessonName().value,
            lesson_description: els.lessonDescription().value,
            grade_level: els.gradeLevel().value,
            question_data: JSON.stringify(selectedQuestions.map(q => ({
                question: q.question,
                answers: q.answers,
                correct_answers: q.correctAnswers,
                question_type: q.questionType
            }))),
            response_language: lang === 'sr' ? 'Serbian' : 'English'
        };

        const promptTemplate = els.promptTemplate().value;
        let schemaObj;
        try {
            schemaObj = JSON.parse(els.schemaTemplate().value);
        } catch (e) {
            alert("Invalid JSON Schema.");
            return;
        }

        const finalPrompt = fillTemplate(promptTemplate, vars);
        
        els.log().value = "";
        els.jsonOutput().value = "";
        els.previewContainer().innerHTML = "<p>Generating...</p>";

        setRunning(true);
        setStatus("Generating...");
        resetTokenUsage();
        currentAbortController = new AbortController();

        try {
            logLine("Sending request to AI...");
            const resultText = await callApiStream({
                endpoint: DEFAULT_ENDPOINT,
                apiKey,
                model,
                prompt: finalPrompt,
                schemaObj,
                signal: currentAbortController.signal
            });

            els.jsonOutput().value = resultText;
            
            try {
                const data = JSON.parse(resultText);
                renderPreview(data, selectedQuestions);
                logLine("Successfully generated hints.");
            } catch (e) {
                logLine("Error parsing JSON response.");
                els.previewContainer().innerHTML = "<p style='color:red;'>Error parsing JSON.</p>";
            }

            setStatus("Done.");
            updateTokenSummaryUI(model);
        } catch (err) {
            if (currentAbortController?.signal?.aborted) {
                setStatus("Canceled.");
                logLine("Request canceled.");
            } else {
                setStatus("Error.");
                logLine("Error: " + err.message);
            }
        } finally {
            setRunning(false);
            currentAbortController = null;
        }
    }

    function cancel() {
        if (currentAbortController) currentAbortController.abort();
    }

    els.language().addEventListener("change", (e) => {
        updateTemplates(e.target.value);
    });
    els.runBtn().addEventListener("click", run);
    els.cancelBtn().addEventListener("click", cancel);

    // Init - Default to English
    updateTemplates("en");

})();
