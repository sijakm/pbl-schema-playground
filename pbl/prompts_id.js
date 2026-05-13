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

const pblResponseSchema = {};

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
