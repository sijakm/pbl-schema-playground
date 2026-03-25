window.practiceQuizPrompts = {
    sr: {
        PRACTICE_QUIZ_PROMPT: `
Vaš zadatak je da kreirate mešoviti set pitanja za vežbanje koji kombinuje format sa jednim tačnim odgovorom (single-choice) i tačno/netačno (true/false) formate kako biste sveobuhvatno procenili razumevanje učenika. Generisaćete ukupno {{$numberOfQuestions}} pitanja, sa balansiranim odnosom oba tipa. 
 
Naziv lekcije: {{$workItemTitle}} 
Sadržaj lekcije: {{$context}} 
Predmet: {{$subject}} 
Nivo/Razred: {{$gradeLevel}} 
 
Prilikom kreiranja ovih pitanja, obezbedite sledeće: 
 
- Kreirajte raznoliku mešavinu tipova pitanja koja testiraju različite nivoe razumevanja (prisećanje, primena, analiza). 
 
- Prilagodite težinu odgovarajućem nivou/razredu uz održavanje obrazovne vrednosti 
 
- Fokusirajte se na ključne koncepte i ciljeve učenja iz sadržaja lekcije 
 
- Izbegavajte previše složen ili dvosmislen jezik koji bi mogao da zbuni učenike 
 
- Osigurajte da su pitanja kulturološki osetljiva i inkluzivna 
 
Za pitanja sa jednim tačnim odgovorom (Single Choice): 
 
- Obezbedite jasna, nedvosmislena pitanja sa jednim tačnim odgovorom i tri uverljiva distraktora zasnovana na uobičajenim zabludama ili delimičnom razumevanju.  
 
- Osigurajte da su sve opcije relevantne za pitanje 
 
- Održavajte doslednu dužinu i strukturu u svim opcijama odgovora 
 
- Neka svako pitanje bude direktno povezano sa jednim konceptom ili veštinom 
 
- Pitanja i odgovori moraju biti na jeziku: {{$language}}. 
 
Za tačno/netačno (True/False) pitanja: 
 
- Pišite precizne izjave koje testiraju konceptualno razumevanje, zaključivanje, analizu i kritičko razmišljanje, a ne puko prisećanje činjenica. 
 
- Izbegavajte apsolutne termine poput "uvek" ili "nikada" osim ako to nije specifično opravdano 
 
- Uključite balansirane primere (mešavinu tačnih i netačnih izjava kroz set) 
 
- Osigurajte da su izjave jasne i nedvosmislene 
 
- Pitanja moraju biti na jeziku: {{$language}}, a odgovor mora biti True ili False. 
 
Opšte smernice: 
 
- Pitanja treba da se direktno odnose na sadržaj lekcije i ciljeve učenja 
 
- Koristite odgovarajuću terminologiju za predmet i uzrast 
 
- Osigurajte da se pitanja nadovezuju jedno na drugo po složenosti 
 
- Uključite mešavinu pitanja za prisećanje, primenu i analizu 
 
Nakon što generišete pitanja, dodajte obrazloženje (rationale) nakon svakog pitanja (bez prefiksa "Tačno" ili "Netačno", samo čisto objašnjenje) kako biste učvrstili učenje. 
 
Ako je dostavljeni kontekst nedovoljan za generisanje potpuno novih pitanja, koristite svoje znanje da kreirate nova, relevantna pitanja koja održavaju jasnu vezu sa originalnim sadržajem. 
Pitanja i odgovori treba da budu na jeziku: {{$language}}. 
Svako pitanje treba da bude jasno označeno kao single choice ili true/false.

Odgovor MORA biti JSON sa setom tačno-netačno ili pitanjima sa jednim tačnim odgovorom na osnovu {{$numberOfQuestions}}.
Ako je {{$numberOfQuestions}} parno, generišite tačno polovinu svakog tipa.
Ako je {{$numberOfQuestions}} neparno, generišite jedno manje ukupno (zaokružite naniže na najbliži paran broj) i podelite podjednako.

JSON Struktura:
Odgovor mora biti objekat sa nizom "questions".
Svaki objekat pitanja MORA imati SVA ova polja:
- "question": string
- "questionType": integer (1 za SingleChoice, 4 za TrueFalse)
- "questionHint": string (Nagoveštaj koji pomaže učeniku, ali bez otkrivanja rešenja)
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
                            "questionHint": {
                                "type": "string"
                            },
                            "rationale": {
                                "type": "string"
                            }
                        },
                        "required": ["question", "questionType", "answers", "correctAnswers", "correctAnswer", "questionHint", "rationale"],
                        "additionalProperties": false
                    }
                }
            },
            "required": ["questions"],
            "additionalProperties": false
        }
    },
    en: {
        PRACTICE_QUIZ_PROMPT: `
Your task is to create a mixed set of practice quiz questions that combine single-choice and true/false formats to comprehensively assess student understanding. You will generate {{$numberOfQuestions}} total questions, with a balanced mix of both types. 
 
Lesson name: {{$workItemTitle}} 
Lesson content: {{$context}} 
Subject: {{$subject}} 
Grade Level: {{$gradeLevel}} 
 
When crafting these questions, ensure to: 
 
- Create a diverse mix of question types that test different levels of understanding (recall, application, analysis). 
 
- Adjust difficulty appropriately for the grade level while maintaining educational value 
 
- Focus on core concepts and learning objectives from the lesson content 
 
- Avoid overly complex or ambiguous language that might confuse students 
 
- Ensure questions are culturally sensitive and inclusive 
 
For Single Choice Questions: 
 
- Provide clear, unambiguous questions with one correct answer and three plausible distractors based on common misconceptions or partial understanding.  
 
- Ensure all options are relevant to the question 
 
- Maintain consistent length and structure across answer options 
 
-Keep each question directly tied to one concept or skills 
 
-Questions and answers need to be in {{$language}} language 
 
For True/False Questions: 
 
- Write precise statements that test conceptual understanding, reasoning, analysis and critical thinking,  not rote recall. 
 
- Avoid absolute terms like "always" or "never" unless specifically warranted 
 
-Include balanced examples (mix of True and False across the set) 
 
- Ensure statements are clear and unambiguous 
 
-Questions need to be in {{$language}} language, and answer need to be True or False. 
 
General Guidelines: 
 
- Questions should directly relate to the lesson content and learning objectives 
 
- Use appropriate terminology for the subject and grade level 
 
- Ensure questions build upon each other in terms of complexity 
 
- Include a mix of recall, application, and analysis questions 
 
Once submitted, add student feedback or rationale after each question (no "Correct" or "Incorrect" prefix, just a clear explanation) to reinforce learning. 
 
If the provided context is insufficient for generating entirely new questions, use your knowledge to create novel, relevant questions that maintain a clear connection to the original content matter. 
Questions and answers should be in {{$language}} language. 
Each question should be clearly labeled as either single choice or true/false.

Response MUST be JSON with a set of true-false or single choice questions based on {{$numberOfQuestions}}.
If {{$numberOfQuestions}} is even, generate exactly half of each type.
If {{$numberOfQuestions}} is odd, generate one less in total (round down to nearest even) and split equally.

JSON Structure:
The response must be an object with a "questions" array.
Each question object MUST have ALL of these fields:
- "question": string
- "questionType": integer (1 for SingleChoice, 4 for TrueFalse)
- "questionHint": string (A hint that helps the student, but without giving the solution)
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
                            "questionHint": {
                                "type": "string"
                            },
                            "rationale": {
                                "type": "string"
                            }
                        },
                        "required": ["question", "questionType", "answers", "correctAnswers", "correctAnswer", "questionHint", "rationale"],
                        "additionalProperties": false
                    }
                }
            },
            "required": ["questions"],
            "additionalProperties": false
        }
    }
};
