window.promptsID = {
  STEP0_PROMPT_TEMPLATE: `
Buat garis besar unit dan struktur pelajaran menggunakan info di bawah ini. JANGAN menulis rencana pelajaran lengkap.
                    
Berdasarkan Subjek Unit, standar pendidikan, Deskripsi/Instruksi Unit, Tingkat Kelas, Durasi periode kelas (menit), dan Jumlah Pelajaran yang diminta, hasilkan respons JSON yang mencakup UnitDescription yang kohesif dan daftar "wadah" pelajaran yang tidak tumpang tindih.

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
  
Standar untuk Disejajarkan:
{{$Standards}}
    
Siswa dengan dukungan individual:
{{$LearningPlans}}

Sumber Daya/Media untuk digunakan:
{{$MediaContext}}
  
Konten Unit:
{{$AttachedUnit}}

Persyaratan Pertanyaan Esensial (Essential Questions):
- Setiap pertanyaan HARUS berupa kalimat yang lengkap dan benar secara tata bahasa yang diakhiri dengan tanda tanya.
- Setiap pertanyaan HARUS dimulai dengan "Bagaimana" atau "Mengapa".
- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS fokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus subjek.
- Pertanyaan HARUS dapat dialihkan ke berbagai disiplin ilmu dan dapat diterapkan di luar unit ini.
- Pertanyaan HARUS digunakan kembali secara kata demi kata di setiap pelajaran dalam unit ini.

Apa yang harus dihasilkan:
- Output HARUS berupa JSON valid yang sesuai dengan skema.
- WAJIB: Isi lengkap semua properti dalam objek "UnitDescription":
  - "Description": Tulis paragraf 4-5 kalimat yang mendeskripsikan fokus inti unit dan alur narasinya.
  - "StudentLearningObjectives": Daftar 3-5 tujuan pembelajaran utama yang terukur untuk unit ini.
  - "StandardsAligned": Daftar semua standar yang dibahas di seluruh unit.
  - "EssentialQuestions": Tepat 3 pertanyaan konseptual mengikuti aturan di atas.
- HASILKAN daftar "Lessons" yang berisi tepat {{$NumberOfItems}} pelajaran.
  - Setiap pelajaran harus mencakup "lessonNumber" (indeks berbasis 1), "lessonName", dan "lessonDescription" (2–4 kalimat yang mendeskripsikan cakupan pelajaran).

Batasan:
- Jaga agar unit dan setiap pelajaran tetap selaras dengan fokus unit.
- Pastikan pengurutan yang logis dari ide-ide dasar ke pemodelan yang lebih kompleks.
- Akurasi: Semua konten harus akurat secara ilmiah dan sesuai usia.

Output HARUS berupa JSON valid yang sesuai dengan skema. Gunakan format padat (tidak ada baris kosong tambahan).
`,
  PER_LESSON_PROMPT_TEMPLATE: `
Buat SATU rencana pelajaran (BUKAN rencana unit, BUKAN beberapa pelajaran) menggunakan info di bawah ini.
Anda HARUS menghasilkan JSON valid yang sesuai dengan skema JSON yang disediakan secara tepat (LessonPlanResponse dengan satu objek "LessonPlan"). Jangan sertakan kunci tambahan apa pun. Gunakan format JSON padat (tidak ada baris kosong tambahan).

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
Sumber Daya/Media untuk digunakan: 
{{$MediaContext}}
Konten Unit: 
{{$ParentUnitData}}
Standar untuk Disejajarkan:
{{$Standards}}
Konten Pelajaran Terlampir: 
{{$AttachedLesson}}

Pertanyaan Esensial Unit (GUNAKAN INI KATA DEMI KATA):
{{$UnitEssentialQuestions}}

Jika Pertanyaan Esensial Unit di atas kosong, hasilkan tepat 3 pertanyaan konseptual mengikuti aturan ini:
- Setiap pertanyaan HARUS berupa kalimat yang lengkap dan benar secara tata bahasa yang diakhiri dengan tanda tanya.
- Setiap pertanyaan HARUS dimulai dengan "Bagaimana" atau "Mengapa".
- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisional.
- Pertanyaan HARUS fokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten khusus subjek.
- Pertanyaan HARUS dapat dialihkan ke berbagai disiplin ilmu dan dapat diterapkan di luar unit ini.


SISWA DENGAN DUKUNGAN INDIVIDUAL (HARUS digunakan HANYA di dalam GuidedPractice.AccommodationsAndModifications; gunakan nama/rencana siswa persis seperti yang tertulis):
{{$LearningPlans}}

ATURAN KONTEN PENTING:
- Jaga agar pelajaran selaras dengan fokus unit: mengembangkan dan menggunakan model untuk mendeskripsikan komposisi atom dari molekul sederhana dan/atau struktur yang diperluas.
- Sertakan koneksi singkat tingkat tinggi ke DCI relevan lainnya jika sesuai, tetapi jaga agar pelajaran tetap berpusat pada pemodelan dan penalaran struktur–sifat (tidak ada matematika mendalam, tidak ada penyeimbangan persamaan kecuali jika diminta secara eksplisit oleh standar).
- Pastikan semua bagian pelajaran mencerminkan Cakupan/Batasan Pelajaran di atas; hindari memperkenalkan konsep utama baru yang termasuk dalam pelajaran lain.
- EssentialQuestions: HARUS sama persis dengan pertanyaan esensial tingkat unit (teks yang sama, urutan yang sama).
- AssessPriorKnowledge: HANYA jika LessonNumber == 1, tulis 150–250 kata dan ikuti struktur yang diperlukan dalam deskripsi skema. Jika LessonNumber != 1, kembalikan "" (string kosong).
- DirectPresentation harus ≤10 menit total dan harus mengikuti format HOOK/INTRODUCTION/DIRECT TEACHING/GUIDED ENGAGEMENT yang diperlukan dengan Say/Do/Ask/✅ Expected Student Responses/Write, dan respons siswa yang diharapkan sebagai poin-poin (JANGAN sertakan tajuk/judul bagian dalam string).
- GuidedPractice.InstructionsForTeachers harus minimal 700 kata dan harus mencakup komponen yang diperlukan yang tercantum dalam deskripsi skema.
- GuidedPractice.AccommodationsAndModifications harus mencakup:
  - General: dukungan umum
  - IndividualSupport: array dengan tepat siswa yang disediakan dan rencana mereka (nama/rencana yang sama; tidak ada siswa tambahan).
- StudentPractice HARUS mencakup paragraf TeacherNotes yang dimulai dengan 'Tugas-tugas ini memperkuat pembelajaran hari ini tentang ____ dengan ______.', daftar 2-3 tugas dengan DOK 2-4 dan kriteria keberhasilan, dan interleaving jika subjeknya adalah matematika.

PERSYARATAN OUTPUT:
- Output HARUS berupa JSON valid yang sesuai dengan skema yang disediakan secara tepat.
- Output HARUS berupa rencana pelajaran TUNGGAL saja.
- Tidak ada HTML. Tidak ada emoji. Tidak ada markdown. Teks biasa di dalam bidang string.
`,
  HTML_LESSON_PROMPT_TEMPLATE: `
Anda akan menerima SATU objek JSON yang secara ketat mengikuti skema UnitPlanResponse (sudah divalidasi di pihak saya). Tugas Anda adalah mengubah JSON ini menjadi HTML yang bersih dan mudah dibaca yang dapat digunakan guru secara langsung di kelas.

FORMAT INPUT
Saya akan mengirimkan objek JSON kepada Anda seperti ini:

UNIT PLAN JSON:
{{{JsonResponse}}}

Anggap semua yang ada setelah baris "UNIT PLAN JSON:" sebagai objek JSON yang tepat. JANGAN menjelaskan atau mengomentarinya; cukup uraikan dan render.

ATURAN GLOBAL
    - Output HANYA HTML valid (tidak ada markdown, tidak ada backticks, tidak ada penjelasan prosa).
    - Tag yang diizinkan: <p>, <h1>, <h2>, <h3>, 
    - (dibungkus di dalam <p>), <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - JANGAN gunakan tag lain (tidak ada <main>, <section>, <header>, <div>, <h4>, dll.).
    - HTML harus menjorok dengan baik dan mudah dibaca.
    - Dalam <ol> atau <ul> apa pun, HANYA gunakan elemen <li> sebagai anak langsung. Jangan pernah menempatkan <p>, <span>, <ul>, <ol>, atau tag lainnya sebagai anak dari sebuah daftar.
    - JANGAN membuat konten instruksional baru; gunakan hanya apa yang ada di bidang JSON.
    - Pertahankan urutan logis yang tersirat oleh skema:
    - Di dalam setiap pelajaran, ikuti urutan bidang skema.
    - Jika bidang string kosong (""), HAPUS subbagian tersebut dan labelnya.
    - Jika array kosong, hapus tajuknya dan <ul> atau <ol> yang sesuai.
    - Kapan pun teks tersebut jelas membentuk daftar prompt/pertanyaan/pernyataan/respons, gunakan <ul><li>…</li></ul> atau <ol><li>…</li></ol>. Jika tidak, gunakan <p>.
    - Kapan pun Anda me-render model/respons siswa yang diharapkan di bagian APA PUN, gunakan pola ini:
        - Pertama: <p>✅ Respons Siswa yang Diharapkan</p> (tidak ada poin-poin di baris ini)
        - Kemudian daftar <ul> atau <ol> yang berisi respons (satu respons per <li>).
    - Kapan pun Anda me-render Cek Cepat (Quick Check):
        - Gunakan tajuk tepat ini: <p><strong>✔Cek Cepat</strong></p>
        - Render pertanyaan atau tugas segera setelah tajuk sebagai paragraf yang menugaskan SETIAP siswa untuk menunjukkan pemahaman mereka (bukan hanya satu siswa dalam pemeriksaan verbal).
        - Gunakan pola ✅ Respons Siswa yang Diharapkan global untuk jawabannya.

Untuk pelajaran ini:
    - Pertanyaan Esensial Pelajaran (jika ada):
    - <h3>💭 Pertanyaan Esensial</h3>
    - <ul> dengan setiap item di Lesson.EssentialQuestions sebagai <li>.
    - Kosakata Kunci (jika ada):
    - <h3>🔤 Kosakata Kunci</h3>
    - <ol> di mana setiap item dari KeyVocabulary adalah satu <li>, mempertahankan struktur "Istilah – Definisi":
    - <strong>Istilah</strong> – Definisi
    - Tujuan Pembelajaran Siswa (jika ada):
    - <h3>🎯 Tujuan Pembelajaran Siswa</h3>
    - <ul> dengan setiap item dari Lesson.StudentLearningObjectives sebagai <li>.
    - Standar untuk pelajaran:
    - <h3>📏 Standar yang Disejajarkan</h3>
    - <ul> yang berisi Lesson.StandardsAligned sebagai <li>.
    Aturan keras — Standar yang Disejajarkan harus selalu di-render:
    Jika Lesson.StandardsAligned berisi setidaknya satu item yang tidak kosong, Anda HARUS me-render blok "📏 Standar yang Disejajarkan" tepat satu kali untuk pelajaran tersebut. Jangan hilangkan karena alasan apa pun.
    Penempatan: render segera setelah "🎯 Tujuan Pembelajaran Siswa"; jika "💡 Nilai Pengetahuan Sebelumnya" di-render, maka render "📏 Standar yang Disejajarkan" segera setelah blok Nilai Pengetahuan Sebelumnya.

NILAI PENGETAHUAN SEBELUMNYA (ASSESS PRIOR KNOWLEDGE)
    - Subbagian ini muncul HANYA jika properti "AssessPriorKnowledge" ada di JSON dan merupakan string yang tidak kosong.
    - Tempatkan segera setelah blok <h3>🎯 Tujuan Pembelajaran Siswa</h3> pelajaran tersebut.

    Rendering:
        - <h3>💡 Nilai Pengetahuan Sebelumnya</h3>
        - Render paragraf berikut: <p><strong>Catatan guru: </strong>Mengaktifkan pengetahuan sebelumnya siswa bukan sekadar pemanasan—ini adalah aksi ilmu saraf. Proses ini mengaktifkan jalur saraf yang ada, memudahkan otak untuk menempelkan informasi baru pada apa yang sudah diketahui. Teknik ini, yang disebut pengodean elaboratif, membantu siswa memindahkan pengetahuan ke memori jangka panjang lebih cepat dan lebih efektif, meningkatkan pemahaman dan retensi. </p>
        - Gambaran Umum:
            - Render paragraf skrip pembuka guru yang memperkenalkan aktivitas sebagai satu atau lebih blok <p> sebelum daftar apa pun.
        - Instruksi:
            - Render instruksi guru sebagai daftar poin-poin (<ul>) di mana setiap instruksi menjadi satu <li> teks biasa (JANGAN sertakan HTML di dalam <li>).
            - JANGAN menyarangkan daftar di dalam <li> apa pun; semua daftar harus tingkat atas dan hanya berisi <li>.
        - Templat/Struktur:
            - Render teks Templat/Struktur sebagai paragraf tunggal <p> yang berisi skrip guru (misalnya, Say: ... Do: ...), mempertahankan kata-kata dan tanda baca yang tepat.
            - Segera setelah <p> tersebut, jika respons siswa yang diharapkan disediakan, render:
            <p>✅ Respons Siswa yang Diharapkan</p>
            diikuti oleh <ul> di mana setiap respons adalah satu <li> teks biasa.
            - JANGAN tempatkan daftar respons ini di dalam <li> atau daftar lainnya.
        - Baris penutup:
            - Setiap kalimat penutup guru yang disediakan sebagai paragraf terpisah harus di-render sebagai <p>-nya sendiri setelah daftar.
        - Batasan:
            - Pertahankan kata-kata sumber yang tepat; jangan membuat atau merangkum konten.
            - Gunakan hanya tag yang diizinkan; daftar hanya boleh berisi <li> sebagai anak langsung; tidak ada daftar bersarang di dalam <li>.
            - Pastikan indentasi yang mudah dibaca dan semua elemen <li> hanya berupa teks biasa.
        - Opsi Alternatif:
            - Tempatkan ini SETELAH penutup </ol> dari daftar berurutan utama.
            - Output pertama: <p><strong>Opsi Alternatif</strong></p>
            - Kemudian render daftar berurutan tingkat atas yang independen <ol> di mana setiap opsi adalah satu <li> teks biasa.

Jangan membuat konten; hanya restrukturisasi apa yang ada di dalam Lesson.AssessPriorKnowledge.

PRESENTASI LANGSUNG (DIRECT PRESENTATION)
    - Render bagian Presentasi Langsung (jika ada untuk pelajaran tersebut) sebagai:

    - <h3><span style="color: rgb(115, 191, 39);">Presentasi Langsung (10 mnt)</span></h3>
    - Materi (jika ada):
    - <p><strong>📚 Materi</strong></p>
    - <ul> dengan item <li> dari DirectPresentation.Materials.
    - Instruksi untuk Guru:
    - <p><strong>📋 Instruksi untuk Guru</strong></p>
    - Render skrip yang menghadap guru sebagai urutan blok <p>. Setiap isyarat atau kalimat guru yang dimulai dengan label seperti "Say:", "Do:", "Ask:", "Write:", atau "Draw/Show:" harus menjadi <p> bernomornya sendiri ketika bersifat menjelaskan atau mengatur panggung (misalnya: Say: "…", Do: Show …).
    - PENTING: Kapan pun Anda menemukan respons siswa (misalnya, "✅ Expected Student Responses:"), JANGAN sertakan di dalam blok <p> apa pun. Sebaliknya, SELALU render sebagai <ul> tingkat atas yang independen segera setelah <p> sebelumnya. Setiap respons individu HARUS berupa <li>-nya sendiri. JANGAN gabungkan beberapa respons ke dalam satu <li>. Setiap <li> harus dimulai dengan label "✅ Respons Siswa yang Diharapkan — ".
    - Jika Anda memilih untuk me-render urutan langkah UTAMA sebagai daftar, gunakan <ul> tingkat atas di mana setiap langkah UTAMA adalah satu <li>. Setiap <li> tersebut HARUS hanya berisi teks biasa (tidak ada tag HTML di dalam <li>). Pertahankan isyarat guru sebagai teks biasa di dalam <li> tersebut.
    - JANGAN menyarangkan <ul>, <ol>, <p>, <span>, atau HTML lainnya di dalam <li>. Untuk mewakili sub-poin, prompt, pertanyaan, respons model, atau sub-langkah berurutan, RATAKAN (flatten) mereka sebagai entri <li> tingkat atas tambahan berturut-turut segera setelah langkah induk, menggunakan awalan yang jelas yang menghubungkan mereka ke langkah induk. Contoh awalan yang diperlukan:
        - "Terkait dengan langkah sebelumnya: …"
        - "Dari langkah 2: …"
        - "Langkah 3.a — …"
    - Respons siswa yang diharapkan yang biasanya akan bersarang HARUS diratakan menjadi elemen <li> tingkat atas individu. Setiap <li> tersebut harus dimulai dengan label teks biasa:
        ✅ Respons Siswa yang Diharapkan — [Teks respons]
           - Simpan satu respons per <li>.

        7) Pemformatan dan keamanan yang ketat:
           - Gunakan hanya tag yang diizinkan (<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>).
           - Daftar hanya boleh berisi <li> sebagai anak langsung. Tidak ada daftar bersarang di dalam <li>.
           - Pertahankan kata-kata guru yang tepat dari JSON; jangan membuat atau merangkum.
           - Pastikan indentasi yang mudah dibaca.

        TERAPKAN ATURAN PEMETAAN INI:
      (Satu respons per <li>; SELALU pisahkan mereka; jangan gabungkan melalui tanda hubung atau gabungkan dalam satu <li>.)
    - Untuk Cek Cepat yang akan disematkan dalam urutan, gunakan pola ✔Cek Cepat dan ✅ Respons Siswa yang Diharapkan global.
    - Setelah langkah terakhir atau blok <p>/<ul> terakhir, TUTUP tag <ul> jika Anda membuka satu untuk langkah UTAMA dan lanjutkan dengan blok atau bagian berlabel berikutnya sesuai kebutuhan.
    - Miskonsepsi yang Diantisipasi (jika ada):
    - <p><strong>⚠️ Miskonsepsi yang Diantisipasi</strong></p>
    - Render miskonsepsi sebagai satu atau lebih <p> atau sebagai <ul><li>…</li></ul>. Jangan tempatkan daftar bersarang tambahan di dalam <li>—jaga daftar hanya sebagai <ul> tingkat atas di mana setiap <li> adalah teks biasa.
    - Pemikiran Transenden (jika ada):
    - <p><strong>🌍 Pemikiran Transenden</strong></p>
    - Gunakan <p> untuk teks penjelasan, dan <ul><li>…</li></ul> untuk contoh. Jaga agar setiap <li> berupa teks biasa.
    - Jika contoh/model disediakan, gunakan pola global untuk respons:
    - <p>✅ Respons Siswa yang Diharapkan</p> diikuti oleh daftar yang sesuai yang ditempatkan di luar <li> apa pun (baik sebagai <ul> tingkat atas atau sebagai entri <li> yang diratakan di <ol> utama), sehingga tidak ada penyarangan HTML yang terjadi di dalam item daftar.
    - Cek Cepat (jika ada):
    - Gunakan tajuk ✔Cek Cepat global diikuti oleh tugas dan pola ✅ Respons Siswa yang Diharapkan.

PRAKTIK TERBIMBING (GUIDED PRACTICE)
    - Render Praktik Terbimbing (jika ada) sebagai:

    - <h3><span style="color: rgb(115, 191, 39);">Praktik Terbimbing</span></h3>
    - Materi (jika ada):
    - <p><strong>📚 Materi</strong></p>
    - <ul> dengan item <li> dari GuidedPractice.Materials.</ul>

    - Instruksi untuk Guru:
    - <p><strong>📋 Instruksi untuk Guru</strong></p>
    - Render skrip yang menghadap guru sebagai urutan blok <p>.
    - Setiap langkah bernomor dari JSON (1., 2., 3...) harus memulai <p>-nya sendiri.
    - Jika sebuah langkah menyertakan sub-prompt (seperti prompt sirkulasi Langkah 6):
        - Render setiap prompt sebagai blok <p>-nya sendiri (misalnya, "Prompt 1: '...'").
        - Render "✅ Respons Siswa yang Diharapkan" sebagai blok <p>-nya sendiri.
        - Render contoh jawaban yang menyertainya sebagai daftar poin <ul> dengan setiap respons di <li>-nya sendiri.
    - Untuk Cek Cepat di akhir:
        - Render <p><strong>Cek Cepat</strong> "{TaskText}"</p>
        - Render <p>✅ Respons Siswa yang Diharapkan</p>
        - Render respons sebagai daftar <ul><li>.
    - Aturan presentasi tambahan (berlaku untuk opsi di atas):
      - Untuk Kerja Kelompok/Mitra, Peran, Rotasi, dan baris Pengaturan: render setiap kalimat yang jelas sebagai <p>-nya sendiri, mempertahankan nama peran dan waktu persis seperti yang disediakan.
      - JANGAN membuat atau merangkum konten; hanya restrukturisasi apa yang ada di JSON.
      - Pertahankan pola contoh secara tepat saat me-render model/respons yang diharapkan dan cek cepat.

    -  Diferensiasi (jika ada):
    -  <p><strong>🪜 Diferensiasi</strong></p>
    -  Gunakan blok <p> untuk teks penjelasan.
    -  Untuk subbagian berlabel seperti “Pelajar Bahasa”, “Perancah Tambahan”, “Lebih Dalam” (atau serupa):
        - Gunakan <p><strong>Label</strong></p> untuk setiap label.
        - Di bawah setiap label gunakan <ul><li>…</li></ul> tingkat atas dengan item <li> teks biasa (jangan menyarangkan daftar di dalam item daftar).

    -  Akomodasi & Modifikasi (jika ada):
    -  <p><strong>🤝 Akomodasi &amp; Modifikasi</strong></p>
    -  Mulailah dengan baris untuk dukungan umum sebagai paragrafnya sendiri, misalnya <p><strong>Dukungan umum:</strong></p>
    -  Kemudian render setiap item dukungan umum sebagai item daftar di dalam <ul> tingkat atas. Setiap <li> harus berupa teks biasa.
    -  Setelah dukungan umum, render dukungan individual:
        - Gunakan label paragraf: <p><strong>Dukungan individual:</strong></p>
        - Untuk setiap siswa dalam array IndividualSupport:
            - Render nama siswa sebagai <p> dengan teks merah: <p><span style="color: rgb(204, 0, 0);">Nama Siswa</span></p>.
            - Kemudian render <ul> yang berisi tepat dua elemen <li>:
                - <li>{PlanProvided}</li>
                - <li>{PlanImplementation}</li>
            - Ulangi pola ini untuk setiap siswa.
    -  Gunakan HANYA nama dan rencana siswa yang disediakan dalam JSON (daftar IndividualSupport); jangan membuat atau menambah siswa tambahan.

    Catatan (ringkasan aturan kompatibilitas):
    - Jangan pernah menempatkan tag HTML di dalam elemen <li> yang digunakan untuk daftar bernomor instruksional utama; <li> tersebut harus berupa teks biasa saja.
    - Wakili struktur bersarang apa pun dengan meratakan menjadi entri <li> tingkat atas tambahan dengan awalan yang jelas (seperti dalam Nilai Pengetahuan Sebelumnya).
    - Gunakan label paragraf (<p><strong>…</strong></p>) dan daftar tingkat atas (<ul>, <ol>) di luar elemen <li> teks biasa tersebut untuk tajuk, materi, diferensiasi, dan akomodasi.

PRAKTIK MANDIRI (INDEPENDENT PRACTICE)
    - Render Praktik Mandiri (jika ada) sebagai:

    <h3><span style="color: rgb(115, 191, 39);">Praktik Mandiri</span></h3>
    - Materi (jika ada):
    - <p><strong>📚 Materi</strong></p>
    - <ul> dengan item <li> dari IndependentPractice.Materials.</ul>
    - <p><strong>Tujuan:</strong></p>
    - Gunakan <p> untuk teks tujuan.

    - Instruksi untuk Guru:
    - Render setiap tugas guru sebagai satu tajuk paragraf dalam pola tepat ini:
      <p><strong>Tugas N (DOK X):</strong> Catatan Guru: [teks catatan guru]. Say: "…"</p>
      - Ganti N dengan nomor tugas dalam urutan menaik dan X dengan tingkat DOK yang disediakan.
      - Sertakan label skrip guru (Say:, Do:, Ask:, Write:, Draw/Show:, Listen for:) secara kata demi kata di dalam paragraf.
      - Jika teks paragraf tugas kosong, hapus tugas tersebut seluruhnya.
    - Jika Respons Siswa yang Diharapkan ada untuk sebuah tugas, render segera setelah paragraf tugas tersebut:
      <p>✅ Respons Siswa yang Diharapkan</p>
      <ul><li>Respons 1</li><li>Respons 2</li></ul>
      - Gunakan <ul> atau <ol> berdasarkan apakah respons diurutkan dengan jelas. Setiap respons adalah satu <li>. Jangan menyarangkan daftar di dalam <li>.
    - Jika Kriteria Keberhasilan ada untuk sebuah tugas, render:
      <p>Kriteria Keberhasilan</p>
      <ul><li>Kriteria 1</li><li>Kriteria 2</li></ul>
      - Hapus blok ini jika array kriteria kosong.
    - Jika prompt Refleksi ada untuk blok tugas, render:
      <p><strong>Refleksi:</strong></p>
      - Kemudian render setiap kalimat atau prompt refleksi sebagai <p>-nya sendiri. Gunakan <p> terpisah untuk regulasi diri dan prompt transenden jika disediakan.
    - Render tugas dalam urutan tugas menaik. Hapus subbagian apa pun yang string atau array sumbernya kosong.
    - Gunakan hanya tag yang diizinkan dan pastikan HTML tetap menjorok dengan baik dan mudah dibaca.
    - JANGAN ratakan blok paragraf tugas + daftar ini ke dalam aturan <ol> rata Nilai Pengetahuan Sebelumnya / Presentasi Langsung; blok ini adalah format alternatif untuk tugas guru dan harus mengikuti struktur contoh secara tepat.

TINJAUAN & PENGAMBILAN BERJARAK (REVIEW & SPACED RETRIEVAL) (5 mnt)
    - <h3><span style="color: rgb(115, 191, 39);">Tinjauan & Pengambilan Berjarak (5 mnt)</span></h3>
    - Render konten dari string ReviewAndSpacedRetrieval mengikuti aturan pemetaan ini:
        - Tajuk 📚 Materi: Ikuti dengan daftar item.
        - Label Catatan Guru: Render sebagai <p><strong>Catatan Guru:</strong> [teks catatan]</p>.
        - Tajuk 📋 Instruksi untuk Guru: Render sebagai <p><strong>📋 Instruksi untuk Guru</strong></p>.
        - Sub-tajuk Pemanggilan Aktif (Active Recall): Render sebagai <p><strong>Pemanggilan Aktif</strong></p>. Ikuti dengan item bernomor dan skrip Say:.
        - Gunakan pola ✅ Respons Siswa yang Diharapkan global untuk semua jawaban sampel.
        - Sub-tajuk Perbaiki Miskonsepsi Umum: Tebal. Render sebagai <ul> dengan setiap "Jika siswa mengatakan... tanggapi:..." sebagai <li>.
        - Sub-tajuk 💭Koneksi Pertanyaan Esensial: Tebal.
        - Sub-tajuk 🌍Pemikiran Transenden: Tebal.
        - Sub-tajuk ⌛Pengambilan Berjarak: Tebal.
        - Pastikan setiap bagian sub-tajuk mengikuti struktur dalam gambar (Tindakan bernomor, skrip Say:, poin-poin).

PENILAIAN FORMATIF (Di-render sebagai bagian dari bab Tinjauan)
    - <h3><span style="color: rgb(115, 191, 39);">✅Penilaian Formatif</span></h3>
    - Render paragraf pengantar (jika ada).
    - Untuk setiap Prompt N (DOK X):
        - <p><strong>Prompt N (DOK X):</strong> {QuestionText}</p>
        - Render "✅ Respons Siswa yang Diharapkan" sebagai blok <p>-nya sendiri. Gunakan simbol ✅ global.
        - Render respons yang menyertainya sebagai daftar poin <ul> dengan setiap respons di <li>-nya sendiri.

Aturan keras (aman bagi UI, tidak ada penyarangan):
    - Prompt:
       - Untuk SETIAP prompt dalam urutan menaik, tambahkan SATU <li> teks biasa yang HANYA berisi:
    Prompt X (DOK Y) — "Teks pertanyaan"
    - JANGAN masukkan tag HTML apa pun ke dalam <li> ini.
    - JANGAN masukkan <p> ke dalam <li>.
    - Respons yang diharapkan (interleaved, tidak ada sub-daftar):
    -  Segera SETELAH <li> prompt, jika prompt yang SAMA tersebut memiliki respons yang diharapkan/model/siswa, render setiap respons sebagai <li> teks biasa-nya sendiri (masih di dalam <ul> tingkat atas yang SAMA), masing-masing dimulai tepat dengan:
    ✅ Respons Siswa yang Diharapkan — Teks respons
        - Satu respons per <li>.
        - JANGAN buat <ul> atau <ol> bersarang di mana pun dalam Penilaian Formatif.
        - TUTUP </ul> setelah semua item <li> prompt dan item <li> respons yang diharapkan yang disisipkan.

Refleksi:
    -  Setelah </ul> ditutup, render refleksi sebagai paragraf saja:
    -  <p><strong>Refleksi:</strong></p>
    -  <p>Prompt regulasi diri: ...</p>
    -  <p>Prompt transenden: ...</p>

PRAKTIK SISWA (STUDENT PRACTICE)
    - <h3><span style="color: rgb(115, 191, 39);">🖊 Praktik Siswa</span></h3>
    - <p><strong>Catatan Guru:</strong> {StudentPractice.StudentPractice_TeacherNotes}</p>

    - Untuk setiap tugas dalam StudentPractice.StudentPractice_Tasks (Bernomor 1, 2, 3...):
        - <p><strong>{Number}. ({DOK})</strong> {StudentDirections}</p>
        - <p><strong>Kriteria Keberhasilan</strong></p>
        - <ul> dengan setiap item SuccessCriteria sebagai <li>.
    - Jika StudentPractice.StudentPractice_InterleavingIfMath tidak kosong:
        - <p><strong>Interleaving (Hanya matematika)</strong></p>
        - Render konten interleaving sebagai satu atau lebih blok <p>.


INSTRUKSI FINAL
    - Output HANYA HTML menggunakan tag yang diizinkan yang tercantum dalam ATURAN GLOBAL.
    - JANGAN gunakan tag HTML lainnya.
    - Pastikan struktur dan urutan mencerminkan skema JSON dan pola yang dijelaskan di atas.
    - JANGAN sertakan judul pelajaran (jangan gunakan <h2>); mulai output Anda secara langsung dengan bagian <h3>💭 Pertanyaan Esensial</h3> dan lanjutkan dari sana.
`,
  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `
Anda akan menerima SATU objek JSON yang secara ketat mengikuti skema UnitPlanResponse (sudah divalidasi di pihak saya). Tugas Anda adalah mengubah JSON ini menjadi HTML yang bersih dan mudah dibaca yang dapat digunakan guru secara langsung di kelas.
                   
FORMAT INPUT
Saya akan mengirimkan objek JSON kepada Anda seperti ini:

UNIT PLAN JSON:
{{{JsonResponse}}}

Anggap semua yang ada setelah baris "UNIT PLAN JSON:" sebagai objek JSON yang tepat. JANGAN menjelaskan atau mengomentarinya; cukup uraikan dan render.

ATURAN GLOBAL
    -  Output HANYA HTML valid (tidak ada markdown, tidak ada backticks, tidak ada penjelasan prosa).
    -  Tag yang diizinkan: <p>, <h1>, <h2>, <h3>, 
    -  (dibungkus di dalam <p>), <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    -  Tag lain TIDAK BOLEH digunakan (tidak ada <main>, <section>, <header>, <div>, <h4>, dll.).
    -  HTML harus menjorok dengan baik dan mudah dibaca.
    -  Dalam <ol> atau <ul> apa pun, HANYA gunakan elemen <li> sebagai anak langsung. Jangan pernah menempatkan <p>, <span>, <ul>, <ol>, atau tag lainnya sebagai anak dari sebuah daftar.
    -  JANGAN membuat konten instruksional baru; gunakan hanya apa yang ada di bidang JSON.
    -  Pertahankan urutan logis yang tersirat oleh skema:
        1. Info tingkat unit (judul, deskripsi, pertanyaan esensial, tujuan, standar)
        2. Kemudian Pelajaran dalam LessonNumber menaik
        3. Di dalam setiap pelajaran, ikuti urutan bidang skema.
    -  Jika bidang string kosong (""), HAPUS subbagian tersebut dan labelnya.
    -  Jika array kosong, hapus tajuknya dan <ul> atau <ol> yang sesuai.
    -  Kapan pun teks tersebut jelas membentuk daftar prompt/pertanyaan/pernyataan/respons, gunakan <ul><li>…</li></ul> atau <ol><li>…</li></ol>. Jika tidak, gunakan <p>.
    -  Kapan pun Anda me-render model/respons siswa yang diharapkan di bagian APA PUN (kapan pun skema atau teks secara jelas menunjukkan “Expected Student Responses”, “Model responses”, “Sample answers”, atau serupa), gunakan pola ini:
    -  Pertama: <p>✅ Respons Siswa yang Diharapkan</p>
    -  Kemudian daftar respons:
    -  <ul><li>…</li></ul> untuk respons yang tidak berurutan.
    -  <ol><li>…</li></ol> ketika teks tersebut jelas bernomor atau berurutan (misalnya, 1., 2., 3.).


- Di bagian atas halaman:
    -  <h1> dengan UnitTitle.
    -  Satu <p> untuk UnitDescription.

- Pertanyaan Esensial (jika ada):
    -  <h2>💭 Pertanyaan Esensial</h2>
    -  <ul> dengan setiap item dari EssentialQuestions sebagai <li>.

- Tujuan Pembelajaran Siswa (jika ada):
    -  <h2>🎯 Tujuan Pembelajaran Siswa</h2>
    -  <ul> dengan setiap item dari StudentLearningObjectives sebagai <li>.

- Standar (jika ada):
    -  <h2>📏 Standar yang Disejajarkan</h2>
    -  <ul> dengan setiap string dari StandardsAligned sebagai <li>.
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
            "description": "Deskripsi unit sebagai satu paragraf teks biasa yang kohesif (4–5 kalimat lengkap) yang ditulis dalam suara guru alami yang dapat Anda sampaikan langsung kepada siswa. Tanpa HTML, tanpa emoji, tanpa poin-poin. Harus mengalir secara percakapan tetapi mengikuti struktur ini (tanpa tajuk): (1) kalimat penarik (hook) yang memicu rasa ingin tahu atau membuat kontras yang mengejutkan, (2) kalimat 'Dalam unit ini, Anda akan...' tentang hasil penguasaan, (3) kalimat 'Anda akan memperkuat keterampilan Anda dalam...' tentang kemampuan berpikir/analisis, (4) kalimat 'Ini terhubung dengan...' tentang relevansi dunia nyata, (5) kalimat 'Memahami hal ini penting karena...' tentang signifikansi yang lebih luas atau dampak jangka panjang."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Buat pertanyaan esensial yang hanya fokus pada konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. JANGAN menyebutkan istilah, proses, kosakata, atau contoh khusus subjek. Pertanyaan harus bersifat terbuka, dapat dialihkan ke semua disiplin ilmu, dan tidak mungkin dijawab hanya dengan mempelajari konten pelajaran atau unit. Fokus hanya pada ide-ide besar, bukan materi pelajaran.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Bagian lengkap 'Tujuan Pembelajaran Siswa' untuk seluruh unit ini. Setiap item daftar harus merupakan tujuan terukur yang jelas yang dimulai dengan kata kerja terukur dan diakhiri dengan label DOK dalam tanda kurung.",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "array",
            "description": "Daftar semua standar pendidikan unik yang digunakan di mana saja dalam unit ini dan pelajarannya. JANGAN tambahkan standar yang tidak muncul dalam konten unit. Setiap standar harus mencakup kode standar dan deskripsi, misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem Bumi–Matahari–Bulan untuk mendeskripsikan pola siklus fase bulan, gerhana, dan musim.'",
            "items": {
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
    "title": "LessonPlanResponse",
    "type": "object",
    "properties": {
      "LessonDescription": {
        "type": "object",
        "properties": {
          "EssentialQuestions": {
            "type": "array",
            "description": "Cukup tempelkan semua pertanyaan esensial tingkat unit dalam urutan yang sama jika disediakan. Jika tidak disediakan, hasilkan tepat 3 pertanyaan konseptual yang hanya fokus pada konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. JANGAN menyebutkan istilah, proses, kosakata, atau contoh khusus subjek. Pertanyaan harus bersifat terbuka, dapat dialihkan ke semua disiplin ilmu, dan tidak mungkin dijawab hanya dengan mempelajari konten pelajaran atau unit. Fokus hanya pada ide-ide besar, bukan materi pelajaran.",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Bagian lengkap 'Kosakata Kunci' sebagai daftar string. Setiap string harus berupa istilah tunggal dengan definisi yang dipisahkan oleh tanda hubung/dash. Contoh: 'Gravitasi - Gaya yang menarik benda satu sama lain'. Semua definisi harus pendek, sesuai usia, dan berhubungan langsung dengan konten pelajaran.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Bagian lengkap 'Tujuan Pembelajaran Siswa' sebagai teks biasa. Setiap item harus merupakan tujuan terukur yang jelas yang dimulai dengan kata kerja terukur dan diakhiri dengan label DOK dalam tanda kurung, misalnya 'Modelkan bagaimana rotasi Bumi pada porosnya menyebabkan siang dan malam (DOK 2).'",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "string",
            "description": "Bagian lengkap 'Standar yang Disejajarkan' sebagai teks biasa untuk pelajaran ini. Setiap standar harus mencakup kode standar dan deskripsi, serta kode dan deskripsi tersebut harus persis sama dengan yang digunakan dalam Unit. Misalnya 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem Bumi–Matahari–Bulan untuk mendeskripsikan pola siklus fase bulan, gerhana, dan musim.'"
          },
          "AssessPriorKnowledge": {
            "type": "string",
            "description": "Bagian lengkap 'Nilai Pengetahuan Sebelumnya' sebagai teks biasa (total 150-250 kata). HANYA Pelajaran 1 yang boleh berisi blok mendetail; SEMUA PELAJARAN LAIN HARUS MENGEMBALIKAN STRING KOSONG untuk bidang ini. Untuk Pelajaran 1, struktur harus mencakup: 1. Sertakan bagian ini hanya pada pelajaran pertama unit, ditempatkan segera setelah Tujuan Pembelajaran Siswa. 2. Pastikan prompt DOK 1-3 digunakan. 3. Sertakan keterampilan prasyarat yang diperlukan untuk tujuan pembelajaran siswa. 4. Pilih satu modalitas dari daftar ini dan kembangkan sepenuhnya: menanya, K-W-L, visual, peta konsep, tulisan reflektif, panduan antisipasi, peringkat kosakata. 5. Prompt guru awal dengan pernyataan 'Say:' yang memperkenalkan modalitas yang dipilih dan menjelaskan bagaimana siswa akan memunculkan pemahaman saat ini. 6. Instruksi yang jelas dan templat/struktur untuk modalitas yang dipilih. 7. Bagian 'Expected Student Responses' yang menunjukkan jawaban yang diantisipasi atau miskonsepsi umum untuk modalitas yang dipilih. 8. Prompt penutup guru 'Say:' yang memvalidasi pemikiran siswa dan memberikan pratinjau investigasi unit. 9. Setelah mengembangkan satu modalitas sepenuhnya, berikan 2 opsi alternatif singkat yang dapat dipilih guru."
          },
          "DirectPresentation": {
            "type": "object",
            "description": "Bagian lengkap 'Presentasi Langsung' sebagai teks biasa. Ini adalah aktivitas di dalam kelas yang PERTAMA dan harus berlangsung TIDAK LEBIH DARI 10 menit.",
            "properties": {
              "Materials": {
                "type": "array",
                "description": "Daftar materi yang diperlukan (misalnya alat peraga visual, spidol, dll.)",
                "items": {
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "type": "string",
                "description": "Instruksi guru langkah demi langkah mengikuti urutan TEPAT ini: (1) HOOK (1-2 mnt), (2) INTRODUCTION (1-2 mnt), (3) DIRECT TEACHING (4-5 mnt), dan (4) GUIDED ENGAGEMENT (2-3 mnt). PENTING: JANGAN sertakan tajuk '1. HOOK (1-2 mnt)', '2. INTRODUCTION (1-2 mnt)', '3. DIRECT TEACHING (4-5 mnt)', atau '4. GUIDED ENGAGEMENT (2-3 mnt)' dalam string akhir. Sebaliknya, berikan konten dari setiap bagian secara langsung dimulai dengan prompt guru pertama (Say:, Do:, dll.). Setiap komponen harus mencakup pembicaraan guru (Say:/Ask:), tindakan guru (Do:/Write:/Draw/Show:), dan respons siswa (✅ Expected Student Responses: - dengan poin-poin). Semua konten harus akurat secara ilmiah dan sesuai usia."
              },
              "AnticipatedMisconceptions": {
                "type": "string",
                "description": "Miskonsepsi umum dan bahasa koreksi yang tepat untuk menangani masing-masing miskonsepsi"
              },
              "TranscendentThinking": {
                "type": "string",
                "description": "Pertanyaan aplikasi dunia nyata yang menghubungkan pembelajaran dengan tujuan/makna/ide-ide besar, dengan respons siswa yang diharapkan menunjukkan pemahaman yang lebih dalam"
              },
              "QuickCheck": {
                "type": "string",
                "description": "Pemeriksaan akhir pemahaman untuk tujuan pembelajaran siswa yang sudah dinyatakan dalam pelajaran. Ini HARUS merupakan tugas individu untuk diselesaikan oleh SETIAP siswa (bukan sekadar pertanyaan lisan kepada kelas), misalnya, 'Luangkan waktu 2 menit untuk membuat sketsa X di buku catatan Anda' atau 'Di selembar kertas coretan, jelaskan mengapa Y...'. Sertakan 2-3 respons siswa yang diharapkan secara spesifik."
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
          "GuidedPractice": {
            "type": "object",
            "description": "Bagian Praktik Terbimbing yang terstruktur dengan bidang terpisah untuk materi, instruksi, diferensiasi, dan akomodasi opsional.",
            "properties": {
              "Materials": {
                "type": "array",
                "description": "Barang fisik yang diperlukan untuk aktivitas praktik terbimbing ini (misalnya, 'Bola Styrofoam, benang, spidol') yang diformat sebagai daftar",
                "items": {
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "type": "string",
                "description": "400–600 kata. Format sebagai daftar bernomor tindakan guru yang ketat (1, 2, 3...). Setiap langkah harus menggabungkan tindakan guru (Show:, On the board, write:, Demonstrate:) dan skrip guru (Say:). Langkah 6 HARUS 'As students work, circulate and use these prompts:' diikuti oleh 2-4 prompt sirkulasi, masing-masing dengan label 'Expected Student Responses' sendiri dan sampel jawaban dalam bentuk poin-poin. Akhiri bagian ini dengan tajuk tebal 'Quick Check', tugas individu, dan sampel respons."
              },
              "Differentiation": {
                "type": "string",
                "description": "Strategi diferensiasi tiga bagian termasuk: (1) Dukungan Pelajar Bahasa (2-3 strategi), (2) Dukungan Perancah Tambahan (2-3 strategi), (3) Ekstensi Go Deeper (1-2 aktivitas dengan respons yang diharapkan)"
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "description": "Akomodasi umum untuk kelas ditambah rencana dukungan siswa individu. Model tersebut HARUS hanya menggunakan nama dan rencana siswa yang disediakan dalam prompt.",
                "properties": {
                  "General": {
                    "type": "string",
                    "description": "Dukungan dan modifikasi kelas umum yang berlaku untuk sebagian besar atau semua siswa selama aktivitas ini."
                  },
                  "IndividualSupport": {
                    "type": "array",
                    "description": "Siswa yang disediakan secara tepat. PlanProvided harus cocok dengan prompt secara tepat. Tambahkan implementasi konkret di PlanImplementation.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "StudentName": {
                          "type": "string"
                        },
                        "PlanProvided": {
                          "type": "string",
                          "description": "HARUS cocok dengan teks rencana dari prompt secara tepat."
                        },
                        "PlanImplementation": {
                          "type": "string",
                          "description": "Alat/pancingan/visual/organizer konkret untuk tugas ini (misalnya, kerangka kalimat yang tepat, tata letak organizer, label)."
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
          "IndependentPractice": {
            "type": "string",
            "description": "Bagian lengkap 'Praktik Mandiri' sebagai teks biasa. Struktur harus mengikuti format ini: Mulailah dengan tajuk 'Materials' dan daftar poin sederhana untuk item yang dibutuhkan. Paragraf 'Purpose' yang menjelaskan bagaimana praktik memperkuat pemahaman dan transfer. 3-4 tugas bernomor secara berurutan yang diberi label 'Task 1 (level DOK):', 'Task 2 (level DOK):', dll. Untuk setiap tugas: - 'Teacher Notes:' singkat yang menjelaskan koneksi ke pelajaran/tujuan. - Pernyataan 'Say:' yang diperlukan dengan prompt guru yang tepat. - 'Expected Student Responses' dengan sampel jawaban. - 'Success Criteria' yang mencantumkan 2-4 elemen yang menunjukkan penguasaan. Bagian 'Reflection' dengan: - 2 prompt regulasi diri tentang mengelola pembelajaran. - 2 pertanyaan transenden tentang dampak/masa depan yang lebih luas. Tugas ekstensi 'Early Finishers' yang: - Menggunakan konsep inti yang sama pada kedalaman yang lebih tinggi. - Mencantumkan elemen spesifik yang harus ditangani siswa. - Memerlukan penerapan prinsip konten yang akurat. Lihat contoh tata surya untuk model format terperinci."
          },
          "ReviewAndSpacedRetrieval": {
            "type": "string",
            "description": "Bagian lengkap 'Tinjauan & Pengambilan Berjarak' sebagai teks biasa. Aktivitas 5 menit ini harus mencakup dalam urutan TEPAT ini: 1. Daftar Materi (sering kali tidak dibutuhkan) 2. Paragraf Catatan Guru yang menjelaskan: - Bagaimana strategi tinjauan ini meningkatkan retensi - Koneksi ke konsep pembelajaran sebelumnya - Bagaimana refleksi transenden memperdalam pemahaman 3. Instruksi untuk Guru yang berisi: - Prompt Pemanggilan Aktif (Active Recall) menggunakan berbagi mitra/kelompok - Respons Siswa yang Diharapkan (2-3 contoh dalam poin-poin) 4. Blok Perbaiki Miskonsepsi Umum dengan: - Contoh pernyataan miskonsepsi - Skrip tanggapan guru yang menangani masing-masing 5. Koneksi Pertanyaan Esensial termasuk: - Prompt guru yang menghubungkan ke pertanyaan unit - Respons Siswa yang Diharapkan (2-3 contoh) 6. Bagian Pemikiran Transenden dengan: - Prompt aplikasi dunia nyata - Instruksi waktu berpikir - Respons Siswa yang Diharapkan (2-3 contoh) 7. Komponen Pengambilan Berjarak yang berisi: - Referensi jelas ke pelajaran sebelumnya yang spesifik - Pertanyaan yang menghubungkan konsep masa lalu + saat ini - Kriteria keberhasilan / respons yang diharapkan terperinci Semua bagian harus menggunakan pernyataan 'Say:' untuk prompt guru dan 'Expected Student Responses' yang diberi label dengan jelas yang menunjukkan 2-3 sampel jawaban. Kembalikan sebagai teks biasa."
          },
          "FormativeAssessment": {
            "type": "string",
            "description": "Bagian lengkap 'Penilaian Formatif' sebagai teks biasa. Ini HARUS berisi tepat 4 prompt pertanyaan yang diberi label 'Prompt 1 (DOK 1):', 'Prompt 2 (DOK 2):', 'Prompt 3 (DOK 3):', dan 'Prompt 4 (DOK 4):'. Untuk setiap prompt: - Pertanyaan yang menguji pemahaman pada level DOK yang dinyatakan - Tajuk '✅ Expected Student Responses' - 1-2 sampel respons yang menunjukkan penguasaan. JANGAN sertakan bagian 'Reflection'. Contoh format: Prompt 1 (DOK 1): 'Mengapa planet tetap berada di orbit?' ✅ Expected Student Responses - 'Gravitasi dan gerakan maju.' [Lanjutkan untuk Prompt 2-4]"
          },
          "StudentPractice": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "StudentPractice_TeacherNotes",
              "StudentPractice_Tasks",
              "StudentPractice_InterleavingIfMath"
            ],
            "properties": {
              "StudentPractice_TeacherNotes": {
                "type": "string",
                "description": "Satu paragraf yang menjelaskan pengetahuan dan keterampilan yang dipraktikkan di semua tugas dalam pelajaran ini. Paragraf tersebut HARUS dimulai dengan 'Tugas-tugas ini memperkuat pembelajaran hari ini tentang ____ dengan ______.' di mana bagian yang kosong diisi dengan konten pelajaran yang relevan, diikuti dengan penjelasan tentang bagaimana tugas-tugas ini memperkuat retensi jangka panjang."
              },
              "StudentPractice_Tasks": {
                "type": "array",
                "minItems": 2,
                "maxItems": 3,
                "description": "Tugas harus selaras dengan fokus pelajaran dan kedalaman pengetahuan yang diharapkan. Gunakan hanya DOK 2, 3, atau 4.",
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
                      "description": "Level Kedalaman Pengetahuan (Depth of Knowledge) untuk tugas tersebut. HARUS berupa SALAH SATU DARI: 'DOK 2', 'DOK 3', atau 'DOK 4'. DOK 1 sangat dilarang."
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
              "StudentPractice_InterleavingIfMath": {
                "type": "string",
                "description": "Jika dan HANYA JIKA subjeknya adalah matematika: sertakan masalah interleaving + prompt guru + respons yang diharapkan + catatan guru. Jika tidak, string kosong."
              }
            }
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
  }
};
