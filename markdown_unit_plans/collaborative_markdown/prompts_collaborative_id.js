window.prompts_collaborative_id = {
  STEP0_PROMPT_TEMPLATE: `Buat kerangka unit dan struktur pelajaran menggunakan informasi di bawah ini. Jangan menulis rencana pelajaran lengkap.
                    
Berdasarkan Unit Subject, standar pendidikan, Unit Description/Instruction, Grade Level, Duration of class period (minutes), dan Number of Lessons yang diminta, hasilkan respons JSON yang mencakup UnitDescription yang koheren dan daftar "container" pelajaran yang tidak saling tumpang tindih.

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
- Setiap pertanyaan WAJIB berupa kalimat lengkap, benar secara tata bahasa, dan diakhiri dengan tanda tanya.
- Setiap pertanyaan WAJIB diawali dengan "Bagaimana" atau "Mengapa".

- Pertanyaan harus bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan harus berfokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus mata pelajaran.
- Pertanyaan harus dapat dipindahkan lintas disiplin dan berlaku di luar unit ini.
- Pertanyaan harus digunakan kembali secara verbatim di setiap pelajaran dalam unit.

Apa yang harus dihasilkan:
- Output HARUS berupa JSON valid yang sesuai dengan skema.
- WAJIB: Lengkapi seluruh properti dalam objek "UnitDescription" secara penuh:
  - "Description": Tulis paragraf 4-5 kalimat yang menjelaskan fokus inti unit dan perjalanan naratifnya.
  - "StudentLearningObjectives": Cantumkan 3-5 tujuan belajar utama yang terukur untuk unit.
  - "StandardsAligned": Cantumkan semua standar yang dibahas sepanjang unit.
  - "EssentialQuestions": Tepat 3 pertanyaan konseptual yang mengikuti aturan di atas.
- HASILKAN daftar "Lessons" yang berisi tepat {{$NumberOfItems}} pelajaran.
  - Setiap pelajaran harus mencakup "lessonNumber" (indeks mulai dari 1), "lessonName", dan "lessonDescription" (2-4 kalimat yang menggambarkan cakupan pelajaran).

Batasan:
- Pastikan unit dan setiap pelajaran selaras dengan fokus unit.
- Pastikan urutan logis dari ide-ide dasar ke pemodelan yang lebih kompleks.
- Akurasi: Semua konten harus akurat secara ilmiah dan sesuai usia.

Output HARUS berupa JSON valid yang sesuai dengan skema. Gunakan format ringkas (tanpa baris kosong tambahan).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Buat SATU rencana pembelajaran bergaya kolaboratif (BUKAN rencana unit, BUKAN beberapa pelajaran) menggunakan info di bawah ini.

Anda HARUS menghasilkan JSON yang valid yang cocok persis dengan skema JSON yang disediakan (LessonPlanResponse dengan satu objek "LessonPlan"). Jangan sertakan kunci tambahan apa pun. Gunakan pemformatan JSON ringkas (tanpa baris kosong tambahan).

KONTEKS UNIT (konteks hanya-baca untuk koherensi):
Mata Pelajaran Unit:
{{$Subject}}

Konten Unit:
{{$ParentUnitData}}

Deskripsi/Instruksi Unit: Buat unit menggunakan Standar berikut:
{{$Standards}}

Tingkat Kelas:
{{$GradeLevel}}

Sumber/Media yang digunakan:
{{$MediaContext}}

Durasi jam pelajaran dalam menit:
{{$ClassDuration}}

Judul Pelajaran:
{{$Name}}

Deskripsi/Instruksi Unit:
{{$UserPrompt}}

Pertanyaan Esensial Unit (GUNAKAN INI SECARA VERBATIM):
{{$UnitEssentialQuestions}}

Jika Pertanyaan Esensial Unit di atas kosong, hasilkan tepat 3 pertanyaan konseptual dengan mengikuti aturan berikut:
- Setiap pertanyaan HARUS berupa kalimat lengkap, secara tata bahasa benar, dan diakhiri dengan tanda tanya.
- Setiap pertanyaan WAJIB diawali dengan "Bagaimana" atau "Mengapa".

- Pertanyaan HARUS konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS berfokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus mata pelajaran.
- Pertanyaan HARUS dapat ditransfer lintas disiplin dan berlaku di luar unit ini.

SISWA DENGAN DUKUNGAN TERINDIVIDUALISASI (HARUS hanya digunakan di dalam CollaborativeActivities.AccommodationsAndModifications; gunakan nama/rencana siswa persis seperti yang tertulis):
{{$LearningPlans}}

ATURAN KONTEN PENTING (Gaya Kolaboratif):
- Jaga pembelajaran tetap selaras dengan fokus unit dan Batasan/Ruang Lingkup Pelajaran di atas; hindari memperkenalkan konsep besar baru yang termasuk ke pelajaran lain.
- Relevansi Budaya & Inklusi: sertakan berbagai perspektif; hubungkan ke komunitas yang beragam; hindari stereotip; tunjukkan dampak bagi semua pihak yang terlibat.
- Transfer: tanamkan penerapan dan penalaran dunia nyata sepanjang pembelajaran.
- Interleaving: saat siswa berlatih/menerapkan, campurkan strategi atau konsep (bukan latihan yang dikelompokkan). Jika pelajaran berisi penalaran seperti matematika, sertakan setidaknya satu item interleaved DOK 3–4 yang menggabungkan konten saat ini dengan konsep pelajaran sebelumnya dan mengharuskan siswa membenarkan pilihan strategi.

ATURAN SPESIFIK BIDANG:
- EssentialQuestions: HARUS sama persis dengan pertanyaan esensial tingkat unit (teks yang sama, urutan yang sama).
- AssessPriorKnowledge: Jika bagian ini diperlukan (misalnya, untuk pelajaran pertama atau ketika memperkenalkan konsep besar baru), tulis 150–250 kata mengikuti struktur yang diwajibkan dalam deskripsi skema. Jika tidak, kembalikan "" (string kosong).
- Instruction:
  - InstructionsForTeachers: Langkah-langkah ini harus menyeluruh dan mencakup semua pembelajaran baru untuk pelajaran ini beserta penjelasan bagaimana mengajarkannya. Harus tepat.
  - Harus mencakup cara memperkenalkan konten baru subjek (hook, pertanyaan penuntun, transisi).
  - Harus mencakup konten dan naskah bagi guru untuk mengajarkan konten secara langsung (definisi, contoh, poin penting, penjelasan).
  - Struktur harus mengalir secara alami dengan prompt Say/Do/Ask/Listen for/Write.
  - PENTING: Jangan sertakan header huruf kapital semua (seperti HOOK, INTRODUCTION, dll.) untuk bagian-bagian.
  - PENTING: Jangan sertakan durasi waktu untuk petunjuk atau langkah individual.
  - TranscendentThinking: Berikan satu pertanyaan penerapan dunia nyata yang menghubungkan pembelajaran dengan tujuan/makna, diikuti label 'Expected Student Responses:' dan 2–3 contoh.
- GroupStructureAndRoles:
  - Output HARUS ditujukan untuk guru.
  - GroupSize: tentukan 'pairs', 'triads', atau '4-5 students'.
  - TeacherSay: 1–2 kalimat yang menjelaskan bahwa peran itu penting dan Anda akan memodelkan seperti apa setiap peran.
  - Roles: Harus mendefinisikan tepat lima peran ini (Facilitator, Recorder, MaterialsManager, Timekeeper, Presenter) dengan tugas konkret yang terkait dengan CollaborativeActivities pada pelajaran ini.
  - Rotation: Satu kalimat yang menentukan kapan peran berputar dalam pelajaran INI (misalnya, "Rotate roles after Phase A and again before the gallery walk.").

CollaborativeActivities:
- Buat aktivitas kolaboratif yang saling bergantung (pengganti kolaboratif untuk Guided Practice) yang selaras dengan ruang lingkup pelajaran ini.
- Setiap siswa harus berkontribusi dan kelompok harus menghasilkan produk atau keputusan bersama.
- Sertakan petunjuk waktu, scripting guru pada bagian Say:, prompt saat berkeliling + respons yang diharapkan, dan cek cepat di mana SEMUA siswa merespons + respons yang diharapkan.
- Sertakan Differentiation (3 tingkatan) dan AccommodationsAndModifications (General + IndividualSupport persis seperti yang diberikan).
- Jika ini pelajaran matematika, sertakan satu masalah interleaved DOK 3–4 yang menggabungkan konten saat ini dengan pelajaran/unit sebelumnya dan jelaskan mengapa itu disertakan; jika bukan, jangan sertakan interleaving.
- ReflectionOnGroupDynamics:
  - Harus sekitar 5 menit.
  - Sertakan 2–4 prompt debrief siswa (mis., apa yang berjalan baik, tantangan, suara siapa yang terdengar).
  - Berikan langkah fasilitasi guru (quick-write exit slip, penilaian diri kelompok 1–5, atau diskusi 2 menit), dengan prompt guru dan jawaban siswa yang diharapkan.
  - Secara eksplisit hubungkan refleksi kembali ke CollaborationGuidelines.
- ReviewAndSpacedRetrieval:
  - Struktur dan persyaratan sama dengan versi Direct Instruction (lihat deskripsi skema).
  - Harus mencakup cek retrieval yang terhubung ke SATU konsep pelajaran sebelumnya (sebutkan nomor pelajaran sebelumnya).
- StudentPractice:
  - PR di rumah/di luar kelas.
  - Harus mengikuti format tepat yang diwajibkan dalam deskripsi skema (termasuk penanda ✅Expected Student Responses).

PERSYARATAN OUTPUT:
- Output HARUS berupa JSON valid yang cocok persis dengan skema yang disediakan.
- Output HARUS berupa SATU rencana pelajaran saja.
- Tidak ada HTML. Tidak ada emoji. Tidak ada markdown. Teks biasa di dalam field string.

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  STEP0_SCHEMA: {
  "title": "UnitPlanResponse",
  "type": "object",
  "properties": {
    "UnitDescription": {
      "type": "object",
      "properties": {
        "Description": {
          "type": "string",
          "description": "Deskripsi unit sebagai satu paragraf teks polos yang utuh (4–5 kalimat lengkap) ditulis dengan suara guru yang alami yang bisa Anda ucapkan langsung kepada siswa. Tanpa HTML, tanpa emoji, tanpa poin-poin. Harus mengalir secara percakapan tetapi mengikuti struktur ini (tanpa judul): (1) kalimat pengait yang memancing rasa ingin tahu atau membuat kontras yang mengejutkan, (2) kalimat 'Di unit ini, Anda akan...' tentang hasil penguasaan, (3) kalimat 'Anda akan memperkuat keterampilan Anda dalam...' tentang kemampuan berpikir/analisis, (4) kalimat 'Ini terhubung dengan...' tentang relevansi dunia nyata, (5) kalimat 'Memahami ini penting karena...' tentang makna yang lebih luas atau dampak jangka panjang."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Buat pertanyaan esensial yang hanya berfokus pada konsep-konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. JANGAN menyebut istilah, proses, kosakata, atau contoh yang spesifik pada mata pelajaran apa pun. Pertanyaan harus bersifat terbuka, dapat dipindahkan ke semua disiplin ilmu, dan mustahil dijawab hanya dengan mempelajari pelajaran atau konten unit. Fokus hanya pada gagasan besar, bukan materi pelajarannya.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Bagian 'Student Learning Objectives' lengkap untuk seluruh unit ini. Setiap item daftar harus menjadi tujuan yang jelas dan terukur yang dimulai dengan kata kerja terukur dan diakhiri dengan label DOK dalam tanda kurung",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Daftar semua standar pendidikan unik yang digunakan di mana pun dalam unit ini dan pelajarannya. JANGAN menambahkan standar yang tidak muncul dalam konten unit. Setiap standar harus mencakup kode standar dan deskripsi, misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem Bumi–matahari–bulan untuk menggambarkan pola siklus fase bulan, gerhana, dan musim.'",
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
      "description": "Daftar kontainer pelajaran untuk unit ini (hanya kerangka). Setiap item harus tidak tumpang tindih dan dibatasi dengan jelas sehingga konten pelajaran tidak berulang antar pelajaran.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Nomor urut sebuah pelajaran. Berbasis 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Judul pelajaran singkat sebagai teks biasa."
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
  "title": "LessonPlanResponse",
  "type": "object",
  "properties": {
    "LessonDescription": {
      "type": "object",
      "properties": {
        "LessonTitle": {
          "x-format": "# {value}",
          "type": "string",
          "description": "Judul deskriptif singkat untuk pelajaran. Jangan sertakan emoji di sini."
        },
        "EssentialQuestions": {
          "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}",
          "type": "array",
          "description": "Tempel saja semua pertanyaan esensial tingkat unit dalam urutan yang sama jika disediakan. Jika tidak disediakan, hasilkan tepat 3 pertanyaan konseptual yang hanya berfokus pada konsep-konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. JANGAN menyebut istilah, proses, kosakata, atau contoh yang spesifik pada mata pelajaran apa pun. Pertanyaan harus bersifat terbuka, dapat dipindahkan ke semua disiplin ilmu, dan mustahil dijawab hanya dengan mempelajari pelajaran atau konten unit. Fokus hanya pada gagasan besar, bukan materi pelajarannya.",
          "items": {
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Daftar string 'Istilah - Definisi'. Definisi harus singkat, sesuai usia, dan terkait dengan pelajaran ini.",
          "items": {
            "x-format": "{index}. {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "2–3 tujuan yang terukur, masing-masing diakhiri dengan label DOK dalam tanda kurung.",
          "items": {
            "x-format": "- {value}\n",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Standar pendidikan yang selaras untuk pelajaran ini. Harus cocok persis dengan standar unit dalam kode + deskripsi.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "AssessPriorKnowledge": {
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
          "type": "object",
          "description": "Bagian Assess Prior Knowledge. HANYA Lesson 1 yang harus berisi blok terperinci; SEMUA PELAJARAN LAIN HARUS MENGEMBALIKAN NULL atau menghilangkan field ini. Untuk Lesson 1, strukturnya harus mencakup ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt, dan AlternateOptions.",
          "properties": {
            "ActivityInstructions": {
              "type": "string",
              "description": "Instruksi dan template/struktur yang jelas untuk moda yang dipilih. Contoh: 'Katakan: \"Sebelum kita membangun...\"'"
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "description": "Jawaban yang diperkirakan atau kesalahpahaman umum untuk moda yang dipilih.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "ClosingTeacherPrompt": {
              "type": "string",
              "description": "Prompt penutup guru 'Katakan:' yang memvalidasi pemikiran siswa dan mempratinjau penyelidikan unit."
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
        "Instruction": {
          "x-format": "### {green}({loc.Instruction})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.TranscendentThinking}\n\n{value.QuickCheck}",
          "type": "object",
          "description": "Bagian 'Instruction' dari pelajaran kolaboratif (setara dengan Direct Presentation).",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Daftar materi.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Skrip guru yang disusun ke dalam langkah-langkah berurutan. Langkah-langkah ini harus secara kolektif berfungsi sebagai panduan menyeluruh untuk membantu guru menyampaikan konten baru. Ini harus mencakup cara memperkenalkan konten subjek baru (hook, pertanyaan penuntun, transisi), dan konten/skrip bagi guru untuk mengajar secara langsung (definisi, contoh, poin-poin penting, penjelasan). Instruksi harus menyeluruh dan mencakup semua pembelajaran baru untuk pelajaran tersebut beserta penjelasan tentang cara mengajarkannya. Harus tepat. Jangan gunakan header berhuruf besar semua untuk bagian-bagian dan jangan sertakan penanda waktu.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Tindakan guru, misalnya Katakan: '...', Lakukan: '...', Tanyakan: '...'"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "description": "Jawaban yang diantisipasi jika instruksinya berupa pertanyaan. Kembalikan array kosong jika tidak berlaku.",
                    "items": {
                      "x-format": "  - {value}",
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "Instruction",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              }
            },
            "AnticipatedMisconceptions": {
              "x-format": "⚠️ {loc.AnticipatedMisconceptions}\n\n{items}",
              "type": "array",
              "description": "Daftar miskonsepsi umum dan bahasa koreksi yang tepat untuk menangani masing-masingnya.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Misconception}\n  - {value.Correction}",
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Deskripsi miskonsepsi."
                  },
                  "Correction": {
                    "type": "string",
                    "description": "Bahasa koreksi yang diawali dengan 'Katakan: '."
                  }
                },
                "required": [
                  "Misconception",
                  "Correction"
                ],
                "additionalProperties": false
              }
            },
            "TranscendentThinking": {
              "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Pertanyaan penerapan di dunia nyata yang menghubungkan pembelajaran dengan tujuan/makna.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 respons siswa yang diharapkan yang menunjukkan pemahaman lebih dalam.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "QuickCheck": {
              "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Pertanyaan cek pemahaman akhir.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 respons siswa yang diharapkan.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "Materials",
            "InstructionsForTeachers",
            "AnticipatedMisconceptions",
            "TranscendentThinking",
            "QuickCheck"
          ],
          "additionalProperties": false
        },
        "GroupStructureAndRoles": {
          "x-format": "### {green}({loc.GroupStructureAndRoles})\n\n{loc.DetermineThePurpose}\n\n{value.GroupSize}\n\n**📋 {loc.InstructionsForTeachers}**\n{value.TeacherSay}\n\n{value.Roles}\n\n{value.Rotation}",
          "type": "object",
          "description": "Ukuran kelompok, skrip guru, peran yang ditentukan, dan rotasi.",
          "properties": {
            "GroupSize": {
              "x-format": "{loc.GroupSize}: {value}",
              "type": "string",
              "description": "misalnya 'berpasangan', 'bertiga', atau '4-5 siswa'"
            },
            "TeacherSay": {
              "type": "string",
              "description": "Skrip guru yang menjelaskan peran."
            },
            "Roles": {
              "x-format": "{value.Facilitator}\n{value.Recorder}\n{value.MaterialsManager}\n{value.Timekeeper}\n{value.Presenter}",
              "type": "object",
              "properties": {
                "Facilitator": {
                  "x-format": "- **{loc.Facilitator}:** {value}",
                  "type": "string"
                },
                "Recorder": {
                  "x-format": "- **{loc.Recorder}:** {value}",
                  "type": "string"
                },
                "MaterialsManager": {
                  "x-format": "- **{loc.MaterialsManager}:** {value}",
                  "type": "string"
                },
                "Timekeeper": {
                  "x-format": "- **{loc.Timekeeper}:** {value}",
                  "type": "string"
                },
                "Presenter": {
                  "x-format": "- **{loc.Presenter}:** {value}",
                  "type": "string"
                }
              },
              "required": [
                "Facilitator",
                "Recorder",
                "MaterialsManager",
                "Timekeeper",
                "Presenter"
              ],
              "additionalProperties": false
            },
            "Rotation": {
              "x-format": "{loc.Rotation}:\n- {value}",
              "type": "string",
              "description": "Kalimat yang menyatakan kapan peran berotasi."
            }
          },
          "required": [
            "GroupSize",
            "TeacherSay",
            "Roles",
            "Rotation"
          ],
          "additionalProperties": false
        },
        "CollaborationGuidelines": {
          "x-format": "### {green}({loc.CollaborationGuidelines})\n\n{loc.CollaborationGuidelinesIntro}\n\n{items}",
          "type": "array",
          "description": "Prompt untuk membantu kelompok membuat norma kolaborasi mereka sendiri.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "CollaborativeActivities": {
          "x-format": "### {green}({loc.CollaborativeActivities})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
          "type": "object",
          "description": "Kerja kelompok saling bergantung (pengganti kolaboratif untuk Guided Practice). Ditujukan untuk guru, sangat terstruktur, dan dirancang agar siswa tidak dapat menyelesaikan tugas secara mandiri. Harus mencakup: (a) saling ketergantungan yang jelas (jigsaw, membangun konsensus, gallery walk, pemecahan masalah terstruktur, atau serupa), (b) pengaturan waktu yang eksplisit untuk setiap fase (misalnya, '8 menit diskusi, 2 menit menyiapkan respons'), (c) fasilitasi guru yang terskrip menggunakan pernyataan 'Katakan:' di sepanjang proses, (d) produk kelompok bersama (klaim, model, bagan, set solusi, artefak gallery, dll.), (e) prompt saat berkeliling beserta respons siswa yang diharapkan, (f) setidaknya satu cek respons SELURUH siswa (papan tulis mini, menulis cepat, polling, acungan jempol, dll.) dengan respons yang diharapkan, (g) pertanyaan cek cepat + respons yang diharapkan, (h) Diferensiasi dalam tiga tingkat yang berfokus pada instruksi (bukan akomodasi), dan (i) AccommodationsAndModifications yang dipisahkan menjadi General supports dan IndividualSupport yang cocok persis dengan siswa/rencana yang diberikan. Pastikan relevansi budaya dan inklusi dengan mengundang berbagai perspektif dan memastikan partisipasi yang adil.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Daftar lengkap materi guru + siswa yang digunakan dalam aktivitas kolaboratif ini. Sertakan semua item yang disiapkan (kartu prompt, bingkai kalimat, kartu peran, daftar periksa, rubrik, lembar gallery walk, papan tulis mini, timer, visual, bank kata, dll.). Satu item per elemen array; tanpa placeholder.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Skrip guru untuk aktivitas kolaboratif (usahakan 6-8 langkah bernomor). Pastikan satu langkah secara eksplisit berbunyi 'Circulation Prompts:' yang mencakup pertanyaan spesifik untuk diajukan kepada kelompok saat mereka bekerja.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}{value.CirculationPrompts}{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Tindakan guru yang spesifik, dimulai dengan 'Katakan: ', 'Lakukan: ', atau persis 'Circulation Prompts:'."
                  },
                  "CirculationPrompts": {
                    "x-format": "\n{items}",
                    "type": "array",
                    "description": "HANYA isi ini jika Instruction adalah 'Circulation Prompts:'. Daftarkan pertanyaan spesifik untuk diajukan kepada kelompok saat berkeliling. HAPUS properti ini jika tidak berlaku.",
                    "items": {
                      "x-format": "   - {value.Prompt}{value.ExpectedStudentResponses}",
                      "type": "object",
                      "properties": {
                        "Prompt": {
                          "type": "string",
                          "description": "Pertanyaan yang diajukan kepada kelompok."
                        },
                        "ExpectedStudentResponses": {
                          "x-format": "\n     ✅ {loc.ExpectedStudentResponses}\n{items}",
                          "type": "array",
                          "description": "Jawaban yang diharapkan untuk prompt percakapan tertentu ini. HAPUS properti ini jika tidak ada.",
                          "items": {
                            "x-format": "       - {value}",
                            "type": "string"
                          }
                        }
                      },
                      "required": [
                        "Prompt",
                        "ExpectedStudentResponses"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "\n   ✅ {loc.ExpectedStudentResponses}\n{items}",
                    "type": "array",
                    "description": "Jawaban yang diantisipasi jika Instruksi tersebut adalah pertanyaan langsung kepada kelas. HAPUS properti ini jika tidak berlaku.",
                    "items": {
                      "x-format": "     - {value}",
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "Instruction",
                  "CirculationPrompts",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              }
            },
            "Differentiation": {
              "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "type": "object",
              "description": "Diberi label dengan tiga tingkatan yang diberi label jelas: Pembelajar Bahasa, Siswa yang Membutuhkan Scaffolding Tambahan, Gali Lebih Dalam. Persyaratan: Konten harus membedakan instruksi, bukan memberikan akomodasi atau modifikasi (hal-hal tersebut dibahas di tempat lain). Strategi harus berfokus pada cara mengajar, bukan cara menyederhanakan materi. Aktivitas harus bervariasi dalam kompleksitas dan kedalaman, selaras dengan tujuan pembelajaran yang sama. Setiap tingkatan harus mendorong keterlibatan aktif, pengembangan bahasa, dan pemahaman konseptual. Gunakan bahasa yang jelas, berfokus pada guru, dan buat dukungan tetap realistis untuk penggunaan di kelas.",
              "properties": {
                "LanguageLearners": {
                  "x-format": "{loc.LanguageLearners}\n\n{value.Strategies}",
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      },
                      "description": "Berikan 2-3 strategi pengajaran konkret untuk pembelajar bahasa. Contoh: menyediakan visual spesifik (misalnya, 'Planet Fact Sheet'), menggunakan kerangka kalimat (misalnya, 'Ini ditempatkan di sini karena...'), atau meminta siswa memberi isyarat/menunjuk sebelum menjelaskan secara lisan. Fokus pada keterlibatan aktif dan pengembangan bahasa."
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false
                },
                "AdditionalScaffolding": {
                  "x-format": "{loc.StudentsInNeedOfAdditionalScaffolding}\n\n{value.Strategies}",
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      },
                      "description": "Berikan 2-3 strategi pengajaran konkret untuk scaffolding. Contoh: menyediakan organizer/template yang sudah digambar sebelumnya, menggunakan daftar periksa yang disederhanakan dengan pertanyaan panduan spesifik, atau memodelkan proses think-aloud (misalnya, 'Perhatikan bagaimana saya mencocokkan...'). Fokus pada cara mengajar dan memvariasikan kompleksitas tanpa menyederhanakan materi."
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false
                },
                "GoDeeper": {
                  "x-format": "{loc.GoDeeper}\n\n{value.Strategies}",
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      },
                      "description": "Berikan 1-2 tugas perluasan yang memperdalam pemahaman konseptual. Sertakan tantangan spesifik (misalnya, 'Sesuaikan jarak untuk menunjukkan...') atau pertanyaan tingkat tinggi (misalnya, 'Bagaimana Anda memodelkan... dengan akurat?'). Harus selaras dengan tujuan pembelajaran yang sama."
                    }
                  },
                  "required": [
                    "Strategies"
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
              "description": "Bagian ini harus mencakup dua jenis dukungan: Dukungan Umum dan Dukungan Individual. Fokus pada akses, bukan menurunkan tuntutan.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Strategi non-spesifik untuk siswa yang meningkatkan akses bagi semua pembelajar (misalnya, visual, catatan yang sudah terisi, glosarium digital, instruksi yang dipecah menjadi beberapa bagian). Berikan 2-4 poin bullet."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Akomodasi dan modifikasi spesifik untuk siswa yang disebutkan namanya dengan rencana formal. Cantumkan SETIAP siswa secara individu; JANGAN mengelompokkan siswa bersama-sama. Dukungan untuk setiap siswa harus berupa daftar yang mudah dipindai.",
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
                        "description": "Rencana formal yang diberikan untuk siswa ini dalam prompt. Uraikan rencana tersebut menjadi daftar yang jelas. Anda boleh memparafrasekannya untuk memperbaiki format, tetapi JANGAN menghilangkan atau menambahkan informasi apa pun."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Alat/kerangka kalimat/visual/organizer konkret untuk tugas ini."
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
            "Materials",
            "InstructionsForTeachers",
            "Differentiation",
            "AccommodationsAndModifications"
          ],
          "additionalProperties": false
        },
        "ReflectionOnGroupDynamics": {
          "x-format": "### {green}({loc.ReflectionOnGroupDynamics})\n\n{value.DebriefPrompt}\n\n{value.TeacherFacilitationOptions}\n\n{value.ClosingPrompt}",
          "type": "object",
          "description": "Siswa mengevaluasi seberapa baik kelompok bekerja sama. HARUS memuat tepat 3 segmen dalam urutan berikut: prompt debrief, opsi fasilitasi, dan prompt penutup yang mengaitkan ke norma.",
          "properties": {
            "DebriefPrompt": {
              "x-format": "**1.** {value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Prompt debrief singkat untuk siswa setelah kolaborasi.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "Kata-kata persis yang diucapkan guru, misalnya, 'Ucapkan: \"Luangkan dua menit untuk merefleksikan: Apa yang kelompok kita lakukan dengan baik hari ini?\"'"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Jawaban siswa yang diharapkan (2-3 contoh)."
                }
              },
              "required": [
                "Say",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "TeacherFacilitationOptions": {
              "x-format": "**2.** {loc.TeacherFacilitationOptions}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Tepat 3 langkah fasilitasi guru untuk dipilih (misalnya, slip keluar tulis cepat, penilaian kolaborasi kelompok 1-5, berbagi seluruh kelas selama 2 menit). Hanya opsinya, tanpa respons yang diharapkan."
            },
            "ClosingPrompt": {
              "x-format": "**3.** {value}",
              "type": "string",
              "description": "Prompt akhir dari guru yang mengaitkan refleksi kembali ke pedoman kolaborasi. misalnya, 'Ucapkan: \"Norma mana yang paling membantu hari ini?\"'"
            }
          },
          "required": [
            "DebriefPrompt",
            "TeacherFacilitationOptions",
            "ClosingPrompt"
          ],
          "additionalProperties": false
        },
        "ReviewAndSpacedRetrieval": {
          "x-format": "### {green}({loc.ReviewAndSpacedRetrieval})\n\n{value.Materials}\n\n{value.TeacherNotes}\n\n📋 **{loc.InstructionsForTeachers}**\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.TranscendentThinking}\n\n{value.SpacedRetrieval}",
          "type": "object",
          "description": "Bagian 'Tinjauan & Pengambilan Kembali Terjadwal' lengkap.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Daftar materi (misalnya ['None'] atau ['Whiteboards'])."
            },
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Catatan singkat yang menjelaskan bagaimana praktik pengambilan kembali mendukung retensi."
            },
            "ActiveRecall": {
              "x-format": "**{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}\n\n{value.CorrectCommonMisconceptions}",
              "type": "object",
              "description": "Meminta siswa untuk mengingat pembelajaran BARU dari pelajaran HARI INI.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "Prompt guru."
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "CorrectCommonMisconceptions": {
                  "x-format": "⚠️ {loc.CorrectCommonMisconceptions}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "1-2 miskonsepsi dan cara memperbaikinya."
                }
              },
              "required": [
                "Say",
                "ExpectedStudentResponses",
                "CorrectCommonMisconceptions"
              ],
              "additionalProperties": false
            },
            "EssentialQuestionConnection": {
              "x-format": "💭 **{loc.EssentialQuestionConnection}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Prompt guru yang menghubungkan dengan pertanyaan unit.",
              "properties": {
                "Say": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
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
            "TranscendentThinking": {
              "x-format": "🌍 **{loc.TranscendentThinking}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Prompt penerapan dalam dunia nyata.",
              "properties": {
                "Say": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
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
              "x-format": "⏳ **{loc.SpacedRetrieval} ({value.DrawsFrom})**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Mengingat dari pelajaran/unit sebelumnya yang spesifik.",
              "properties": {
                "DrawsFrom": {
                  "type": "string",
                  "description": "Pelajaran sebelumnya yang dirujuk, misalnya 'Diambil dari Unit 2, Pelajaran 3'"
                },
                "Say": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "DrawsFrom",
                "Say",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "Materials",
            "TeacherNotes",
            "ActiveRecall",
            "EssentialQuestionConnection",
            "TranscendentThinking",
            "SpacedRetrieval"
          ],
          "additionalProperties": false
        },
        "FormativeAssessment": {
          "x-format": "### ✅ {green}({loc.FormativeAssessment})\n\n{items}",
          "type": "array",
          "description": "Tepat 4 prompt Penilaian Formatif, satu untuk setiap level DOK.",
          "items": {
            "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
            "type": "object",
            "properties": {
              "PromptLabel": {
                "type": "string",
                "description": "misalnya, 'Prompt 1 (DOK 1)'"
              },
              "Question": {
                "type": "string",
                "description": "Teks pertanyaan yang tepat, misalnya, 'Mengapa planet tetap berada di orbit alih-alih terbang ke luar angkasa?'"
              },
              "ExpectedStudentResponses": {
                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "1-2 contoh jawaban yang menunjukkan penguasaan (dibungkus dalam tanda kutip)."
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
          "x-format": "### 🖊️ {green}({loc.StudentPractice})\n\n{value.TeacherNotes}\n\n{value.PracticeTasks}\n\n{value.Reflection}",
          "type": "object",
          "description": "Latihan rumah/di luar kelas.",
          "properties": {
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Penjelasan singkat tentang tujuan latihan, misalnya, 'Tugas-tugas ini memperkuat pembelajaran hari ini tentang [topik] dengan meminta siswa mengamati pola di dunia nyata dan menjelaskannya menggunakan konsep yang diperkenalkan di kelas...'"
            },
            "PracticeTasks": {
              "x-format": "{items}",
              "type": "array",
              "description": "Tepat 3 tugas latihan (DOK 2 atau DOK 3).",
              "items": {
                "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "TaskDescription": {
                    "type": "string",
                    "description": "misalnya, '(DOK 2) Malam ini, pergilah ke luar dan tulis 3-4 kalimat...'"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "TaskDescription",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              },
              "minItems": 3,
              "maxItems": 3
            },
            "Reflection": {
              "x-format": "{value.Prompt}\n\n{value.ReflectionOptions}",
              "type": "object",
              "description": "Sebuah tugas refleksi untuk siswa.",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "misalnya, 'Refleksi: Tulis 2-3 kalimat yang menanggapi satu prompt:'"
                },
                "ReflectionOptions": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Tepat 4 opsi pertanyaan refleksi dalam tanda kutip."
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
            "PracticeTasks",
            "Reflection"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "LessonTitle",
        "EssentialQuestions",
        "KeyVocabulary",
        "StudentLearningObjectives",
        "StandardsAligned",
        "AssessPriorKnowledge",
        "Instruction",
        "GroupStructureAndRoles",
        "CollaborationGuidelines",
        "CollaborativeActivities",
        "ReflectionOnGroupDynamics",
        "ReviewAndSpacedRetrieval",
        "FormativeAssessment",
        "StudentPractice"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "LessonDescription"
  ],
  "additionalProperties": false,
  "x-removablePaths": {
    "EssentialQuestions": [
      "LessonDescription.EssentialQuestions"
    ],
    "StandardsAligned": [
      "LessonDescription.StandardsAligned"
    ],
    "AssessPriorKnowledge": [
      "LessonDescription.AssessPriorKnowledge"
    ],
    "SpacedLearningAndRetrieval": [
      "LessonDescription.ReviewAndSpacedRetrieval"
    ],
    "FormativeAssessment": [
      "LessonDescription.FormativeAssessment"
    ],
    "AccommodationsAndModifications": [
      "LessonDescription.CollaborativeActivities.AccommodationsAndModifications"
    ]
  }
},
};
