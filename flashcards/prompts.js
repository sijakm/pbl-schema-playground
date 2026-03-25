window.flashcardPrompts = {
    sr: {
        FLASHCARD_PROMPT: `
Vaš zadatak je da kreirate fleš kartice (flashcards) za učenike na osnovu specifičnih lekcija, prateći ova uputstva:

1. Prikupite ulazne parametre:
- Predmet: {{$subject}}
- Naziv lekcije: {{$workItemTitle}}
- Sadržaj lekcije: {{$context}}
- Nivo/Razred: {{$gradeLevel}}
- Broj fleš kartica: {{$numberOfFlashcards}}

2. Analizirajte sadržaj lekcije:
- Pažljivo pročitajte i analizirajte dostavljeni sadržaj lekcije.
- Identifikujte osnovne koncepte, termine rečnika i ideje koji su ključni za razumevanje lekcije.
- Osigurajte da su identifikovani koncepti prikladni za dati nivo/razred.
- Ovi osnovni koncepti i rečnik treba da vode kreiranje fleš kartica.

3. Generisanje fleš kartica:
- Kreirajte tačno {{$numberOfFlashcards}} fleš kartica na osnovu identifikovanih koncepata i rečnika.
- Svaka fleš kartica treba da ima prednju stranu (pitanje ili termin) i zadnju stranu (odgovor ili definicija).
- Osigurajte da je sadržaj kartica tačan, sažet, direktno relevantan za lekciju i generisan na jeziku: {{$language}}.
- Varirajte tipove pitanja ili upita na prednjoj strani kako biste podstakli različite vrste razmišljanja i prisećanja.
- Osigurajte da je korišćeni jezik prikladan za navedeni nivo/razred.
- Fleš kartice treba kolektivno da pokriju sve ključne koncepte, dajući prioritet najvažnijim.
- Osigurajte da su kartice kulturološki osetljive i inkluzivne.

4. Format izlaza:
- Struktuirajte svaku fleš karticu kao JSON objekat sa ključevima "front" i "back".
- Sav izlaz treba da bude jedan JSON objekat sa nizom pod ključem "flashcards".

VAŽNO: Nije potrebno dodatno objašnjenje, odgovor treba samo da sadrži generisane fleš kartice u navedenom JSON formatu. Osigurajte da je JSON čist, dobro struktuiran i da sadrži samo neophodne informacije, bez dodatnog formatiranja poput markdown-a ili navodnika.
Jezik fleš kartica treba da bude {{$language}}.

Primer:
{
  "flashcards": [
    {
      "front": "Koje vrste dokaza naučnici koriste za proučavanje prošlih udara asteroida?",
      "back": "Naučnici proučavaju udarne kratere, fosilne zapise, slojeve iridijuma i sedimentne slojeve kako bi razumeli prošle sudare asteroida."
    }
  ]
}
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
                            "front": { "type": "string", "description": "Front of the card (question/term)" },
                            "back": { "type": "string", "description": "Back of the card (answer/definition)" }
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

3. Generate Flashcards:
Create exactly {{$numberOfFlashcards}} flashcards based on the core concepts and vocabulary identified from the lesson content.
Each flashcard should have a front side (question or term) and a back side (answer or definition).
Ensure that the content of the flashcards is accurate, concise, directly relevant to the lesson and generated in {{$language}} language.
Vary the types of questions or prompts on the front side to encourage different types of thinking and recall
Make sure the language used is appropriate for the specified grade level.
Ensure that the flashcards collectively cover all the core concepts and vocabulary identified in step 2.
Ensure flash cards are culturally sensitive and inclusive

4. Format Output:
Structure each flashcard as a JSON object with "front" and "back" keys.
The entire output should be a single JSON object with a "flashcards" array.

IMPORTANT: No additional explanation is needed, response should just contain the generated flashcards in the specified JSON format. Ensure the JSON is clean, well-structured, and only contains necessary information, without additional formatting like markdown or quotes.
The language of the flashcards should be {{$language}}.

Example:
{
  "flashcards": [
    {
      "front": "What types of evidence do scientists use to study past asteroid impacts?",
      "back": "Scientists study impact craters, fossil records, iridium layers, debris clouds, and sediment layers to understand past asteroid collisions."
    }
  ]
}
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
                            "front": { "type": "string", "description": "Front side of the flashcard" },
                            "back": { "type": "string", "description": "Back side of the flashcard" }
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
