(() => {
  "use strict";

  const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";
  const $ = (id) => document.getElementById(id);

  const els = {
    apiKey: () => $("apiKey"),
    model: () => $("modelSelect"),
    language: () => $("languageSelect"),
    numberOfQuestions: () => $("numberOfQuestions"),
    workItemTitle: () => $("workItemTitle"),
    subject: () => $("subject"),
    gradeLevel: () => $("gradeLevel"),
    context: () => $("context"),
    promptTemplate: () => $("promptTemplate"),
    schemaTemplate: () => $("schemaTemplate"),
    runBtn: () => $("runBtn"),
    cancelBtn: () => $("cancelBtn"),
    status: () => $("status"),
    log: () => $("log"),
    jsonOutput: () => $("jsonOutput"),
    previewContainer: () => $("previewContainer"),
    hintsPromptTemplate: () => $("hintsPromptTemplate"),
    hintsSchemaTemplate: () => $("hintsSchemaTemplate")
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
    return tpl.replace(/\{\{?\$?([A-Za-z0-9_]+)\}\}?/g, (match, key) => {
      const v = vars[key];
      return v === undefined || v === null ? match : String(v);
    });
  }

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
          name: "PracticeQuizResponse",
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

  let quizData = [];
  let userAnswers = {};

  function renderPreview(data) {
    const container = els.previewContainer();
    if (!container) return;
    container.innerHTML = "";
    
    quizData = data.questions || [];
    userAnswers = {};

    if (quizData.length === 0) {
      container.innerHTML = "<p>No questions found in response.</p>";
      return;
    }

    // Add Header
    const header = document.createElement("div");
    header.className = "quiz-header";
    header.innerHTML = `
        <h2>Practice Quiz</h2>
        <div class="close-btn" onclick="location.reload()">✕</div>
    `;
    container.appendChild(header);

    quizData.forEach((q, i) => {
      // Initialize hint state for each question
      q.revealedCount = 0;
      q.currentViewIdx = 0;
      q.hintsArray = [];

      const card = document.createElement("div");
      card.className = "question-card";
      card.id = `question-${i}`;

      const typeLabel = q.questionType === 1 ? "Single Choice" : "Type: True / False";
      
      const meta = document.createElement("div");
      meta.className = "question-meta";
      meta.innerHTML = `<span>Question #${i + 1}</span><span>${typeLabel}</span>`;
      card.appendChild(meta);

      const title = document.createElement("div");
      title.className = "question-title";
      title.textContent = q.question;
      card.appendChild(title);

      const answerSection = document.createElement("div");
      answerSection.className = "answer-section";
      
      const label = document.createElement("div");
      label.className = "answer-label";
      label.innerHTML = `<span>▼</span> Question Answer`;
      answerSection.appendChild(label);

      const optionsContainer = document.createElement("div");
      optionsContainer.className = "options-container";

      if (q.questionType === 4) {
        optionsContainer.innerHTML = `
            <div class="tf-btn" onclick="selectTF(${i}, 'True')">T</div>
            <div class="tf-btn" onclick="selectTF(${i}, 'False')">F</div>
        `;
      } else {
        const letters = ["A", "B", "C", "D"];
        (q.answers || []).forEach((ans, idx) => {
          const opt = document.createElement("div");
          opt.className = "sc-option";
          opt.onclick = () => selectSC(i, idx);
          opt.innerHTML = `
            <div class="sc-radio"></div>
            <div class="sc-letter">#${letters[idx]}</div>
            <div class="sc-text">${ans}</div>
          `;
          optionsContainer.appendChild(opt);
        });
      }
      
      answerSection.appendChild(optionsContainer);

      // Hierarchical Hints Area (Simplified for initial state)
      const hintsWrapper = document.createElement("div");
      hintsWrapper.id = `hints-wrapper-${i}`;

      const initialHintBtn = document.createElement("button");
      initialHintBtn.className = "get-hint-initial-btn";
      initialHintBtn.id = `get-hint-init-${i}`;
      initialHintBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#009688;">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
          <path d="M12 8v4m0 4h.01"/>
        </svg>
        <span>Get a Hint</span>
      `;
      initialHintBtn.onclick = () => fetchHintsForQuestion(i);
      hintsWrapper.appendChild(initialHintBtn);

      const hintsContainer = document.createElement("div");
      hintsContainer.className = "hints-container";
      hintsContainer.id = `hints-container-${i}`;
      hintsWrapper.appendChild(hintsContainer);

      answerSection.appendChild(hintsWrapper);
      
      const feedback = document.createElement("div");
      feedback.className = "feedback-area";
      feedback.id = `feedback-${i}`;
      answerSection.appendChild(feedback);

      const rationale = document.createElement("div");
      rationale.className = "feedback-rationale";
      rationale.id = `rationale-${i}`;
      rationale.innerHTML = q.rationale;
      answerSection.appendChild(rationale);

      card.appendChild(answerSection);
      container.appendChild(card);
    });

    // Add Finish Button
    const finishBtn = document.createElement("button");
    finishBtn.className = "action-btn finish-quiz-btn";
    finishBtn.textContent = "Finish Quiz";
    finishBtn.onclick = showResults;
    container.appendChild(finishBtn);
  }

  async function fetchHintsForQuestion(qIdx) {
    const q = quizData[qIdx];
    const initBtn = document.getElementById(`get-hint-init-${qIdx}`);
    const container = document.getElementById(`hints-container-${qIdx}`);
    const currentLang = document.getElementById("languageSelect").value;

    initBtn.style.display = "none";
    container.style.display = "block";
    
    const hLabels = {
        en: { working: "Working on Hint 1" },
        sr: { working: "Pripremam nagoveštaj 1" }
    }[currentLang];

    container.innerHTML = `
      <div class="loading-hint">
        <span class="hint-icon">Σ</span>
        <span class="loading-hint-text">${hLabels.working}<span class="loading-dots"></span></span>
      </div>
    `;

    try {
        const apiKey = els.apiKey().value.trim();
        const model = els.model().value;
        const endpoint = DEFAULT_ENDPOINT;
        const hintsPromptTemplate = els.hintsPromptTemplate().value;
        const hintsSchemaObj = JSON.parse(els.hintsSchemaTemplate().value);
        
        const vars = {
            lesson_context: els.context().value,
            lesson_name: els.workItemTitle().value,
            lesson_description: (window.hintsPrompts[currentLang] || window.hintsPrompts.en).meta.lessonDescription,
            subject: els.subject().value,
            grade_level: els.gradeLevel().value,
            question_data: JSON.stringify([ { question: q.question, options: q.answers, rationale: q.rationale } ]),
            response_language: currentLang === 'sr' ? 'Serbian' : 'English'
        };

        const finalPrompt = fillTemplate(hintsPromptTemplate, vars);
        
        const resultText = await callApiStream({
            endpoint,
            apiKey,
            model,
            prompt: finalPrompt,
            schemaObj: hintsSchemaObj
        });

        const data = JSON.parse(resultText);
        
        if (!data.hints || !Array.isArray(data.hints) || data.hints.length === 0) {
            throw new Error("AI response did not contain any hints.");
        }

        const fetchedHints = data.hints[0];
        
        q.hintsArray = [
            fetchedHints.initial_hint || "No hint provided.",
            fetchedHints.follow_up_hint || "No follow-up hint provided.",
            fetchedHints.reteach_hint || "No reteach hint provided."
        ];
        q.revealedCount = 1;
        q.currentViewIdx = 0;

        updateHintUI(qIdx);
        updateTokenSummaryUI(model);

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p style="padding:20px; color:red;">Error fetching hints. <button onclick="fetchHintsForQuestion(${qIdx})">Retry</button></p>`;
    }
  }

  window.revealNextHint = async (qIdx) => {
    const q = quizData[qIdx];
    if (q.revealedCount >= 3) return;

    const container = document.getElementById(`hints-container-${qIdx}`);
    const currentLang = document.getElementById("languageSelect").value;
    const nextIdx = q.revealedCount + 1;

    const hLabels = {
        en: { working: `Working on Hint ${nextIdx}` },
        sr: { working: `Pripremam nagoveštaj ${nextIdx}` }
    }[currentLang];

    // Show loading state for next hint
    const currentContent = container.querySelector(".hint-text-body");
    const currentFooter = container.querySelector(".hint-footer");
    
    // Smooth transition: replace content with loading
    container.querySelector(".hint-main-content").innerHTML = `
      <div class="loading-hint" style="padding:0;">
        <span class="hint-icon">Σ</span>
        <span class="loading-hint-text">${hLabels.working}<span class="loading-dots"></span></span>
      </div>
    `;
    currentFooter.style.opacity = "0.5";
    currentFooter.style.pointerEvents = "none";

    // Simulate thinking/working time
    await new Promise(r => setTimeout(r, 750));

    q.revealedCount++;
    q.currentViewIdx = q.revealedCount - 1;
    updateHintUI(qIdx);
  };

  window.navigateHint = (qIdx, direction) => {
    const q = quizData[qIdx];
    const newIdx = q.currentViewIdx + direction;
    if (newIdx >= 0 && newIdx < q.revealedCount) {
        q.currentViewIdx = newIdx;
        updateHintUI(qIdx);
    }
  };

  function updateHintUI(qIdx) {
    const q = quizData[qIdx];
    const container = document.getElementById(`hints-container-${qIdx}`);
    const currentLang = document.getElementById("languageSelect").value;

    const labels = {
        en: { hint: "Hint", max: "max 3", newHint: "New Hint" },
        sr: { hint: "Nagoveštaj", max: "maks. 3", newHint: "Novi nagoveštaj" }
    }[currentLang];

    const currentHintText = q.hintsArray[q.currentViewIdx];

    container.innerHTML = `
      <div class="hint-main-content">
        <div class="hint-icon">Σ</div>
        <div class="hint-text-body">${currentHintText}</div>
      </div>
      <div class="hint-footer">
        <div class="hint-nav-info">
          <span class="hint-nav-arrow ${q.currentViewIdx === 0 ? 'disabled' : ''}" onclick="navigateHint(${qIdx}, -1)">❮</span>
          <span>${labels.hint} ${q.currentViewIdx + 1}/${q.revealedCount} (${labels.max})</span>
          <span class="hint-nav-arrow ${q.currentViewIdx === q.revealedCount - 1 ? 'disabled' : ''}" onclick="navigateHint(${qIdx}, 1)">❯</span>
        </div>
        ${q.revealedCount < 3 ? `<button class="new-hint-btn" onclick="revealNextHint(${qIdx})">${labels.newHint}</button>` : ''}
      </div>
    `;
  }

  window.selectTF = (qIdx, val) => {
    userAnswers[qIdx] = val;
    const q = quizData[qIdx];
    const isCorrect = val === q.correctAnswer;
    
    // Update UI
    const card = document.getElementById(`question-${qIdx}`);
    if (!card) return;
    const btns = card.querySelectorAll(".tf-btn");
    btns.forEach(btn => {
        btn.classList.remove("selected");
        if (btn.textContent === (val === 'True' ? 'T' : 'F')) btn.classList.add("selected");
    });
    
    showFeedback(qIdx, isCorrect);
  };

  window.selectSC = (qIdx, optIdx) => {
    userAnswers[qIdx] = optIdx;
    const q = quizData[qIdx];
    const isCorrect = q.correctAnswers && q.correctAnswers.includes(optIdx);
    
    // Update UI
    const card = document.getElementById(`question-${qIdx}`);
    if (!card) return;
    const opts = card.querySelectorAll(".sc-option");
    opts.forEach((opt, idx) => {
        opt.classList.remove("selected");
        if (idx === optIdx) opt.classList.add("selected");
    });
    
    showFeedback(qIdx, isCorrect);
  };

  function showFeedback(qIdx, isCorrect) {
    const feedback = document.getElementById(`feedback-${qIdx}`);
    if (!feedback) return;
    
    const currentLang = document.getElementById("languageSelect").value;
    const labels = {
        en: { 
            correct: "CORRECT! ✔", 
            wrong: "WRONG! ✖", 
            rationalePrefixC: "Correct — ", 
            rationalePrefixW: "Incorrect — ",
            answeredPrefix: "Your Answer is: "
        },
        sr: { 
            correct: "TAČNO! ✔", 
            wrong: "NETAČNO! ✖", 
            rationalePrefixC: "Tačno — ", 
            rationalePrefixW: "Netačno — ",
            answeredPrefix: "Vaš odgovor je: "
        }
    }[currentLang] || { 
        correct: "CORRECT! ✔", 
        wrong: "WRONG! ✖", 
        rationalePrefixC: "Correct — ", 
        rationalePrefixW: "Incorrect — ",
        answeredPrefix: "Your Answer is: "
    };

    if (isCorrect) {
        feedback.innerHTML = `<span class="feedback-correct">${labels.answeredPrefix}${labels.correct}</span>`;
    } else {
        feedback.innerHTML = `<span class="feedback-wrong">${labels.answeredPrefix}${labels.wrong}</span>`;
    }

    const rationale = document.getElementById(`rationale-${qIdx}`);
    if (rationale) {
        const prefix = isCorrect ? labels.rationalePrefixC : labels.rationalePrefixW;
        rationale.innerHTML = `<strong>${prefix}</strong>${quizData[qIdx].rationale}`;
        rationale.style.display = "block";
        if (isCorrect) {
            rationale.classList.remove("wrong");
        } else {
            rationale.classList.add("wrong");
        }
    }
  }

  function showResults() {
    const container = els.previewContainer();
    if (!container) return;
    container.innerHTML = "";
    
    // Add Header
    const header = document.createElement("div");
    header.className = "quiz-header";
    header.innerHTML = `
        <h2>Practice Quiz</h2>
        <div class="close-btn" onclick="location.reload()">✕</div>
    `;
    container.appendChild(header);

    let correctCount = 0;
    quizData.forEach((q, i) => {
        if (q.questionType === 4) {
            if (userAnswers[i] === q.correctAnswer) correctCount++;
        } else {
            if (q.correctAnswers && q.correctAnswers.includes(userAnswers[i])) correctCount++;
        }
    });

    const incorrectCount = quizData.length - correctCount;

    const resultsCard = document.createElement("div");
    resultsCard.className = "results-card";
    resultsCard.innerHTML = `
        <div class="score-box">
            <div class="score-title">Your score:</div>
            <div class="score-stat score-correct">✔ ${correctCount} out of ${quizData.length}</div>
            <div class="score-stat score-wrong">✖ ${incorrectCount} out of ${quizData.length}</div>
        </div>
        <div class="result-msg">Congratulations on your hard work!</div>
        <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="action-btn" onclick="location.reload()">Done</button>
            <button class="action-btn secondary" onclick="redoQuiz()">Redo</button>
        </div>
    `;
    container.appendChild(resultsCard);
  }

  window.redoQuiz = () => {
      renderPreview({ questions: quizData });
  };

  async function run() {
    if (isRunning) return;

    const apiKey = els.apiKey().value.trim();
    const model = els.model().value;
    const endpoint = DEFAULT_ENDPOINT;

    const vars = {
      numberOfQuestions: els.numberOfQuestions().value,
      workItemTitle: els.workItemTitle().value,
      subject: els.subject().value,
      gradeLevel: els.gradeLevel().value,
      context: els.context().value,
      language: els.language().value === 'sr' ? 'Serbian' : 'English'
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
        endpoint,
        apiKey,
        model,
        prompt: finalPrompt,
        schemaObj,
        signal: currentAbortController.signal
      });

      els.jsonOutput().value = resultText;
      
      try {
        const data = JSON.parse(resultText);
        renderPreview(data);
        logLine("Successfully generated and parsed JSON.");
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

  els.runBtn().addEventListener("click", run);
  els.cancelBtn().addEventListener("click", cancel);

})();
