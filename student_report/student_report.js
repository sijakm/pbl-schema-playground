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
    charCount: $("charCount")
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
    const qualitativeData = document.getElementById("qualitativeData").value.trim();

    if (!studentInfo || !gradesData) {
      alert("Please enter at least Student Info and Grades.");
      return;
    }

    els.generateBtn.disabled = true;
    els.feedback.textContent = "Cleo is thinking...";
    els.log.value = "";
    setStatus("Generating...");

    try {
      // Build the prompt dynamically
      const dynamicTemplate = basePromptUI + `\n\n` +
        `STUDENT INFORMATION:\n{{$StudentInfo}}\n\n` +
        `GRADING SYSTEM CONTEXT:\n{{$GradingSystem}}\n\n` +
        `ATTENDANCE RECORD:\n{{$AttendanceData}}\n\n` +
        `GRADES:\n{{$GradesData}}\n\n` +
        `TEACHER COMMENTS, ASSESSMENT ANSWERS & TRENDS:\n{{$QualitativeData}}`;

      const prompt = fillTemplate(dynamicTemplate, { 
        StudentInfo: studentInfo,
        GradingSystem: gradingSystem,
        GradesData: gradesData,
        AttendanceData: attendanceData,
        QualitativeData: qualitativeData
      });
      logLine("[Cleo] Requesting feedback...");
      
      const responseText = await callResponsesApiStream({
        endpoint: DEFAULT_ENDPOINT,
        model,
        prompt,
        schemaObj: STUDENT_REPORT_SCHEMA
      });

      const responseObj = JSON.parse(responseText);
      updateOutput(responseObj.feedback || "");
      logLine("[Cleo] Feedback generated.");
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

  const gradeTranslationMap = {
    // [1-5]: 5 is best. [1-6]: 1 is best.
    "A+": { "1-5": "5", "1-6": "1" },
    "A":  { "1-5": "5", "1-6": "1" },
    "A-": { "1-5": "5", "1-6": "2" },
    "B+": { "1-5": "4", "1-6": "2" },
    "B":  { "1-5": "4", "1-6": "2" },
    "B-": { "1-5": "4", "1-6": "3" },
    "C+": { "1-5": "3", "1-6": "3" },
    "C":  { "1-5": "3", "1-6": "3" },
    "C-": { "1-5": "3", "1-6": "4" },
    "D+": { "1-5": "2", "1-6": "4" },
    "D":  { "1-5": "2", "1-6": "4" },
    "D-": { "1-5": "2", "1-6": "5" },
    "F":  { "1-5": "1", "1-6": "6" },
  };

  function updateMockData() {
    if (!studentSelector || !window.STUDENT_DB_SIMULATION) return;
    
    const studentId = parseInt(studentSelector.value, 10);
    const selectedSystem = gradingSystem ? gradingSystem.value : "";
    const isBalkans = selectedSystem.includes("1-5");
    const isGermany = selectedSystem.includes("1-6");

    const db = window.STUDENT_DB_SIMULATION;
    const student = db.students.find(s => s.id === studentId);
    if (!student) return;

    const grades = db.grades.filter(g => g.student_id === studentId);
    const attendance = db.attendance.filter(a => a.student_id === studentId);

    // Populate Info
    document.getElementById("studentInfo").value = `${student.name} | #${student.id} | Course: ${student.course} | Semester: ${student.semester}`;

    // Populate Attendance
    const attSummary = attendance.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});
    
    let attText = `Total Records: ${attendance.length}\n`;
    for (const [status, count] of Object.entries(attSummary)) {
      attText += `${status}: ${count}\n`;
    }
    attText += `\nAttendance Log:\n`;
    attendance.forEach(a => {
       attText += `- ${a.date} (${a.status})\n`;
    });
    document.getElementById("attendanceData").value = attText.trim();

    // Populate Grades with Translation
    let gradeText = "";
    grades.forEach(g => {
      let displayGrade = g.grade;
      if (isBalkans && gradeTranslationMap[g.grade]) {
        displayGrade = gradeTranslationMap[g.grade]["1-5"];
      } else if (isGermany && gradeTranslationMap[g.grade]) {
        displayGrade = gradeTranslationMap[g.grade]["1-6"];
      }
      gradeText += `[${g.date}] ${g.topic} (${g.type}) - Grade: ${displayGrade}\n`;
    });
    document.getElementById("gradesData").value = gradeText.trim();

    // Populate Qualitative
    let qualText = "TEACHER COMMENTS:\n";
    grades.forEach(g => {
      if (g.teacher_comment) {
         qualText += `- (${g.topic}): "${g.teacher_comment}"\n`;
      }
    });
    document.getElementById("qualitativeData").value = qualText.trim();
  }

  if (studentSelector && window.STUDENT_DB_SIMULATION) {
    studentSelector.addEventListener("change", updateMockData);
    if (gradingSystem) {
      gradingSystem.addEventListener("change", updateMockData);
    }
    // Trigger change to load the first student automatically on boot
    updateMockData();
  }

})();
