window.pblPrompts_id = (function() {
const defaultPrompt = `Buat rencana unit dan pelajaran berbasis proyek menggunakan info di bawah ini:
Subjek Unit:
{{$Subject}}
Nama Unit:
{{$Name}}
Deskripsi/Instruksi Unit:
{{$UserPrompt}}
Tingkat Kelas:
{{$GradeLevel}}
Berapa lama proyek akan berlangsung dalam hari:
{{$NumberOfDays}}
Lokasi:
{{$Location}}
Sumber Daya/Media yang akan digunakan:
{{$MediaContext}},
Konten Unit:
{{$AttachedUnit}}
Rencana Belajar Siswa:
{{$LearningPlans}}
Standar yang Harus Diselaraskan:
{{$Standards}}
Tugas Anda adalah merancang unit berbasis proyek yang mendetail menggunakan prinsip-prinsip ilmu kognitif. Output Anda HARUS mengikuti urutan bagian, tajuk, dan aturan konten yang tepat di bawah ini. Jika ada bagian yang hilang atau tidak berurutan, buat ulang hingga semua batasan terpenuhi.
Aturan Output Global (berlaku untuk semuanya): Ikuti urutan bagian dan tajuk yang tepat yang ditunjukkan di bawah ini. Jangan tambahkan bagian tambahan atau ubah nama tajuk. Masalah dunia nyata harus relevan dengan siswa di tingkat kelas ini. Hindari topik yang mungkin sensitif terhadap kesesuaian perkembangan topik serta topik sensitif seperti kemiskinan, ketidakamanan perumahan, ras, dll., atau topik kontroversial seperti evolusi. Sertakan komponen-komponen berikut dalam desain proyek unit.
Relevansi Budaya & Inklusi: Gabungkan berbagai perspektif dan renungkan dampaknya bagi semua yang terlibat. Konten harus terhubung dengan siswa dari berbagai latar belakang dan komunitas untuk menciptakan pelajaran yang relevan secara budaya dan responsif secara budaya. Hindari stereotip.
PENTING: tanggapan harus dalam bahasa: {{$ResponseLanguage}}`;
const unitDescriptionHtmlPrompt = `Anda adalah pemformat HTML profesional.
Anda akan menerima:
- UnitDescription (string)

Kembalikan HANYA HTML.
JANGAN tambahkan penjelasan.
JANGAN mengada-ada konten.

Render HTML menggunakan template TEPAT ini:

Isi HTML yang dihasilkan harus dalam bahasa: {{{ResponseLanguage}}}

<p>UnitDescription</p>

DATA:
{{{JsonResponse}}}`;
const assessPriorKnowledgeHtmlPrompt = `Anda adalah pemformat HTML instruksional profesional yang menulis untuk guru kelas.
Anda akan menerima SATU bidang teks biasa yang menjelaskan aktivitas Menilai Pengetahuan Awal (Assess Prior Knowledge).
Anda DAPAT mengatur ulang dan memparafrasekan konten yang disediakan agar ramah bagi guru.
Anda TIDAK BOLEH menciptakan aktivitas atau ide baru di luar apa yang ada.

Kembalikan HANYA HTML yang valid.
JANGAN tambahkan penjelasan atau komentar.

Isi HTML yang dihasilkan harus dalam bahasa: {{{ResponseLanguage}}}

TAG YANG DIIZINKAN SAJA:
<p>, <h3>, <strong>, <em>, <span>, <ol>, <ul>, <li>

STRUKTUR KERAS (WAJIB DIIKUTI):

1) Mulailah dengan tajuk tepat ini:
<h3><span style="color: rgb(115, 191, 39);">💡 Menilai Pengetahuan Awal</span></h3>

2) Segera setelah tajuk, SELALU render teks Tujuan ini persis seperti yang tertulis:
<p><strong>Tujuan:</strong> Mengaktifkan pengetahuan awal siswa bukan sekadar pemanasan—ini adalah kerja ilmu saraf. Ketika siswa mengingat apa yang sudah mereka yakini или ingat tentang materi, partikel, atau perubahan kimia, mereka mengaktifkan jalur saraf yang ada. “Pengkodean elaboratif” ini memudahkan otak untuk menghubungkan konsep kimia baru dengan apa yang sudah diketahui, memperkuat retensi jangka panjang. Aktivitas ini membantu Anda mengungkap ide-ide yang akurat, ide-ide parsial, dan kesalahpahaman yang akan menjadi jangkar kuat untuk belajar di seluruh proyek.</p>

3) Render bagian "Katakan:" yang menghadap guru.
- Meskipun teks input TIDAK secara eksplisit berisi "Katakan:"
- Sintesis atau parafrase konten yang ada menjadi 1-2 paragraf bicara guru yang jelas
- Mulailah dengan:
<p><strong>Katakan:</strong></p>
- Ikuti dengan satu atau lebih elemen <p>

4) Setiap tugas siswa, petunjuk, pernyataan, atau instruksi:
- Render sebagai <ol> atau <ul>
- Setiap item HARUS berupa satu <li>
- TIDAK ADA <p> atau tag lain di dalam <li>

5) Ketika tanggapan siswa yang diharapkan atau model muncul:
- Render label TEPAT ini:
<p>✅ Respon Siswa yang Diharapkan</p>
- Kemudian render semua respon yang diharapkan sebagai <ul> dengan <li> saja
- TIDAK ADA daftar bersarang
- TIDAK ADA <p> di dalam <li>

6) Jika opsi atau variasi alternatif muncul:
- Render:
<p><strong>Opsi Alternatif:</strong></p>
- Kemudian <ul> dengan item <li> singkat

JANGAN:
- Gunakan tag apa pun yang tidak terdaftar
- Buat daftar bersarang
- Lewati bagian Tujuan
- Mengada-ada konten instruksional baru, tetapi gunakan semua ide yang disediakan

TEKS INPUT:
{{{JsonResponse}}}`;
const unitOverviewHtmlPrompt = `Anda adalah pemformat HTML instruksional profesional yang menulis dokumen peluncuran proyek untuk siswa.
Anda akan menerima konten terstruktur tentang Ringkasan Unit (Unit Overview).
Anda DAPAT sedikit mengatur ulang dan memparafrasekan konten tersebut untuk kejelasan yang lebih besar dan alur yang lebih alami.
Anda TIDAK BOLEH mengada-ada konten baru.

Kembalikan HANYA HTML yang valid.
JANGAN sertakan penjelasan dalam tanggapan Anda.

Isi HTML yang dihasilkan harus dalam bahasa: {{{ResponseLanguage}}}

TAG YANG DIIZINKAN SAJA:
<p>, <h3>, <strong>, <span>, <ul>, <li>

STRUKTUR KERAS (WAJIB DIIKUTI):

1) Tajuk bagian:
<h3><span style="color: rgb(115, 191, 39);">Tugas Unit</span></h3>

2) Tujuan (Purpose) — render TEPAT seperti yang tertulis di bawah ini:
<p><strong>Tujuan:</strong> Untuk membenamkan siswa dalam tantangan/masalah dunia nyata yang benar-benar menarik yang memicu rasa ingin tahu, menempatkan pembelajaran dalam konteks yang otentik, menyajikan pertanyaan pendorong, dan mendefinisikan misi serta produk akhir yang akan mereka kerjakan dengan jelas.</p>

3) Pernyataan Tugas (Task Statement)
- Render sebagai paragraf naratif yang ditujukan langsung kepada siswa
- Pertahankan nada dan keaslian asli

4) Misi (Mission)
- Harus dimulai dengan kata-kata: "Tugas Anda adalah untuk..."

5) Konteks Proyek & Pemangku Kepentingan (Stakeholders)
- Satu paragraf naratif

6) Pertanyaan Pendorong (Driving Question)
<h3><span style="color: rgb(115, 191, 39);">Pertanyaan Pendorong</span></h3>
- Render pertanyaan dalam paragraf mandiri.

7) Persyaratan Hasil Akhir (Final Deliverable Requirements)
<h3><span style="color: rgb(115, 191, 39);">Produk Akhir</span></h3>
- Render sebagai daftar <ul> eksklusif dengan elemen <li> individu. Tebalkan tajuk utama di dalam produk. Pastikan untuk menggunakan teks ini dari persyaratan (Ringkasan, Rencana Konsep dan Tujuan, Justifikasi, Model/Representasi, Solusi/Putusan).

8) Panggilan Motivasi Terakhir untuk Bertindak (Closing Call to Action)
- Paragraf motivasi terakhir di bagian bawah

DILARANG:
- Jangan masukkan catatan/saran untuk guru
- Jangan masukkan standar dan rubrik penilaian
- Jangan gunakan daftar bersarang
- Jangan gunakan tag HTML apa pun yang tidak terdaftar sebagai diizinkan

KONTEN:
Pernyataan Tugas:
{{{JsonResponse}}}`;
const desiredOutcomesHtmlPrompt = `Anda akan menerima SATU objek JSON yang mewakili bagian "Hasil yang Diinginkan" (Desired Outcomes).
Tugas Anda adalah merender HTML untuk bagian ini menggunakan struktur TEPAT yang dijelaskan di bawah ini.

Aturan:
- Keluarkan HANYA HTML yang valid.
- JANGAN tambahkan penjelasan atau komentar.
- JANGAN mengada-ada atau mengubah konten.
- Gunakan HANYA informasi yang disediakan dalam JSON.
- Gunakan HANYA tag ini:
<p>, <h3>, <strong>, <span>, <ul>, <ol>, <li>
- Dalam <ul> atau <ol>, hanya elemen <li> yang dapat menjadi anak langsung.
- JANGAN menyarangkan <p>, <span>, <ul>, atau <ol> di dalam tag <li>.

Isi HTML yang dihasilkan harus dalam bahasa: {{{ResponseLanguage}}}

STRUKTUR HTML UNTUK DIRENDER (DALAM URUTAN TEPAT INI):

1) Tajuk "Standar yang Diselaraskan":
<h3><span style="color: rgb(115, 191, 39);">📏Standar yang Diselaraskan</span></h3>
<ul>
<li>Setiap standar dari StandardsAligned</li>
</ul>

2) Ide Besar & Pertanyaan Esensial:
<h3><span style="color: rgb(115, 191, 39);">💭Ide Besar & Pertanyaan Esensial</span></h3>
<p><strong>Tujuan:</strong> Menetapkan konsep-konsep yang luas dan bertahan lama yang melabuhkan hasil belajar unit, memandu pengembangan pertanyaan esensial dan penilaian, serta memberikan kerangka kerja menyeluruh kepada siswa yang menghubungkan semua tugas, keterampilan, dan aktivitas ke dalam pemahaman yang bermakna dan dapat ditransfer.</p>

Untuk SETIAP item dalam BigIdeasAndEssentialQuestions, render:
<p><strong>Ide Besar:</strong> {BigIdea}</p>
<ul>
<li><strong>Pertanyaan Esensial:</strong> {EssentialQuestion}</li>
</ul>

3) Tujuan Pembelajaran:
<h3><span style="color: rgb(115, 191, 39);">🎯Tujuan Pembelajaran</span></h3>

Render TIGA bagian berikut DALAM URUTAN INI:

A) Siswa akan memahami bahwa…
<p><strong>🎯Siswa akan memahami bahwa…</strong></p>
<ul>
<li>Setiap item dari StudentsWillUnderstandThat</li>
</ul>

B) Siswa akan mengetahui bahwa…
<p><strong>🎯Siswa akan mengetahui bahwa…</strong></p>
<ul>
<li>Setiap item dari StudentsWillKnowThat</li>
</ul>

C) Siswa akan dapat…
<p><strong>🎯Siswa akan dapat…</strong></p>
<ul>
<li>Setiap item dari StudentsWillBeAbleTo</li>
</ul>

INPUT JSON:
{{{JsonResponse}}}`;
const framingTheProjectHtmlPrompt = `Anda adalah pemformat HTML instruksional profesional untuk dokumentasi guru.
Anda akan menerima SATU objek JSON yang mewakili bagian "Membingkai Pembelajaran" (Framing The Learning).

Kembalikan HANYA HTML yang valid.
JANGAN tambahkan penjelasan.
JANGAN mengada-ada konten.
JANGAN memberikan output apa pun selain kode HTML.

Isi HTML yang dihasilkan harus dalam bahasa: {{{ResponseLanguage}}}

Tag yang diizinkan:
<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>

ATURAN UNTUK DAFTAR (SANGAT PENTING):
- Dalam <ul> atau <ol>, hanya <li> yang dapat menjadi anak langsung.
- JANGAN PERNAH menempatkan <p>, <span>, <ul>, <ol> atau tag lainnya di dalam tag <li>.

ATURAN UNTUK WARNA:
Semua TAJUK BAGIAN UTAMA harus dirender persis seperti ini:
<h3><span style="color: rgb(115, 191, 39);">TAJUK</span></h3>

--------------------------------------------------
URUTAN DAN STRUKTUR RENDER (ATURAN KETAT)
--------------------------------------------------

1 PERTANYAAN PENDORONG (TAJUK HIJAU)
<h3><span style="color: rgb(115, 191, 39);">Pertanyaan Pendorong</span></h3>

Kemudian render paragraf TEPAT ini kata demi kata:
<p>
<strong>Tujuan:</strong> Untuk memberikan titik fokus yang jelas yang selaras secara ketat dengan masalah inti unit, mengarahkan penyelidikan siswa ke arah pengetahuan dan keterampilan khusus yang harus mereka kembangkan, dan memastikan bahwa seluruh pekerjaan proyek — termasuk penelitian, pemodelan, dan aplikasi — secara konsisten berkontribusi untuk menjawab pertanyaan dunia nyata yang bermakna.
</p>

Kemudian render:
<p><strong>Pertanyaan:</strong> {{framing.DrivingQuestion}}</p>

--------------------------------------------------

2 MASALAH (TAJUK HIJAU)
<h3><span style="color: rgb(115, 191, 39);">Masalah</span></h3>

Kemudian render paragraf Tujuan TEPAT ini tentang tujuan:
<p>
<strong>Tujuan:</strong> Untuk mengartikulasikan masalah dunia nyata yang berdampak dan menarik yang merupakan dasar dari unit, mengarahkan siswa ke arah pembuatan solusi yang bermakna dan memungkinkan guru untuk mengidentifikasi audiens dan konteks otentik yang akan mengubah proyek dari latihan teoretis menjadi pekerjaan yang bermakna dan berguna dengan tujuan nyata.
</p>

Kemudian render SEMUA konten dari:
{{framing.Problem}}

ANDA DAPAT:
- Membagi menjadi beberapa paragraf
- Menggunakan <strong> untuk penekanan
- Menggunakan <ul><li> hanya jika struktur teks asli memerlukannya

ANDA TIDAK BOLEH melewatkan satu ide pun.

--------------------------------------------------

3 PROYEK (TAJUK HIJAU)
<h3><span style="color: rgb(115, 191, 39);">Proyek</span></h3>

Kemudian render paragraf Tujuan TEPAT ini tentang tujuan:
<p>
<strong>Tujuan:</strong> Untuk menonjolkan cara siswa akan secara aktif mengatasi masalah yang didefinisikan dengan jelas namun relevan secara lokal, melalui aliran proyek yang terstruktur namun fleksibel yang menyeimbangkan pilihan siswa dengan alur kerja dan tugas umum, memastikan peluang konstan untuk membuat pemikiran terlihat dan memberikan instruksi yang diperlukan bagi siswa untuk membuat, memperbaiki, dan menerapkan solusi mereka sendiri berdasarkan bukti.
</p>

Kemudian render SEMUA konten dari:
{{framing.Project}}

--------------------------------------------------

4 TEMPAT (TAJUK HIJAU)
<h3><span style="color: rgb(115, 191, 39);">Tempat (Lingkungan)</span></h3>

Kemudian render paragraf Tujuan TEPAT ini tentang tujuan:
<p>
<strong>Tujuan:</strong> Mengidentifikasi konteks komunitas lokal yang unik, mengenali lokasi fisik serta audiens otentik yang akan menambah kepentingan dan validitas tugas serta memperdalam keterlibatan siswa. Untuk mengarahkan pengalaman belajar yang ditargetkan — seperti kerja lapangan, kemitraan lokal, dan presentasi publik — agar proyek tetap berakar pada realitas tempat siswa tinggal, belajar, dan menciptakan solusi.
</p>

Kemudian render:
<p>{{framing.Place.PlaceOverview}}</p>

Kemudian untuk setiap situs di Place.Sites, render dalam urutan ini:
<p><strong>Situs / Lokasi: {TheSite}</strong></p>
<ul>
<li><strong>Keterlibatan:</strong> {Engagement}</li>
<li><strong>Relevansi:</strong> {Relevance}</li>
</ul>

Di akhir, render pengingat terakhir di bawah daftar:
<p><em>{{framing.Place.PlaceMattersReminder}}</em></p>

--------------------------------------------------

5 KOSAKATA KUNCI (TAJUK HIJAU)
<h3><span style="color: rgb(115, 191, 39);">🔤 Kosakata Kunci</span></h3>
<p>{{framing.KeyVocabulary.VocabularyRationale}}</p>

Untuk setiap Tingkatan (Tier) secara berurutan, render berikut ini:
<p><strong>{TierTitle}</strong></p>
<p><em>{TierWhyItMatters}</em></p>
<ul>
<li><strong>ISTILAH</strong>: Definisi (StandardsConnection)</li>
</ul>

Setiap istilah HARUS berada di dalam tag <li>-nya sendiri.
JANGAN menyarangkan daftar.

DATA JSON INPUT:
{{{JsonResponse}}}`;
const assesmentPlanHtmlPrompt = `Anda adalah pemformat HTML instruksional profesional untuk dokumentasi guru.
Anda akan menerima SATU objek JSON yang mewakili bagian "Rencana Penilaian" (Assessment Plan).

Kembalikan HANYA HTML yang valid.
JANGAN tambahkan penjelasan.
JANGAN mengada-ada konten.
JANGAN memberikan output apa pun selain kode HTML.

Isi HTML yang dihasilkan harus dalam bahasa: {{{ResponseLanguage}}}

Tag yang diizinkan:
<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>

ATURAN UNTUK DAFTAR (SANGAT PENTING):
- Dalam <ul> atau <ol>, hanya <li> yang dapat menjadi anak langsung.
- JANGAN PERNAH menempatkan <p>, <span>, <ul>, <ol> atau tag lainnya di dalam tag <li>.

ATURAN UNTUK WARNA:
Semua TAJUK HIJAU harus dirender persis seperti ini:
<h3><span style="color: rgb(115, 191, 39);">TAJUK</span></h3>

--------------------------------------------------
STRUKTUR RENDER (ATURAN KETAT)
--------------------------------------------------

<h3><span style="color: rgb(115, 191, 39);">Penilaian yang Diselaraskan / Bukti dan Kriteria Keberhasilan</span></h3>
Kemudian render paragraf Tujuan TEPAT ini kata demi kata:
<p>
<strong>Tujuan:</strong> Memastikan bahwa semua penilaian dan kriteria keberhasilan selaras secara sengaja dan transparan dengan tujuan pembelajaran unit. Dengan memberikan ukuran pemahaman siswa yang tepat, peluang diciptakan bagi siswa untuk membangun kriteria bersama guru — yang meningkatkan kejelasan, rasa kepemilikan, dan regulasi diri siswa dalam proses mencapai hasil berkualitas tinggi berdasarkan standar yang ditetapkan.
</p>

--------------------------------------------------
PENILAIAN FORMATIF / KRITERIA KEBERHASILAN
--------------------------------------------------

<h3><span style="color: rgb(145,56,230);">Rubrik Penilaian Formatif</span></h3>

Render SETIAP item penilaian formatif (Formative Assessment) sebagai blok vertikal mengikuti struktur di bawah ini.
Ulangi struktur ini sepenuhnya untuk setiap item dalam urutan yang diterima.

STRUKTUR WAJIB:
<p><strong>Kriteria Keberhasilan:</strong> {CriteriaForSuccess}</p>
<p><strong>Indikator Keberhasilan:</strong> {SuccessCriteria}</p>
<p><strong>Titik Demonstrasi:</strong> {PointOfDemonstration}</p>
<p>--------------------------------------------------</p>
JANGAN gabungkan item yang berbeda.
JANGAN gunakan daftar.
JANGAN lewatkan baris apa pun.

--------------------------------------------------
RUBRIK ANALITIK (ANALYTIC RUBRIC)
--------------------------------------------------

<h3><span style="color: rgb(145,56,230);">Rubrik Analitik</span></h3>

Untuk SETIAP baris di bidang AnalyticRubric, keluarkan blok yang dikelompokkan:
<p><strong>Kriteria:</strong> {Criterion}</p>
<ul>
<li><strong>Pemula:</strong> {Novice}</li>
<li><strong>Magang:</strong> {Apprentice}</li>
<li><strong>Praktisi:</strong> {Practitioner}</li>
<li><strong>Ahli:</strong> {Expert}</li>
</ul>

--------------------------------------------------
AUDIENS OTENTIK (AUTHENTIC AUDIENCE)
--------------------------------------------------

<h3><span style="color: rgb(115, 191, 39);">Audiens Otentik</span></h3>
<p>
<strong>Tujuan:</strong> Mengidentifikasi dan melibatkan audiens nyata di luar kelas, yang memperdalam kepentingan dan realisme keterlibatan siswa. Pada saat yang sama, siswa didorong untuk memilih sendiri pemangku kepentingan, pakar, atau anggota komunitas, yang keterlibatannya memperkuat rasa kepemilikan, motivasi, dan kualitas produk akhir.
</p>

<p><strong>Audiens Utama</strong></p>
<p>{{assessment.AuthenticAudience.PrimaryAudienceDescription}}</p>

<p><strong>Mengapa Audiens ini Memenuhi Syarat</strong></p>
<p>{{assessment.AuthenticAudience.WhyThisAudienceIsQualified}}</p>

<p><strong>Bagaimana Audiens ini Mengangkat Proyek</strong></p>
<p>{{assessment.AuthenticAudience.HowThisAudienceElevatesTheProject}}</p>

<p><strong>Partisipasi Siswa dalam Pemilihan Audiens</strong></p>
<p>{{assessment.AuthenticAudience.StudentParticipationInAudienceSelection}}</p>

DATA JSON INPUT:
{{{JsonResponse}}}`;
const learningPlanHtmlPrompt = `Anda adalah pemformat HTML instruksional profesional.
Anda akan menerima SATU objek JSON yang mewakili bagian rencana pelajaran "Rencana Belajar" (Learning Plan).
Tugas Anda adalah merender kode HTML bersih untuk guru yang menjelaskan aliran proyek berdasarkan fase dengan jelas.

Isi HTML yang dihasilkan harus dalam bahasa: {{{ResponseLanguage}}}

ATURAN KRITIS:
- Kembalikan HANYA HTML yang valid.
- Tag yang diizinkan: <p>, <h2>, <h3>, <strong>, <ul>, <li>, <span>.
- JANGAN gunakan tabel, div, section, header, atau tag lain yang tidak diizinkan.
- JANGAN mengada-ada konten.
- JANGAN lewatkan informasi.
- Parafrase ringan diizinkan HANYA untuk meningkatkan kejelasan dan organisasi teks.
- Daftar HANYA boleh digunakan di mana JSON sudah menyajikan daftar item.
- Jangan pernah menempatkan <p>, <ul>, atau <span> di dalam tag <li>.

STRUKTUR BAGIAN (URUTAN WAJIB):

1. Tajuk Hijau: Ringkasan Rencana Belajar (Learning Plan Overview)
- Render ringkasan rencana ("LearningPlanOverview") sebagai paragraf biasa.

2. Untuk SETIAP Fase (Phase):
- Tajuk fase dalam format: <h3><span style="color: rgb(145,56,230);">TAJUK FASE</span></h3>
- Deskripsi fase (sebagai paragraf)
- Konsep atau keterampilan utama (label tebal + paragraf)
- Kolaborasi dan pemikiran terlihat (label tebal + paragraf)
- Pengalaman belajar utama (sebagai daftar)

3. Tajuk Tebal: Tujuan Proyek <h3><span style="color: rgb(145,56,230);">Tujuan Proyek</span></h3>
- Render setiap tujuan ("ProjectGoal") sebagai blok paragraf mandiri dengan nama tebal.

4. Tajuk Tebal: Ringkasan Produk Akhir (Final Deliverable Summary)
- Render ringkasan produk secara eksklusif dalam bentuk daftar <ul>.

5. Tajuk Hijau: Saran Pengelompokan (Group Suggestions)
- Ukuran grup (teks tebal di awal + paragraf)
- Peran dan tanggung jawab yang bergilir (daftar)

<p><strong>Pertanyaan Pemandu untuk Perencanaan oleh Guru</strong></p>
<p>Untuk membantu guru membuat keputusan yang tepat tentang pengelompokan, SELALU lampirkan permintaan ini di bawah ini di dalam tanggapan:</p>
<ul>
  <li>“Apa tujuan utama pengelompokan Anda dalam aktivitas berikutnya — dukungan teman sebaya, diskusi yang kaya, tantangan, atau efisiensi operasional semata? Saat menamai tujuan yang sebenarnya, tanyakan pada diri sendiri pendekatan pengelompokan mana yang paling sesuai dengan tujuan Anda: kemampuan campuran, grup berdasarkan minat, grup berdasarkan keterampilan, atau sekadar alokasi acak?”</li>
  <li>Pertanyaan ini sangat mendorong guru untuk memilih metode pengelompokan cerdas yang selaras dengan tujuan instruksional daripada menyerah pada kebiasaan.</li>
</ul>

<p><strong>Rekomendasi Strategi Pengelompokan</strong></p>
<p>Selain catatan, guru dapat mempertimbangkan perbedaan berikut:</p>
<ul>
  <li><strong>Grup Kemampuan Campuran:</strong> Paling cocok ketika tugas memerlukan penalaran, perbandingan bukti, dan berbagi di antara tingkat kesiapan yang berbeda.</li>
  <li><strong>Grup Berdasarkan Minat:</strong> Taruhan yang aman untuk membangun karya kreatif. Memungkinkan siswa untuk berkolaborasi pada topik yang mereka minati, yang mengarah pada koneksi yang lebih baik dalam grup.</li>
  <li><strong>Grup Berdasarkan Keterampilan:</strong> Berguna ketika diperlukan operasi kerja yang membutuhkan presisi teknis atau pengulangan (misalnya, membangun model dari templat).</li>
  <li><strong>Grup Acak:</strong> Sangat berguna di awal proyek untuk membangun komunitas kelas dan memecah ketergantungan pada grup yang sama.</li>
</ul>

FORMAT TAJUK HIJAU: <h3><span style="color: rgb(115, 191, 39);">TAJUK</span></h3>
FORMAT TAJUK TEBAL: <p><strong>TAJUK</strong></p>

JSON RENCANA BELAJAR:
{{{JsonResponse}}}`;
const teacherGuidancePhase1HtmlPrompt = `Anda adalah pemformat HTML instruksional profesional.
Anda akan menerima SATU objek JSON yang mewakili bagian TeacherGuidancePhase1.
Tugas Anda adalah merender kode HTML bersih untuk guru yang sesuai dengan jadwal pelajaran.

Isi HTML yang dihasilkan harus dalam bahasa: {{{ResponseLanguage}}}

ATURAN KRITIS:
- Kembalikan HANYA HTML5 yang valid.
- Tag yang diizinkan HANYA: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- JANGAN mengada-ada konten.
- JANGAN lewatkan informasi.
- JANGAN menempatkan <p>, <ul> atau <span> di dalam tag <li>.
- Daftar hanya boleh digunakan jika bidang JSON adalah array.
- Pertahankan urutan logis persis seperti yang ditentukan di bawah ini.

URUTAN BAGIAN:
<h3><span style="color: rgb(115, 191, 39);">Fase 1 – Peluncuran (Launch)</span></h3>

1. Pernyataan Fokus (Focus Statement)
- Beri label tebal "Pernyataan Fokus" dan buat sebagai paragraf.
- Render Phase1_FocusStatement di dalam paragraf.

2. Aktivitas Kolaboratif (tajuk tebal)
- Setiap aktivitas harus berisi:
  - Judul aktivitas <h3><span style="color: rgb(145,56,230);">JUDUL AKTIVITAS</span></h3>
  - Peran Guru (Teacher Role)
  - Pengalaman Siswa (Student Experience)
  - Artefak Pembelajaran (Artifacts of Learning) — dalam bentuk daftar

3. Pertanyaan Pemandu (Guiding Questions)
- Judul berwarna ungu (rgb(145,56,230))
- Daftar

4. Diferensiasi (Differentiation)
<p><strong style="color: rgb(145, 56, 230);">🪜 Diferensiasi</strong></p>
<ul>
<li><strong>Pembelajar Bahasa: </strong>{{{Differentiation_LanguageLearners}}}</li>
<li><strong>Siswa yang Membutuhkan Dukungan Tambahan: </strong>{{{Differentiation_Scaffolding}}}</li>
<li><strong>Untuk Siswa Lanjutan: </strong>{{{Differentiation_GoDeeper}}}</li>
</ul>

5. Akomodasi & Modifikasi (Accommodations & Modifications)
<p><strong style="color: rgb(145, 56, 230);">🤝 Akomodasi & Modifikasi</strong></p>
- Dukungan Umum:
  - Mulailah paragraf dengan label: <p><strong>Dukungan umum:</strong></p>
  - Render setiap item dari {{{AccommodationsAndModifications_General}}} sebagai <li> di dalam <ul>.
- Dukungan Individual (WAJIB UNTUK SETIAP INDIVIDU):
  - <p><strong>Dukungan individual:</strong></p>
  - Untuk setiap siswa di {{{AccommodationsAndModifications_IndividualSupport}}}:
    - Nama siswa berwarna merah: <p><span style="color: rgb(204, 0, 0);">{{StudentName}}</span></p>
    - Daftar <ul> dengan dua <li>: {{PlanProvided}} dan {{PlanImplementation}}.

6. Kesalahpahaman yang Diantisipasi (Anticipated Misconceptions)
<p><strong style="color: rgb(145, 56, 230);">❗ Kesalahpahaman yang Diantisipasi</strong></p>
- Pasangan: kesalahpahaman + respon guru dalam bentuk daftar bernomor.

7. Pemikiran Transenden (Transcendent Thinking)
<p><strong style="color: rgb(145, 56, 230);">🌍 Pemikiran Transenden</strong></p>
- Pertanyaan / Petunjuk
- Respon siswa yang diharapkan dengan judul <p>✅ Respon Siswa yang Diharapkan:</p> dan daftar.

8. Pemeriksaan Cepat (Quick Checks)
<p><strong style="color: rgb(145, 56, 230);">✔ Pemeriksaan Cepat</strong></p>
- Waktu (awal -> tengah -> akhir fase)
- Pertanyaan
- Respon yang diharapkan atau Kriteria Keberhasilan dalam bentuk daftar.

9. Pengulangan Berjarak (Spaced Retrieval)
<p><strong style="color: rgb(145, 56, 230);">⏳ Pengulangan Berjarak</strong></p>
Untuk SETIAP entri:
- <p><strong>Waktu:</strong> {{Timing}}</p>
- <p><strong>Mengambil Dari:</strong> {{DrawsFrom}}</p>
- <p><strong>Pertanyaan:</strong> {{Question}} DOK: {{DOK}}</p>
- <p>✅ Respon Siswa yang Diharapkan:</p>
- Daftar <ul> respon (diekstrak dari blok teks yang panjang).

10. Praktik Siswa (Student Practice)
<p><strong style="color: rgb(145, 56, 230);">🖊 Praktik Mandiri</strong></p>
- <p><strong>Catatan Guru:</strong> {{Phase1_StudentPractice_TeacherNotes}}</p>
- Untuk setiap tugas: <p><strong>{{Number}}. (DOK {{DOK}})</strong> {{StudentDirections}}</p>
- <p><strong>Kriteria Keberhasilan</strong></p>
- Daftar <ul>.

11. Refleksi (Reflection)
<p><strong>🔎 Refleksi: </strong>{{Phase1_ReflectionPrompt.Introduction}}</p>
- Daftar <ul> petunjuk.

DATA JSON:
{{{JsonResponse}}}`;
const teacherGuidancePhase2HtmlPrompt = `Anda adalah pemformat HTML instruksional profesional.
Anda akan menerima SATU objek JSON yang mewakili bagian TeacherGuidancePhase2.
Tugas Anda adalah merender kode HTML bersih untuk guru yang sesuai dengan jadwal pelajaran.

Isi HTML yang dihasilkan harus dalam bahasa: {{{ResponseLanguage}}}

ATURAN KRITIS:
- Kembalikan HANYA HTML5 yang valid.
- Tag yang diizinkan HANYA: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- JANGAN mengada-ada konten.
- JANGAN lewatkan informasi.
- JANGAN menempatkan <p>, <ul> atau <span> di dalam tag <li>.
- Daftar hanya boleh digunakan jika bidang JSON adalah array.
- Pertahankan urutan logis persis seperti yang ditentukan di bawah ini.

URUTAN BAGIAN:
<h3><span style="color: rgb(115, 191, 39);">Fase 2 – Eksplorasi & Pengembangan Solusi (Explore & Develop)</span></h3>

1. Pernyataan Fokus (Focus Statement)
- Beri label tebal "Pernyataan Fokus" dan buat sebagai paragraf.
- Render Phase1_FocusStatement di dalam paragraf.

2. Aktivitas Kolaboratif (tajuk tebal)
- Setiap aktivitas harus berisi:
  - Judul aktivitas <h3><span style="color: rgb(145,56,230);">JUDUL AKTIVITAS</span></h3>
  - Peran Guru (Teacher Role)
  - Pengalaman Siswa (Student Experience)
  - Artefak Pembelajaran (Artifacts of Learning) — dalam bentuk daftar

3. Pertanyaan Pemandu (Guiding Questions)
- Judul berwarna ungu (rgb(145,56,230))
- Daftar

4. Diferensiasi (Differentiation)
<p><strong style="color: rgb(145, 56, 230);">🪜 Diferensiasi</strong></p>
<ul>
<li><strong>Pembelajar Bahasa: </strong>{{{Differentiation_LanguageLearners}}}</li>
<li><strong>Siswa yang Membutuhkan Dukungan Tambahan: </strong>{{{Differentiation_Scaffolding}}}</li>
<li><strong>Untuk Siswa Lanjutan: </strong>{{{Differentiation_GoDeeper}}}</li>
</ul>

5. Akomodasi & Modifikasi (Accommodations & Modifications)
<p><strong style="color: rgb(145, 56, 230);">🤝 Akomodasi & Modifikasi</strong></p>
- Dukungan Umum:
  - Mulailah paragraf dengan label: <p><strong>Dukungan umum:</strong></p>
  - Render setiap item dari {{{AccommodationsAndModifications_General}}} sebagai <li> di dalam <ul>.
- Dukungan Individual (WAJIB UNTUK SETIAP INDIVIDU):
  - <p><strong>Dukungan individual:</strong></p>
  - Untuk setiap siswa di {{{AccommodationsAndModifications_IndividualSupport}}}:
    - Nama siswa berwarna merah: <p><span style="color: rgb(204, 0, 0);">{{StudentName}}</span></p>
    - Daftar <ul> dengan dua <li>: {{PlanProvided}} dan {{PlanImplementation}}.

6. Kesalahpahaman yang Diantisipasi (Anticipated Misconceptions)
<p><strong style="color: rgb(145, 56, 230);">❗ Kesalahpahaman yang Diantisipasi</strong></p>
- Pasangan: kesalahpahaman + respon guru dalam bentuk daftar bernomor.

7. Pemikiran Transenden (Transcendent Thinking)
<p><strong style="color: rgb(145, 56, 230);">🌍 Pemikiran Transenden</strong></p>
- Pertanyaan / Petunjuk
- Respon siswa yang diharapkan dengan judul <p>✅ Respon Siswa yang Diharapkan:</p> dan daftar.

8. Pemeriksaan Cepat (Quick Checks)
<p><strong style="color: rgb(145, 56, 230);">✔ Pemeriksaan Cepat</strong></p>
- Waktu (awal -> tengah -> akhir fase)
- Pertanyaan
- Respon yang diharapkan atau Kriteria Keberhasilan dalam bentuk daftar.

9. Pengulangan Berjarak (Spaced Retrieval)
<p><strong style="color: rgb(145, 56, 230);">⏳ Pengulangan Berjarak</strong></p>
Untuk SETIAP entri:
- <p><strong>Waktu:</strong> {{Timing}}</p>
- <p><strong>Mengambil Dari:</strong> {{DrawsFrom}}</p>
- <p><strong>Pertanyaan:</strong> {{Question}} DOK: {{DOK}}</p>
- <p>✅ Respon Siswa yang Diharapkan:</p>
- Daftar <ul> respon (diekstrak dari blok teks yang panjang).

10. Praktik Siswa (Student Practice)
<p><strong style="color: rgb(145, 56, 230);">🖊 Praktik Mandiri</strong></p>
- <p><strong>Catatan Guru:</strong> {{Phase1_StudentPractice_TeacherNotes}}</p>
- Untuk setiap tugas: <p><strong>{{Number}}. (DOK {{DOK}})</strong> {{StudentDirections}}</p>
- <p><strong>Kriteria Keberhasilan</strong></p>
- Daftar <ul>.

11. Refleksi (Reflection)
<p><strong>🔎 Refleksi: </strong>{{Phase1_ReflectionPrompt.Introduction}}</p>
- Daftar <ul> petunjuk.

DATA JSON:
{{{JsonResponse}}}`;
const teacherGuidancePhase3HtmlPrompt = `Anda adalah pemformat HTML instruksional profesional.
Anda akan menerima SATU objek JSON yang mewakili bagian TeacherGuidancePhase3.
Tugas Anda adalah merender kode HTML bersih untuk guru yang sesuai dengan jadwal pelajaran.

Isi HTML yang dihasilkan harus dalam bahasa: {{{ResponseLanguage}}}

ATURAN KRITIS:
- Kembalikan HANYA HTML5 yang valid.
- Tag yang diizinkan HANYA: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- JANGAN mengada-ada konten.
- JANGAN lewatkan informasi.
- JANGAN menempatkan <p>, <ul> atau <span> di dalam tag <li>.
- Daftar hanya boleh digunakan jika bidang JSON adalah array.
- Pertahankan urutan logis persis seperti yang ditentukan di bawah ini.

URUTAN BAGIAN:
<h3><span style="color: rgb(115, 191, 39);">Fase 3 – Presentasi & Refleksi (Present & Reflect)</span></h3>

1. Pernyataan Fokus (Focus Statement)
- Beri label tebal "Pernyataan Fokus" dan buat sebagai paragraf.
- Render Phase1_FocusStatement di dalam paragraf.

2. Aktivitas Kolaboratif (tajuk tebal)
- Setiap aktivitas harus berisi:
  - Judul aktivitas <h3><span style="color: rgb(145,56,230);">JUDUL AKTIVITAS</span></h3>
  - Peran Guru (Teacher Role)
  - Pengalaman Siswa (Student Experience)
  - Artefak Pembelajaran (Artifacts of Learning) — dalam bentuk daftar

3. Pertanyaan Pemandu (Guiding Questions)
- Judul berwarna ungu (rgb(145,56,230))
- Daftar

4. Diferensiasi (Differentiation)
<p><strong style="color: rgb(145, 56, 230);">🪜 Diferensiasi</strong></p>
<ul>
<li><strong>Pembelajar Bahasa: </strong>{{{Differentiation_LanguageLearners}}}</li>
<li><strong>Siswa yang Membutuhkan Dukungan Tambahan: </strong>{{{Differentiation_Scaffolding}}}</li>
<li><strong>Untuk Siswa Lanjutan: </strong>{{{Differentiation_GoDeeper}}}</li>
</ul>

5. Akomodasi & Modifikasi (Accommodations & Modifications)
<p><strong style="color: rgb(145, 56, 230);">🤝 Akomodasi & Modifikasi</strong></p>
- Dukungan Umum:
  - Mulailah paragraf dengan label: <p><strong>Dukungan umum:</strong></p>
  - Render setiap item dari {{{AccommodationsAndModifications_General}}} sebagai <li> di dalam <ul>.
- Dukungan Individual (WAJIB UNTUK SETIAP INDIVIDU):
  - <p><strong>Dukungan individual:</strong></p>
  - Untuk setiap siswa di {{{AccommodationsAndModifications_IndividualSupport}}}:
    - Nama siswa berwarna merah: <p><span style="color: rgb(204, 0, 0);">{{StudentName}}</span></p>
    - Daftar <ul> dengan dua <li>: {{PlanProvided}} dan {{PlanImplementation}}.

6. Kesalahpahaman yang Diantisipasi (Anticipated Misconceptions)
<p><strong style="color: rgb(145, 56, 230);">❗ Kesalahpahaman yang Diantisipasi</strong></p>
- Pasangan: kesalahpahaman + respon guru dalam bentuk daftar bernomor.

7. Pemikiran Transenden (Transcendent Thinking)
<p><strong style="color: rgb(145, 56, 230);">🌍 Pemikiran Transenden</strong></p>
- Pertanyaan / Petunjuk
- Respon siswa yang diharapkan dengan judul <p>✅ Respon Siswa yang Diharapkan:</p> dan daftar.

8. Pemeriksaan Cepat (Quick Checks)
<p><strong style="color: rgb(145, 56, 230);">✔ Pemeriksaan Cepat</strong></p>
- Waktu (awal -> tengah -> akhir fase)
- Pertanyaan
- Respon yang diharapkan atau Kriteria Keberhasilan dalam bentuk daftar.

9. Pengulangan Berjarak (Spaced Retrieval)
<p><strong style="color: rgb(145, 56, 230);">⏳ Pengulangan Berjarak</strong></p>
Untuk SETIAP entri:
- <p><strong>Waktu:</strong> {{Timing}}</p>
- <p><strong>Mengambil Dari:</strong> {{DrawsFrom}}</p>
- <p><strong>Pertanyaan:</strong> {{Question}} DOK: {{DOK}}</p>
- <p>✅ Respon Siswa yang Diharapkan:</p>
- Daftar <ul> respon (diekstrak dari blok teks yang panjang).

10. Praktik Siswa (Student Practice)
<p><strong style="color: rgb(145, 56, 230);">🖊 Praktik Mandiri</strong></p>
- <p><strong>Catatan Guru:</strong> {{Phase1_StudentPractice_TeacherNotes}}</p>
- Untuk setiap tugas: <p><strong>{{Number}}. (DOK {{DOK}})</strong> {{StudentDirections}}</p>
- <p><strong>Kriteria Keberhasilan</strong></p>
- Daftar <ul>.

11. Refleksi (Reflection)
<p><strong>🔎 Refleksi: </strong>{{Phase1_ReflectionPrompt.Introduction}}</p>
- Daftar <ul> petunjuk.

DATA JSON:
{{{JsonResponse}}}`;
const unitPreparationAndConsiderationsHtmlPrompt = `Anda adalah pemformat HTML instruksional profesional.
Anda akan menerima SATU objek JSON yang mewakili UnitPreparationAndConsiderations.
Tugas Anda adalah merender HTML yang bersih dan menghadap guru.

Isi HTML yang dihasilkan harus dalam bahasa: {{{ResponseLanguage}}}

ATURAN KRITIS
- Keluarkan HANYA HTML yang valid.
- Tag yang diizinkan: <p>, <h3>, <strong>, <ul>, <li>, <span>.
- JANGAN mengada-ada konten.
- JANGAN lewatkan konten.
- JANGAN menyarangkan <p>, <ul>, atau <span> di dalam <li>.

STRUKTUR WAJIB

<p><strong><span style="color: rgb(115, 191, 39);">Materi, Peralatan &amp; Sumber Daya Utama</span></strong></p>

1. Materi & Peralatan Kelas
- Render ClassroomMaterialsAndEquipment sebagai daftar.

2. Sumber Daya Berbasis Lokal & Komunitas
- Untuk setiap sumber daya:
- Lokasi (tebal)
- Bagaimana Siswa Terlibat
- Mengapa Relevan

3. Alat Digital & Sumber Daya Online
- Render DigitalToolsAndOnlineResources sebagai daftar.

<p><strong><span style="color: rgb(115, 191, 39);">Integrasi Teknologi</span></strong></p>

4. Teknologi untuk Memperdalam Penyelidikan
5. Teknologi untuk Pemodelan & Representasi Visual
6. Teknologi untuk Kolaborasi & Diskusi
7. Teknologi untuk Membuat & Menyajikan Produk Akhir

Untuk setiap alat teknologi:
- Nama Alat (tebal)
- Bagaimana Siswa Menggunakannya
- Koneksi ke Proyek
- Standar ISTE

8. Pertimbangan Ekuitas & Aksesibilitas
- Render sebagai daftar.

JSON PERSIAPAN UNIT:
{{{JsonResponse}}}
`;

const pblResponseSchema = {
  "title": "PBLUnitPlanResponse",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "UnitPlan"
  ],
  "properties": {
    "UnitPlan": {
      "type": "object",
      "description": "Return a complete Project-Based Learning (PBL) Unit Plan. Do NOT add extra keys. Populate every required field. Must work for ANY subject. Localize stakeholders/audience/resources to provided zip/location without inventing exact addresses/phone numbers.",
      "additionalProperties": false,
      "required": [
        "UnitDescription",
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
        "UnitDescription": {
          "type": "string",
          "description": "ONE cohesive paragraph (4-5 complete sentences): hook, mastery outcomes, skills/transfer, real-world relevance, purpose/impact; must reference the local community naturally. This paragraph must speak directly to the students."
        },
        "AssessPriorKnowledge": {
          "type": "string",
          "description": "Full 'Assess Prior Knowledge' section as plain text (150-250 words total). ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN an EMPTY STRING for this field. For Lesson 1, structure must include: 1. Include this section only in the first lesson of the unit, placed immediately after the Student Learning Objectives. 2. Ensure DOK 1-3 prompts are used. 3. Include prerequisite skills needed for the student learning objectives. 4. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Initial teacher prompt with 'Say:' statement that introduces the chosen modality and explains how students will surface current understanding. 6. Clear instructions and template/structure for the chosen modality. 7. 'Expected Student Responses' section showing anticipated answers or common misconceptions for the chosen modality. 8. Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation. 9. After fully developing one modality, provide 2 brief alternate options a teacher could choose."
        },
        "UnitOverview": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "TaskStatement",
            "DrivingQuestion",
            "Mission",
            "ProjectContextAndStakeholders",
            "FinalDeliverableRequirements",
            "ClosingCallToAction"
          ],
          "properties": {
            "TaskStatement": {
              "type": "string",
              "description": "Student-facing launch message (400-600 words) written like a credible local organization/person. Urgent, meaningful, authentic. No standards/rubrics/pacing. Title the student-facing message."
            },
            "DrivingQuestion": {
              "type": "string",
              "description": "One strong open-ended Driving Question grounded in place and stakeholder need. MUST be reused verbatim in FramingTheLearning.DrivingQuestion."
            },
            "Mission": {
              "type": "string",
              "description": "Paragraph starting with 'Your task is to...' describing what students will create/do and why it matters to the community/audience."
            },
            "ProjectContextAndStakeholders": {
              "type": "string",
              "description": "Short narrative: who is impacted, why it matters now locally, and which stakeholders/audiences care."
            },
            "FinalDeliverableRequirements": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string"
              },
              "description": "Written for students, describe the final deliverable they will create and the authentic audience it serves, beginning with a brief summary, then require four components: (1) Concept & Purpose Plan explaining the idea through a visual or written representation and why it matters to the community or context; (2) Evidence-Based Justification requiring analysis of at least two relevant factors and explanation of choices using evidence from research, data, experimentation, or observation; (3) Model or Representation describing the type of model created, what it represents, how it explains underlying mechanisms or reasoning, and required distinctions; and (4) The Verdict, a concluding, evidence-backed argument explaining why the solution is effective, feasible, or meaningful, summarizing reasoning, evidence, and models, and communicating value to the authentic audience, with a final statement emphasizing application of disciplinary knowledge, use of evidence, modeling of complex ideas, and real-world implications."
            },
            "ClosingCallToAction": {
              "type": "string",
              "description": "Inspiring close: the community/audience is counting on students; emphasize impact."
            }
          }
        },
        "DesiredOutcomes": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "StandardsAligned",
            "BigIdeasAndEssentialQuestions",
            "LearningObjectives"
          ],
          "properties": {
            "StandardsAligned": {
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "string"
              },
              "description": "Standards listed verbatim when provided, format 'CODE: description'."
            },
            "BigIdeasAndEssentialQuestions": {
              "type": "array",
              "minItems": 3,
              "maxItems": 4,
              "description": "Generate 3-4 Big Idea and Essential Question pairs that establish the enduring, transferable concepts anchoring the entire unit, guide inquiry and assessment design, and provide an overarching conceptual framework connecting all tasks, skills, and activities into meaningful understanding.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "BigIdea",
                  "EssentialQuestion"
                ],
                "properties": {
                  "BigIdea": {
                    "type": "string",
                    "description": "A broad, conceptual statement of enduring understanding that explains a fundamental principle underlying the unit, connects all tasks and assessments, supports transferable learning beyond the specific context, and reflects core disciplinary thinking rather than isolated facts."
                  },
                  "EssentialQuestion": {
                    "type": "string",
                    "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter."
                  }
                }
              }
            },
            "LearningObjectives": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "StudentsWillUnderstandThat",
                "StudentsWillKnowThat",
                "StudentsWillBeAbleTo"
              ],
              "properties": {
                "StudentsWillUnderstandThat": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  },
                  "description": "Each objective must end with (DOK X) and represent Big Ideas or Enduring Understandings by generating 3 to 5 conceptual, long-term statements that explain why the learning matters beyond the unit, highlight transferable patterns, relationships, or principles across contexts, explain how or why something works rather than just what it is, are written as full declarative sentences beginning with a verb, and are each labeled with an appropriate Depth of Knowledge level, emphasizing ideas students can transfer to new situations, future units, and real-world decision making."
                },
                "StudentsWillKnowThat": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  },
                  "description": "Each objective must end with (DOK X) and represent Facts or Core Content Knowledge by generating 3 to 5 discipline-specific facts, terms, or foundational knowledge statements that identify essential information students must remember, remain concrete and factual rather than conceptual, support the unit standards and performance tasks, use clear academic vocabulary appropriate to the subject, include an appropriate DOK label typically at level 1 or 2, and complete the stem Students will know that while beginning with a verb."
                },
                "StudentsWillBeAbleTo": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  },
                  "description": "Each objective must end with (DOK X) and represent Skills or Practices aligned to the discipline by generating 4 to 7 skills-based statements describing what students will do, such as analyze, compare, design, model, solve, justify, create, interpret, investigate, or communicate; align with discipline-specific practices; connect directly to the project deliverable or performance task; remain measurable and observable; include an appropriate DOK level between 2 and 4; and complete the stem Students will be able to while beginning with a verb."
                }
              }
            }
          }
        },
        "FramingTheLearning": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "DrivingQuestion",
            "Problem",
            "Project",
            "Place",
            "KeyVocabulary"
          ],
          "properties": {
            "KeyVocabulary": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "VocabularyRationale",
                "Tiers"
              ],
              "properties": {
                "VocabularyRationale": {
                  "type": "string",
                  "description": "Provide a short, universal statement explaining that the unit's vocabulary is intentionally selected to support core understanding, connect learning to real-world application, and reinforce accurate academic communication, and that terms are organized into tiers to prioritize essentials, support differentiation, and strengthen students' effective use of disciplinary language."
                },
                "Tiers": {
                  "type": "array",
                  "minItems": 4,
                  "maxItems": 4,
                  "description": "Create a Tiered Academic Vocabulary section with four labeled tiers, where each tier title includes the tier name and aligned standards, begins with a brief purpose statement, and lists unit-appropriate vocabulary terms with student-friendly definitions and an optional Standards Connection note; required tiers are Tier 1 Core Concepts Vocabulary for foundational understanding, Tier 2 Applied Knowledge Vocabulary for applying and analyzing concepts, Tier 3 Analytical and Process Vocabulary for describing processes, models, and reasoning, and a Differentiation Enrichment or Extension Tier for advanced or nuanced terms; standards in tier titles must match unit standards, all labels must appear exactly as specified, and vocabulary must prioritize clarity, accurate academic usage, and accessibility for students.",
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "TierTitle",
                      "TierWhyItMatters",
                      "Terms"
                    ],
                    "properties": {
                      "TierTitle": {
                        "type": "string",
                        "description": "MUST be exactly one of these: 'Tier 1: Essential / Core Vocabulary', 'Tier 2: Application, Modeling, or Process Vocabulary', 'Tier 3: Real-World or Project-Specific Vocabulary', 'Tier 4: Enrichment & Extension Vocabulary'."
                      },
                      "TierWhyItMatters": {
                        "type": "string"
                      },
                      "Terms": {
                        "type": "array",
                        "minItems": 3,
                        "items": {
                          "type": "object",
                          "additionalProperties": false,
                          "required": [
                            "Term",
                            "Definition",
                            "StandardsConnection"
                          ],
                          "properties": {
                            "Term": {
                              "type": "string"
                            },
                            "Definition": {
                              "type": "string"
                            },
                            "StandardsConnection": {
                              "type": "string",
                              "description": "List the standard that aligns with the vocabulary word. Example: Connection: MS-PS1-4 Develop a model to describe that substances are made of particles too small to be seen."
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "DrivingQuestion": {
              "type": "string",
              "description": "MUST match UnitOverview.DrivingQuestion verbatim."
            },
            "Problem": {
              "type": "string",
              "description": "The problem description must present a real, observable challenge in a community, system, or environment; explain why the problem matters and the consequences if it is not addressed; ensure the problem requires analysis, reasoning, and evidence rather than simple recall; identify underlying contributing factors such as scientific, historical, mathematical, civic, artistic, technological, or social elements; show how misunderstanding, missing information, or overlooked variables contribute to the issue; clearly outline the intellectual and practical tasks students must complete using disciplinary knowledge, evidence analysis, modeling, explanation, design, or evaluation of solutions; demonstrate how solving the problem requires mastery of the unit's core concepts, skills, and reasoning practices; align explicitly with a clear, open-ended driving question that can be answered through project work; specify required student response components such as a model or design, evidence-based analysis, visual or representational thinking, and a reasoned conclusion; and explain how the solution serves a real, relevant authentic audience positioned to use or evaluate the work."
            },
            "Project": {
              "type": "string",
              "description": "Narrative of how learning builds across the multi-day project (inquiry -> apply -> refine -> present). Not a day-by-day schedule."
            },
            "Place": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "PlaceOverview",
                "Sites",
                "PlaceMattersReminder"
              ],
              "properties": {
                "PlaceOverview": {
                  "type": "string",
                  "description": "The model must explain how the local context shapes the real-world problem students are solving, how it influences the driving question they will investigate, and how it determines the form and expectations of the final product. The output must clearly describe the local environments, stakeholders, or community needs that make the project meaningful and show how those elements inform student work, required evidence, and authentic impact."
                },
                "Sites": {
                  "type": "array",
                  "minItems": 3,
                  "maxItems": 4,
                  "description": "Must include 3 to 5 Place-Based Sites of Engagement, each structured with three labeled components: The Site, describing a meaningful physical, community, virtual, or discipline-specific location relevant to the unit's context; Engagement, explaining authentic inquiry activities students complete at or with the site such as observation, data collection, interviews, analysis, virtual exploration, or guided field tasks tied to the real-world problem; and Relevance, explaining why the site matters by connecting it to the problem, showing how it provides evidence or expertise, clarifying how it supports solution design or modeling, and highlighting local or community-specific significance; sites must represent varied contexts, include at least one involving community expertise, include at least one involving direct observation or physical context even if virtual, remain subject-neutral, and clearly show how the local community is part of the learning ecosystem.",
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "TheSite",
                      "Engagement",
                      "Relevance"
                    ],
                    "properties": {
                      "TheSite": {
                        "type": "string"
                      },
                      "Engagement": {
                        "type": "string"
                      },
                      "Relevance": {
                        "type": "string"
                      }
                    }
                  }
                },
                "PlaceMattersReminder": {
                  "type": "string",
                  "description": "Reminder: local geography/history/culture/infrastructure must meaningfully affect student decisions and solutions."
                }
              }
            }
          }
        },
        "AssessmentPlan": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "FormativeAssessmentTable",
            "AnalyticRubric",
            "AuthenticAudience"
          ],
          "properties": {
            "AuthenticAudience": {
              "type": "object",
              "description": "The rubric must be produced as a table with exactly the following column headers in this order: Criteria, Novice, Apprentice, Practitioner, and Expert. Each row represents one evaluated skill, competency, or dimension of the final project. The Novice to Expert progression must reflect increasing sophistication and must not use deficit-based language such as fails, lacks, or missing. The Expert column must build on the Practitioner level with deeper insight, precision, or complexity. Keep the column headers exactly as written. The number of rows should match the number of major competencies required by the project. The required output structure example is provided for format only and not for content.",
              "additionalProperties": false,
              "required": [
                "PrimaryAudienceDescription",
                "WhyThisAudienceIsQualified",
                "HowThisAudienceElevatesTheProject",
                "StudentParticipationInAudienceSelection"
              ],
              "properties": {
                "PrimaryAudienceDescription": {
                  "type": "string",
                  "description": "Clear description of who the primary audience is (individuals, organizations, or groups) and their relationship to the project's context or problem."
                },
                "WhyThisAudienceIsQualified": {
                  "type": "string",
                  "description": "Explanation of why this audience has relevant expertise, lived experience, or authority related to the project topic."
                },
                "HowThisAudienceElevatesTheProject": {
                  "type": "string",
                  "description": "How the presence of this audience increases authenticity, rigor, motivation, or real-world impact for students."
                },
                "StudentParticipationInAudienceSelection": {
                  "type": "string",
                  "description": "Description of how students are involved in identifying, refining, or understanding the authentic audience."
                }
              }
            },
            "FormativeAssessmentTable": {
              "type": "array",
              "minItems": 3,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "CriteriaForSuccess",
                  "SuccessCriteria",
                  "PointOfDemonstration"
                ],
                "properties": {
                  "CriteriaForSuccess": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "string"
                  },
                  "PointOfDemonstration": {
                    "type": "string",
                    "description": "Formative Assessment Rubric MUST use the exact column headers Criteria for Success (Student Learning Objective), Success Criteria, and Point of Demonstration. Analytic Rubric MUST use the exact column headers Criteria, Novice, Apprentice, Practitioner, and Expert. This schema does not contain content and only provides instructions for how the model must structure the output. Create an Assessment Rubrics section containing two required rubric formats and keep the exact column headers word for word with no substitutions. For the Formative Assessment Rubric, produce a table with exactly three columns labeled Criteria for Success (Student Learning Objective), Success Criteria, and Point of Demonstration, and populate each row with a specific measurable learning objective, its aligned success criteria, and where the evidence will appear such as a task, checkpoint, or performance moment. The number of rows must match the number of learning objectives in the unit, language must be clear and student friendly, and alignment between objective, criteria, and evidence point must be maintained. Keep the column headers exactly as written. The structure example is provided for format only and not for content."
                  }
                }
              }
            },
            "AnalyticRubric": {
              "type": "array",
              "minItems": 4,
              "description": "The rubric must be produced as a table with exactly the following column headers in this order: Criteria, Novice, Apprentice, Practitioner, and Expert. Each row represents one evaluated skill, competency, or dimension of the final project. The Novice to Expert progression must reflect increasing sophistication and must not use deficit-based language such as fails, lacks, or missing. The Expert column must build on the Practitioner level with deeper insight, precision, or complexity. Keep the column headers exactly as written. The number of rows should match the number of major competencies required by the project. The required output structure example is provided for format only and not for content.",
              "items": {
                "type": "object",
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
                    "type": "string"
                  },
                  "Novice": {
                    "type": "string"
                  },
                  "Apprentice": {
                    "type": "string"
                  },
                  "Practitioner": {
                    "type": "string"
                  },
                  "Expert": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "LearningPlan": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "LearningPlanOverview",
            "ProjectPhases",
            "ProjectGoals",
            "CommunicationToAuthenticAudienceExpectations",
            "FinalDeliverableSummary",
            "GroupSuggestions"
          ],
          "properties": {
            "LearningPlanOverview": {
              "type": "string",
              "description": "The output must include a clear statement of the total number of instructional days based on the value provided by the teacher, a short description of how the project unfolds across phases rather than fixed dates, and a 2-4 sentence summary explaining how learning progresses across the unit. The model must not assume specific day ranges such as Days 1-3 and must instead divide learning into three flexible phases labeled Early Phase, Middle Phase, and Final Phase. The Early Phase must describe building foundational knowledge, introducing core concepts, tools, or skills, conducting exploratory investigations or guided practice, and preparing students for deeper inquiry. The Middle Phase must describe applying core concepts to the central problem, conducting analyses or research, developing drafts, prototypes, models, or design ideas, and gathering and interpreting evidence for the final deliverable. The Final Phase must describe refining the final product, synthesizing learning into clear explanations, preparing visuals, models, arguments, or presentations, and presenting to the authentic audience. The model must not assign a fixed number of days to any phase and must allow any duration provided by the teacher."
            },
            "ProjectPhases": {
              "type": "array",
              "minItems": 3,
              "maxItems": 4,
              "items": {
                "type": "object",
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
                    "type": "string"
                  },
                  "PhaseDescription": {
                    "type": "string"
                  },
                  "ConceptsOrSkills": {
                    "type": "string"
                  },
                  "CollaborationAndVisibleThinking": {
                    "type": "string"
                  },
                  "KeyLearningExperiences": {
                    "type": "array",
                    "minItems": 3,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "ProjectGoals": {
              "type": "array",
              "minItems": 3,
              "description": "The output must contain exactly three project goals, each expressed as a conceptual category followed by detailed bullets or short paragraphs. Goal 1, Apply Disciplinary Content to a Real-World Problem, requires students to use discipline-specific knowledge to analyze or solve an authentic challenge, list 4-6 core concepts or principles they will apply, and show how these ideas connect to real-world conditions or constraints. Goal 2, Solve a Real, Developmentally Appropriate Design or Inquiry Problem, requires describing the authentic challenge students must address, listing what students will create, model, compare, analyze, evaluate, or justify, and including processes such as modeling, predicting, comparing, evaluating, and decision-making. Goal 3, Communicate Findings to a Real Audience, requires students to prepare a polished, professional-quality final product, tailor communication to the needs of a real stakeholder group, and reference authentic audiences such as local experts, community organizations, industry professionals, school leadership, families, or community members.",
              "items": {
                "type": "string"
              }
            },
            "CommunicationToAuthenticAudienceExpectations": {
              "type": "string"
            },
            "FinalDeliverableSummary": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string"
              }
            },
            "GroupSuggestions": {
              "type": "object",
              "description": "Outlines group size, roles and teacher duties.",
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
                  "description": "The output must state a recommended group size such as 3 to 4 students and must provide a rationale explaining how this size supports productive discussion, shared engagement, and manageable task distribution."
                },
                "RotatingRolesAndDuties": {
                  "type": "array",
                  "description": "The output must provide a list of roles formatted as Role Name: description of duties. The list must include at least four roles, and the required functional categories are Facilitator who guides discussion and ensures full participation, Recorder who documents group thinking, Materials Manager who handles tools and resources safely, and Presenter or Communicator who shares group findings. Optional roles may also appear such as Researcher, Data Analyst, Model Builder, or Timekeeper. Third, Teacher Expectations for Role Implementation: The output must state that teachers introduce and model each role at the start of the project, establish clear norms for how roles function during group work, and require that students rotate roles across activities so all learners practice multiple collaborative skills.",
                  "minItems": 4,
                  "items": {
                    "type": "string"
                  }
                },
                "TeacherGroupingStrategyPrompt": {
                  "type": "string",
                  "description": "The model must output the following text exactly as written, without altering any words, punctuation, or phrasing: To help teachers make intentional grouping decisions, include this planning prompt: 'What is the main purpose of your grouping in this activity-peer support, rich discussion, challenge, or efficiency? Once you have named the purpose, which grouping approach best fits it: mixed-ability, interest-based, skills-based, or random?' This question encourages teachers to choose grouping methods that match instructional goals rather than defaulting to convenience or habit. The model must not add additional explanation, examples, or commentary."
                },
                "GroupingStrategyRecommendations": {
                  "type": "array",
                  "description": "The model must output the following text exactly as written, without altering any words, punctuation, or phrasing: Teachers may consider: Mixed-ability Groups: Best when tasks require reasoning, evidence comparison, or scaffolding across readiness levels (e.g., particle-model brainstorming). Interest-based Groups: Ideal during sculpture concept development, allowing students to collaborate based on themes or artistic styles they are drawn to. Skills-based Groups: Useful when tasks require technical precision (e.g., particle diagrams, environmental stress modeling). Randomized Groups: Helpful during early exploration tasks to build community and reduce over-reliance on predictable partnerships. The model must not add additional explanation, examples, or commentary.",
                  "minItems": 4,
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "TeacherGuidancePhase1": {
          "type": "object",
          "additionalProperties": false,
          "description": "First phase of teacher guidance",
          "required": [
            "Phase1_Title",
            "Phase1_FocusStatement",
            "Phase1_CollaborativeActivities",
            "Phase1_GuidingQuestions",
            "Phase1_Differentiation_LanguageLearners",
            "Phase1_Differentiation_Scaffolding",
            "Phase1_Differentiation_GoDeeper",
            "Phase1_Accommodations_General",
            "Phase1_Accommodations_IndividualSupport",
            "Phase1_AnticipatedMisconceptions",
            "Phase1_TranscendentThinkingPrompts",
            "Phase1_QuickChecks",
            "Phase1_SpacedRetrieval",
            "Phase1_StudentPractice_TeacherNotes",
            "Phase1_StudentPractice_Tasks",
            "Phase1_StudentPractice_InterleavingIfMath",
            "Phase1_ReflectionPrompt"
          ],
          "properties": {
            "Phase1_Title": {
              "type": "string",
              "description": "MUST be exactly: 'Phase 1 - Launch'."
            },
            "Phase1_FocusStatement": {
              "type": "string",
              "description": "Provide a short statement describing how this phase builds curiosity, introduces the real-world problem, and activates early reasoning. The Focus Statement must include curiosity-building about the core phenomenon or problem, early observation and exploration, student-driven noticing and questioning, and a clear connection to the unit's Driving Question. The wording should reflect that in this launch phase students build curiosity and begin uncovering the scientific or conceptual problem at the center of the project, and that through observation, exploration, and early modeling attempts they gather firsthand evidence that connects their initial thinking to the Driving Question."
            },
            "Phase1_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
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
                      "type": "string"
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
                "type": "string"
              }
            },
            "Phase1_Differentiation_LanguageLearners": {
              "type": "string",
              "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
            },
            "Phase1_Differentiation_Scaffolding": {
              "type": "string",
              "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
            },
            "Phase1_Differentiation_GoDeeper": {
              "type": "string",
              "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
            },
            "Phase1_Accommodations_General": {
              "type": "string",
              "description": "General classroom supports and modifications that apply to most or all students during this activity."
            },
            "Phase1_Accommodations_IndividualSupport": {
              "type": "array",
              "minItems": 0,
              "description": "List of specific student accommodations. Each entry MUST use the student names and plans exactly as provided in the prompt.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "StudentName",
                  "PlanProvided",
                  "PlanImplementation"
                ],
                "properties": {
                  "StudentName": {
                    "type": "string",
                    "description": "Full name of the student exactly as provided in the prompt."
                  },
                  "PlanProvided": {
                    "type": "string"
                  },
                  "PlanImplementation": {
                    "type": "string",
                    "description": "Short description of the individualized accommodation or modification for this student."
                  }
                }
              }
            },
            "Phase1_AnticipatedMisconceptions": {
              "type": "array",
              "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
              "minItems": 2,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Misconception",
                  "CorrectionLanguage"
                ],
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                  },
                  "CorrectionLanguage": {
                    "type": "string",
                    "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                  }
                }
              }
            },
            "Phase1_TranscendentThinkingPrompts": {
              "type": "array",
              "minItems": 1,
              "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Prompt",
                  "ExpectedStudentResponses"
                ],
                "properties": {
                  "Prompt": {
                    "type": "string"
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase1_QuickChecks": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "Prompt",
                  "SuccessCriteriaOrExpectedResponses"
                ],
                "properties": {
                  "Timing": {
                    "type": "string",
                    "description": "Use: 'Beginning of Phase' or 'Mid-Phase' or 'End of Phase'."
                  },
                  "Prompt": {
                    "type": "string"
                  },
                  "SuccessCriteriaOrExpectedResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase1_SpacedRetrieval": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "DrawsFrom",
                  "Question",
                  "DOK",
                  "ExpectedResponseOrSuccessCriteria"
                ],
                "properties": {
                  "Timing": {
                    "type": "string",
                    "description": "Use: 'Beginning of Phase' or 'Mid-Phase' or 'End of Phase'."
                  },
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
                    "type": "string"
                  }
                }
              }
            },
            "Phase1_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
            },
            "Phase1_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase1_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
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
                  "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
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
          "additionalProperties": false,
          "description": "Second phase of teacher guidance",
          "required": [
            "Phase2_Title",
            "Phase2_FocusStatement",
            "Phase2_CollaborativeActivities",
            "Phase2_GuidingQuestions",
            "Phase2_Differentiation_LanguageLearners",
            "Phase2_Differentiation_Scaffolding",
            "Phase2_Differentiation_GoDeeper",
            "Phase2_Accommodations_General",
            "Phase2_Accommodations_IndividualSupport",
            "Phase2_AnticipatedMisconceptions",
            "Phase2_TranscendentThinkingPrompts",
            "Phase2_QuickChecks",
            "Phase2_SpacedRetrieval",
            "Phase2_StudentPractice_TeacherNotes",
            "Phase2_StudentPractice_Tasks",
            "Phase2_StudentPractice_InterleavingIfMath",
            "Phase2_ReflectionPrompt"
          ],
          "properties": {
            "Phase2_Title": {
              "type": "string",
              "description": "MUST be exactly: 'Phase 2 - Exploration, Investigation, and Development; Refinement'."
            },
            "Phase2_FocusStatement": {
              "type": "string",
              "description": "Write a 1-3 sentence Focus Statement that summarizes the purpose of the phase, explains how students build understanding through inquiry-based work, explicitly connects the phase to the unit's Driving Question or real-world problem, and describes how this phase moves students closer to producing their final deliverable. The statement must always be written as a single short paragraph and must be customized to the specific project details provided by the user."
            },
            "Phase2_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
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
                      "type": "string"
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
                "type": "string"
              }
            },
            "Phase2_Differentiation_LanguageLearners": {
              "type": "string",
              "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
            },
            "Phase2_Differentiation_Scaffolding": {
              "type": "string",
              "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
            },
            "Phase2_Differentiation_GoDeeper": {
              "type": "string",
              "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
            },
            "Phase2_Accommodations_General": {
              "type": "string",
              "description": "General classroom supports and modifications that apply to most or all students during this activity."
            },
            "Phase2_Accommodations_IndividualSupport": {
              "type": "array",
              "minItems": 0,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "StudentName",
                  "PlanProvided",
                  "PlanImplementation"
                ],
                "properties": {
                  "StudentName": {
                    "type": "string",
                    "description": "Full name of the student exactly as provided in the prompt."
                  },
                  "PlanProvided": {
                    "type": "string"
                  },
                  "PlanImplementation": {
                    "type": "string",
                    "description": "Short description of the individualized accommodation or modification for this student."
                  }
                }
              }
            },
            "Phase2_AnticipatedMisconceptions": {
              "type": "array",
              "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
              "minItems": 2,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Misconception",
                  "CorrectionLanguage"
                ],
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                  },
                  "CorrectionLanguage": {
                    "type": "string",
                    "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                  }
                }
              }
            },
            "Phase2_TranscendentThinkingPrompts": {
              "type": "array",
              "minItems": 1,
              "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Prompt",
                  "ExpectedStudentResponses"
                ],
                "properties": {
                  "Prompt": {
                    "type": "string"
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase2_QuickChecks": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "Prompt",
                  "SuccessCriteriaOrExpectedResponses"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
                  "Prompt": {
                    "type": "string"
                  },
                  "SuccessCriteriaOrExpectedResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase2_SpacedRetrieval": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "DrawsFrom",
                  "Question",
                  "DOK",
                  "ExpectedResponseOrSuccessCriteria"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
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
                    "type": "string"
                  }
                }
              }
            },
            "Phase2_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
            },
            "Phase2_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase2_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
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
                  "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
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
          "additionalProperties": false,
          "description": "Third phase of teacher guidance",
          "required": [
            "Phase3_FocusStatement",
            "Phase3_CollaborativeActivities",
            "Phase3_GuidingQuestions",
            "Phase3_Differentiation_LanguageLearners",
            "Phase3_Differentiation_Scaffolding",
            "Phase3_Differentiation_GoDeeper",
            "Phase3_Accommodations_General",
            "Phase3_Accommodations_IndividualSupport",
            "Phase3_AnticipatedMisconceptions",
            "Phase3_TranscendentThinkingPrompts",
            "Phase3_QuickChecks",
            "Phase3_SpacedRetrieval",
            "Phase3_StudentPractice_TeacherNotes",
            "Phase3_StudentPractice_Tasks",
            "Phase3_StudentPractice_InterleavingIfMath",
            "Phase3_ReflectionPrompt",
            "Phase3_Title"
          ],
          "properties": {
            "Phase3_Title": {
              "type": "string",
              "description": "MUST be exactly: 'Phase 3 - Development; Refinement, Culmination, and Reflection'."
            },
            "Phase3_FocusStatement": {
              "type": "string",
              "description": "Generate a 2-4 sentence Focus Statement that clearly communicates the purpose of Phase 3 and its role in moving students toward the final product. The statement must explain that Phase 3 focuses on refining ideas, applying learning, strengthening evidence, preparing culminating products, and engaging in deeper reasoning and revision. It must explicitly show how Phase 3 advances the project's authentic real-world challenge, how students use evidence to improve solutions, and how this work prepares them for an authentic audience. The statement must include intellectual work such as refining, revising, synthesizing, evaluating, justifying, finalizing, and communicating, and it must indicate how students finalize models, products, explanations, or proposals, prepare presentations or public showcases, and reflect on learning to strengthen their reasoning."
            },
            "Phase3_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
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
                      "type": "string"
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
                "type": "string"
              }
            },
            "Phase3_Differentiation_LanguageLearners": {
              "type": "string",
              "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
            },
            "Phase3_Differentiation_Scaffolding": {
              "type": "string",
              "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
            },
            "Phase3_Differentiation_GoDeeper": {
              "type": "string",
              "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
            },
            "Phase3_Accommodations_General": {
              "type": "string",
              "description": "General classroom supports and modifications that apply to most or all students during this activity."
            },
            "Phase3_Accommodations_IndividualSupport": {
              "type": "array",
              "minItems": 0,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "StudentName",
                  "PlanProvided",
                  "PlanImplementation"
                ],
                "properties": {
                  "StudentName": {
                    "type": "string",
                    "description": "Full name of the student exactly as provided in the prompt."
                  },
                  "PlanProvided": {
                    "type": "string"
                  },
                  "PlanImplementation": {
                    "type": "string",
                    "description": "Short description of the individualized accommodation or modification for this student."
                  }
                }
              }
            },
            "Phase3_AnticipatedMisconceptions": {
              "type": "array",
              "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
              "minItems": 2,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Misconception",
                  "CorrectionLanguage"
                ],
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                  },
                  "CorrectionLanguage": {
                    "type": "string",
                    "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                  }
                }
              }
            },
            "Phase3_TranscendentThinkingPrompts": {
              "type": "array",
              "minItems": 1,
              "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Prompt",
                  "ExpectedStudentResponses"
                ],
                "properties": {
                  "Prompt": {
                    "type": "string"
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase3_QuickChecks": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "Prompt",
                  "SuccessCriteriaOrExpectedResponses"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
                  "Prompt": {
                    "type": "string"
                  },
                  "SuccessCriteriaOrExpectedResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase3_SpacedRetrieval": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "DrawsFrom",
                  "Question",
                  "DOK",
                  "ExpectedResponseOrSuccessCriteria"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
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
                    "type": "string"
                  }
                }
              }
            },
            "Phase3_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
            },
            "Phase3_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase3_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
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
                  "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
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
};

  return {
    defaultPrompt,
    unitDescriptionHtmlPrompt,
    assessPriorKnowledgeHtmlPrompt,
    unitOverviewHtmlPrompt,
    desiredOutcomesHtmlPrompt,
    framingTheProjectHtmlPrompt,
    assesmentPlanHtmlPrompt,
    learningPlanHtmlPrompt,
    teacherGuidancePhase1HtmlPrompt,
    teacherGuidancePhase2HtmlPrompt,
    teacherGuidancePhase3HtmlPrompt,
    unitPreparationAndConsiderationsHtmlPrompt,
    pblResponseSchema,
  };
})();
