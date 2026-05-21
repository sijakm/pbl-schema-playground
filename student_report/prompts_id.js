(() => {
/**
 * Prompt Template for Student Report Feedback
 * Cleo: AI Assistant for generating feedback.
 */

const STUDENT_REPORT_PROMPT_TEMPLATE = `
Buat umpan balik dengan tidak lebih dari 300 karakter menggunakan data yang disediakan. (Anda akan menggunakan informasi ini – nilai dan komentar guru pada penilaian, jawaban penilaian siswa, kehadiran.)

Umpan balik harus:
- Ditulis seolah-olah berbicara kepada siswa.  
- Merangkum keterlibatan keseluruhan dan tren kinerja (mis., kemajuan yang stabil, peningkatan terbaru, atau penurunan).
- Menyoroti satu kekuatan atau area keberhasilan yang spesifik untuk mata pelajaran tersebut.
- Mengidentifikasi satu area untuk berkembang atau memberikan saran yang dapat ditindaklanjuti untuk perbaikan atau keberhasilan berkelanjutan.

Persyaratan output:
- TANPA pemformatan HTML.
- Hanya teks biasa.
- Batas ketat 300 karakter.

INFORMASI SISWA:
{{$StudentInfo}}

KONTEKS SISTEM PENILAIAN:
{{$GradingSystem}}

REKAMAN KEHADIRAN:
{{$AttendanceData}}

NILAI & KOMENTAR GURU:
{{$GradesData}}
`;

const STUDENT_REPORT_SCHEMA = {
    type: "object",
    properties: {
        feedback: {
            type: "string",
            description: "Umpan balik yang dihasilkan, maksimal 300 karakter."
        }
    },
    required: ["feedback"],
    additionalProperties: false
};

window.studentReportPromptsId = {
    STUDENT_REPORT_PROMPT_TEMPLATE,
    STUDENT_REPORT_SCHEMA
};
})();
