window.practiceQuizPrompts = {
    sr: {
        PRACTICE_QUIZ_PROMPT: `Vaš zadatak je da kreirate mešoviti set pitanja za vežbanje koristeći formate sa jednim tačnim odgovorom (single-choice) i tačno/netačno (true/false).

Generišite ukupno {{$numberOfQuestions}} pitanja sa balansiranim odnosom oba tipa.

Naziv lekcije: {{$workItemTitle}}

Sadržaj lekcije: {{$context}}

Predmet: {{$subject}}

Nivo/Razred: {{$gradeLevel}}

Opšta pravila:

Koristite jasan jezik prilagođen uzrastu

Fokusirajte se na ključne koncepte i ciljeve učenja

Uključite pitanja za prisećanje, primenu i zaključivanje

Izbegavajte dvosmislenost

Sav sadržaj mora biti na jeziku: {{$language}}

Pitanja sa višestrukim izborom (Multiple Choice):

Tačno 4 opcije odgovora

Samo 1 tačan odgovor

Svako pitanje testira jedan koncept

KRITIČNO: METODA GENERISANJA DISTRAKTORA (OBAVEZNO PRATITI)

Za SVAKO pitanje sa višestrukim izborom:

Prvo identifikujte tačan odgovor

Zatim generišite 3 netačna odgovora koristeći ovu strukturu:

Jedan odgovor koji je delimično tačan, ali nepotpun

Jedan odgovor koji je logički povezan, ali pogrešan u zaključivanju

Jedan odgovor koji je tačan po temi, ali pogrešan u uslovima (npr. postepeno nasuprot iznenadnom, dugoročno nasuprot kratkoročnom)

Sve opcije odgovora moraju:

Biti zasnovane na ISTOM konceptu i ISTOM tipu dokaza

Odgovarati na pitanje na isti način

Biti slične po dužini i strukturi

Biti naučno ili logički uverljive

Netačni odgovori moraju:

Biti nešto u šta bi učenik realno mogao da poveruje

Biti blizu tačnog odgovora, ali se razlikovati u jednoj ključnoj ideji

Zahtevati razmišljanje da bi se eliminisali

Netačni odgovori NE SMEJU:

Biti očigledno pogrešni

Biti nepovezani sa pitanjem

Biti iz druge teme

Biti nemogući za merenje ili saznanje

Uključivati ekstremne ili preuveličane tvrdnje

STROGA PROVERA (OBAVEZNO PRE IZLAZA)

Odbacite i ponovo napišite pitanje ako:

Bilo koji odgovor može biti eliminisan trenutno bez razmišljanja

Bilo koji odgovor pripada drugoj temi

Je tačan odgovor očigledno duži, jasniji ili detaljniji

Svi odgovori nisu konkurentne interpretacije ISTE ideje

Tačno/Netačno pitanja:

Testirajte zaključivanje i razumevanje (ne puko memorisanje)

Izbegavajte „uvek“ ili „nikada“ osim ako nije tačno

Uključite mešavinu tačnih i netačnih izjava

Izjave moraju biti jasne

Za sve tipove pitanja:

Obrazloženje / Povratna informacija za učenike:

Obezbedite povratnu informaciju nakon svakog pitanja kako biste učvrstili učenje

Objasnite zašto je tačan odgovor tačan

Adresirajte zašto su pogrešna uverenja netačna kada je to korisno

Sav izlaz mora biti na jeziku: {{$language}}.

Odgovor MORA biti JSON sa setom tačno-netačno ili pitanjima sa jednim tačnim odgovorom na osnovu {{$numberOfQuestions}}.

Ako je {{$numberOfQuestions}} parno, generišite tačno polovinu svakog tipa.

Ako je {{$numberOfQuestions}} neparno, generišite jedno manje ukupno (zaokružite naniže na najbliži paran broj) i podelite podjednako.

JSON Struktura:

Odgovor mora biti objekat sa nizom "questions".

Svaki objekat pitanja MORA imati SVA ova polja:

- "question": string

- "questionType": integer (1 za SingleChoice, 4 za TrueFalse)

- "rationale": string (Povratna informacija ili obrazloženje nakon pitanja)

- "answers": niz stringova

- "correctAnswers": niz celih brojeva

- "correctAnswer": string

Specifične vrednosti za svaki tip:

Za SingleChoice (questionType: 1):

- "answers": niz od tačno 4 stringa

- "correctAnswers": niz od tačno jednog celog broja (indeks tačnog odgovora)

- "correctAnswer": MORA biti "" (prazan string)

Za TrueFalse (questionType: 4):

- "answers": MORA biti [] (prazan niz)

- "correctAnswers": MORA biti [] (prazan niz)

- "correctAnswer": MORA biti "True" ili "False"
`,
        PRACTICE_QUIZ_SCHEMA: {
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
                                "description": "Obezbedite tačno 4 odgovora za tip 1. Za tip 4, obezbedite prazan niz."
                            },
                            "correctAnswers": {
                                "type": "array",
                                "items": { "type": "integer" },
                                "description": "Obezbedite tačno jedan indeks za tip 1. Za tip 4, obezbedite prazan niz."
                            },
                            "correctAnswer": {
                                "type": "string",
                                "enum": ["True", "False", ""],
                                "description": "Obezbedite 'True' ili 'False' za tip 4. Za tip 1, obezbedite prazan string."
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
        }
    },
    en: {
        PRACTICE_QUIZ_PROMPT: `Your task is to create a mixed set of practice quiz questions using single-choice and true/false formats.

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

All content must be in {{$language}}

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

All output must be in {{$language}}.

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
`,
        PRACTICE_QUIZ_SCHEMA: {
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
        }
    }
};
