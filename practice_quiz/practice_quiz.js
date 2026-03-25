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
    previewContainer: () => $("previewContainer")
  };

  let currentAbortController = null;
  let isRunning = false;

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
    return tpl.replace(/\{\{\{?\$?([A-Za-z0-9_]+)\}\}\}?/g, (match, key) => {
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

    const currentLang = document.getElementById("languageSelect").value;
    const labels = {
        en: { hint: "💡 Show Hint", rationale: "Rationale" },
        sr: { hint: "💡 Prikaži nagoveštaj", rationale: "Obrazloženje" }
    }[currentLang] || { hint: "💡 Show Hint", rationale: "Rationale" };

    quizData.forEach((q, i) => {
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

      // Hint area
      if (q.questionHint) {
          const hintBtn = document.createElement("button");
          hintBtn.className = "hint-btn";
          hintBtn.textContent = labels.hint;
          hintBtn.onclick = () => showHint(i);
          answerSection.appendChild(hintBtn);

          const hintText = document.createElement("div");
          hintText.className = "hint-text";
          hintText.id = `hint-text-${i}`;
          hintText.textContent = q.questionHint;
          answerSection.appendChild(hintText);
      }
      
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

  window.showHint = (qIdx) => {
    const hintText = document.getElementById(`hint-text-${qIdx}`);
    if (hintText) {
        hintText.style.display = hintText.style.display === 'block' ? 'none' : 'block';
    }
  };

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
