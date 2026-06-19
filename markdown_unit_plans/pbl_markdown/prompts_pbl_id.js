window.prompts_pbl_id = {
  STEP0_PROMPT_TEMPLATE: `Buatlah rencana unit dan pelajaran berbasis proyek menggunakan informasi di bawah ini:  
Mata Pelajaran Unit:
{{$Subject}}
Nama Unit:
{{$Name}}
Deskripsi/Instruksi Unit:
{{$UserPrompt}}
Tingkat Kelas:
{{$GradeLevel}}
Berapa lama proyek akan berlangsung dalam hari
{{$NumberOfDays}}
Lokasi:
{{$Location}}
Sumber/Dukungan Media yang digunakan:
{{$MediaContext}}, 
Konten Unit: 
{{$AttachedUnit}} 
Rencana Pembelajaran Siswa:
{{$LearningPlans}}
Standar yang harus Selaras:
{{$Standards}}
Anda ditugaskan untuk merancang unit berbasis proyek yang terperinci menggunakan prinsip-prinsip ilmu kognitif. Output Anda HARUS mengikuti urutan bagian, judul, dan aturan konten yang tepat di bawah ini. Jika ada bagian yang hilang atau urutannya tidak sesuai, buat ulang hingga semua ketentuan terpenuhi. 
Aturan Output Global (berlaku untuk semuanya) Ikuti urutan bagian dan judul yang tepat seperti yang ditunjukkan di bawah ini. Jangan menambahkan bagian tambahan atau mengganti nama judul. Masalah dunia nyata harus relevan bagi siswa pada tingkat kelas ini. Hindari topik yang mungkin sensitif terhadap kesesuaian perkembangan topik serta topik sensitif seperti kemiskinan, ketidakamanan tempat tinggal, ras, dll., atau topik kontroversial seperti evolusi. Sertakan komponen berikut dalam desain proyek unit.  
Relevansi Budaya & Inklusi: Gabungkan berbagai perspektif dan renungkan dampaknya bagi semua pihak yang terlibat. Konten harus terhubung dengan siswa dari beragam latar belakang dan komunitas untuk menciptakan pelajaran yang relevan secara budaya dan responsif secara budaya. Hindari stereotip. 
PENTING: respons harus dalam {{$ResponseLanguage}}

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  STEP0_SCHEMA: {
  "title": "PBLUnitPlanResponse",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "UnitPlan"
  ],
  "properties": {
    "UnitPlan": {
      "type": "object",
      "description": "Kembalikan Rencana Unit Pembelajaran Berbasis Proyek (PBL) yang lengkap. Jangan menambahkan kunci tambahan. Isi setiap bidang yang diwajibkan. Harus berfungsi untuk APA SAJA mata pelajaran. Lokaliskan para pemangku kepentingan/audiens/sumber daya ke kode pos/lokasi yang diberikan tanpa mengarang alamat/nomor telepon yang spesifik.",
      "additionalProperties": false,
      "required": [
        "AssessPriorKnowledge",
        "UnitOverview",
        "DesiredOutcomes",
        "FramingTheLearning",
        "AssessmentPlan",
        "LearningPlan",
        "UnitPreparationAndConsiderations",
        "TeacherGuidancePhase1",
        "TeacherGuidancePhase2",
        "TeacherGuidancePhase3"
      ],
      "properties": {
        "AssessPriorKnowledge": {
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n**{loc.Purpose}:** {loc.PBLAssessPriorKnowledgePurposeText}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
          "type": "object",
          "description": "Nilai bagian Pengetahuan Awal. 1. Pastikan prompt DOK 1-3 digunakan. 2. Sertakan keterampilan prasyarat yang diperlukan untuk tujuan pembelajaran siswa. 3. Pilih satu modalitas dari daftar ini dan kembangkan sepenuhnya: pertanyaan, K-W-L, visual, peta konsep, tulisan reflektif, panduan antisipasi, penilaian kosakata. 4. Prompt awal guru dengan pernyataan 'Katakan:'. 5. Instruksi yang jelas dan template/struktur untuk modalitas yang dipilih. 6. Bagian 'Respons Siswa yang Diharapkan'. 7. Prompt penutup guru 'Katakan:'. 8. Setelah mengembangkan sepenuhnya satu modalitas, berikan 2 opsi alternatif singkat.",
          "properties": {
            "ActivityInstructions": {
              "type": "string",
              "description": "Instruksi yang jelas dan template/struktur untuk modalitas yang dipilih. Contoh: 'Katakan: \"Sebelum kita mulai...\"'"
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "description": "Jawaban yang diantisipasi atau miskonsepsi umum untuk modalitas yang dipilih. PENTING: Jangan sertakan bullet point, tanda hubung, atau angka di awal string.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "ClosingTeacherPrompt": {
              "type": "string",
              "description": "Prompt penutup guru 'Katakan:' yang memvalidasi pemikiran siswa dan mempratinjau investigasi unit."
            },
            "AlternateOptions": {
              "x-format": "**{loc.AlternateOptions}**\n\n{items}",
              "type": "array",
              "description": "2 opsi alternatif singkat yang dapat dipilih guru.",
              "items": {
                "x-format": "{index}. {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "ActivityInstructions",
            "ExpectedStudentResponses",
            "ClosingTeacherPrompt",
            "AlternateOptions"
          ],
          "additionalProperties": false
        },
        "UnitOverview": {
          "type": "object",
          "x-format": "### {green}({loc.UnitTask})\n\n**{loc.PurposeLabel}** {loc.UnitTaskPurposeValue}\n\n**{loc.Title}: {value.TaskStatementTitle}**\n\n{value.LetterGreeting}\n\n{value.LetterBody}\n\n{value.LetterSignOff}\n\n{value.LetterSender}\n\n**{loc.Mission}:** {value.Mission}\n\n**{loc.ProjectContextAndStakeholders}:** {value.ProjectContextAndStakeholders}\n\n### {green}({loc.DrivingQuestion})\n\n**{loc.PurposeLabel}** {loc.DrivingQuestionPurposeValue}\n\n{value.DrivingQuestion}\n\n### {green}({loc.TheDeliverable})\n\n{value.FinalDeliverableRequirements}\n\n{value.ClosingCallToAction}",
          "additionalProperties": false,
          "required": [
            "TaskStatementTitle",
            "LetterGreeting",
            "LetterBody",
            "LetterSignOff",
            "LetterSender",
            "DrivingQuestion",
            "Mission",
            "ProjectContextAndStakeholders",
            "FinalDeliverableRequirements",
            "ClosingCallToAction"
          ],
          "properties": {
            "TaskStatementTitle": {
              "type": "string",
              "description": "Judul pesan peluncuran yang ditujukan kepada siswa (misalnya, Message from the Coconut Creek STEM Innovation Team)."
            },
            "LetterGreeting": {
              "type": "string",
              "description": "Sapaan pembuka untuk pesan peluncuran yang ditujukan kepada siswa (misalnya, 'Hello engineers-in-training,')."
            },
            "LetterBody": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              },
              "description": "Paragraf utama dari pesan peluncuran yang ditujukan kepada siswa (3-5 paragraf) ditulis seperti organisasi lokal atau orang yang kredibel. Harus mencakup hubungan yang jelas dengan masalah, pertanyaan pendorong, persyaratan hasil karya, dan ajakan bertindak yang menginspirasi. Mendesak, bermakna, autentik. Jangan sertakan judul, sapaan, frasa penutup (misalnya, 'Sincerely,'), atau nama pengirim di sini. Hanya isi paragraf badan."
            },
            "LetterSignOff": {
              "type": "string",
              "description": "Frasa penutup untuk pesan (misalnya, 'Sincerely,'). Berikan hanya frasa penutupnya, tidak ada yang lain."
            },
            "LetterSender": {
              "type": "string",
              "description": "Nama organisasi lokal atau orang kredibel yang mengirim pesan (misalnya, 'Coconut Creek STEM Innovation Team'). Jangan sertakan penutup (misalnya, 'Sincerely') di sini."
            },
            "DrivingQuestion": {
              "type": "string",
              "description": "Satu Pertanyaan Pendorong terbuka yang kuat yang berakar pada tempat dan kebutuhan pemangku kepentingan. Pertanyaan ini juga harus dijalin ke dalam LetterBody. HARUS digunakan kembali secara verbatim dalam FramingTheLearning.DrivingQuestion."
            },
            "Mission": {
              "type": "string",
              "description": "Paragraf yang dimulai dengan 'Your task is to...' yang menjelaskan apa yang akan dibuat/dilakukan siswa dan mengapa hal itu penting bagi komunitas/audiens."
            },
            "ProjectContextAndStakeholders": {
              "type": "string",
              "description": "Narasi singkat: siapa yang terdampak, mengapa hal itu penting sekarang secara lokal, dan pemangku kepentingan/audiens mana yang peduli."
            },
            "FinalDeliverableRequirements": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 5,
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              },
              "description": "Ditulis untuk siswa, jelaskan hasil akhir yang akan mereka buat dan audiens autentik yang dilayani. Format setiap item dengan judul tebal (misalnya, **Summary:** ...). Jangan sertakan penomoran apa pun (seperti 1., 2.) atau bullet point di awal string; mulai langsung dengan judul tebal. Harus mencakup setidaknya ringkasan singkat, lalu empat komponen: (1) Concept & Purpose Plan yang menjelaskan ide melalui representasi visual atau tertulis dan mengapa hal itu penting bagi komunitas atau konteks; (2) Evidence-Based Justification yang mengharuskan analisis terhadap setidaknya dua faktor relevan dan penjelasan pilihan menggunakan bukti dari riset, data, eksperimen, atau observasi; (3) Model or Representation yang menjelaskan jenis model yang dibuat, apa yang direpresentasikannya, bagaimana cara kerjanya, dan bagaimana model itu mengungkap kekuatan, stabilitas, efisiensi, atau sistem di balik ide tersebut; dan (4) The Verdict, sebuah argumen penutup yang didukung bukti, menjelaskan mengapa solusi tersebut efektif, layak, atau bermakna, merangkum penalaran, bukti, dan model, serta mengomunikasikan nilai desain kepada audiens autentik. Pernyataan akhir Anda harus menunjukkan bahwa Anda dapat menerapkan pengetahuan disipliner, menggunakan bukti, memodelkan ide kompleks, dan menjelaskan implikasi dunia nyata."
            },
            "ClosingCallToAction": {
              "type": "string",
              "description": "Penutup yang menginspirasi: komunitas/audiens menaruh harapan pada para pemikir kreatif yang dapat mengubah bukti menjadi tindakan. Tekankan bahwa ide-ide kuno dapat menginspirasi solusi modern."
            }
          }
        },
        "DesiredOutcomes": {
          "type": "object",
          "x-format": "### 📏{green}({loc.StandardsAligned})\n\n{value.StandardsAligned}\n\n### 💭{green}({loc.BigIdeasAndEssentialQuestionsAmp})\n\n**{loc.Purpose}:** {loc.BigIdeasPurpose}\n\n{value.BigIdeasAndEssentialQuestions}\n\n### 🎯{green}({loc.LearningObjectives})\n\n{value.LearningObjectives}",
          "additionalProperties": false,
          "required": [
            "StandardsAligned",
            "BigIdeasAndEssentialQuestions",
            "LearningObjectives"
          ],
          "properties": {
            "StandardsAligned": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 1,
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Standar dicantumkan secara verbatim saat diberikan, format 'CODE: description'. Jangan sertakan bullet point di awal string Anda."
            },
            "BigIdeasAndEssentialQuestions": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "maxItems": 4,
              "description": "Hasilkan 3-4 pasangan Big Idea dan Essential Question yang menetapkan konsep abadi dan dapat dipindahkan yang menjadi jangkar seluruh unit, membimbing desain inkuiri dan asesmen, serta memberikan kerangka konseptual menyeluruh yang menghubungkan semua tugas, keterampilan, dan aktivitas menjadi pemahaman yang bermakna.",
              "items": {
                "type": "object",
                "x-format": "\n\n**{loc.BigIdeaLabel}** {value.BigIdea}\n\n- {loc.EssentialQuestionLabel} {value.EssentialQuestion}",
                "additionalProperties": false,
                "required": [
                  "BigIdea",
                  "EssentialQuestion"
                ],
                "properties": {
                  "BigIdea": {
                    "type": "string",
                    "description": "Pernyataan konseptual yang luas tentang pemahaman abadi yang menjelaskan prinsip fundamental yang mendasari unit, menghubungkan semua tugas dan asesmen, mendukung pembelajaran yang dapat dipindahkan di luar konteks spesifik, dan mencerminkan cara berpikir inti disiplin, bukan fakta terisolasi."
                  },
                  "EssentialQuestion": {
                    "type": "string",
                    "description": "Buat pertanyaan esensial yang hanya berfokus pada konsep universal yang luas seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. Jangan menyebutkan istilah, proses, kosakata, atau contoh khusus mata pelajaran apa pun. Pertanyaan harus terbuka, dapat dipindahkan lintas disiplin, dan mustahil dijawab hanya dengan mempelajari isi pelajaran atau unit. Fokus hanya pada ide-ide besar, bukan pada isi mata pelajaran."
                  }
                }
              }
            },
            "LearningObjectives": {
              "type": "object",
              "x-format": "🎯**{loc.StudentsWillUnderstandThatLabel}**\n\n{value.StudentsWillUnderstandThat}\n\n🎯**{loc.StudentsWillKnowThatLabel}**\n\n{value.StudentsWillKnowThat}\n\n🎯**{loc.StudentsWillBeAbleToLabel}**\n\n{value.StudentsWillBeAbleTo}",
              "additionalProperties": false,
              "required": [
                "StudentsWillUnderstandThat",
                "StudentsWillKnowThat",
                "StudentsWillBeAbleTo"
              ],
              "properties": {
                "StudentsWillUnderstandThat": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Setiap objective harus diakhiri dengan (DOK X) dan mewakili Big Ideas atau Enduring Understandings dengan menghasilkan 3 hingga 5 pernyataan konseptual jangka panjang yang menjelaskan mengapa pembelajaran ini penting di luar unit, menyoroti pola, hubungan, atau prinsip yang dapat ditransfer lintas konteks, dan menjelaskan bagaimana atau mengapa sesuatu bekerja daripada sekadar apa itu. Tulis objective sebagai kelanjutan langsung dari frasa 'Students will understand that...'. Jangan mengulang frasa 'Students will understand that', dan jangan memulai dengan kata kerja seperti 'Explain that' atau 'Describe that' (misalnya, cukup tulis 'engineering designs improve when...'). JANGAN sertakan penomoran, bullet points, atau tanda hubung apa pun di awal string Anda."
                },
                "StudentsWillKnowThat": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Setiap objective harus diakhiri dengan (DOK X) dan mewakili Facts atau Core Content Knowledge dengan menghasilkan 3 hingga 5 pernyataan fakta, istilah, atau pengetahuan dasar khusus disiplin yang mengidentifikasi informasi penting yang harus diingat siswa, tetap konkret dan faktual alih-alih konseptual, mendukung standar unit dan tugas kinerja, menggunakan kosakata akademik yang jelas sesuai dengan mata pelajaran, serta menyertakan label DOK yang sesuai biasanya pada level 1 atau 2. Tulis objective sebagai kelanjutan langsung dari frasa 'Students will know that...'. Jangan mengulang frasa 'Students will know that', dan jangan memulai dengan kata kerja seperti 'Identify that' atau 'Define' (misalnya, cukup tulis 'a lever has an effort arm...'). JANGAN sertakan penomoran, bullet points, atau tanda hubung apa pun di awal string Anda."
                },
                "StudentsWillBeAbleTo": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Setiap objective harus diakhiri dengan (DOK X) dan mewakili Skills atau Practices yang selaras dengan disiplin dengan menghasilkan 4 hingga 7 pernyataan berbasis keterampilan yang menggambarkan apa yang akan dilakukan siswa; selaraskan dengan praktik khusus disiplin; kaitkan secara langsung dengan hasil proyek atau tugas kinerja; tetap dapat diukur dan dapat diamati; serta sertakan level DOK yang sesuai antara 2 dan 4. Tulis objective sebagai kelanjutan langsung dari frasa 'Students will be able to...'. Mulailah langsung dengan kata kerja tindakan yang dapat diukur (misalnya, analyze, compare, design, model, solve). Jangan mengulang awalan 'Students will be able to'. JANGAN sertakan penomoran, bullet points, atau tanda hubung apa pun di awal string Anda."
                }
              }
            }
          }
        },
        "FramingTheLearning": {
          "type": "object",
          "x-format": "### {green}({loc.DrivingQuestion})\n\n**{loc.PurposeLabel}** {loc.DrivingQuestionPurposeValue}\n\n**{loc.Question}:** {value.DrivingQuestion}\n\n### {green}({loc.Problem})\n\n**{loc.PurposeLabel}** {loc.ProblemPurposeValue}\n\n{value.ProblemDescription}\n### {green}({loc.Project})\n\n**{loc.PurposeLabel}** {loc.ProjectPurposeValue}\n\n{value.ProjectDescription}\n### {green}({loc.Place})\n\n**{loc.PurposeLabel}** {loc.PlacePurposeValue}{value.Sites}\n\n### 🔤 {green}({loc.KeyVocabulary})\n\n{value.KeyVocabulary}",
          "additionalProperties": false,
          "required": [
            "DrivingQuestion",
            "ProblemDescription",
            "ProjectDescription",
            "Sites",
            "KeyVocabulary"
          ],
          "properties": {
            "DrivingQuestion": {
              "type": "string",
              "description": "HARUS cocok dengan UnitOverview.DrivingQuestion secara kata demi kata. Nyatakan pertanyaan penggerak yang sebenarnya (misalnya, 'How can we design an invention inspired by ancient Egyptian innovation to solve a real problem in our Coconut Creek community?')."
            },
            "ProblemDescription": {
              "type": "array",
              "x-format": "{items}",
              "description": "Paragraf deskripsi masalah yang menjelaskan tantangan nyata. Jelaskan mengapa masalah ini penting dan konsekuensinya jika tidak ditangani, dengan mengidentifikasi faktor-faktor penyebab yang mendasarinya. Tunjukkan bagaimana kesalahpahaman, informasi yang hilang, atau variabel yang terlewat berkontribusi pada masalah tersebut. Jelaskan bagaimana solusi tersebut melayani audiens autentik yang nyata dan relevan. Jangan sertakan penomoran atau bullet points apa pun di awal string Anda.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n"
              }
            },
            "ProjectDescription": {
              "type": "array",
              "x-format": "{items}",
              "description": "Paragraf naratif tentang bagaimana pembelajaran berkembang sepanjang proyek multi-hari (inquiry -> apply -> refine -> present). Jelaskan bagaimana siswa mulai dengan mengeksplorasi contoh, mengenali pola, menerapkan pengetahuan sains melalui uji coba langsung, lalu menggunakan temuan tersebut untuk mengembangkan sebuah invention orisinal. Jelaskan bagaimana mereka merevisi prototipe dan mempresentasikan ide kepada audiens autentik. Jangan sertakan penomoran atau bullet points apa pun di awal string Anda.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n"
              }
            },
            "Sites": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "x-format": "{items}",
              "description": "Harus mencakup 3 hingga 5 Place-Based Sites of Engagement. Pastikan situs mewakili konteks yang beragam dan secara jelas menunjukkan bagaimana komunitas lokal menjadi bagian dari ekosistem pembelajaran.",
              "items": {
                "type": "object",
                "x-format": "\n\n**{value.SiteTitle}**\n\n- **{loc.StudentEngagement}:** {value.StudentEngagement}\n- **{loc.Relevance}:** {value.Relevance}",
                "additionalProperties": false,
                "required": [
                  "SiteTitle",
                  "StudentEngagement",
                  "Relevance"
                ],
                "properties": {
                  "SiteTitle": {
                    "type": "string",
                    "description": "Lokasi fisik, komunitas, virtual, atau spesifik disiplin yang bermakna dan relevan dengan konteks unit (misalnya, 'Coconut Creek Middle School Campus (Primary Investigation Site)')."
                  },
                  "StudentEngagement": {
                    "type": "string",
                    "description": "Menjelaskan aktivitas inquiry autentik yang dilakukan siswa di atau bersama situs tersebut seperti observasi, pengumpulan data, wawancara, analisis, eksplorasi virtual, atau tugas lapangan terpandu yang terkait dengan masalah dunia nyata."
                  },
                  "Relevance": {
                    "type": "string",
                    "description": "Menjelaskan mengapa situs tersebut penting dengan menghubungkannya pada masalah, menunjukkan bagaimana situs menyediakan bukti atau keahlian, menjelaskan bagaimana situs mendukung desain solusi atau pemodelan, serta menyoroti signifikansi lokal atau khusus komunitas."
                  }
                }
              }
            },
            "KeyVocabulary": {
              "type": "object",
              "x-format": "{value.Tiers}",
              "additionalProperties": false,
              "required": [
                "Tiers"
              ],
              "properties": {
                "Tiers": {
                  "type": "array",
                  "minItems": 4,
                  "maxItems": 4,
                  "x-format": "{items}",
                  "description": "Buat bagian Tiered Academic Vocabulary dengan tepat empat tier berlabel.",
                  "items": {
                    "type": "object",
                    "x-format": "\n\n**{value.TierTitle}**\n\n*{value.TierWhyItMatters}*\n\n{value.Terms}",
                    "additionalProperties": false,
                    "required": [
                      "TierTitle",
                      "TierWhyItMatters",
                      "Terms"
                    ],
                    "properties": {
                      "TierTitle": {
                        "type": "string",
                        "description": "HARUS persis salah satu dari ini: 'Tier 1: Essential / Core Vocabulary', 'Tier 2: Application, Modeling, or Process Vocabulary', 'Tier 3: Real-World or Project-Specific Vocabulary', 'Tier 4: Enrichment & Extension Vocabulary'."
                      },
                      "TierWhyItMatters": {
                        "type": "string",
                        "description": "Kalimat singkat yang dicetak miring yang menjelaskan bagaimana istilah-istilah ini membantu siswa dalam konteks proyek (misalnya, 'These terms help students name the most important ideas and objects they will see, build, and discuss during the project.')."
                      },
                      "Terms": {
                        "type": "array",
                        "minItems": 3,
                        "x-format": "\n\n{items}",
                        "description": "Daftar istilah kosakata yang sesuai dengan unit beserta definisi yang ramah bagi siswa.",
                        "items": {
                          "type": "object",
                          "x-format": "{index}. **{value.Term}**: {value.Definition}\n",
                          "additionalProperties": false,
                          "required": [
                            "Term",
                            "Definition"
                          ],
                          "properties": {
                            "Term": {
                              "type": "string",
                              "description": "Kata kosakata (misalnya, 'force'). Jangan sertakan penomoran atau bullet points."
                            },
                            "Definition": {
                              "type": "string",
                              "description": "Definisi yang ramah bagi siswa."
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "AssessmentPlan": {
          "type": "object",
          "x-format": "### {green}({loc.AlignedAssessmentEvidenceAndCriteriaForSuccess})\n\n**{loc.PurposeLabel}** {loc.AlignedAssessmentPurposeValue}\n\n### {violet}({loc.FormativeAssessmentRubric})\n\n| {loc.StudentLearningObjective} | {loc.SuccessCriteria} | {loc.PointOfDemonstration} |\n|---|---|---|\n{value.FormativeAssessmentTable}\n\n### {violet}({loc.AnalyticRubric})\n\n| {loc.Criterion} | {loc.Novice} | {loc.Apprentice} | {loc.Practitioner} | {loc.Expert} |\n|---|---|---|---|---|\n{value.AnalyticRubric}\n\n### {green}({loc.AuthenticAudience})\n\n**{loc.PurposeLabel}** {loc.AuthenticAudiencePurposeValue}\n\n{value.AuthenticAudience}",
          "additionalProperties": false,
          "required": [
            "FormativeAssessmentTable",
            "AnalyticRubric",
            "AuthenticAudience"
          ],
          "properties": {
            "AuthenticAudience": {
              "type": "object",
              "x-format": "{value.Audiences}\n\n**{loc.StudentParticipationInAudienceSelection}**\n\n{value.StudentParticipation}",
              "description": "Identifikasi dan libatkan audiens autentik di luar kelas.",
              "additionalProperties": false,
              "required": [
                "Audiences",
                "StudentParticipation"
              ],
              "properties": {
                "Audiences": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 3,
                  "items": {
                    "type": "object",
                    "x-format": "**{value.AudienceName}**\n\n{value.PrimaryAudienceDescription} {value.WhyThisAudienceIsQualified} {value.HowThisAudienceElevatesTheProject}\n\n",
                    "additionalProperties": false,
                    "required": [
                      "AudienceName",
                      "PrimaryAudienceDescription",
                      "WhyThisAudienceIsQualified",
                      "HowThisAudienceElevatesTheProject"
                    ],
                    "properties": {
                      "AudienceName": {
                        "type": "string",
                        "description": "Nama kelompok audiens autentik yang spesifik (misalnya, 'City of Coconut Creek Sustainability & Environmental Advisory Board'). Jangan sertakan bullet points atau penomoran."
                      },
                      "PrimaryAudienceDescription": {
                        "type": "string",
                        "description": "Deskripsi yang jelas tentang siapa audiens ini (individu, organisasi, atau kelompok) dan hubungannya dengan konteks atau masalah proyek. Harus rinci, minimal 2-3 kalimat."
                      },
                      "WhyThisAudienceIsQualified": {
                        "type": "string",
                        "description": "Penjelasan mengapa audiens ini memiliki keahlian, pengalaman hidup, atau otoritas yang relevan dengan topik proyek. Harus rinci, minimal 2-3 kalimat."
                      },
                      "HowThisAudienceElevatesTheProject": {
                        "type": "string",
                        "description": "Bagaimana keberadaan audiens ini meningkatkan keaslian, ketelitian, motivasi, atau dampak di dunia nyata bagi siswa. Harus rinci, minimal 2-3 kalimat."
                      }
                    }
                  }
                },
                "StudentParticipation": {
                  "type": "string",
                  "description": "Sebuah paragraf yang menjelaskan bagaimana siswa membantu mengidentifikasi audiens mana yang paling sesuai untuk inovasi mereka dengan membahas siapa yang akan mendapat manfaat dari atau mengevaluasi solusi tersebut."
                }
              }
            },
            "FormativeAssessmentTable": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "items": {
                "type": "object",
                "x-format": "| {value.CriteriaForSuccess} | {value.SuccessCriteria} | {value.PointOfDemonstration} |",
                "additionalProperties": false,
                "required": [
                  "CriteriaForSuccess",
                  "SuccessCriteria",
                  "PointOfDemonstration"
                ],
                "properties": {
                  "CriteriaForSuccess": {
                    "type": "string",
                    "description": "Tujuan pembelajaran siswa yang terukur, diakhiri dengan tingkat DOK. Jangan menyertakan poin-poin atau penomoran."
                  },
                  "SuccessCriteria": {
                    "type": "string",
                    "description": "Kriteria keberhasilan spesifik yang menjelaskan apa yang akan dilakukan siswa untuk menunjukkan pembelajaran. Jangan menyertakan poin-poin atau penomoran."
                  },
                  "PointOfDemonstration": {
                    "type": "string",
                    "description": "Tempat bukti akan muncul, dipisahkan menjadi pernyataan Formative: dan Summative:. Jangan menyertakan poin-poin atau penomoran."
                  }
                }
              }
            },
            "AnalyticRubric": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 4,
              "description": "Rubrik Analitik yang merinci kompetensi yang diperlukan oleh proyek. Setiap baris mewakili satu keterampilan yang dinilai. Perkembangan dari Novice hingga Expert harus mencerminkan peningkatan kecanggihan.",
              "items": {
                "type": "object",
                "x-format": "| {value.Criterion} | {value.Novice} | {value.Apprentice} | {value.Practitioner} | {value.Expert} |",
                "additionalProperties": false,
                "required": [
                  "Criterion",
                  "Novice",
                  "Apprentice",
                  "Practitioner",
                  "Expert"
                ],
                "properties": {
                  "Criterion": {
                    "type": "string",
                    "description": "Keterampilan, kompetensi, atau dimensi tertentu dari proyek akhir yang dinilai. Jangan menyertakan poin-poin atau penomoran."
                  },
                  "Novice": {
                    "type": "string",
                    "description": "Deskripsi kinerja tingkat novice. Tidak boleh menggunakan bahasa berbasis defisit seperti gagal, kurang, atau hilang. Jangan menyertakan poin-poin atau penomoran."
                  },
                  "Apprentice": {
                    "type": "string",
                    "description": "Deskripsi kinerja tingkat apprentice. Jangan menyertakan poin-poin atau penomoran."
                  },
                  "Practitioner": {
                    "type": "string",
                    "description": "Deskripsi kinerja tingkat practitioner. Jangan menyertakan poin-poin atau penomoran."
                  },
                  "Expert": {
                    "type": "string",
                    "description": "Deskripsi kinerja tingkat expert. Harus dibangun di atas tingkat Practitioner dengan wawasan, ketelitian, atau kompleksitas yang lebih mendalam. Jangan menyertakan poin-poin atau penomoran."
                  }
                }
              }
            }
          }
        },
        "LearningPlan": {
          "type": "object",
          "x-format": "### {green}({loc.LearningPlanOverview})\n\n{value.LearningPlanOverview}{value.ProjectPhases}\n\n### {green}({loc.ProjectGoals})\n\n{value.ProjectGoals}\n\n### {loc.FinalDeliverableSummary}\n\n{value.FinalDeliverableSummary}\n\n### {green}({loc.GroupSuggestions})\n\n{value.GroupSuggestions.GroupSize}\n\n**{loc.RotatingRolesAndDuties}**\n\n{value.GroupSuggestions.RotatingRolesAndDuties}\n\n**{loc.GuidingQuestionForTeacherPlanning}**\n\n{value.GroupSuggestions.TeacherGroupingStrategyPrompt}\n\n**{loc.GroupingStrategyRecommendations}**\n\n{loc.TeachersMayConsider}\n\n{value.GroupSuggestions.GroupingStrategyRecommendations}",
          "additionalProperties": false,
          "required": [
            "LearningPlanOverview",
            "ProjectPhases",
            "ProjectGoals",
            "FinalDeliverableSummary",
            "GroupSuggestions"
          ],
          "properties": {
            "LearningPlanOverview": {
              "type": "string",
              "description": "Ringkasan 2-4 kalimat yang menjelaskan bagaimana proyek diorganisasikan ke dalam tiga fase fleksibel (Fase 1, Fase 2, Fase 3) daripada jumlah hari yang tetap. Jelaskan secara singkat apa yang siswa lakukan di setiap fase (misalnya, di Fase 1 mereka membangun pengetahuan latar; di Fase 2 mereka menerapkan ide sains melalui investigasi; di Fase 3 mereka menyempurnakan prototipe dan mempresentasikannya kepada audiens autentik). Jangan menggunakan poin-poin atau penomoran."
            },
            "ProjectPhases": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "maxItems": 3,
              "description": "Ketiga fase proyek. Total durasi di seluruh 3 fase HARUS tepat sama dengan total jumlah hari yang diminta untuk proyek.",
              "items": {
                "type": "object",
                "x-format": "\n\n### {violet}({value.PhaseTitle})\n\n{value.PhaseDescription}\n\n**{loc.ConceptsOrSkillsEmphasized}:** {value.ConceptsOrSkills}\n\n**{loc.CollaborationAndVisibleThinking}:** {value.CollaborationAndVisibleThinking}\n\n{value.KeyLearningExperiences}",
                "additionalProperties": false,
                "required": [
                  "PhaseTitle",
                  "PhaseDescription",
                  "ConceptsOrSkills",
                  "CollaborationAndVisibleThinking",
                  "KeyLearningExperiences"
                ],
                "properties": {
                  "PhaseTitle": {
                    "type": "string",
                    "description": "Judul dan durasi fase (misalnya, 'Fase 1: 1-2 hari' atau 'Fase 3: 2 hari'). PENTING: Durasi harus dinyatakan secara eksplisit dalam judul, dan jumlah maksimum hari di semua fase harus tepat sesuai dengan total panjang proyek yang diminta. Jangan menyertakan poin-poin atau penomoran."
                  },
                  "PhaseDescription": {
                    "type": "string",
                    "description": "Paragraf singkat 1-2 kalimat yang menjelaskan apa yang siswa lakukan selama fase ini untuk memperdalam pemahaman atau mensintesis pembelajaran."
                  },
                  "ConceptsOrSkills": {
                    "type": "string",
                    "description": "Daftar koma-terpisah dari konsep inti atau keterampilan yang ditekankan dalam fase ini (misalnya, 'Observasi, pertanyaan, pemodelan, sistem tuas, stabilitas struktur'). Jangan menyertakan poin-poin atau penomoran."
                  },
                  "CollaborationAndVisibleThinking": {
                    "type": "string",
                    "description": "Sebuah kalimat yang menjelaskan bagaimana siswa berkolaborasi dan membuat pemikiran mereka terlihat dalam fase ini (misalnya, 'Siswa menggunakan think-pair-share, catatan sketsa, dan perbandingan kelompok cepat untuk membuat pemikiran mereka terlihat.'). Jangan menyertakan poin-poin atau penomoran."
                  },
                  "KeyLearningExperiences": {
                    "type": "array",
                    "x-format": "{items}",
                    "minItems": 3,
                    "description": "Daftar aktivitas atau tugas pembelajaran spesifik dalam fase ini.",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}",
                      "description": "Sebuah aktivitas pembelajaran spesifik (misalnya, 'Pembuatan dan pengujian shaduf'). Jangan menyertakan penomoran atau poin-poin di awal string Anda."
                    }
                  }
                }
              }
            },
            "ProjectGoals": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "description": "Output harus memuat tepat tiga tujuan proyek, masing-masing dinyatakan sebagai kategori konseptual diikuti oleh poin-poin atau paragraf singkat yang rinci. Tujuan 1, Terapkan Konten Disipliner pada Masalah Dunia Nyata, mengharuskan siswa menggunakan pengetahuan khusus disiplin untuk menganalisis atau memecahkan tantangan autentik, mencantumkan 4-6 konsep atau prinsip inti yang akan mereka terapkan, dan menunjukkan bagaimana ide-ide ini terhubung dengan kondisi atau kendala dunia nyata. Tujuan 2, Memecahkan Masalah Desain atau Penyelidikan yang Nyata dan Sesuai Perkembangan, mengharuskan deskripsi tentang tantangan autentik yang harus dihadapi siswa, mencantumkan apa yang akan mereka ciptakan, modelkan, bandingkan, analisis, evaluasi, atau justifikasi, dan menyertakan proses seperti pemodelan, memprediksi, membandingkan, mengevaluasi, dan pengambilan keputusan. Tujuan 3, Mengomunikasikan Temuan kepada Audiens Nyata, mengharuskan siswa menyiapkan produk akhir yang dipoles dan berkualitas profesional, menyesuaikan komunikasi dengan kebutuhan kelompok pemangku kepentingan nyata, dan merujuk pada audiens autentik seperti ahli lokal, organisasi komunitas, profesional industri, pimpinan sekolah, keluarga, atau anggota masyarakat.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n",
                "description": "Tujuan proyek spesifik yang diformat dengan label tebal (mis., '**Tujuan 1: Terapkan Konten Disiplin ke Masalah Dunia Nyata** Gunakan pengetahuan...')"
              }
            },
            "FinalDeliverableSummary": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 4,
              "items": {
                "type": "string",
                "x-format": "- {value}\n"
              }
            },
            "GroupSuggestions": {
              "type": "object",
              "description": "Menguraikan ukuran kelompok, peran, dan tugas guru.",
              "additionalProperties": false,
              "required": [
                "GroupSize",
                "RotatingRolesAndDuties",
                "TeacherGroupingStrategyPrompt",
                "GroupingStrategyRecommendations"
              ],
              "properties": {
                "GroupSize": {
                  "type": "string",
                  "description": "Keluaran harus menyatakan ukuran kelompok yang direkomendasikan seperti 3 sampai 4 siswa dan harus memberikan alasan yang menjelaskan bagaimana ukuran ini mendukung diskusi yang produktif, keterlibatan bersama, dan pembagian tugas yang dapat dikelola. Contoh: 'Ukuran Kelompok 3 sampai 4 siswa ideal karena...'"
                },
                "RotatingRolesAndDuties": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Keluaran harus menyediakan daftar peran yang diformat sebagai 'Nama Peran: deskripsi tugas'. Daftar tersebut harus mencakup setidaknya empat peran (Fasilitator, Pencatat, Pengelola Peralatan, Presenter/Komunikator) dan harapan Guru di akhir.",
                  "minItems": 4,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                },
                "TeacherGroupingStrategyPrompt": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Model harus mengeluarkan tepat dua string ini: 1) '\"Apa tujuan utama pengelompokan Anda dalam aktivitas ini—dukungan teman sebaya, diskusi yang kaya, tantangan, atau efisiensi? Setelah Anda menyebutkan tujuannya, pendekatan pengelompokan mana yang paling sesuai: kemampuan campuran, berbasis minat, berbasis keterampilan, atau acak?\"' 2) 'Pertanyaan ini mendorong guru untuk memilih metode pengelompokan yang sesuai dengan tujuan pembelajaran daripada sekadar mengandalkan kemudahan atau kebiasaan.'",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                },
                "GroupingStrategyRecommendations": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Model harus mengeluarkan rekomendasi strategi pengelompokan yang tepat dalam format dengan label tebal (mis., '**Kelompok Kemampuan Campuran:** Paling baik ketika...'). Strategi yang harus disertakan: Kelompok Kemampuan Campuran, Kelompok Berbasis Minat, Kelompok Berbasis Keterampilan, Kelompok Acak.",
                  "minItems": 4,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                }
              }
            }
          }
        },
        "TeacherGuidancePhase1": {
          "type": "object",
          "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase1}\n\n### {green}({loc.Phase1Title})\n\n**Focus Statement**\n{value.Phase1_FocusStatement}\n\n### {violet}({loc.CollaborativeActivities})\n\n{value.Phase1_CollaborativeActivities}\n\n### {violet}({loc.GuidingQuestions})\n\n{value.Phase1_GuidingQuestions}\n\n{value.Phase1_Differentiation}\n\n{value.Phase1_AccommodationsAndModifications}\n\n{value.Phase1_AnticipatedMisconceptions}\n\n{value.Phase1_TranscendentThinking}\n\n### {violet}(✔ {loc.QuickCheck})\n\n{value.Phase1_QuickChecks}\n\n### {violet}(⏳ {loc.SpacedRetrieval})\n\n{value.Phase1_SpacedRetrieval}\n\n### {green}(🖊 {loc.StudentPractice})\n\n**{loc.TeacherNotes}:**\n{value.Phase1_StudentPractice_TeacherNotes}\n\n**{loc.PracticeTasks}:**\n{value.Phase1_StudentPractice_Tasks}\n\n**🔎 {loc.Reflection}**\n{value.Phase1_ReflectionPrompt.Introduction}\n{value.Phase1_ReflectionPrompt.Prompts}",
          "additionalProperties": false,
          "description": "Fase pertama bimbingan guru",
          "required": [
            "Phase1_FocusStatement",
            "Phase1_CollaborativeActivities",
            "Phase1_GuidingQuestions",
            "Phase1_Differentiation",
            "Phase1_AccommodationsAndModifications",
            "Phase1_AnticipatedMisconceptions",
            "Phase1_TranscendentThinking",
            "Phase1_QuickChecks",
            "Phase1_SpacedRetrieval",
            "Phase1_StudentPractice_TeacherNotes",
            "Phase1_StudentPractice_Tasks",
            "Phase1_StudentPractice_InterleavingIfMath",
            "Phase1_ReflectionPrompt"
          ],
          "properties": {
            "Phase1_FocusStatement": {
              "type": "string",
              "description": "Berikan pernyataan singkat yang menjelaskan bagaimana fase ini membangun rasa ingin tahu, memperkenalkan masalah dunia nyata, dan mengaktifkan penalaran awal. Pernyataan Fokus harus mencakup pembangunan rasa ingin tahu tentang fenomena atau masalah inti, observasi dan eksplorasi awal, penemuan dan pertanyaan yang dipimpin siswa, serta hubungan yang jelas dengan Driving Question unit. Rumusan harus mencerminkan bahwa pada fase peluncuran ini siswa membangun rasa ingin tahu dan mulai mengungkap masalah ilmiah atau konseptual di pusat proyek, dan bahwa melalui observasi, eksplorasi, serta upaya pemodelan awal mereka mengumpulkan bukti langsung yang menghubungkan pemikiran awal mereka dengan Driving Question."
            },
            "Phase1_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "\n\n**{value.ActivityTitle}**\n- **{loc.StudentExperience}:** {value.StudentExperience}\n- **{loc.TeacherRole}:** {value.TeacherRoleMoves}\n- **{loc.ArtifactsOfLearning}:**\n{value.ArtifactsOfLearning}",
                "required": [
                  "ActivityTitle",
                  "StudentExperience",
                  "ArtifactsOfLearning",
                  "TeacherRoleMoves"
                ],
                "properties": {
                  "ActivityTitle": {
                    "type": "string"
                  },
                  "StudentExperience": {
                    "type": "string"
                  },
                  "ArtifactsOfLearning": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    }
                  },
                  "TeacherRoleMoves": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase1_GuidingQuestions": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              }
            },
            "Phase1_Differentiation": {
              "type": "object",
              "x-format": "### {violet}(🪜 {loc.Differentiation})\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse kerangka kalimat to support explanation and reasoning:\n\n{value.SentenceStarters}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Hasilkan 2-3 dukungan khusus pelajaran (visual, bank kata, gerakan) untuk membantu pelajar bahasa mengakses dan mengekspresikan ide. JANGAN memulai item dengan bullet, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Hasilkan 3-4 kalimat pembuka yang membantu siswa mendeskripsikan, menjelaskan, dan mengomunikasikan pemikiran mereka untuk pelajaran spesifik ini. JANGAN memulai item dengan bullet, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "SentenceStarters"
                  ],
                  "additionalProperties": false
                },
                "AdditionalScaffolding": {
                  "type": "object",
                  "x-format": "**{loc.StudentsInNeedOfAdditionalScaffolding}:**\n\n{value.Strategies}\n\nOffer a step-by-step checklist to guide the investigation:\n\n{value.Checklist}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Hasilkan 2-3 dukungan langkah demi langkah (alat terstruktur, contoh yang dimodelkan, think-aloud) dan panduan yang tepat untuk membantu siswa menyelesaikan tugas. JANGAN memulai item dengan bullet, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Hasilkan 3-4 pertanyaan daftar periksa untuk membimbing siswa dalam memahami pembelajaran mereka selama investigasi. JANGAN memulai item dengan bullet, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "Checklist"
                  ],
                  "additionalProperties": false
                },
                "GoDeeper": {
                  "type": "object",
                  "x-format": "**{loc.GoDeeper}:**\n\n{value.Strategies}\n\n{loc.AdvancedThinkingQuestionTitle}:\n\n- {loc.Say}: \"{value.AdvancedQuestion}\"\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Hasilkan 2-3 pengayaan yang meningkatkan kompleksitas (tantangan spesifik, identifikasi pola) untuk membantu siswa memperdalam atau meningkatkan pemikiran mereka menggunakan bukti. JANGAN memulai item dengan bullet, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Hasilkan satu pertanyaan kompleks (jangan menyertakan awalan 'Katakan:') untuk mendorong pemahaman konseptual yang lebih mendalam."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Hasilkan 3-4 contoh spesifik respons siswa berkualitas tinggi terhadap pertanyaan lanjutan. JANGAN memulai item dengan bullet, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "AdvancedQuestion",
                    "ExpectedResponses"
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
            "Phase1_AccommodationsAndModifications": {
              "x-format": "### {violet}(🤝 {loc.AccommodationsAndModifications})\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
              "type": "object",
              "description": "Bagian ini harus mencakup dua jenis dukungan: Dukungan Umum dan Dukungan Individual. Fokus pada akses, bukan menurunkan rigor.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Strategi non-spesifik siswa yang meningkatkan akses bagi semua peserta didik (mis., visual, catatan yang sudah terisi sebagian, glosarium digital, instruksi yang dibagi menjadi bagian-bagian kecil). Berikan 2-4 poin bullet."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Akomodasi dan modifikasi spesifik untuk siswa yang disebutkan dengan rencana formal. Cantumkan SETIAP siswa secara individual; jangan mengelompokkan siswa bersama-sama. Dukungan untuk setiap siswa harus berupa daftar yang mudah dipindai.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Nama depan dan nama belakang siswa individual yang menerima dukungan ini."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Rencana formal yang disediakan untuk siswa ini dalam prompt. Uraikan rencana tersebut menjadi daftar yang jelas. Anda boleh memparafrasekannya untuk memperbaiki format, tetapi JANGAN menghilangkan atau menambahkan informasi apa pun."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Alat/batang/visual/pengorganisasi konkret untuk tugas ini."
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
            },
            "Phase1_AnticipatedMisconceptions": {
              "type": "array",
              "x-format": "### {violet}(⚠️ {loc.AnticipatedMisconceptions}){items}",
              "description": "Hasilkan 2-3 miskonsepsi siswa umum yang kemungkinan muncul selama fase ini. Setiap item harus berfokus pada kesalahpahaman tertentu dan sebuah skrip respons guru.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Jelaskan miskonsepsi dalam 1 kalimat, dimulai dengan 'Siswa mungkin berpikir...'. JANGAN gunakan pemformatan tebal atau tag tebal apa pun."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Skrip respons yang jelas untuk guru (dimulai dengan 'Respons Guru: ') yang mencontohkan cara merespons saat itu juga dengan sebuah prompt spesifik (jangan sertakan awalan 'Katakan:'). JANGAN gunakan pemformatan tebal atau tag tebal apa pun."
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            },
            "Phase1_TranscendentThinking": {
              "type": "object",
              "x-format": "### {violet}(🌍 {loc.TranscendentThinking})\n\n{value.Question}",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Hasilkan 1 pertanyaan berpikir transenden yang mengharuskan siswa menerapkan pembelajaran melampaui diri mereka sendiri ke konteks dunia nyata (komunitas, tantangan global). Fokus pada mengapa pembelajaran penting dalam skala besar (keselamatan, keberlanjutan, inovasi, dll.). Hindari fokus yang hanya pribadi/sekolah."
                }
              },
              "required": [
                "Question"
              ],
              "additionalProperties": false
            },
            "Phase1_QuickChecks": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{value.BeginningOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.BeginningOfPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.MidPhase}**\n{value.MidPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.MidPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.EndOfPhase}**\n{value.EndOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.EndOfPhase.SuccessCriteriaOrExpectedResponses}",
              "description": "Pertanyaan cek pemahaman akhir dengan 2-3 respons siswa yang diharapkan yang menunjukkan penguasaan",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase1_SpacedRetrieval": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{loc.DrawsFrom}: {value.BeginningOfPhase.DrawsFrom}\n{loc.Question}: {value.BeginningOfPhase.Question} ({loc.DOK} {value.BeginningOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.BeginningOfPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.MidPhase}**\n{loc.DrawsFrom}: {value.MidPhase.DrawsFrom}\n{loc.Question}: {value.MidPhase.Question} ({loc.DOK} {value.MidPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.MidPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.EndOfPhase}**\n{loc.DrawsFrom}: {value.EndOfPhase.DrawsFrom}\n{loc.Question}: {value.EndOfPhase.Question} ({loc.DOK} {value.EndOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.EndOfPhase.ExpectedResponseOrSuccessCriteria}",
              "description": "Model harus membuat komponen Spaced Retrieval yang mengharuskan siswa mengingat kembali konsep kunci dari unit atau pelajaran sebelumnya yang spesifik tanpa merujuk pada aktivitas, lembar kerja, model, label, atau langkah tugas sebelumnya apa pun. Skrip guru harus dimulai dengan Katakan: dan hanya boleh merujuk pada topik pembelajaran sebelumnya, bukan apa yang siswa pelajari tentang topik itu. Pertanyaan retrieval harus mendorong siswa untuk menyatakan ulang atau menerapkan pemahaman konseptual yang telah dipelajari sebelumnya (seperti cara kerja suatu sistem, bagaimana variabel saling berhubungan, atau bagaimana suatu proses berlangsung) sepenuhnya dari ingatan, tanpa guru memberikan petunjuk atau penjelasan parsial. Keluaran harus diakhiri dengan Respons Siswa yang Diharapkan yang menampilkan 2-3 contoh yang secara akurat mencerminkan ingatan konseptual, menunjukkan bahwa siswa-bukan prompt-yang menyediakan ide yang diingat.",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase1_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "Satu paragraf yang menjelaskan pengetahuan dan keterampilan yang dipraktikkan di semua tugas dalam fase ini. Paragraf HARUS dimulai dengan 'Tugas-tugas ini memperkuat pembelajaran hari ini tentang ____ melalui ______.' dengan bagian yang kosong diisi dengan konten proyek yang relevan, diikuti oleh penjelasan tentang bagaimana tugas-tugas ini memperkuat retensi jangka panjang."
            },
            "Phase1_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Tugas harus selaras dengan fokus fase dan kedalaman pengetahuan yang diharapkan. Gunakan hanya DOK 2, 3, atau 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "**{value.DOK}**\n{value.StudentDirections}\n\n**{loc.SuccessCriteria}:**\n{value.SuccessCriteria}",
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Tingkat Depth of Knowledge untuk tugas. HARUS SALAH SATU dari: 'DOK 2', 'DOK 3', atau 'DOK 4'. DOK 1 dilarang keras."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    }
                  }
                }
              }
            },
            "Phase1_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "Jika dan HANYA JIKA subjek adalah matematika: sertakan soal interleaving (pembelajaran berselang) (pembelajaran berselang) + prompt guru + respons yang diharapkan + catatan guru. Jika bukan, string kosong."
            },
            "Phase1_ReflectionPrompt": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "Introduction",
                "Prompts"
              ],
              "properties": {
                "Introduction": {
                  "type": "string",
                  "description": "Pengantar singkat yang ramah bagi siswa untuk refleksi, misalnya, 'Tulis 2-3 kalimat sebagai respons terhadap satu prompt:'"
                },
                "Prompts": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "TeacherGuidancePhase2": {
          "type": "object",
          "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase2}\n\n### {green}({loc.Phase2Title})\n\n**Focus Statement**\n{value.Phase2_FocusStatement}\n\n### {violet}({loc.CollaborativeActivities})\n\n{value.Phase2_CollaborativeActivities}\n\n### {violet}({loc.GuidingQuestions})\n\n{value.Phase2_GuidingQuestions}\n\n{value.Phase2_Differentiation}\n\n{value.Phase2_AccommodationsAndModifications}\n\n{value.Phase2_AnticipatedMisconceptions}\n\n{value.Phase2_TranscendentThinking}\n\n### {violet}(✔ {loc.QuickCheck})\n\n{value.Phase2_QuickChecks}\n\n### {violet}(⏳ {loc.SpacedRetrieval})\n\n{value.Phase2_SpacedRetrieval}\n\n### {green}(🖊 {loc.StudentPractice})\n\n**{loc.TeacherNotes}:**\n{value.Phase2_StudentPractice_TeacherNotes}\n\n**{loc.PracticeTasks}:**\n{value.Phase2_StudentPractice_Tasks}\n\n**🔎 {loc.Reflection}**\n{value.Phase2_ReflectionPrompt.Introduction}\n{value.Phase2_ReflectionPrompt.Prompts}",
          "additionalProperties": false,
          "description": "Bimbingan guru fase kedua",
          "required": [
            "Phase2_FocusStatement",
            "Phase2_CollaborativeActivities",
            "Phase2_GuidingQuestions",
            "Phase2_Differentiation",
            "Phase2_AccommodationsAndModifications",
            "Phase2_AnticipatedMisconceptions",
            "Phase2_TranscendentThinking",
            "Phase2_QuickChecks",
            "Phase2_SpacedRetrieval",
            "Phase2_StudentPractice_TeacherNotes",
            "Phase2_StudentPractice_Tasks",
            "Phase2_StudentPractice_InterleavingIfMath",
            "Phase2_ReflectionPrompt"
          ],
          "properties": {
            "Phase2_FocusStatement": {
              "type": "string",
              "description": "Tulis Focus Statement sepanjang 1-3 kalimat yang merangkum tujuan fase, menjelaskan bagaimana siswa membangun pemahaman melalui kerja berbasis inkuiri, secara eksplisit menghubungkan fase ini dengan Driving Question unit atau masalah dunia nyata, dan menjelaskan bagaimana fase ini membawa siswa lebih dekat untuk menghasilkan produk akhir mereka. Pernyataan harus selalu ditulis sebagai satu paragraf pendek dan harus disesuaikan dengan detail proyek spesifik yang diberikan oleh pengguna."
            },
            "Phase2_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "\n\n**{value.ActivityTitle}**\n- **{loc.StudentExperience}:** {value.StudentExperience}\n- **{loc.TeacherRole}:** {value.TeacherRoleMoves}\n- **{loc.ArtifactsOfLearning}:**\n{value.ArtifactsOfLearning}",
                "required": [
                  "ActivityTitle",
                  "StudentExperience",
                  "ArtifactsOfLearning",
                  "TeacherRoleMoves"
                ],
                "properties": {
                  "ActivityTitle": {
                    "type": "string"
                  },
                  "StudentExperience": {
                    "type": "string"
                  },
                  "ArtifactsOfLearning": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    }
                  },
                  "TeacherRoleMoves": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase2_GuidingQuestions": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              }
            },
            "Phase2_Differentiation": {
              "type": "object",
              "x-format": "### {violet}(🪜 {loc.Differentiation})\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse kerangka kalimat to support explanation and reasoning:\n\n{value.SentenceStarters}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Hasilkan 2-3 dukungan khusus pelajaran (visual, bank kata, gestur) untuk membantu pelajar bahasa mengakses dan mengungkapkan ide. JANGAN mulai item dengan poin bullet, tanda hubung, atau angka. Tulis teks biasa saja.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Hasilkan 3-4 kalimat pembuka yang membantu siswa mendeskripsikan, menjelaskan, dan mengomunikasikan pemikiran mereka untuk pelajaran tertentu ini. JANGAN mulai item dengan poin bullet, tanda hubung, atau angka. Tulis teks biasa saja.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "SentenceStarters"
                  ],
                  "additionalProperties": false
                },
                "AdditionalScaffolding": {
                  "type": "object",
                  "x-format": "**{loc.StudentsInNeedOfAdditionalScaffolding}:**\n\n{value.Strategies}\n\nOffer a step-by-step checklist to guide the investigation:\n\n{value.Checklist}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Hasilkan 2-3 dukungan langkah demi langkah (alat terstruktur, contoh yang dimodelkan, think-aloud) dan panduan yang tepat untuk membantu siswa menyelesaikan tugas. JANGAN mulai item dengan poin bullet, tanda hubung, atau angka. Tulis teks biasa saja.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Hasilkan 3-4 pertanyaan daftar periksa untuk memandu siswa dalam memahami makna pembelajaran mereka selama penyelidikan. JANGAN mulai item dengan poin bullet, tanda hubung, atau angka. Tulis teks biasa saja.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "Checklist"
                  ],
                  "additionalProperties": false
                },
                "GoDeeper": {
                  "type": "object",
                  "x-format": "**{loc.GoDeeper}:**\n\n{value.Strategies}\n\n{loc.AdvancedThinkingQuestionTitle}:\n\n- {loc.Say}: \"{value.AdvancedQuestion}\"\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Hasilkan 2-3 pengayaan yang meningkatkan kompleksitas (tantangan spesifik, identifikasi pola) untuk membantu siswa memperdalam atau meningkatkan pemikiran mereka menggunakan bukti. JANGAN mulai item dengan poin bullet, tanda hubung, atau angka. Tulis teks biasa saja.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Hasilkan satu pertanyaan kompleks (jangan sertakan awalan 'Katakan:')/pertanyaan untuk mendorong pemahaman konseptual yang lebih mendalam."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Hasilkan 3-4 contoh spesifik respons siswa berkualitas tinggi terhadap pertanyaan lanjutan. JANGAN mulai item dengan poin bullet, tanda hubung, atau angka. Tulis teks biasa saja.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "AdvancedQuestion",
                    "ExpectedResponses"
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
            "Phase2_AccommodationsAndModifications": {
              "x-format": "### {violet}(🤝 {loc.AccommodationsAndModifications})\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
              "type": "object",
              "description": "Bagian ini harus mencakup dua jenis dukungan: Dukungan Umum dan Dukungan Individual. Fokus pada akses, bukan menurunkan tingkat tantangan.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Strategi non-spesifik siswa yang meningkatkan akses untuk semua pelajar (mis., visual, catatan yang sudah diisi sebagian, glosarium digital, instruksi yang dipecah menjadi bagian-bagian kecil). Berikan 2-4 poin bullet."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Akomodasi dan modifikasi spesifik untuk siswa yang disebutkan namanya dengan rencana formal. Cantumkan SETIAP siswa secara individual; jangan mengelompokkan siswa bersama-sama. Dukungan untuk setiap siswa harus berupa daftar yang mudah dipindai.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Nama depan dan nama belakang siswa individu yang menerima dukungan ini."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Rencana formal yang diberikan untuk siswa ini dalam prompt. Uraikan rencana menjadi daftar yang jelas. Anda boleh memparafrasekannya untuk memperbaiki format, tetapi jangan hilangkan atau tambahkan informasi apa pun."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Alat/pelintasan visual/pengatur yang konkret untuk tugas ini."
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
            },
            "Phase2_AnticipatedMisconceptions": {
              "type": "array",
              "x-format": "### {violet}(⚠️ {loc.AnticipatedMisconceptions}){items}",
              "description": "Hasilkan 2-3 miskonsepsi umum siswa yang kemungkinan muncul selama fase ini. Setiap item harus berfokus pada kesalahpahaman tertentu dan skrip respons guru.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Jelaskan miskonsepsi dalam 1 kalimat, diawali dengan 'Siswa mungkin berpikir...'. JANGAN gunakan penebalan teks atau tag tebal apa pun."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Skrip respons guru yang jelas untuk guru (diawali dengan 'Respons Guru: ') yang mencontohkan cara merespons saat itu juga dengan prompt yang spesifik (jangan sertakan awalan 'Katakan:'). JANGAN gunakan penebalan teks atau tag tebal apa pun."
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            },
            "Phase2_TranscendentThinking": {
              "type": "object",
              "x-format": "### {violet}(🌍 {loc.TranscendentThinking})\n\n{value.Question}",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Hasilkan 1 pertanyaan pemikiran transcendent yang mengharuskan siswa menerapkan pembelajaran di luar diri mereka ke konteks dunia nyata (komunitas, tantangan global). Fokus pada mengapa pembelajaran penting dalam skala besar (keamanan, keberlanjutan, inovasi, dll.). Hindari fokus pribadi/sekolah saja."
                }
              },
              "required": [
                "Question"
              ],
              "additionalProperties": false
            },
            "Phase2_QuickChecks": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{value.BeginningOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.BeginningOfPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.MidPhase}**\n{value.MidPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.MidPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.EndOfPhase}**\n{value.EndOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.EndOfPhase.SuccessCriteriaOrExpectedResponses}",
              "description": "Pertanyaan cek pemahaman akhir dengan 2-3 respons siswa yang diharapkan yang menunjukkan penguasaan",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "JANGAN mulai item dengan poin bullet, tanda hubung, atau angka. Tulis teks biasa saja.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "JANGAN mulai item dengan poin bullet, tanda hubung, atau angka. Tulis teks biasa saja.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase2_SpacedRetrieval": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{loc.DrawsFrom}: {value.BeginningOfPhase.DrawsFrom}\n{loc.Question}: {value.BeginningOfPhase.Question} ({loc.DOK} {value.BeginningOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.BeginningOfPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.MidPhase}**\n{loc.DrawsFrom}: {value.MidPhase.DrawsFrom}\n{loc.Question}: {value.MidPhase.Question} ({loc.DOK} {value.MidPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.MidPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.EndOfPhase}**\n{loc.DrawsFrom}: {value.EndOfPhase.DrawsFrom}\n{loc.Question}: {value.EndOfPhase.Question} ({loc.DOK} {value.EndOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.EndOfPhase.ExpectedResponseOrSuccessCriteria}",
              "description": "Model harus membuat komponen Spaced Retrieval yang mengharuskan siswa mengingat kembali konsep kunci dari unit atau pelajaran sebelumnya yang spesifik tanpa merujuk pada aktivitas masa lalu, lembar kerja, model, label, atau langkah-langkah tugas yang spesifik. Naskah guru harus diawali dengan Katakan: dan hanya boleh merujuk pada topik pembelajaran sebelumnya, bukan pada apa yang dipelajari siswa tentang topik itu. Pertanyaan retrieval harus meminta siswa untuk menyatakan ulang atau menerapkan pemahaman konseptual yang telah dipelajari sebelumnya (seperti bagaimana suatu sistem bekerja, bagaimana variabel saling berhubungan, atau bagaimana suatu proses berlangsung) sepenuhnya dari ingatan, tanpa guru memberi petunjuk atau penjelasan sebagian. Keluaran harus diakhiri dengan Respons Siswa yang Diharapkan yang menampilkan 2-3 contoh yang secara akurat mencerminkan ingatan konseptual, menunjukkan bahwa siswa-bukan prompt-yang menyediakan ide-ide yang diingat.",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase2_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "Satu paragraf yang menjelaskan pengetahuan dan keterampilan yang dipraktikkan di semua tugas dalam fase ini. Paragraf HARUS dimulai dengan 'Tugas-tugas ini memperkuat pembelajaran hari ini tentang ____ melalui ______.' di mana bagian kosong diisi dengan konten proyek yang relevan, diikuti oleh penjelasan tentang bagaimana tugas-tugas ini memperkuat retensi jangka panjang."
            },
            "Phase2_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Tugas harus selaras dengan fokus fase dan kedalaman pengetahuan yang diharapkan. Gunakan hanya DOK 2, 3, atau 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "**{value.DOK}**\n{value.StudentDirections}\n\n**{loc.SuccessCriteria}:**\n{value.SuccessCriteria}",
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Tingkat Depth of Knowledge untuk tugas. HARUS SALAH SATU dari: 'DOK 2', 'DOK 3', atau 'DOK 4'. DOK 1 dilarang keras."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    }
                  }
                }
              }
            },
            "Phase2_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "Jika dan HANYA JIKA subjeknya matematika: sertakan soal interleaving (pembelajaran berselang) (pembelajaran berselang) + prompt guru + respons yang diharapkan + catatan guru. Selain itu, string kosong."
            },
            "Phase2_ReflectionPrompt": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "Introduction",
                "Prompts"
              ],
              "properties": {
                "Introduction": {
                  "type": "string",
                  "description": "Pengantar singkat yang ditujukan kepada siswa untuk refleksi, misalnya, 'Tulis 2-3 kalimat yang menanggapi satu prompt:'"
                },
                "Prompts": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "TeacherGuidancePhase3": {
          "type": "object",
          "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase3}\n\n### {green}({loc.Phase3Title})\n\n**Focus Statement**\n{value.Phase3_FocusStatement}\n\n### {violet}({loc.CollaborativeActivities})\n\n{value.Phase3_CollaborativeActivities}\n\n### {violet}({loc.GuidingQuestions})\n\n{value.Phase3_GuidingQuestions}\n\n{value.Phase3_Differentiation}\n\n{value.Phase3_AccommodationsAndModifications}\n\n{value.Phase3_AnticipatedMisconceptions}\n\n{value.Phase3_TranscendentThinking}\n\n### {violet}(✔ {loc.QuickCheck})\n\n{value.Phase3_QuickChecks}\n\n### {violet}(⏳ {loc.SpacedRetrieval})\n\n{value.Phase3_SpacedRetrieval}\n\n### {green}(🖊 {loc.StudentPractice})\n\n**{loc.TeacherNotes}:**\n{value.Phase3_StudentPractice_TeacherNotes}\n\n**{loc.PracticeTasks}:**\n{value.Phase3_StudentPractice_Tasks}\n\n**🔎 {loc.Reflection}**\n{value.Phase3_ReflectionPrompt.Introduction}\n{value.Phase3_ReflectionPrompt.Prompts}",
          "additionalProperties": false,
          "description": "Fase ketiga bimbingan guru",
          "required": [
            "Phase3_FocusStatement",
            "Phase3_CollaborativeActivities",
            "Phase3_GuidingQuestions",
            "Phase3_Differentiation",
            "Phase3_AccommodationsAndModifications",
            "Phase3_AnticipatedMisconceptions",
            "Phase3_TranscendentThinking",
            "Phase3_QuickChecks",
            "Phase3_SpacedRetrieval",
            "Phase3_StudentPractice_TeacherNotes",
            "Phase3_StudentPractice_Tasks",
            "Phase3_StudentPractice_InterleavingIfMath",
            "Phase3_ReflectionPrompt"
          ],
          "properties": {
            "Phase3_FocusStatement": {
              "type": "string",
              "description": "Hasilkan Focus Statement 2-4 kalimat yang dengan jelas mengomunikasikan tujuan Phase 3 dan perannya dalam mengarahkan siswa menuju produk akhir. Pernyataan harus menjelaskan bahwa Phase 3 berfokus pada menyempurnakan ide, menerapkan pembelajaran, memperkuat bukti, menyiapkan produk puncak, dan terlibat dalam penalaran serta revisi yang lebih mendalam. Pernyataan ini harus secara eksplisit menunjukkan bagaimana Phase 3 memajukan tantangan autentik dunia nyata dari proyek, bagaimana siswa menggunakan bukti untuk meningkatkan solusi, dan bagaimana pekerjaan ini mempersiapkan mereka untuk audiens autentik. Pernyataan harus mencakup kerja intelektual seperti menyempurnakan, merevisi, mensintesis, mengevaluasi, membenarkan, menyelesaikan, dan mengomunikasikan, serta harus menunjukkan bagaimana siswa menyelesaikan model, produk, penjelasan, atau proposal, menyiapkan presentasi atau pameran publik, dan merefleksikan pembelajaran untuk memperkuat penalaran mereka."
            },
            "Phase3_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "\n\n**{value.ActivityTitle}**\n- **{loc.StudentExperience}:** {value.StudentExperience}\n- **{loc.TeacherRole}:** {value.TeacherRoleMoves}\n- **{loc.ArtifactsOfLearning}:**\n{value.ArtifactsOfLearning}",
                "required": [
                  "ActivityTitle",
                  "StudentExperience",
                  "ArtifactsOfLearning",
                  "TeacherRoleMoves"
                ],
                "properties": {
                  "ActivityTitle": {
                    "type": "string"
                  },
                  "StudentExperience": {
                    "type": "string"
                  },
                  "ArtifactsOfLearning": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    }
                  },
                  "TeacherRoleMoves": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase3_GuidingQuestions": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              }
            },
            "Phase3_Differentiation": {
              "type": "object",
              "x-format": "### {violet}(🪜 {loc.Differentiation})\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse kerangka kalimat to support explanation and reasoning:\n\n{value.SentenceStarters}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Hasilkan 2-3 dukungan khusus pelajaran (visual, bank kata, gerakan) untuk membantu pembelajar bahasa mengakses dan mengekspresikan ide. JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Hasilkan 3-4 kalimat pembuka yang membantu siswa mendeskripsikan, menjelaskan, dan mengomunikasikan pemikiran mereka untuk pelajaran spesifik ini. JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "SentenceStarters"
                  ],
                  "additionalProperties": false
                },
                "AdditionalScaffolding": {
                  "type": "object",
                  "x-format": "**{loc.StudentsInNeedOfAdditionalScaffolding}:**\n\n{value.Strategies}\n\nOffer a step-by-step checklist to guide the investigation:\n\n{value.Checklist}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Hasilkan 2-3 dukungan langkah demi langkah (alat terstruktur, contoh yang dimodelkan, think-aloud) dan panduan yang tepat untuk membantu siswa menyelesaikan tugas. JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Hasilkan 3-4 pertanyaan daftar periksa untuk membimbing siswa dalam memahami pembelajaran mereka selama investigasi. JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "Checklist"
                  ],
                  "additionalProperties": false
                },
                "GoDeeper": {
                  "type": "object",
                  "x-format": "**{loc.GoDeeper}:**\n\n{value.Strategies}\n\n{loc.AdvancedThinkingQuestionTitle}:\n\n- {loc.Say}: \"{value.AdvancedQuestion}\"\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Hasilkan 2-3 pengayaan yang meningkatkan kompleksitas (tantangan spesifik, identifikasi pola) untuk membantu siswa memperdalam atau meningkatkan pemikiran mereka menggunakan bukti. JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Hasilkan satu prompt/pertanyaan kompleks (jangan sertakan awalan 'Katakan:') untuk mendorong pemahaman konseptual yang lebih mendalam."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Hasilkan 3-4 contoh spesifik respons siswa berkualitas tinggi terhadap pertanyaan lanjutan tersebut. JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "AdvancedQuestion",
                    "ExpectedResponses"
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
            "Phase3_AccommodationsAndModifications": {
              "x-format": "### {violet}(🤝 {loc.AccommodationsAndModifications})\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
              "type": "object",
              "description": "Bagian ini harus mencakup dua jenis dukungan: General Supports dan Individualized Supports. Fokus pada akses, bukan menurunkan rigor.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Strategi yang tidak spesifik untuk siswa tertentu yang meningkatkan akses bagi semua pembelajar (mis., visual, catatan yang sudah diisi sebagian, glosarium digital, instruksi yang dipecah menjadi bagian-bagian). Sediakan 2-4 poin."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Akomodasi dan modifikasi spesifik untuk siswa yang disebutkan dengan rencana formal. Cantumkan SETIAP siswa secara individual; jangan mengelompokkan siswa bersama-sama. Dukungan untuk setiap siswa harus berupa daftar yang mudah dipindai.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Nama depan dan nama belakang siswa individu yang menerima dukungan ini."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Rencana formal yang diberikan untuk siswa ini dalam prompt. Uraikan rencana menjadi daftar yang jelas. Anda boleh memparafrasekannya untuk meningkatkan format, tetapi jangan menghilangkan atau menambahkan informasi apa pun."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Alat/kalimat awal/visual/pengorganisasi yang konkret untuk tugas ini."
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
            },
            "Phase3_AnticipatedMisconceptions": {
              "type": "array",
              "x-format": "### {violet}(⚠️ {loc.AnticipatedMisconceptions}){items}",
              "description": "Hasilkan 2-3 miskonsepsi umum siswa yang kemungkinan muncul selama fase ini. Setiap item harus berfokus pada kesalahpahaman tertentu dan skrip respons guru.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Jelaskan miskonsepsi dalam 1 kalimat, diawali dengan 'Siswa mungkin berpikir...'. JANGAN gunakan penebalan atau tag tebal apa pun."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Skrip respons guru yang jelas untuk guru (diawali dengan 'Tanggapan Guru: ') yang mencontohkan cara merespons pada saat itu juga dengan prompt yang spesifik (jangan sertakan awalan 'Katakan:'). JANGAN gunakan penebalan atau tag tebal apa pun."
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            },
            "Phase3_TranscendentThinking": {
              "type": "object",
              "x-format": "### {violet}(🌍 {loc.TranscendentThinking})\n\n{value.Question}",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Hasilkan 1 pertanyaan berpikir transenden yang mengharuskan siswa menerapkan pembelajaran melampaui diri mereka sendiri ke konteks dunia nyata (komunitas, tantangan global). Fokus pada mengapa pembelajaran penting dalam skala besar (keselamatan, keberlanjutan, inovasi, dll.). Hindari fokus pribadi/sekolah saja."
                }
              },
              "required": [
                "Question"
              ],
              "additionalProperties": false
            },
            "Phase3_QuickChecks": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{value.BeginningOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.BeginningOfPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.MidPhase}**\n{value.MidPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.MidPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.EndOfPhase}**\n{value.EndOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.EndOfPhase.SuccessCriteriaOrExpectedResponses}",
              "description": "Pertanyaan cek pemahaman akhir dengan 2-3 respons siswa yang diharapkan yang menunjukkan penguasaan",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase3_SpacedRetrieval": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{loc.DrawsFrom}: {value.BeginningOfPhase.DrawsFrom}\n{loc.Question}: {value.BeginningOfPhase.Question} ({loc.DOK} {value.BeginningOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.BeginningOfPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.MidPhase}**\n{loc.DrawsFrom}: {value.MidPhase.DrawsFrom}\n{loc.Question}: {value.MidPhase.Question} ({loc.DOK} {value.MidPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.MidPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.EndOfPhase}**\n{loc.DrawsFrom}: {value.EndOfPhase.DrawsFrom}\n{loc.Question}: {value.EndOfPhase.Question} ({loc.DOK} {value.EndOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.EndOfPhase.ExpectedResponseOrSuccessCriteria}",
              "description": "Model harus membuat komponen Spaced Retrieval yang mengharuskan siswa mengingat konsep kunci dari unit atau pelajaran sebelumnya yang spesifik tanpa merujuk pada aktivitas, lembar kerja, model, label, atau langkah-langkah tugas apa pun sebelumnya. Skrip guru harus diawali dengan Katakan: dan hanya boleh merujuk pada topik pembelajaran sebelumnya, bukan pada apa yang dipelajari siswa tentang topik itu. Pertanyaan retrieval harus mendorong siswa untuk menyatakan kembali atau menerapkan pemahaman konseptual yang telah dipelajari sebelumnya (seperti cara kerja suatu sistem, bagaimana variabel berhubungan, atau bagaimana suatu proses berlangsung) sepenuhnya dari ingatan, tanpa guru memberi petunjuk atau penjelasan sebagian. Output harus diakhiri dengan Respons Siswa yang Diharapkan yang menampilkan 2-3 contoh yang secara akurat mencerminkan ingatan konseptual, menunjukkan bahwa siswa—bukan prompt—yang menghasilkan ide-ide yang diingat itu.",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "JANGAN memulai item dengan poin-poin, tanda hubung, atau angka. Cukup tulis teks biasa.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase3_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "Satu paragraf yang menjelaskan pengetahuan dan keterampilan yang dilatih di semua tugas pada fase ini. Paragraf HARUS dimulai dengan 'Tugas-tugas ini memperkuat pembelajaran hari ini tentang ____ dengan ______.' di mana bagian kosong diisi dengan konten proyek yang relevan, diikuti oleh penjelasan tentang bagaimana tugas-tugas ini memperkuat retensi jangka panjang."
            },
            "Phase3_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Tugas harus selaras dengan fokus fase dan kedalaman pengetahuan yang diharapkan. Gunakan hanya DOK 2, 3, atau 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "**{value.DOK}**\n{value.StudentDirections}\n\n**{loc.SuccessCriteria}:**\n{value.SuccessCriteria}",
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Tingkat Depth of Knowledge untuk tugas. HARUS SALAH SATU dari: 'DOK 2', 'DOK 3', atau 'DOK 4'. DOK 1 sangat dilarang."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    }
                  }
                }
              }
            },
            "Phase3_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "Jika dan HANYA JIKA subjek adalah matematika: sertakan masalah interleaving (pembelajaran berselang) (pembelajaran berselang) + prompt guru + respons yang diharapkan + catatan guru. Jika tidak, string kosong."
            },
            "Phase3_ReflectionPrompt": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "Introduction",
                "Prompts"
              ],
              "properties": {
                "Introduction": {
                  "type": "string",
                  "description": "Pengantar singkat untuk refleksi yang ditujukan kepada siswa, misalnya, 'Tulis 2-3 kalimat sebagai respons terhadap satu prompt:'"
                },
                "Prompts": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "UnitPreparationAndConsiderations": {
          "type": "object",
          "x-format": "## ⚙️ {loc.UnitPreparationAndConsiderations}\n\n### {loc.ClassroomMaterialsAndEquipment}\n{value.ClassroomMaterialsAndEquipment}\n\n### {loc.LocalAndCommunityBasedResources}\n{value.LocalAndCommunityBasedResources}\n\n### {loc.DigitalToolsAndOnlineResources}\n{value.DigitalToolsAndOnlineResources}\n\n### {loc.TechnologyToDeepenInquiry}\n{value.TechnologyToDeepenInquiry}\n\n### {loc.TechnologyForModeling}\n{value.TechnologyForModeling}\n\n### {loc.TechnologyForCollaboration}\n{value.TechnologyForCollaboration}\n\n### {loc.TechnologyForCreatingFinalProduct}\n{value.TechnologyForCreatingFinalProduct}\n\n### {loc.EquityAndAccessibilityConsiderations}\n{value.EquityAndAccessibilityConsiderations}",
          "additionalProperties": false,
          "required": [
            "MaterialsEquipmentAndKeyResources",
            "TechnologyIntegration"
          ],
          "properties": {
            "MaterialsEquipmentAndKeyResources": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "ClassroomMaterialsAndEquipment",
                "LocalCommunityBasedResources",
                "DigitalToolsAndOnlineResources"
              ],
              "properties": {
                "ClassroomMaterialsAndEquipment": {
                  "type": "array",
                  "minItems": 6,
                  "items": {
                    "type": "string"
                  }
                },
                "LocalCommunityBasedResources": {
                  "type": "array",
                  "minItems": 3,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "Location",
                      "HowStudentsEngage",
                      "WhyRelevant"
                    ],
                    "properties": {
                      "Location": {
                        "type": "string"
                      },
                      "HowStudentsEngage": {
                        "type": "string"
                      },
                      "WhyRelevant": {
                        "type": "string"
                      }
                    }
                  }
                },
                "DigitalToolsAndOnlineResources": {
                  "type": "array",
                  "minItems": 4,
                  "items": {
                    "type": "string"
                  }
                }
              }
            },
            "TechnologyIntegration": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "TechnologyForResearchAndInformation",
                "TechnologyForModelingAndVisualRepresentation",
                "TechnologyForCollaborationAndDiscourse",
                "TechnologyForCreatingAndPresentingFinalProduct",
                "EquityAndAccessibilityConsiderations"
              ],
              "properties": {
                "TechnologyForResearchAndInformation": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "TechnologyForModelingAndVisualRepresentation": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "TechnologyForCollaborationAndDiscourse": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "TechnologyForCreatingAndPresentingFinalProduct": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "EquityAndAccessibilityConsiderations": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  },
  "x-removablePaths": {
    "AssessPriorKnowledge": [
      "UnitPlan.AssessPriorKnowledge"
    ],
    "FormativeAssessment": [
      "UnitPlan.AssessmentPlan.FormativeAssessmentTable"
    ],
    "StandardsAligned": [
      "UnitPlan.FramingTheLearning.KeyVocabulary.Tiers.Terms.StandardsConnection",
      "UnitPlan.DesiredOutcomes.StandardsAligned"
    ],
    "AccommodationsAndModifications": [
      "UnitPlan.TeacherGuidancePhase1.Phase1_Accommodations_IndividualSupport",
      "UnitPlan.TeacherGuidancePhase2.Phase2_Accommodations_IndividualSupport",
      "UnitPlan.TeacherGuidancePhase3.Phase3_Accommodations_IndividualSupport"
    ],
    "EssentialQuestions": [
      "UnitPlan.DesiredOutcomes.BigIdeasAndEssentialQuestions.EssentialQuestion"
    ],
    "SpacedLearningAndRetrieval": [
      "UnitPlan.TeacherGuidancePhase1.Phase1_SpacedRetrieval",
      "UnitPlan.TeacherGuidancePhase2.Phase2_SpacedRetrieval",
      "UnitPlan.TeacherGuidancePhase3.Phase3_SpacedRetrieval"
    ]
  }
},
};
