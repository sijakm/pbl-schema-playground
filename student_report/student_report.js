(() => {
  "use strict";

  const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";
  const $ = (id) => document.getElementById(id);

  const els = {
    model: $("modelSelect"),
    studentData: $("studentData"),
    generateBtn: $("generateBtn"),
    status: $("status"),
    log: $("log"),
    feedback: $("feedbackOutput"),
    charCount: $("charCount"),
    lang: $("languageSelect"),
    downloadPromptsBtn: $("downloadPromptsBtn")
  };

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
  const PROMPT_INSTRUCTIONS = {
    en: `Generate feedback with no more than 300 characters using the data provided. (You will use this information – grades and teacher comments on assessments, student assessment answers, attendance.)

Feedback should:
-Be written as speaking to the student.  
- Summarize overall engagement and performance trends (e.g., steady progress, recent improvement, or decline).
- Highlight one strength or success area specific to the course.
- Identify one area for growth or give actionable advice for improvement or continued success.

Output requirements:
- NO HTML formatting.
- Plain text only.
- Strict 300 character limit.`,
    sr: `Generišite povratnu informaciju od najviše 300 karaktera koristeći priložene podatke. (Koristićete ove informacije – ocene i komentare nastavnika na proverama, odgovore učenika, prisustvo.)

Povratna informacija treba da:
- Bude napisana u drugom licu, kao da se obraćate direktno učeniku.
- Sumira opšti angažman i trendove u postignuću (npr. stabilan napredak, nedavno poboljšanje ili pad).
- Istakne jednu vrlinu ili oblast uspeha specifičnu za ovaj kurs.
- Identifikuje jednu oblast za razvoj ili pruži konkretan savet za povoljšanje ili nastavak uspešnog rada.

Zahtevi za izlaz:
- BEZ HTML formatiranja.
- Isključivo običan tekst.
- Strogo ograničenje od 300 karaktera.`,
    sr_cyrl: `Направите повратну информацију од највише 300 карактера користећи дате податке. (Користићете ове информације – оцене и коментаре наставника о проценама, одговоре ученика на проценама, присуство.)

Повратна информација треба да:
-Буде написана као да се обраћа ученику.  
- Сумира опште ангажовање и трендове у извођењу (нпр. стабилан напредак, недавна побољшања или пад).
- Истакне једну снагу или област успеха специфичну за курс.
- Идентификује једну област за напредак или даје конкретан савет за побољшање или наставак успеха.

Захтеви за излаз:
- НИКАКВО ХТМЛ форматирање.
- Само обичан текст.
- Строго ограничење од 300 карактера.`,
    es: `Genera un informe de retroalimentación con no más de 300 caracteres utilizando los datos proporcionados. (Utilizarás esta información: calificaciones y comentarios del profesor sobre las evaluaciones, respuestas de los alumnos a las evaluaciones, asistencia.)

La retroalimentación debe:
-Escribirse como si hablaras directamente al alumno.  
- Resumir la participación general y las tendencias de rendimiento (por ejemplo, progreso constante, mejora reciente o declive).
- Destacar un punto fuerte o un área de éxito específica del curso.
- Identificar un área de crecimiento o dar consejos prácticos para la mejora o el éxito continuo.

Requisitos de salida:
- Sin formato HTML.
- Solo texto plano.
- Límite estricto de 300 caracteres.`,
    id: `Buat umpan balik dengan tidak lebih dari 300 karakter menggunakan data yang disediakan. (Anda akan menggunakan informasi ini – nilai dan komentar guru pada penilaian, jawaban penilaian siswa, kehadiran.)

Umpan balik harus:
- Ditulis seolah-olah berbicara kepada siswa.  
- Merangkum keterlibatan keseluruhan dan tren kinerja (mis., kemajuan yang stabil, peningkatan terbaru, atau penurunan).
- Menyoroti satu kekuatan atau area keberhasilan yang spesifik untuk mata pelajaran tersebut.
- Mengidentifikasi satu area untuk berkembang atau memberikan saran yang dapat ditindaklanjuti untuk perbaikan atau keberhasilan berkelanjutan.

Persyaratan output:
- TANPA pemformatan HTML.
- Hanya teks biasa.
- Batas ketat 300 karakter.`,
    ru: `Напишите отзыв объемом не более 300 символов, используя предоставленные данные. (Вы будете использовать эту информацию — оценки и комментарии учителя по оценкам, ответы ученика на оценки, посещаемость.)

Отзыв должен:
- Быть написан в форме обращения к ученику.  
- Отражать общую успеваемость и тенденции успеваемости (например, устойчивый прогресс, недавнее улучшение или снижение).
- Выделить одну сильную сторону или область успеха, специфичную для курса.
- Определить одну область роста или дать действенный совет для улучшения или дальнейшего успеха.

Требования к выводу:
- Без HTML форматирования.
- Только обычный текст.
- Строгое ограничение в 300 символов.`
  };

  const PROMPT_HEADERS = {
    en: {
      studentInfo: "STUDENT INFORMATION:",
      gradingSystem: "GRADING SYSTEM CONTEXT:",
      attendanceData: "ATTENDANCE RECORD:",
      gradesData: "GRADES & TEACHER COMMENTS:"
    },
    sr: {
      studentInfo: "INFORMACIJE O UČENIKU:",
      gradingSystem: "KONTEKST SISTEMA OCENJIVANJA:",
      attendanceData: "EVIDENCIJA PRISUSTVA:",
      gradesData: "OCENE I KOMENTARI NASTAVNIKA:"
    },
    sr_cyrl: {
      studentInfo: "ИНФОРМАЦИЈЕ О УЧЕНИКУ:",
      gradingSystem: "КОНТЕКСТ СИСТЕМА ОЦЕЊИВАЊА:",
      attendanceData: "ЕВИДЕНЦИЈА ПРИСУСТВА:",
      gradesData: "ОЦЕНЕ И КОМЕНТАРИ НАСТАВНИКА:"
    },
    es: {
      studentInfo: "INFORMACIÓN DEL ALUMNO:",
      gradingSystem: "CONTEXTO DEL SISTEMA DE CALIFICACIÓN:",
      attendanceData: "REGISTRO DE ASISTENCIA:",
      gradesData: "CALIFICACIONES Y COMENTARIOS DEL PROFESOR:"
    },
    id: {
      studentInfo: "INFORMASI SISWA:",
      gradingSystem: "KONTEKS SISTEM PENILAIAN:",
      attendanceData: "REKAMAN KEHADIRAN:",
      gradesData: "NILAI & KOMENTAR GURU:"
    },
    ru: {
      studentInfo: "ИНФОРМАЦИЯ ОБ УЧЕНИКЕ:",
      gradingSystem: "КОНТЕКСТ СИСТЕМЫ ОЦЕНИВАНИЯ:",
      attendanceData: "ЗАПИСЬ О ПОСЕЩАЕМОСТИ:",
      gradesData: "ОЦЕНКИ И КОММЕНТАРИИ УЧИТЕЛЯ:"
    }
  };

  function fillTemplate(tpl, vars) {
    return tpl.replace(/\{\{\{?\$?([A-Za-z0-9_]+)\}\}\}?/g, (match, key) => {
      const v = vars[key];
      return v === undefined || v === null ? match : String(v);
    });
  }

  function logLine(line) {
    if (!els.log) return;
    els.log.value += (els.log.value ? "\n" : "") + line;
    els.log.scrollTop = els.log.scrollHeight;
  }

  function setStatus(msg) {
    if (els.status) els.status.textContent = msg || "";
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

  async function callResponsesApiStream({ endpoint, apiKey, model, prompt, schemaObj, signal }) {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const body = {
      model,
      stream: true,
      input: [{ role: "user", content: prompt }]
    };

    if (schemaObj) {
      body.text = {
        format: {
          type: "json_schema",
          name: "FeedbackResponse",
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
          } catch (e) { continue; }
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            finalText += evt.delta;
            // Update feedback UI during stream
            try {
               const partialObj = JSON.parse(finalText);
               updateOutput(partialObj.feedback || "");
            } catch {
               // Ignore partial JSON parsing errors
            }
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

  function updateOutput(text) {
    els.feedback.textContent = text;
    const len = text.length;
    els.charCount.textContent = `${len} characters`;
    els.charCount.style.color = len > 300 ? "red" : "#777";
  }

  async function generateFeedback() {
    const model = els.model ? els.model.value : "gpt-5.4-mini";
    
    // Gather all new fields
    const basePromptUI = document.getElementById("basePrompt").value.trim();
    const studentInfo = document.getElementById("studentInfo").value.trim();
    const gradingSystem = document.getElementById("gradingSystem").value;
    const gradesData = document.getElementById("gradesData").value.trim();
    const attendanceData = document.getElementById("attendanceData").value.trim();

    if (!studentInfo || !gradesData) {
      alert("Please enter at least Student Info and Grades.");
      return;
    }

    els.generateBtn.disabled = true;
    els.feedback.textContent = "Cleo is thinking...";
    els.log.value = "";
    resetTokenUsage();
    setStatus("Generating...");

    try {
      // Build the prompt dynamically
      const currentLang = els.lang?.value || "en";
      const headers = PROMPT_HEADERS[currentLang] || PROMPT_HEADERS.en;

      const dynamicTemplate = basePromptUI + `\n\n` +
        `${headers.studentInfo}\n{{$StudentInfo}}\n\n` +
        `${headers.gradingSystem}\n{{$GradingSystem}}\n\n` +
        `${headers.attendanceData}\n{{$AttendanceData}}\n\n` +
        `${headers.gradesData}\n{{$GradesData}}`;

      const prompt = fillTemplate(dynamicTemplate, { 
        StudentInfo: studentInfo,
        GradingSystem: gradingSystem,
        GradesData: gradesData,
        AttendanceData: attendanceData
      });
      console.log("--- FINAL PROMPT ---\n", prompt);
      logLine("[Cleo] Requesting feedback...");
      
      const HARDCODED_PASSWORD = ""; // Enter password here while working locally
      const apiKey = HARDCODED_PASSWORD || document.getElementById("apiKey")?.value?.trim() || "";

      let schemaObj = null;
      if (currentLang === "en" && window.studentReportPromptsEN) {
        schemaObj = window.studentReportPromptsEN.STUDENT_REPORT_SCHEMA;
      } else if (currentLang === "sr" && window.studentReportPromptsSR) {
        schemaObj = window.studentReportPromptsSR.STUDENT_REPORT_SCHEMA;
      } else if (currentLang === "sr_cyrl" && window.studentReportPromptsSR_CYRL) {
        schemaObj = window.studentReportPromptsSR_CYRL.STUDENT_REPORT_SCHEMA;
      } else if (currentLang === "es" && window.studentReportPromptsES) {
        schemaObj = window.studentReportPromptsES.STUDENT_REPORT_SCHEMA;
      } else if (currentLang === "id" && window.studentReportPromptsID) {
        schemaObj = window.studentReportPromptsID.STUDENT_REPORT_SCHEMA;
      } else if (currentLang === "ru" && window.studentReportPromptsRU) {
        schemaObj = window.studentReportPromptsRU.STUDENT_REPORT_SCHEMA;
      }

      const responseText = await callResponsesApiStream({
        endpoint: DEFAULT_ENDPOINT,
        apiKey,
        model,
        prompt,
        schemaObj
      });

      const responseObj = JSON.parse(responseText);
      updateOutput(responseObj.feedback || "");
      logLine("[Cleo] Feedback generated.");
      updateTokenSummaryUI(model);
      setStatus("Done.");
    } catch (err) {
      logLine("[Error] " + err.message);
      setStatus("Error.");
      els.feedback.textContent = "Error: " + err.message;
    } finally {
      els.generateBtn.disabled = false;
    }
  }

  els.generateBtn.addEventListener("click", generateFeedback);

  // Load selected demonstration student
  const studentSelector = document.getElementById("studentSelector");
  const gradingSystem = document.getElementById("gradingSystem");

  function updateMockData() {
    if (!studentSelector || !window.STUDENT_DB_SIMULATION) return;
    
    const db = window.STUDENT_DB_SIMULATION;
    const studentId = parseInt(studentSelector.value, 10);
    const student = db.students.find(s => s.id === studentId);
    if (!student) return;

    // Populate Info
    document.getElementById("studentInfo").value = `${student.name} | #${student.id} | Course: ${student.course} | Semester: ${student.semester}`;

    // Populate JSON data
    if (db.course_data) {
      document.getElementById("gradingSystem").value = JSON.stringify(db.course_data, null, 2);
    }
    if (db.attendance) {
      document.getElementById("attendanceData").value = JSON.stringify(db.attendance, null, 2);
    }
    if (db.gradebook) {
      document.getElementById("gradesData").value = JSON.stringify(db.gradebook, null, 2);
    }
  }

  if (studentSelector && window.STUDENT_DB_SIMULATION) {
    studentSelector.addEventListener("change", updateMockData);
    // Trigger change to load the first student automatically on boot
    updateMockData();
  }

  // Handle language switch
  if (els.lang) {
    els.lang.addEventListener("change", (e) => {
      const lang = e.target.value;
      const basePrompt = document.getElementById("basePrompt");
      if (basePrompt && PROMPT_INSTRUCTIONS[lang]) {
        basePrompt.value = PROMPT_INSTRUCTIONS[lang];
      }
      updateMockData();
    });

    // Initialize UI based on current language
    const currentLang = els.lang.value;
    const basePrompt = document.getElementById("basePrompt");
    if (basePrompt && PROMPT_INSTRUCTIONS[currentLang]) {
      basePrompt.value = PROMPT_INSTRUCTIONS[currentLang];
    }
  }

  async function downloadPrompts() {
    try {
      if (typeof JSZip === "undefined") {
        alert("JSZip library not loaded.");
        return;
      }

      const zipEN = new JSZip();
      const zipSR = new JSZip();
      const zipSRCyrl = new JSZip();
      const zipES = new JSZip();
      const zipID = new JSZip();
      const zipRU = new JSZip();

      const pEN = window.studentReportPromptsEN || {};
      const pSR = window.studentReportPromptsSR || {};
      const pSRCyrl = window.studentReportPromptsSR_CYRL || {};
      const pES = window.studentReportPromptsES || {};
      const pID = window.studentReportPromptsID || {};
      const pRU = window.studentReportPromptsRU || {};

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
      addFiles(zipSRCyrl, pSRCyrl);
      addFiles(zipES, pES);
      addFiles(zipID, pID);
      addFiles(zipRU, pRU);

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

      zipEN.generateAsync({ type: "blob" }).then(b => saveZip(b, "student_report_prompts_en.zip"));
      setTimeout(() => zipSR.generateAsync({ type: "blob" }).then(b => saveZip(b, "student_report_prompts_sr.zip")), 200);
      setTimeout(() => zipSRCyrl.generateAsync({ type: "blob" }).then(b => saveZip(b, "student_report_prompts_sr_cyrl.zip")), 400);
      setTimeout(() => zipES.generateAsync({ type: "blob" }).then(b => saveZip(b, "student_report_prompts_es.zip")), 600);
      setTimeout(() => zipID.generateAsync({ type: "blob" }).then(b => saveZip(b, "student_report_prompts_id.zip")), 800);
      setTimeout(() => zipRU.generateAsync({ type: "blob" }).then(b => saveZip(b, "student_report_prompts_ru.zip")), 1000);

      logLine("[OK] Prompts downloaded successfully.");
    } catch (err) {
      logLine("[error] Failed to download: " + err.message);
    }
  }

  if (els.downloadPromptsBtn) {
    els.downloadPromptsBtn.addEventListener("click", downloadPrompts);
  }

})();
