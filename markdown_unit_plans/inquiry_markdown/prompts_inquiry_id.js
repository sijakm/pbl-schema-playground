window.prompts_inquiry_id = {
  STEP0_PROMPT_TEMPLATE: `Buat HANYA kerangka unit INKUIRI (Langkah 0) menggunakan informasi di bawah ini. Jangan buat rencana unit lengkap dan jangan tulis rencana pelajaran lengkap.

Anda HARUS menghasilkan JSON valid yang sesuai dengan skema JSON yang disediakan secara persis: UnitPlanResponse. Jangan sertakan kunci tambahan apa pun. Gunakan format JSON ringkas (tanpa baris kosong tambahan atau spasi berlebih di antara properti JSON). Tanpa HTML. Tanpa emoji. Teks biasa di dalam field string.

Mata Pelajaran Unit: {{$Subject}}
Nama Unit: {{$Name}}
Deskripsi/Instruksi Unit: {{$UserPrompt}}
Tingkat Kelas: {{$GradeLevel}}
Durasi periode kelas dalam menit: {{$ClassDuration}}
Jumlah Pelajaran yang Diminta: {{$NumberOfItems}}
Standar yang Harus Selaras (gunakan apa adanya jika ada; jangan tambahkan standar baru): {{$Standards}}
Siswa dengan dukungan individual (hanya konteks): {{$LearningPlans}}
Sumber Daya/Media yang akan digunakan: {{$MediaContext}}
Konten Unit: {{$AttachedUnit}}
Konten Pelajaran Terlampir (jika ada): {{$AttachedLesson}}

PERSYARATAN KERANGKA INKUIRI:
- Ini berbasis inkuiri terlebih dahulu. Pelajaran HARUS berkembang melalui alur ini:
  (1) fenomena/pengalaman + memperhatikan/bertanya-tanya,
  (2) memilih pertanyaan + merencanakan penyelidikan,
  (3) pengumpulan bukti + menemukan pola,
  (4) membangun model + revisi menggunakan bukti,
  (5) penjelasan/argumen + komunikasi + transfer.
- Pertahankan sensemaking melalui penemuan: siswa membangun dan merevisi model menggunakan pengamatan dan data sederhana; tekankan bukti, penalaran, dan komunikasi.
- Tetap selaras HANYA dengan standar yang disediakan. Jangan tambahkan standar atau kerangka kerja baru.
- Relevansi budaya & inklusi: sertakan konteks atau perspektif singkat yang relevan dengan komunitas tanpa stereotip.
- Interleaving & transfer: tinjau kembali keterampilan di seluruh pelajaran (mengamati, memodelkan, berargumen dari bukti, berkomunikasi).
- Pelajaran HARUS tidak tumpang tindih dan memiliki batas yang jelas.

KETENTUAN ARRAY PELAJARAN:
- Array Lessons HARUS berisi tepat {{$NumberOfItems}} pelajaran.
- lessonNumber berbasis 1 dan meningkat secara ketat sebesar 1.
- Pastikan urutan logis dari langkah inkuiri dasar menuju pemodelan dan penjelasan yang lebih kompleks.
- Pengaturan waktu harus sesuai dengan periode kelas {{$ClassDuration}} menit di kelas {{$GradeLevel}}.

ATURAN KELUARAN:
Kembalikan HANYA JSON yang valid terhadap skema UnitPlanResponse.

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Buat SATU rencana pembelajaran inkuiri (BUKAN rencana unit, BUKAN beberapa pelajaran) menggunakan informasi di bawah ini. Anda HARUS menghasilkan JSON valid yang cocok persis dengan skema JSON yang disediakan: InquiryUnitPlanResponse. Jangan sertakan kunci tambahan apa pun. Gunakan format JSON yang ringkas (tanpa baris kosong tambahan atau spasi di antara properti JSON). Tanpa HTML. Tanpa emoji. Tanpa markdown. Teks biasa di dalam bidang string.

Mata Pelajaran Unit: {{$Subject}}
Nama Unit: {{$Name}}
Deskripsi/Instruksi Unit: {{$UserPrompt}}
Tingkat Kelas: {{$GradeLevel}}
Durasi jam pelajaran dalam menit: {{$ClassDuration}}
Standar yang Harus Disejajarkan (gunakan secara verbatim jika ada; JANGAN menambahkan standar baru): {{$Standards}}
Siswa dengan dukungan individual (HARUS digunakan HANYA di dalam InvestigationPhase.AccommodationsAndModifications; gunakan nama/rencana siswa persis seperti yang tertulis): {{$LearningPlans}}
Sumber/Media yang digunakan: {{$MediaContext}}
Konten Unit: {{$AttachedUnit}}

Elemen Unit dan Pelajaran dari Langkah 0 (gunakan verbatim):
{{$ParentUnitData}}
- UnitDescription.EssentialQuestions (persis seperti yang diberikan; gunakan kembali verbatim jika relevan): {{$UnitEssentialQuestions}}

Konten Pelajaran Terlampir (jika ada): {{$AttachedLesson}}

PERSYARATAN ALUR PELAJARAN INKUIRI:
- Pelajaran ini harus mengikuti alur inkuiri dan selaras dengan batasan kerangka pelajaran: Orientasi → Konseptualisasi → Investigasi → Kesimpulan → Diskusi.
- Pertahankan proses pemaknaan melalui penemuan: siswa membangun dan merevisi ide melalui pengamatan dan data sederhana; tekankan bukti, penalaran, dan komunikasi.
- Relevansi budaya & inklusi: sertakan konteks atau perspektif yang relevan dengan komunitas secara singkat tanpa stereotip.
- JANGAN memperkenalkan konsep besar baru yang menjadi bagian dari pelajaran lain; tetap berada dalam cakupan dan batasan kerangka pelajaran ini.
- Tetap selaras HANYA dengan standar yang disediakan. JANGAN menambahkan standar atau kerangka kerja baru apa pun.
- Tindakan guru harus membimbing cara berpikir tanpa memberikan penjelasan ilmiah secara langsung.

ATURAN SPESIFIK BIDANG (petakan ke skema):
- AssessPriorKnowledge: HANYA jika nomor pelajaran adalah 1, tulis 150–250 kata dan ikuti struktur yang diwajibkan dalam deskripsi skema; selain itu kembalikan "".
- InvestigationPhase.AccommodationsAndModifications:
  - General: sertakan dukungan umum.
  - IndividualSupport: array harus mencantumkan tepat siswa dan rencana yang diberikan (nama/rencana sama persis; tidak ada siswa tambahan; tidak ada siswa yang terlewat).

ATURAN OUTPUT:
Kembalikan HANYA JSON yang valid sesuai dengan skema InquiryUnitPlanResponse.

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
          "description": "Deskripsi unit sebagai satu paragraf teks biasa yang utuh (4–5 kalimat lengkap) ditulis dengan suara guru yang natural dan bisa Anda sampaikan langsung kepada siswa. Tanpa HTML, tanpa emoji, tanpa poin-poin. Harus mengalir secara percakapan tetapi mengikuti struktur ini (tanpa judul): (1) kalimat pembuka yang memancing rasa ingin tahu atau membuat kontras yang mengejutkan, (2) kalimat 'Dalam unit ini, Anda akan...' tentang hasil penguasaan, (3) kalimat 'Anda akan memperkuat keterampilan Anda dalam...' tentang kemampuan berpikir/analisis, (4) kalimat 'Ini terhubung dengan...' tentang relevansi dunia nyata, (5) kalimat 'Memahami ini penting karena...' tentang signifikansi yang lebih luas atau dampak jangka panjang."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Buat pertanyaan esensial yang hanya berfokus pada konsep-konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. Jangan menyebut istilah, proses, kosakata, atau contoh yang spesifik pada mata pelajaran apa pun. Pertanyaan harus terbuka, dapat dipindahkan lintas semua disiplin, dan mustahil dijawab hanya dengan mempelajari pelajaran atau isi unit. Fokus hanya pada ide-ide besar, bukan materi pelajaran.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Bagian 'Student Learning Objectives' lengkap untuk seluruh unit ini. Setiap item daftar harus merupakan tujuan yang jelas dan terukur yang dimulai dengan kata kerja terukur dan diakhiri dengan label DOK dalam tanda kurung",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Daftar semua standar pendidikan unik yang digunakan di mana pun dalam unit ini dan pelajarannya. Jangan menambahkan standar yang tidak muncul dalam konten unit. Setiap standar harus mencakup kode standar dan deskripsi, misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem bumi–matahari–bulan untuk mendeskripsikan pola siklik fase bulan, gerhana, dan musim.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Bagian 'Key Vocabulary' lengkap sebagai daftar string. Setiap string harus berupa satu istilah dengan definisi yang dipisahkan oleh tanda hubung. Contoh: 'Gravitasi - Gaya yang menarik benda-benda satu sama lain'. Semua definisi harus singkat, sesuai usia, dan berhubungan langsung dengan konten pelajaran.",
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
      "description": "Daftar container pelajaran untuk unit ini (hanya kerangka). Setiap item harus tidak saling tumpang tindih dan ruang lingkupnya harus jelas agar konten pelajaran tidak berulang antar pelajaran.",
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
            "description": "2–4 kalimat yang mendeskripsikan cakupan, fokus, dan batasan pelajaran untuk mencegah tumpang tindih dengan pelajaran lain."
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
  "title": "InquiryUnitPlanResponse",
  "type": "object",
  "x-format": "{value.AssessPriorKnowledge}\n\n{value.EssentialQuestions}\n\n{value.KeyVocabulary}\n\n{value.StudentLearningObjectives}\n\n{value.StandardsAligned}\n\n{value.OrientationPhase}\n\n{value.ConceptualizationPhase}\n\n{value.InvestigationPhase}\n\n{value.ConclusionPhase}\n\n{value.DiscussionPhase}\n\n{value.ReviewAndSpacedRetrieval}\n\n{value.FormativeAssessment}\n\n{value.StudentPractice}",
  "properties": {
    "AssessPriorKnowledge": {
      "x-format": "### 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Bagian Assess Prior Knowledge. HANYA Pelajaran 1 yang harus berisi blok rinci; SEMUA PELAJARAN LAIN HARUS MENGEMBALIKAN NULL atau menghilangkan field ini. Untuk Pelajaran 1, strukturnya harus mencakup ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt, dan AlternateOptions.",
      "properties": {
        "ActivityInstructions": {
          "type": "string",
          "description": "Instruksi dan struktur/template yang jelas untuk modalitas yang dipilih. Contoh: 'Ucapkan: \"Sebelum kita membangun...\"'"
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "description": "Jawaban yang diantisipasi atau kesalahpahaman umum untuk modalitas yang dipilih.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "ClosingTeacherPrompt": {
          "type": "string",
          "description": "Prompt penutup guru (jangan sertakan awalan 'Ucapkan:') yang memvalidasi pemikiran siswa dan mempratinjau penyelidikan unit."
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
    "EssentialQuestions": {
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Tempel saja semua pertanyaan esensial tingkat unit dalam urutan yang sama jika disediakan. Jika tidak, hasilkan tepat 3 pertanyaan konseptual yang hanya berfokus pada konsep-konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. Jangan menyebut istilah, proses, kosakata, atau contoh spesifik pada mata pelajaran apa pun. Pertanyaan harus terbuka, dapat dipindahkan lintas semua disiplin, dan mustahil dijawab hanya dengan mempelajari pelajaran atau isi unit. Fokus hanya pada ide-ide besar, bukan materi pelajarannya.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Pilih secara verbatim kosakata kunci untuk pelajaran ini dari kosakata tingkat unit yang diberikan dalam prompt. Jangan menciptakan kata baru. Anda harus menggunakan kembali kata-kata yang persis dari Step 0 UnitDescription.KeyVocabulary.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Pilih secara verbatim tujuan pembelajaran siswa spesifik untuk pelajaran ini dari tujuan tingkat unit yang diberikan dalam prompt. Jangan menciptakan tujuan baru. Anda harus menggunakan kembali kata-kata yang persis dari Step 0 UnitDescription.StudentLearningObjectives.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StandardsAligned": {
      "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
      "type": "array",
      "description": "Daftar hanya standar pendidikan unik yang dibahas dalam pelajaran spesifik ini. Setiap standar harus mencakup kode standar dan deskripsi dan harus sama persis seperti yang digunakan dalam Unit. misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem bumi–matahari–bulan untuk mendeskripsikan pola siklik fase bulan, gerhana, dan musim.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "OrientationPhase": {
      "x-format": "### {green}({loc.OrientationPhase})\n\n{loc.OrientationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Daftar materi yang diperlukan (misalnya, alat bantu visual, spidol, dll.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "Engage": {
              "type": "object",
              "x-format": "**{loc.EngageTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Buat skrip untuk memperkenalkan fenomena. Pastikan fokusnya pada memancing rasa ingin tahu tanpa memberikan penjelasan ilmiah."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Hasilkan 2-3 langkah pedagogis spesifik yang memandu observasi diam dan berbagi dengan pasangan. Sertakan skrip (jangan sertakan awalan 'Ucapkan: ', misalnya, 'Luangkan 30 detik untuk melihat dengan diam...'). Fokus pada menangkap dan mengorganisasi observasi siswa ke dalam kategori yang bermakna dan mendorong berbagai perspektif.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Hasilkan 2-3 prompt spesifik sebagai satu string untuk membantu siswa mengidentifikasi detail, melihat pola, dan memunculkan pertanyaan awal. Dorong mereka untuk menjelaskan mengapa detail tertentu terasa penting dan untuk membangun atau membandingkan observasi satu sama lain."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "Connect": {
              "type": "object",
              "x-format": "**{loc.ConnectTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Buat skrip guru yang spesifik (jangan sertakan awalan 'Ucapkan:') yang membantu siswa mengubah observasi mereka tentang fenomena menjadi pertanyaan penelitian atau masalah sambil mengelompokkan ide-ide ke dalam tema-tema kunci."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Berikan 2-3 prompt spesifik untuk membantu siswa menghubungkan observasi dengan tantangan yang mendasari, membenarkan pemikiran dengan bukti, dan memprioritaskan ide mana yang paling layak diteliti."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Sarankan 2-3 langkah untuk mendukung siswa dalam menyempurnakan dan mengelompokkan ide-ide mereka, sambil mendorong mereka menjelaskan alasan mereka. Sertakan instruksi untuk mencatat dan menyorot pertanyaan berulang tanpa menjawabnya.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves"
              ],
              "additionalProperties": false
            },
            "Activate": {
              "type": "object",
              "x-format": "**{loc.ActivateTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Kembangkan instruksi yang dipimpin guru (jangan sertakan awalan 'Ucapkan:') untuk memfasilitasi diskusi pasangan atau kelompok yang menghasilkan ide, penjelasan, atau solusi spesifik menggunakan informasi dan batasan yang tersedia. Dorong perbandingan dan penalaran."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Daftar 2-3 prompt untuk mendorong siswa mengusulkan ide, menjelaskan alasan, mempertimbangkan pendekatan alternatif, dan mengevaluasi bagian mana dari pemikiran mereka yang paling kuat atau paling tidak pasti."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Jelaskan 2-3 langkah sirkulasi untuk mendengarkan penalaran, mendorong kejelasan/pembenaran, dan menyoroti pendekatan yang beragam tanpa mengevaluasi mana yang benar.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves"
              ],
              "additionalProperties": false
            },
            "Probe": {
              "type": "object",
              "x-format": "**{loc.ProbeTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}\n\n{value.Closing}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Buat skrip untuk mendorong siswa menyempurnakan dan menguji ide mereka dengan memeriksa asumsi, mempertimbangkan kondisi berbeda, dan mengidentifikasi faktor-faktor kunci dari pelajaran ini."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Sarankan 2-3 prompt spesifik untuk menguji ide terhadap kondisi baru, mengidentifikasi kelemahan, dan merevisi pemikiran menggunakan bukti untuk fenomena pelajaran ini."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Berikan 2-3 langkah spesifik untuk mendorong siswa meninjau kembali dan merevisi ide awal mereka berdasarkan bukti dan membenarkan perubahan dalam pemikiran mereka.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Closing": {
                  "type": "string",
                  "description": "Instruksi akhir untuk mendorong siswa menguji dan merevisi ide mereka, mempertimbangkan efek jangka panjang dan kondisi yang berubah, serta menggunakan bukti dari observasi untuk memperkuat atau menantang pemikiran mereka."
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves",
                "Closing"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "Engage",
            "Connect",
            "Activate",
            "Probe"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "ConceptualizationPhase": {
      "x-format": "### {green}({loc.ConceptualizationPhase})\n\n{loc.ConceptualizationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Daftar materi yang diperlukan (misalnya, alat bantu visual, spidol, dll.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "GuideQuestionGeneration": {
              "type": "object",
              "x-format": "**{loc.GuideQuestionGenerationTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Buat skrip guru (jangan sertakan awalan 'Ucapkan:') untuk memperkenalkan sesi brainstorming pertanyaan. Fokus pada perpindahan dari berbagi secara individual ke berbagi berpasangan untuk memperluas ide."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Hasilkan 2-3 langkah spesifik untuk mendukung generasi pertanyaan oleh siswa. Sertakan memberi waktu berpikir, mencatat semua pertanyaan secara publik, dan mendorong siswa menyempurnakan, menggabungkan, atau memperluas pertanyaan tanpa evaluasi yang menghakimi.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Hasilkan 2-3 prompt spesifik untuk membantu siswa memunculkan rasa ingin tahu, mengidentifikasi apa yang ingin mereka pahami, dan berfokus pada aspek-aspek kunci dari sistem atau desain."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "IdentifyResearchQuestion": {
              "type": "object",
              "x-format": "**{loc.IdentifyResearchQuestionTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Buat skrip (jangan sertakan awalan 'Ucapkan:') untuk membimbing siswa dalam memilih pertanyaan yang akan membantu mereka belajar paling banyak dari model yang dapat diuji."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Sarankan 2-3 langkah untuk membimbing siswa dalam mengurutkan pertanyaan ke dalam tema-tema dan membandingkan ide berdasarkan keterujian. Sertakan langkah untuk mendukung siswa menyempurnakan pertanyaan luas menjadi penyelidikan yang jelas dengan mengidentifikasi variabel.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Hasilkan 2-3 prompt untuk membantu siswa mengevaluasi pertanyaan berdasarkan keterujian, kejelasan, fokus pada variabel, dan potensi menghasilkan bukti yang berguna."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CreateAnActionPlan": {
              "type": "object",
              "x-format": "**{loc.CreateAnActionPlanTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Buatlah sebuah skrip (jangan sertakan awalan 'Say:') untuk meminta siswa mendefinisikan apa yang akan mereka amati, ubah, dan kumpulkan sebagai bukti."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Jelaskan 2-3 langkah untuk mendukung siswa dalam merancang rencana investigasi dan mengidentifikasi variabel. Sertakan langkah-langkah untuk mendorong siswa membuat rencana yang spesifik dan dapat diuji, serta pastikan mereka memiliki cara yang jelas untuk menentukan keberhasilan.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Berikan 2-3 pertanyaan spesifik untuk membantu siswa memperjelas apa yang akan mereka ubah, pertahankan tetap sama, dan bagaimana mereka akan membandingkan hasilnya."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "GuideQuestionGeneration",
            "IdentifyResearchQuestion",
            "CreateAnActionPlan"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "InvestigationPhase": {
      "x-format": "### {green}({loc.InvestigationPhase})\n\n{loc.InvestigationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}\n\n{value.QuickCheck}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Daftar bahan yang diperlukan (mis. alat bantu visual, spidol, dll.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "LaunchInvestigation": {
              "type": "object",
              "x-format": "**{loc.LaunchTheInvestigationTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Buat instruksi guru untuk memperkenalkan situasi atau model yang membingungkan. Pertama berikan tindakan dalam tanda kurung seperti [Tampilkan model, situasi, demonstrasi, atau cerita pendek yang berisi kekeliruan, ketidakefisienan, atau hasil yang tidak terduga untuk memicu rasa ingin tahu], lalu berikan skrip percakapan (jangan sertakan awalan 'Say:')."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Hasilkan 2-3 langkah untuk memandu peluncuran. Nyatakan tindakan pembelajaran dengan jelas tanpa memberi awalan 'Say:'. Sertakan memberi siswa waktu untuk mengamati sebelum bertindak, mendorong berbagai penafsiran, dan menegaskan bahwa mungkin ada banyak ide yang benar.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Hasilkan 2-3 pertanyaan spesifik untuk membantu siswa memperhatikan fitur penting atau tidak terduga, menghasilkan penjelasan yang mungkin, dan membenarkan pemikiran dengan bukti."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CollaborationExpectations": {
              "type": "object",
              "x-format": "**{loc.CollaborationExpectationsTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Buat skrip lisan (jangan sertakan awalan 'Say:') untuk membingkai tugas sebagai saling bergantung dan menekankan tanggung jawab bersama. Sertakan instruksi agar siswa menggunakan kalimat pembuka (mis., 'Saya berpikir... karena...') dan struktur partisipasi seperti talking chips."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Cantumkan 3-5 langkah spesifik atau perilaku siswa yang perlu dipantau selama kerja kelompok (mis., mengidentifikasi pola, mencatat dalam tabel data bersama, membandingkan penafsiran). Jangan beri awalan 'Say:' pada tindakan-tindakan ini. Pastikan fokusnya adalah agar semua siswa berkontribusi dalam mengamati dan menyempurnakan ide.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Berikan 2-3 pertanyaan untuk mendorong siswa berbagi pengamatan, membandingkan penafsiran, membenarkan klaim dengan bukti, dan merevisi ide secara kolaboratif."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CirculationPrompts": {
              "type": "object",
              "x-format": "**{loc.CirculationPromptsTitle}**\n\n**{loc.ConceptualPromptsTitle}**\n\n{value.Conceptual}\n\n**{loc.ReasoningPromptsTitle}**\n\n{value.Reasoning}\n\n**{loc.CollaborationPromptsTitle}**\n\n{value.Collaboration}",
              "description": "Pertanyaan spesifik yang akan digunakan guru saat berkeliling di antara kelompok.",
              "properties": {
                "Conceptual": {
                  "type": "array",
                  "description": "2-3 pertanyaan yang berfokus pada konsep sains atau pembelajaran utama (mis., 'Bukti apa yang menunjukkan ini berhasil?').",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Reasoning": {
                  "type": "array",
                  "description": "2-3 pertanyaan untuk mendorong pembenaran dan logika (mis., 'Bagaimana uji coba ini mengubah pemikiranmu?').",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Collaboration": {
                  "type": "array",
                  "description": "2-3 pertanyaan untuk memastikan semua suara terlibat (mis., 'Siapa yang belum berkontribusi?').",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Conceptual",
                "Reasoning",
                "Collaboration"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "LaunchInvestigation",
            "CollaborationExpectations",
            "CirculationPrompts"
          ],
          "additionalProperties": false
        },
        "AnticipatedMisconceptions": {
          "type": "array",
          "x-format": "### ⚠️ {loc.AnticipatedMisconceptions}{items}",
          "description": "Hasilkan 2-3 miskonsepsi umum siswa yang kemungkinan muncul selama pelajaran ini. Setiap item harus berfokus pada satu kesalahpahaman spesifik dan sebuah skrip respons guru.",
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
                "description": "Skrip respons yang jelas untuk guru (diawali dengan 'Teacher Response: ') yang mencontohkan bagaimana merespons pada saat itu dengan pertanyaan spesifik (jangan sertakan awalan 'Say:'). JANGAN gunakan penebalan atau tag tebal apa pun."
              }
            },
            "required": [
              "Misconception",
              "TeacherResponse"
            ],
            "additionalProperties": false
          }
        },
        "Differentiation": {
          "type": "object",
          "x-format": "### 🪜 {loc.Differentiation}\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
          "properties": {
            "LanguageLearners": {
              "type": "object",
              "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse sentence frames to support explanation and reasoning:\n\n{value.SentenceStarters}",
              "properties": {
                "Strategies": {
                  "type": "array",
                  "description": "Hasilkan 2-3 dukungan khusus pelajaran (visual, bank kata, isyarat tangan) untuk membantu pembelajar bahasa mengakses dan mengekspresikan ide.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "SentenceStarters": {
                  "type": "array",
                  "description": "Hasilkan 3-4 kalimat pembuka yang membantu siswa mendeskripsikan, menjelaskan, dan mengomunikasikan pemikiran mereka untuk pelajaran spesifik ini.",
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
                  "description": "Hasilkan 2-3 dukungan langkah demi langkah (alat terstruktur, contoh yang dimodelkan, think-aloud) dan panduan yang tepat untuk membantu siswa menyelesaikan tugas.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Checklist": {
                  "type": "array",
                  "description": "Hasilkan 3-4 pertanyaan daftar periksa untuk memandu siswa memahami pembelajaran mereka selama investigasi.",
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
                  "description": "Hasilkan 2-3 pengayaan yang meningkatkan kompleksitas (tantangan spesifik, identifikasi pola) untuk membantu siswa memperdalam atau meningkatkan pemikiran mereka dengan menggunakan bukti.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "AdvancedQuestion": {
                  "type": "string",
                  "description": "Hasilkan satu pertanyaan/prompt kompleks (jangan sertakan awalan 'Say:') untuk mendorong pemahaman konseptual yang lebih dalam."
                },
                "ExpectedResponses": {
                  "type": "array",
                  "description": "Hasilkan 3-4 contoh spesifik respons siswa berkualitas tinggi untuk pertanyaan lanjutan.",
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
        "AccommodationsAndModifications": {
          "x-format": "### 🤝 {loc.AccommodationsAndModifications}\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
          "type": "object",
          "description": "Bagian ini harus mencakup dua jenis dukungan: General Supports dan Individualized Supports. Fokus pada akses, bukan menurunkan rigor.",
          "properties": {
            "General": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Strategi umum yang tidak spesifik untuk siswa tertentu yang meningkatkan akses bagi semua pembelajar (mis., visual, catatan yang sudah terisi, glosarium digital, instruksi yang dipecah). Berikan 2-4 poin bullet."
            },
            "IndividualSupport": {
              "x-format": "{items}",
              "type": "array",
              "description": "Akomodasi dan modifikasi spesifik untuk siswa bernama dengan rencana formal. Cantumkan SETIAP siswa secara individual; jangan mengelompokkan siswa bersama. Dukungan untuk setiap siswa harus berupa daftar yang mudah dipindai.",
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
                    "description": "Rencana formal yang diberikan untuk siswa ini dalam prompt. Uraikan rencana tersebut menjadi daftar yang jelas. Anda boleh memparafrasekannya untuk memperbaiki format, tetapi jangan menghilangkan atau menambahkan informasi apa pun."
                  },
                  "PlanImplementation": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Alat/stem/visual/organizer konkret untuk tugas ini."
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
        "QuickCheck": {
          "type": "object",
          "x-format": "### ✔ {loc.QuickCheck}\n\n{value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
          "properties": {
            "Question": {
              "type": "string",
              "description": "Hasilkan satu pertanyaan spesifik (jangan sertakan awalan 'Say:') untuk memeriksa pemahaman siswa selama atau pada akhir investigasi."
            },
            "ExpectedResponses": {
              "type": "array",
              "description": "Hasilkan 3-4 respons siswa yang diharapkan yang menunjukkan penguasaan konsep pelajaran.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "Question",
            "ExpectedResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers",
        "AnticipatedMisconceptions",
        "Differentiation",
        "AccommodationsAndModifications",
        "QuickCheck"
      ],
      "additionalProperties": false
    },
    "ConclusionPhase": {
      "x-format": "### {green}({loc.ConclusionPhase})\n\n{loc.ConclusionPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Daftar bahan yang diperlukan (mis. alat bantu visual, spidol, dll.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "{value.OpeningScript}\n\n{value.FacilitationMoves}\n\n**{loc.PromptWithQuestionsSuchAs}:**\n\n{value.ProbingQuestions}\n\n{value.WritingPrompt}\n\n{value.CollaborationInstruction}\n\n*{value.Guardrail}*",
          "properties": {
            "OpeningScript": {
              "type": "string",
              "description": "Pernyataan (jangan sertakan awalan 'Say:') untuk mengembalikan siswa ke pertanyaan penelitian dan memunculkan ide-ide yang mulai muncul tentang bagaimana desain bekerja."
            },
            "FacilitationMoves": {
              "type": "array",
              "description": "2-3 langkah pedagogis untuk memberi siswa waktu meninjau data, mengidentifikasi pola, dan membandingkan hasil melalui diskusi.",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              }
            },
            "ProbingQuestions": {
              "type": "array",
              "description": "3-4 pertanyaan spesifik untuk mendorong siswa menjelaskan pola, membenarkan keputusan dengan bukti, dan mendeskripsikan hubungan sebab-akibat.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "WritingPrompt": {
              "type": "string",
              "description": "Pernyataan (jangan sertakan awalan 'Say:') yang menguraikan apa saja yang harus disertakan dalam penjelasan tertulis mereka (komponen yang spesifik terhadap konten) dan pengingat untuk menggunakan data sebagai bukti."
            },
            "CollaborationInstruction": {
              "type": "string",
              "description": "Instruksi agar siswa menulis secara mandiri lalu berbagi dengan pasangan atau kelompok untuk menyempurnakan penalaran mereka."
            },
            "Guardrail": {
              "type": "string",
              "description": "Peringatan tegas bahwa guru TIDAK boleh memberikan penjelasan ilmiah, melainkan harus mendorong siswa untuk menunjukkan data."
            }
          },
          "required": [
            "OpeningScript",
            "FacilitationMoves",
            "ProbingQuestions",
            "WritingPrompt",
            "CollaborationInstruction",
            "Guardrail"
          ],
          "additionalProperties": false
        },
        "ExpectedStudentResponses": {
          "type": "array",
          "description": "3-4 respons yang secara langsung menjawab pertanyaan penelitian menggunakan bukti dan penalaran sebab-akibat (mis., 'ketika kami mengubah ___, ___ terjadi').",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers",
        "ExpectedStudentResponses"
      ],
      "additionalProperties": false
    },
    "DiscussionPhase": {
      "x-format": "### {green}({loc.DiscussionPhase})\n\n{loc.DiscussionPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n**🌍 {loc.TranscendentThinking}:**\n\n{value.TranscendentThinking}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
      "type": "object",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Daftar bahan yang diperlukan (mis., alat bantu visual, spidol, dll.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "**{loc.Say}:** {value.OpeningScript}\n\n{value.FacilitationMoves}\n\n**{loc.PromptWithQuestionsSuchAs}:**\n\n{value.ProbingQuestions}",
          "properties": {
            "OpeningScript": {
              "type": "string",
              "description": "Pernyataan (jangan sertakan awalan 'Katakan:') untuk mendorong siswa memikirkan implikasi yang lebih luas dari bukti mereka di luar kelas."
            },
            "FacilitationMoves": {
              "type": "array",
              "description": "2-3 langkah pedagogis untuk mendorong siswa berdiskusi dengan pasangan/kelompok dan menghasilkan contoh mereka sendiri tentang dampak di dunia nyata.",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              }
            },
            "ProbingQuestions": {
              "type": "array",
              "description": "3-4 pertanyaan spesifik untuk menghubungkan hasil investigasi dengan kehidupan sehari-hari, isu komunitas, atau desain ulang sistem.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "OpeningScript",
            "FacilitationMoves",
            "ProbingQuestions"
          ],
          "additionalProperties": false
        },
        "TranscendentThinking": {
          "type": "object",
          "x-format": "{value.Question}",
          "properties": {
            "Question": {
              "type": "string",
              "description": "Hasilkan 1 pertanyaan berpikir transenden yang mengharuskan siswa menerapkan pembelajaran melampaui diri mereka sendiri ke konteks dunia nyata (komunitas, tantangan global). Fokus pada mengapa pembelajaran penting dalam skala besar (keselamatan, keberlanjutan, inovasi, dll.). Hindari fokus yang hanya pada pribadi/sekolah."
            }
          },
          "required": [
            "Question"
          ],
          "additionalProperties": false
        },
        "ExpectedStudentResponses": {
          "type": "array",
          "description": "4-5 respons yang menggambarkan bagaimana siswa dapat menerapkan pemahaman mereka pada konteks dunia nyata yang autentik atau pemecahan masalah berorientasi masa depan.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers",
        "TranscendentThinking",
        "ExpectedStudentResponses"
      ],
      "additionalProperties": false
    },
    "ReviewAndSpacedRetrieval": {
      "x-format": "### 🧠 {loc.ReviewAndSpacedRetrieval}\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Bagian lengkap 'Tinjauan & Pengambilan Kembali Berspasi'. Aktivitas 5 menit ini harus mencakup: 1. Instruksi untuk Guru yang berisi: - Pemicu Active Recall menggunakan berbagi pasangan/kelompok - Respons Siswa yang Diharapkan (2-3 contoh berbentuk poin) 2. Koneksi Pertanyaan Esensial 3. Bagian Berpikir Transenden 4. Komponen Pengambilan Kembali Berspasi yang berisi: - Rujukan jelas ke pelajaran sebelumnya yang spesifik - Pertanyaan yang menghubungkan konsep masa lalu + saat ini - Kriteria keberhasilan / respons yang diharapkan secara rinci Semua bagian harus menyediakan perintah langsung untuk guru tanpa awalan 'Katakan:' dan dengan jelas menampilkan 'Respons Siswa yang Diharapkan' yang berisi 2-3 contoh jawaban.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Catatan guru yang menjelaskan bagaimana strategi tinjauan ini memperkuat retensi melalui active recall dan menghubungkan investigasi dengan ide-ide sains inti."
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.SpacedRetrieval}",
          "description": "Panduan guru langkah demi langkah untuk sesi tinjauan dan pengambilan kembali berspasi selama 5 menit.",
          "properties": {
            "ActiveRecall": {
              "type": "object",
              "x-format": "### 🔁 {loc.ActiveRecall}\n\n**{loc.Say}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Minta siswa mengambil kembali pembelajaran kunci dari pelajaran hari ini hanya menggunakan bukti dari investigasi.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Skrip guru spesifik (jangan sertakan awalan 'Katakan:') yang mendorong siswa merefleksikan investigasi hari ini dan apa yang terungkap tentang sistem tersebut."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "3-4 contoh respons siswa berkualitas tinggi yang menunjukkan penggunaan bukti secara jelas.",
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
            "EssentialQuestionConnection": {
              "type": "object",
              "x-format": "### 💭 {loc.EssentialQuestionConnection}\n\n**{loc.Say}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Bantu siswa menghubungkan bukti spesifik hari ini dengan pertanyaan esensial unit yang lebih luas.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Skrip guru (jangan sertakan awalan 'Katakan:') yang menghubungkan temuan hari ini dengan salah satu pertanyaan esensial unit."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 contoh bagaimana siswa membenarkan hubungan tersebut menggunakan bukti.",
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
            "SpacedRetrieval": {
              "type": "object",
              "x-format": "### ⏳ {loc.SpacedRetrieval}\n\n**{loc.Say}:** {value.TeacherSay}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Tinjau kembali konsep dari unit atau pelajaran sebelumnya untuk memperkuat retensi kumulatif.",
              "properties": {
                "TeacherSay": {
                  "type": "string",
                  "description": "Skrip guru (jangan sertakan awalan 'Katakan:') yang secara eksplisit menghubungkan konsep dari pelajaran sebelumnya dengan pekerjaan hari ini. Harus menyertakan meta-referensi (mis., '(Berasal dari Unit 1, Pelajaran 2.)') langsung di dalam teks."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "1-2 contoh respons siswa berkualitas tinggi yang menunjukkan ingatan yang jelas terhadap bukti dari pembelajaran sebelumnya.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "TeacherSay",
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
        }
      },
      "required": [
        "TeacherNotes",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "FormativeAssessment": {
      "x-format": "### ✅ {loc.FormativeAssessment}\n\n{items}",
      "type": "array",
      "description": "Tepat 4 pemicu Penilaian Formatif, masing-masing untuk satu tingkat DOK.",
      "items": {
        "x-format": "\n\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "mis., 'Pemicu 1 (DOK 1)'"
          },
          "Question": {
            "type": "string",
            "description": "Teks pertanyaan yang tepat, mis., 'Mengapa planet tetap berada di orbit alih-alih terlempar ke luar angkasa?'"
          },
          "ExpectedStudentResponses": {
            "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1-2 contoh respons yang menunjukkan penguasaan."
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
      "x-format": "### 🖋️ {loc.StudentPractice}\n\n**{loc.TeacherNotes}:** {loc.StudentPracticeNotes}\n\n{value.Tasks}\n\n**🔎 {loc.Reflection}:**\n\n{value.Reflection}",
      "type": "object",
      "description": "Bagian lengkap 'Latihan Siswa' untuk pekerjaan rumah / praktik di luar kelas.",
      "properties": {
        "Tasks": {
          "type": "array",
          "description": "Hasilkan 3 tugas yang mencakup tingkat DOK 2 dan 3.",
          "items": {
            "type": "object",
            "x-format": "\n\n**{value.TaskTitle}**\n\n{value.Instruction}\n\n{value.SuccessCriteria}",
            "properties": {
              "TaskTitle": {
                "type": "string",
                "description": "mis., '1. (DOK 2)'"
              },
              "Instruction": {
                "type": "string",
                "description": "Petunjuk siswa langkah demi langkah yang jelas untuk tugas tersebut."
              },
              "SuccessCriteria": {
                "type": "array",
                "description": "4-5 poin berbasis bukti yang spesifik yang menunjukkan seperti apa penguasaan untuk tugas ini. KRITIS: Setiap kriteria HARUS diawali dengan kata kerja tindakan (mis., 'Menggambarkan', 'Menjelaskan', 'Menggunakan').",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                }
              }
            },
            "required": [
              "TaskTitle",
              "Instruction",
              "SuccessCriteria"
            ],
            "additionalProperties": false
          }
        },
        "Reflection": {
          "type": "object",
          "description": "Akhiri dengan refleksi regulasi diri atau berpikir transenden.",
          "properties": {
            "Instruction": {
              "type": "string",
              "description": "Instruksi untuk bagian refleksi (mis., 'Tulis 2–3 kalimat yang menanggapi satu pertanyaan:')."
            },
            "Prompts": {
              "type": "array",
              "description": "4-5 prompt refleksi spesifik yang menghubungkan penyelidikan hari ini dengan kehidupan nyata, alat masa depan, atau pembelajaran pribadi.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "Instruction",
            "Prompts"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Tasks",
        "Reflection"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "AssessPriorKnowledge",
    "EssentialQuestions",
    "KeyVocabulary",
    "StudentLearningObjectives",
    "StandardsAligned",
    "OrientationPhase",
    "ConceptualizationPhase",
    "InvestigationPhase",
    "ConclusionPhase",
    "DiscussionPhase",
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
    "SpacedLearningAndRetrieval": [
      "ReviewAndSpacedRetrieval"
    ],
    "FormativeAssessment": [
      "FormativeAssessment"
    ],
    "AccommodationsAndModifications": [
      "InvestigationPhase.AccommodationsAndModifications"
    ]
  }
},
};
