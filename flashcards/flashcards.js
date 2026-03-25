(() => {
  "use strict";

  const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";
  const $ = (id) => document.getElementById(id);

  const els = {
    apiKey: () => $("apiKey"),
    model: () => $("modelSelect"),
    language: () => $("languageSelect"),
    numberOfFlashcards: () => $("numberOfFlashcards"),
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
          name: "FlashcardResponse",
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

  let flashcards = [];
  let currentCardIndex = 0;
  let history = [];
  let stats = { correct: 0, wrong: 0 };

  async function run() {
    if (isRunning) return;

    const apiKey = els.apiKey().value.trim();
    const model = els.model().value;
    const endpoint = DEFAULT_ENDPOINT;

    const vars = {
      numberOfFlashcards: els.numberOfFlashcards().value,
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
        flashcards = data.flashcards || [];
        initFlashcards();
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

  function initFlashcards() {
    currentCardIndex = 0;
    history = [];
    stats = { correct: 0, wrong: 0 };
    renderCard(0);
  }

  function renderCard(index, direction = 'none') {
    const container = els.previewContainer();
    if (!container) return;
    
    if (index >= flashcards.length) {
      showFinalResults();
      return;
    }

    const cardData = flashcards[index];
    const currentLang = els.language().value;
    const labels = {
        en: { 
            header: "Flashcards", 
            instruction: "Click flashcard to flip it.",
            front: "Question",
            back: "Answer",
            correct: "Correct",
            wrong: "Wrong",
            yourAnswer: "Your answer was:"
        },
        sr: { 
            header: "Kartice za učenje", 
            instruction: "Klikni na karticu da je okreneš.",
            front: "Pitanje",
            back: "Odgovor",
            correct: "Tačno",
            wrong: "Netačno",
            yourAnswer: "Tvoj odgovor je bio:"
        }
    }[currentLang] || { header: "Flashcards", instruction: "Click flashcard to flip it.", front: "Question", back: "Answer", correct: "Correct", wrong: "Wrong", yourAnswer: "Your answer was:" };

    container.innerHTML = "";

    const header = document.createElement("div");
    header.className = "quiz-header";
    header.innerHTML = `<h2>${labels.header}</h2><div class="close-btn" onclick="location.reload()">✕</div>`;
    container.appendChild(header);

    const mainText = document.createElement("div");
    mainText.className = "instruction-text";
    mainText.textContent = labels.instruction;
    container.appendChild(mainText);

    const wrapper = document.createElement("div");
    wrapper.className = "flashcard-wrapper";
    if (direction === 'in-right') wrapper.classList.add('slide-in-right');
    if (direction === 'in-left') wrapper.classList.add('slide-in-left');

    const card = document.createElement("div");
    card.className = "flashcard";
    
    // Controls (Hidden initially)
    const controls = document.createElement("div");
    controls.className = "flashcard-controls";
    controls.style.display = "none";
    
    const answerLabel = document.createElement("div");
    answerLabel.className = "muted";
    answerLabel.style.display = "none";
    answerLabel.style.marginBottom = "-10px";
    answerLabel.textContent = labels.yourAnswer;

    card.onclick = () => {
        card.classList.toggle("flipped");
        controls.style.display = "flex";
        answerLabel.style.display = "block";
    };

    const faceFront = document.createElement("div");
    faceFront.className = "flashcard-face flashcard-front";
    faceFront.setAttribute("data-label", labels.front);
    faceFront.innerHTML = `
        <div class="flashcard-counter">${index + 1}/${flashcards.length}</div>
        <div class="flashcard-content">${cardData.front}</div>
    `;

    const faceBack = document.createElement("div");
    faceBack.className = "flashcard-face flashcard-back";
    faceBack.setAttribute("data-label", labels.back);
    faceBack.innerHTML = `
        <div class="flashcard-counter">${index + 1}/${flashcards.length}</div>
        <div class="flashcard-content">${cardData.back}</div>
    `;

    card.appendChild(faceFront);
    card.appendChild(faceBack);
    wrapper.appendChild(card);
    container.appendChild(wrapper);

    const undoBtn = document.createElement("button");
    undoBtn.className = "undo-btn";
    undoBtn.innerHTML = "↺";
    undoBtn.disabled = index === 0;
    undoBtn.onclick = goBack;

    const correctBtn = document.createElement("div");
    correctBtn.className = "judge-btn correct-btn";
    correctBtn.innerHTML = `<span>✔</span> ${labels.correct} (${stats.correct}/${flashcards.length})`;
    correctBtn.onclick = () => markAnswer(true);

    const wrongBtn = document.createElement("div");
    wrongBtn.className = "judge-btn wrong-btn";
    wrongBtn.innerHTML = `<span>✖</span> ${labels.wrong} (${stats.wrong}/${flashcards.length})`;
    wrongBtn.onclick = () => markAnswer(false);

    controls.appendChild(undoBtn);
    controls.appendChild(correctBtn);
    controls.appendChild(wrongBtn);
    
    container.appendChild(answerLabel);
    container.appendChild(controls);
  }

  function markAnswer(isCorrect) {
    const wrapper = document.querySelector(".flashcard-wrapper");
    const btns = document.querySelectorAll(".judge-btn");
    const btn = isCorrect ? document.querySelector(".correct-btn") : document.querySelector(".wrong-btn");
    
    btns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    if (isCorrect) stats.correct++;
    else stats.wrong++;
    
    history.push({ index: currentCardIndex, isCorrect: isCorrect });

    wrapper.classList.add("slide-out-left");
    
    setTimeout(() => {
        currentCardIndex++;
        renderCard(currentCardIndex, 'in-right');
    }, 500);
  }

  function goBack() {
    if (history.length === 0) return;
    
    const last = history.pop();
    if (last.isCorrect) stats.correct--;
    else stats.wrong--;
    
    const wrapper = document.querySelector(".flashcard-wrapper");
    wrapper.classList.add("slide-out-right");
    
    setTimeout(() => {
        currentCardIndex = last.index;
        renderCard(currentCardIndex, 'in-left');
    }, 500);
  }

  function showFinalResults() {
    const container = els.previewContainer();
    const currentLang = els.language().value;
    const labels = {
        en: { congrats: "Congratulations on your hard work!", score: "Your score:", done: "Done", redo: "Redo" },
        sr: { congrats: "Čestitamo na vrednom radu!", score: "Tvoj rezultat:", done: "Završi", redo: "Ponovi" }
    }[currentLang] || { congrats: "Congratulations on your hard work!", score: "Your score:", done: "Done", redo: "Redo" };

    container.innerHTML = "";
    
    const header = document.createElement("div");
    header.className = "quiz-header";
    header.innerHTML = `<h2>Flashcards</h2><div class="close-btn" onclick="location.reload()">✕</div>`;
    container.appendChild(header);

    const results = document.createElement("div");
    results.className = "results-card";
    results.innerHTML = `
        <div class="score-box">
            <p><strong>${labels.score}</strong></p>
            <div class="score-stat score-correct">✔ ${stats.correct} out of ${flashcards.length}</div>
            <div class="score-stat score-wrong">✖ ${stats.wrong} out of ${flashcards.length}</div>
        </div>
        <p>${labels.congrats}</p>
        <button class="action-btn" onclick="location.reload()">${labels.done}</button>
        <button class="action-btn" style="background:#444;" id="redoBtn">${labels.redo}</button>
    `;
    container.appendChild(results);
    document.getElementById("redoBtn").onclick = initFlashcards;
  }

  els.runBtn().addEventListener("click", run);
  els.cancelBtn().addEventListener("click", cancel);

})();
