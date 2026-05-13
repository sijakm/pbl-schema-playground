window.promptsID = {
  STEP0_PROMPT_TEMPLATE: `Buat HANYA kerangka unit INQUIRY (Langkah 0) menggunakan info di bawah. JANGAN buat rencana unit lengkap dan JANGAN tulis rencana pelajaran lengkap.

Anda HARUS menghasilkan JSON valid yang sesuai dengan skema JSON yang disediakan: UnitPlanResponse. Jangan sertakan kunci tambahan apa pun. Gunakan format JSON ringkas (tanpa baris kosong tambahan atau spasi putih di antara properti JSON). Tanpa HTML. Tanpa emoji. Teks biasa di dalam bidang string.

Subjek Unit: {{$Subject}}
Nama Unit: {{$Name}}
Deskripsi/Instruksi Unit: {{$UserPrompt}}
Tingkat Kelas: {{$GradeLevel}}
Durasi jam pelajaran dalam menit: {{$ClassDuration}}
Jumlah Pelajaran yang Diminta: {{$NumberOfItems}}
Standar yang Harus Diselaraskan (gunakan kata demi kata jika ada; JANGAN tambahkan standar baru): {{$Standards}}
Siswa dengan dukungan individual (hanya konteks): {{$LearningPlans}}
Sumber Daya/Media yang digunakan: {{$MediaContext}}
Konten Unit: {{$AttachedUnit}}
Konten Pelajaran Terlampir (jika ada): {{$AttachedLesson}}

PERSYARATAN KERANGKA INQUIRY:
- Ini mengutamakan penyelidikan (inquiry-first). Pelajaran HARUS maju melalui alur ini:
  (1) fenomena/pengalaman + mengamati/bertanya-tanya,
  (2) memilih pertanyaan + merencanakan penyelidikan,
  (3) pengumpulan bukti + menemukan pola,
  (4) pembangunan model + revisi menggunakan bukti,
  (5) penjelasan/argumen + komunikasi + transfer.
- Pertahankan pembuatan makna melalui penemuan: siswa membangun dan merevisi model menggunakan observasi dan data sederhana; tekankan bukti, penalaran, dan komunikasi.
- Pertahankan penyelarasan HANYA pada standar yang disediakan. JANGAN tambahkan standar atau kerangka kerja baru apa pun.
- Relevansi budaya & inklusi: sertakan konteks atau perspektif yang relevan dengan komunitas secara singkat tanpa stereotip.
- Interleaving & transfer: tinjau kembali keterampilan di seluruh pelajaran (mengamati, memodelkan, berargumen dari bukti, berkomunikasi).
- Pelajaran HARUS tidak tumpang tindih dengan batasan yang jelas.

KENDALA ARRAY PELAJARAN:
- Array Lessons HARUS berisi tepat {{$NumberOfItems}} pelajaran.
- lessonNumber berbasis 1 dan meningkat secara ketat sebesar 1.
- Pastikan urutan logis dari langkah-langkah penyelidikan dasar ke pemodelan dan penjelasan yang lebih kompleks.
- Kecepatan harus sesuai dengan jam pelajaran {{$ClassDuration}} menit pada kelas {{$GradeLevel}}.

ATURAN OUTPUT:
Kembalikan HANYA JSON yang tervalidasi terhadap skema UnitPlanResponse.`,

  PER_LESSON_PROMPT_TEMPLATE: `Buat SATU rencana pelajaran penyelidikan (BUKAN rencana unit, BUKAN beberapa pelajaran) menggunakan info di bawah. Anda HARUS menghasilkan JSON valid yang sesuai dengan skema JSON yang disediakan: InquiryUnitPlanResponse. Jangan sertakan kunci tambahan apa pun. Gunakan format JSON ringkas (tanpa baris kosong tambahan atau spasi putih di antara properti JSON). Tanpa HTML. Tanpa emoji. Tanpa markdown. Teks biasa di dalam bidang string.

Subjek Unit: {{$Subject}}
Nama Unit: {{$Name}}
Deskripsi/Instruksi Unit: {{$UserPrompt}}
Tingkat Kelas: {{$GradeLevel}}
Durasi jam pelajaran dalam menit: {{$ClassDuration}}
Standar yang Harus Diselaraskan (gunakan kata demi kata jika ada; JANGAN tambahkan standar baru): {{$Standards}}
Siswa dengan dukungan individual (HARUS digunakan HANYA di dalam InvestigationPhase.AccommodationsAndModifications; gunakan nama/rencana siswa persis seperti yang tertulis): {{$LearningPlans}}
Sumber Daya/Media yang digunakan: {{$MediaContext}}
Konten Unit: {{$AttachedUnit}}

Elemen Unit dan Pelajaran dari Langkah 0 (gunakan kata demi kata):
{{$ParentUnitData}}
- UnitDescription.EssentialQuestions (persis seperti yang disediakan; gunakan kembali kata demi kata jika relevan): {{$UnitEssentialQuestions}}

Konten Pelajaran Terlampir (jika ada): {{$AttachedLesson}}

PERSYARATAN ALUR PELAJARAN INQUIRY:
- Pelajaran ini harus mengikuti alur penyelidikan dan diselaraskan dengan batasan kerangka pelajaran: Orientation → Conceptualization → Investigation → Conclusion → Discussion.
- Pertahankan pembuatan makna melalui penemuan: siswa membangun dan merevisi ide menggunakan observasi dan data sederhana; tekankan bukti, penalaran, dan komunikasi.
- Relevansi budaya & inklusi: sertakan konteks atau perspektif yang relevan dengan komunitas secara singkat tanpa stereotip.
- JANGAN perkenalkan konsep utama baru yang termasuk dalam pelajaran lain; tetap berada dalam cakupan dan batasan kerangka pelajaran ini.
- Pertahankan penyelarasan HANYA pada standar yang disediakan. JANGAN tambahkan standar atau kerangka kerja baru apa pun.
- Tindakan guru harus memandu pemikiran tanpa memberikan penjelasan ilmiah secara langsung.

ATURAN KHUSUS BIDANG (peta ke skema):
- AssessPriorKnowledge: HANYA jika nomor pelajaran adalah 1, tulis 150–250 kata dan ikuti struktur yang diperlukan dalam deskripsi skema; jika tidak, kembalikan "".
- InvestigationPhase.AccommodationsAndModifications:
  - General: sertakan dukungan umum.
  - IndividualSupport: array harus menyertakan siswa yang disediakan dan rencana mereka secara tepat (nama/rencana yang sama; tidak ada siswa tambahan; tidak ada siswa yang hilang).

ATURAN OUTPUT:
Kembalikan HANYA JSON yang tervalidasi terhadap skema InquiryUnitPlanResponse.`,

  HTML_LESSON_PROMPT_TEMPLATE: `Anda adalah pemformat HTML instruksional profesional yang menulis untuk guru kelas.

ATURAN KRITIS
- Output HANYA HTML yang valid.
- JANGAN tambahkan penjelasan atau komentar.
- JANGAN mengarang konten.
- Tag yang diperbolehkan HANYA: <p>, <h3>, <strong>, <em>, <span>, <ul>, <li>
- Daftar HANYA boleh berisi <li> sebagai anak langsung.
- TANPA daftar bersarang.
- TANPA <p> di dalam <li>.
- Jaga urutan bagian PERSIS seperti yang ditentukan di bawah ini. JANGAN ubah urutan.

--------------------------------
JSON INPUT (InquiryUnitPlanResponse untuk SATU pelajaran):
{{$LessonInquiryJson}}
--------------------------------

TUGAS
Ubah JSON INPUT menjadi HTML yang menghadap guru menggunakan HANYA tag yang diperbolehkan dan mengikuti aturan perenderan dan struktur yang tepat di bawah ini.

Pertama render pertanyaan esensial dan standar yang diselaraskan:
<h3>💭 Pertanyaan Esensial</h3>
<ul>
  - Render setiap item dari EssentialQuestions sebagai <li>.
</ul>

<h3>🎯 Tujuan Pembelajaran Siswa</h3>
<ul>
  - Render setiap item dari StudentLearningObjectives sebagai <li>.
</ul>

<h3>📏 Standar yang Diselaraskan</h3>
<ul>
  - Render setiap item dari StandardsAligned sebagai <li>.
</ul>

<h3>🔤 Kosakata Kunci</h3>
<ul>
  - Render setiap item dari KeyVocabulary sebagai <li>.
</ul>

==================================================
BAGIAN 0: ASESMEN PENGETAHUAN AWAL (KONDISIONAL)
==================================================
HANYA render bagian ini jika AssessPriorKnowledge BUKAN string kosong.

STRUKTUR BAKU (HARUS DIIKUTI PERSIS):

<h3><span>💡 Asesmen Pengetahuan Awal</span></h3>

<p><strong>Catatan Guru:</strong> Mengaktifkan pengetahuan awal siswa bukan sekadar pemanasan—ini adalah aksi neurosains. Proses ini mengaktifkan jalur saraf yang ada, sehingga memudahkan otak untuk menempelkan informasi baru pada apa yang sudah diketahui. Teknik ini, yang disebut pengkodean elaboratif, membantu siswa memindahkan pengetahuan ke memori jangka panjang lebih cepat dan lebih efektif, meningkatkan pemahaman dan retensi.</p>

Kemudian render:

<p><strong>Katakan:</strong></p>
- Satu atau lebih elemen <p> yang mensintesis pembicaraan guru (bahkan jika "Katakan:" tidak muncul secara eksplisit dalam input).

Tugas siswa / prompt / pernyataan:
- Render sebagai <ul> (catatan: <ol> BUKAN tag yang diperbolehkan, jadi Anda HARUS menggunakan <ul>).
- Setiap item harus berupa SATU <li>
- TANPA tag lain di dalam <li>

Respon yang diharapkan:
<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  <li>...</li>
</ul>

Opsi alternatif (jika ada):
<p><strong>Opsi Alternatif:</strong></p>
<ul>
  <li>...</li>
</ul>

==================================================
BAGIAN 1: FASE ORIENTASI – MENDEFINISIKAN MASALAH
==================================================

<h3><span style="color: rgb(115, 191, 39);">Fase Orientasi – Mendefinisikan Masalah (5 mnt)</span></h3>

<p><strong>Tujuan:</strong> Siswa diperkenalkan dengan misteri nyata yang memicu rasa ingin tahu dan memotivasi penyelidikan. Mereka mengenali masalah dan mengaktifkan pengetahuan awal untuk bersiap menghadapi penyelidikan yang lebih dalam.</p>

<p><strong>📚Materi:</strong></p>
<ul>
  - Render setiap item dari OrientationPhase.Materials sebagai <li>. Jika kosong, output <li>Tidak ada</li>.
</ul>

<p><strong>📋Instruksi untuk Guru</strong></p>

<p><strong>Libatkan – Perkenalkan fenomena dengan cara yang memicu rasa ingin tahu tanpa menjelaskannya.</strong></p>
<p><strong>Katakan:</strong> {OrientationPhase.InstructionsForTeachers.Engage.Prompt}</p>
<p>Langkah Fasilitasi:</p>
<ul>
  - Untuk setiap langkah dalam OrientationPhase.InstructionsForTeachers.Engage.FacilitationMoves, render sebagai <li>.
  <li><strong>Prompt dengan pertanyaan seperti:</strong> {OrientationPhase.InstructionsForTeachers.Engage.PromptingOptions}</li>
</ul>

<p><strong>Hubungkan – Bantu siswa menghubungkan observasi mereka dengan misteri yang lebih luas yang akan mendasari penyelidikan.</strong></p>
<p><strong>Katakan:</strong> {OrientationPhase.InstructionsForTeachers.Connect.Prompt}</p>
<p>Langkah Fasilitasi:</p>
<ul>
  <li><strong>Prompt dengan pertanyaan seperti:</strong> {OrientationPhase.InstructionsForTeachers.Connect.PromptingOptions}</li>
  - Untuk setiap langkah dalam OrientationPhase.InstructionsForTeachers.Connect.FacilitationMoves, render sebagai <li>.
</ul>

<p><strong>Aktifkan – Arahkan siswa ke pembuatan makna kolaboratif.</strong></p>
<p><strong>Katakan:</strong> {OrientationPhase.InstructionsForTeachers.Activate.Prompt}</p>
<p>Langkah Fasilitasi:</p>
<ul>
  - Untuk setiap langkah dalam OrientationPhase.InstructionsForTeachers.Activate.FacilitationMoves, render sebagai <li>.
  <li><strong>Prompt dengan pertanyaan seperti:</strong> {OrientationPhase.InstructionsForTeachers.Activate.PromptingOptions}</li>
</ul>

<p><strong>Selidiki – Dorong penyempurnaan pemikiran dengan mendorong siswa untuk memeriksa asumsi.</strong></p>
<p><strong>Katakan:</strong> {OrientationPhase.InstructionsForTeachers.Probe.Prompt}</p>
<p>Langkah Fasilitasi:</p>
<ul>
  <li><strong>Prompt dengan pertanyaan seperti:</strong> {OrientationPhase.InstructionsForTeachers.Probe.PromptingOptions}</li>
  - Untuk setiap langkah dalam OrientationPhase.InstructionsForTeachers.Probe.FacilitationMoves, render sebagai <li>.
</ul>
<p>{OrientationPhase.InstructionsForTeachers.Probe.Closing}</p>

==================================================
BAGIAN 2: FASE KONSEPTUALISASI – PERTANYAAN PENELITIAN + RENCANA AKSI
==================================================

<h3><span style="color: rgb(115, 191, 39);">Fase Konseptualisasi – Pertanyaan Penelitian + Rencana Aksi (10 mnt)</span></h3>

<p><strong>Tujuan:</strong> Siswa menghasilkan pertanyaan penelitian yang bermakna, memilih pertanyaan sentral untuk diselidiki, dan membuat rencana aksi yang akan memandu proses penyelidikan mereka.</p>

<p><strong>📚Materi:</strong></p>
<ul>
  - Render setiap item dari ConceptualizationPhase.Materials sebagai <li>. Jika kosong, output <li>Tidak ada</li>.
</ul>

<p><strong>📋Instruksi untuk Guru</strong></p>

<p><strong>Pandu Pembuatan Pertanyaan – Perkenalkan penyelidikan dengan memicu rasa ingin tahu, bukan menyampaikan konten.</strong></p>
<p><strong>Katakan:</strong> {ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.Prompt}</p>
<p>Langkah Fasilitasi:</p>
<ul>
  - Untuk setiap langkah dalam ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.FacilitationMoves, render sebagai <li>.
  <li><strong>Prompt dengan pertanyaan seperti:</strong> {ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.PromptingOptions}</li>
</ul>

<p><strong>Identifikasi Pertanyaan Penelitian – Bantu siswa secara kolaboratif memutuskan pertanyaan mana yang paling berguna untuk diselidiki.</strong></p>
<p><strong>Katakan:</strong> {ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.Prompt}</p>
<p>Langkah Fasilitasi:</p>
<ul>
  - Untuk setiap langkah dalam ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.FacilitationMoves, render sebagai <li>.
  <li><strong>Prompt dengan pertanyaan seperti:</strong> {ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.PromptingOptions}</li>
</ul>

<p><strong>Buat Rencana Aksi – Dukung siswa dalam merancang penyelidikan mereka sendiri daripada memberi mereka rencana jadi.</strong></p>
<p><strong>Katakan:</strong> {ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.Prompt}</p>
<p>Langkah Fasilitasi:</p>
<ul>
  - Untuk setiap langkah dalam ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.FacilitationMoves, render sebagai <li>.
  <li><strong>Prompt dengan pertanyaan seperti:</strong> {ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.PromptingOptions}</li>
</ul>

==================================================
BAGIAN 3: FASE PENYELIDIKAN
==================================================

<h3><span style="color: rgb(115, 191, 39);">Fase Penyelidikan – Eksplorasi + Penelitian + Eksperimen + Kumpul Data (15 mnt)</span></h3>

<p><strong>Tujuan:</strong> Siswa secara aktif mengeksplorasi fenomena melalui observasi, analisis model, dan pengumpulan bukti, membangun kumpulan data yang nantinya akan mereka gunakan untuk membentuk kesimpulan.</p>

<p><strong>📚Materi:</strong></p>
<ul>
  - Render setiap item dari InvestigationPhase.Materials sebagai <li>. Jika kosong, output <li>Tidak ada</li>.
</ul>

<p><strong>📋Instruksi untuk Guru</strong></p>

<p><strong>Luncurkan Penyelidikan – Perkenalkan tugas tanpa menjelaskan konten.</strong></p>
<p><strong>Katakan:</strong> {InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.Prompt}</p>
<p>Langkah Fasilitasi:</p>
<ul>
  - Untuk setiap langkah dalam InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.FacilitationMoves, render sebagai <li>.
  <li><strong>Prompt dengan pertanyaan seperti:</strong> {InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.PromptingOptions}</li>
</ul>

<p><strong>Ekspektasi Kolaborasi – Bingkai tugas sebagai tugas yang saling bergantung—setiap siswa berkontribusi pada analisis bersama.</strong></p>
<p><strong>Katakan:</strong> {InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.Prompt}</p>
<p>Langkah Fasilitasi:</p>
<ul>
  - Untuk setiap langkah/ekspektasi dalam InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.FacilitationMoves, render sebagai <li>.
  <li><strong>Prompt dengan pertanyaan seperti:</strong> {InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.PromptingOptions}</li>
</ul>

<p><strong>Prompt Keliling – Gunakan ini hanya saat berkeliling di antara kelompok.</strong></p>

<p><strong>Prompt Konseptual</strong></p>
<ul>
  - Untuk setiap langkah dalam InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Conceptual, render sebagai <li>.
</ul>

<p><strong>Prompt Penalaran</strong></p>
<ul>
  - Untuk setiap langkah dalam InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Reasoning, render sebagai <li>.
</ul>

<p><strong>Prompt Kolaborasi</strong></p>
<ul>
  - Untuk setiap langkah dalam InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Collaboration, render sebagai <li>.
</ul>

<p><strong>⚠️ Miskonsepsi yang Diantisipasi</strong></p>
- Untuk setiap item dalam InvestigationPhase.AnticipatedMisconceptions:
<p>{item.Misconception} (Pastikan TANPA penggunaan tag bold/strong di sini)</p>
<ul>
  <li>{item.TeacherResponse} (Pastikan TANPA penggunaan tag bold/strong di sini)</li>
</ul>

<h3><span>🪜 Diferensiasi</span></h3>

<p><strong>Pelajar Bahasa:</strong></p>
- Untuk setiap strategi dalam InvestigationPhase.Differentiation.LanguageLearners.Strategies:
<p>{strategy}</p>
<p>Gunakan kerangka kalimat untuk mendukung penjelasan dan penalaran:</p>
<ul>
  - Untuk setiap awal kalimat dalam InvestigationPhase.Differentiation.LanguageLearners.SentenceStarters, render sebagai <li>.
</ul>

<p><strong>Perancah Tambahan (Scaffolding):</strong></p>
- Untuk setiap strategi dalam InvestigationPhase.Differentiation.AdditionalScaffolding.Strategies:
<p>{strategy}</p>
<p>Tawarkan daftar periksa langkah demi langkah untuk memandu penyelidikan:</p>
<ul>
  - Untuk setiap item dalam InvestigationPhase.Differentiation.AdditionalScaffolding.Checklist, render sebagai <li>.
</ul>

<p><strong>Gali Lebih Dalam (Go Deeper):</strong></p>
- Untuk setiap strategi dalam InvestigationPhase.Differentiation.GoDeeper.Strategies:
<p>{strategy}</p>

<p>Pertanyaan Berpikir Tingkat Lanjut:</p>
<ul>
  <li>Katakan: "{InvestigationPhase.Differentiation.GoDeeper.AdvancedQuestion}"</li>
</ul>

<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  - Untuk setiap respon dalam InvestigationPhase.Differentiation.GoDeeper.ExpectedResponses, render sebagai <li>.
</ul>

<h3><span>🤝 Akomodasi & Modifikasi</span></h3>

<p><strong>Dukungan Umum:</strong></p>
<ul>
  <li>{Render InvestigationPhase.AccommodationsAndModifications.General}</li>
</ul>

<p><strong>Dukungan Individual:</strong></p>
- Untuk setiap item dalam InvestigationPhase.AccommodationsAndModifications.IndividualSupport render:
<p><strong><span style="color: rgb(240, 56, 40);">{StudentName}:</span></strong></p>
- Untuk setiap entri dalam InvestigationPhase.AccommodationsAndModifications.IndividualSupport.Plan:
<p>{entry.item}</p>
<ul>
  - Untuk setiap subItem dalam entry.subItems, render sebagai <li>.
</ul>

<h3><span>✔ Cek Cepat</span></h3>
<p>{InvestigationPhase.QuickCheck.Question}</p>
<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  - Untuk setiap respon dalam InvestigationPhase.QuickCheck.ExpectedResponses, render sebagai <li>.
</ul>

==================================================
BAGIAN 4: FASE KESIMPULAN
==================================================

<h3><span style="color: rgb(115, 191, 39);">Fase Kesimpulan – Analisis Temuan + Jawab Pertanyaan Penelitian (5 mnt)</span></h3>

<p><strong>Tujuan:</strong> Siswa menganalisis data yang mereka kumpulkan dan menggunakan bukti untuk menjawab pertanyaan penelitian, membentuk penjelasan yang jelas berdasarkan temuan mereka.</p>

<p><strong>📚Materi:</strong></p>
<ul>
  - Render setiap item dari ConclusionPhase.Materials sebagai <li>. Jika kosong, output <li>Tidak ada</li>.
</ul>

<p><strong>📋 Instruksi untuk Guru</strong></p>
<p>{ConclusionPhase.InstructionsForTeachers.OpeningScript}</p>
- Untuk setiap langkah dalam ConclusionPhase.InstructionsForTeachers.FacilitationMoves render sebagai <p>:
<p>{move}</p>

<p><strong>Prompt dengan pertanyaan seperti:</strong></p>
<ul>
  - Untuk setiap pertanyaan dalam ConclusionPhase.InstructionsForTeachers.ProbingQuestions, render sebagai <li>.
</ul>

- Untuk setiap langkah dalam ConclusionPhase.InstructionsForTeachers.FacilitationMoves (langkah tambahan jika ada), render sebagai <p>.
<p>{ConclusionPhase.InstructionsForTeachers.WritingPrompt}</p>
<p>{ConclusionPhase.InstructionsForTeachers.CollaborationInstruction}</p>
<p><em>{ConclusionPhase.InstructionsForTeachers.Guardrail}</em></p>

<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  - Untuk setiap respon dalam ConclusionPhase.ExpectedStudentResponses, render sebagai <li>.
</ul>

==================================================
BAGIAN 5: FASE DISKUSI
==================================================

<h3><span style="color: rgb(115, 191, 39);">Fase Diskusi – Implikasi + Makna + Penggunaan Masa Depan (5 mnt)</span></h3>

<p><strong>Tujuan:</strong> Membantu siswa beralih dari apa yang mereka temukan ke mengapa hal itu penting.</p>

<p><strong>📚Materi:</strong></p>
<ul>
  - Render setiap item dari DiscussionPhase.Materials sebagai <li>. Jika kosong, output <li>Tidak ada</li>.
</ul>

<p><strong>📋 Instruksi untuk Guru</strong></p>
<p>{DiscussionPhase.InstructionsForTeachers.OpeningScript}</p>
- Untuk setiap langkah dalam DiscussionPhase.InstructionsForTeachers.FacilitationMoves, render sebagai <p>:
<p>{move}</p>

<p><strong>Prompt dengan pertanyaan seperti:</strong></p>
<ul>
  - Untuk setiap pertanyaan dalam DiscussionPhase.InstructionsForTeachers.ProbingQuestions, render sebagai <li>.
</ul>

<h3><span>🌍 Pemikiran Transenden</span></h3>
<p>{DiscussionPhase.TranscendentThinking.Question}</p>

<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  - Untuk setiap respon dalam DiscussionPhase.ExpectedStudentResponses, render sebagai <li>.
</ul>

==================================================
BAGIAN 6: TINJAUAN & PENGAMBILAN BERJARAK
==================================================

Anda adalah pemformat HTML instruksional profesional. Tujuan Anda adalah mengubah data JSON menjadi panduan kelas yang bersih dan menghadap guru.

KENDALA HTML & GAYA:
- Output HANYA HTML yang valid menggunakan tag yang diperbolehkan.
- Setiap <li> harus berada di dalam <ul>. Jangan pernah memasukkan <p> di dalam <li>.
- Gunakan emoji sebagai penanda bagian seperti yang ditunjukkan dalam templat.

ATURAN PEMROSESAN KONTEN:
- Aturan Satu "Katakan": Pastikan setiap prompt guru dimulai dengan tepat satu <strong>Katakan:</strong>. Jika JSON sudah berisi "Say:", hapus sebelum membungkus.
- Migrasi Metadata: Untuk Pengambilan Berjarak (Spaced Retrieval), temukan info "(Draws from...)" dalam JSON. Pindahkan ke judul <strong> dan hapus dari isi "Katakan:".
- Kecerdasan: Jangan sekadar salin-tempel. Jika teks JSON berantakan, parafrase agar profesional dan jelas bagi guru TANPA mengarang ide baru.

RENDER KERANGKA INI PERSIS (isi placeholder dari JSON; jika Materi kosong output <li>Tidak ada</li>):

<h3><span>🧠 Tinjauan & Pengambilan Berjarak (5 mnt)</span></h3>

<p><strong>Catatan Guru:</strong> Strategi ini memperkuat retensi melalui pemanggilan aktif dan menghubungkan penyelidikan hari ini dengan ide-ide sains inti. Refleksi transenden membantu siswa mengenali bagaimana prinsip-prinsip sains memungkinkan orang untuk memecahkan masalah dunia nyata secara efisien. Ini memperkuat bahwa mengubah variabel memengaruhi hasil dalam suatu sistem.</p>

<h3><span>🔁 Pemanggilan Aktif</span></h3>
<p>[Bersihkan dan render ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.Question menggunakan Aturan Satu "Katakan"]</p>
<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  [Render ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.ExpectedStudentResponses sebagai item <li>]
</ul>

<h3><span>💭 Koneksi Pertanyaan Esensial</span></h3>
<p>[Bersihkan dan render ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.Question menggunakan Aturan Satu "Katakan"]</p>
<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  [Render ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.ExpectedStudentResponses sebagai item <li>]
</ul>

<h3><span>⏳ Pengambilan Berjarak</span></h3>
<p>[Bersihkan dan render ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.TeacherSay menggunakan migrasi metadata dan Aturan Satu "Katakan"]</p>
<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  [Render ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.ExpectedStudentResponses sebagai item <li>]
</ul>

==================================================
BAGIAN 7: ASESMEN FORMATIF
==================================================

<h3><span style="color: rgb(115, 191, 39);">✅Asesmen Formatif (5 mnt)</span></h3>

Dari teks biasa FormativeAssessment, ekstrak dan render Prompt 1–4 dalam struktur yang tepat ini (jangan mengarang prompt; ekstrak dari teks; bersihkan format):

<p><strong>Prompt 1 (DOK 1):</strong></p>
<p>{Pertanyaan prompt 1}</p>
<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  <li>{1–2 respon yang diharapkan}</li>
</ul>

<p><strong>Prompt 2 (DOK 2):</strong></p>
<p>{Pertanyaan prompt 2}</p>
<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  <li>{1–2 respon yang diharapkan}</li>
</ul>

<p><strong>Prompt 3 (DOK 3):</strong></p>
<p>{Pertanyaan prompt 3}</p>
<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  <li>{1–2 respon yang diharapkan}</li>
</ul>

<p><strong>Prompt 4 (DOK 4):</strong></p>
<p>{Pertanyaan prompt 4}</p>
<p>✅ Respon Siswa yang Diharapkan</p>
<ul>
  <li>{1–2 respon yang diharapkan}</li>
</ul>

==================================================
BAGIAN 8: PRAKTIK SISWA
==================================================

HEADING BAGIAN (HARUS):
<h3><span style="color: rgb(115, 191, 39);">🖋️ Praktik Siswa</span></h3>

<p><strong>Catatan Guru:</strong> Praktik ini membantu siswa memperluas pelajaran dengan menerapkan keterampilan penyelidikan pada situasi baru di luar kelas. Siswa akan terus membangun kebiasaan memperhatikan pola, menjelaskan pilihan dengan bukti, dan mempertimbangkan bagaimana perubahan desain memengaruhi hasil. Tugas-tugas tersebut juga menghubungkan pembelajaran dengan pemecahan masalah dunia nyata.</p>

- Untuk setiap tugas dalam StudentPractice.Tasks:
<p><strong>{task.TaskTitle}:</strong> {task.Instruction}</p>
<p>Kriteria Keberhasilan</p>
<ul>
  [Render {task.SuccessCriteria} sebagai item <li>]
</ul>

<p><strong>🔎 Refleksi:</strong></p>
<p>[Bersihkan dan render StudentPractice.Reflection.Instruction]</p>
<ul>
  [Render StudentPractice.Reflection.Prompts sebagai item <li>]
</ul>

ATURAN OUTPUT FINAL:
Kembalikan HANYA HTML gabungan untuk semua bagian secara berurutan. Tanpa teks pembungkus ekstra.`,

  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `Anda adalah pemformat HTML instruksional profesional yang menulis untuk guru kelas.

Anda akan menerima muatan JSON terstruktur yang mewakili informasi unit tingkat tinggi.

ATURAN KRITIS
- Output HANYA HTML yang valid.
- JANGAN tambahkan penjelasan atau komentar.
- JANGAN mengarang konten.
- JANGAN ulangi bagian.
- Tag yang diperbolehkan HANYA: <p>, <h2>, <h3>, <strong>, <em>, <span>, <ol>, <ul>, <li>
- Daftar HANYA boleh berisi <li> sebagai anak langsung.
- TANPA daftar bersarang.
- TANPA <p> di dalam <li>.

--------------------------------
BAGIAN 1: DESKRIPSI UNIT
--------------------------------
Render menggunakan templat PERSIS:

<h2><strong>{UnitTitle}</strong></h2>
<p>{UnitDescription}</p>
<h3><span>Ringkasan Unit</span></h3>

--------------------------------
BAGIAN 2: PERTANYAAN ESENSIAL
--------------------------------
<h3><span>💭Pertanyaan Esensial</span></h3>
Render sebagai daftar tidak berurutan (unordered list).

--------------------------------
BAGIAN 3: TUJUAN PEMBELAJARAN SISWA
--------------------------------
<h3><span>🎯Tujuan Pembelajaran Siswa</span></h3>
Render sebagai daftar tidak berurutan (unordered list).

--------------------------------
BAGIAN 4: STANDAR YANG DISELARASKAN
--------------------------------
<h3><span>📏Standar yang Diselaraskan</span></h3>
Render sebagai daftar tidak berurutan (unordered list).

--------------------------------
BAGIAN 5: KOSAKATA KUNCI
--------------------------------
<h3><span>🔤Kosakata Kunci</span></h3>
Render sebagai daftar berurutan (ordered list).

--------------------------------
JSON INPUT:
{{$UnitCommonJson}}
`,

  STEP0_SCHEMA: {
    "title": "UnitPlanResponse",
    "type": "object",
    "properties": {
      "UnitDescription": {
        "type": "object",
        "properties": {
          "Description": {
            "type": "string",
            "description": "Deskripsi unit sebagai satu paragraf teks biasa yang kohesif (4–5 kalimat lengkap) yang ditulis dengan suara guru alami yang dapat Anda sampaikan langsung kepada siswa. Tanpa HTML, tanpa emoji, tanpa poin-poin. Harus mengalir secara percakapan tetapi mengikuti struktur ini (tanpa tajuk): (1) kalimat pancingan yang memicu rasa ingin tahu atau membuat kontras yang mengejutkan, (2) kalimat 'Dalam unit ini, Anda akan...' tentang hasil penguasaan, (3) kalimat 'Anda akan memperkuat keterampilan Anda dalam...' tentang kemampuan berpikir/analisis, (4) kalimat 'Ini terhubung dengan...' tentang relevansi dunia nyata, (5) kalimat 'Memahami hal ini penting karena...' tentang signifikansi yang lebih luas atau dampak jangka panjang."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Buat pertanyaan esensial yang hanya berfokus pada konsep universal yang luas seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. JANGAN sebutkan istilah, proses, kosakata, atau contoh khusus subjek apa pun. Pertanyaan harus terbuka, dapat ditransfer ke semua disiplin ilmu, dan tidak mungkin dijawab hanya dengan mempelajari konten pelajaran atau unit. Fokus hanya pada ide-ide besar, bukan materi subjek.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Bagian 'Tujuan Pembelajaran Siswa' lengkap untuk seluruh unit ini. Setiap item daftar harus merupakan tujuan yang jelas dan terukur yang dimulai dengan kata kerja terukur dan diakhiri dengan label DOK dalam kurung.",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "array",
            "description": "Daftar semua standar pendidikan unik yang digunakan di mana pun dalam unit ini dan pelajarannya. JANGAN tambahkan standar yang tidak muncul dalam konten unit. Setiap standar harus menyertakan kode standar dan deskripsi, mis. 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem Bumi-matahari-bulan untuk mendeskripsikan pola siklus fase bulan, gerhana, dan musim.",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Bagian 'Kosakata Kunci' lengkap sebagai daftar string. Setiap string harus berupa satu istilah dengan definisi yang dipisahkan oleh tanda pisah/hubung. Contoh: 'Gravitasi - Gaya yang menarik benda-benda ke arah satu sama lain'. Semua definisi harus pendek, sesuai usia, dan terkait langsung dengan konten pelajaran.",
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
        "description": "Daftar kontainer pelajaran untuk unit ini (hanya kerangka). Setiap item harus tidak tumpang tindih dan dicakup dengan jelas sehingga konten pelajaran tidak berulang di seluruh pelajaran.",
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
              "description": "2–4 kalimat yang mendeskripsikan cakupan pelajaran, fokus, dan batasan untuk mencegah tumpang tindih dengan pelajaran lain."
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
    "properties": {
      "AssessPriorKnowledge": {
        "type": "string",
        "description": "Bagian 'Asesmen Pengetahuan Awal' lengkap sebagai teks biasa (total 150-250 kata). HANYA Pelajaran 1 yang harus berisi blok detail; SEMUA PELAJARAN LAIN HARUS MENGEMBALIKAN STRING KOSONG untuk bidang ini. Untuk Pelajaran 1, struktur harus menyertakan: 1. Sertakan bagian ini hanya pada pelajaran pertama unit, ditempatkan segera setelah Tujuan Pembelajaran Siswa. 2. Pastikan prompt DOK 1-3 digunakan. 3. Sertakan keterampilan prasyarat yang diperlukan untuk tujuan pembelajaran siswa. 4. Pilih satu modalitas dari daftar ini dan kembangkan sepenuhnya: tanya jawab, K-W-L (Catatan: jika K-W-L dipilih, pastikan strukturnya secara eksplisit adalah K: 'Apa yang Saya Tahu', W: 'Apa yang Ingin Saya Tahu', dan L: 'Apa yang Saya Pelajari' yang harus diisi SETELAH proses pembelajaran), visual, peta konsep, tulisan reflektif, panduan antisipasi, penilaian kosakata. 5. Prompt guru awal dengan pernyataan 'Katakan:' yang memperkenalkan modalitas yang dipilih dan menjelaskan bagaimana siswa akan memunculkan pemahaman saat ini. 6. Instruksi dan templat/struktur yang jelas untuk modalitas yang dipilih. 7. Bagian 'Respon Siswa yang Diharapkan' yang menunjukkan jawaban yang diantisipasi atau miskonsepsi umum untuk modalitas yang dipilih. 8. Prompt 'Katakan:' penutup guru yang memvalidasi pemikiran siswa dan memberikan pratinjau penyelidikan unit. 9. Setelah mengembangkan satu modalitas sepenuhnya, berikan 2 opsi alternatif singkat yang dapat dipilih guru."
      },
      "EssentialQuestions": {
        "type": "array",
        "description": "Cukup tempelkan semua pertanyaan esensial tingkat unit dalam urutan yang sama jika disediakan. Jika tidak disediakan, hasilkan tepat 3 pertanyaan konseptual yang hanya berfokus pada konsep universal yang luas seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. JANGAN sebutkan istilah, proses, kosakata, atau contoh khusus subjek apa pun. Pertanyaan harus terbuka, dapat ditransfer ke semua disiplin ilmu, dan tidak mungkin dijawab hanya dengan mempelajari konten pelajaran atau unit. Fokus hanya pada ide-ide besar, bukan materi subjek.",
        "items": { "type": "string" }
      },
      "StudentLearningObjectives": {
        "type": "array",
        "description": "Pilih kata demi kata tujuan pembelajaran siswa khusus untuk pelajaran ini dari tujuan tingkat unit yang disediakan dalam prompt. JANGAN mengarang tujuan baru. Anda harus menggunakan kembali kata-kata persis dari Step 0 UnitDescription.StudentLearningObjectives.",
        "items": { "type": "string" }
      },
      "StandardsAligned": {
        "type": "array",
        "description": "Daftar hanya standar pendidikan unik yang dibahas dalam pelajaran khusus ini. Setiap standar harus menyertakan kode standar dan deskripsi dan harus sama persis dengan yang digunakan dalam Unit. mis. 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem Bumi-matahari-bulan untuk mendeskripsikan pola siklus fase bulan, gerhana, dan musim.'",
        "items": { "type": "string" }
      },
      "KeyVocabulary": {
        "type": "array",
        "description": "Pilih kata demi kata kosakata kunci untuk pelajaran ini dari kosakata tingkat unit yang disediakan dalam prompt. JANGAN mengarang kata-kata baru. Anda harus menggunakan kembali kata-kata persis dari Step 0 UnitDescription.KeyVocabulary.",
        "items": { "type": "string" }
      },
      "OrientationPhase": {
        "type": "object",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Kata demi kata: 'Tujuan: Siswa diperkenalkan dengan misteri nyata yang memicu rasa ingin tahu dan memotivasi penyelidikan. Mereka mengenali masalah dan mengaktifkan pengetahuan awal untuk bersiap menghadapi penyelidikan yang lebih dalam.'"
          },
          "Materials": {
            "type": "array",
            "description": "Daftar materi yang dibutuhkan (mis. alat bantu visual, spidol, dll.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Engage": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Buat naskah untuk memperkenalkan fenomena tersebut. Pastikan fokus pada memicu rasa ingin tahu tanpa memberikan penjelasan ilmiah." },
                  "FacilitationMoves": { "type": "array", "description": "Hasilkan 2-3 langkah pedagogis khusus yang memandu observasi diam dan berbagi dengan pasangan. Sertakan naskah yang dimulai dengan 'Katakan:' (mis., 'Katakan: Ambil waktu 30 detik untuk melihat secara diam...'). Fokus pada menangkap dan mengorganisir observasi siswa ke dalam kategori yang bermakna dan mendorong berbagai perspektif.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Hasilkan 2-3 prompt khusus sebagai string tunggal untuk membantu siswa mengidentifikasi detail, memperhatikan pola, dan memunculkan rasa ingin tahu awal. Dorong siswa untuk menjelaskan mengapa detail tertentu terasa penting dan untuk membangun atau membandingkan observasi satu sama lain." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "Connect": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Buat naskah guru khusus (dimulai dengan 'Katakan:') yang membantu siswa mengubah observasi mereka tentang fenomena menjadi pertanyaan penelitian atau masalah sambil mengelompokkan ide ke dalam tema utama." },
                  "PromptingOptions": { "type": "string", "description": "Berikan 2-3 prompt khusus untuk membantu siswa menghubungkan observasi dengan tantangan yang mendasarinya, menjustifikasi pemikiran dengan bukti, dan memprioritaskan ide mana yang paling layak diselidiki." },
                  "FacilitationMoves": { "type": "array", "description": "Sarankan 2-3 langkah untuk mendukung siswa dalam menyempurnakan dan mengelompokkan ide-ide mereka, sambil mendesak mereka untuk menjelaskan penalaran mereka. Sertakan instruksi untuk mencatat dan menonjolkan pertanyaan yang berulang tanpa menjawabnya.", "items": { "type": "string" } }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves"],
                "additionalProperties": false
              },
              "Activate": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Kembangkan instruksi yang dipimpin guru ('Katakan:') untuk memfasilitasi diskusi pasangan atau kelompok yang menghasilkan ide, penjelasan, atau solusi khusus menggunakan informasi dan kendala yang tersedia. Dorong perbandingan dan penalaran." },
                  "PromptingOptions": { "type": "string", "description": "Daftar 2-3 prompt untuk mendorong siswa mengusulkan ide, menjelaskan penalaran, mempertimbangkan pendekatan alternatif, dan mengevaluasi bagian mana dari pemikiran mereka yang paling kuat atau paling tidak pasti." },
                  "FacilitationMoves": { "type": "array", "description": "Deskripsikan 2-3 langkah berkeliling untuk mendengarkan penalaran, mendesak kejelasan/justifikasi, and menonjolkan berbagai pendekatan tanpa mengevaluasi mana yang benar.", "items": { "type": "string" } }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves"],
                "additionalProperties": false
              },
              "Probe": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Buat naskah untuk mendorong siswa menyempurnakan dan menguji ide-ide mereka dengan memeriksa asumsi, mempertimbangkan kondisi yang berbeda, dan mengidentifikasi faktor kunci dari pelajaran ini." },
                  "PromptingOptions": { "type": "string", "description": "Sarankan 2-3 prompt khusus untuk menguji ide terhadap kondisi baru, mengidentifikasi kelemahan, dan merevisi pemikiran menggunakan bukti untuk fenomena pelajaran ini." },
                  "FacilitationMoves": { "type": "array", "description": "Berikan 2-3 langkah khusus untuk mendorong siswa meninjau kembali dan merevisi ide awal mereka berdasarkan bukti dan menjustifikasi perubahan dalam pemikiran mereka.", "items": { "type": "string" } },
                  "Closing": { "type": "string", "description": "Instruksi terakhir untuk mendorong siswa menguji dan merevisi ide-ide mereka, mempertimbangkan efek jangka panjang dan kondisi yang berubah, dan menggunakan bukti dari observasi untuk memperkuat atau menantang pemikiran mereka." }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves", "Closing"],
                "additionalProperties": false
              }
            },
            "required": ["Engage", "Connect", "Activate", "Probe"],
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
      "ConceptualizationPhase": {
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Kata demi kata: 'Tujuan: Siswa menghasilkan pertanyaan penelitian yang bermakna, memilih pertanyaan sentral untuk diselidiki, dan membuat rencana aksi yang akan memandu proses penyelidikan mereka.'"
          },
          "Materials": {
            "type": "array",
            "description": "Daftar materi yang dibutuhkan (mis. alat bantu visual, spidol, dll.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "GuideQuestionGeneration": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Buat naskah guru (dimulai dengan 'Katakan:') untuk memperkenalkan sesi brainstorming pertanyaan. Fokus pada beralih dari berbagi individu ke pasangan untuk memperluas ide." },
                  "FacilitationMoves": { "type": "array", "description": "Hasilkan 2-3 langkah khusus untuk mendukung pembuatan pertanyaan oleh siswa. Sertakan pemberian waktu berpikir, mencatat semua pertanyaan secara publik, dan mendorong siswa untuk menyempurnakan, menggabungkan, atau memperluas pertanyaan tanpa evaluasi yang menghakimi.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Hasilkan 2-3 prompt khusus untuk membantu siswa memunculkan rasa ingin tahu, mengidentifikasi apa yang ingin mereka pahami, dan fokus pada aspek kunci sistem atau desain." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "IdentifyResearchQuestion": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Buat naskah ('Katakan:') untuk memandu siswa dalam memilih pertanyaan yang akan membantu mereka belajar paling banyak dari model yang dapat diuji." },
                  "FacilitationMoves": { "type": "array", "description": "Sarankan 2-3 langkah untuk memandu siswa dalam memilah pertanyaan ke dalam tema dan membandingkan ide berdasarkan keterujian. Sertakan langkah-langkah untuk mendukung siswa dalam menyempurnakan pertanyaan luas menjadi penyelidikan yang jelas dengan mengidentifikasi variabel.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Hasilkan 2-3 prompt untuk membantu siswa mengevaluasi pertanyaan berdasarkan keterujian, kejelasan, fokus pada variabel, dan potensi untuk menghasilkan bukti yang berguna." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CreateAnActionPlan": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Buat naskah ('Katakan:') untuk mendorong siswa mendefinisikan apa yang akan mereka amati, ubah, dan kumpulkan sebagai bukti." },
                  "FacilitationMoves": { "type": "array", "description": "Deskripsikan 2-3 langkah untuk mendukung siswa dalam merancang rencana penyelidikan dan mengidentifikasi variabel. Sertakan langkah-langkah untuk mendesak siswa membuat rencana yang spesifik dan dapat diuji, dan pastikan mereka memiliki cara yang jelas untuk menentukan keberhasilan.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Berikan 2-3 prompt khusus untuk membantu siswa memperjelas apa yang akan mereka ubah, pertahankan sama, dan bagaimana mereka akan membandingkan hasil." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              }
            },
            "required": ["GuideQuestionGeneration", "IdentifyResearchQuestion", "CreateAnActionPlan"],
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
      "InvestigationPhase": {
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Tulis kata demi kata: Tujuan: Siswa secara aktif mengeksplorasi fenomena melalui observasi, analisis model, dan pengumpulan bukti, membangun kumpulan data yang nantinya akan mereka gunakan untuk membentuk kesimpulan"
          },
          "Materials": {
            "type": "array",
            "description": "Daftar materi yang dibutuhkan (mis. alat bantu visual, spidol, dll.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "LaunchInvestigation": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Buat instruksi guru untuk memperkenalkan skenario atau model yang membingungkan. Pertama berikan tindakan dalam kurung seperti [Tampilkan model, skenario, demonstrasi, atau cerita pendek yang menyertakan kekurangan, ketidakefisienan, atau hasil yang tidak terduga untuk memicu rasa ingin tahu], lalu berikan naskah percakapan yang dimulai dengan 'Katakan:'." },
                  "FacilitationMoves": { "type": "array", "description": "Hasilkan 2-3 langkah untuk memandu peluncuran. Nyatakan tindakan instruksional dengan jelas tanpa awalan 'Katakan:'. Sertakan memberi siswa waktu untuk mengamati sebelum bertindak, mendorong berbagai interpretasi, dan memperkuat bahwa mungkin ada beberapa ide yang valid.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Hasilkan 2-3 prompt khusus untuk membantu siswa memperhatikan fitur penting atau tidak terduga, menghasilkan penjelasan yang mungkin, dan menjustifikasi pemikiran dengan bukti." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CollaborationExpectations": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Buat naskah lisan (dimulai dengan 'Katakan:') untuk membingkai tugas sebagai tugas yang saling bergantung dan menekankan tanggung jawab bersama. Sertakan instruksi bagi siswa untuk menggunakan awal kalimat (mis., 'Saya pikir... karena...') dan struktur partisipasi seperti chip bicara." },
                  "FacilitationMoves": { "type": "array", "description": "Daftar 3-5 langkah khusus atau perilaku siswa untuk dipantau selama kerja kelompok (mis., mengidentifikasi pola, mencatat dalam tabel data bersama, membandingkan interpretasi). Jangan beri awalan tindakan ini dengan 'Katakan:'. Pastikan fokus pada semua siswa yang berkontribusi untuk mengamati dan menyempurnakan ide.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Berikan 2-3 prompt untuk mendorong siswa berbagi observasi, membandingkan interpretasi, menjustifikasi klaim dengan bukti, dan secara kolaboratif merevisi ide." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CirculationPrompts": {
                "type": "object",
                "description": "Prompt khusus yang akan digunakan oleh guru saat berkeliling di antara kelompok.",
                "properties": {
                  "Conceptual": { "type": "array", "description": "2-3 prompt yang berfokus pada konsep sains atau pelajaran utama (mis., 'Bukti apa yang menunjukkan ini berhasil?').", "items": { "type": "string" } },
                  "Reasoning": { "type": "array", "description": "2-3 prompt untuk mendesak justifikasi dan logika (mis., 'Bagaimana uji coba ini mengubah pemikiran Anda?').", "items": { "type": "string" } },
                  "Collaboration": { "type": "array", "description": "2-3 prompt untuk memastikan semua suara disertakan (mis., 'Siapa yang belum berkontribusi?').", "items": { "type": "string" } }
                },
                "required": ["Conceptual", "Reasoning", "Collaboration"],
                "additionalProperties": false
              }
            },
            "required": ["LaunchInvestigation", "CollaborationExpectations", "CirculationPrompts"],
            "additionalProperties": false
          },
          "AnticipatedMisconceptions": {
            "type": "array",
            "description": "Hasilkan 2-3 miskonsepsi umum siswa yang mungkin muncul selama pelajaran ini. Setiap item harus fokus pada kesalahpahaman khusus dan naskah respon guru.",
            "items": {
              "type": "object",
              "properties": {
                "Misconception": { "type": "string", "description": "Deskripsikan miskonsepsi dalam 1 kalimat, dimulai dengan 'Siswa mungkin berpikir...'. JANGAN gunakan tag bold atau strong apa pun." },
                "TeacherResponse": { "type": "string", "description": "Naskah respon yang menghadap guru dengan jelas (dimulai dengan 'Respon Guru: ') yang memodelkan cara merespon pada saat itu dengan prompt khusus (dimulai dengan 'Katakan:'). JANGAN gunakan tag bold atau strong apa pun." }
              },
              "required": ["Misconception", "TeacherResponse"],
              "additionalProperties": false
            }
          },
          "Differentiation": {
            "type": "object",
            "properties": {
              "LanguageLearners": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Hasilkan 2-3 dukungan khusus pelajaran (visual, bank kata, isyarat) untuk membantu pelajar bahasa mengakses dan mengekspresikan ide.", "items": { "type": "string" } },
                  "SentenceStarters": { "type": "array", "description": "Hasilkan 3-4 awal kalimat yang membantu siswa mendeskripsikan, menjelaskan, dan mengomunikasikan pemikiran mereka untuk pelajaran khusus ini.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "SentenceStarters"],
                "additionalProperties": false
              },
              "AdditionalScaffolding": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Hasilkan 2-3 dukungan langkah demi langkah (alat terstruktur, contoh model, berpikir keras) dan panduan tepat untuk membantu siswa menyelesaikan tugas.", "items": { "type": "string" } },
                  "Checklist": { "type": "array", "description": "Hasilkan 3-4 pertanyaan daftar periksa untuk memandu siswa dalam memahami pembelajaran mereka selama penyelidikan.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "Checklist"],
                "additionalProperties": false
              },
              "GoDeeper": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Hasilkan 2-3 ekstensi yang meningkatkan kompleksitas (tantangan khusus, identifikasi pola) untuk membantu siswa memperdalam atau meningkatkan pemikiran mereka menggunakan bukti.", "items": { "type": "string" } },
                  "AdvancedQuestion": { "type": "string", "description": "Hasilkan satu prompt/pertanyaan 'Katakan:' yang kompleks untuk mendesak pemahaman konseptual yang lebih dalam." },
                  "ExpectedResponses": { "type": "array", "description": "Hasilkan 3-4 contoh spesifik respon siswa berkualitas tinggi terhadap pertanyaan lanjutan.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "AdvancedQuestion", "ExpectedResponses"],
                "additionalProperties": false
              }
            },
            "required": ["LanguageLearners", "AdditionalScaffolding", "GoDeeper"],
            "additionalProperties": false
          },
          "AccommodationsAndModifications": {
            "type": "object",
            "description": "Akomodasi umum untuk kelas ditambah rencana dukungan siswa individual. Model HARUS menggunakan HANYA nama siswa dan rencana yang disediakan dalam prompt.",
            "properties": {
              "General": {
                "type": "string",
                "description": "Dukungan dan modifikasi kelas umum yang berlaku untuk sebagian besar atau semua siswa selama kegiatan ini."
              },
              "IndividualSupport": {
                "type": "array",
                "description": "Daftar akomodasi siswa khusus. Setiap entri HARUS menggunakan nama siswa dan rencana persis seperti yang disediakan dalam prompt.",
                "items": {
                  "type": "object",
                  "properties": {
                    "StudentName": {
                      "type": "string",
                      "description": "Nama lengkap siswa persis seperti yang disediakan dalam prompt."
                    },
                    "Plan": {
                      "type": "array",
                      "description": "Campuran instruksi dan sub-daftar. Setiap entri memiliki 'item' (sebagai paragraf) dan 'subItems' opsional (sebagai poin) untuk saat tugas perlu dipecah secara logis.",
                      "items": {
                        "type": "object",
                        "properties": {
                          "item": { "type": "string", "description": "Instruksi utama atau tajuk daftar." },
                          "subItems": { "type": "array", "description": "Langkah-langkah poin opsional atau contoh khusus yang terkait dengan item.", "items": { "type": "string" } }
                        },
                        "required": ["item", "subItems"],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "StudentName",
                    "Plan"
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
            "properties": {
              "Question": { "type": "string", "description": "Hasilkan satu pertanyaan 'Katakan:' khusus untuk mengecek pemahaman siswa selama atau di akhir penyelidikan." },
              "ExpectedResponses": { "type": "array", "description": "Hasilkan 3-4 respon siswa yang diharapkan yang menunjukkan penguasaan konsep pelajaran.", "items": { "type": "string" } }
            },
            "required": ["Question", "ExpectedResponses"],
            "additionalProperties": false
          }
        },
        "required": [
          "Purpose",
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
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Tulis kata demi kata: Tujuan: Siswa menganalisis data yang mereka kumpulkan dan menggunakan bukti untuk menjawab pertanyaan penelitian, membentuk penjelasan yang jelas berdasarkan temuan mereka."
          },
          "Materials": {
            "type": "array",
            "description": "Daftar materi yang dibutuhkan (mis. alat bantu visual, spidol, dll.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "OpeningScript": { "type": "string", "description": "Pernyataan 'Katakan:' untuk membawa siswa kembali ke pertanyaan penelitian dan memunculkan ide-ide yang muncul tentang bagaimana desain tersebut bekerja." },
              "FacilitationMoves": { "type": "array", "description": "2-3 langkah pedagogis untuk memberi siswa waktu meninjau data, mengidentifikasi pola, and membandingkan hasil melalui diskusi.", "items": { "type": "string" } },
              "ProbingQuestions": { "type": "array", "description": "3-4 pertanyaan khusus untuk mendesak siswa menjelaskan pola, menjustifikasi keputusan dengan bukti, dan mendeskripsikan hubungan sebab-akibat.", "items": { "type": "string" } },
              "WritingPrompt": { "type": "string", "description": "Pernyataan 'Katakan:' yang menguraikan apa yang harus disertakan dalam penjelasan tertulis mereka (komponen khusus konten) dan pengingat untuk menggunakan data sebagai bukti." },
              "CollaborationInstruction": { "type": "string", "description": "Instruksi bagi siswa untuk menulis secara mandiri kemudian berbagi dengan pasangan atau kelompok untuk menyempurnakan penalaran mereka." },
              "Guardrail": { "type": "string", "description": "Pengingat tegas bahwa guru JANGAN memberikan penjelasan ilmiah, tetapi sebaliknya mendesak siswa untuk menunjuk pada data." }
            },
            "required": ["OpeningScript", "FacilitationMoves", "ProbingQuestions", "WritingPrompt", "CollaborationInstruction", "Guardrail"],
            "additionalProperties": false
          },
          "ExpectedStudentResponses": {
            "type": "array",
            "description": "3-4 respon yang secara langsung menjawab pertanyaan penelitian menggunakan bukti dan penalaran sebab-akibat (mis., 'saat kami mengubah ___, ___ terjadi').",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "ExpectedStudentResponses"
        ],
        "additionalProperties": false
      },
      "DiscussionPhase": {
        "type": "object",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Tulis kata demi kata: Tujuan: Membantu siswa beralih dari apa yang mereka temukan ke mengapa hal itu penting."
          },
          "Materials": {
            "type": "array",
            "description": "Daftar materi yang dibutuhkan (mis. alat bantu visual, spidol, dll.)",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "OpeningScript": { "type": "string", "description": "Pernyataan 'Katakan:' untuk mendorong siswa memikirkan implikasi yang lebih luas dari bukti mereka di luar kelas." },
              "FacilitationMoves": { "type": "array", "description": "2-3 langkah pedagogis untuk mendorong siswa berdiskusi dengan pasangan/kelompok dan menghasilkan contoh mereka sendiri tentang dampak dunia nyata.", "items": { "type": "string" } },
              "ProbingQuestions": { "type": "array", "description": "3-4 pertanyaan khusus untuk menghubungkan hasil penyelidikan dengan kehidupan sehari-hari, masalah komunitas, atau desain ulang sistem.", "items": { "type": "string" } }
            },
            "required": ["OpeningScript", "FacilitationMoves", "ProbingQuestions"],
            "additionalProperties": false
          },
          "TranscendentThinking": {
            "type": "object",
            "properties": {
              "Question": { "type": "string", "description": "Hasilkan 1 pertanyaan berpikir transenden yang mengharuskan siswa untuk menerapkan pembelajaran di luar diri mereka ke konteks dunia nyata (komunitas, tantangan global). Fokus pada mengapa pembelajaran itu penting dalam skala besar (keamanan, keberlanjutan, inovasi, dll.). Hindari fokus hanya pada pribadi/sekolah." }
            },
            "required": ["Question"],
            "additionalProperties": false
          },
          "ExpectedStudentResponses": {
            "type": "array",
            "description": "4-5 respon yang mengilustrasikan bagaimana siswa mungkin menerapkan pemahaman mereka ke konteks dunia nyata yang autentik atau pemecahan masalah yang berorientasi masa depan.",
            "items": { "type": "string" }
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "TranscendentThinking",
          "ExpectedStudentResponses"
        ],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "object",
        "description": "Bagian 'Tinjauan & Pengambilan Berjarak' lengkap. Kegiatan 5 menit ini harus mencakup: 1. Instruksi untuk Guru berisi: - Prompt Pemanggilan Aktif menggunakan berbagi pasangan/kelompok - Respon Siswa yang Diharapkan (2-3 contoh poin) 2. Koneksi Pertanyaan Esensial 3. Bagian Pemikiran Transenden 4. Komponen Pengambilan Berjarak berisi: - Referensi jelas ke pelajaran sebelumnya yang spesifik - Pertanyaan yang menghubungkan konsep masa lalu + saat ini - Kriteria keberhasilan / respon yang diharapkan secara rinci Semua bagian harus menggunakan pernyataan 'Katakan:' untuk prompt guru dan berlabel jelas 'Respon Siswa yang Diharapkan' yang menunjukkan 2-3 contoh jawaban.",
        "properties": {
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Panduan guru langkah demi langkah untuk sesi tinjauan 5 menit dan pengambilan berjarak.",
            "properties": {
              "ActiveRecall": {
                "type": "object",
                "description": "Dorong siswa untuk mengingat pembelajaran kunci dari pelajaran hari ini hanya menggunakan bukti dari penyelidikan.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "Naskah guru khusus (dimulai dengan 'Katakan:') yang mendorong siswa untuk merefleksikan penyelidikan hari ini dan apa yang diungkapkannya tentang sistem tersebut."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "3-4 contoh respon siswa berkualitas tinggi yang menunjukkan penggunaan bukti yang jelas.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "EssentialQuestionConnection": {
                "type": "object",
                "description": "Bantu siswa menghubungkan bukti spesifik hari ini dengan pertanyaan esensial unit yang lebih luas.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "Naskah guru (dimulai dengan 'Katakan:') yang menghubungkan temuan hari ini dengan salah satu pertanyaan esensial unit."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 contoh bagaimana siswa menjustifikasi koneksi menggunakan bukti.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "SpacedRetrieval": {
                "type": "object",
                "description": "Tinjau kembali konsep dari unit atau pelajaran sebelumnya untuk memperkuat retensi kumulatif.",
                "properties": {
                  "TeacherSay": {
                    "type": "string",
                    "description": "Naskah guru (dimulai dengan 'Katakan:') yang secara eksplisit menghubungkan konsep dari pelajaran sebelumnya ke pekerjaan hari ini. Harus menyertakan meta-referensi (mis., '(Draws from Unit 1, Lesson 2.)') langsung di dalam teks."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 contoh respon yang diharapkan.",
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
      "FormativeAssessment": {
        "type": "string",
        "description": "Bagian 'Asesmen Formatif' lengkap sebagai teks biasa. Harus mengikuti struktur ini: Paragraf pendahuluan yang menghadap guru yang menyatakan tujuan dan cara menerapkannya secara singkat. 4 prompt pertanyaan yang diperlukan berlabel 'Prompt 1 (DOK 1):', 'Prompt 2 (DOK 2):', dll. yang mencakup level DOK 1-4. Untuk setiap prompt: - Pertanyaan yang menguji pemahaman pada level DOK yang dinyatakan - Tajuk 'Respon Siswa yang Diharapkan' (tanpa tanda centang/emoji) - 1-2 respon kalimat lengkap yang menunjukkan penguasaan Akhiri dengan paragraf pendek yang menyebutkan strategi asesmen formatif khusus yang digunakan (mis.,'Exit Ticket','Think-Pair-Share'). Contoh format: Prompt 1 (DOK 1): 'Mengapa planet tetap berada di orbitnya alih-alih terbang ke luar angkasa?' Respon Siswa yang Diharapkan 'Karena gerakan maju mereka dan gravitasi Matahari bekerja sama untuk menciptakan orbit yang stabil.' [Lanjutkan dengan Prompt 2-4 mengikuti struktur yang sama]"
      },
      "StudentPractice": {
        "type": "object",
        "description": "Bagian 'Praktik Siswa' lengkap untuk pekerjaan rumah / praktik di luar kelas.",
        "properties": {
          "Tasks": {
            "type": "array",
            "description": "Hasilkan 3 tugas yang mencakup level DOK 2 dan 3.",
            "items": {
              "type": "object",
              "properties": {
                "TaskTitle": { "type": "string", "description": "mis., '1. (DOK 2)'" },
                "Instruction": { "type": "string", "description": "Petunjuk siswa langkah demi langkah yang jelas untuk tugas tersebut." },
                "SuccessCriteria": { "type": "array", "description": "4-5 poin bukti spesifik yang menunjukkan seperti apa penguasaan untuk tugas ini. KRITIS: Setiap kriteria HARUS dimulai dengan kata kerja aksi (mis., 'Mendeskripsikan', 'Menjelaskan', 'Menggunakan').", "items": { "type": "string" } }
              },
              "required": ["TaskTitle", "Instruction", "SuccessCriteria"],
              "additionalProperties": false
            }
          },
          "Reflection": {
            "type": "object",
            "description": "Akhiri dengan refleksi pengaturan diri atau pemikiran transenden.",
            "properties": {
              "Instruction": { "type": "string", "description": "Instruksi untuk bagian refleksi (mis., 'Tulis 2–3 kalimat yang menanggapi satu prompt:')." },
              "Prompts": { "type": "array", "description": "4-5 prompt refleksi khusus yang menghubungkan penyelidikan hari ini dengan kehidupan nyata, alat masa depan, atau pembelajaran pribadi.", "items": { "type": "string" } }
            },
            "required": ["Instruction", "Prompts"],
            "additionalProperties": false
          }
        },
        "required": ["Tasks", "Reflection"],
        "additionalProperties": false
      }
    },
    "required": [
      "AssessPriorKnowledge",
      "OrientationPhase",
      "ConceptualizationPhase",
      "InvestigationPhase",
      "ConclusionPhase",
      "DiscussionPhase",
      "ReviewAndSpacedRetrieval",
      "FormativeAssessment",
      "StudentPractice",
      "EssentialQuestions",
      "StudentLearningObjectives",
      "StandardsAligned",
      "KeyVocabulary"
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
  }
};
