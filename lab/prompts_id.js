window.labPromptsID = {
  STEP0_PROMPT_TEMPLATE: `
Buat kerangka unit dan struktur pelajaran menggunakan informasi di bawah ini. JANGAN menulis rencana pelajaran lengkap.
                    
Berdasarkan Mata Pelajaran Unit, standar pendidikan, Deskripsi/Instruksi Unit, Tingkat Kelas, Durasi jam pelajaran (menit), dan Jumlah Pelajaran yang diminta, hasilkan respons JSON yang mencakup UnitDescription yang kohesif dan daftar "wadah" pelajaran yang tidak tumpang tindih.

Mata Pelajaran Unit:
{{$Subject}}

Nama Unit:
{{$Name}}

Deskripsi/Instruksi Unit:
{{$UserPrompt}}

Tingkat Kelas:
{{$GradeLevel}}

Durasi jam pelajaran dalam menit:
{{$ClassDuration}}
	
Standar untuk Diselaraskan:
{{$Standards}}
    
Siswa dengan dukungan individual:
{{$LearningPlans}}

Sumber Daya/Media yang digunakan:
{{$MediaContext}}
	
Konten Unit:
{{$AttachedUnit}}

Persyaratan Pertanyaan Esensial:
- Setiap pertanyaan HARUS berupa kalimat lengkap dan tata bahasa yang benar yang diakhiri dengan tanda tanya.
- Setiap pertanyaan HARUS dimulai dengan "Bagaimana" atau "Mengapa".
- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS berfokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus mata pelajaran.
- Pertanyaan HARUS dapat ditransfer lintas disiplin ilmu dan dapat diterapkan di luar unit ini.
- Pertanyaan HARUS digunakan kembali secara verbatim di setiap pelajaran dalam unit.

Apa yang harus dihasilkan:
- Output HARUS berupa JSON valid yang cocok dengan skema.
- WAJIB: Isi penuh semua properti dalam objek "UnitDescription":
  - "Description": Tulis satu paragraf berisi 4-5 kalimat yang menggambarkan fokus inti unit dan alur naratif.
  - "StudentLearningObjectives": Cantumkan 3-5 tujuan pembelajaran utama yang terukur untuk unit tersebut.
  - "StandardsAligned": Cantumkan semua standar yang dibahas di seluruh unit.
  - "EssentialQuestions": Tepat 3 pertanyaan konseptual yang mengikuti aturan di atas.
- HASILKAN daftar "Lessons" yang berisi tepat {{$NumberOfItems}} pelajaran.
  - Setiap pelajaran harus menyertakan "lessonNumber" (indeks berbasis 1), "lessonName", dan "lessonDescription" (2–4 kalimat yang menjelaskan cakupan pelajaran).

Batasan:
- Jaga agar unit dan setiap pelajaran selaras dengan fokus unit.
- Pastikan pengurutan yang logis dari ide-ide dasar ke pemodelan yang lebih kompleks.
- Akurasi: Semua konten harus akurat secara ilmiah dan sesuai usia.

Output HARUS berupa JSON valid yang cocok dengan skema. Gunakan format terkompresi (tanpa baris kosong tambahan).
`,
  PER_LESSON_PROMPT_TEMPLATE: `
Buat SATU rencana pelajaran laboratorium (BUKAN rencana unit, BUKAN beberapa pelajaran) menggunakan informasi di bawah ini.
Anda HARUS menghasilkan JSON valid yang cocok dengan skema JSON yang disediakan secara tepat. Jangan sertakan kunci tambahan apa pun. Gunakan format JSON terkompresi (tanpa baris kosong tambahan).
Mata Pelajaran Unit: 
{{$Subject}}
Nama Unit: 
{{$Name}}
Deskripsi/Instruksi Unit: 
{{$UserPrompt}}
Tingkat Kelas: 
{{$GradeLevel}}
Durasi jam pelajaran dalam menit: 
{{$ClassDuration}}
Sumber Daya/Media yang digunakan: 
{{$MediaContext}}
Konten Unit: 
{{$ParentUnitData}}
Standar untuk Diselaraskan:
{{$Standards}}
Konten Pelajaran yang Dilampirkan: 
{{$AttachedLesson}}

Pertanyaan Esensial Unit (GUNAKAN INI SECARA VERBATIM):
{{$UnitEssentialQuestions}}

Jika Pertanyaan Esensial Unit di atas kosong, buat tepat 3 pertanyaan konseptual mengikuti aturan ini:
- Setiap pertanyaan HARUS berupa kalimat lengkap dan tata bahasa yang benar yang diakhiri dengan tanda tanya.
- Setiap pertanyaan HARUS dimulai dengan "Bagaimana" atau "Mengapa".
- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS berfokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus mata pelajaran.
- Pertanyaan HARUS dapat ditransfer lintas disiplin ilmu dan dapat diterapkan di luar unit ini.

SISWA DENGAN DUKUNGAN INDIVIDUAL (HARUS digunakan HANYA di dalam Experiment.AccommodationsAndModifications; gunakan nama/rencana siswa persis seperti yang tertulis):
{{$LearningPlans}}

ATURAN KONTEN PENTING:
- Jaga agar pelajaran selaras dengan fokus unit: mengembangkan dan menggunakan model untuk menggambarkan komposisi atom molekul sederhana dan/atau struktur yang diperluas.
- Sertakan hubungan singkat tingkat tinggi dengan DCI relevan lainnya jika sesuai, tetapi jaga agar pelajaran tetap berpusat pada pemodelan dan penalaran struktur-properti (tanpa matematika mendalam, tanpa penyetaraan persamaan reaksi kecuali secara eksplisit diwajibkan oleh standar).
- Pastikan semua bagian pelajaran mencerminkan Cakupan/Batasan Pelajaran yang disediakan dalam konteks unit; hindari memperkenalkan konsep utama baru yang termasuk dalam pelajaran lain.
- EssentialQuestions: HARUS persis sama dengan pertanyaan esensial tingkat unit (teks yang sama, urutan yang sama).
- AssessPriorKnowledge: HANYA jika LessonNumber == 1, tulis 150–250 kata dan ikuti struktur yang diperlukan dalam deskripsi skema. Jika LessonNumber != 1, kembalikan "" (string kosong).
- Fase Lab (Question, Research, Hypothesize, Experiment, Analyze, Share): Ikuti persyaratan instruksional khusus dan string "Purpose:" untuk setiap fase seperti yang didefinisikan dalam skema JSON.
- Experiment.AccommodationsAndModifications harus mencakup dukungan umum diikuti oleh dukungan individual untuk setiap siswa yang disediakan dalam {{$LearningPlans}}.
- StudentPractice HARUS menyertakan paragraf TeacherNotes yang dimulai dengan 'These tasks reinforce today’s learning about ____ by ______.', daftar berisi 2-3 tugas dengan DOK 2-4 dan kriteria keberhasilan, serta pengulangan berjarak jika subjeknya adalah matematika.

PERSYARATAN OUTPUT:
- Output HARUS berupa JSON valid yang cocok dengan skema yang disediakan secara tepat.
- Output HARUS berupa SATU rencana pelajaran saja.
- Tanpa HTML. Tanpa emoji. Tanpa markdown. Teks biasa di dalam bidang string.
`,
  HTML_LESSON_PROMPT_TEMPLATE: `Anda akan menerima SATU objek JSON yang secara ketat mengikuti skema LabUnitPlanResponse. Tugas Anda adalah mengubah JSON ini menjadi HTML yang bersih dan mudah dibaca untuk satu pelajaran.

FORMAT INPUT
Saya akan mengirimkan objek JSON kepada Anda seperti ini:

UNIT PLAN JSON:
{{{JsonResponse}}}

Perlakukan semua setelah baris “UNIT PLAN JSON:” sebagai objek JSON yang tepat. JANGAN menjelaskan atau mengomentarinya; cukup uraikan dan render.

ATURAN GLOBAL
    - Hasilkan HANYA HTML valid (tanpa markdown, tanpa backticks, tanpa penjelasan prosa).
    - Tag yang diizinkan: <p>, <h1>, <h2>, <h3>, <h4>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - JANGAN gunakan tag lain (tanpa <main>, <section>, <header>, <div>, <h5>, dll.).
    - HTML harus diindentasi dengan baik dan mudah dibaca.
    - Dalam <ol> atau <ul> apa pun, HANYA gunakan elemen <li> sebagai anak langsung. Jangan pernah menempatkan <p>, <span>, <ul>, <ol>, atau tag lainnya sebagai anak dari daftar.
    - JANGAN mengada-ada konten instruksional baru; gunakan hanya apa yang ada di bidang JSON.
    - Pertahankan urutan logis yang tersirat oleh skema:
    - Di dalam setiap pelajaran, ikuti urutan bidang skema.
    - Jika bidang string kosong (""), LEWATKAN subbagian tersebut beserta labelnya.
    - Jika array kosong, lewati tajuknya dan <ul> atau <ol> yang sesuai.
    - Kapan pun teks tersebut membentuk daftar petunjuk/pertanyaan/pernyataan/tanggapan dengan jelas, gunakan <ul><li>…</li></ul> atau <ol><li>…</li></ol>. Jika tidak, gunakan <p>.
    - Kapan pun Anda me-render tanggapan siswa model/yang diharapkan di bagian APA PUN, gunakan pola ini:
        - Pertama: <p>✅ Jawaban Siswa yang Diharapkan</p> (tanpa poin di baris ini)
        - Kemudian daftar <ul> atau <ol> berisi tanggapan (satu tanggapan per <li>).
    - Kapan pun Anda me-render Pemeriksaan Cepat:
        - Gunakan tajuk tepat ini: <p><strong>✔Pemeriksaan Cepat</strong></p>
        - Render pertanyaan or tugas segera setelah tajuk sebagai paragraf yang meminta SETIAP siswa untuk menunjukkan pemahaman mereka (bukan hanya satu siswa dalam pemeriksaan lisan).
        - Gunakan pola global ✅Jawaban Siswa yang Diharapkan untuk jawaban.
    - Gunakan emoji jika ada di aturan pemetaan berikut.

ATURAN PEMETAAN:

- <h3>💭 Pertanyaan Esensial</h3> (jika tersedia, daftar UL dari EssentialQuestions)
- <h3>🎯 Tujuan Pembelajaran Siswa</h3> (daftar UL dari StudentLearningObjectives)
- <h3>📏 Standar yang Diselaraskan</h3> (daftar UL atau paragraf dari StandardsAligned)
- <h3>🔤 Kosakata Kunci</h3>
<ul>
  - Render setiap item dari KeyVocabulary sebagai <li>.
</ul>

EVALUASI PENGETAHUAN AWAL:
- Mulai dengan tajuk tepat ini:
<h3>💡 Evaluasi Pengetahuan Awal</h3>
- Segera setelah tajuk, SELALU render teks Tujuan ini persis seperti yang tertulis:
<p><strong>Tujuan:</strong> Mengaktifkan pengetahuan awal siswa bukan sekadar pemanasan—ini adalah kerja neurosains. Ketika siswa mengingat kembali apa yang telah mereka yakini atau ingat tentang materi, partikel, atau perubahan kimia, mereka mengaktifkan jalur saraf yang ada. "Pengkodean elaboratif" ini memudahkan otak untuk menghubungkan konsep kimia baru dengan apa yang sudah diketahui, memperkuat retensi jangka panjang. Aktivitas ini membantu Anda mengungkap ide yang akurat, ide parsial, yang salah, serta miskonsepsi yang akan menjadi jangkar kuat untuk pembelajaran di sepanjang proyek.</p>
- Render bagian "Katakan:" yang ditujukan untuk guru.
- Bahkan jika teks input TIDAK secara eksplisit berisi "Say:" atau "Katakan:"
- Sintesis atau frasakan kembali konten yang ada menjadi 1-2 paragraf ucapan guru yang jelas
- Mulai dengan:
<p><strong>Katakan:</strong></p>
- Ikuti dengan satu atau lebih elemen <p>
- Setiap tugas siswa, petunjuk, pernyataan, atau instruksi:
- Render sebagai <ol> atau <ul>
- Setiap item HARUS berupa satu <li>
- TANPA <p> atau tag lain di dalam <li>
- Ketika tanggapan siswa yang diharapkan atau model muncul:
- Render label TEPAT ini:
<p>✅ Jawaban Siswa yang Diharapkan</p>
- Kemudian render semua tanggapan yang diharapkan sebagai <ul> dengan <li> saja
- TANPA daftar bersarang
- TANPA <p> di dalam <li>
- Jika pilihan alternatif atau variasi muncul:
- Render:
<p><strong>Pilihan Alternatif:</strong></p>
- Kemudian <ul> dengan item <li> singkat

JANGAN:
- Gunakan tag apa pun yang tidak terdaftar
- Buat daftar bersarang
- Lewatkan bagian Tujuan
- Mengada-ada konten instruksional baru, tetapi gunakan semua ide yang disediakan


- <h3><span style="color: rgb(115, 191, 39);">Pertanyaan</span> (5 min)</h3>
Tujuan harus kata demi kata seperti di JSON
  - <p><strong>Tujuan:</strong> {Purpose}</p>
  kemudian render (dengan emoji jika tersedia di tag html)
  - <h4>📚 Materi</h4> <ul>{Materials}</ul>
  - <h4>📋 Instruksi untuk Guru</h4> <p>{InstructionsForTeachers}</p>
  - <p>✅ <strong>Jawaban Siswa yang Diharapkan</strong></p> <ul>{ExpectedStudentResponses}</ul>
  - <p><strong>Pertanyaan Penyelidikan Akhir:</strong> {FinalInvestigationQuestion}</p>

- <h3><span style="color: rgb(115, 191, 39);">Penelitian (5 min)</span></h3>
  - <p><strong>Tujuan:</strong> {Purpose}</p>
  - <h4>📚 Materi</h4> <ul>{Materials}</ul>
  - <h4>📋 Instruksi untuk Guru</h4> <p>{InstructionsForTeachers}</p>
  - <h4>❗️ Miskonsepsi yang Diantisipasi</h4> (Ulangi AnticipatedMisconceptions: <p><strong>Miskonsepsi:</strong> {Misconception}</p> <p><strong>Tanggapan Guru:</strong> {TeacherResponse}</p>)

- <h3><span style="color: rgb(115, 191, 39);">Hipotesis (5 min)</span></h3>
  - <p><strong>Tujuan:</strong> {Purpose}</p>
  - <h4>📚 Materi</h4> <ul>{Materials}</ul>
  - <h4>📋 Instruksi untuk Guru</h4> <p>{InstructionsForTeachers}</p>
  - <p>✅ <strong>Jawaban Siswa yang Diharapkan</strong></p> <ul>{ExpectedStudentResponses}</ul>

- <h3><span style="color: rgb(115, 191, 39);">Eksperimen (20 min)</span></h3>
  - <p><strong>Tujuan:</strong> {Purpose}</p>
  - <h4>📚 Materi</h4> <ul>{Materials}</ul>
  - <h4>📋 Instruksi untuk Guru</h4> <p>{InstructionsForTeachers}</p>
  - <h4>✅ Pemeriksaan Cepat</h4> <p>{QuickCheck}</p>
  - <h4>🪜 Diferensiasi</h4> <p>{Differentiation}</p>
  - <h4>🤝 Akomodasi & Modifikasi</h4> <p>{AccommodationsAndModifications}</p>

- <h3><span style="color: rgb(115, 191, 39);">Analisis (5 min)</span></h3>
  - <p><strong>Tujuan:</strong> {Purpose}</p>
  - <h4>📚 Materi</h4> <ul>{Materials}</ul>
  - <h4>📋 Instruksi untuk Guru</h4> <p>{InstructionsForTeachers}</p>

- <h3><span style="color: rgb(115, 191, 39);">Berbagi (5 min)</span></h3>
  - <p><strong>Tujuan:</strong> {Purpose}</p>
  - <h4>📚 Materi</h4> <ul>{Materials}</ul>
  - <h4>📋 Instruksi untuk Guru</h4> <p>{InstructionsForTeachers}</p>

BAGIAN PENUTUP:
- <h3>⏳ Tinjauan & Pengulangan Berjarak (5 min)</h3>
  - (Format teks dari ReviewAndSpacedRetrieval memastikan tajuk seperti Catatan Guru, Ingatan Aktif, Miskonsepsi, Pemikiran Transenden dicetak tebal dan mudah dibaca)
- <h3>✅ Asesmen Formatif</h3>
  - (Format teks dari FormativeAssessment, memisahkan petunjuk dan tanggapan yang diharapkan dengan jelas)
- <h3>🖊 Latihan Siswa</h3>
  - (Format teks dari StudentPractice memastikan item dan tanggapan yang diharapkan disusun secara bersih)`,
  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `Anda akan menerima SATU objek JSON yang secara ketat mengikuti skema UnitPlanResponse (sudah divalidasi di pihak saya). Tugas Anda adalah mengubah JSON ini menjadi HTML yang bersih dan mudah dibaca yang dapat digunakan guru secara langsung di kelas.
                   
FORMAT INPUT
Saya akan mengirimkan objek JSON kepada Anda seperti ini:

UNIT PLAN JSON:
{{{JsonResponse}}}

Perlakukan semua setelah baris “UNIT PLAN JSON:” sebagai objek JSON yang tepat. JANGAN menjelaskan atau mengomentarinya; cukup uraikan dan render.

ATURAN GLOBAL
    - Hasilkan HANYA HTML valid (tanpa markdown, tanpa backticks, tanpa penjelasan prosa).
    - Tag yang diizinkan: <p>, <h1>, <h2>, <h3>, <h4>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - JANGAN gunakan tag lain (tanpa <main>, <section>, <header>, <div>, <h5>, etc.).
    - HTML harus diindentasi dengan baik dan mudah dibaca.
    - Dalam <ol> atau <ul> apa pun, HANYA gunakan elemen <li> sebagai anak langsung. Jangan pernah menempatkan <p>, <span>, <ul>, <ol>, atau tag lainnya sebagai anak dari daftar.
    - JANGAN mengada-ada konten instruksional baru; gunakan hanya apa yang ada di bidang JSON.
    - Pertahankan urutan logis yang tersirat oleh skema.

- Di bagian atas:
    - <h2><strong>{{{UnitTitle}}}</strong></h2>
    - <p>{{{UnitDescription.Description}}}</p>
- Kemudian tambahkan baris baru dengan:
    <h3><span>Ringkasan Unit</span></h3>

- Pertanyaan Esensial:
    - <h3><span>💭 Pertanyaan Esensial</span></h3>
    - <ul> dengan setiap item dari UnitDescription.EssentialQuestions sebagai <li>.

- Tujuan Pembelajaran Siswa:
    - <h3><span>🎯 Tujuan Pembelajaran Siswa</span></h3>
    - <ul> dengan setiap item dari UnitDescription.StudentLearningObjectives sebagai <li>.

- Standar:
    - <h3><span>📏 Standar yang Diselaraskan</span></h3>
    - <ul> dengan setiap string dari UnitDescription.StandardsAligned sebagai <li>.

- Kosakata Kunci:
    - <h3><span>🔤 Kosakata Kunci</span></h3>
    - <ul> dengan setiap string dari UnitDescription.KeyVocabulary sebagai <li>.`,

  STEP0_SCHEMA: {
    "title": "UnitPlanResponse",
    "type": "object",
    "properties": {
      "UnitDescription": {
        "type": "object",
        "properties": {
          "Description": {
            "type": "string",
            "description": "Deskripsi unit sebagai satu paragraf teks biasa yang kohesif (4–5 kalimat lengkap) yang ditulis dalam suara guru alami yang dapat Anda katakan langsung kepada siswa. Tanpa HTML, tanpa emoji, tanpa poin-poin. Harus mengalir secara percakapan tetapi mengikuti struktur ini (tanpa tajuk utama): (1) kalimat pengait yang memicu rasa ingin tahu atau membuat kontras yang mengejutkan, (2) kalimat 'Dalam unit ini, Anda akan...' tentang hasil penguasaan, (3) kalimat 'Anda akan memperkuat keterampilan Anda dalam...' tentang kemampuan berpikir/analisis, (4) kalimat 'Ini terhubung dengan...' tentang relevansi dunia nyata, (5) kalimat 'Memahami hal ini penting karena...' tentang signifikansi yang lebih luas atau dampak jangka panjang."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Buat pertanyaan esensial yang hanya berfokus pada konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. JANGAN sebutkan istilah, proses, kosakata, atau contoh khusus materi pelajaran. Pertanyaan harus terbuka, dapat ditransfer ke semua disiplin ilmu, dan tidak mungkin dijawab hanya dengan mempelajari pelajaran atau konten unit. Fokus hanya pada ide-ide besar, bukan materi pelajaran.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Bagian lengkap 'Tujuan Pembelajaran Siswa' untuk seluruh unit ini. Setiap item daftar harus berupa tujuan yang jelas dan terukur yang dimulai dengan kata kerja yang dapat diukur dan diakhiri dengan label DOK dalam tanda kurung",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "array",
            "description": "Cantumkan semua standar pendidikan unik yang digunakan di mana saja dalam unit ini dan pelajarannya. JANGAN tambahkan standar yang tidak muncul dalam konten unit. Setiap standar harus menyertakan kode standar dan deskripsi, misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem Bumi-matahari-bulan untuk menggambarkan pola siklus fase bulan, gerhana, dan musim.",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Bagian lengkap 'Kosakata Kunci' sebagai daftar string. Setiap string harus berupa satu istilah dengan definisi yang dipisahkan oleh tanda hubung/strip. Contoh: 'Gravitasi - Gaya yang menarik benda-benda ke arah satu sama lain'. Semua definisi harus pendek, sesuai usia, dan berhubungan langsung dengan konten pelajaran.",
            "items": {
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
        "type": "array",
        "description": "Daftar wadah pelajaran untuk unit ini (hanya kerangka). Setiap item harus tidak tumpang tindih dan dicakup dengan jelas sehingga konten pelajaran tidak berulang di seluruh pelajaran.",
        "items": {
          "type": "object",
          "properties": {
            "lessonNumber": {
              "type": "integer",
              "description": "Nomor urut pelajaran. Berbasis 1."
            },
            "lessonTitle": {
              "type": "string",
              "description": "Judul pelajaran pendek sebagai teks biasa."
            },
            "lessonOutline": {
              "type": "string",
              "description": "2-4 kalimat yang menjelaskan cakupan pelajaran, fokus, dan batasan untuk mencegah tumpang tindih dengan pelajaran lain."
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
        "type": "array",
        "description": "Cukup rekatkan semua pertanyaan esensial yang dihasilkan di tingkat unit dalam urutan yang sama.",
        "items": {
          "type": "string"
        }
      },
      "StudentLearningObjectives": {
        "type": "array",
        "description": "Bagian lengkap 'Tujuan Pembelajaran Siswa' sebagai teks biasa. Setiap item harus berupa tujuan yang jelas dan terukur yang dimulai dengan kata kerja yang terukur dan diakhiri dengan label DOK dalam tanda kurung, misalnya 'Model how Earth's rotation on its axis causes day and night (DOK 2).'",
        "minItems": 2,
        "maxItems": 3,
        "items": {
          "type": "string"
        }
      },
      "StandardsAligned": {
        "type": "string",
        "description": "Bagian lengkap 'Standar yang Diselaraskan' sebagai teks biasa untuk pelajaran ini. Setiap standar harus menyertakan kode standar dan deskripsi, dan kode serta deskripsi harus persis sama dengan yang digunakan di Unit. misalnya 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'"
      },
      "KeyVocabulary": {
        "type": "array",
        "description": "Pilih secara verbatim kosakata kunci untuk pelajaran ini dari kosakata tingkat unit yang disediakan dalam petunjuk. JANGAN mengada-ada kata-kata baru. Anda harus menggunakan kembali kata-kata persis dari Langkah 0 UnitDescription.KeyVocabulary.",
        "items": { "type": "string" }
      },
      "AssessPriorKnowledge": {
        "type": "string",
        "description": "Bagian lengkap 'Evaluasi Pengetahuan Awal' sebagai teks biasa (total 150-250 kata). HANYA Pelajaran 1 yang boleh berisi blok terperinci; SEMUA PELAJARAN LAIN HARUS MENGEMBALIKAN STRING KOSONG untuk bidang ini. Untuk Pelajaran 1, struktur harus mencakup: 1. Sertakan bagian ini hanya pada pelajaran pertama unit, ditempatkan segera setelah Tujuan Pembelajaran Siswa. 2. Pastikan petunjuk DOK 1-3 digunakan. 3. Sertakan keterampilan prasyarat yang diperlukan untuk tujuan pembelajaran siswa. 4. Pilih satu modalitas dari daftar ini dan kembangkan sepenuhnya: pertanyaan, K-W-L, visual, peta konsep, tulisan reflektif, panduan antisipasi, peringkat kosakata. 5. Petunjuk awal guru dengan pernyataan 'Katakan:' yang memperkenalkan modalitas yang dipilih dan menjelaskan bagaimana siswa akan memunculkan pemahaman saat ini. 6. Instruksi dan templat/struktur yang jelas untuk modalitas yang dipilih. 7. Bagian 'Jawaban Siswa yang Diharapkan' yang menunjukkan jawaban yang diantisipasi atau miskonsepsi umum untuk modalitas yang dipilih. 8. Petunjuk penutup guru 'Katakan:' yang memvalidasi pemikiran siswa dan melihat pratinjau penyelidikan unit. 9. Setelah mengembangkan satu modalitas sepenuhnya, berikan 2 pilihan alternatif singkat yang dapat dipilih guru."
      },
      "Question": {
        "type": "object",
        "description": "Pandu guru sehingga siswa akan mengamati fenomena, mengidentifikasi sesuatu yang membingungkan, dan menghasilkan pertanyaan bermakna yang akan memandu penyelidikan.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Kata demi Kata - Purpose: Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation."
          },
          "Materials": {
            "type": "array",
            "description": "Daftar materi yang dibutuhkan (misalnya alat peraga, spidol, dll.)",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Langkah-demi-langkah instruksi guru, tindakan, dan petunjuk 'Katakan:' untuk menyajikan fenomena dan mengundang pertanyaan."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "3-4 pertanyaan atau ide siswa yang diharapkan tentang fenomena tersebut."
              },
              "FinalInvestigationQuestion": {
                "type": "string",
                "description": "Petunjuk penutup guru yang mensintesis ide-ide siswa menjadi satu pertanyaan besar untuk diselidiki hari ini."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses", "FinalInvestigationQuestion"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Research": {
        "type": "object",
        "description": "Pandu guru agar siswa mempelajari informasi latar belakang, kosakata, dan pengetahuan awal yang diperlukan untuk memahami topik.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Kata demi kata: Purpose: Gather background information, vocabulary, and prior knowledge needed to understand the topic and prepare for informed investigation."
          },
          "Materials": {
            "type": "array",
            "description": "Daftar materi yang dibutuhkan (misalnya alat peraga, spidol, dll.)",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Langkah-demi-langkah instruksi guru, tindakan, dan petunjuk 'Katakan:' untuk menjelaskan pengetahuan latar belakang, kosakata, dan memodelkan fenomena tersebut."
              },
              "AnticipatedMisconceptions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "Misconception": { "type": "string", "description": "Miskonsepsi siswa" },
                    "TeacherResponse": { "type": "string", "description": "Apa yang harus dikatakan guru untuk memperbaikinya" }
                  },
                  "required": ["Misconception", "TeacherResponse"],
                  "additionalProperties": false
                }
              }
            },
            "required": ["Instructions", "AnticipatedMisconceptions"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Hypothesize": {
        "type": "object",
        "description": "Pandu guru agar siswa mengembangkan prediksi yang dapat diuji.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Kata demi Kata: Purpose: Develop a testable prediction or claim based on their research and reasoning, setting a clear expectation for what they believe will happen."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Instruksi guru, termasuk petunjuk 'Katakan:' untuk bingkai kalimat hipotesis."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "3-4 contoh hipotesis yang diharapkan."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Experiment": {
        "type": "object",
        "description": "Pandu guru agar siswa melakukan penyelidikan terstruktur.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Kata demi kata: Purpose: Carry out a structured investigation- hands-on, simulated, or analytical- to test their hypothesis and gather evidence through observation or measurement."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Langkah-demi-langkah instruksi guru untuk mengatur eksperimen, memberikan arahan, dan berkeliling kelas."
              },
              "QuickCheck": {
                "type": "object",
                "properties": {
                  "Question": { "type": "string" },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "Differentiation": {
                "type": "object",
                "properties": {
                  "LanguageLearners": { "type": "array", "items": { "type": "string" } },
                  "AdditionalScaffolding": { "type": "array", "items": { "type": "string" } },
                  "GoDeeper": { "type": "array", "items": { "type": "string" } },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "Untuk tanggapan Pergi Lebih Dalam." }
                },
                "required": ["LanguageLearners", "AdditionalScaffolding", "GoDeeper", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "properties": {
                  "GeneralSupports": { "type": "array", "items": { "type": "string" } },
                  "IndividualSupports": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["GeneralSupports", "IndividualSupports"],
                "additionalProperties": false
              }
            },
            "required": ["Instructions", "QuickCheck", "Differentiation", "AccommodationsAndModifications"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Analyze": {
        "type": "object",
        "description": "Pandu guru agar siswa menafsirkan data yang mereka kumpulkan.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Purpose: Interpret the data they collected, identify patterns, evaluate their hypothesis, and construct evidence-based conclusions."
          },
          "Materials": {
            "type": "array",
            "description": "Daftar materi yang dibutuhkan (misalnya alat peraga, spidol, dll.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Instruksi guru dan pemulai kalimat untuk analisis."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Jawaban yang diharapkan atau pelengkapan bingkai kalimat dari siswa."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Share": {
        "type": "object",
        "description": "Pandu guru agar siswa mengomunikasikan temuan mereka dengan jelas.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Kata demi kata: Purpose: Communicate their findings clearly to others, using evidence to explain what they discovered, why it matters, and how it contributes to deeper understanding."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Instruksi guru untuk mengatur pembagian siswa."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Ide yang diharapkan dibagikan oleh siswa."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "string",
        "description": "Bagian lengkap 'Tinjauan & Pengulangan Berjarak' sebagai teks biasa. Aktivitas 5 menit ini harus mencakup dalam urutan TEPAT ini: 1. Paragraf Catatan Guru yang menjelaskan: - Bagaimana strategi tinjauan ini meningkatkan retensi - Koneksi dengan konsep pembelajaran sebelumnya - Bagaimana refleksi transenden memperdalam pemahaman 2. Instruksi untuk Guru yang berisi: - Petunjuk Ingatan Aktif menggunakan berbagi pasangan/kelompok - Jawaban Siswa yang Diharapkan (2-3 contoh poin) 3. Blok Miskonsepsi yang Diantisipasi dengan: - Contoh pernyataan miskonsepsi - Skrip tanggapan guru untuk mengatasi masing-masing 4. Koneksi Pertanyaan Esensial termasuk: - Petunjuk guru yang menghubungkan dengan pertanyaan unit - Jawaban Siswa yang Diharapkan (2-3 contoh) 5. Bagian Pemikiran Transenden dengan: - Petunjuk aplikasi dunia nyata - Instruksi waktu berpikir - Jawaban Siswa yang Diharapkan (2-3 contoh) 6. Komponen Pengulangan Berjarak berisi: Referensi jelas ke pelajaran sebelumnya yang spesifik. Contoh (Draws from Unit 3, Lesson 2). Harus menggunakan pertanyaan ingatan aktif yang menghubungkan konsep masa lalu + saat ini. Tidak boleh mengharuskan siswa menggunakan catatan atau sumber daya untuk menjawab. - Kriteria keberhasilan rinci / tanggapan yang diharapkan. Semua bagian harus menggunakan pernyataan 'Katakan:' untuk petunjuk guru dan label yang jelas 'Expected Student Responses' atau 'Jawaban Siswa yang Diharapkan' yang menunjukkan 2-3 contoh jawaban. Kembalikan sebagai teks biasa."
      },
      "FormativeAssessment": {
        "type": "string",
        "description": "Bagian lengkap 'Asesmen Formatif' sebagai teks biasa. Harus mengikuti struktur ini: Paragraf pengantar yang ditujukan untuk guru yang menyatakan tujuan dan cara menerapkannya secara singkat. 4 petunjuk pertanyaan yang diperlukan berlabel 'Prompt 1 (DOK 1):', 'Prompt 2 (DOK 2):', dll. yang mencakup tingkat DOK 1-4. Untuk setiap petunjuk: - Pertanyaan yang menguji pemahaman pada tingkat DOK yang dinyatakan - Tajuk 'Expected Student Responses' atau 'Jawaban Siswa yang Diharapkan' (tanpa tanda centang/emoji) - 1-2 tanggapan kalimat lengkap yang menunjukkan penguasaan Akhiri dengan paragraf pendek yang menyebutkan strategi penilaian formatif khusus untuk digunakan (misalnya, 'Exit Ticket', 'Think-Pair-Share'). Contoh format: Prompt 1 (DOK 1): 'Why do planets stay in orbit instead of flying off into space?' Expected Student Responses 'Because their forward motion and the Sun's gravity work together to create a stable orbit.' [Lanjutkan dengan Prompt 2-4 mengikuti struktur yang sama]"
      },
      "StudentPractice": {
        "type": "string",
        "description": "Bagian lengkap 'Latihan Siswa' sebagai teks biasa. Ini adalah pekerjaan rumah / latihan di luar kelas. Ikuti format TEPAT ini untuk tanggapan: Teacher Notes: [1 paragraf yang menjelaskan bagaimana latihan memperkuat pembelajaran + membangun koneksi dunia nyata] 1. (DOK 2) [Set petunjuk pertama] Expected Student Responses [3-4 poin menunjukkan penguasaan] 2. (DOK 3) [Set petunjuk kedua] ✅Expected Student Responses [3-4 poin menunjukkan analisis/aplikasi] 3. (DOK 3) [Set petunjuk ketiga] Expected Student Responses [3-4 poin menunjukkan sintesis/evaluasi] Reflection: Akhiri dengan satu refleksi pemikiran regulasi diri atau pemikiran transenden, seperti: 'What evidence of today's science concept can you find in your home or neighborhood?', 'How does what you learned today help you see the world differently?', 'What challenges did you face doing this at home, and how did you overcome them?', atau 'How might this concept impact our community or future discoveries?'"
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
    "additionalProperties": false
  }
};
