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
          "description": "Deskripsi unit sebagai satu paragraf teks biasa yang utuh (4–5 kalimat lengkap) ditulis dengan suara guru yang natural dan bisa Anda ucapkan langsung kepada siswa. Tanpa HTML, tanpa emoji, tanpa poin-poin. Harus mengalir secara percakapan tetapi mengikuti struktur ini (tanpa judul): (1) kalimat pembuka yang memicu rasa ingin tahu atau membuat kontras yang mengejutkan, (2) kalimat 'Dalam unit ini, Anda akan...' tentang hasil penguasaan, (3) kalimat 'Anda akan memperkuat keterampilan Anda dalam...' tentang kemampuan berpikir/analisis, (4) kalimat 'Ini terhubung dengan...' tentang relevansi di dunia nyata, (5) kalimat 'Memahami hal ini penting karena...' tentang signifikansi yang lebih luas atau dampak jangka panjang."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Buat pertanyaan esensial yang hanya berfokus pada konsep-konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. Jangan menyebutkan istilah, proses, kosakata, atau contoh yang spesifik pada mata pelajaran apa pun. Pertanyaan harus terbuka, dapat ditransfer ke semua disiplin ilmu, dan mustahil dijawab dengan mempelajari pelajaran atau konten unit. Fokus hanya pada ide-ide besar, bukan materi pelajaran.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Bagian lengkap 'Student Learning Objectives' untuk seluruh unit ini. Setiap butir daftar harus menjadi tujuan yang jelas dan terukur yang dimulai dengan kata kerja terukur dan diakhiri dengan label DOK dalam tanda kurung",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Daftar semua standar pendidikan unik yang digunakan di mana pun dalam unit ini dan pelajarannya. Jangan menambahkan standar yang tidak muncul dalam konten unit. Setiap standar harus mencakup kode standar dan deskripsi, misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem Bumi–matahari–bulan untuk mendeskripsikan pola siklis fase bulan, gerhana, dan musim.",
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
      "description": "Daftar kontainer pelajaran untuk unit ini (hanya kerangka). Setiap item harus tidak saling tumpang tindih dan dibatasi secara jelas agar konten pelajaran tidak berulang antar pelajaran.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Nomor urut dari sebuah pelajaran. Berbasis 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Judul singkat pelajaran sebagai teks biasa."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 kalimat yang menjelaskan cakupan pelajaran, fokus, dan batasannya untuk mencegah tumpang tindih dengan pelajaran lain."
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
      "description": "Tempel semua pertanyaan esensial yang dihasilkan pada tingkat unit dalam urutan yang sama.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Daftar istilah kosakata beserta definisinya. (misalnya 'Tata Surya – Matahari dan semua...'). HANYA sertakan istilah yang benar-benar digunakan dalam pelajaran spesifik ini.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Bagian lengkap 'Student Learning Objectives' sebagai teks biasa. Setiap butir harus menjadi tujuan yang jelas dan terukur yang dimulai dengan kata kerja terukur dan diakhiri dengan label DOK dalam tanda kurung.",
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
      "description": "Bagian lengkap 'Standards Aligned' sebagai teks biasa untuk pelajaran ini. Setiap standar harus mencakup kode standar dan deskripsi dan kode serta deskripsi harus persis sama dengan yang digunakan dalam Unit. misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem Bumi–matahari–bulan untuk mendeskripsikan pola siklis fase bulan, gerhana, dan musim.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.AssessPriorKnowledgeLectureTeacherNote}\n\n**Say:** \"{value.SayIntroduction}\"\n\n**{loc.ProjectOrRead}:**\n{value.StatementsToProject}\n\n**Say:** \"{value.SayInstructions}\"\n\n{value.ExpectedStudentResponses}\n\n**Say:** \"{value.SayConclusion}\"\n\n{value.ActionConclusion}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Bagian lengkap 'Assess Prior Knowledge'. KRITIS: Lihat 'lessonNumber' dalam Attached Lesson Content. JIKA ini adalah Lesson 1, isi objek ini sepenuhnya. JIKA ini adalah Lesson 2, 3, atau pelajaran lainnya, ANDA HARUS MENGEMBALIKAN OBJEK KOSONG {} tanpa properti apa pun. Jangan mengisi ini untuk pelajaran selain Lesson 1.",
      "properties": {
        "SayIntroduction": {
          "type": "string",
          "description": "Apa yang guru katakan untuk memperkenalkan aktivitas."
        },
        "StatementsToProject": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Daftar pernyataan untuk diproyeksikan atau dibacakan, yang berisi ide-ide akurat dan kesalahpahaman umum."
        },
        "SayInstructions": {
          "type": "string",
          "description": "Apa yang guru katakan untuk mengarahkan siswa tentang apa yang harus dilakukan dengan pernyataan-pernyataan tersebut."
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Respons/penandaan siswa yang diharapkan untuk setiap pernyataan."
        },
        "SayConclusion": {
          "type": "string",
          "description": "Apa yang guru katakan untuk menutup."
        },
        "ActionConclusion": {
          "type": "string",
          "description": "Tindakan guru untuk mengakhiri (misalnya, menggambar diagram)."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Daftar opsi alternatif untuk aktivitas tersebut."
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
      "description": "Buatlah bagian Objective yang dengan jelas menyatakan tujuan belajar siswa untuk pelajaran ini.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Perkiraan waktu (misalnya '(2-3 menit)')"
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
                "description": "Langkah atau naskah guru."
              },
              "Bullets": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "Daftar opsional poin-poin bullet untuk langkah ini. Untuk langkah pertama, sertakan tujuan belajar yang sebenarnya di sini."
              }
            },
            "required": [
              "Step",
              "Bullets"
            ],
            "additionalProperties": false
          },
          "description": "Harus mencakup: 1) Jelaskan tujuan belajar menggunakan naskah langsung untuk guru (misalnya, Katakan: '...') dan letakkan tujuan yang sebenarnya di array Bullets. 2) Minta siswa mencatat tujuan di buku catatan mereka. 3) Secara singkat beri tahu guru cara menghubungkan tujuan dengan pengalaman nyata siswa."
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
      "description": "Blok untuk penyampaian konten.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Perkiraan waktu (misalnya '(30 menit)')"
        },
        "Hook": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{value}\n\n",
            "type": "string"
          },
          "description": "Tulis hook dramatis dengan keterlibatan tinggi yang disampaikan melalui naskah guru. Harus mengejutkan, membangun rasa ingin tahu, dan terkait dengan konsep utama."
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
              "description": "Cantumkan istilah kosakata penting. Sediakan naskah guru untuk mendefinisikan setiap istilah dengan format ketat sebagai: '[Istilah] - Katakan: \"[Definisi/Naskah]\"'. Contoh: 'Lever - Katakan: \"A lever is a simple machine...\"'."
            },
            "ConclusionSay": {
              "type": "string",
              "description": "Pernyataan 'Katakan:' penutup untuk transisi."
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
          "description": "Tulis ceramah guru yang rinci dengan naskah (Katakan: “…”). Sertakan langkah demi langkah tentang apa yang guru katakan, lakukan, dan mungkin demonstrasikan. Pecah ide-ide kompleks, berikan contoh/analogi, buat hubungan eksplisit dengan pengetahuan sebelumnya."
        },
        "AttentionReset": {
          "type": "object",
          "description": "Sisipkan paragraf standar pengaturan ulang perhatian persis seperti tertulis: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview.'",
          "properties": {
            "StandardParagraph": {
              "type": "string",
              "description": "Harus persis: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview. (word for word)'"
            },
            "Directions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{index}. {value}",
                "type": "string"
              },
              "description": "Sediakan arahan untuk aktivitas tersebut, termasuk naskah guru dan apa yang perlu dilakukan siswa & guru."
            },
            "WhyThisWorks": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Jelaskan dalam bentuk bullet mengapa aktivitas ini efektif untuk re-engagement, mengatur ulang fokus kognitif, memperkuat konsep, dan memberikan preview yang bertujuan. Misalnya: 'Berdiri + gerakan mengatur ulang perhatian.'"
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
          "description": "Langkah bernomor untuk melanjutkan instruksi dengan naskah guru (Katakan: “…”). Pecah ide-ide kompleks, berikan contoh/analogi, untuk memancing rasa ingin tahu, memberi isyarat pembelajaran berikutnya, memperluas ide-ide kunci."
        },
        "AnticipatedMisconceptions": {
          "x-format": "{items}",
          "type": "array",
          "description": "Cantumkan miskonsepsi umum siswa yang diperkirakan agar guru siap.",
          "items": {
            "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponse}: {value.TeacherResponse}",
            "type": "object",
            "properties": {
              "Misconception": {
                "type": "string",
                "description": "mis., 'Siswa mungkin berpikir bahwa tuas yang lebih besar selalu bekerja lebih baik.'"
              },
              "TeacherResponse": {
                "type": "string",
                "description": "Cara merespons secara efektif potensi kesalahpahaman siswa dan membimbing menuju pemahaman yang akurat."
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
          "description": "Hubungkan dengan tujuan. Kaitkan dengan salah satu pertanyaan esensial.",
          "properties": {
            "Duration": {
              "type": "string",
              "description": "misalnya, '(3 menit)'"
            },
            "Step1Say": {
              "type": "string",
              "description": "Naskah guru yang menghubungkan kegiatan sebelumnya dengan ide yang lebih besar."
            },
            "Step2Say": {
              "type": "string",
              "description": "Naskah guru yang meminta siswa untuk menoleh dan berbicara dengan pasangan."
            },
            "Step3Prompts": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- \"{value}\"",
                "type": "string"
              },
              "description": "Pertanyaan spesifik untuk prompt tersebut (misalnya, 'Mengapa shaduf itu penting...', 'Bukti apa yang menunjukkan...')."
            },
            "Step4Say": {
              "type": "string",
              "description": "Naskah guru untuk berbagi dalam kelompok besar (misalnya, 'Mari kita dengarkan beberapa ide...')."
            },
            "ExpectedStudentResponses": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Respons siswa yang diharapkan secara mendalam yang menggunakan penalaran atau bukti."
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
          "description": "Diferensiasikan pengajaran (bagaimana mengajar, bukan menyederhanakan materi). Variasikan kompleksitas dan kedalaman, dorong keterlibatan aktif/bahasa. Realistis untuk kelas.",
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
                  "description": "Untuk respons Go Deeper."
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
          "description": "Bagian ini harus mencakup dua jenis dukungan: Dukungan Umum dan Dukungan Individual. Fokus pada akses, bukan menurunkan rigor.",
          "properties": {
            "General": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Strategi non-spesifik siswa yang meningkatkan akses bagi semua pembelajar (misalnya, visual, catatan yang sudah diisi sebagian, glosarium digital, instruksi yang dipecah-pecah). Berikan 2-4 poin bullet."
            },
            "IndividualSupport": {
              "x-format": "{items}",
              "type": "array",
              "description": "Akomodasi dan modifikasi spesifik untuk siswa yang disebutkan dengan rencana formal. Cantumkan SETIAP siswa secara individual; JANGAN mengelompokkan siswa bersama. Dukungan untuk setiap siswa harus berupa daftar yang mudah dipindai.",
              "items": {
                "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                "type": "object",
                "properties": {
                  "StudentName": {
                    "type": "string",
                    "description": "Nama depan dan nama belakang dari siswa individu yang menerima dukungan ini."
                  },
                  "PlanProvided": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Rencana formal yang diberikan untuk siswa ini dalam prompt. Uraikan rencana menjadi daftar yang jelas. Anda boleh memparafrasekannya untuk memperbaiki format, tetapi JANGAN menghilangkan atau menambahkan informasi apa pun."
                  },
                  "PlanImplementation": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Alat/kerangka kalimat/visual/pengorganisasi konkret untuk tugas ini."
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
      "description": "Bagian lengkap 'Tinjauan & Pengambilan Kembali Berjarak'.",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Meminta siswa mengingat pembelajaran BARU dari pelajaran HARI INI.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Prompt guru yang dimulai dengan 'Say: '."
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
          "description": "Prompt guru yang mengaitkan dengan pertanyaan unit.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Prompt guru yang dimulai dengan 'Say: '."
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
          "description": "Ingat kembali dari pelajaran/unit sebelumnya yang spesifik.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Kalimat konteks seperti 'Sebelumnya dalam pelajaran ini, siswa belajar...'"
            },
            "Say": {
              "type": "string",
              "description": "Prompt guru yang dimulai dengan 'Ucapkan: '."
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
      "description": "Bagian untuk Tanya Jawab dan Diskusi.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Perkiraan waktu (misalnya '(5 min)')"
        },
        "InstructionsForTeachers": {
          "type": "object",
          "description": "Panduan guru untuk sesi Tanya Jawab dan Diskusi.",
          "properties": {
            "Step1_InviteSay": {
              "type": "string",
              "description": "misalnya, 'Sekarang adalah kesempatanmu untuk memikirkan apa yang telah kita pelajari...'"
            },
            "Step2_AskQuestions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "   - \"{value}\"",
                "type": "string"
              },
              "description": "3-4 pertanyaan untuk diajukan kepada siswa."
            },
            "Step3_CaptureSay1": {
              "type": "string",
              "description": "misalnya, 'Jika kamu punya pertanyaan, itu berarti kamu sedang berpikir secara mendalam...'"
            },
            "Step3_CaptureRecord": {
              "type": "string",
              "description": "misalnya, 'Tuliskan pertanyaan siswa pada bagan berjudul Pertanyaan yang Masih Kita Miliki.'"
            },
            "Step3_CaptureSay2": {
              "type": "string",
              "description": "misalnya, 'Kita akan terus menambahkan ke bagan ini sepanjang unit ini...'"
            },
            "Step4_AnswerSay1": {
              "type": "string",
              "description": "misalnya, 'Mari kita lihat pertanyaan kita. Mana saja yang bisa kita jawab menggunakan apa yang kita pelajari hari ini?'"
            },
            "Step4_AnswerAddress": {
              "type": "string",
              "description": "misalnya, 'Bahas beberapa pertanyaan menggunakan tanggapan siswa dan bukti.'"
            },
            "Step4_AnswerSay2": {
              "type": "string",
              "description": "misalnya, 'Beberapa pertanyaan ini akan membantu memandu apa yang akan kita pelajari selanjutnya...'"
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
      "description": "Bagian untuk Penutup.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Perkiraan waktu (misalnya '(1 min)')"
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
      "description": "Ekstrak dan buat TEPAT 4 prompt Penilaian Formatif yang mencakup DOK 1-4. Untuk setiap prompt, sertakan PromptLabel, Pertanyaan, dan TanggapanSiswaYangDiharapkan.",
      "items": {
        "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n{value.ExpectedStudentResponses}\n",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "misalnya, 'Prompt 1 (DOK 1)'"
          },
          "Question": {
            "type": "string",
            "description": "Teks pertanyaan yang tepat."
          },
          "ExpectedStudentResponses": {
            "x-format": "{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1-2 contoh tanggapan yang menunjukkan penguasaan."
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
      "description": "Bagian lengkap 'Latihan Siswa' untuk pekerjaan rumah / latihan di luar kelas.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Catatan yang menjelaskan bagaimana tugas-tugas tersebut memperkuat pembelajaran hari ini dan memperkuat retensi jangka panjang."
        },
        "Tasks": {
          "x-format": "{items}",
          "type": "array",
          "description": "Buat 4 tugas latihan yang mencakup level DOK 2, 3, dan 4.",
          "items": {
            "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{loc.SuccessCriteria}\n\n{value.SuccessCriteria}",
            "type": "object",
            "properties": {
              "TaskDescription": {
                "type": "string",
                "description": "misalnya, '(DOK 2) Gambar sebuah shaduf dan beri label...'"
              },
              "SuccessCriteria": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "3 poin bullet kriteria keberhasilan."
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
          "description": "Sebuah tugas refleksi untuk para siswa.",
          "properties": {
            "Prompt": {
              "type": "string",
              "description": "misalnya, 'Tulis 2-3 kalimat sebagai respons terhadap satu pertanyaan:'"
            },
            "ReflectionOptions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 opsi pertanyaan refleksi."
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
