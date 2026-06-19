const fs = require('fs');

const path = '/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/SharedGeneratorApi/translations.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const translations = {
  "en": {
    "LabQuestionTitle": "Question (5 min)",
    "LabQuestionPurpose": "Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation.",
    "LabResearchTitle": "Research (5 min)",
    "LabResearchPurpose": "Gather background information, vocabulary, and prior knowledge needed to understand the topic and prepare for informed investigation.",
    "LabHypothesizeTitle": "Hypothesize (5 min)",
    "LabHypothesizePurpose": "Develop a testable prediction or claim based on their research and reasoning, setting a clear expectation for what they believe will happen.",
    "LabExperimentTitle": "Experiment (20 min)",
    "LabExperimentPurpose": "Carry out a structured investigation- hands-on, simulated, or analytical- to test their hypothesis and gather evidence through observation or measurement.",
    "LabAnalyzeTitle": "Analyze (5 min)",
    "LabAnalyzePurpose": "Interpret the data they collected, identify patterns, evaluate their hypothesis, and construct evidence-based conclusions.",
    "LabShareTitle": "Share (5 min)",
    "LabSharePurpose": "Communicate their findings clearly to others, using evidence to explain what they discovered, why it matters, and how it contributes to deeper understanding."
  },
  "sr-Latn": {
    "LabQuestionTitle": "Pitanje (5 min)",
    "LabQuestionPurpose": "Posmatrajte fenomen, identifikujte nešto zbunjujuće i postavite smisleno pitanje koje će voditi istraživanje.",
    "LabResearchTitle": "Istraživanje (5 min)",
    "LabResearchPurpose": "Prikupite osnovne informacije, rečnik i prethodno znanje potrebno da biste razumeli temu i pripremili se za informisano istraživanje.",
    "LabHypothesizeTitle": "Postavljanje hipoteze (5 min)",
    "LabHypothesizePurpose": "Razvijte proverljivo predviđanje ili tvrdnju na osnovu njihovog istraživanja i rezonovanja, postavljajući jasno očekivanje o tome šta veruju da će se dogoditi.",
    "LabExperimentTitle": "Eksperiment (20 min)",
    "LabExperimentPurpose": "Sprovedite strukturirano istraživanje – praktično, simulirano ili analitičko – da testirate njihovu hipotezu i prikupite dokaze posmatranjem ili merenjem.",
    "LabAnalyzeTitle": "Analiza (5 min)",
    "LabAnalyzePurpose": "Interpretirajte podatke koje su prikupili, identifikujte obrasce, procenite njihovu hipotezu i konstruišite zaključke zasnovane na dokazima.",
    "LabShareTitle": "Deljenje (5 min)",
    "LabSharePurpose": "Jasno komunicirajte svoje nalaze drugima, koristeći dokaze da objasnite šta su otkrili, zašto je to važno i kako doprinosi dubljem razumevanju."
  },
  "sr-Cyrl": {
    "LabQuestionTitle": "Питање (5 min)",
    "LabQuestionPurpose": "Посматрајте феномен, идентификујте нешто збуњујуће и поставите смислено питање које ће водити истраживање.",
    "LabResearchTitle": "Истраживање (5 min)",
    "LabResearchPurpose": "Прикупите основне информације, речник и претходно знање потребно да бисте разумели тему и припремили се за информисано истраживање.",
    "LabHypothesizeTitle": "Постављање хипотезе (5 min)",
    "LabHypothesizePurpose": "Развијте проверљиво предвиђање или тврдњу на основу њиховог истраживања и резоновања, постављајући јасно очекивање о томе шта верују да ће се догодити.",
    "LabExperimentTitle": "Експеримент (20 min)",
    "LabExperimentPurpose": "Спроведите структурирано истраживање – практично, симулирано или аналитичко – да тестирате њихову хипотезу и прикупите доказе посматрањем или мерењем.",
    "LabAnalyzeTitle": "Анализа (5 min)",
    "LabAnalyzePurpose": "Интерпретирајте податке које су прикупили, идентификујте обрасце, процените њихову хипотезу и конструишите закључке засноване на доказима.",
    "LabShareTitle": "Дељење (5 min)",
    "LabSharePurpose": "Јасно комуницирајте своје налазе другима, користећи доказе да објасните шта су открили, зашто је то важно и како доприноси дубљем разумевању."
  },
  "es": {
    "LabQuestionTitle": "Pregunta (5 min)",
    "LabQuestionPurpose": "Observar un fenómeno, identificar algo desconcertante y generar una pregunta significativa que guiará la investigación.",
    "LabResearchTitle": "Investigación (5 min)",
    "LabResearchPurpose": "Reunir información de fondo, vocabulario y conocimientos previos necesarios para comprender el tema y prepararse para una investigación informada.",
    "LabHypothesizeTitle": "Hipótesis (5 min)",
    "LabHypothesizePurpose": "Desarrollar una predicción o afirmación comprobable basada en su investigación y razonamiento, estableciendo una expectativa clara de lo que creen que sucederá.",
    "LabExperimentTitle": "Experimento (20 min)",
    "LabExperimentPurpose": "Llevar a cabo una investigación estructurada (práctica, simulada o analítica) para probar su hipótesis y recopilar evidencia a través de la observación o medición.",
    "LabAnalyzeTitle": "Análisis (5 min)",
    "LabAnalyzePurpose": "Interpretar los datos que recopilaron, identificar patrones, evaluar su hipótesis y construir conclusiones basadas en evidencia.",
    "LabShareTitle": "Compartir (5 min)",
    "LabSharePurpose": "Comunicar claramente sus hallazgos a otros, utilizando evidencia para explicar lo que descubrieron, por qué es importante y cómo contribuye a una comprensión más profunda."
  },
  "ru": {
    "LabQuestionTitle": "Вопрос (5 мин)",
    "LabQuestionPurpose": "Понаблюдайте за явлением, определите что-то загадочное и сформулируйте осмысленный вопрос, который будет направлять исследование.",
    "LabResearchTitle": "Исследование (5 мин)",
    "LabResearchPurpose": "Соберите справочную информацию, словарный запас и предварительные знания, необходимые для понимания темы и подготовки к осознанному исследованию.",
    "LabHypothesizeTitle": "Гипотеза (5 мин)",
    "LabHypothesizePurpose": "Разработайте проверяемое предсказание или утверждение на основе их исследований и рассуждений, установив четкое ожидание того, что, по их мнению, произойдет.",
    "LabExperimentTitle": "Эксперимент (20 мин)",
    "LabExperimentPurpose": "Проведите структурированное исследование (практическое, смоделированное или аналитическое), чтобы проверить их гипотезу и собрать доказательства путем наблюдения или измерения.",
    "LabAnalyzeTitle": "Анализ (5 мин)",
    "LabAnalyzePurpose": "Интерпретируйте собранные ими данные, выявите закономерности, оцените их гипотезу и сделайте выводы на основе доказательств.",
    "LabShareTitle": "Обмен мнениями (5 мин)",
    "LabSharePurpose": "Четко сообщите свои результаты другим, используя доказательства, чтобы объяснить, что они обнаружили, почему это важно и как это способствует более глубокому пониманию."
  },
  "id": {
    "LabQuestionTitle": "Pertanyaan (5 mnt)",
    "LabQuestionPurpose": "Amati sebuah fenomena, identifikasi sesuatu yang membingungkan, dan buat pertanyaan bermakna yang akan memandu penyelidikan.",
    "LabResearchTitle": "Penelitian (5 mnt)",
    "LabResearchPurpose": "Kumpulkan informasi latar belakang, kosakata, dan pengetahuan sebelumnya yang diperlukan untuk memahami topik dan bersiap untuk penyelidikan yang terinformasi.",
    "LabHypothesizeTitle": "Hipotesis (5 mnt)",
    "LabHypothesizePurpose": "Kembangkan prediksi atau klaim yang dapat diuji berdasarkan penelitian dan penalaran mereka, menetapkan ekspektasi yang jelas tentang apa yang mereka yakini akan terjadi.",
    "LabExperimentTitle": "Eksperimen (20 mnt)",
    "LabExperimentPurpose": "Lakukan penyelidikan terstruktur—praktik langsung, disimulasikan, atau analitis—untuk menguji hipotesis mereka dan mengumpulkan bukti melalui observasi atau pengukuran.",
    "LabAnalyzeTitle": "Analisis (5 mnt)",
    "LabAnalyzePurpose": "Tafsirkan data yang mereka kumpulkan, identifikasi pola, evaluasi hipotesis mereka, dan buat kesimpulan berdasarkan bukti.",
    "LabShareTitle": "Berbagi (5 mnt)",
    "LabSharePurpose": "Komunikasikan temuan mereka dengan jelas kepada orang lain, gunakan bukti untuk menjelaskan apa yang mereka temukan, mengapa itu penting, dan bagaimana hal itu berkontribusi pada pemahaman yang lebih dalam."
  }
};

for (const [lang, trans] of Object.entries(translations)) {
  if (data[lang]) {
    Object.assign(data[lang], trans);
  } else {
    console.warn(`Language ${lang} not found in translations.json`);
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 4) + '\n', 'utf8');
console.log('Successfully updated translations.json');
