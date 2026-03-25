window.flashcardPrompts = {
    sr: {
        FLASHCARD_PROMPT: `
Vaš zadatak je da kreirate kartice za učenje za učenike na osnovu specifičnih lekcija, prateći ova uputstva:

1. Prikupite ulazne parametre:
- Predmet: {{$subject}}
- Naziv lekcije: {{$workItemTitle}}
- Sadržaj lekcije: {{$context}}
- Nivo/Razred: {{$gradeLevel}}
- Broj kartica za učenje: {{$numberOfFlashcards}}

2. Analizirajte sadržaj lekcije:
- Pažljivo pročitajte i analizirajte dostavljeni sadržaj lekcije.
- Identifikujte osnovne koncepte, termine rečnika i ideje koji su ključni za razumevanje lekcije.
- Osigurajte da su identifikovani koncepti prikladni za dati nivo/razred.
- Ovi osnovni koncepti i rečnik treba da vode kreiranje kartica za učenje.

3. Generisanje kartica za učenje:
- Kreirajte tačno {{$numberOfFlashcards}} kartica za učenje na osnovu identifikovanih koncepata i rečnika.
- Svaka kartica za učenje treba da ima prednju stranu (pitanje ili termin) i zadnju stranu (odgovor ili definicija).
- Osigurajte da je sadržaj kartica tačan, sažet, direktno relevantan za lekciju i generisan na jeziku: {{$language}}.
- Varirajte tipove pitanja ili upita na prednjoj strani kako biste podstakli različite vrste razmišljanja i prisećanja.
- Osigurajte da je korišćeni jezik prikladan za navedeni nivo/razred.
- Kartice za učenje treba kolektivno da pokriju sve ključne koncepte, dajući prioritet najvažnijim ako je broj kartica ograničen.
- Osigurajte da su kartice kulturološki osetljive i inkluzivne.

4. Format izlaza:
- Struktuirajte svaku karticu za učenje kao JSON objekat sa ključevima "front" i "back".
- Sav izlaz mora biti jedan JSON objekat sa nizom pod ključem "flashcards", u skladu sa priloženom šemom.

VAŽNO: Nije potrebno dodatno objašnjenje, odgovor treba samo da sadrži generisane kartice za učenje u navedenom JSON formatu. Osigurajte da je JSON čist, dobro struktuiran i da sadrži samo neophodne informacije, bez dodatnog formatiranja poput markdown-a ili navodnika. Broj kartica za učenje mora odgovarati unetom parametru. Jezik kartica za učenje treba da bude {{$language}}.
`,
        FLASHCARD_SCHEMA: {
            "title": "FlashcardResponse",
            "type": "object",
            "properties": {
                "flashcards": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "front": { 
                                "type": "string", 
                                "description": "Prednja strana kartice za učenje koja sadrži upit, pitanje ili ključni termin dizajniran da podstakne prisećanje. Osigurajte da je jasno, specifično i prilagođeno uzrastu." 
                            },
                            "back": { 
                                "type": "string", 
                                "description": "Zadnja strana kartice za učenje koja sadrži tačan, sažet odgovor, definiciju ili objašnjenje koje odgovara prednjoj strani." 
                            }
                        },
                        "required": ["front", "back"],
                        "additionalProperties": false
                    }
                }
            },
            "required": ["flashcards"],
            "additionalProperties": false
        }
    },
    en: {
        FLASHCARD_PROMPT: `
Your task is to create flashcards for students based on specific lessons, following these instructions:

1. Collect Input Parameters:
Subject: {{$subject}}.
Lesson Name: {{$workItemTitle}}.
Lesson Content: {{$context}}.
Grade Level: {{$gradeLevel}}.
Number of Flashcards: {{$numberOfFlashcards}}.

2. Analyze Lesson Content:
Carefully read and analyze the provided lesson content.
Identify core concepts, vocabulary terms, and ideas that are crucial for understanding the lesson.
Ensure that the identified concepts are appropriate for the given grade level.

Note: These core concepts and vocabulary should be used to guide the creation of flashcards.

3. Generate Flashcards:
Create exactly {{$numberOfFlashcards}} flashcards based on the core concepts and vocabulary identified from the lesson content.
Each flashcard should have a front side (question or term) and a back side (answer or definition).
Ensure that the content of the flashcards is accurate, concise, directly relevant to the lesson and generated in {{$language}} language.
Vary the types of questions or prompts on the front side to encourage different types of thinking and recall.
Make sure the language used is appropriate for the specified grade level.
Ensure that the flashcards collectively cover all the core concepts and vocabulary identified in step 2, prioritizing the most important concepts if the number of flashcards is limited.
Ensure flash cards are culturally sensitive and inclusive.

4. Format Output:
Structure each flashcard as a JSON object with "front" and "back" keys.
The entire output must be a single JSON object with a "flashcards" array containing these objects, matching the provided schema.

IMPORTANT: No additional explanation is needed, response should just contain the generated flashcards in the specified JSON format. Ensure the JSON is clean, well-structured, and only contains necessary information, without additional formatting like markdown or quotes. The output should be a single JSON object with a "flashcards" array, with the number of flashcards matching the input parameter. The language of the flashcards should be {{$language}}.
`,
        FLASHCARD_SCHEMA: {
            "title": "FlashcardResponse",
            "type": "object",
            "properties": {
                "flashcards": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "front": { 
                                "type": "string", 
                                "description": "The front side of the flashcard containing a prompt, question, or key term designed to trigger recall. Ensure it is clear, specific, and appropriate for the grade level." 
                            },
                            "back": { 
                                "type": "string", 
                                "description": "The back side of the flashcard containing the accurate, concise answer, definition, or explanation that corresponds to the front side." 
                            }
                        },
                        "required": ["front", "back"],
                        "additionalProperties": false
                    }
                }
            },
            "required": ["flashcards"],
            "additionalProperties": false
        }
    }
};
