const PRACTICE_QUIZ_PROMPT_ID = `Tugas Anda adalah membuat kumpulan pertanyaan kuis latihan campuran menggunakan format pilihan tunggal (single-choice) dan benar/salah (true/false).

Hasilkan total {{$numberOfQuestions}} pertanyaan dengan campuran yang seimbang dari kedua jenis.

Nama pelajaran: {{$workItemTitle}}

Konten pelajaran: {{$context}}

Mata pelajaran: {{$subject}}

Tingkat Kelas: {{$gradeLevel}}

Aturan umum:

Gunakan bahasa yang jelas dan sesuai dengan usia

Fokus pada konsep utama dan tujuan pembelajaran

Sertakan pertanyaan ingatan, penerapan, dan penalaran

Hindari ambiguitas

Semua konten harus dalam bahasa: Bahasa Indonesia

Pertanyaan Pilihan Ganda (Multiple Choice):

Tepat 4 pilihan jawaban

Hanya 1 jawaban yang benar

Setiap pertanyaan menguji satu konsep

KRITIS: METODE PEMBUATAN PENGECOH (HARUS DIIKUTI)

Untuk SETIAP pertanyaan pilihan ganda:

Pertama, identifikasi jawaban yang benar

Kemudian hasilkan 3 jawaban yang salah menggunakan struktur ini:

Satu jawaban yang sebagian benar tetapi tidak lengkap

Satu jawaban yang berhubungan secara logis tetapi salah dalam penalaran

Satu jawaban yang benar secara topik tetapi salah dalam kondisi (misalnya, bertahap vs tiba-tiba, jangka panjang vs jangka pendek)

Semua pilihan jawaban harus:

Didasarkan pada konsep yang SAMA dan jenis bukti yang SAMA

Menjawab pertanyaan dengan cara yang sama

Memiliki panjang dan struktur yang serupa

Dapat dipercaya secara ilmiah atau logis

Jawaban yang salah harus:

Menjadi sesuatu yang secara realistis dapat dipercaya oleh siswa

Mendekati jawaban yang benar tetapi berbeda dalam satu ide utama

Memerlukan pemikiran untuk dihilangkan

Jawaban yang salah TIDAK BOLEH:

Jelas-jelas salah

Tidak berhubungan dengan pertanyaan

Berasal dari topik yang berbeda

Tidak mungkin untuk diukur atau diketahui

Menyertakan klaim yang ekstrem atau berlebihan

PEMERIKSAAN KETAT (DIBUTUHKAN SEBELUM KELUARAN)

Tolak dan tulis ulang pertanyaan jika:

Setiap jawaban dapat dihilangkan secara instan tanpa berpikir

Setiap jawaban berasal dari topik yang berbeda

Jawaban yang benar jelas lebih panjang, lebih jelas, atau lebih detail

Semua jawaban bukan merupakan interpretasi bersaing dari ide yang SAMA

Pertanyaan Benar/Salah:

Uji penalaran dan pemahaman (bukan hafalan)

Hindari "selalu" atau "tidak pernah" kecuali akurat

Sertakan campuran pernyataan Benar dan Salah

Pernyataan harus jelas

Untuk semua jenis pertanyaan:

Rasional / Umpan Balik Siswa:

Berikan umpan balik setelah setiap pertanyaan untuk memperkuat pembelajaran

Jelaskan mengapa jawaban yang benar itu benar

Atasi mengapa kesalahpahaman itu salah jika bermanfaat

Semua keluaran harus dalam bahasa: Bahasa Indonesia.

Respons HARUS berupa JSON dengan serangkaian pertanyaan benar-salah atau pilihan tunggal berdasarkan {{$numberOfQuestions}}.

Jika {{$numberOfQuestions}} adalah genap, hasilkan tepat separuh dari setiap jenis.

Jika {{$numberOfQuestions}} adalah ganjil, hasilkan total satu lebih sedikit (bulatkan ke bawah ke angka genap terdekat) dan bagi sama rata.

Struktur JSON:

Respons harus berupa objek dengan array "questions".

Setiap objek pertanyaan HARUS memiliki SEMUA bidang ini:

- "question": string

- "questionType": integer (1 untuk SingleChoice, 4 untuk TrueFalse)

- "rationale": string (Umpan balik siswa atau rasional setelah pertanyaan)

- "answers": array string

- "correctAnswers": array bilangan bulat

- "correctAnswer": string

Nilai spesifik untuk setiap jenis:

Untuk SingleChoice (questionType: 1):

- "answers": array yang berisi tepat 4 string

- "correctAnswers": array yang berisi tepat satu bilangan bulat (indeks jawaban yang benar)

- "correctAnswer": HARUS "" (string kosong)

Untuk TrueFalse (questionType: 4):

- "answers": HARUS [] (array kosong)

- "correctAnswers": HARUS [] (array kosong)

- "correctAnswer": HARUS "True" atau "False"
`;

const PRACTICE_QUIZ_SCHEMA_ID = {
    "title": "PracticeQuizResponse",
    "type": "object",
    "properties": {
        "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "question": {
                        "type": "string"
                    },
                    "questionType": {
                        "type": "integer",
                        "enum": [1, 4]
                    },
                    "answers": {
                        "type": "array",
                        "items": { "type": "string" },
                        "description": "Berikan tepat 4 jawaban untuk tipe 1. Untuk tipe 4, berikan array kosong."
                    },
                    "correctAnswers": {
                        "type": "array",
                        "items": { "type": "integer" },
                        "description": "Berikan tepat satu indeks untuk tipe 1. Untuk tipe 4, berikan array kosong."
                    },
                    "correctAnswer": {
                        "type": "string",
                        "enum": ["True", "False", ""],
                        "description": "Berikan 'True' atau 'False' untuk tipe 4. Untuk tipe 1, berikan string kosong."
                    },
                    "rationale": {
                        "type": "string"
                    }
                },
                "required": ["question", "questionType", "answers", "correctAnswers", "correctAnswer", "rationale"],
                "additionalProperties": false
            }
        }
    },
    "required": ["questions"],
    "additionalProperties": false
};
