window.lecturePromptsid = {
  STEP0_PROMPT_TEMPLATE: `Buatlah kerangka unit dan struktur pelajaran menggunakan informasi di bawah ini. JANGAN menulis rencana pelajaran lengkap.
                    
Berdasarkan Subject Unit, standar pendidikan, Unit Description/Instruction, Grade Level, Durasi periode kelas (menit), dan Number of Lessons yang diminta, buat respons JSON yang mencakup UnitDescription yang kohesif dan daftar "containers" pelajaran yang tidak saling tumpang tindih.

Unit Subject:
{{$Subject}}

Unit Name:
{{$Name}}

Unit Description/Instruction:
{{$UserPrompt}}

Grade Level:
{{$GradeLevel}}

Duration of class period in minutes:
{{$ClassDuration}}
	
Standards to Align:
{{$Standards}}
    
Students with individualized support:
{{$LearningPlans}}

Resources/Media to use:
{{$MediaContext}}
	
Unit Content:
{{$AttachedUnit}}

Persyaratan Essential Questions:
- Setiap pertanyaan WAJIB berupa kalimat lengkap dan tata bahasa yang benar serta diakhiri dengan tanda tanya.
- Setiap pertanyaan WAJIB diawali dengan "How" atau "Why".
- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS berfokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus mata pelajaran.
- Pertanyaan HARUS dapat ditransfer lintas disiplin dan berlaku di luar unit ini.
- Pertanyaan HARUS digunakan kembali secara verbatim di setiap pelajaran dalam unit.

Yang harus dihasilkan:
- Keluaran HARUS berupa JSON valid yang sesuai dengan skema.
- WAJIB: Lengkapi seluruh properti dalam objek "UnitDescription":
  - "Description": Tulis paragraf 4-5 kalimat yang menjelaskan fokus inti unit dan perjalanan naratifnya.
  - "StudentLearningObjectives": Daftarkan 3-5 tujuan belajar utama yang terukur untuk unit ini.
  - "StandardsAligned": Daftarkan semua standar yang dibahas sepanjang unit.
  - "EssentialQuestions": Tepat 3 pertanyaan konseptual yang mengikuti aturan di atas.
- GENERATE daftar "Lessons" yang berisi tepat {{$NumberOfItems}} pelajaran.
  - Setiap pelajaran harus mencakup "lessonNumber" (indeks mulai dari 1), "lessonName", dan "lessonDescription" (2–4 kalimat yang menjelaskan cakupan pelajaran).

Batasan:
- Jaga agar unit dan setiap pelajaran tetap selaras dengan fokus unit.
- Pastikan urutan logis dari ide dasar menuju pemodelan yang lebih kompleks.
- Akurasi: Semua konten harus akurat secara ilmiah dan sesuai untuk usia siswa.

Output HARUS berupa JSON valid yang sesuai dengan skema. Gunakan format ringkas (tanpa baris kosong tambahan).`,
  PER_LESSON_PROMPT_TEMPLATE: `Buat SATU rencana pembelajaran LECTURE (BUKAN rencana unit, BUKAN beberapa pelajaran) menggunakan info di bawah ini.
ANDA HARUS mengeluarkan JSON valid yang sesuai dengan skema JSON yang diberikan secara tepat. Jangan sertakan kunci tambahan apa pun. Gunakan pemformatan JSON kompak (tanpa baris kosong tambahan).
Mata Pelajaran Unit: 
{{$Subject}}
Nama Unit: 
{{$Name}}
Deskripsi/Instruksi Unit: 
{{$UserPrompt}}
Tingkat Kelas: 
{{$GradeLevel}}
Durasi periode kelas dalam menit 
{{$ClassDuration}}
Sumber Daya/Media yang akan digunakan: 
{{$MediaContext}}
Konten Unit: 
{{$ParentUnitData}}
Standar yang Harus Selaras:
{{$Standards}}
Konten Pelajaran Terlampir: 
{{$AttachedLesson}}

Pertanyaan Esensial Unit (GUNAKAN INI APA ADANYA):
{{$UnitEssentialQuestions}}

Jika Pertanyaan Esensial Unit di atas kosong, hasilkan tepat 3 pertanyaan konseptual dengan mengikuti aturan berikut:
- Setiap pertanyaan HARUS berupa kalimat lengkap, benar secara tata bahasa, dan diakhiri dengan tanda tanya.
- Setiap pertanyaan HARUS diawali dengan kata "How" atau "Why".
- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS berfokus pada gagasan luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten spesifik mata pelajaran.
- Pertanyaan HARUS dapat ditransfer lintas disiplin dan berlaku di luar unit ini.

PESERTA DIDIK DENGAN DUKUNGAN TERINDIVIDUASI (HARUS digunakan HANYA di dalam ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications; gunakan nama/rencana siswa persis seperti yang ditulis):
{{$LearningPlans}}

ATURAN KONTEN PENTING:
- Jaga agar pelajaran selaras dengan fokus unit: mengembangkan dan menggunakan model untuk menggambarkan komposisi atom dari molekul sederhana dan/atau struktur yang lebih luas.
- Sertakan hubungan singkat tingkat tinggi ke DCI relevan lainnya jika sesuai, tetapi tetap pusatkan pelajaran pada pemodelan dan penalaran struktur–sifat (tanpa matematika mendalam, tanpa menyeimbangkan persamaan kecuali secara eksplisit diwajibkan oleh standar).
- Pastikan semua bagian pelajaran mencerminkan Batasan/Cakupan Pelajaran yang disediakan dalam konteks unit; hindari memperkenalkan konsep utama baru yang menjadi bagian dari pelajaran lain.
- EssentialQuestions: HARUS sama persis dengan pertanyaan esensial tingkat unit (teks yang sama, urutan yang sama).
- AssessPriorKnowledge: HANYA jika LessonNumber == 1, isi objek sesuai yang didefinisikan dalam skema. Untuk SEMUA PELAJARAN LAIN, ANDA HARUS mengembalikan objek kosong {} tanpa kunci apa pun di dalamnya. JANGAN gunakan placeholder seperti "N/A", "none", atau array kosong.
- ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications harus mencakup dukungan umum terlebih dahulu, lalu dukungan individual untuk setiap siswa yang disediakan di {{$LearningPlans}}.
- Saat menyarankan "sentence frames" atau "sentence starters" di bagian mana pun dalam rencana pelajaran (terutama di Individualized Supports), ANDA HARUS memberikan kalimat awal yang sebenarnya dan spesifik yang disesuaikan dengan konten pelajaran sehingga guru dapat menggunakannya secara langsung.
- StudentPractice HARUS menyertakan paragraf TeacherNotes yang dimulai dengan 'These tasks reinforce today's learning about ____ by ______.', daftar 2-3 tugas dengan DOK 2-4 dan kriteria keberhasilan, serta interleaving jika subjeknya matematika.

PERSYARATAN OUTPUT:
- Output HARUS berupa JSON valid yang sesuai dengan skema yang diberikan secara tepat.
- Output HARUS hanya SATU rencana pelajaran.
- Tanpa HTML. Tanpa emoji. Tanpa markdown. Teks biasa di dalam field string.`,
  STEP0_SCHEMA: {
  "title": "UnitPlanResponse",
  "type": "object",
  "properties": {
    "UnitDescription": {
      "type": "object",
      "properties": {
        "Description": {
          "type": "string",
          "description": "Unit description as one cohesive plain-text paragraph (4–5 complete sentences) written in natural teacher voice that you could say directly to students. No HTML, no emojis, no bullet points. Must flow conversationally but follow this structure (without headlines): (1) hook sentence that sparks curiosity or makes a surprising contrast, (2) 'In this unit, you will...' sentence about mastery outcomes, (3) 'You'll strengthen your skills in...' sentence about thinking/analysis abilities, (4) 'This connects to...' sentence about real-world relevance, (5) 'Understanding this matters because...' sentence about broader significance or long-term impact."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Full 'Student Learning Objectives' section for this whole unit. Each list item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "List all unique educational standards used anywhere in this unit and its lessons. Do NOT add standards that do not appear in the unit content. Each standard must include standard code and description, e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        }
      },
      "required": [
        "Description",
        "EssentialQuestions",
        "StudentLearningObjectives",
        "StandardsAligned"
      ],
      "additionalProperties": false
    },
    "Lessons": {
      "x-format": false,
      "type": "array",
      "description": "List of lesson containers for this unit (outline only). Each item must be non-overlapping and scoped clearly so lesson content does not repeat across lessons.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Ordering number of a lesson. 1 Based."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Short lesson title as plain text."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 sentences describing the lesson scope, focus, and boundaries to prevent overlap with other lessons."
          }
        },
        "required": [
          "lessonNumber",
          "lessonTitle",
          "lessonOutline"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "UnitDescription",
    "Lessons"
  ],
  "additionalProperties": false,
  "x-removablePaths": {
    "EssentialQuestions": [
      "UnitDescription.EssentialQuestions"
    ],
    "StandardsAligned": [
      "UnitDescription.StandardsAligned"
    ]
  }
},
  PER_LESSON_SCHEMA: {
  "title": "LectureUnitPlanResponse",
  "type": "object",
  "properties": {
    "EssentialQuestions": {
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Just paste all the essential questions that are generated in unit level in same order.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "List of vocabulary terms with definitions. (e.g. 'Solar System – The Sun and all...'). ONLY include terms that are actively used in this specific lesson.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Full 'Student Learning Objectives' section as plain text. Each item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses.",
      "minItems": 2,
      "maxItems": 3,
      "items": {
        "x-format": "- {value}\n",
        "type": "string"
      }
    },
    "StandardsAligned": {
      "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
      "type": "array",
      "description": "Full 'Standards Aligned' section as plain text for this lesson. Each standard must include standard code and description and code and description must be exactly the same used in Unit. e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.AssessPriorKnowledgeLectureTeacherNote}\n\n**Say:** \"{value.SayIntroduction}\"\n\n**{loc.ProjectOrRead}:**\n{value.StatementsToProject}\n\n**Say:** \"{value.SayInstructions}\"\n\n{value.ExpectedStudentResponses}\n\n**Say:** \"{value.SayConclusion}\"\n\n{value.ActionConclusion}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Full 'Assess Prior Knowledge' section. CRITICAL: Look at the 'lessonNumber' in the Attached Lesson Content. IF this is Lesson 1, populate this object fully. IF this is Lesson 2, 3, or any other lesson, YOU MUST RETURN AN EMPTY OBJECT {} with NO properties. Do not populate this for any lesson other than Lesson 1.",
      "properties": {
        "SayIntroduction": {
          "type": "string",
          "description": "What the teacher says to introduce the activity."
        },
        "StatementsToProject": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "List of statements to project or read, containing both accurate ideas and common misconceptions."
        },
        "SayInstructions": {
          "type": "string",
          "description": "What the teacher says to instruct students on what to do with the statements."
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Expected student responses/markings for each statement."
        },
        "SayConclusion": {
          "type": "string",
          "description": "What the teacher says to wrap up."
        },
        "ActionConclusion": {
          "type": "string",
          "description": "Teacher action to conclude (e.g., drawing a diagram)."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "List of alternate options for the activity."
        }
      },
      "required": [
        "SayIntroduction",
        "StatementsToProject",
        "SayInstructions",
        "ExpectedStudentResponses",
        "SayConclusion",
        "ActionConclusion",
        "AlternateOptions"
      ],
      "additionalProperties": false
    },
    "Objective": {
      "x-format": "### {green}({loc.Objective} {value.Duration})\n\n**{loc.Purpose}:** Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation.\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Create an Objective section that clearly states the student learning goals for the lesson.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Time estimate (e.g. '(2-3 min)')"
        },
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "type": "object",
            "x-format": "\n\n**{index}.** {value.Step}\n{value.Bullets}",
            "properties": {
              "Step": {
                "type": "string",
                "description": "Teacher step or script."
              },
              "Bullets": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "Optional list of bullet points for this step. For the first step, include the actual learning objectives here."
              }
            },
            "required": [
              "Step",
              "Bullets"
            ],
            "additionalProperties": false
          },
          "description": "Must include: 1) Explain learning goals using direct teacher-facing script (e.g., Say: '...') and put the actual objectives in the Bullets array. 2) Ask students to record objectives in their notebooks. 3) Briefly tell the teacher how to connect objectives to students' real-life experiences."
        }
      },
      "required": [
        "Duration",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "ContentDeliveryAndInteractiveActivities": {
      "x-format": "### {green}({loc.ContentDeliveryAndInteractiveActivities} {value.Duration})\n\n**1. {loc.Hook}** {value.Hook}\n\n**2. {loc.Vocabulary}**\n\n{value.Vocabulary.Bullets}\n\n{value.Vocabulary.ConclusionSay}\n\n**3. {loc.NewConceptsAndKnowledge}**\n\n{value.NewConceptsAndKnowledge}\n\n### ⚡ {loc.AttentionReset}\n\n**{loc.Purpose}:** {value.AttentionReset.StandardParagraph}\n\n{value.AttentionReset.Directions}\n\n{loc.WhyThisWorks}:\n\n{value.AttentionReset.WhyThisWorks}\n\n### {loc.ContinueInstructionAfterActivity}\n\n{value.ContinueInstruction}\n\n### ⚠️ {loc.AnticipatedMisconceptions}\n\n{value.AnticipatedMisconceptions}\n\n{value.Connect}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
      "type": "object",
      "description": "Block for content delivery.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Time estimate (e.g. '(30 min)')"
        },
        "Hook": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{value}\n\n",
            "type": "string"
          },
          "description": "Write a dramatic, high-engagement hook delivered through teacher script. Should be surprising, curiosity-building, and tied to the main concept."
        },
        "Vocabulary": {
          "type": "object",
          "properties": {
            "Bullets": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "List essential vocabulary terms. Provide teacher script for defining each term formatted strictly as: '[Term] - Say: \"[Definition/Script]\"'. Example: 'Lever - Say: \"A lever is a simple machine...\"'."
            },
            "ConclusionSay": {
              "type": "string",
              "description": "A concluding 'Say: ' statement to transition."
            }
          },
          "required": [
            "Bullets",
            "ConclusionSay"
          ],
          "additionalProperties": false
        },
        "NewConceptsAndKnowledge": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{value}\n\n",
            "type": "string"
          },
          "description": "Write a detailed teacher lecture with scripts (Say: “…”). Include step-by-step what teacher says, does, and may demonstrate. Break down complex ideas, provide examples/analogies, make explicit connections to prior knowledge."
        },
        "AttentionReset": {
          "type": "object",
          "description": "Insert the standard attention-reset paragraph exactly as written: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview.'",
          "properties": {
            "StandardParagraph": {
              "type": "string",
              "description": "Must be exactly: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview. (word for word)'"
            },
            "Directions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{index}. {value}",
                "type": "string"
              },
              "description": "Provide directions for the activity, including teacher script and what students & teacher need to do."
            },
            "WhyThisWorks": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Explain in bullets why activity works for re-engagement, resetting cognitive focus, reinforcing concepts and purposeful preview. E.g. 'Standing + movement resets attention.'"
            }
          },
          "required": [
            "StandardParagraph",
            "Directions",
            "WhyThisWorks"
          ],
          "additionalProperties": false
        },
        "ContinueInstruction": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{index}. {value}\n\n",
            "type": "string"
          },
          "description": "Numbered steps to continue instruction with teacher scripts (Say: “…”). Break down complex ideas, provide examples/analogies, to intrigue, foreshadow future learning, extend key ideas."
        },
        "AnticipatedMisconceptions": {
          "x-format": "{items}",
          "type": "array",
          "description": "List anticipated common student misconceptions to ensure teacher is ready.",
          "items": {
            "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponse}: {value.TeacherResponse}",
            "type": "object",
            "properties": {
              "Misconception": {
                "type": "string",
                "description": "e.g., 'Students may think a bigger lever always works better.'"
              },
              "TeacherResponse": {
                "type": "string",
                "description": "How to effectively respond to potential student misunderstanding and guide to accurate understanding."
              }
            },
            "required": [
              "Misconception",
              "TeacherResponse"
            ],
            "additionalProperties": false
          }
        },
        "Connect": {
          "x-format": "### {green}({loc.Connect} {value.Duration})\n\n1. Say: \"{value.Step1Say}\"\n\n2. Say: \"{value.Step2Say}\"\n\n3. Prompt:\n\n{value.Step3Prompts}\n\n4. Whole-group share: Say: \"{value.Step4Say}\"\n\n✅ **{loc.ExpectedStudentResponses}**\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Relate to a purpose. Connect to one of the essential questions.",
          "properties": {
            "Duration": {
              "type": "string",
              "description": "e.g., '(3 min)'"
            },
            "Step1Say": {
              "type": "string",
              "description": "Teacher script connecting the previous activity to a bigger idea."
            },
            "Step2Say": {
              "type": "string",
              "description": "Teacher script asking students to turn and talk to a partner."
            },
            "Step3Prompts": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- \"{value}\"",
                "type": "string"
              },
              "description": "Specific questions for the prompt (e.g., 'Why was the shaduf important...', 'What evidence shows...')."
            },
            "Step4Say": {
              "type": "string",
              "description": "Teacher script for whole-group share (e.g., 'Let's hear a few ideas...')."
            },
            "ExpectedStudentResponses": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Deep expected student responses that use reasoning or evidence."
            }
          },
          "required": [
            "Duration",
            "Step1Say",
            "Step2Say",
            "Step3Prompts",
            "Step4Say",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        },
        "Differentiation": {
          "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
          "type": "object",
          "description": "Differentiate instruction (how to teach, not simplify materials). Vary complexity and depth, promote active engagement/language. Realistic for classroom.",
          "properties": {
            "LanguageLearners": {
              "x-format": "**{loc.LanguageLearners}**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "AdditionalScaffolding": {
              "x-format": "**{loc.StudentsInNeedOfAdditionalScaffolding}**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "GoDeeper": {
              "x-format": "**{loc.GoDeeper}**\n\n{value.Challenges}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "properties": {
                "Challenges": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "For Go Deeper responses."
                }
              },
              "required": [
                "Challenges",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "LanguageLearners",
            "AdditionalScaffolding",
            "GoDeeper"
          ],
          "additionalProperties": false
        },
        "AccommodationsAndModifications": {
          "x-format": "**🤝 {loc.AccommodationsAndModifications}**\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
          "type": "object",
          "description": "This section must include two types of supports: General Supports and Individualized Supports. Focus on access, not lowering rigor.",
          "properties": {
            "General": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Non-student-specific strategies that improve access for all learners (e.g., visuals, pre-filled notes, digital glossary, chunked instructions). Provide 2-4 bullet points."
            },
            "IndividualSupport": {
              "x-format": "{items}",
              "type": "array",
              "description": "Specific accommodations and modifications for named students with formal plans. List EACH student individually; do NOT group students together. The supports for each student should be an easy-to-scan list.",
              "items": {
                "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                "type": "object",
                "properties": {
                  "StudentName": {
                    "type": "string",
                    "description": "First and last name of the individual student receiving these supports."
                  },
                  "PlanProvided": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "The formal plan provided for this student in the prompt. Parse the plan into a clear list. You may paraphrase it to improve formatting, but do NOT omit or add any information."
                  },
                  "PlanImplementation": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Concrete tools/stems/visuals/organizers for this task."
                  }
                },
                "required": [
                  "StudentName",
                  "PlanProvided",
                  "PlanImplementation"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "General",
            "IndividualSupport"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Duration",
        "Hook",
        "Vocabulary",
        "NewConceptsAndKnowledge",
        "AttentionReset",
        "ContinueInstruction",
        "AnticipatedMisconceptions",
        "Connect",
        "Differentiation",
        "AccommodationsAndModifications"
      ],
      "additionalProperties": false
    },
    "ReviewAndSpacedRetrieval": {
      "x-format": "### 🧠 {green}({loc.ReviewAndSpacedRetrieval})\n\n{loc.ReviewAndSpacedRetrievalLabNotes}\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.SpacedRetrieval}",
      "type": "object",
      "description": "Full 'Review & Spaced Retrieval' section.",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Asking students to recall NEW learning from TODAY'S lesson.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "The teacher prompt starting with 'Say: '."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ **{loc.ExpectedStudentResponses}**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "Say",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        },
        "EssentialQuestionConnection": {
          "x-format": "💭 **{loc.EssentialQuestionConnection}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Teacher prompt linking to unit question.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "The teacher prompt starting with 'Say: '."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ **{loc.ExpectedStudentResponses}**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "Say",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        },
        "SpacedRetrieval": {
          "x-format": "⏳ **{loc.SpacedRetrieval}**\n\n{value.PriorLearningContext} {value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Recall from a specific prior lesson/unit.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Context sentence like 'Earlier in this lesson, students learned...'"
            },
            "Say": {
              "type": "string",
              "description": "The teacher prompt starting with 'Say: '."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ **{loc.ExpectedStudentResponses}:**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "PriorLearningContext",
            "Say",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "ActiveRecall",
        "EssentialQuestionConnection",
        "SpacedRetrieval"
      ],
      "additionalProperties": false
    },
    "QAndAAndDiscussion": {
      "x-format": "### {green}({loc.QAndAAndDiscussion} {value.Duration})\n\n**📋 {loc.InstructionsForTeachers}**\n\n1. Say: \"{value.InstructionsForTeachers.Step1_InviteSay}\"\n2. Ask:\n{value.InstructionsForTeachers.Step2_AskQuestions}\n3. Say: \"{value.InstructionsForTeachers.Step3_CaptureSay1}\" Record: {value.InstructionsForTeachers.Step3_CaptureRecord} Say:\n   \"{value.InstructionsForTeachers.Step3_CaptureSay2}\"\n4. Say: \"{value.InstructionsForTeachers.Step4_AnswerSay1}\" {value.InstructionsForTeachers.Step4_AnswerAddress} Say: \"{value.InstructionsForTeachers.Step4_AnswerSay2}\"\n\n{loc.NoteForTeacherQA}",
      "type": "object",
      "description": "Block for Q&A and Discussion.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Time estimate (e.g. '(5 min)')"
        },
        "InstructionsForTeachers": {
          "type": "object",
          "description": "Teacher guidance for the Q&A and Discussion session.",
          "properties": {
            "Step1_InviteSay": {
              "type": "string",
              "description": "e.g., 'Now is your chance to think about what we learned...'"
            },
            "Step2_AskQuestions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "   - \"{value}\"",
                "type": "string"
              },
              "description": "3-4 questions to ask students."
            },
            "Step3_CaptureSay1": {
              "type": "string",
              "description": "e.g., 'If you have a question, that means you are thinking deeply...'"
            },
            "Step3_CaptureRecord": {
              "type": "string",
              "description": "e.g., 'Write student questions on a chart titled Questions We Still Have.'"
            },
            "Step3_CaptureSay2": {
              "type": "string",
              "description": "e.g., 'We will keep adding to this chart throughout the unit...'"
            },
            "Step4_AnswerSay1": {
              "type": "string",
              "description": "e.g., 'Let's look at our questions. Which ones can we answer using what we learned today?'"
            },
            "Step4_AnswerAddress": {
              "type": "string",
              "description": "e.g., 'Address a few questions using student responses and evidence.'"
            },
            "Step4_AnswerSay2": {
              "type": "string",
              "description": "e.g., 'Some of these questions will help guide what we learn next...'"
            }
          },
          "required": [
            "Step1_InviteSay",
            "Step2_AskQuestions",
            "Step3_CaptureSay1",
            "Step3_CaptureRecord",
            "Step3_CaptureSay2",
            "Step4_AnswerSay1",
            "Step4_AnswerAddress",
            "Step4_AnswerSay2"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Duration",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Conclusion": {
      "x-format": "### {green}({loc.Conclusion} {value.Duration})\n\n{value.BuildCuriosity}",
      "type": "object",
      "description": "Block for Conclusion.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Time estimate (e.g. '(1 min)')"
        },
        "BuildCuriosity": {
          "type": "string"
        }
      },
      "required": [
        "Duration",
        "BuildCuriosity"
      ],
      "additionalProperties": false
    },
    "FormativeAssessment": {
      "x-format": "### ✅ {green}({loc.FormativeAssessment})\n\n{items}",
      "type": "array",
      "description": "Extract and generate EXACTLY 4 Formative Assessment prompts covering DOK 1-4. For each prompt, include the PromptLabel, Question, and ExpectedStudentResponses.",
      "items": {
        "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n{value.ExpectedStudentResponses}\n",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "e.g., 'Prompt 1 (DOK 1)'"
          },
          "Question": {
            "type": "string",
            "description": "The exact question text."
          },
          "ExpectedStudentResponses": {
            "x-format": "{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1-2 sample responses showing mastery."
          }
        },
        "required": [
          "PromptLabel",
          "Question",
          "ExpectedStudentResponses"
        ],
        "additionalProperties": false
      },
      "minItems": 4,
      "maxItems": 4
    },
    "StudentPractice": {
      "x-format": "### 🖊️ {green}({loc.StudentPractice})\n\n**Teacher Notes:** {value.TeacherNotes}\n\n{value.Tasks}\n\n🔎 **{loc.Reflection}:** {value.Reflection.Prompt}\n\n{value.Reflection.ReflectionOptions}",
      "type": "object",
      "description": "Full 'Student Practice' section for homework / out-of-class practice.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Notes explaining how the tasks reinforce today's learning and strengthen long-term retention."
        },
        "Tasks": {
          "x-format": "{items}",
          "type": "array",
          "description": "Generate 4 practice tasks covering DOK levels 2, 3, and 4.",
          "items": {
            "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{loc.SuccessCriteria}\n\n{value.SuccessCriteria}",
            "type": "object",
            "properties": {
              "TaskDescription": {
                "type": "string",
                "description": "e.g., '(DOK 2) Draw a shaduf and label...'"
              },
              "SuccessCriteria": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "3 success criteria bullet points."
              }
            },
            "required": [
              "TaskDescription",
              "SuccessCriteria"
            ],
            "additionalProperties": false
          },
          "minItems": 4,
          "maxItems": 4
        },
        "Reflection": {
          "type": "object",
          "description": "A reflection task for the students.",
          "properties": {
            "Prompt": {
              "type": "string",
              "description": "e.g., 'Write 2-3 sentences responding to one prompt:'"
            },
            "ReflectionOptions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 reflection question options."
            }
          },
          "required": [
            "Prompt",
            "ReflectionOptions"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "TeacherNotes",
        "Tasks",
        "Reflection"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "EssentialQuestions",
    "KeyVocabulary",
    "StudentLearningObjectives",
    "StandardsAligned",
    "AssessPriorKnowledge",
    "Objective",
    "ContentDeliveryAndInteractiveActivities",
    "ReviewAndSpacedRetrieval",
    "QAndAAndDiscussion",
    "Conclusion",
    "FormativeAssessment",
    "StudentPractice"
  ],
  "additionalProperties": false,
  "x-removablePaths": {
    "EssentialQuestions": [
      "EssentialQuestions"
    ],
    "StandardsAligned": [
      "StandardsAligned"
    ],
    "AssessPriorKnowledge": [
      "AssessPriorKnowledge"
    ],
    "FormativeAssessment": [
      "FormativeAssessment"
    ]
  }
},
};
