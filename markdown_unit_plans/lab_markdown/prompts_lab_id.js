window.prompts_lab_id = {
  STEP0_PROMPT_TEMPLATE: `Buatlah garis besar unit dan struktur pelajaran menggunakan info di bawah ini. Jangan menulis rencana pelajaran lengkap.
                    
Berdasarkan Unit Subject, educational standards, Unit Description/Instruction, Grade Level, Duration of class period (minutes), dan Number of Lessons yang diminta, hasilkan respons JSON yang mencakup UnitDescription yang koheren dan daftar "containers" pelajaran yang tidak saling tumpang tindih.

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
- Setiap pertanyaan WAJIB berupa kalimat lengkap dan gramatikal yang berakhir dengan tanda tanya.
- Setiap pertanyaan WAJIB diawali dengan "Bagaimana" atau "Mengapa".

- Pertanyaan WAJIB bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan WAJIB berfokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus mata pelajaran.
- Pertanyaan WAJIB dapat ditransfer lintas disiplin dan berlaku di luar unit ini.
- Pertanyaan WAJIB digunakan kembali secara verbatim di setiap pelajaran dalam unit.

Apa yang harus dihasilkan:
- Output WAJIB berupa JSON valid yang sesuai dengan skema.
- WAJIB: Isi secara lengkap semua properti di dalam objek "UnitDescription":
  - "Description": Tulis paragraf 4-5 kalimat yang menggambarkan fokus utama unit dan perjalanan naratifnya.
  - "StudentLearningObjectives": Cantumkan 3-5 tujuan belajar terukur utama untuk unit.
  - "StandardsAligned": Cantumkan semua standar yang dibahas sepanjang unit.
  - "EssentialQuestions": Tepat 3 pertanyaan konseptual yang mengikuti aturan di atas.
- HASILKAN daftar "Lessons" yang berisi tepat {{$NumberOfItems}} pelajaran.
  - Setiap pelajaran harus mencakup "lessonNumber" (indeks mulai dari 1), "lessonName", dan "lessonDescription" (2–4 kalimat yang menjelaskan cakupan pelajaran).

Batasan:
- Jaga agar unit dan setiap pelajaran tetap selaras dengan fokus unit.
- Pastikan urutan logis dari ide-ide dasar menuju pemodelan yang lebih kompleks.
- Akurasi: Semua konten harus akurat secara ilmiah dan sesuai untuk usia.

Output WAJIB berupa JSON valid yang sesuai dengan skema. Gunakan format ringkas (tanpa baris kosong tambahan).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Buat SATU rencana pelajaran LAB (BUKAN rencana unit, BUKAN beberapa pelajaran) menggunakan informasi di bawah ini.
Anda WAJIB menghasilkan JSON valid yang cocok dengan skema JSON yang disediakan secara tepat. Jangan sertakan kunci tambahan apa pun. Gunakan pemformatan JSON ringkas (tanpa baris kosong tambahan).
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
Sumber Daya/Media yang digunakan: 
{{$MediaContext}}
Konten Unit: 
{{$ParentUnitData}}
Standar yang harus diselaraskan:
{{$Standards}}
Konten Pelajaran Terlampir:
{{$AttachedLesson}}

Pertanyaan Esensial Unit (GUNAKAN INI SECARA VERBATIM):
{{$UnitEssentialQuestions}}

Jika Pertanyaan Esensial Unit di atas kosong, buat tepat 3 pertanyaan konseptual dengan mengikuti aturan berikut:
- Setiap pertanyaan HARUS berupa kalimat lengkap dan benar secara gramatikal yang diakhiri dengan tanda tanya.
- Setiap pertanyaan WAJIB diawali dengan "Bagaimana" atau "Mengapa".

- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS berfokus pada gagasan luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus mata pelajaran.
- Pertanyaan HARUS dapat ditransfer lintas disiplin dan dapat diterapkan di luar unit ini.

SISWA DENGAN DUKUNGAN INDIVIDUAL (HARUS digunakan HANYA di dalam Experiment.AccommodationsAndModifications; gunakan nama/rencana siswa persis seperti yang ditulis):
{{$LearningPlans}}

PENTINGNYA ATURAN KONTEN:
- Jaga agar pelajaran tetap selaras dengan fokus unit: mengembangkan dan menggunakan model untuk mendeskripsikan komposisi atom dari molekul sederhana dan/atau struktur yang lebih luas.
- Sertakan koneksi singkat tingkat tinggi ke DCI relevan lainnya bila sesuai, tetapi tetap pusatkan pelajaran pada pemodelan dan penalaran struktur–sifat (tanpa matematika mendalam, tanpa menyeimbangkan persamaan kecuali secara eksplisit diwajibkan oleh standar).
- Pastikan semua bagian pelajaran mencerminkan Batasan/Ruang Lingkup Pelajaran yang disediakan dalam konteks unit; hindari memperkenalkan konsep utama baru yang termasuk ke pelajaran lain.
- EssentialQuestions: HARUS persis sama dengan pertanyaan esensial tingkat unit (teks yang sama, urutan yang sama).
- AssessPriorKnowledge: HANYA jika LessonNumber == 1, tulis 150–250 kata dan ikuti struktur yang diwajibkan dalam deskripsi skema. Jika LessonNumber != 1, kembalikan "" (string kosong).
- Fase Lab (Question, Research, Hypothesize, Experiment, Analyze, Share): Ikuti persyaratan instruksional spesifik dan string "Purpose:" untuk setiap fase sebagaimana didefinisikan dalam skema JSON.
- Experiment.AccommodationsAndModifications harus memuat dukungan umum yang diikuti dukungan individual untuk setiap siswa yang disediakan dalam {{$LearningPlans}}.
- StudentPractice HARUS menyertakan paragraf TeacherNotes yang dimulai dengan 'Tugas-tugas ini memperkuat pembelajaran hari ini tentang ____ melalui ______.', daftar 2-3 tugas dengan DOK 2-4 dan kriteria keberhasilan, serta interleaving (pembelajaran berselang) (pembelajaran berselang) jika mata pelajaran adalah matematika.

PERSYARATAN OUTPUT:
- Output HARUS berupa JSON valid yang cocok dengan skema yang disediakan secara tepat.
- Output HARUS berupa HANYA satu rencana pelajaran.
- Tanpa HTML. Tanpa emoji. Tanpa markdown. Teks biasa di dalam field string.

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  STEP0_SCHEMA: {
  "title": "UnitPlanResponse",
  "type": "object",
  "properties": {
    "UnitDescription": {
      "type": "object",
      "properties": {
        "Description": {
          "x-format": false,
          "type": "string",
          "description": "Deskripsi unit sebagai satu paragraf teks biasa yang utuh dan koheren (4–5 kalimat lengkap) yang ditulis dengan suara guru yang alami dan dapat Anda ucapkan langsung kepada siswa. Tanpa HTML, tanpa emoji, tanpa poin-poin. Harus mengalir secara percakapan tetapi mengikuti struktur ini (tanpa judul): (1) kalimat pembuka yang memancing rasa ingin tahu atau membuat kontras yang mengejutkan, (2) kalimat 'Dalam unit ini, Anda akan...' tentang hasil penguasaan, (3) kalimat 'Anda akan memperkuat keterampilan Anda dalam...' tentang kemampuan berpikir/analisis, (4) kalimat 'Ini terhubung dengan...' tentang relevansi dunia nyata, (5) kalimat 'Memahami ini penting karena...' tentang makna yang lebih luas atau dampak jangka panjang."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Buat pertanyaan esensial yang hanya berfokus pada konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. Jangan sebutkan istilah, proses, kosakata, atau contoh yang spesifik pada mata pelajaran apa pun. Pertanyaan harus terbuka, dapat dipindahkan lintas disiplin, dan mustahil dijawab hanya dengan mempelajari pelajaran atau konten unit. Fokus hanya pada ide-ide besar, bukan materi pelajaran.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Bagian lengkap 'Tujuan Pembelajaran Siswa' untuk seluruh unit ini. Setiap butir daftar harus menjadi tujuan yang jelas dan terukur yang dimulai dengan kata kerja terukur dan diakhiri dengan label DOK dalam tanda kurung",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Daftar semua standar pendidikan unik yang digunakan di seluruh unit ini dan pelajarannya. Jangan tambahkan standar yang tidak muncul dalam konten unit. Setiap standar harus mencakup kode standar dan deskripsi, misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem bumi–matahari–bulan untuk menggambarkan pola siklik fase bulan, gerhana, dan musim.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Bagian lengkap 'Kosakata Kunci' sebagai daftar string. Setiap string harus berupa satu istilah dengan definisi yang dipisahkan oleh tanda hubung/strip. Contoh: 'Gravitasi - Gaya yang menarik benda-benda satu sama lain'. Semua definisi harus singkat, sesuai usia, dan langsung terkait dengan konten pelajaran.",
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
        "StandardsAligned",
        "KeyVocabulary"
      ],
      "additionalProperties": false
    },
    "Lessons": {
      "x-format": false,
      "type": "array",
      "description": "Daftar kontainer pelajaran untuk unit ini (hanya garis besar). Setiap item harus tidak saling tumpang tindih dan dibatasi dengan jelas agar konten pelajaran tidak berulang antar pelajaran.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Nomor urutan sebuah pelajaran. Berbasis 1."
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
  "title": "LabUnitPlanResponse",
  "type": "object",
  "properties": {
    "EssentialQuestions": {
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Tempelkan semua pertanyaan esensial yang dihasilkan di tingkat unit dalam urutan yang sama.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Bagian lengkap 'Tujuan Pembelajaran Siswa' sebagai teks biasa. Setiap butir harus menjadi tujuan yang jelas dan terukur yang dimulai dengan kata kerja terukur dan diakhiri dengan label DOK dalam tanda kurung, misalnya 'Memodelkan bagaimana rotasi Bumi pada porosnya menyebabkan siang dan malam (DOK 2).'",
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
      "description": "Bagian lengkap 'Standar Selaras' sebagai teks biasa untuk pelajaran ini. Setiap standar harus mencakup kode standar dan deskripsi, dan kode serta deskripsi harus persis sama dengan yang digunakan dalam Unit. misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem bumi–matahari–bulan untuk menggambarkan pola siklik fase bulan, gerhana, dan musim.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Pilih secara verbatim kosakata kunci untuk pelajaran ini dari kosakata tingkat unit yang diberikan dalam prompt. Jangan menciptakan kata baru. Anda harus menggunakan kembali kata-kata persis dari Step 0 UnitDescription.KeyVocabulary.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Bagian Menilai Pengetahuan Awal. HANYA Pelajaran 1 yang boleh berisi blok terperinci; SEMUA PELAJARAN LAIN HARUS MENGEMBALIKAN NULL atau menghilangkan bidang ini. Untuk Pelajaran 1, struktur harus mencakup: 1. Sertakan bagian ini hanya pada pelajaran pertama unit. 2. Pastikan prompt DOK 1-3 digunakan. 3. Sertakan keterampilan prasyarat yang dibutuhkan untuk tujuan pembelajaran siswa. 4. Pilih satu moda dari daftar ini dan kembangkan sepenuhnya: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Prompt guru awal dengan pernyataan 'Katakan:'. 6. Instruksi yang jelas dan template/struktur untuk moda yang dipilih. 7. Bagian 'Respons Siswa yang Diharapkan'. 8. Prompt guru penutup 'Katakan:'. 9. Setelah mengembangkan sepenuhnya satu moda, berikan 2 opsi alternatif singkat.",
      "properties": {
        "ActivityInstructions": {
          "type": "string",
          "description": "Instruksi yang jelas dan template/struktur untuk moda yang dipilih. Misalnya 'Katakan: \"Sebelum kita mulai...\"'"
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "description": "Antisipasi jawaban atau miskonsepsi umum untuk moda yang dipilih.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "ClosingTeacherPrompt": {
          "type": "string",
          "description": "Prompt guru penutup 'Katakan:' yang memvalidasi pemikiran siswa dan mempratinjau penyelidikan unit."
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
    "Question": {
      "x-format": "### {green}({loc.LabQuestionTitle})\n\n**{loc.Purpose}:** {loc.LabQuestionPurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Panduan guru agar siswa mengamati suatu fenomena, mengidentifikasi sesuatu yang membingungkan, dan menghasilkan pertanyaan bermakna yang akan memandu penyelidikan.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Kata demi Kata - Tujuan: Mengamati suatu fenomena, mengidentifikasi sesuatu yang membingungkan, dan menghasilkan pertanyaan bermakna yang akan memandu penyelidikan."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Daftar bahan yang diperlukan (misalnya alat bantu visual, spidol, dll.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}\n\n{value.FinalInvestigationQuestion}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Instruksi guru langkah demi langkah, tindakan, dan ajakan 'Katakan:' untuk menyajikan suatu fenomena dan mengundang pertanyaan."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 pertanyaan atau ide siswa yang diharapkan tentang fenomena tersebut."
            },
            "FinalInvestigationQuestion": {
              "type": "string",
              "description": "Langkah terakhir dalam instruksi guru. Awali string ini dengan nomor berurutan berikutnya setelah instruksi sebelumnya (misalnya, '8. Langkah Akhir: Katakan: ...') dan nyatakan pertanyaan besar yang akan diselidiki hari ini."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses",
            "FinalInvestigationQuestion"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Research": {
      "x-format": "### {green}({loc.LabResearchTitle})\n\n**{loc.Purpose}:** {loc.LabResearchPurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Panduan bagi guru agar siswa mempelajari informasi latar belakang, kosakata, dan pengetahuan awal yang diperlukan untuk memahami topik.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Kata demi kata: Tujuan: Mengumpulkan informasi latar belakang, kosakata, dan pengetahuan awal yang diperlukan untuk memahami topik dan mempersiapkan penyelidikan yang terinformasi."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Daftar bahan yang diperlukan (misalnya alat bantu visual, spidol, dll.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.AnticipatedMisconceptions}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Instruksi guru langkah demi langkah, tindakan, dan ajakan 'Katakan:' untuk menjelaskan pengetahuan latar belakang, kosakata, dan memodelkan fenomena."
            },
            "AnticipatedMisconceptions": {
              "x-format": "⚠️ {loc.AnticipatedMisconceptions}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponseLabel}: {value.TeacherResponse}",
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Kesalahpahaman siswa"
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Apa yang seharusnya dikatakan guru untuk mengoreksinya"
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "Instructions",
            "AnticipatedMisconceptions"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Hypothesize": {
      "x-format": "### {green}({loc.LabHypothesizeTitle})\n\n**{loc.Purpose}:** {loc.LabHypothesizePurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Panduan bagi guru agar siswa mengembangkan prediksi yang dapat diuji.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Kata demi Kata: Tujuan: Mengembangkan prediksi atau klaim yang dapat diuji berdasarkan penelitian dan penalaran mereka, sehingga menetapkan harapan yang jelas tentang apa yang mereka yakini akan terjadi."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Instruksi guru. Sertakan ajakan 'Katakan:'. Berikan instruksi spesifik seperti 'Tulis di papan:' diikuti oleh daftar berpoin markdown berisi 4-5 kerangka kalimat hipotesis."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 contoh hipotesis yang diharapkan."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Experiment": {
      "x-format": "### {green}({loc.LabExperimentTitle})\n\n**{loc.Purpose}:** {loc.LabExperimentPurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Panduan bagi guru agar siswa melakukan penyelidikan terstruktur.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Kata demi kata: Tujuan: Melakukan penyelidikan terstruktur—secara langsung, tersimulasikan, atau analitis—untuk menguji hipotesis mereka dan mengumpulkan bukti melalui pengamatan atau pengukuran."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.QuickCheck}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Instruksi guru langkah demi langkah untuk mengorganisasi eksperimen, memberi arahan, dan berkeliling."
            },
            "QuickCheck": {
              "x-format": "✔️**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "properties": {
                "Question": {
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
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "Differentiation": {
              "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "type": "object",
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
              "description": "Bagian ini harus mencakup dua jenis dukungan: Dukungan Umum dan Dukungan Individual. Fokus pada akses, bukan menurunkan tingkat rigor.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Strategi non-spesifik untuk siswa yang meningkatkan akses bagi semua pembelajar (misalnya, visual, catatan yang telah diisi sebelumnya, glosarium digital, instruksi yang dipecah-pecah). Berikan 2-4 poin berpoin."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Akomodasi dan modifikasi khusus untuk siswa yang disebutkan namanya dengan rencana formal. Cantumkan SETIAP siswa secara individual; jangan kelompokkan siswa bersama. Dukungan untuk setiap siswa harus berupa daftar yang mudah dipindai.",
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
                        "description": "Rencana formal yang diberikan untuk siswa ini dalam prompt. Uraikan rencana menjadi daftar yang jelas. Anda boleh memparafrasekannya untuk memperbaiki format, tetapi jangan menghilangkan atau menambahkan informasi apa pun."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Alat/kalimat pembuka/visual/organizer yang konkret untuk tugas ini."
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
            "Instructions",
            "QuickCheck",
            "Differentiation",
            "AccommodationsAndModifications"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Analyze": {
      "x-format": "### {green}({loc.LabAnalyzeTitle})\n\n**{loc.Purpose}:** {loc.LabAnalyzePurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Bimbing guru agar siswa menafsirkan data yang mereka kumpulkan.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Tujuan: Menafsirkan data yang mereka kumpulkan, mengidentifikasi pola, mengevaluasi hipotesis mereka, dan menyusun kesimpulan berbasis bukti."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Daftar materi yang diperlukan (mis., alat bantu visual, spidol, dll.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "type": "object",
                "x-format": "\n\n**{index}.** {value.Step}\n{value.Bullets}",
                "properties": {
                  "Step": {
                    "type": "string",
                    "description": "Teks instruksi guru (mis., 'Berikan kalimat pembuka:'). Jangan sertakan penomoran; itu ditangani secara otomatis."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Poin-poin opsional. Anda HARUS menyediakan daftar 4-5 kalimat pembuka ketika langkah meminta itu. Anda HARUS menyediakan daftar 4-5 prompt berkeliling ketika langkah meminta itu. Jika tidak, berikan array kosong."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Instruksi guru langkah demi langkah. Anda HARUS menyertakan tepat satu langkah khusus untuk kalimat pembuka dan mengisi array 'Bullets'-nya. Anda HARUS menyertakan tepat satu langkah khusus untuk prompt berkeliling dan mengisi array 'Bullets'-nya."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Jawaban yang diharapkan atau penyelesaian bingkai kalimat dari siswa."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Share": {
      "x-format": "### {green}({loc.LabShareTitle})\n\n**{loc.Purpose}:** {loc.LabSharePurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Bimbing guru agar siswa mengomunikasikan temuan mereka dengan jelas.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Kata demi kata: Tujuan: Mengomunikasikan temuan mereka dengan jelas kepada orang lain, menggunakan bukti untuk menjelaskan apa yang mereka temukan, mengapa hal itu penting, dan bagaimana hal itu berkontribusi pada pemahaman yang lebih mendalam."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "type": "object",
                "x-format": "\n\n**{index}.** {value.Step}\n{value.Bullets}",
                "properties": {
                  "Step": {
                    "type": "string",
                    "description": "Teks instruksi guru (mis., 'Tulis di papan:'). Jangan sertakan penomoran; itu ditangani secara otomatis."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Poin-poin opsional. Anda HARUS menyediakan daftar 4-5 poin ketika langkah menyediakan struktur untuk berbagi. Anda HARUS menyediakan daftar 4-5 pertanyaan guru ketika langkah memintanya. Jika tidak, berikan array kosong."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Instruksi guru langkah demi langkah. Anda HARUS menyertakan tepat satu langkah khusus untuk menyediakan struktur untuk berbagi dan mengisi array 'Bullets'-nya. Anda HARUS menyertakan tepat satu langkah khusus untuk pertanyaan guru dan mengisi array 'Bullets'-nya."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Gagasan inti yang dibagikan oleh siswa."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "ReviewAndSpacedRetrieval": {
      "x-format": "### 🧠 {green}({loc.ReviewAndSpacedRetrieval})\n\n{loc.ReviewAndSpacedRetrievalLabNotes}\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.TranscendentThinking}\n\n{value.SpacedRetrieval}",
      "type": "object",
      "description": "Seluruh bagian 'Review & Spaced Retrieval'.",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Meminta siswa mengingat pembelajaran BARU dari pelajaran HARI INI.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Prompt guru yang dimulai dengan 'Katakan: '"
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
          "description": "Prompt guru yang menghubungkan ke pertanyaan unit.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Prompt guru yang dimulai dengan 'Katakan: '."
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
        "TranscendentThinking": {
          "x-format": "🌍 **{loc.TranscendentThinking}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Meminta siswa menghubungkan pembelajaran dengan skenario dunia nyata lainnya.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Prompt guru yang dimulai dengan 'Katakan: '."
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
          "description": "Mengingat kembali dari pelajaran/unit sebelumnya yang spesifik.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Kalimat konteks seperti 'Lebih awal dalam pelajaran ini, siswa mempelajari...'"
            },
            "Say": {
              "type": "string",
              "description": "Prompt guru yang dimulai dengan 'Katakan: '."
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
            "description": "mis., 'Prompt 1 (DOK 1)'"
          },
          "Question": {
            "type": "string",
            "description": "Teks pertanyaan yang persis sama."
          },
          "ExpectedStudentResponses": {
            "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1-2 respons contoh yang menunjukkan penguasaan."
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
      "x-format": "### 🖊️ {green}({loc.StudentPractice})\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.PracticeTasks}\n\n{value.Reflection}",
      "type": "object",
      "description": "Latihan PR/di luar kelas.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Catatan guru yang menjelaskan bagaimana tugas latihan ini memperkuat pembelajaran hari ini dan memperkuat retensi jangka panjang."
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
                "description": "mis., '(DOK 2) Malam ini, keluarlah dan tulis 3-4 kalimat...'"
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
              "description": "mis., 'Refleksi: Tulis 2-3 kalimat sebagai respons terhadap satu prompt:'"
            },
            "ReflectionOptions": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Tepat 4 opsi pertanyaan refleksi."
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
    "StudentLearningObjectives",
    "StandardsAligned",
    "KeyVocabulary",
    "AssessPriorKnowledge",
    "Question",
    "Research",
    "Hypothesize",
    "Experiment",
    "Analyze",
    "Share",
    "ReviewAndSpacedRetrieval",
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
