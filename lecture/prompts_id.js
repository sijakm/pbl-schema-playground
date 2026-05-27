window.labPromptsID = {
  STEP0_PROMPT_TEMPLATE: `
Buat garis besar unit dan struktur pelajaran menggunakan info di bawah ini. JANGAN menulis rencana pelajaran lengkap.
                    
Berdasarkan Subjek Unit (Unit Subject), standar pendidikan, Deskripsi/Instruksi Unit (Unit Description/Instruction), Tingkat Kelas (Grade Level), Durasi periode kelas dalam menit (Duration of class period), dan Jumlah Pelajaran yang diminta (Number of Lessons), hasilkan respons JSON yang menyertakan UnitDescription yang kohesif dan daftar "wadah" pelajaran yang tidak tumpang tindih.

Subjek Unit:
{{$Subject}}

Nama Unit:
{{$Name}}

Deskripsi/Instruksi Unit:
{{$UserPrompt}}

Tingkat Kelas:
{{$GradeLevel}}

Durasi periode kelas dalam menit:
{{$ClassDuration}}
	
Standar untuk Diselaraskan:
{{$Standards}}
    
Siswa dengan dukungan individual:
{{$LearningPlans}}

Sumber daya/Media untuk digunakan:
{{$MediaContext}}
	
Konten Unit:
{{$AttachedUnit}}

Persyaratan Pertanyaan Esensial (Essential Questions):
- Setiap pertanyaan HARUS berupa kalimat lengkap yang benar secara tata bahasa dan diakhiri dengan tanda tanya.
- Setiap pertanyaan HARUS dimulai dengan kata "Bagaimana" (How) atau "Mengapa" (Why).
- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS fokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus subjek.
- Pertanyaan HARUS dapat ditransfer ke berbagai disiplin ilmu dan dapat diterapkan di luar unit ini.
- Pertanyaan HARUS digunakan kembali secara verbatim di setiap pelajaran dalam unit ini.

Apa yang harus dihasilkan:
- Output HARUS berupa JSON valid yang cocok dengan skema.
- WAJIB: Isi penuh semua properti di dalam objek "UnitDescription":
  - "Description": Tulis paragraf 4-5 kalimat yang menjelaskan fokus inti unit dan alur naratifnya.
  - "StudentLearningObjectives": Daftar 3-5 tujuan pembelajaran utama yang terukur untuk unit tersebut.
  - "StandardsAligned": Daftar semua standar yang dibahas di seluruh unit.
  - "EssentialQuestions": Tepat 3 pertanyaan konseptual yang mengikuti aturan di atas.
- HASILKAN daftar "Lessons" yang berisi tepat {{$NumberOfItems}} pelajaran.
  - Setiap pelajaran harus menyertakan "lessonNumber" (indeks berbasis 1), "lessonName", dan "lessonDescription" (2–4 kalimat yang menjelaskan cakupan pelajaran).

Batasan:
- Jaga agar unit dan setiap pelajaran tetap selaras dengan fokus unit.
- Pastikan pengurutan yang logis dari ide-ide mendasar ke pemodelan yang lebih kompleks.
- Akurasi: Semua konten harus akurat secara ilmiah dan sesuai usia.

Output HARUS berupa JSON valid yang cocok dengan skema. Gunakan format ringkas (tidak ada baris kosong ekstra).
`,
  PER_LESSON_PROMPT_TEMPLATE: `
Buat SATU rencana pelajaran KULIAH/CERAMAH (BUKAN rencana unit, BUKAN beberapa pelajaran) menggunakan info di bawah ini.
Anda HARUS menghasilkan JSON valid yang cocok dengan skema JSON yang disediakan secara tepat. Jangan sertakan kunci ekstra apa pun. Gunakan format JSON ringkas (tidak ada baris kosong ekstra).
Subjek Unit: 
{{$Subject}}
Nama Unit: 
{{$Name}}
Deskripsi/Instruksi Unit: 
{{$UserPrompt}}
Tingkat Kelas: 
{{$GradeLevel}}
Durasi periode kelas dalam menit 
{{$ClassDuration}}
Sumber daya/Media untuk digunakan: 
{{$MediaContext}}
Konten Unit: 
{{$ParentUnitData}}
Standar untuk Diselaraskan:
{{$Standards}}
Konten Pelajaran Terlampir: 
{{$AttachedLesson}}

Pertanyaan Esensial Unit (GUNAKAN INI SECARA VERBATIM):
{{$UnitEssentialQuestions}}

Jika Pertanyaan Esensial Unit di atas kosong, hasilkan tepat 3 pertanyaan konseptual mengikuti aturan ini:
- Setiap pertanyaan HARUS berupa kalimat lengkap yang benar secara tata bahasa dan diakhiri dengan tanda tanya.
- Setiap pertanyaan HARUS dimulai dengan kata "Bagaimana" (How) atau "Mengapa" (Why).
- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS fokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus subjek.
- Pertanyaan HARUS dapat ditransfer ke berbagai disiplin ilmu dan dapat diterapkan di luar unit ini.


SISWA DENGAN DUKUNGAN INDIVIDUAL (HARUS digunakan HANYA di dalam Experiment.AccommodationsAndModifications; gunakan nama siswa/rencana persis seperti yang tertulis):
{{$LearningPlans}}

ATURAN KONTEN PENTING:
- Jaga agar pelajaran tetap selaras dengan fokus unit: mengembangkan dan menggunakan model untuk menggambarkan komposisi atom dari molekul sederhana dan/atau struktur yang diperluas.
- Sertakan koneksi tingkat tinggi yang singkat ke DCI relevan lainnya jika sesuai, tetapi jaga agar pelajaran tetap berpusat pada pemodelan dan penalaran struktur-properti (tidak ada matematika mendalam, tidak ada penyeimbangan persamaan kecuali jika diharuskan secara eksplisit oleh standar).
- Pastikan semua bagian pelajaran mencerminkan Cakupan/Batasan Pelajaran yang disediakan dalam konteks unit; hindari memperkenalkan konsep utama baru yang termasuk dalam pelajaran lain.
- EssentialQuestions: HARUS persis sama dengan pertanyaan esensial tingkat unit (teks sama, urutan sama).
- AssessPriorKnowledge: HANYA jika LessonNumber == 1, isi objek seperti yang didefinisikan dalam skema. Untuk SEMUA PELAJARAN LAINNYA, Anda HARUS mengembalikan objek kosong {} tanpa kunci di dalamnya. JANGAN gunakan placeholder seperti "N/A", "none", atau array kosong.
- Fase Lab (Question, Research, Hypothesize, Experiment, Analyze, Share): Ikuti persyaratan instruksi spesifik dan string "Purpose:" untuk setiap fase seperti yang didefinisikan dalam skema JSON.
- Experiment.AccommodationsAndModifications harus menyertakan dukungan umum diikuti oleh dukungan individual untuk setiap siswa yang disediakan dalam {{$LearningPlans}}.
- Saat menyarankan "bingkai kalimat" (sentence frames) atau "pemula kalimat" (sentence starters) di mana pun dalam rencana pelajaran (terutama di Individualized Supports), Anda HARUS menyediakan kalimat lengkap yang spesifik dan disesuaikan dengan konten pelajaran sehingga guru dapat menggunakannya secara langsung.
- StudentPractice HARUS menyertakan paragraf TeacherNotes yang dimulai dengan 'These tasks reinforce today’s learning about ____ by ______.', daftar 2-3 tugas dengan DOK 2-4 dan kriteria keberhasilan, dan interleaving jika subjeknya adalah matematika.

PERSYARATAN OUTPUT:
- Output HARUS berupa JSON valid yang cocok dengan skema yang disediakan secara tepat.
- Output HARUS berupa rencana pelajaran TUNGGAL saja.
- Tanpa HTML. Tanpa emoji. Tanpa markdown. Teks biasa di dalam bidang string.
`,
  HTML_LESSON_PROMPT_TEMPLATE: `Anda akan menerima SATU objek JSON yang secara ketat mengikuti skema LabUnitPlanResponse. Tugas Anda adalah mengubah JSON ini menjadi HTML yang bersih dan mudah dibaca untuk satu pelajaran.

FORMAT INPUT
Saya akan mengirimkan objek JSON seperti ini:

UNIT PLAN JSON:
{{{JsonResponse}}}

Perlakukan semua setelah baris “UNIT PLAN JSON:” sebagai objek JSON yang tepat. JANGAN menjelaskan atau mengomentarinya; cukup parse dan render.

ATURAN GLOBAL
    - Hasilkan HANYA HTML yang valid (tanpa markdown, tanpa backticks, tanpa penjelasan prosa).
    - Tag yang diizinkan: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - JANGAN gunakan tag lain (tanpa <main>, <section>, <header>, <div>, <h4>, dll.).
    - HTML harus diindentasi dengan baik dan mudah dibaca.
    - Dalam <ol> atau <ul> apa pun, HANYA gunakan elemen <li> sebagai anak langsung. Jangan pernah menempatkan <p>, <span>, <ul>, <ol>, atau tag lainnya sebagai anak dari daftar.
    - JANGAN membuat konten instruksional baru; gunakan hanya apa yang ada di bidang JSON.
    - Pertahankan urutan logis yang tersirat oleh skema:
    - Di dalam setiap pelajaran, ikuti urutan bidang skema.
    - Jika bidang string kosong (""), LEWATI subbagian tersebut beserta labelnya.
    - Jika array kosong, lewati tajuknya dan <ul> atau <ol> yang sesuai.
    - Kapan pun teks tersebut jelas membentuk daftar perintah/pertanyaan/pernyataan/respons, gunakan <ul><li>…</li></ul> atau <ol><li>…</li></ol>. Jika tidak, gunakan <p>.
    - Kapan pun Anda merender respons siswa model/yang diharapkan di bagian APA PUN, gunakan pola ini:
        - Pertama: <p>✅ Jawaban Siswa yang Diharapkan</p> (tanpa poin-poin pada baris ini)
        - Kemudian daftar <ul> atau <ol> yang berisi respons (satu respons per <li>).
    - Kapan pun Anda merender Pemeriksaan Cepat (Quick Check):
        - Gunakan tajuk tepat ini: <h3><span>✔ Pemeriksaan Cepat</span></h3>
        - Sertakan penyelarasan strategi dan kemudian perintah (pertanyaan/tugas) dalam tanda kutip.
        - Gunakan pola global ✅Jawaban Siswa yang Diharapkan untuk jawaban.
    - Gunakan emoji jika ada dalam aturan pemetaan berikut.

ATURAN PEMETAAN:

PERTAMA, selalu buat 4 bagian pengantar ini jika data tersedia di JSON:
- <h3>💭 Pertanyaan Esensial</h3> (jika tersedia, daftar UL dari EssentialQuestions)
- <h3>🔤 Kosakata Kunci</h3> (daftar UL dari KeyVocabulary)
- <h3>🎯 Tujuan Pembelajaran Siswa</h3> (daftar UL dari StudentLearningObjectives)
- <h3>📏 Standar yang Diselaraskan</h3> (daftar UL dari StandardsAligned. Meskipun inputnya adalah string tunggal, parse standar dan render sebagai daftar berpoin <ul><li>...</li></ul>)

KEMUDIAN, lanjutkan ke BAGIAN 0:

BAGIAN 0: EVALUASI PENGETAHUAN AWAL (KONDISIONAL)
==================================================
KONDISI: Render bagian ini HANYA jika pelajaran saat ini adalah Pelajaran 1. Untuk semua pelajaran lainnya, lewati seluruh bagian ini (jangan render APA PUN, bahkan tajuknya).

PEMERIKSAAN KRITIS: Sebelum merender HTML apa pun untuk bagian ini, lihat objek AssessPriorKnowledge.
- Jika AssessPriorKnowledge adalah {} (objek kosong), ATAU jika SayIntroduction adalah "", null, " ", atau "N/A", LEWATI BAGIAN INI DAN LANJUTKAN KE BAGIAN BERIKUTNYA. JANGAN menghentikan pembuatan keseluruhan.
- Untuk semua pelajaran lainnya (Pelajaran 2, 3, dll.), Anda HARUS melewati seluruh bagian ini tanpa memandang kontennya.

JIKA (dan hanya jika) pelajaran saat ini adalah Pelajaran 1 DAN AssessPriorKnowledge berisi konten nyata:
<h3>💡 Evaluasi Pengetahuan Awal</h3>
<p><strong>Catatan Guru:</strong> Mengaktifkan pengetahuan awal siswa bukan sekadar pemanasan—ini adalah kerja ilmu saraf (neurosains). Proses ini mengaktifkan jalur saraf yang ada, sehingga memudahkan otak untuk mengaitkan informasi baru dengan apa yang sudah diketahui. Teknik ini, yang disebut pengodean elaboratif, membantu siswa memindahkan pengetahuan ke memori jangka panjang secara lebih cepat dan efektif, meningkatkan pemahaman dan retensi.</p>
  - <p><strong>Katakan:</strong> “{SayIntroduction}”</p>
  - <p>Tampilkan atau bacakan pernyataan berikut satu per satu:</p>
  - <ul>{StatementsToProject}</ul> (setiap item sebagai <li>“Pernyataan”</li>)
  - <p><strong>Katakan:</strong> “{SayInstructions}”</p>
  - <p><strong>✅ Jawaban Siswa yang Diharapkan</strong></p>
  - <ul>{ExpectedStudentResponses}</ul> (setiap item sebagai <li>“Pernyataan” → Jawaban</li>)
  - <p><strong>Katakan:</strong> “{SayConclusion}”</p>
  - <p>{ActionConclusion}</p>
  - <p><strong>Opsi Alternatif</strong></p>
  - <ul>{AlternateOptions}</ul> (setiap item sebagai <li><strong>NamaOpsi:</strong> Deskripsi</li>)
- Jika pelajaran saat ini BUKAN Pelajaran 1, lewati seluruh bagian ini (jangan render APA PUN untuk AssessPriorKnowledge).



- <h3><span style="color: rgb(115, 191, 39);">Tujuan {Duration}</span></h3>
  - <p><strong>Tujuan/Maksud:</strong> Mengamati fenomena, mengidentifikasi sesuatu yang membingungkan, dan menyusun pertanyaan bermakna yang akan memandu penyelidikan.</p>
  - <p><strong>📚 Bahan dan Alat</strong></p> <ul>{Materials}</ul> (setiap item sebagai <li>)
  - <p><strong>📋 Instruksi untuk Guru</strong></p> <ol>{InstructionsForTeachers}</ol> (setiap item sebagai <li>)

- <h3><span style="color: rgb(115, 191, 39);">Penyampaian Materi & Aktivitas Interaktif {Duration}</span></h3>
  - <p><strong>📚 Bahan dan Alat</strong></p>
    - <p><strong>Materi Khusus Guru:</strong></p> <ul>{TeacherOnlyMaterials}</ul> (setiap item sebagai <li>)
    - <p><strong>Materi Siswa:</strong></p> <ul>{StudentMaterials}</ul> (setiap item sebagai <li>)
  - <p><strong>📋 Instruksi untuk Guru</strong></p>
    - <p><strong>Pemikat (Hook)</strong></p> <ul>{Hook}</ul> (setiap item sebagai <li>)
    - <p><strong>Kosakata</strong></p> <ul>{Vocabulary}</ul> (setiap item sebagai <li>)
    - <p><strong>Klarifikasi Tujuan</strong></p> <ul>{ClarifyObjective}</ul> (setiap item sebagai <li>)
    - <p><strong>Konsep & Pengetahuan Baru</strong></p> <ul>{NewConceptsAndKnowledge}</ul> (setiap item sebagai <li>)
    - <p><strong>⚡ Pengaturan Ulang Perhatian & Aktivitas Interaktif (1-3 menit)</strong></p>
      - <p>{StandardParagraph}</p>
      - <p><strong>Petunjuk:</strong></p> <ul>{Directions}</ul> (setiap item sebagai <li>)
      - <p><strong>Mengapa ini berhasil:</strong></p> <ul>{WhyThisWorks}</ul> (setiap item sebagai <li>)
    - <p><strong>Melanjutkan Instruksi Setelah Aktivitas</strong></p> <ul>{ContinueInstruction}</ul> (setiap item sebagai <li>)
- <p><strong>⚠️ Miskonsepsi yang Diantisipasi</strong></p>
      - Ulangi untuk AnticipatedMisconceptions:
        <p>{Misconception} (Pastikan TIDAK ADA tag tebal/strong yang digunakan di sini)</p>
        <ul><li>{TeacherResponse} (Pastikan TIDAK ADA tag tebal/strong yang digunakan di sini)</li></ul>
- <h3><span style="color: rgb(115, 191, 39);">Hubungkan (3 min)</span></h3>
  - <p><strong>💭 Pertanyaan Esensial:</strong> {EssentialQuestionVerbatim}</p>
  - <p><strong>Katakan:</strong> “{ConnectToEQ.Say}”</p>
  - <p><strong>Pertanyaan Pemandu (Prompts):</strong></p>
  - <ul>{ConnectToEQ.Prompts}</ul> (setiap item sebagai <li>)
  - <p>✅ Jawaban Siswa yang Diharapkan</p>
  - <ul>{ExpectedStudentResponses}</ul> (setiap item sebagai <li>)

- <h3><span>🪜 Diferensiasi</span></h3>
  - <p><strong>Siswa Pembelajar Bahasa</strong></p> <ul>{LanguageLearners}</ul> (setiap item sebagai <li>)
  - <p><strong>Siswa yang Membutuhkan Perancah (Scaffolding) Tambahan</strong></p> <ul>{StudentsInNeedOfAdditionalScaffolding}</ul> (setiap item sebagai <li>)
  - <p><strong>Sains Mendalam (Go Deeper)</strong></p>
    - <ul>{GoDeeper.Challenges}</ul> (setiap item sebagai <li>)
    - <p>✅ Jawaban Siswa yang Diharapkan</p>
    - <ul>{GoDeeper.ExpectedStudentResponses}</ul> (setiap item sebagai <li>)

- <h3><span>🤝 Akomodasi & Modifikasi</span></h3>
  - <p><strong>Dukungan Umum:</strong></p> <ul>{GeneralSupports}</ul> (setiap item sebagai <li>)
  - <p><strong>Dukungan Individual:</strong></p> {IndividualizedSupports} (untuk setiap siswa, format namanya sebagai <p><strong><span style="color: rgb(240, 56, 40);">Nama:</span></strong></p>. Pisahkan dukungan spesifik mereka menjadi poin-poin terpisah dan tempatkan masing-masing dalam <li> di dalam <ul>)

- <h3><span style="color: rgb(115, 191, 39);">🧠 Tinjauan & Pemanggilan Kembali Berjarak (5 min)</span></h3>
  - <p><strong>Catatan Guru:</strong> [Hasilkan paragraf catatan guru singkat yang menjelaskan bagaimana strategi penarikan aktif ini memperkuat retensi dengan meminta siswa mengingat ide-ide kunci dari pelajaran setelah penundaan singkat. Hubungkan dengan pembelajaran spesifik dari pelajaran hari ini, dan sertakan refleksi transenden singkat yang membantu siswa melihat aplikasi/makna dunia nyata yang lebih luas dari konsep-konsep ini.]</p>
  - <h3><span>🔁 Pemanggilan Aktif (Active Recall)</span></h3>
  - <p><strong>Katakan:</strong> “{ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.Question}”</p> (Pastikan setiap perintah guru dimulai dengan tepat satu kata Katakan. Jika JSON sudah berisi "Katakan:", hapus sebelum membungkus.)
  - <p>✅ Jawaban Siswa yang Diharapkan</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.ExpectedStudentResponses}</ul> (setiap item sebagai <li>)
  - <h3><span>💭 Koneksi Pertanyaan Esensial</span></h3>
  - <p><strong>Katakan:</strong> “{ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.Question}”</p> (Pastikan setiap perintah guru dimulai dengan tepat satu kata Katakan. Jika JSON sudah berisi "Katakan:", hapus sebelum membungkus.)
  - <p>✅ Jawaban Siswa yang Diharapkan</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.ExpectedStudentResponses}</ul> (setiap item sebagai <li>)
  - <h3><span>⌛ Pemanggilan Kembali Berjarak (Spaced Retrieval)</span></h3>
  - <p>{ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.TeacherSay}</p> (Pastikan setiap perintah guru dimulai dengan tepat satu kata Katakan. Jika JSON sudah berisi "Katakan:", hapus sebelum membungkus. Pindahkan metadata apa pun "(Draws from...)" dalam teks agar ditata dengan jelas di awal perintah)
  - <p>✅ Jawaban Siswa yang Diharapkan</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.ExpectedStudentResponses}</ul> (setiap item sebagai <li>)

- <h3><span style="color: rgb(115, 191, 39);">Tanya Jawab dan Diskusi {Duration}</span></h3>
  - <p><strong>📋 Instruksi untuk Guru</strong></p>
    - <p>1. {QAndAAndDiscussion.InstructionsForTeachers.Step1_Invite}</p> (Pastikan setiap perintah guru dimulai dengan tepat satu kata Katakan. Jika JSON sudah berisi "Katakan:", hapus sebelum membungkus.)
    - <p>2. Ajukan Pertanyaan:</p>
    - <ul>{QAndAAndDiscussion.InstructionsForTeachers.Step2_AskQuestions}</ul> (setiap item sebagai <li>)
    - <p>3. {QAndAAndDiscussion.InstructionsForTeachers.Step3_Capture}</p> (Pastikan semua perintah guru seperti 'Katakan:' atau 'Catat:' dalam teks ditata dengan bersih.)
    - <p>4. {QAndAAndDiscussion.InstructionsForTeachers.Step4_Answer}</p> (Pastikan semua perintah guru seperti 'Katakan:' atau 'Tanggapi:' dalam teks ditata dengan bersih.)
  - <p>Catatan untuk Guru:</p>
  - <ul>
      <li>Menjawab pertanyaan yang terhubung langsung dengan tujuan hari ini</li>
      <li>“Menyimpan” pertanyaan yang lebih mendalam atau berorientasi masa depan dengan melingkari atau memberi tanda bintang</li>
      <li>Membahas kembali pertanyaan yang disimpan pada pelajaran mendatang untuk menunjukkan kesinambungan pembelajaran</li>
    </ul>

- <h3><span style="color: rgb(115, 191, 39);">Kesimpulan {Duration}</span></h3>
  - <p>{Conclusion.BuildCuriosity}</p> (Pastikan setiap perintah guru dimulai dengan tepat satu kata Katakan. Jika JSON sudah berisi "Katakan:", hapus sebelum membungkus.)

- <h3><span style="color: rgb(115, 191, 39);">✅Penilaian Formatif (5 min)</span></h3>
  - Dari teks biasa FormativeAssessment, ekstrak dan render Perintah 1–4 dalam struktur tepat ini (jangan membuat perintah; ekstrak dari teks; bersihkan pemformatan):
    - <p><strong>Pertanyaan 1 (DOK 1):</strong></p>
    - <p>{Prompt 1 question}</p>
    - <p>✅ Jawaban Siswa yang Diharapkan</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Pertanyaan 2 (DOK 2):</strong></p>
    - <p>{Prompt 2 question}</p>
    - <p>✅ Jawaban Siswa yang Diharapkan</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Pertanyaan 3 (DOK 3):</strong></p>
    - <p>{Prompt 3 question}</p>
    - <p>✅ Jawaban Siswa yang Diharapkan</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Pertanyaan 4 (DOK 4):</strong></p>
    - <p>{Prompt 4 question}</p>
    - <p>✅ Jawaban Siswa yang Diharapkan</p> <ul><li>{1–2 expected responses}</li></ul>

- <h3><span style="color: rgb(115, 191, 39);">🖋️ Praktik Siswa</span></h3>
  - <p><strong>Catatan Guru:</strong> {StudentPractice.TeacherNotes}</p>
  - Untuk setiap tugas di StudentPractice.Tasks:
    - <p>{task.TaskTitle} {task.Instruction}</p>
    - <p>✅ Jawaban Siswa yang Diharapkan</p>
    - <ul>{task.ExpectedStudentResponses}</ul> (setiap item sebagai <li>)
  - <p><strong>{StudentPractice.Reflection.Instruction}</strong></p>
  - <ul>{StudentPractice.Reflection.Prompts}</ul> (setiap item sebagai <li>)`,
  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `Anda akan menerima SATU objek JSON yang secara ketat mengikuti skema UnitPlanResponse (telah divalidasi di pihak saya). Tugas Anda adalah mengubah JSON ini menjadi HTML yang bersih dan mudah dibaca yang dapat digunakan guru secara langsung di kelas.
                   
FORMAT INPUT
Saya akan mengirimkan objek JSON seperti ini:

UNIT PLAN JSON:
{{{JsonResponse}}}

Perlakukan semua setelah baris “UNIT PLAN JSON:” sebagai objek JSON yang tepat. JANGAN menjelaskan atau mengomentarinya; cukup parse dan render.

ATURAN GLOBAL
    - Hasilkan HANYA HTML yang valid (tanpa markdown, tanpa backticks, tanpa penjelasan prosa).
    - Tag yang diizinkan: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - JANGAN gunakan tag lain (tanpa <main>, <section>, <header>, <div>, <h4>, dll.).
    - HTML harus diindentasi dengan baik dan mudah dibaca.
    - Dalam <ol> atau <ul> apa pun, HANYA gunakan elemen <li> sebagai anak langsung. Jangan pernah menempatkan <p>, <span>, <ul>, <ol>, atau tag lainnya sebagai anak dari daftar.
    - JANGAN membuat konten instruksional baru; gunakan hanya apa yang ada di bidang JSON.
    - Pertahankan urutan logis yang tersirat oleh skema.

- Di bagian atas:
    - <h1>Ikhtisar Rencana Unit (Unit Plan Overview)</h1>
    - <p>{{{UnitDescription.Description}}}</p>
- Kemudian tambahkan baris baru dengan:
    <h1>Ikhtisar Unit (Unit Overview)</h1>

- Pertanyaan Esensial (Essential Questions):
    - <h2>💭 Pertanyaan Esensial</h2>
    - <ul> dengan setiap item dari UnitDescription.EssentialQuestions sebagai <li>.

- Tujuan Pembelajaran Siswa (Student Learning Objectives):
    - <h2>🎯 Tujuan Pembelajaran Siswa</h2>
    - <ul> dengan setiap item dari UnitDescription.StudentLearningObjectives sebagai <li>.

- Standar:
    - <h2>📏 Standar yang Diselaraskan</h2>
    - <ul> dengan setiap string dari UnitDescription.StandardsAligned sebagai <li>.

- Kosakata Kunci (Key Vocabulary):
    - <h2>🔤 Kosakata Kunci</h2>
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
            "description": "Deskripsi unit sebagai satu paragraf teks biasa yang kohesif (4-5 kalimat lengkap) ditulis dengan suara guru alami yang dapat Anda katakan langsung kepada siswa. Tanpa HTML, tanpa emoji, tanpa poin-poin. Harus mengalir secara percakapan tetapi mengikuti struktur ini (tanpa tajuk): (1) kalimat kait yang memicu rasa ingin tahu atau membuat kontras yang mengejutkan, (2) kalimat 'Dalam unit ini, Anda akan...' tentang hasil penguasaan, (3) kalimat 'Anda akan memperkuat keterampilan Anda dalam...' tentang kemampuan berpikir/analisis, (4) kalimat 'Ini terhubung dengan...' tentang relevansi dunia nyata, (5) kalimat 'Memahami hal ini penting karena...' tentang signifikansi yang lebih luas atau dampak jangka panjang."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Buat pertanyaan esensial yang hanya berfokus pada konsep universal yang luas seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. JANGAN sebutkan istilah, proses, kosakata, atau contoh khusus subjek apa pun. Pertanyaan harus bersifat terbuka, dapat ditransfer ke semua disiplin ilmu, dan tidak mungkin dijawab hanya dengan mempelajari konten pelajaran atau unit. Fokus hanya pada ide-ide besar, bukan subjeknya.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Bagian 'Tujuan Pembelajaran Siswa' lengkap untuk seluruh unit ini. Setiap item daftar harus berupa tujuan terukur yang jelas yang dimulai dengan kata kerja yang dapat diukur dan diakhiri dengan label DOK dalam tanda kurung.",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "array",
            "description": "Daftar semua standar pendidikan unik yang digunakan di mana pun dalam unit ini dan pelajarannya. JANGAN tambahkan standar yang tidak muncul dalam konten unit. Setiap standar harus menyertakan kode standar dan deskripsi, misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem Bumi-matahari-bulan untuk menjelaskan pola siklus fase bulan, gerhana, dan musim.'",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Bagian 'Kosakata Kunci' lengkap sebagai daftar string. Setiap string harus berupa satu istilah dengan definisi yang dipisahkan oleh tanda hubung/minus. Contoh: 'Gravitasi - Gaya yang menarik benda-benda satu sama lain'. Semua definisi harus singkat, sesuai usia, dan berhubungan langsung dengan konten pelajaran.",
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
        "description": "Daftar wadah pelajaran untuk unit ini (garis besar saja). Setiap item harus tidak tumpang tindih dan dicakup dengan jelas sehingga konten pelajaran tidak berulang di seluruh pelajaran.",
        "items": {
          "type": "object",
          "properties": {
            "lessonNumber": {
              "type": "integer",
              "description": "Nomor urut pelajaran. Berbasis 1."
            },
            "lessonTitle": {
              "type": "string",
              "description": "Judul pelajaran singkat sebagai teks biasa."
            },
            "lessonOutline": {
              "type": "string",
              "description": "2-4 kalimat yang menjelaskan cakupan, fokus, dan batasan pelajaran untuk mencegah tumpang tindih dengan pelajaran lain."
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
        "type": "array",
        "description": "Cukup tempelkan semua pertanyaan esensial yang dihasilkan di tingkat unit dalam urutan yang sama.",
        "items": { "type": "string" }
      },
      "KeyVocabulary": {
        "type": "array",
        "description": "Daftar istilah kosakata dengan definisi (misalnya, 'Solar System - Tata Surya dan semua...'). HANYA sertakan istilah yang digunakan secara aktif dalam pelajaran khusus ini.",
        "items": { "type": "string" }
      },
      "StudentLearningObjectives": {
        "type": "array",
        "description": "Bagian 'Tujuan Pembelajaran Siswa' lengkap sebagai teks biasa. Setiap item harus berupa tujuan yang jelas dan terukur yang dimulai dengan kata kerja tindakan dan diakhiri dengan label DOK dalam tanda kurung.",
        "minItems": 2,
        "maxItems": 3,
        "items": { "type": "string" }
      },
      "StandardsAligned": {
        "type": "string",
        "description": "Bagian 'Standar Diselaraskan' lengkap sebagai teks biasa untuk pelajaran ini. Setiap standar harus menyertakan kode standar dan deskripsi, dan kode serta deskripsi harus sama persis dengan yang digunakan di Unit. misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem Bumi-matahari-bulan untuk menjelaskan pola siklus fase bulan, gerhana, dan musim.'"
      },
      "AssessPriorKnowledge": {
        "type": "object",
        "description": "Bagian 'Nilai Pengetahuan Awal' lengkap. KRITIS: Lihat 'lessonNumber' di Konten Pelajaran Terlampir. JIKA ini Pelajaran 1, isi objek ini sepenuhnya. JIKA ini Pelajaran 2, 3, atau pelajaran lainnya, ANDA HARUS MENGEMBALIKAN OBJEK KOSONG {} tanpa properti. Jangan isi ini untuk pelajaran selain Pelajaran 1. Untuk Pelajaran 1, struktur harus mencakup:",
        "properties": {
          "SayIntroduction": { "type": "string", "description": "Apa yang guru katakan untuk memperkenalkan aktivitas." },
          "StatementsToProject": { "type": "array", "items": { "type": "string" }, "description": "Daftar pernyataan untuk diproyeksikan atau dibaca, berisi gagasan yang akurat dan kesalahpahaman umum." },
          "SayInstructions": { "type": "string", "description": "Apa yang guru katakan untuk menginstruksikan siswa tentang apa yang harus dilakukan dengan pernyataan tersebut." },
          "ExpectedStudentResponses": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Tanggapan/tanda siswa yang diharapkan untuk setiap pernyataan."
          },
          "SayConclusion": { "type": "string", "description": "Apa yang guru katakan untuk menyimpulkan." },
          "ActionConclusion": { "type": "string", "description": "Tindakan guru untuk menyimpulkan (misalnya, menggambar diagram)." },
          "AlternateOptions": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Daftar opsi alternatif untuk aktivitas tersebut."
          }
        },
        "required": ["SayIntroduction", "StatementsToProject", "SayInstructions", "ExpectedStudentResponses", "SayConclusion", "ActionConclusion", "AlternateOptions"],
        "additionalProperties": false
      },
      "Objective": {
        "type": "object",
        "description": "Buat bagian Tujuan yang menyatakan dengan jelas sasaran pembelajaran siswa untuk pelajaran tersebut.",
        "properties": {
          "Duration": { "type": "string", "description": "Estimasi waktu (misalnya, '(2-3 min)')" },
          "Materials": { "type": "array", "items": { "type": "string" } },
          "InstructionsForTeachers": { "type": "array", "items": { "type": "string" }, "description": "Harus mencakup: 1) Jelaskan sasaran pembelajaran menggunakan naskah langsung yang menghadap guru (misalnya, Katakan: '...') dalam bahasa yang jelas dan ramah siswa. 2) Minta siswa untuk mencatat tujuan di buku catatan mereka. 3) Beri tahu guru secara singkat cara menghubungkan tujuan dengan pengalaman kehidupan nyata siswa." }
        },
        "required": ["Duration", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ContentDeliveryAndInteractiveActivities": {
        "type": "object",
        "description": "Blok untuk penyampaian konten.",
        "properties": {
          "Duration": { "type": "string", "description": "Estimasi waktu (misalnya, '(30 min)')" },
          "Materials": {
            "type": "object",
            "properties": {
              "TeacherOnlyMaterials": { "type": "array", "items": { "type": "string" } },
              "StudentMaterials": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["TeacherOnlyMaterials", "StudentMaterials"],
            "additionalProperties": false
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Hook": { "type": "array", "items": { "type": "string" }, "description": "Tulis kait (hook) keterlibatan tinggi yang dramatis yang disampaikan melalui naskah guru. Harus mengejutkan, membangun rasa ingin tahu, dan terikat pada konsep utama." },
              "Vocabulary": { "type": "array", "items": { "type": "string" }, "description": "Daftar istilah kosakata esensial. Berikan naskah guru untuk mendefinisikan setiap istilah yang diformat secara ketat sebagai: '[Term] - Katakan: \"[Definition/Script]\"'. Contoh: 'Tuas - Katakan: \"Tuas adalah mesin sederhana...\"'." },
              "ClarifyObjective": { "type": "array", "items": { "type": "string" }, "description": "Klarifikasi tujuan pembelajaran siswa hari ini untuk pelajaran khusus ini dengan membagikan naskah untuk guru." },
              "NewConceptsAndKnowledge": { "type": "array", "items": { "type": "string" }, "description": "Tulis kuliah guru yang terperinci dengan naskah (Katakan: “…”). Sertakan langkah demi langkah apa yang dikatakan guru, lakukan, dan mungkin demonstrasikan. Uraikan ide-ide kompleks, berikan contoh/analogi, buat hubungan eksplisit dengan pengetahuan awal." },
              "AttentionReset": {
                "type": "object",
                "description": "Masukkan paragraf pengaturan ulang perhatian standar persis seperti yang tertulis: 'Aktivitas ini memicu kembali perhatian, mengatur ulang fokus kognitif, dan memperkuat konsep dengan gerakan + kebaruan sambil memberikan pratinjau yang bertujuan.'",
                "properties": {
                  "StandardParagraph": { "type": "string", "description": "Harus persis: 'Aktivitas ini memicu kembali perhatian, mengatur ulang fokus kognitif, dan memperkuat konsep dengan gerakan + kebaruan sambil memberikan pratinjau yang bertujuan.'" },
                  "Directions": { "type": "array", "items": { "type": "string" }, "description": "Berikan petunjuk untuk aktivitas tersebut, termasuk naskah guru dan apa yang perlu dilakukan oleh siswa & guru." },
                  "WhyThisWorks": { "type": "array", "items": { "type": "string" }, "description": "Jelaskan dalam poin-poin mengapa aktivitas berfungsi untuk keterlibatan kembali perhatian, mengatur ulang fokus kognitif, memperkuat konsep dan pratinjau yang bertujuan. Misalnya, 'Berdiri + berputar mengatur ulang perhatian'." }
                },
                "required": ["StandardParagraph", "Directions", "WhyThisWorks"],
                "additionalProperties": false
              },
              "ContinueInstruction": { "type": "array", "items": { "type": "string" }, "description": "Kuliah guru terperinci dengan naskah (Katakan: “…”). Uraikan ide-ide kompleks, berikan contoh/analogi untuk memicu minat, bayangkan pembelajaran masa depan, perluas ide-ide kunci." },
              "AnticipatedMisconceptions": {
                "type": "array",
                "description": "Daftar kesalahpahaman umum siswa yang diantisipasi untuk memastikan guru siap.",
                "items": {
                  "type": "object",
                  "properties": {
                    "Misconception": { "type": "string" },
                    "TeacherResponse": { "type": "string", "description": "Cara merespons secara efektif potensi kesalahpahaman siswa dan memandu mereka ke pemahaman yang akurat." }
                  },
                  "required": ["Misconception", "TeacherResponse"],
                  "additionalProperties": false
                }
              },
              "Connect": {
                "type": "object",
                "description": "Hubungkan dengan suatu tujuan. Hubungkan ke salah satu pertanyaan esensial.",
                "properties": {
                  "EssentialQuestionVerbatim": { "type": "string", "description": "Gunakan pertanyaan esensial yang disediakan secara verbatim." },
                  "ConnectToEQ": {
                    "type": "object",
                    "properties": {
                      "Say": { "type": "string", "description": "Naskah guru yang menghubungkan aktivitas sebelumnya ke Pertanyaan Esensial." },
                      "Prompts": { "type": "array", "items": { "type": "string" }, "description": "Perintah/pertanyaan khusus untuk siswa." }
                    },
                    "required": ["Say", "Prompts"],
                    "additionalProperties": false
                  },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "Tanggapan siswa mendalam yang diharapkan yang menggunakan penalaran atau bukti." }
                },
                "required": ["EssentialQuestionVerbatim", "ConnectToEQ", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "Differentiation": {
                "type": "object",
                "description": "Diferensiasi instruksi (cara mengajar, bukan menyederhanakan materi). Variasikan kompleksitas dan kedalaman, tingkatkan keterlibatan aktif/bahasa. Realistis untuk kelas.",
                "properties": {
                  "LanguageLearners": { "type": "array", "items": { "type": "string" } },
                  "StudentsInNeedOfAdditionalScaffolding": { "type": "array", "items": { "type": "string" } },
                  "GoDeeper": {
                    "type": "object",
                    "properties": {
                      "Challenges": { "type": "array", "items": { "type": "string" } },
                      "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                    },
                    "required": ["Challenges", "ExpectedStudentResponses"],
                    "additionalProperties": false
                  }
                },
                "required": ["LanguageLearners", "StudentsInNeedOfAdditionalScaffolding", "GoDeeper"],
                "additionalProperties": false
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "description": "Daftar semua siswa dengan rencana pembelajaran dalam font merah. Kelompokkan siswa dengan dukungan bersama. Fokus pada akses.",
                "properties": {
                  "GeneralSupports": { "type": "array", "items": { "type": "string" }, "description": "Strategi non-spesifik siswa yang meningkatkan akses untuk semua peserta didik (misalnya, visual, catatan pra-isi, glosarium digital, instruksi terpotong-potong)." },
                  "IndividualizedSupports": { "type": "array", "items": { "type": "string" }, "description": "Akomodasi dan modifikasi khusus untuk siswa yang ditunjuk dengan rencana formal. Tulis nama dalam font MERAH. Jika seorang siswa membutuhkan bingkai/pemula kalimat, Anda HARUS menyediakan bingkai/pemula kalimat konkret yang disesuaikan dengan konten pelajaran ini." }
                },
                "required": ["GeneralSupports", "IndividualizedSupports"],
                "additionalProperties": false
              }
            },
            "required": [
              "Hook", "Vocabulary", "ClarifyObjective", "NewConceptsAndKnowledge", "AttentionReset",
              "ContinueInstruction", "AnticipatedMisconceptions", "Connect",
              "Differentiation", "AccommodationsAndModifications"
            ],
            "additionalProperties": false
          }
        },
        "required": ["Duration", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "object",
        "description": "Bagian 'Tinjauan & Pengingatan Spasi' lengkap. Aktivitas 5 menit ini harus mencakup: 1. Instruksi untuk Guru berisi: - Perintah Pengingatan Aktif (Active Recall) menggunakan berbagi pasangan/kelompok - Tanggapan Siswa yang Diharapkan (2-3 contoh berpoin) 2. Koneksi Pertanyaan Esensial 3. Komponen Pengingatan Spasi (Spaced Retrieval) berisi: - Referensi jelas ke pelajaran sebelumnya yang spesifik - Pertanyaan yang menghubungkan konsep masa lalu + saat ini - Kriteria keberhasilan / tanggapan yang diharapkan. Semua bagian harus menggunakan pernyataan 'Katakan:' untuk perintah guru dan label 'Respon Siswa yang Diharapkan' yang menunjukkan 2-3 contoh jawaban.",
        "properties": {
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Panduan langkah demi langkah guru untuk sesi tinjauan dan pengingatan spasi selama 5 menit.",
            "properties": {
              "ActiveRecall": {
                "type": "object",
                "description": "Minta siswa mengingat pembelajaran kunci dari pelajaran hari ini hanya menggunakan bukti dari kuliah/aktivitas.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "Naskah guru khusus (dimulai dengan 'Katakan:') yang meminta siswa untuk merenungkan pelajaran hari ini dan apa yang diungkapkannya."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "3-4 contoh tanggapan siswa berkualitas tinggi yang menunjukkan pemahaman yang jelas.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "EssentialQuestionConnection": {
                "type": "object",
                "description": "Bantu siswa menghubungkan konsep spesifik hari ini ke pertanyaan esensial unit yang lebih luas.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "Naskah guru (dimulai dengan 'Katakan:') yang menghubungkan temuan hari ini ke salah satu pertanyaan esensial unit."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 contoh bagaimana siswa membenarkan koneksi tersebut.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "SpacedRetrieval": {
                "type": "object",
                "description": "Kunjungi kembali konsep dari unit atau pelajaran sebelumnya untuk memperkuat retensi kumulatif.",
                "properties": {
                  "TeacherSay": {
                    "type": "string",
                    "description": "Naskah guru (dimulai dengan 'Katakan:') yang secara eksplisit menghubungkan konsep dari pelajaran sebelumnya dengan pekerjaan hari ini. Harus menyertakan referensi meta (misalnya, '(Diambil dari Unit 1, Pelajaran 2.)') langsung di dalam teks."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 contoh tanggapan yang diharapkan.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["TeacherSay", "ExpectedStudentResponses"],
                "additionalProperties": false
              }
            },
            "required": ["ActiveRecall", "EssentialQuestionConnection", "SpacedRetrieval"],
            "additionalProperties": false
          }
        },
        "required": ["InstructionsForTeachers"],
        "additionalProperties": false
      },
      "QAndAAndDiscussion": {
        "type": "object",
        "description": "Blok untuk Tanya Jawab dan Diskusi.",
        "properties": {
          "Duration": { "type": "string", "description": "Estimasi waktu (misalnya, '(5 min)')" },
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Panduan guru untuk sesi tanya jawab dan diskusi.",
            "properties": {
              "Step1_Invite": {
                "type": "string",
                "description": "Undang pertanyaan siswa, dimulai dengan 'Katakan:' (misalnya, 'Katakan: “Sekarang adalah kesempatan Anda untuk memikirkan tentang apa yang kita pelajari dan mengidentifikasi apa pun yang masih dirasa penting untuk dijelajahi.”')"
              },
              "Step2_AskQuestions": {
                "type": "array",
                "description": "3-4 pertanyaan guru yang terhubung dengan pelajaran hari ini, menghindari kata 'bingung' atau 'tidak mengerti' tetapi tetap menunjukkan ketidakpastian.",
                "items": { "type": "string" }
              },
              "Step3_Capture": {
                "type": "string",
                "description": "Petunjuk untuk menangkap pertanyaan termasuk 'Katakan:', 'Catat:', dan pernyataan 'Katakan:' lainnya (misalnya, 'Katakan: “Jika Anda memiliki pertanyaan, itu berarti Anda berpikir mendalam. Mari kita catat ide-ide tersebut.” Catat: Tulis pertanyaan siswa pada grafik berjudul “Pertanyaan yang Masih Kita Miliki.” Katakan: “Kami akan terus menambahkan grafik ini di seluruh unit. Beberapa pertanyaan mungkin kami jawab hari ini, dan yang lain akan kami selidiki di pelajaran mendatang.”')"
              },
              "Step4_Answer": {
                "type": "string",
                "description": "Petunjuk untuk menjawab pertanyaan termasuk 'Katakan:', 'Tanggapi:', dan pernyataan 'Katakan:' lainnya (misalnya, 'Katakan: “Mari kita lihat pertanyaan kita. Mana yang dapat kita jawab menggunakan apa yang kita pelajari hari ini?” Tanggapi: Atasi beberapa pertanyaan menggunakan tanggapan dan bukti siswa. Katakan: “Beberapa dari pertanyaan ini akan membantu memandu apa yang kita pelajari selanjutnya. Ilmuwan tidak menjawab semuanya sekaligus—mereka terus membangun pemahaman seiring waktu.”') "
              }
            },
            "required": ["Step1_Invite", "Step2_AskQuestions", "Step3_Capture", "Step4_Answer"],
            "additionalProperties": false
          }
        },
        "required": ["Duration", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Conclusion": {
        "type": "object",
        "description": "Blok untuk kesimpulan.",
        "properties": {
          "Duration": { "type": "string", "description": "Estimasi waktu (misalnya, '(1 min)')" },
          "BuildCuriosity": {
            "type": "string",
            "description": "Pratinjau pelajaran berikutnya yang membangun rasa ingin tahu dan menciptakan ketegangan, dimulai dengan 'Katakan:'. Harus setidaknya sepanjang 3-4 kalimat (atau lebih jika masuk akal untuk membangun rasa ingin tahu yang lebih dalam)."
          }
        },
        "required": ["Duration", "BuildCuriosity"],
        "additionalProperties": false
      },
      "FormativeAssessment": {
        "type": "string",
        "description": "Bagian 'Penilaian Formatif' lengkap sebagai teks biasa. Harus mengikuti struktur ini: Paragraf pengantar yang menghadap guru yang secara singkat menyatakan tujuan dan cara menerapkannya. 4 perintah pertanyaan yang diperlukan berlabel 'Prompt 1 (DOK 1):', 'Prompt 2 (DOK 2):', dll. yang mencakup tingkat DOK 1-4. Untuk setiap perintah: - Pertanyaan yang menguji pemahaman pada tingkat DOK yang dinyatakan - Header 'Respon Siswa yang Diharapkan' (tanpa tanda centang/emoji) - 1-2 respons kalimat lengkap yang menunjukkan penguasaan. Akhiri dengan paragraf pendek yang menyebutkan strategi penilaian formatif spesifik yang akan digunakan (misalnya, 'Exit Ticket', 'Think-Pair-Share'). Contoh format: Prompt 1 (DOK 1): 'Mengapa planet tetap berada di orbitnya alih-alih melayang ke luar angkasa?' Respon Siswa yang Diharapkan 'Karena gerakan maju mereka dan gravitasi Matahari bekerja sama untuk menciptakan orbit yang stabil.' [Lanjutkan dengan Prompt 2-4 mengikuti struktur yang sama]"
      },
      "StudentPractice": {
        "type": "object",
        "description": "Bagian 'Praktik Siswa' lengkap untuk pekerjaan rumah / latihan di luar kelas.",
        "properties": {
          "TeacherNotes": {
            "type": "string",
            "description": "Harus mengikuti templat ini persis, mengisi bagian yang dikurung: 'Tugas pekerjaan rumah ini memperkuat pembelajaran hari ini tentang [masukkan konsep pelajaran] dengan meminta siswa mengamati pola dunia nyata dan menjelaskannya menggunakan konsep yang diperkenalkan di kelas. Dengan menerapkan ide kelas secara mandiri, siswa memperkuat retensi jangka panjang dan membangun kemampuan untuk mentransfer pemikiran ilmiah ke pengalaman sehari-hari.'"
          },
          "Tasks": {
            "type": "array",
            "description": "Hasilkan 3 tugas yang mencakup tingkat DOK 2 dan 3.",
            "items": {
              "type": "object",
              "properties": {
                "TaskTitle": { "type": "string", "description": "misalnya, '1. (DOK 2)'" },
                "Instruction": { "type": "string", "description": "Petunjuk siswa langkah demi langkah yang jelas untuk tugas tersebut." },
                "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "Tanggapan siswa yang diharapkan. JANGAN sertakan tanda centang/emoji." }
              },
              "required": ["TaskTitle", "Instruction", "ExpectedStudentResponses"],
              "additionalProperties": false
            }
          },
          "Reflection": {
            "type": "object",
            "properties": {
              "Instruction": { "type": "string", "description": "misalnya, '4. Refleksi: Tulis 2-3 kalimat yang menanggapi satu perintah:'" },
              "Prompts": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["Instruction", "Prompts"],
            "additionalProperties": false
          }
        },
        "required": ["TeacherNotes", "Tasks", "Reflection"],
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
    "additionalProperties": false
  }
};
