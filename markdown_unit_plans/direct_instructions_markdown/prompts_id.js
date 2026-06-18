window.promptsid = {
  STEP0_PROMPT_TEMPLATE: `Buat garis besar unit dan struktur pelajaran menggunakan info di bawah ini. JANGAN menulis rencana pelajaran lengkap.
                    
Berdasarkan Unit Subject, standar pendidikan, Unit Description/Instruction, Grade Level, Duration of class period (minutes), dan Number of Lessons yang diminta, buat respons JSON yang mencakup UnitDescription yang koheren dan daftar “containers” pelajaran yang tidak saling tumpang tindih.

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
- Setiap pertanyaan WAJIB berupa kalimat lengkap dan tata bahasa yang benar, serta diakhiri dengan tanda tanya.
- Setiap pertanyaan WAJIB diawali dengan “How” atau “Why”.
- Pertanyaan HARUS konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS berfokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten spesifik mata pelajaran.
- Pertanyaan HARUS dapat dipindahkan antar disiplin ilmu dan berlaku di luar unit ini.
- Pertanyaan HARUS digunakan kembali secara verbatim di setiap pelajaran dalam unit ini.

Apa yang harus dibuat:
- Output HARUS berupa JSON valid yang مطابق dengan skema.
- WAJIB: Isi seluruh properti dalam objek "UnitDescription" secara lengkap:
  - "Description": Tulis paragraf 4-5 kalimat yang menggambarkan fokus inti unit dan perjalanan naratifnya.
  - "StudentLearningObjectives": Daftarkan 3-5 tujuan belajar utama yang terukur untuk unit ini.
  - "StandardsAligned": Daftarkan semua standar yang dibahas sepanjang unit.
  - "EssentialQuestions": Tepat 3 pertanyaan konseptual yang mengikuti aturan di atas.
- GENERATE daftar "Lessons" yang berisi tepat {{$NumberOfItems}} pelajaran.
  - Setiap pelajaran harus mencakup "lessonNumber" (indeks mulai dari 1), "lessonName", dan "lessonDescription" (2–4 kalimat yang menjelaskan cakupan pelajaran).

Batasan:
- Jaga agar unit dan setiap pelajaran tetap selaras dengan fokus unit.
- Pastikan urutan logis dari ide dasar menuju pemodelan yang lebih kompleks.
- Akurasi: Semua konten harus akurat secara ilmiah dan sesuai usia.

Output HARUS berupa JSON valid yang sesuai dengan skema. Gunakan format ringkas (tanpa baris kosong tambahan).`,
  PER_LESSON_PROMPT_TEMPLATE: `Buat SATU rencana pembelajaran (BUKAN rencana unit, BUKAN beberapa pelajaran) menggunakan info di bawah ini.
ANDA HARUS menghasilkan JSON valid yang cocok persis dengan skema JSON yang disediakan (LessonPlanResponse dengan satu objek "LessonPlan"). Jangan sertakan kunci tambahan apa pun. Gunakan format JSON ringkas (tanpa baris kosong tambahan).
Subject Unit: 
{{$Subject}}
Nama Unit: 
{{$Name}}
Deskripsi/Instruksi Unit: 
{{$UserPrompt}}
Tingkat Kelas: 
{{$GradeLevel}}
Durasi jam pelajaran dalam menit 
{{$ClassDuration}}
Sumber/Media yang digunakan: 
{{$MediaContext}}
Konten Unit: 
{{$ParentUnitData}}
Standar yang harus Selaras:
{{$Standards}}
Konten Pelajaran Terlampir: 
{{$AttachedLesson}}

Pertanyaan Esensial Unit (GUNAKAN INI SECARA APA ADANYA):
{{$UnitEssentialQuestions}}

Jika Pertanyaan Esensial Unit di atas kosong, hasilkan tepat 3 pertanyaan konseptual dengan mengikuti aturan berikut:
- Setiap pertanyaan HARUS berupa kalimat lengkap, tata bahasa benar, dan diakhiri tanda tanya.
- Setiap pertanyaan HARUS diawali dengan "How" atau "Why".
- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS berfokus pada gagasan umum dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus mata pelajaran.
- Pertanyaan HARUS dapat dipindahkan lintas disiplin dan berlaku di luar unit ini.

SISWA DENGAN DUKUNGAN TERINDIVIDUALISASI (HARUS hanya digunakan di dalam GuidedPractice.AccommodationsAndModifications; gunakan nama rencana siswa persis seperti tertulis):
{{$LearningPlans}}

ATURAN PENTING KONTEN:
- Jaga agar pembelajaran tetap selaras dengan fokus unit: mengembangkan dan menggunakan model untuk mendeskripsikan komposisi atom dari molekul sederhana dan/atau struktur yang lebih kompleks.
- Sertakan koneksi singkat tingkat tinggi ke DCI relevan lainnya jika sesuai, tetapi tetap pusatkan pelajaran pada pemodelan dan penalaran struktur–sifat (tanpa matematika mendalam, tanpa menyeimbangkan persamaan kecuali secara eksplisit diwajibkan oleh standar).
- Pastikan semua bagian pelajaran mencerminkan Batasan/Cakupan Pelajaran di atas; hindari memperkenalkan konsep besar baru yang termasuk dalam pelajaran lain.
- EssentialQuestions: HARUS persis sama dengan pertanyaan esensial tingkat unit (teks sama, urutan sama).
- AssessPriorKnowledge: HANYA jika LessonNumber == 1, tulis 150–250 kata dan ikuti struktur yang diwajibkan dalam deskripsi skema. Jika LessonNumber != 1, kembalikan "" (string kosong).
- DirectPresentation harus ≤10 menit total dan harus mengikuti format HOOK/INTRODUCTION/DIRECT TEACHING/GUIDED ENGAGEMENT yang diwajibkan dengan Say/Do/Ask/✅ Expected Student Responses/Write, dan respons siswa yang diharapkan sebagai poin-poin bullet (JANGAN sertakan header/judul bagian dalam string).
- GuidedPractice.InstructionsForTeachers harus minimal 700 kata dan harus memuat komponen wajib yang tercantum dalam deskripsi skema.
- GuidedPractice.AccommodationsAndModifications harus mencakup:
  - General: dukungan umum
  - IndividualSupport: array dengan tepat siswa dan rencana yang disediakan (nama/rencana sama; tidak ada siswa tambahan).
- StudentPractice HARUS menyertakan paragraf TeacherNotes yang dimulai dengan 'These tasks reinforce today’s learning about ____ by ______.', daftar 2-3 tugas dengan DOK 2-4 dan kriteria keberhasilan, serta interleaving jika mata pelajaran adalah matematika.

PERSYARATAN OUTPUT:
- Output HARUS berupa JSON valid yang cocok persis dengan skema yang disediakan.
- Output HARUS HANYA satu rencana pembelajaran.
- Tidak ada HTML. Tidak ada emoji. Tidak ada markdown. Teks biasa di dalam field string.`,
  STEP0_SCHEMA: {
  "title": "UnitPlanResponse",
  "type": "object",
  "properties": {
    "UnitDescription": {
      "type": "object",
      "properties": {
        "Description": {
          "type": "string",
          "description": "Deskripsi unit sebagai satu paragraf teks biasa yang utuh (4–5 kalimat lengkap) ditulis dengan suara guru yang alami yang bisa Anda ucapkan langsung kepada siswa. Tanpa HTML, tanpa emoji, tanpa poin-poin. Harus mengalir secara percakapan tetapi mengikuti struktur ini (tanpa judul): (1) kalimat pembuka yang memancing rasa ingin tahu atau membuat kontras yang mengejutkan, (2) kalimat 'Dalam unit ini, Anda akan...' tentang hasil penguasaan, (3) kalimat 'Anda akan memperkuat keterampilan Anda dalam...' tentang kemampuan berpikir/analisis, (4) kalimat 'Ini terhubung dengan...' tentang relevansi di dunia nyata, (5) kalimat 'Memahami hal ini penting karena...' tentang signifikansi yang lebih luas atau dampak jangka panjang."
        },
        "EssentialQuestions": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Buat pertanyaan esensial yang hanya berfokus pada konsep-konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. Jangan menyebut istilah, proses, kosakata, atau contoh yang spesifik pada mata pelajaran apa pun. Pertanyaan harus bersifat terbuka, dapat ditransfer lintas semua disiplin, dan mustahil dijawab hanya dengan mempelajari isi pelajaran atau unit. Fokus hanya pada gagasan besar, bukan materi pelajaran.",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "Bagian 'Student Learning Objectives' lengkap untuk seluruh unit ini. Setiap butir daftar harus menjadi tujuan yang jelas dan terukur yang dimulai dengan kata kerja yang terukur dan diakhiri dengan label DOK dalam tanda kurung",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}"
        },
        "StandardsAligned": {
          "type": "array",
          "description": "Daftarkan semua standar pendidikan unik yang digunakan di mana pun dalam unit ini dan pelajarannya. Jangan menambahkan standar yang tidak muncul dalam konten unit. Setiap standar harus mencakup kode standar dan deskripsi, misalnya 'MS-ESS1-1: Kembangkan dan gunakan model sistem Bumi–matahari–bulan untuk menggambarkan pola siklus fase bulan, gerhana, dan musim.",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}"
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
      "type": "array",
      "description": "Daftar kontainer pelajaran untuk unit ini (hanya kerangka). Setiap item harus tidak tumpang tindih dan dibatasi dengan jelas sehingga konten pelajaran tidak berulang antarpelajaran.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Nomor urut sebuah pelajaran. Berbasis 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Judul singkat pelajaran sebagai teks biasa."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 kalimat yang mendeskripsikan cakupan, fokus, dan batasan pelajaran untuk mencegah tumpang tindih dengan pelajaran lain."
          }
        },
        "required": [
          "lessonNumber",
          "lessonTitle",
          "lessonOutline"
        ],
        "additionalProperties": false
      },
      "x-format": false
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
        "EssentialQuestions": {
          "type": "array",
          "description": "Tempelkan semua pertanyaan esensial tingkat unit dalam urutan yang sama jika disediakan. Jika tidak disediakan, buat tepat 3 pertanyaan konseptual yang hanya berfokus pada konsep-konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. Jangan menyebut istilah, proses, kosakata, atau contoh yang spesifik pada mata pelajaran apa pun. Pertanyaan harus bersifat terbuka, dapat ditransfer lintas semua disiplin, dan mustahil dijawab hanya dengan mempelajari isi pelajaran atau unit. Fokus hanya pada gagasan besar, bukan materi pelajaran.",
          "items": {
            "type": "string"
          },
          "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}"
        },
        "KeyVocabulary": {
          "type": "array",
          "description": "Bagian 'Key Vocabulary' lengkap sebagai daftar string. Setiap string harus berupa satu istilah dengan definisi yang dipisahkan dengan tanda pisah/hyphen. Contoh: 'Gravitasi - Gaya yang menarik benda-benda satu sama lain'. Semua definisi harus singkat, sesuai usia, dan berhubungan langsung dengan konten pelajaran.",
          "items": {
            "type": "string",
            "x-format": "{index}. {value}"
          },
          "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}"
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "Bagian 'Student Learning Objectives' lengkap sebagai teks biasa. Setiap butir harus menjadi tujuan yang jelas dan terukur yang dimulai dengan kata kerja yang terukur dan diakhiri dengan label DOK dalam tanda kurung, misalnya 'Memodelkan bagaimana rotasi Bumi pada porosnya menyebabkan siang dan malam (DOK 2).'.",
          "items": {
            "type": "string",
            "x-format": "- {value}\n"
          },
          "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}"
        },
        "StandardsAligned": {
          "type": "array",
          "description": "Bagian 'Standards Aligned' lengkap untuk pelajaran ini sebagai daftar. Setiap standar harus mencakup kode standar dan deskripsi, dan kode serta deskripsi harus persis sama dengan yang digunakan dalam Unit. Misalnya 'MS-ESS1-1: Kembangkan dan gunakan model sistem Bumi–matahari–bulan untuk menggambarkan pola siklus fase bulan, gerhana, dan musim.'",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}"
        },
        "AssessPriorKnowledge": {
          "type": "object",
          "description": "Bagian Assess Prior Knowledge. HANYA Pelajaran 1 yang harus berisi blok terperinci; SEMUA PELAJARAN LAIN HARUS MENGEMBALIKAN ARRAY KOSONG untuk semua field. Untuk Pelajaran 1, struktur harus mencakup ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt, dan AlternateOptions. 1. Pastikan prompt DOK 1-3 digunakan. 2. Sertakan keterampilan prasyarat. 3. Pilih satu modalitas dan kembangkan sepenuhnya. 4. Sediakan prompt guru awal, instruksi, respons siswa yang diharapkan, prompt penutup, dan 2 opsi alternatif.",
          "properties": {
            "ActivityInstructions": {
              "type": "array",
              "description": "Langkah-langkah berurutan (misalnya 'Katakan: ...', 'Proyeksikan atau bacakan...') untuk memulai aktivitas.",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "{items}"
            },
            "ExpectedStudentResponses": {
              "type": "array",
              "description": "Jawaban yang diantisipasi atau kesalahpahaman umum untuk modalitas yang dipilih.",
              "items": {
                "type": "string",
                "x-format": "  - {value}"
              },
              "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
            },
            "ClosingTeacherPrompt": {
              "type": "array",
              "description": "Langkah dan prompt penutup guru yang memvalidasi pemikiran siswa dan mempersiapkan penyelidikan unit.",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "{items}"
            },
            "AlternateOptions": {
              "type": "array",
              "description": "2 opsi alternatif singkat yang dapat dipilih guru.",
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              },
              "x-format": "**{loc.AlternateOptions}**\n\n{items}"
            }
          },
          "required": [
            "ActivityInstructions",
            "ExpectedStudentResponses",
            "ClosingTeacherPrompt",
            "AlternateOptions"
          ],
          "additionalProperties": false,
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}"
        },
        "DirectPresentation": {
          "type": "object",
          "description": "Bagian 'Direct Presentation' lengkap. Ini adalah aktivitas pertama di kelas dan harus berlangsung TIDAK LEBIH dari 10 menit.",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Daftar bahan yang diperlukan (misalnya alat bantu visual, spidol, dll.)",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Skrip guru yang diorganisir ke dalam langkah-langkah berurutan mengikuti urutan TEPAT ini: (1) HOOK (1-2 menit), (2) INTRODUCTION (1-2 menit), (3) DIRECT TEACHING (4-5 menit), dan (4) GUIDED ENGAGEMENT (2-3 menit). Jangan menyertakan judul bagian dalam string. Setiap langkah harus mencakup ujaran guru (Katakan:/Tanyakan:), tindakan guru (Lakukan:/Tulis:/Gambar:/Tampilkan:), dan jika ada, respons siswa yang diharapkan.",
              "items": {
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Aksi guru yang spesifik, dimulai dengan 'Say: ', 'Do: ', dll."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "Jawaban yang diantisipasi jika instruksinya berupa pertanyaan. Kembalikan array kosong jika tidak berlaku.",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                  }
                },
                "required": [
                  "Instruction",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}"
              },
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
            },
            "AnticipatedMisconceptions": {
              "type": "array",
              "description": "Daftar miskonsepsi umum dan bahasa koreksi yang tepat untuk menangani masing-masing.",
              "items": {
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Deskripsi miskonsepsi."
                  },
                  "Correction": {
                    "type": "string",
                    "description": "Bahasa koreksi yang dimulai dengan 'Say: '."
                  }
                },
                "required": [
                  "Misconception",
                  "Correction"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{index}.** {value.Misconception}\n  - {value.Correction}"
              },
              "x-format": "⚠️ {loc.AnticipatedMisconceptions}\n\n{items}"
            },
            "TranscendentThinking": {
              "type": "object",
              "description": "Pertanyaan aplikasi dunia nyata yang menghubungkan pembelajaran dengan tujuan/makna/gagasan besar.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "Respons siswa yang diharapkan yang menunjukkan pemahaman yang lebih mendalam.",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "QuickCheck": {
              "type": "object",
              "description": "Pemeriksaan akhir pemahaman untuk siswa yang mempelajari tujuan pembelajaran yang sudah dinyatakan dalam pelajaran. Ini HARUS menjadi tugas individual untuk SETIAP siswa untuk diselesaikan.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "mis., 'Luangkan 2 menit untuk membuat sketsa X di buku catatanmu' atau 'Di selembar kertas coret-coret, jelaskan mengapa Y...'"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 respons siswa yang diharapkan secara spesifik.",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            }
          },
          "required": [
            "Materials",
            "InstructionsForTeachers",
            "AnticipatedMisconceptions",
            "TranscendentThinking",
            "QuickCheck"
          ],
          "additionalProperties": false,
          "x-format": "### {green}({loc.DirectPresentation})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.TranscendentThinking}\n\n{value.QuickCheck}"
        },
        "GuidedPractice": {
          "type": "object",
          "description": "Bagian Latihan Terbimbing terstruktur dengan bidang terpisah untuk materi, instruksi, diferensiasi, dan akomodasi opsional.",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Benda fisik yang diperlukan untuk aktivitas latihan terbimbing ini (mis., 'bola styrofoam, tali, spidol') diformat sebagai daftar",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Naskah guru yang diorganisasi ke dalam langkah-langkah berurutan. Setiap langkah harus menggabungkan tindakan guru dan naskah. Akhiri dengan petunjuk untuk berkeliling.",
              "items": {
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Aksi guru yang spesifik, dimulai dengan 'Say: ', 'Do: ', dll."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "Jawaban yang diantisipasi jika instruksinya berupa pertanyaan. Kembalikan array kosong jika tidak berlaku.",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                  }
                },
                "required": [
                  "Instruction",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}"
              },
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
            },
            "QuickCheck": {
              "type": "object",
              "description": "Pertanyaan pemeriksaan pemahaman akhir untuk latihan terbimbing.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 respons siswa yang diharapkan.",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "Differentiation": {
              "type": "object",
              "description": "Diberi label dengan tiga tingkat yang diberi label jelas: Pembelajar Bahasa, Siswa yang Memerlukan Dukungan Tambahan, Lebih Mendalam. Persyaratan: Konten harus membedakan pengajaran, bukan menyediakan akomodasi atau modifikasi (itu ditangani di tempat lain). Strategi harus berfokus pada cara mengajar, bukan pada cara menyederhanakan materi. Kegiatan harus bervariasi dalam kompleksitas dan kedalaman, selaras dengan tujuan pembelajaran yang sama. Setiap tingkat harus mendorong keterlibatan aktif, pengembangan bahasa, dan pemahaman konseptual. Gunakan bahasa yang jelas, berorientasi pada guru, dan buat dukungan yang realistis untuk penggunaan di kelas.",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Berikan 2-3 strategi pengajaran konkret untuk pembelajar bahasa. Contoh: menyediakan visual spesifik (mis., 'Lembar Fakta Planet'), menggunakan bingkai kalimat (mis., 'Ini ditempatkan di sini karena...'), atau meminta siswa memberi isyarat/menunjuk sebelum menjelaskan secara lisan. Fokus pada keterlibatan aktif dan pengembangan bahasa.",
                      "x-format": "{items}"
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false,
                  "x-format": "{loc.LanguageLearners}\n\n{value.Strategies}"
                },
                "AdditionalScaffolding": {
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Berikan 2-3 strategi pengajaran konkret untuk dukungan bertahap. Contoh: menyediakan organizer/template yang sudah digambar sebelumnya, menggunakan daftar periksa sederhana dengan pertanyaan panduan spesifik, atau memodelkan proses berpikir keras (mis., 'Perhatikan bagaimana saya mencocokkan...'). Fokus pada cara mengajar dan memvariasikan kompleksitas tanpa menyederhanakan materi.",
                      "x-format": "{items}"
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false,
                  "x-format": "{loc.StudentsInNeedOfAdditionalScaffolding}\n\n{value.Strategies}"
                },
                "GoDeeper": {
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Berikan 1-2 tugas pengayaan yang memperdalam pemahaman konseptual. Sertakan tantangan spesifik (misalnya, 'Sesuaikan jarak untuk menunjukkan...') atau pertanyaan tingkat tinggi (misalnya, 'Bagaimana Anda akan memodelkan... secara akurat?'). Harus selaras dengan tujuan pembelajaran yang sama.",
                      "x-format": "{items}"
                    },
                    "ExpectedStudentResponses": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Respons siswa yang diharapkan yang menunjukkan seperti apa keberhasilan. Kembalikan array kosong jika tidak berlaku.",
                      "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                    }
                  },
                  "required": [
                    "Strategies",
                    "ExpectedStudentResponses"
                  ],
                  "additionalProperties": false,
                  "x-format": "{loc.GoDeeper}\n\n{value.Strategies}\n\n{value.ExpectedStudentResponses}"
                }
              },
              "required": [
                "LanguageLearners",
                "AdditionalScaffolding",
                "GoDeeper"
              ],
              "additionalProperties": false,
              "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}"
            },
            "AccommodationsAndModifications": {
              "type": "object",
              "description": "Bagian ini harus mencakup dua jenis dukungan: Dukungan Umum dan Dukungan Individual. Fokus pada akses, bukan menurunkan tingkat rigor.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Strategi non-spesifik untuk siswa yang meningkatkan akses bagi semua peserta didik (misalnya, visual, catatan yang sudah diisi sebagian, glosarium digital, instruksi yang dipecah). Berikan 2-4 poin bullet.",
                  "x-format": "{items}"
                },
                "IndividualSupport": {
                  "type": "array",
                  "description": "Akomodasi dan modifikasi spesifik untuk siswa yang disebutkan namanya dengan rencana formal. Cantumkan SETIAP siswa secara individual; JANGAN mengelompokkan siswa bersama. Dukungan untuk setiap siswa harus berupa daftar yang mudah dipindai.",
                  "items": {
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Nama depan dan nama belakang siswa individu yang menerima dukungan ini."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "x-format": "- {value}"
                        },
                        "description": "Rencana formal yang disediakan untuk siswa ini dalam prompt. Uraikan rencana tersebut menjadi daftar yang jelas. Anda boleh memparafrasekannya untuk memperbaiki format, tetapi JANGAN menghilangkan atau menambahkan informasi apa pun."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "x-format": "- {value}"
                        },
                        "description": "Alat/kerangka kalimat/visual/pengorganisasi yang konkret untuk tugas ini.",
                        "x-format": "{items}"
                      }
                    },
                    "required": [
                      "StudentName",
                      "PlanProvided",
                      "PlanImplementation"
                    ],
                    "additionalProperties": false,
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}"
                  },
                  "x-format": "{items}"
                }
              },
              "required": [
                "General",
                "IndividualSupport"
              ],
              "additionalProperties": false,
              "x-format": "**🤝 {loc.AccommodationsAndModifications}**\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}"
            }
          },
          "required": [
            "Materials",
            "InstructionsForTeachers",
            "QuickCheck",
            "Differentiation",
            "AccommodationsAndModifications"
          ],
          "additionalProperties": false,
          "x-format": "### {green}({loc.GuidedPractice})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.QuickCheck}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}"
        },
        "IndependentPractice": {
          "type": "object",
          "description": "Bagian Latihan Mandiri Terstruktur.",
          "properties": {
            "Materials": {
              "type": "array",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Bahan yang diperlukan.",
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "Purpose": {
              "type": "string",
              "description": "Tujuan dari latihan mandiri."
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Tugas berurutan untuk latihan mandiri.",
              "items": {
                "type": "object",
                "properties": {
                  "TaskName": {
                    "type": "string"
                  },
                  "DOKLevel": {
                    "type": "string",
                    "description": "misalnya, 'DOK 3' atau 'DOK 3-4'"
                  },
                  "TeacherNotes": {
                    "type": "string",
                    "description": "Penjelasan yang menghubungkan tugas dengan presentasi/tujuan."
                  },
                  "Instruction": {
                    "type": "string",
                    "description": "Instruksi spesifik atau pernyataan 'Katakan:'."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "description": "Contoh jawaban.",
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "description": "2-4 elemen yang menunjukkan penguasaan.",
                    "x-format": "- {loc.SuccessCriteria}\n\n{items}"
                  }
                },
                "required": [
                  "TaskName",
                  "DOKLevel",
                  "TeacherNotes",
                  "Instruction",
                  "ExpectedStudentResponses",
                  "SuccessCriteria"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{loc.Task} {index}:** {value.TaskName} ({value.DOKLevel})\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}\n\n{value.SuccessCriteria}"
              },
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
            },
            "Reflection": {
              "type": "array",
              "description": "Pertanyaan regulasi diri dan transendensi.",
              "items": {
                "type": "object",
                "properties": {
                  "Question": {
                    "type": "string"
                  },
                  "ReflectionType": {
                    "type": "string",
                    "description": "misalnya, 'Regulasi Diri' atau 'Transendensi'"
                  }
                },
                "required": [
                  "Question",
                  "ReflectionType"
                ],
                "additionalProperties": false,
                "x-format": "- **{value.ReflectionType}:** {value.Question}"
              },
              "x-format": "**{loc.Reflection}**\n\n{items}"
            },
            "EarlyFinishers": {
              "type": "object",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Prompt/deskripsi tugas untuk siswa yang selesai lebih awal."
                },
                "Requirements": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Elemen spesifik yang harus dibahas siswa.",
                  "x-format": "{items}"
                },
                "Justification": {
                  "type": "string",
                  "description": "Kalimat penutup tentang penggunaan prinsip yang akurat."
                }
              },
              "required": [
                "Prompt",
                "Requirements",
                "Justification"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.EarlyFinishers}**\n\n**{loc.Prompt}:** {value.Prompt}\n\n**{loc.Requirements}:**\n{value.Requirements}\n\n**{loc.Justification}:** {value.Justification}"
            }
          },
          "required": [
            "Materials",
            "Purpose",
            "InstructionsForTeachers",
            "Reflection",
            "EarlyFinishers"
          ],
          "additionalProperties": false,
          "x-format": "### {green}({loc.IndependentPractice})\n\n{value.Materials}\n\n**{loc.Purpose}:** {value.Purpose}\n\n{value.InstructionsForTeachers}\n\n{value.Reflection}\n\n{value.EarlyFinishers}"
        },
        "ReviewAndSpacedRetrieval": {
          "type": "object",
          "description": "Bagian Tinjauan Terstruktur & Penarikan Kembali Berjarak. Aktivitas 5 menit ini memperkuat konsep sebelumnya dan menghubungkannya dengan pembelajaran saat ini.",
          "properties": {
            "Materials": {
              "type": "array",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Bahan yang diperlukan (sering kali tidak diperlukan apa pun).",
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "TeacherNotes": {
              "type": "string",
              "description": "Paragraf Catatan Guru yang menjelaskan: Bagaimana strategi tinjauan ini meningkatkan retensi, menghubungkan dengan konsep pembelajaran sebelumnya, dan bagaimana refleksi transenden memperdalam pemahaman.",
              "x-format": "**{loc.TeacherNotes}:** {value}"
            },
            "ActiveRecall": {
              "type": "object",
              "description": "Instruksi untuk Guru yang berisi prompt Active Recall.",
              "properties": {
                "Instruction": {
                  "type": "string",
                  "description": "Prompt Active Recall menggunakan berbagi dengan pasangan/kelompok. Harus menggunakan pernyataan 'Say:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Respons Siswa yang Diharapkan (2-3 contoh berpoin).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                },
                "CorrectCommonMisconceptions": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Pernyataan miskonsepsi contoh dan skrip respons guru yang menangani masing-masing (misalnya, 'Jika seorang siswa mengatakan X, tanggapi Y').",
                  "x-format": "**{loc.CorrectCommonMisconceptions}**\n\n{items}"
                }
              },
              "required": [
                "Instruction",
                "ExpectedStudentResponses",
                "CorrectCommonMisconceptions"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.ActiveRecall}**\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}\n\n{value.CorrectCommonMisconceptions}"
            },
            "EssentialQuestionConnection": {
              "type": "object",
              "description": "Kaitan dengan pertanyaan esensial unit.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Prompt guru yang menghubungkan dengan pertanyaan unit. Harus menggunakan pernyataan 'Say:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Respons Siswa yang Diharapkan (2-3 contoh).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**💭 {loc.EssentialQuestionConnection}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "TranscendentThinking": {
              "type": "object",
              "description": "Refleksi tentang penerapan di dunia nyata atau dampak yang lebih luas.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Prompt penerapan di dunia nyata. Harus menyertakan instruksi waktu berpikir (misalnya, 'Luangkan 30 detik untuk berpikir dalam diam, lalu bagikan:') dan menggunakan pernyataan 'Say:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Respons Siswa yang Diharapkan (2-3 contoh).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "SpacedRetrieval": {
              "type": "object",
              "description": "Mengingat kembali konsep pembelajaran sebelumnya yang spesifik.",
              "properties": {
                "HeaderTitle": {
                  "type": "string",
                  "description": "Rujukan yang jelas ke pelajaran sebelumnya yang spesifik (misalnya, 'Penarikan Kembali Berjarak (Bersumber dari Unit 2, Pelajaran 3)')."
                },
                "Instruction": {
                  "type": "string",
                  "description": "Pertanyaan yang menghubungkan konsep masa lalu dan saat ini. Harus menggunakan pernyataan 'Say:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Kriteria keberhasilan terperinci atau respons siswa yang diharapkan (2-3 contoh).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "HeaderTitle",
                "Instruction",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**⏳ {value.HeaderTitle}**\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}"
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
          "additionalProperties": false,
          "x-format": "### {green}({loc.ReviewAndSpacedRetrieval})\n\n{value.Materials}\n\n{value.TeacherNotes}\n\n📋 **{loc.InstructionsForTeachers}**\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.TranscendentThinking}\n\n{value.SpacedRetrieval}"
        },
        "FormativeAssessment": {
          "x-format": "### ✅ {green}({loc.FormativeAssessment})\n\n{items}",
          "type": "array",
          "description": "Tepat 4 prompt Penilaian Formatif, masing-masing untuk satu tingkat DOK.",
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
                "description": "teks pertanyaan yang tepat, misalnya, 'Mengapa planet tetap berada di orbit alih-alih terlempar ke luar angkasa?'"
              },
              "ExpectedStudentResponses": {
                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "1-2 contoh respons yang menunjukkan penguasaan (dibungkus dalam tanda kutip)."
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
          "description": "Latihan PR/di luar kelas.",
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
              "description": "Sebuah tugas refleksi untuk para siswa.",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "misalnya, 'Refleksi: Tulis 2-3 kalimat menanggapi salah satu prompt:'"
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
        "EssentialQuestions",
        "KeyVocabulary",
        "StudentLearningObjectives",
        "StandardsAligned",
        "AssessPriorKnowledge",
        "DirectPresentation",
        "GuidedPractice",
        "IndependentPractice",
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
      "GuidedPractice.AccommodationsAndModifications"
    ]
  }
},
};
