const HINTS_PROMPT_ID = `Anda adalah asisten AI pendidikan. Tugas Anda adalah menghasilkan tepat 3 petunjuk bertingkat (Awal, Lanjutan, Pengajaran Ulang) untuk SETIAP pertanyaan yang diberikan, yang membantu seorang siswa menyelesaikan pertanyaan tanpa secara langsung mengungkapkan jawaban.

Petunjuk harus mengikuti perkembangan pedagogis dari konsep yang luas menuju pemahaman yang lebih dalam tentang logika pertanyaan.

Patuhi secara ketat instruksi rinci dan persyaratan panjang karakter yang ditentukan dalam skema JSON.

Konteks Pelajaran: {{$lesson_context}}
Nama Pelajaran: {{$lesson_name}}
Deskripsi Pelajaran: {{$lesson_description}}
Mata Pelajaran: {{$subject}}
Tingkat Kelas: {{$grade_level}}
Data Pertanyaan: {{$question_data}}`;
const HINTS_SCHEMA_ID = {
    "title": "HintsResponse",
    "type": "object",
    "properties": {
        "hints": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "initial_hint": {
                        "type": "string",
                        "description": "Petunjuk 1: Konsep umum (sangat umum). JANGAN sertakan metode, objek, atau sistem spesifik yang digunakan dalam jawaban. Fokus hanya pada topik ilmiah atau historis tingkat tinggi."
                    },
                    "follow_up_hint": {
                        "type": "string",
                        "description": "Petunjuk 2: Petunjuk yang lebih sempit yang menambahkan satu detail berguna. Persempit kemungkinan tetapi tetap berlaku untuk beberapa kemungkinan jawaban. Jangan dibuat terlalu jelas atau gunakan bagian dari jawaban yang benar."
                    },
                    "reteach_hint": {
                        "type": "string",
                        "minLength": 500,
                        "description": "Petunjuk 3: Pemahaman terpandu dan penjelasan logika. Bagian ini HARUS SANGAT RINCI DAN MENYELURUH (MINIMUM 500 KARAKTER). Bagian ini harus menjelaskan penalaran inti, cara menghubungkan berbagai potongan bukti, dan langkah-langkah logis yang harus diikuti siswa untuk sampai pada jawaban tanpa menyatakannya secara langsung."
                    }
                },
                "required": [
                    "initial_hint",
                    "follow_up_hint",
                    "reteach_hint"
                ],
                "additionalProperties": false
            }
        }
    },
    "required": [
        "hints"
    ],
    "additionalProperties": false
};
const META_ID = {
    workItemTitle: "Jejak Raksasa: Asteroid yang Mengubah Bumi",
    subject: "Sains / Sejarah Bumi",
    gradeLevel: "Kelas 7-8",
    lessonDescription: "Bukti tumbukan asteroid di permukaan Bumi pada masa lalu dan konsekuensi globalnya."
};
const LABELS_ID = {
    correctAnswer: "Jawaban benar (untuk validasi):"
};
const LESSON_CONTEXT_ID = `Pendahuluan
Bayangkan menjadi seorang detektif — tetapi alih-alih memecahkan kejahatan, kamu memecahkan sebuah misteri yang terjadi 66 juta tahun yang lalu. Itulah yang dilakukan para ilmuwan ketika mereka mempelajari tumbukan asteroid. Mereka tidak bisa menyaksikannya terjadi, tetapi mereka dapat mencari petunjuk yang tertinggal di batuan, fosil, dan kawah untuk menceritakan kisah tentang apa yang terjadi dahulu kala.
 
Dalam pelajaran ini, kamu akan belajar bagaimana para ilmuwan mengumpulkan dan menafsirkan bukti dari tumbukan asteroid untuk memahami bagaimana tabrakan dahsyat ini membentuk ulang kehidupan di Bumi. Kamu akan mempelajari tanda-tanda kehancuran — kawah, puing-puing, fosil — dan belajar bagaimana masing-masing membantu menjelaskan rangkaian peristiwa yang mengikutinya.
Pada akhir pelajaran, kamu akan berpikir seperti gabungan seorang geolog dan sejarawan, menghubungkan fakta tentang antariksa dan sejarah Bumi untuk memahami salah satu peristiwa alam paling dahsyat yang pernah tercatat. Siap menelusuri bukti asteroid yang mengubah segalanya? Mari kita mulai.
 
Kosakata Kunci
Asteroid
Kawah Tumbukan
Kepunahan
Catatan Fosil
Gelombang Kejut
Awan Puing
Kawah Chicxulub
Kepunahan Massal
Perubahan Iklim (Pasca-Tumbukan)
Bukti
 
🎯Tujuan Pembelajaran Siswa
Mengidentifikasi jenis-jenis bukti ilmiah yang mendukung tumbukan asteroid di masa lalu (DOK 2).
Menganalisis bagaimana lapisan fosil dan sedimen mengungkap perubahan dari waktu ke waktu (DOK 3).
Menafsirkan data visual dan tekstual untuk menyusun penjelasan tentang peristiwa asteroid historis (DOK 3).
 
📘Konsep Inti
Mengungkap Petunjuk Tumbukan Bumi
 
Ketika sebuah asteroid menabrak Bumi, asteroid itu tidak hanya meninggalkan bekas — ia mengubah segalanya di sekitarnya. Ledakan itu mengirim gelombang kejut melalui tanah, melontarkan puing-puing ke udara, dan mengubah iklim planet. Dampak-dampak ini meninggalkan bukti jelas yang dapat dipelajari para ilmuwan jutaan tahun kemudian.
Jenis bukti utama yang dicari para ilmuwan adalah:
Kawah Tumbukan – Cekungan raksasa ini menandai tempat asteroid menghantam. Seiring waktu, sebagian terisi air atau sedimen, sehingga bentuknya tersembunyi dari permukaan.
Catatan Fosil – Lapisan fosil menunjukkan hilangnya spesies secara tiba-tiba, yang menandakan peristiwa kepunahan.
Lapisan Iridium dan Awan Puing – Setelah tabrakan, lapisan tipis debu yang kaya iridium (logam yang umum ditemukan pada asteroid) mengendap di seluruh dunia.
Lapisan Sedimen – Lapisan batuan berfungsi seperti garis waktu, membantu para ilmuwan menentukan dengan tepat kapan tumbukan terjadi.
Hal-hal Penting:
Tumbukan asteroid meninggalkan petunjuk geologi dan biologis yang bertahan lama.
Fosil dan lapisan batuan berfungsi sebagai “ingatan” Bumi tentang bencana kuno.
Para ilmuwan menggunakan petunjuk ini untuk merekonstruksi apa yang terjadi jutaan tahun yang lalu.
🤯 Tahukah Kamu? Lapisan iridium yang menandai peristiwa kepunahan dinosaurus dapat ditemukan dalam batuan di setiap benua — bahkan di Antartika!
🔎Renungkan & Tanggapi: Menurutmu, bukti mana — kawah, fosil, atau iridium — yang memberikan bukti paling meyakinkan tentang tumbukan asteroid di masa lalu? Mengapa?
 
Kawah Chicxulub: Jejak Raksasa
Salah satu penemuan terpenting dalam sains modern adalah Kawah Chicxulub di Meksiko. Kawah ini terkubur jauh di bawah tanah dan di bawah air, tetapi bentuk melingkar dan komposisinya sesuai dengan semua yang diharapkan para ilmuwan dari lokasi tumbukan besar.
Sekitar 66 juta tahun yang lalu, sebuah asteroid raksasa — selebar sekitar 6 mil — menghantam Bumi di sini. Energi yang dilepaskannya lebih kuat daripada miliaran bom atom. Tumbukan itu melontarkan puing-puing ke atmosfer, memicu gempa bumi dan tsunami, serta menyebabkan musim dingin global yang menghalangi sinar matahari selama berbulan-bulan. Hasilnya? Sebuah kepunahan massal yang memusnahkan 75% kehidupan di Bumi — termasuk sebagian besar dinosaurus.
🎥Tonton Mengapa Dinosaurus Mati
Hal-hal Penting:
Kawah Chicxulub memberikan bukti kuat tentang tumbukan asteroid yang mengakhiri zaman dinosaurus.
Tumbukan tersebut menyebabkan gelombang kejut, kebakaran, dan perubahan iklim jangka panjang.
Para ilmuwan menggunakan bentuk kawah, kandungan mineral, dan bukti fosil di sekitarnya untuk mengonfirmasi peristiwa tersebut.
🤯 Tahukah Kamu? Jika asteroid itu mendarat di tempat lain — seperti jauh di dalam laut — dampak globalnya mungkin tidak separah itu!
🔎Renungkan & Tanggapi: Menurutmu, bagaimana ekosistem planet ini akan berubah jika asteroid Chicxulub menghantam bagian dunia yang berbeda?
 
Membaca Catatan Fosil
Catatan fosil itu seperti garis waktu kehidupan di Bumi. Ketika para ilmuwan membandingkan fosil dari sebelum dan sesudah tumbukan, mereka melihat perubahan yang dramatis. Pada banyak lapisan, fosil tumbuhan tiba-tiba menghilang — menunjukkan bahwa sinar matahari terhalang oleh awan puing. Pada lapisan laut, organisme laut kecil menghilang, yang menunjukkan bahwa perubahan suhu dan kimia menyulitkan mereka untuk bertahan hidup.
 
Dengan menyusun semua ini, para ilmuwan dapat menghubungkan catatan fosil dengan tumbukan asteroid, menunjukkan bagaimana satu peristiwa menyebabkan perubahan jangka panjang pada kehidupan di Bumi. Temuan ini membantu para ilmuwan memahami bukan hanya apa yang terjadi pada dinosaurus, tetapi juga bagaimana kehidupan berevolusi dan beradaptasi setelah bencana.
Hal-hal Penting:
Catatan fosil membantu para ilmuwan memahami bagaimana tumbukan asteroid mengubah ekosistem.
Kepunahan massal menunjukkan pola kehancuran dan pemulihan.
Mempelajari peristiwa masa lalu membantu memprediksi bagaimana perubahan iklim saat ini mungkin memengaruhi kehidupan saat ini.
🤯 Tahukah Kamu? Setelah asteroid memusnahkan dinosaurus, mamalia mulai berevolusi dengan cepat — yang pada akhirnya mengarah pada manusia!
🔎Renungkan & Tanggapi: Mengapa menurutmu kehidupan di Bumi mampu pulih setelah peristiwa kepunahan yang begitu besar?
 
🧠 Artinya Ini
Bukti tumbukan asteroid di masa lalu mengingatkan kita bahwa Bumi selalu berubah — kadang secara tiba-tiba, kadang selama jutaan tahun. Bencana alam ini telah membentuk iklim, bentang alam, dan jenis kehidupan yang ada di Bumi saat ini.
Dengan mempelajari kawah, fosil, dan pergeseran iklim, para ilmuwan tidak hanya melihat ke belakang — mereka juga mempersiapkan masa depan. Memahami peristiwa kuno ini membantu umat manusia melindungi Bumi dari kemungkinan tumbukan di masa depan dan menghadapi perubahan lingkungan dengan lebih baik. Setiap lapisan batuan dan setiap fosil adalah halaman dalam buku sejarah Bumi, menunggu pikiran-pikiran yang ingin tahu untuk membacanya.`;
const SAMPLE_QUESTIONS_ID = [
    {
        "question": "Bukti langsung apa yang digunakan ilmuwan untuk menentukan linimasa pasti dari tumbukan asteroid?",
        "questionType": 1,
        "answers": ["Kawah tumbukan", "Lapisan sedimen", "Catatan iklim", "Lukisan gua"],
        "correctAnswers": [1],
        "correctAnswerText": "Lapisan sedimen"
    },
    {
        "question": "Apa yang terjadi pada sinar matahari setelah asteroid Chicxulub menabrak Bumi?",
        "questionType": 1,
        "answers": ["Menjadi jauh lebih terang", "Tetap sama", "Terhalang selama berbulan-bulan oleh awan puing global", "Berubah menjadi merah"],
        "correctAnswers": [2],
        "correctAnswerText": "Terhalang selama berbulan-bulan oleh awan puing global"
    },
    {
        "question": "Benar atau Salah: Kawah Chicxulub dengan mudah ditemukan di permukaan karena bentuknya yang sangat melingkar sempurna.",
        "questionType": 4,
        "answers": ["Benar", "Salah"],
        "correctAnswers": [1],
        "correctAnswerText": "Salah"
    },
    {
        "question": "Jelaskan mengapa fosil tumbuhan sering menghilang secara tiba-tiba di lapisan batuan yang sesuai dengan periode tumbukan.",
        "questionType": 0,
        "answers": [],
        "correctAnswers": [],
        "correctAnswerText": "Awan puing menghalangi sinar matahari, mencegah fotosintesis, dan membunuh banyak tumbuhan, yang kemudian tercermin dalam catatan fosil."
    },
    {
        "question": "Bagaimana tumbukan asteroid secara tidak langsung menguntungkan evolusi mamalia?",
        "questionType": 0,
        "answers": [],
        "correctAnswers": [],
        "correctAnswerText": "Dengan menghilangkan dinosaurus yang dominan, tumbukan tersebut membuka relung ekologis, yang memungkinkan mamalia berevolusi dengan cepat dan akhirnya mengarah pada manusia."
    }
];
