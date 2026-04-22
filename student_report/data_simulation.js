/**
 * Simulation of backend data for Teacher Report Integration.
 * Using JSON structures as requested by the user.
 */

window.STUDENT_DB_SIMULATION = {
  students: [
    { id: 1, name: "Jordan Smith", course: "Algebra", semester: "Spring 2026" }
  ],

  // Course Data (Grading System Context)
  course_data: {
  "FieldDescriptions": {
    "Name": "Course name.",
    "Subject": "Subject of the course.",
    "GradeInfo": "The grade level for which the course is designed.",
    "GradingSystem": {
      "GradeType": "Possible values: Percent, GradeMark, Proficiency",
      "Grades": {
        "IsPass": "Indicates whether the grade is considered a passing grade.",
        "OrderIndex": "Represents the rank order of the grade."
      }
    }
  },
  "Data": {
    "Name": "Algebra",
    "Subject": "Math",
    "GradeInfo": "The student is in the 1st grade of middle school, which consists of 4 grades. This stage bridges elementary education and high school, focusing on expanding academic knowledge and social development.",
    "GradingSystem": {
      "GradingStandardName": "U.S. Grading System A - F",
      "GradeType": "GradeMark",
      "Grades": [
        {
          "Name": "A",
          "IsPass": true,
          "OrderIndex": 5
        },
        {
          "Name": "B",
          "IsPass": true,
          "OrderIndex": 4
        },
        {
          "Name": "C",
          "IsPass": true,
          "OrderIndex": 3
        },
        {
          "Name": "D",
          "IsPass": true,
          "OrderIndex": 2
        },
        {
          "Name": "F",
          "IsPass": true,
          "OrderIndex": 1
        }
      ]
    }
  }
},

  // Attendance Data
  attendance: {
  "FieldDescriptions": {
    "Status": "Course schedule slot presence. Available values: 'Present', 'Absent', 'Late', 'Sick', 'FieldTrip'.",
    "Notes": "Additional notes set by teacher"
  },
  "Data": [
    {
      "Status": "Present",
      "Day": "2026-04-17",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00"
    },
    {
      "Status": "Present",
      "Day": "2026-04-16",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00"
    },
    {
      "Status": "Absent",
      "Day": "2026-04-14",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00",
      "Notes": "Did not attend class."
    },
    {
      "Status": "Late",
      "Day": "2026-04-13",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00",
      "Notes": "late for 20 minutes"
    },
    {
      "Status": "Absent",
      "Day": "2026-04-10",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00",
      "Notes": "I needed to remove student from class, bad behaviour."
    },
    {
      "Status": "Present",
      "Day": "2026-04-09",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00"
    },
    {
      "Status": "Late",
      "Day": "2026-04-08",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00",
      "Notes": "late for 15 minutes but with viable expanation."
    },
    {
      "Status": "Present",
      "Day": "2026-04-07",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00"
    },
    {
      "Status": "Absent",
      "Day": "2026-04-06",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00",
      "Notes": "Missed the class. Did not get any additional info."
    },
    {
      "Status": "Sick",
      "Day": "2026-04-03",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00",
      "Notes": "Student reported fever."
    },
    {
      "Status": "FieldTrip",
      "Day": "2026-04-02",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00",
      "Notes": "Student was on field trip."
    },
    {
      "Status": "Present",
      "Day": "2026-04-01",
      "StartTime": "04:00:00",
      "EndTime": "04:55:00"
    }
  ]
},

  // GradeBook Data (Grades & Comments)
  gradebook: {
  "FieldDescriptions": {
    "CurrentGrade": "Current overall course grade for the student.",
    "CourseItemGrades": {
      "Name": "Name of the course item.",
      "DueDate": "Date when student was expected to submit its work.",
      "SubmissionDate": "Description when student actually submited work.",
      "Category": "Available values: 'Activity', 'Assessment', 'Paper Assessment'",
      "Comment": "Teacher's evaluation comment on student's work"
    }
  },
  "Data": {
    "CurrentGrade": "N/A",
    "CourseItemGrades": [
      {
        "Name": "How to turn Fractions into Decimals 3",
        "DueDate": "2025-02-17T06:00:00",
        "SubmissionDate": "2026-04-17T14:51:28.97375",
        "Category": "Assessment",
        "EvaluationState": "CompletedLate",
        "AchievedGrade": "B",
        "Comment": "God work. Additional focus on addition operation needed."
      },
      {
        "Name": "How to turn Fractions into Decimals 4",
        "DueDate": "2025-02-18T06:00:00",
        "SubmissionDate": "2026-04-17T14:51:50.770138",
        "Category": "Assessment",
        "EvaluationState": "CompletedLate",
        "AchievedGrade": "C",
        "Comment": "Fractions knowledge is great, but need to focus in details."
      },
      {
        "Name": "How to turn Fractions into Decimals 5",
        "DueDate": "2025-02-24T06:00:00",
        "Category": "Activity",
        "EvaluationState": "Pending"
      },
      {
        "Name": "How to turn Fractions into Decimals 6",
        "DueDate": "2025-02-25T06:00:00",
        "SubmissionDate": "2026-04-17T14:52:09.61581",
        "Category": "Assessment",
        "EvaluationState": "CompletedLate",
        "AchievedGrade": "A",
        "Comment": "Excellent work"
      },
      {
        "Name": "Pythagorean Theorem",
        "Category": "StandAloneMedia",
        "EvaluationState": "Pending"
      },
      {
        "Name": "Polynomials Test",
        "DueDate": "2025-02-12T06:00:00",
        "SubmissionDate": "2026-04-17T14:54:44.069853",
        "Category": "Assessment",
        "EvaluationState": "CompletedLate",
        "AchievedGrade": "F",
        "Comment": "You need to improve understanding of equations in two variables.\n"
      },
      {
        "Name": "Multiplying and Dividing Whole Numbers",
        "DueDate": "2025-02-06T06:00:00",
        "Category": "Lesson",
        "EvaluationState": "Pending"
      },
      {
        "Name": "How to turn Fractions into Decimals 2",
        "DueDate": "2025-02-07T06:00:00",
        "Category": "Activity",
        "EvaluationState": "Pending"
      },
      {
        "Name": "Order of Operations",
        "DueDate": "2025-02-05T06:00:00",
        "Category": "Lesson",
        "EvaluationState": "Pending"
      },
      {
        "Name": "Understanding Expressions and Equations",
        "DueDate": "2025-01-31T06:00:00",
        "SubmissionDate": "2026-04-17T14:52:54.384034",
        "Category": "Lesson",
        "EvaluationState": "CompletedLate",
        "AchievedGrade": "C",
        "Comment": "You need to improve you knowledge of polynomials."
      },
      {
        "Name": "Pythagorean Theorem",
        "Category": "StandAloneMedia",
        "EvaluationState": "Pending"
      },
      {
        "Name": "How to turn Fractions into Decimals 1",
        "DueDate": "2025-01-29T06:00:00",
        "Category": "Activity",
        "EvaluationState": "Pending"
      },
      {
        "Name": "Polynomials Test",
        "DueDate": "2025-01-30T06:00:00",
        "SubmissionDate": "2026-04-17T14:54:30.868905",
        "Category": "Assessment",
        "EvaluationState": "CompletedLate",
        "AchievedGrade": "A",
        "Comment": "Great progress in polynomials knowledge."
      },
      {
        "Name": "Multiplying and Dividing Whole Numbers",
        "DueDate": "2025-01-24T06:00:00",
        "Category": "Lesson",
        "EvaluationState": "Pending"
      },
      {
        "Name": "Understanding Expressions and Equations",
        "DueDate": "2025-01-22T06:00:00",
        "SubmissionDate": "2026-04-17T14:53:40.886802",
        "Category": "Lesson",
        "EvaluationState": "SubmittedLate"
      },
      {
        "Name": "Order of Operations",
        "DueDate": "2025-01-23T06:00:00",
        "Category": "Lesson",
        "EvaluationState": "Pending"
      }
    ]
  }
}
};
