/**
 * Simulation of an SQL Database for Student Records
 * This JSON structure represents how data would look coming from backend tables:
 * - students
 * - grades
 * - attendance
 */

window.STUDENT_DB_SIMULATION = {
  students: [
    { id: 1, name: "Jordan Smith", course: "Algebra II", semester: "Spring 2026" },
    { id: 2, name: "Emma Johnson", course: "Algebra II", semester: "Spring 2026" },
    { id: 3, name: "Liam Williams", course: "Algebra II", semester: "Spring 2026" },
    { id: 4, name: "Olivia Brown", course: "Algebra II", semester: "Spring 2026" },
    { id: 5, name: "Noah Martinez", course: "Algebra II", semester: "Spring 2026" }
  ],

  // Grades table: tracking performance over time (A-F system for this simulation)
  grades: [
    // 1. Jordan (Perfect Grades)
    { student_id: 1, date: "2026-01-15", topic: "Factoring Trinomials", type: "Formative", grade: "A+", teacher_comment: "Flawless execution and understanding." },
    { student_id: 1, date: "2026-02-05", topic: "Functions and Domain", type: "Formative", grade: "A", teacher_comment: "Excellent grasp of function notation." },
    { student_id: 1, date: "2026-02-28", topic: "Midterm Exam", type: "Summative", grade: "A+", teacher_comment: "Top score in the class. Incredible dedication." },
    { student_id: 1, date: "2026-03-10", topic: "Logarithmic Functions", type: "Formative", grade: "A", teacher_comment: "Masters abstract concepts quickly." },
    { student_id: 1, date: "2026-03-20", topic: "Unit 3 Quiz", type: "Summative", grade: "A+", teacher_comment: "Perfect performance again." },

    // 2. Emma (Catastrophic Grades)
    { student_id: 2, date: "2026-01-15", topic: "Factoring Trinomials", type: "Formative", grade: "F", teacher_comment: "Did not submit assignment." },
    { student_id: 2, date: "2026-02-05", topic: "Functions and Domain", type: "Formative", grade: "D-", teacher_comment: "Significant gaps in foundational knowledge." },
    { student_id: 2, date: "2026-02-28", topic: "Midterm Exam", type: "Summative", grade: "F", teacher_comment: "Failed to demonstrate basic understanding of the material." },
    { student_id: 2, date: "2026-03-10", topic: "Logarithmic Functions", type: "Formative", grade: "F", teacher_comment: "Blank worksheet submitted." },
    { student_id: 2, date: "2026-03-20", topic: "Unit 3 Quiz", type: "Summative", grade: "D", teacher_comment: "Slight effort shown, but still failing the unit." },

    // 3. Liam (Great Grades, Bad Attendance)
    { student_id: 3, date: "2026-01-15", topic: "Factoring Trinomials", type: "Formative", grade: "A", teacher_comment: "Very sharp when present." },
    { student_id: 3, date: "2026-02-05", topic: "Functions and Domain", type: "Formative", grade: "A-", teacher_comment: "Understands material without even being in class." },
    { student_id: 3, date: "2026-02-28", topic: "Midterm Exam", type: "Summative", grade: "B+", teacher_comment: "Great score despite chronic absenteeism." },
    { student_id: 3, date: "2026-03-10", topic: "Logarithmic Functions", type: "Formative", grade: "A", teacher_comment: "Aced the practice problems effortlessly." },
    { student_id: 3, date: "2026-03-20", topic: "Unit 3 Quiz", type: "Summative", grade: "A-", teacher_comment: "Brilliant student, but attendance is heavily impacting potential." },

    // 4. Olivia (Bad Grades, Perfect Attendance)
    { student_id: 4, date: "2026-01-15", topic: "Factoring Trinomials", type: "Formative", grade: "D", teacher_comment: "Tries very hard but struggles with math concepts." },
    { student_id: 4, date: "2026-02-05", topic: "Functions and Domain", type: "Formative", grade: "C-", teacher_comment: "Always asks questions but still missing core ideas." },
    { student_id: 4, date: "2026-02-28", topic: "Midterm Exam", type: "Summative", grade: "D+", teacher_comment: "Attendance and effort are perfect, but the test score is very low." },
    { student_id: 4, date: "2026-03-10", topic: "Logarithmic Functions", type: "Formative", grade: "D", teacher_comment: "Needs one-on-one tutoring." },
    { student_id: 4, date: "2026-03-20", topic: "Unit 3 Quiz", type: "Summative", grade: "F", teacher_comment: "Completely lost on logarithms despite being present for every minute." },

    // 5. Noah (Started failing, immense turnaround / Late bloomer)
    { student_id: 5, date: "2026-01-15", topic: "Factoring Trinomials", type: "Formative", grade: "F", teacher_comment: "Did not try. Refused to participate." },
    { student_id: 5, date: "2026-02-05", topic: "Functions and Domain", type: "Formative", grade: "D-", teacher_comment: "Barely passing." },
    { student_id: 5, date: "2026-02-28", topic: "Midterm Exam", type: "Summative", grade: "C", teacher_comment: "Showed a sudden spark of interest. Better." },
    { student_id: 5, date: "2026-03-10", topic: "Logarithmic Functions", type: "Formative", grade: "A-", teacher_comment: "Incredible breakthrough! Suddenly understands everything." },
    { student_id: 5, date: "2026-03-20", topic: "Unit 3 Quiz", type: "Summative", grade: "A+", teacher_comment: "What a turnaround! Best score on the quiz." }
  ],

  // Attendance table: tracking dates and types
  attendance: [
    // 1. Jordan (Perfect attendance)
    { student_id: 1, date: "2026-01-12", status: "Present" },
    { student_id: 1, date: "2026-01-20", status: "Present" },
    { student_id: 1, date: "2026-02-15", status: "Present" },
    { student_id: 1, date: "2026-03-05", status: "Present" },
    { student_id: 1, date: "2026-03-18", status: "Present" },

    // 2. Emma (Catastrophic Attendance)
    { student_id: 2, date: "2026-01-12", status: "Unexcused Absence" },
    { student_id: 2, date: "2026-01-20", status: "Unexcused Absence" },
    { student_id: 2, date: "2026-02-15", status: "Excused Absence" },
    { student_id: 2, date: "2026-03-05", status: "Unexcused Absence" },
    { student_id: 2, date: "2026-03-18", status: "Unexcused Absence" },

    // 3. Liam (Bad Attendance)
    { student_id: 3, date: "2026-01-12", status: "Unexcused Absence" },
    { student_id: 3, date: "2026-01-20", status: "Late" },
    { student_id: 3, date: "2026-02-15", status: "Unexcused Absence" },
    { student_id: 3, date: "2026-03-05", status: "Excused Absence" },
    { student_id: 3, date: "2026-03-18", status: "Unexcused Absence" },

    // 4. Olivia (Perfect Attendance)
    { student_id: 4, date: "2026-01-12", status: "Present" },
    { student_id: 4, date: "2026-01-20", status: "Present" },
    { student_id: 4, date: "2026-02-15", status: "Present" },
    { student_id: 4, date: "2026-03-05", status: "Present" },
    { student_id: 4, date: "2026-03-18", status: "Present" },

    // 5. Noah (Hit or miss turning perfect)
    { student_id: 5, date: "2026-01-12", status: "Unexcused Absence" },
    { student_id: 5, date: "2026-01-20", status: "Late" },
    { student_id: 5, date: "2026-02-15", status: "Present" },
    { student_id: 5, date: "2026-03-05", status: "Present" },
    { student_id: 5, date: "2026-03-18", status: "Present" }
  ]
};
