window.promptsID = {
  STEP0_PROMPT_TEMPLATE: `
Buat garis besar unit dan struktur pelajaran menggunakan informasi di bawah ini. JANGAN menulis rencana pelajaran lengkap.
                    
Berdasarkan subjek unit (Unit Subject), standar pendidikan, deskripsi/instruksi unit (Unit Description/Instruction), tingkat kelas (Grade Level), durasi periode kelas dalam menit (Duration of class period), dan jumlah pelajaran yang diminta (Number of Lessons), hasilkan respons JSON yang mencakup deskripsi unit yang kohesif (UnitDescription) dan daftar "wadah" pelajaran (Lessons) yang tidak tumpang tindih.

Subjek Unit (Unit Subject):
{{$Subject}}

Nama Unit (Unit Name):
{{$Name}}

Deskripsi/Instruksi Unit (Unit Description/Instruction):
{{$UserPrompt}}

Tingkat Kelas (Grade Level):
{{$GradeLevel}}

Durasi periode kelas dalam menit:
{{$ClassDuration}}
  
Standar untuk penyelarasan:
{{$Standards}}
    
Siswa dengan dukungan individual:
{{$LearningPlans}}

Sumber daya/Media untuk digunakan:
{{$MediaContext}}
  
Isi Unit:
{{$AttachedUnit}}

Persyaratan Pertanyaan Esensial (Essential Questions):
- Setiap pertanyaan HARUS berupa kalimat yang lengkap, benar secara tata bahasa, dan diakhiri dengan tanda tanya.
- Setiap pertanyaan HARUS dimulai dengan "Bagaimana" atau "Mengapa".
- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisi.
- Pertanyaan HARUS berfokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten spesifik subjek.
- Pertanyaan HARUS dapat diterapkan di berbagai disiplin ilmu dan di luar unit ini.
- Pertanyaan HARUS diulang secara verbatim di setiap pelajaran dalam unit tersebut.

Apa yang harus dihasilkan:
- Output HARUS berupa JSON valid yang sesuai dengan skema.
- WAJIB: Isi lengkap semua properti dalam objek "UnitDescription":
  - "Description": Tulis satu paragraf berisi 4-5 kalimat yang menjelaskan inti fokus unit dan perjalanan naratifnya.
  - "StudentLearningObjectives": Cantumkan 3-5 tujuan pembelajaran terukur yang utama untuk unit ini.
  - "StandardsAligned": Cantumkan semua standar yang dibahas selama unit ini.
  - "EssentialQuestions": Tepat 3 pertanyaan konseptual mengikuti aturan di atas.
- HASILKAN daftar "Lessons" yang berisi tepat {{$NumberOfItems}} pelajaran.
  - Setiap pelajaran harus mencakup "lessonNumber" (indeks mulai dari 1), "lessonTitle", dan "lessonOutline" (2–4 kalimat yang menjelaskan ruang lingkup pelajaran).

Batasan:
- Jaga agar unit dan setiap pelajaran selaras dengan fokus unit.
- Pastikan urutan logis dari ide-ide dasar ke pemodelan yang lebih kompleks.
- Akurasi: Semua konten harus akurat secara ilmiah dan sesuai usia.

Output HARUS berupa JSON valid yang sesuai dengan skema. Gunakan format yang ringkas (tanpa baris kosong tambahan).
`,
  PER_LESSON_PROMPT_TEMPLATE: `
Buat SATU rencana pelajaran gaya kolaboratif (BUKAN rencana unit, BUKAN beberapa pelajaran) menggunakan informasi di bawah ini.

Anda HARUS mengeluarkan JSON valid yang persis sesuai dengan skema JSON yang disediakan (LessonPlanResponse dengan satu objek "LessonPlan"). Jangan sertakan kunci tambahan apa pun. Gunakan format JSON yang ringkas (tanpa baris kosong tambahan).

KONTEKS UNIT (hanya baca untuk koherensi):
Subjek Unit:
{{$Subject}}

Isi Unit: 
{{$ParentUnitData}}

Deskripsi/Instruksi Unit: Buat unit menggunakan standar berikut:
{{$Standards}}

Tingkat Kelas (Grade Level):
{{$GradeLevel}}

Sumber daya/Media untuk digunakan: 
{{$MediaContext}}

Durasi kelas dalam menit:
{{$ClassDuration}}

Judul Pelajaran:
{{$Name}}

Deskripsi/Instruksi Unit: 
{{$UserPrompt}}

Pertanyaan Esensial Unit (GUNAKAN SECARA VERBATIM):
{{$UnitEssentialQuestions}}

Jika Pertanyaan Esensial Unit di atas kosong, hasilkan tepat 3 pertanyaan konseptual mengikuti aturan ini:
- Setiap pertanyaan HARUS berupa kalimat yang lengkap, benar secara tata bahasa, dan diakhiri dengan tanda tanya.
- Setiap pertanyaan HARUS dimulai dengan "Bagaimana" atau "Mengapa".
- Pertanyaan HARUS bersifat konseptual dan eksploratif, bukan faktual, prosedural, atau definisi.
- Pertanyaan HARUS berfokus pada ide-ide luas dan universal (seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran), bukan pada konten spesifik subjek.
- Pertanyaan HARUS dapat diterapkan di berbagai disiplin ilmu dan di luar unit ini.

SISWA DENGAN DUKUNGAN INDIVIDUAL (HARUS digunakan HANYA di dalam CollaborativeActivities.AccommodationsAndModifications; gunakan nama siswa/rencana persis seperti yang tertulis):
{{$LearningPlans}}

ATURAN KONTEN PENTING (Gaya Kolaboratif):
- Jaga agar pelajaran selaras dengan fokus unit dan kerangka/batasan pelajaran di atas; hindari memperkenalkan konsep utama baru yang termasuk dalam pelajaran lain.
- Relevansi Budaya dan Inklusi: sertakan berbagai perspektif; hubungkan dengan beragam komunitas; hindari stereotip; tunjukkan dampak pada semua yang terlibat.
- Transfer: tanamkan aplikasi dunia nyata dan penalaran di seluruh pelajaran.
- Interleaving: saat siswa berlatih/menerapkan, campurkan strategi atau konsep (bukan latihan blok). Jika pelajaran berisi penalaran matematika apa pun, sertakan setidaknya satu item interleaving level DOK 3–4 yang mencampurkan konten saat ini dengan konsep pelajaran sebelumnya dan mengharuskan siswa untuk membenarkan pilihan strategi.

ATURAN KHUSUS FIELD:
- EssentialQuestions: HARUS benar-benar identik dengan pertanyaan esensial tingkat unit (teks yang sama, urutan yang sama).
- AssessPriorKnowledge: Jika bagian ini wajib (misalnya, untuk Pelajaran 1 atau saat memperkenalkan konsep utama baru), tulis 150–250 kata mengikuti struktur wajib dalam deskripsi skema. Jika tidak, kembalikan "" (string kosong).
- Instruction:
  - Ini adalah struktur yang sama dengan Direct Presentation tetapi dinamai ulang.
  - Struktur harus mengalir secara alami dengan petunjuk: Katakan (Say)/Lakukan (Do)/Tanya (Ask)/Dengarkan untuk (Listen for)/Tulis (Write).
  - PENTING: JANGAN sertakan subjudul dengan huruf kapital semua (seperti HOOK, INTRODUCTION, dll.) untuk bagian-bagian tersebut.
  - PENTING: JANGAN sertakan durasi waktu untuk petunjuk atau langkah individu.
  - TranscendentThinking: Berikan satu pertanyaan aplikasi dunia nyata yang menghubungkan pembelajaran dengan tujuan/makna, diikuti dengan label 'Ekspektasi Jawaban Siswa:' dan 2–3 contoh.
- GroupStructureAndRoles (3–4 menit):
  - Output HARUS ditujukan kepada guru dan HARUS mengikuti struktur dan label yang tepat ini (urutan yang sama, emoji/karakter yang sama):
  
  FORMAT WAJIB (judul/label yang tepat):
  Ukuran Grup: [salah satu dari: berpasangan / triad / 4–5 siswa]
  
  📋 Instruksi untuk Guru
  Katakan: "[1–2 kalimat: jelaskan bahwa peran itu penting dan Anda akan memodelkan seperti apa rupa setiap peran]"
  
  Peran:
  Fasilitator: [menjaga grup tetap pada tugas; mendorong partisipasi; memastikan setiap orang berbicara setidaknya sekali]
  Pencatat: [menulis label dan penalaran grup; mencatat bukti/konsensus]
  Manajer Bahan: [mengumpulkan/mendistribusikan bahan; memeriksa pengembalian bahan; mendukung penanganan yang aman]
  Penjaga Waktu: [melacak waktu untuk setiap fase; memberikan peringatan pada 1 menit tersisa]
  Presenter: [berbagi model dan penjelasan grup; menggunakan kerangka kalimat]
  
  Rotasi:
  - Sertakan satu kalimat yang menentukan kapan peran diputar dalam pelajaran INI (misalnya, "Putar peran setelah Fase A dan lagi sebelum gallery walk.")
  
  Batasan:
  - Peran harus menggunakan tepat kelima nama ini (Fasilitator, Pencatat, Manajer Bahan, Penjaga Waktu, Presenter) dan masing-masing harus memiliki tugas konkret terkait dengan CollaborativeActivities pelajaran.
  - Ukuran grup harus sesuai dengan struktur tugas (misalnya, jika menggunakan jigsaw, lebih baik 4–5; jika membangun dan berbagi dengan cepat, triad/berpasangan).
  - Panjang total sekitar 120–180 kata.
- CollaborationGuidelines:
  - Durasi sekitar 5 menit.
  - Kembalikan string kosong untuk field ini karena saat ini saya memiliki teks tetap.
- CollaborativeActivities:
  - Buat aktivitas kolaboratif yang saling bergantung (pengganti latihan terbimbing yang kolaboratif) yang selaras dengan ruang lingkup pelajaran ini.
  - Setiap siswa harus berkontribusi dan grup harus menghasilkan produk atau keputusan bersama.
  - Sertakan stempel waktu, skrip "Katakan:" untuk guru, petunjuk sirkulasi + ekspektasi jawaban, dan pemeriksaan cepat di mana SEMUA siswa merespons + ekspektasi jawaban.
  - Sertakan Diferensiasi (3 level) dan AccommodationsAndModifications (dukungan Umum + Individual persis sesuai data).
  - Jika ini kelas matematika, sertakan satu masalah interleaving level DOK 3–4 yang mencampurkan konten saat ini dengan pelajaran/unit sebelumnya dan jelaskan mengapa itu disertakan; jika tidak, abaikan interleaving.
- ReflectionOnGroupDynamics:
  - Durasi sekitar 5 menit.
  - Sertakan 2–4 pertanyaan debrief siswa (misalnya, apa yang berjalan baik, tantangan, apakah suara Anda didengar).
  - Berikan langkah fasilitasi guru (quick write exit ticket, evaluasi diri grup 1–5, atau diskusi 2 menit), dengan petunjuk guru dan ekspektasi jawaban siswa.
  - Hubungkan refleksi secara eksplisit dengan CollaborationGuidelines.
- ReviewAndSpacedRetrieval:
  - Struktur dan persyaratan yang sama dengan versi instruksi langsung (lihat deskripsi skema).
  - Harus menyertakan pemeriksaan pengambilan (retrieval check) yang menghubungkan dengan SATU konsep dari pelajaran sebelumnya (sebutkan nomor pelajaran sebelumnya).
- StudentPractice:
  - Pekerjaan rumah / latihan di luar kelas.
  - Harus mengikuti format wajib yang tepat dalam deskripsi skema (termasuk penanda ✅Ekspektasi Jawaban Siswa).

PERSYARATAN OUTPUT:
- Output HARUS berupa JSON valid yang persis sesuai dengan skema yang disediakan.
- Output HARUS berupa hanya SATU rencana pelajaran.
- Tanpa HTML. Tanpa emoji. Tanpa markdown. Teks biasa di dalam field string.
`,
  HTML_LESSON_PROMPT_TEMPLATE: `
Anda akan menerima SATU objek JSON yang secara ketat mengikuti skema LessonPlanResponse (sudah divalidasi dari pihak saya). Tugas Anda adalah mengubah JSON ini menjadi HTML yang bersih dan mudah dibaca yang dapat digunakan guru secara langsung di kelas.

FORMAT INPUT
Saya akan mengirimkan objek JSON kepada Anda seperti ini:

JSON RENCANA PELAJARAN:
{{{JsonResponse}}}

Anggap semua yang ada setelah baris "JSON RENCANA PELAJARAN:" sebagai objek JSON yang tepat. JANGAN jelaskan atau komentari; cukup urai dan render.

ATURAN GLOBAL
- Output HANYA boleh berupa HTML valid (tanpa markdown, tanpa backticks, tanpa penjelasan prosa).
- Tag yang diizinkan: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
- JANGAN gunakan tag lain (tidak ada <main>, <section>, <header>, <div>, <h4>, dll.).
- HTML harus menjorok dengan baik dan mudah dibaca.
- Dalam <ol> atau <ul> apa pun, gunakan HANYA elemen <li> sebagai anak langsung. Jangan pernah menaruh <p>, <span>, <ul>, <ol>, atau tag lain di dalam daftar sebagai anak langsung.
- JANGAN buat konten instruksional baru; gunakan hanya apa yang ada di field JSON.
- Pertahankan urutan logis yang tersirat oleh skema.
- Jika field string kosong (""), LEWATI subbagian tersebut dan labelnya.
- Jika array kosong, lewati judulnya dan <ul> atau <ol> yang sesuai.
- Setiap kali teks secara jelas membentuk daftar petunjuk/pertanyaan/pernyataan/jawaban, gunakan <ul><li>…</li></ul> atau <ol><li>…</li></ol>. Jika tidak, gunakan <p>.
- Setiap kali Anda merender model/ekspektasi jawaban siswa, gunakan pola ini:
  - Pertama: <p>✅ Ekspektasi Jawaban Siswa</p>
  - Kemudian: <ul><li>…</li></ul> (atau <ol> jika berurutan)
  - JANGAN menanamkan daftar di dalam <li>.

AWAL HALAMAN
- JANGAN sertakan judul pelajaran (jangan gunakan <h2>); mulai output Anda langsung dengan bagian <h3>💭 Pertanyaan Esensial</h3> dan lanjutkan dari sana.

PERTANYAAN ESENSIAL (ESSENTIAL QUESTIONS)
- <h3>💭 Pertanyaan Esensial</h3>
- <ul> di mana setiap item dari LessonPlan.EssentialQuestions adalah satu <li>.

KOSAKATA KUNCI (KEY VOCABULARY)
- <h3>🔤 Kosakata Kunci</h3>
- <ol> di mana setiap item dari KeyVocabulary adalah satu <li>, mempertahankan struktur "Istilah – Definisi":
  <li><strong>Istilah</strong> – Definisi</li>

TUJUAN PEMBELAJARAN (STUDENT LEARNING OBJECTIVES)
- <h3>🎯 Tujuan Pembelajaran</h3>
- <ul> dengan setiap item dari LessonPlan.StudentLearningObjectives sebagai <li>.

STANDAR TERSELARAS (STANDARDS ALIGNED) - ATURAN KETAT: SELALU RENDER
- <h3>📏 Standar Terselaras</h3>
- <ul> dengan setiap string dari StandardsAligned sebagai <li>.
- Penempatan: tepat setelah tujuan.

MENILAI PENGETAHUAN SEBELUMNYA (ASSESS PRIOR KNOWLEDGE)
    - Subbagian ini HANYA muncul jika properti "AssessPriorKnowledge" ada di JSON dan bukan string kosong.
    - Letakkan tepat setelah blok <h3>🎯 Tujuan Pembelajaran</h3> untuk pelajaran tersebut.

    Perenderan:
        - <h3>💡 Menilai Pengetahuan Sebelumnya</h3>
        - Render paragraf berikut: <p><strong>Catatan Guru: </strong>Mengaktifkan pengetahuan sebelumnya siswa bukan sekadar pemanasan—ini adalah kerja ilmu saraf. Proses ini mengaktifkan jalur saraf yang ada, memudahkan otak untuk menghubungkan informasi baru dengan apa yang sudah diketahui. Teknik ini, yang disebut pengodean elaboratif, membantu siswa mentransfer pengetahuan ke memori jangka panjang dengan lebih cepat dan efisien, meningkatkan pemahaman dan retensi. </p>
        - Tinjauan:
            - Render paragraf pembuka skrip guru yang memperkenalkan aktivitas sebagai satu atau lebih blok <p> sebelum daftar apa pun.
        - Instruksi:
            - Render instruksi guru sebagai daftar poin (<ul>) di mana setiap instruksi menjadi satu <li> dengan teks biasa (JANGAN sertakan HTML di dalam <li>).
            - JANGAN menanamkan daftar di dalam <li> apa pun; semua daftar harus level teratas dan hanya berisi <li>.
        - Templat/Struktur:
            - Render teks Templat/Struktur sebagai satu paragraf <p> yang berisi skrip guru (misalnya, Katakan: ... Lakukan: ...), mempertahankan kata-kata dan tanda baca yang tepat.
            - Segera setelah <p> tersebut, jika ekspektasi jawaban siswa disediakan, render:
            <p>✅ Ekspektasi Jawaban Siswa</p>
            diikuti dengan <ul> di mana setiap jawaban adalah satu <li> dengan teks biasa.
            - JANGAN taruh daftar jawaban ini di dalam <li> atau daftar lainnya.
        - Baris Penutup:
            - Kalimat penutup guru apa pun yang diberikan sebagai paragraf terpisah harus dirender sebagai <p> sendiri setelah daftar.
    - Opsi Alternatif:
        - Letakkan ini SETELAH penutup </ol> dari daftar bernomor utama.
        - Output pertama: <p><strong>Opsi Alternatif</strong></p>
        - Kemudian render daftar bernomor level teratas yang independen <ol> di mana setiap opsi adalah satu <li> dengan teks biasa.

INSTRUKSI (INSTRUCTION)
- <h3><span style="color: rgb(115, 191, 39);">Instruksi</span></h3>
- Bahan:
  <p><strong>📚 Bahan</strong></p>
  <ul>...</ul>
- Instruksi untuk Guru:
  <p><strong>📋 Instruksi untuk Guru</strong></p>
  Render Instruction.InstructionsForTeachers sebagai blok <p> yang mudah dibaca. Saat teks berisi daftar (seperti poin Listen for:), gunakan daftar <ul> terpisah pada level teratas setelah <p> terkait. Jangan menanamkan daftar di dalam <li>.
- Miskonsepsi yang Diantisipasi:
  <p><strong>⚠️ Miskonsepsi yang Diantisipasi</strong></p>
  Gunakan <p> dan/atau <ul> level teratas (hanya <li> teks biasa).
- Pemikiran Transenden:
  - <h3>🌍 Pemikiran Transenden</h3>
  - Render pertanyaan sebagai paragraf pembuka (<p>).
  - Kemudian render model/ekspektasi jawaban siswa menggunakan pola global <p>✅ Ekspektasi Jawaban Siswa</p> diikuti oleh daftar poin (<ul>) di luar item daftar apa pun.
- Pemeriksaan Cepat (Quick Check):
  <p><strong>Pemeriksaan Cepat</strong></p>
  Render sebagai <p> plus pola ✅ jika jawaban ada.

STRUKTUR & PERAN GRUP (GROUP STRUCTURE & ROLES)
- <h3><span style="color: rgb(115, 191, 39);">Struktur & Peran Grup (3–4 mnt)</span></h3>
- Setelah ini render tepat paragraf berikut:
  <p><strong>Tentukan tujuannya: </strong>Apa tujuan utama pengelompokan Anda dalam aktivitas ini — dukungan teman sebaya, diskusi yang kaya, tantangan, atau efisiensi? Setelah Anda mengetahui tujuannya, pilih metode pengelompokan terbaik: kemampuan campuran, berbasis minat, berbasis keterampilan, atau acak. </p>

ATURAN KETAT (tanpa sarang, aman untuk UI):
- Anda TIDAK BOLEH menaruh <ul> atau <ol> apa pun di dalam <li>. Tidak ada daftar bersarang di bagian ini.
- Jika LessonPlan.GroupStructureAndRoles berisi subbagian seperti "Peran:" dan "Rotasi:", Anda HARUS meratakannya menjadi:
  A) Blok <p> terpisah, ATAU
  B) Satu <ul> level teratas di mana SETIAP item adalah <li> sendiri.

POLA PERENDERAN WAJIB (lebih disukai):
1) Render "Ukuran Grup:" sebagai <p> sendiri (teks biasa).
2) Render "📋 Instruksi untuk Guru" sebagai <p><strong>📋 Instruksi untuk Guru</strong></p> jika ada.
3) Render baris "Katakan:" sebagai satu atau lebih blok <p> (teks biasa).
4) Render peran sebagai SATU <ul> level teratas dengan tepat lima item <li>, hanya menggunakan <strong> inline (tanpa daftar bersarang):
   <ul>
     <li><strong>Fasilitator:</strong> ...</li>
     <li><strong>Pencatat:</strong> ...</li>
     <li><strong>Manajer Bahan:</strong> ...</li>
     <li><strong>Penjaga Waktu:</strong> ...</li>
     <li><strong>Presenter:</strong> ...</li>
   </ul>
5) Render "Rotasi:" sebagai baris <p> sendiri (teks biasa). Jika rotasi memiliki beberapa kalimat/langkah, simpan sebagai blok <p> terpisah (BUKAN daftar).
6) Jika teks penjelasan tambahan muncul (misalnya, "Batasan:"), render sebagai <p> (teks biasa), BUKAN sebagai daftar.

PANDUAN KOLABORASI (COLLABORATION GUIDELINES)
- <h3><span style="color: rgb(115, 191, 39);">Panduan Kolaborasi (5 mnt)</span></h3>
- Setelah ini render TEPAT berikut ini:
<p>Gunakan petunjuk di bawah ini untuk memandu kelompok siswa menciptakan norma kelompok mereka sendiri.</p>
<ul>
  <li>Apa yang kalian butuhkan satu sama lain agar hal ini terasa adil, hormat, dan produktif?</li>
  <li>Buat daftar singkat berisi 3-5 norma kelompok yang kalian semua sepakati untuk diikuti. Tanyakan pada diri kalian sendiri: Bagaimana kita akan memastikan suara setiap orang didengar? Bagaimana kita akan menangani ketidaksepakatan?</li>
  <li>Bayangkan seseorang yang baru bergabung dengan grup kalian. Aturan atau kesepakatan apa yang akan kalian jelaskan agar mereka tahu bagaimana grup kalian bekerja sama? Tuliskan sebagai norma kalian.</li>
  <li>Berbaliklah dan bicaralah: Apa yang membantu aktivitas kelompok terakhir kalian berjalan lancar? Apa yang membuatnya frustrasi? Ubah ide-ide tersebut menjadi norma ‘Lakukan’ dan ‘Jangan Lakukan’ untuk kelompok ini.</li>
  <li>Buat satu kalimat yang dimulai dengan ‘Dalam kelompok kita, kita akan selalu…’ dan satu kalimat yang dimulai dengan ‘Dalam kelompok kita, kita tidak akan…’. Gunakan kalimat-kalimat ini untuk membangun serangkaian norma lengkap kalian.</li>
</ul>

AKTIVITAS KOLABORATIF (COLLABORATIVE ACTIVITIES)
- <h3><span style="color: rgb(115, 191, 39);">Aktivitas Kolaboratif (25 mnt)</span></h3>

Bahan:
- <p><strong>📚 Bahan</strong></p>
- Render LessonPlan.CollaborativeActivities.Materials sebagai SATU <ul> level teratas.
- ATURAN KETAT: Tanpa daftar bersarang. Jika baris bahan berisi label seperti "Correction Kit:", diikuti oleh sub-item, RATAKAN dengan menulis item <li> terpisah yang dimulai dengan awalan label, mis.:
  <li>Correction Kit — Tali/benang untuk menyesuaikan jalur orbit</li>

Instruksi untuk Guru:
- <p><strong>📋 Instruksi untuk Guru</strong></p>
- Render arahan guru sebagai SATU daftar bernomor <ol>.
- Bagi teks sumber menjadi langkah-langkah bernomor. Jika teks sudah memiliki penomoran (1), 1., 1) dll., masing-masing menjadi satu <li>.
- ATURAN KETAT: Tanpa daftar bersarang di mana pun di dalam <li>. Untuk mewakili sub-poin atau ekspektasi jawaban, RATAKAN menjadi item <li> berurutan tambahan dalam daftar <ol> yang SAMA.
- Untuk ekspektasi jawaban siswa:
  - Render label "Ekspektasi Jawaban Siswa:" (atau serupa) satu kali sebagai <li> sendiri.
  - Render setiap jawaban/poin berikutnya sebagai item <li> terpisah dengan gaya untuk indentasi: <li style="padding-left: 2em; list-style-type: none;">✅ ...</li>
- Petunjuk sirkulasi harus dirender sebagai satu item <li> bernomor dalam urutan tersebut. Atau jika beberapa jawaban diberikan, ikuti pola "Ekspektasi Jawaban Siswa:" di atas.

Pemeriksaan Cepat:
- Jika sumber menyertakan pemeriksaan cepat, render sebagai:
  <li>Pemeriksaan Cepat — …</li>
  lalu setiap ekspektasi jawaban sebagai baris <li> terpisah:
  <li>✅ Ekspektasi Jawaban Siswa — …</li>
- Diferensiasi:
  <p><strong>🪜 Diferensiasi</strong></p>
  Gunakan blok <p> untuk teks bagian. Untuk subbagian berlabel seperti "Language Learners", "Students Needing Extra Support", "Advanced Learners", render:
    <p><strong>Label</strong></p>
    <ul><li>...</li></ul>
- Akomodasi & Modifikasi:
  <p><strong>🤝 Akomodasi & Modifikasi</strong></p>
  - Umum:
    <p><strong>Dukungan Umum:</strong></p>
    Render setiap item dukungan umum sebagai item daftar di dalam <ul> level teratas. Setiap <li> harus berupa teks biasa.
  - Dukungan Individual:
    <p><strong>Dukungan Individual:</strong></p>
    Untuk setiap siswa dalam array IndividualSupport:
      - Render nama siswa sebagai <p> dengan teks merah: <p><span style="color: rgb(204, 0, 0);">Nama Siswa</span></p>.
      - Kemudian render <ul> yang berisi tepat dua elemen <li>:
          <li>{PlanProvided}</li>
          <li>{PlanImplementation}</li>
      - Ulangi pola ini untuk setiap siswa.

REFLEKSI PADA DINAMIKA GRUP (REFLECTION ON GROUP DYNAMICS)
- <h3><span style="color: rgb(115, 191, 39);">Refleksi pada Dinamika Grup (5 mnt)</span></h3>

- LessonPlan.ReflectionOnGroupDynamics adalah satu string yang mungkin berisi segmen berlabel seperti:
  "Teacher facilitation moves:", "Prompts for students:", "Teacher moves:", "Expected student answers:", "Link back ..."

ATURAN PERENDERAN (sesuai gaya tangkapan layar, tanpa sarang):
1) Bagi string berdasarkan baris baru menjadi beberapa bagian; pangkas spasi.
2) Render setiap segmen berlabel dengan baris label tebal, lalu konten:
   - Teacher facilitation moves:
     <p><strong>Langkah fasilitasi guru:</strong> ...</p>
   - Teacher moves:
     <p><strong>Langkah guru:</strong> ...</p>
   - Link back:
     <p><strong>Tautan kembali:</strong> ...</p>

3) Petunjuk untuk siswa:
   - Render:
     <p><strong>Petunjuk untuk siswa</strong></p>
     Kemudian render petunjuk bernomor (1) ... 2) ... 3) ...) sebagai SATU <ol> level teratas di mana setiap petunjuk adalah <li>.
   - ATURAN KETAT: Tanpa daftar bersarang.

4) Ekspektasi jawaban siswa:
   - Render menggunakan pola global ✅:
     <p>✅ Ekspektasi Jawaban Siswa</p>
     <ul>...setiap contoh yang diberikan menjadi satu <li>...</ul>
   - Jika jawaban dipisahkan koma, bagi berdasarkan koma yang secara jelas memisahkan contoh.
   - Hapus tanda kutip yang mengelilingi.

5) Jika label tertentu tidak ada dalam teks, jangan membuatnya; cukup render konten yang tersisa sebagai <p>.

TINJAUAN & PENGAMBILAN BERJARAK (REVIEW & SPACED RETRIEVAL)
- <h3><span style="color: rgb(115, 191, 39);">Tinjauan & Pengambilan Berjarak (5 mnt)</span></h3>

- LessonPlan.ReviewAndSpacedRetrieval adalah satu string yang mungkin berisi segmen berlabel seperti:
  "Materials:", "Teacher Notes:", "Active Recall:", "Common Misconceptions to revisit:", "Essential Question Link:", "Spaced Retrieval:"

ATURAN PERENDERAN (sesuai gaya tangkapan layar, tanpa sarang):
1) Bahan:
   - <p><strong>📚 Bahan</strong></p>
   - Urai semua setelah "Materials:". Jika "None", render <ul><li>Tidak ada</li></ul>, jika tidak bagi menjadi SATU <ul> level teratas.

2) Catatan Guru:
   - Render: <p><strong>Catatan Guru</strong></p>
   - Kemudian teks lengkap catatan (menjelaskan mengapa/bagaimana strategi membantu) sebagai satu atau lebih blok <p>.

3) Penarikan Aktif:
   - Render:
     <p><strong>📋 Instruksi untuk Guru</strong></p>
     <p><strong>Penarikan Aktif</strong></p>
   - Render 2–3 petunjuk penarikan sebagai daftar bernomor level teratas <ol>.
   - Hapus durasi waktu apa pun (misalnya, "(30 sec)") dari teks.
   - Untuk ekspektasi jawaban siswa apa pun, gunakan pola ✅ (p + ul) segera setelah petunjuk.

4) Memperbaiki Miskonsepsi Umum:
   - Render: <p><strong>Memperbaiki Miskonsepsi Umum</strong></p>
   - Ini HARUS muncul tepat di bawah bagian Penarikan Aktif.
   - Render sebagai <ul> di mana setiap item adalah <li> teks biasa.

5) Tautan Pertanyaan Esensial + Pemikiran Transenden + Pengambilan Berjarak:
   - Render masing-masing dengan ikon dan label spesifiknya:
     <p><strong>💭Tautan Pertanyaan Esensial</strong></p>
     <p><strong>🌍Pemikiran Transenden</strong></p>
     <p><strong>⏳Pengambilan Berjarak</strong></p>
   - Kemudian render konten masing-masing sebagai <p>.

PENILAIAN FORMATIF
- <p><strong>✅Penilaian Formatif</strong></p>
- Render paragraf pembuka (jika ada).
- Kemudian buka SATU <ul> level teratas.
- Buat DUA elemen <li> teks biasa (satu untuk petunjuk, satu untuk jawaban) untuk SETIAP dari 4 petunjuk dalam konten JSON, menyimpannya dalam daftar <ul> datar yang sama:
  - <li>Petunjuk X (DOK Y) — "Teks pertanyaan"</li>
  - <li>✅ Ekspektasi Jawaban Siswa — Teks jawaban</li>
- JANGAN gunakan daftar bersarang. JANGAN gunakan <p> di dalam <li>.

LATIHAN SISWA (STUDENT PRACTICE)
    - <h3><span style="color: rgb(115, 191, 39);">🖊 Latihan Siswa</span></h3>
    - <p><strong>Catatan Guru:</strong> {StudentPractice.StudentPractice_TeacherNotes}</p>
    - Untuk setiap tugas yang tercantum dalam StudentPractice.StudentPractice_Tasks (Bernomor 1, 2, 3...):
    - <p><strong>{Number}. ({DOK})</strong> {StudentDirections}</p>
    - <p><strong>Kriteria Keberhasilan</strong></p>
    - <ul> dengan setiap item SuccessCriteria sebagai <li>.
    - Jika StudentPractice.StudentPractice_InterleavingIfMath tidak kosong:
    - <p><strong>Interleaving (Opsi Matematika)</strong></p>
    - Berikan konten interleaving sebagai satu atau beberapa blok <p>.
`,
  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `
Anda akan menerima SATU objek JSON yang secara ketat mengikuti skema UnitPlanResponse (sudah divalidasi dari pihak saya). Tugas Anda adalah mengubah JSON ini menjadi HTML yang bersih dan mudah dibaca yang dapat digunakan guru secara langsung di kelas.

FORMAT INPUT
Saya akan mengirimkan objek JSON kepada Anda seperti ini:

JSON GARIS BESAR UNIT:
{{{JsonResponse}}}

Anggap semua yang ada setelah baris "JSON GARIS BESAR UNIT:" sebagai objek JSON yang tepat. JANGAN jelaskan atau komentari; cukup urai dan render.

ATURAN GLOBAL
    - Output HANYA boleh berupa HTML valid (tanpa markdown, tanpa backticks, tanpa penjelasan prosa).
    - Tag yang diizinkan: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - JANGAN gunakan tag lain (tidak ada <main>, <section>, <header>, <div>, <h4>, dll.).
    - HTML harus menjorok dengan baik dan mudah dibaca.
    - Dalam <ol> atau <ul> apa pun, gunakan HANYA elemen <li> sebagai anak langsung. Jangan pernah menaruh <p>, <span>, <ul>, <ol>, atau tag lain di dalam daftar sebagai anak langsung.
    - JANGAN buat konten instruksional baru; gunakan hanya apa yang ada di field JSON.
    - Pertahankan urutan logis yang tersirat oleh skema:
        1. Informasi tingkat unit (judul, deskripsi, pertanyaan esensial, tujuan, standar)
        2. Kemudian pelajaran dalam urutan naik LessonNumber
        3. Di dalam setiap pelajaran, ikuti urutan field skema.
    - Jika field string kosong (""), LEWATI subbagian tersebut dan labelnya.
    - Jika array kosong, lewati judulnya dan <ul> atau <ol> yang sesuai.
    - Setiap kali teks secara jelas membentuk daftar petunjuk/pertanyaan/pernyataan/jawaban, gunakan <ul><li>…</li></ul> atau <ol><li>…</li></ol>. Jika tidak, gunakan <p>.
    - Setiap kali Anda merender model/ekspektasi jawaban siswa di BAGIAN APA PUN (setiap kali skema atau teks secara jelas menunjukkan "Expected Student Responses", "Model responses", "Sample answers" atau serupa), gunakan pola ini:
    - Pertama: <p>✅ Ekspektasi Jawaban Siswa</p>
    - Kemudian daftar jawaban:
    - <ul><li>…</li></ul> untuk jawaban yang tidak berurutan.
    - <ol><li>…</li></ol> ketika teks secara jelas bernomor atau berurutan (misalnya, 1., 2., 3.).


- Di bagian atas halaman:
    - <h1> dengan Unit Plan Title.
    - Satu <p> untuk UnitDescription.Description.

- Pertanyaan Esensial (Essential Questions):
    - <h2>💭 Pertanyaan Esensial</h2>
    - <ul> dengan setiap item dari EssentialQuestions sebagai <li>.

- Tujuan Pembelajaran Siswa (Student Learning Objectives):
    - <h2>🎯 Tujuan Pembelajaran</h2>
    - <ul> dengan setiap item dari StudentLearningObjectives sebagai <li>.

- Standar (Standards):
    - <h2>📏 Standar Terselaras</h2>
    - <ul> dengan setiap string dari StandardsAligned sebagai <li>.
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
            "description": "Deskripsi unit sebagai satu paragraf teks biasa yang kohesif (4–5 kalimat lengkap) yang ditulis dengan suara guru alami yang dapat diucapkan langsung kepada siswa. Tanpa HTML, tanpa emoji, tanpa poin-poin. Harus mengalir secara percakapan tetapi mengikuti struktur ini (tanpa judul): (1) kalimat 'hook' yang membangkitkan rasa ingin tahu atau membuat kontras yang mengejutkan, (2) kalimat 'Dalam unit ini, Anda akan...' tentang hasil penguasaan, (3) kalimat 'Anda akan memperkuat keterampilan Anda dalam...' tentang kemampuan berpikir/analisis, (4) kalimat 'Ini terhubung dengan...' tentang relevansi dunia nyata, (5) kalimat 'Memahami ini penting karena...' tentang signifikansi yang lebih luas atau dampak jangka panjang."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Buat pertanyaan esensial yang berfokus secara eksklusif pada konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. JANGAN menyebutkan istilah subjek, proses, kosakata, atau contoh teknis yang sempit. Pertanyaan harus terbuka, dapat ditransfer ke seluruh disiplin ilmu, dan tidak mungkin dijawab hanya dengan mempelajari konten pelajaran atau unit. Berfokuslah hanya pada ide-ide besar, bukan pada materi subjek itu sendiri.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Bagian lengkap 'Tujuan Pembelajaran Siswa' untuk seluruh unit ini. Setiap item dalam daftar harus merupakan tujuan yang jelas dan terukur yang dimulai dengan kata kerja terukur dan diakhiri dengan tag DOK dalam tanda kurung.",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "array",
            "description": "Cantumkan semua standar pendidikan unik yang digunakan di mana pun dalam unit ini dan pelajarannya. JANGAN tambahkan standar yang tidak muncul dalam konten unit. Setiap standar harus menyertakan kode standar dan deskripsi, mis. 'MS-ESS1-1: Mengembangkan dan menggunakan model sistem Bumi-Matahari-Bulan untuk mendeskripsikan pola siklus fase bulan, gerhana, dan musim.'",
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
        "description": "Daftar wadah pelajaran untuk unit ini (hanya garis besar). Setiap item harus tidak tumpang tindih dan dibatasi secara jelas sehingga konten pelajaran tidak berulang di seluruh pelajaran.",
        "items": {
          "type": "object",
          "properties": {
            "lessonNumber": {
              "type": "integer",
              "description": "Nomor urut pelajaran. Dimulai dari 1."
            },
            "lessonTitle": {
              "type": "string",
              "description": "Judul singkat pelajaran sebagai teks biasa."
            },
            "lessonOutline": {
              "type": "string",
              "description": "2–4 kalimat yang menjelaskan ruang lingkup pelajaran, fokus, dan batasan untuk mencegah tumpang tindih dengan pelajaran lain."
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
          "LessonNumber": {
            "type": "integer",
            "description": "Nomor urut pelajaran dalam unit (indeks mulai dari 1)."
          },
          "LessonTitle": {
            "type": "string",
            "description": "Judul deskriptif singkat untuk pelajaran. JANGAN sertakan emoji di sini."
          },
          "EssentialQuestions": {
            "type": "array",
            "description": "Tempel secara verbatim pertanyaan esensial tingkat unit dalam urutan yang sama jika disediakan. Jika tidak disediakan, buat pertanyaan esensial yang berfokus secara eksklusif pada konsep luas dan universal seperti perubahan, bukti, pola, hubungan, sistem, atau penalaran. JANGAN menyebutkan istilah subjek, proses, kosakata, atau contoh teknis yang sempit. Pertanyaan harus terbuka, dapat ditransfer ke seluruh disiplin ilmu, dan tidak mungkin dijawab hanya dengan mempelajari konten pelajaran atau unit. Berfokuslah hanya pada ide-ide besar, bukan pada materi subjek itu sendiri.",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Daftar string dalam format 'Istilah - Definisi'. Definisi harus singkat, sesuai usia, dan terkait dengan pelajaran ini.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "2–3 tujuan terukur, masing-masing diakhiri dengan tag DOK dalam tanda kurung.",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "string",
            "description": "Standar pendidikan yang selaras untuk pelajaran ini. Harus sama persis dengan standar unit dalam kode dan deskripsi."
          },
          "AssessPriorKnowledge": {
            "type": "string",
            "description": "Bagian lengkap 'Menilai Pengetahuan Sebelumnya' sebagai teks biasa (total 150-250 kata). HANYA Pelajaran 1 yang harus berisi blok terperinci; SEMUA PELAJARAN LAIN HARUS MENGEMBALIKAN STRING KOSONG untuk field ini. Untuk Pelajaran 1, struktur harus mencakup: 1. Sertakan bagian ini hanya pada pelajaran pertama unit, diletakkan tepat setelah tujuan pembelajaran siswa. 2. Pastikan petunjuk level DOK 1-3 digunakan. 3. Sertakan keterampilan prasyarat yang diperlukan untuk tujuan pembelajaran siswa. 4. Pilih satu modalitas dari daftar ini dan kembangkan sepenuhnya: polling, K-W-L, visual, peta konsep, refleksi tertulis, panduan antisipasi, penilaian kosakata. 5. Petunjuk awal guru dengan kalimat 'Katakan:' yang memperkenalkan modalitas yang dipilih dan menjelaskan bagaimana siswa akan menunjukkan pemahaman saat ini. 6. Instruksi yang jelas dan templat/struktur untuk modalitas yang dipilih. 7. Bagian 'Ekspektasi Jawaban Siswa' yang menunjukkan jawaban yang diantisipasi atau miskonsepsi umum untuk modalitas yang dipilih. 8. Kalimat penutup guru 'Katakan:' yang memvalidasi pemikiran siswa dan mengumumkan eksplorasi unit. 9. Setelah mengembangkan satu modalitas sepenuhnya, berikan 2 opsi alternatif singkat yang dapat dipilih guru."
          },
          "Instruction": {
            "type": "object",
            "description": "Bagian 'Instruksi' dari pelajaran kolaboratif (setara dengan Direct Presentation).",
            "properties": {
              "Materials": {
                "type": "array",
                "description": "Daftar bahan.",
                "items": {
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "type": "string",
                "description": "Skrip guru dengan petunjuk Katakan/Lakukan/Tanya/Dengarkan untuk/Tulis. JANGAN gunakan subjudul dengan huruf kapital semua untuk bagian-bagian dan JANGAN sertakan durasi waktu untuk langkah-langkah individu."
              },
              "AnticipatedMisconceptions": {
                "type": "string",
                "description": "Miskonsepsi umum dan bahasa yang akurat untuk memperbaiki masing-masing miskonsepsi tersebut."
              },
              "TranscendentThinking": {
                "type": "string",
                "description": "Pertanyaan aplikasi dunia nyata yang menghubungkan pembelajaran dengan tujuan/makna, dengan 2–3 ekspektasi jawaban siswa yang menunjukkan pemahaman yang mendalam."
              },
              "QuickCheck": {
                "type": "string",
                "description": "Pertanyaan pemeriksaan pemahaman akhir dengan 2–3 ekspektasi jawaban siswa."
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
            "type": "string",
            "description": "Penyusunan 3–4 menit untuk ukuran grup + peran yang berputar + tugas + petunjuk guru tentang strategi pengelompokan."
          },
          "CollaborationGuidelines": {
            "type": "string",
            "description": "~5 menit. 3–5 norma, petunjuk guru untuk norma ciptaan siswa (lengkap + singkat) dan dukungan untuk partisipasi yang setara."
          },
          "CollaborativeActivities": {
            "type": "object",
            "description": "Kerja kelompok yang saling bergantung (pengganti latihan terbimbing yang kolaboratif). Berpusat pada guru, sangat terstruktur, dan dirancang sedemikian rupa sehingga siswa tidak dapat menyelesaikan tugas sendirian. Harus mencakup: (a) ketergantungan yang jelas (jigsaw, pencapaian konsensus, gallery walk, tantangan pemecahan masalah terstruktur atau serupa), (b) waktu eksplisit untuk setiap fase (mis. '8 menit diskusi, 2 menit persiapan respons'), (c) bimbingan guru yang diskrip menggunakan pernyataan 'Katakan:' di seluruh kegiatan, (d) produk kelompok bersama (klaim, model, bagan, set solusi, artefak gallery walk dll.), (e) petunjuk sirkulasi dengan ekspektasi jawaban siswa, (f) setidaknya satu pemeriksaan respons SEMUA siswa (papan tulis, tulis cepat, polling, jempol dll.) dengan ekspektasi jawaban, (g) pertanyaan pemeriksaan cepat + ekspektasi jawaban, (h) diferensiasi tiga level yang berfokus pada instruksi (bukan pada akomodasi), dan (i) akomodasi dan modifikasi (AccommodationsAndModifications) yang dibagi menjadi dukungan umum dan dukungan individual yang sesuai persis dengan siswa/rencana yang diberikan. Pastikan relevansi budaya dan inklusi dengan mengundang berbagai perspektif dan memastikan partisipasi yang setara.",
            "properties": {
              "Materials": {
                "type": "array",
                "description": "Daftar lengkap bahan guru + siswa yang digunakan dalam aktivitas kolaboratif ini. Sertakan item apa pun yang disiapkan (kartu petunjuk, kerangka kalimat, kartu peran, daftar periksa, rubrik, lembar gallery walk, papan tulis, pengatur waktu, visual, bank kata, dll.). Satu item per elemen array; tanpa placeholder.",
                "items": {
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "type": "string",
                "description": "Skrip yang ditujukan kepada guru untuk aktivitas kolaboratif selama 25 menit. HARUS ringkas dan sesuai dengan kerangka waktu (targetkan total 6-10 langkah bernomor). JANGAN gunakan subjudul dengan huruf kapital semua (mis. SETUP, MODELING). JANGAN sertakan durasi waktu untuk langkah-langkah individu. Petunjuk sirkulasi harus diintegrasikan sebagai tugas bernomor individu (mis. '5. Petunjuk Sirkulasi: ...'). Ekspektasi jawaban siswa harus mengikuti tugas yang relevan: tulis 'Ekspektasi Jawaban Siswa:' satu kali sebagai langkah bernomor, lalu cantumkan setiap jawaban yang menjorok di baris baru dimulai dengan tanda centang (✅). Contoh:\n5. Petunjuk Sirkulasi: [pertanyaan]\n6. Ekspektasi Jawaban Siswa:\n7. ✅ Jawaban 1\n8. ✅ Jawaban 2"
              },
              "Differentiation": {
                "type": "string",
                "description": "EKSKLUSIF diferensiasi instruksional (bukan akomodasi/modifikasi). Harus diatur dalam tiga level berlabel tepat dengan urutan ini: 'Siswa Pembelajar Bahasa:', 'Siswa yang Membutuhkan Dukungan Ekstra:', 'Untuk Pembelajar Tingkat Lanjut:'. Setiap level harus mencakup langkah pengajaran konkret (2–3 strategi untuk dua level pertama; 1–2 tugas pengayaan untuk 'Untuk Pembelajar Tingkat Lanjut') yang selaras dengan tujuan pembelajaran yang sama. Sertakan setidaknya satu ekspektasi jawaban siswa/contoh per level yang menunjukkan seperti apa kesuksesan itu. Pertahankan tingkat kesulitan; variasikan kompleksitas, dukungan, dan tuntutan wacana."
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "description": "Dukungan akses untuk aktivitas ini, dibagi menjadi (1) dukungan umum untuk semua siswa dan (2) dukungan individual (IndividualSupport) untuk siswa dengan rencana. Berfokuslah pada akses tanpa menurunkan tingkat kesulitan. Untuk setiap dukungan, sertakan alat konkret (awal kalimat yang tepat, tata letak pengatur, deskripsi visual, langkah-langkah daftar periksa, dll.). IndividualSupport HARUS menyertakan tepat siswa yang diberikan dalam petunjuk (nama yang sama, teks PlanProvided yang sama) dan harus menambahkan PlanImplementation yang spesifik untuk aktivitas INI.",
                "properties": {
                  "General": {
                    "type": "string",
                    "description": "Dukungan umum untuk seluruh kelas selama aktivitas kolaboratif ini (tidak spesifik untuk siswa tertentu). Harus konkret dan dapat digunakan (misalnya, kerangka kalimat yang tepat, daftar periksa 3 langkah, poster/jangkar dinding yang dijelaskan, bank kata yang disediakan, kartu tugas yang dipecah-pecah, templat yang ditandai sebelumnya). Jangan kurangi tingkat kesulitan; tingkatkan akses."
                  },
                  "IndividualSupport": {
                    "type": "array",
                    "minItems": 0,
                    "description": "Siswa yang disediakan tepat (tidak lebih, tidak kurang). StudentName dan PlanProvided harus sama persis dengan petunjuk. PlanImplementation harus memberikan dukungan konkret untuk aktivitas INI (kerangka kalimat, pengatur yang diisi sebagian, label bilingual, alur kerja speech-to-text, dll.).",
                    "items": {
                      "type": "object",
                      "properties": {
                        "StudentName": {
                          "type": "string"
                        },
                        "PlanProvided": {
                          "type": "string"
                        },
                        "PlanImplementation": {
                          "type": "string",
                          "description": "Alat konkret/awal kalimat/visual/pengatur untuk tugas ini."
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
            "type": "string",
            "description": "~5 menit. Debrief terstruktur tentang bagaimana grup bekerja + langkah fasilitasi guru + ekspektasi jawaban siswa; hubungkan kembali ke norma."
          },
          "ReviewAndSpacedRetrieval": {
            "type": "string",
            "description": "Bagian lengkap 'Tinjauan dan Pengambilan Berjarak' sebagai teks biasa (400-600 kata). HARUS mencakup komponen-komponen ini secara berurutan: (1) Daftar Bahan, (2) Catatan Guru: Satu paragraf yang menjelaskan 'mengapa' dan 'bagaimana' (teori/ilmu pengetahuan), bukan arahan guru. Gunakan pembukaan ini: 'Catatan Guru: Strategi ini mempromosikan retensi melalui penarikan aktif dan menghubungkan ide-ide hari ini tentang [topik] dengan konsep-konsep sebelumnya dari [konsep]. Refleksi transenden membantu siswa menyadari bagaimana [topik] berdampak pada [ide besar]...', (3) Penarikan Aktif: 2-3 item bernomor yang meminta siswa untuk mengingat pembelajaran BARU dari pelajaran HARI INI (BUKAN isi yang kosong, TANPA exit ticket, TANPA refleksi pada peningkatan), (4) Memperbaiki Miskonsepsi Umum: Diletakkan tepat di bawah Penarikan Aktif dan selaras dengan pertanyaan yang diajukan, (5) Tautan Pertanyaan Esensial: Petunjuk guru yang menghubungkan ke pertanyaan unit + ekspektasi jawaban, (6) Pemikiran Transenden: Pertanyaan aplikasi dunia nyata + ekspektasi jawaban, (7) Pengambilan Berjarak: Penarikan dari pelajaran/unit sebelumnya yang spesifik (menyebutkan nomor pelajaran). Untuk semua petunjuk, sertakan 'Ekspektasi Jawaban Siswa:' dengan 2-3 contoh konkret."
          },
          "FormativeAssessment": {
            "type": "string",
            "description": "Bagian lengkap 'Penilaian Formatif' sebagai teks biasa. Ini HARUS berisi tepat 4 petunjuk pertanyaan yang diberi label 'Petunjuk 1 (DOK 1):', 'Petunjuk 2 (DOK 2):', 'Petunjuk 3 (DOK 3):', dan 'Petunjuk 4 (DOK 4):'. Untuk setiap petunjuk: - Pertanyaan yang menguji pemahaman pada level DOK yang ditentukan - Judul '✅ Ekspektasi Jawaban Siswa' - 1-2 contoh jawaban yang menunjukkan penguasaan. JANGAN sertakan bagian 'Refleksi'. Contoh format: Petunjuk 1 (DOK 1): 'Mengapa planet tetap berada di orbitnya?' ✅ Ekspektasi Jawaban Siswa - 'Gravitasi dan gerakan maju.' [Lanjutkan untuk petunjuk 2-4]"
          },
          "StudentPractice": {
            "type": "string",
            "description": "Pekerjaan rumah / latihan di luar kelas. Harus mengikuti format wajib yang sama dengan instruksi langsung, termasuk ✅ Ekspektasi Jawaban Siswa."
          }
        },
        "required": [
          "LessonNumber",
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
        "CollaborativeActivities.AccommodationsAndModifications"
      ]
    }
  }
};
