/**
 * Prompt Template for Student Report Feedback
 * Cleo: AI Assistant for generating feedback.
 */

const STUDENT_REPORT_PROMPT_TEMPLATE = `
Generate feedback with no more than 300 characters using the data provided. (You will use this information – grades and teacher comments on assessments, student assessment answers, attendance.)

Feedback should:
-Be written as speaking to the student.  
- Summarize overall engagement and performance trends (e.g., steady progress, recent improvement, or decline).
- Highlight one strength or success area specific to the course.
- Identify one area for growth or give actionable advice for improvement or continued success.

Output requirements:
- NO HTML formatting.
- Plain text only.
- Strict 300 character limit.

STUDENT INFORMATION:
{{$StudentInfo}}

GRADING SYSTEM CONTEXT:
{{$GradingSystem}}

ATTENDANCE RECORD:
{{$AttendanceData}}

GRADES:
{{$GradesData}}

TEACHER COMMENTS, ASSESSMENT ANSWERS & TRENDS:
{{$QualitativeData}}
`;

const STUDENT_REPORT_SCHEMA = {
  type: "object",
  properties: {
    feedback: {
      type: "string",
      description: "The generated feedback comment from Cleo, max 300 characters."
    }
  },
  required: ["feedback"],
  additionalProperties: false
};
