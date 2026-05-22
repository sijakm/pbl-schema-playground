const PRACTICE_QUIZ_PROMPT_EN = `Your task is to create a mixed set of practice quiz questions using single-choice and true/false formats.

Generate {{$numberOfQuestions}} total questions with a balanced mix of both types.

Lesson name: {{$workItemTitle}}

Lesson content: {{$context}}

Subject: {{$subject}}

Grade Level: {{$gradeLevel}}

General rules:

Use clear, grade-appropriate language

Focus on key concepts and learning objectives

Include recall, application, and reasoning questions

Avoid ambiguity

Multiple Choice Questions:

Exactly 4 answer choices

Only 1 correct answer

Each question tests one concept

CRITICAL: DISTRACTOR GENERATION METHOD (MUST FOLLOW)

For EACH multiple choice question:

First identify the correct answer

Then generate 3 incorrect answers using this structure:

One answer that is partially correct but incomplete

One answer that is logically related but incorrect in reasoning

One answer that is correct in topic but wrong in condition (e.g., gradual vs sudden, long-term vs short-term)

All answer choices must:

Be based on the SAME concept and SAME type of evidence

Answer the question in the same way

Be similar in length and structure

Be scientifically or logically believable

Incorrect answers must:

Be something a student could realistically believe

Be close to the correct answer but differ in one key idea

Require thinking to eliminate

Incorrect answers must NOT:

Be obviously wrong

Be unrelated to the question

Be from a different topic

Be impossible to measure or know

Include extreme or exaggerated claims

HARD CHECK (REQUIRED BEFORE OUTPUT)

Reject and rewrite the question if:

Any answer can be eliminated instantly without thinking

Any answer is from a different topic

The correct answer is obviously longer, clearer, or more detailed

All answers are not competing interpretations of the SAME idea

True/False Questions:

Test reasoning and understanding (not memorization)

Avoid “always” or “never” unless accurate

Include a mix of True and False

Statements must be clear

For all question types:

Rationale / Student Feedback:

Provide feedback after each question to reinforce learning

Explain why the correct answer is correct

Address why misconceptions are incorrect when helpful

Response MUST be JSON with a set of true-false or single choice questions based on {{$numberOfQuestions}}.

If {{$numberOfQuestions}} is even, generate exactly half of each type.

If {{$numberOfQuestions}} is odd, generate one less in total (round down to nearest even) and split equally.

JSON Structure:

The response must be an object with a "questions" array.

Each question object MUST have ALL of these fields:

- "question": string

- "questionType": integer (1 for SingleChoice, 4 for TrueFalse)

- "rationale": string (Student feedback or rationale after the question)

- "answers": array of strings

- "correctAnswers": array of integers

- "correctAnswer": string

Specific values for each type:

For SingleChoice (questionType: 1):

- "answers": array of exactly 4 strings

- "correctAnswers": array of exactly one integer (the index of the correct answer)

- "correctAnswer": MUST be "" (empty string)

For TrueFalse (questionType: 4):

- "answers": MUST be [] (empty array)

- "correctAnswers": MUST be [] (empty array)

- "correctAnswer": MUST be "True" or "False"
`;

const PRACTICE_QUIZ_SCHEMA_EN = {
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
                        "description": "Provide exactly 4 answers for type 1. For type 4, provide an empty array."
                    },
                    "correctAnswers": {
                        "type": "array",
                        "items": { "type": "integer" },
                        "description": "Provide exactly one index for type 1. For type 4, provide an empty array."
                    },
                    "correctAnswer": {
                        "type": "string",
                        "enum": ["True", "False", ""],
                        "description": "Provide 'True' or 'False' for type 4. For type 1, provide an empty string."
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
