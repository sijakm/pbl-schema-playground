const PRACTICE_QUIZ_PROMPT_SR = `Vaš zadatak je da kreirate mešoviti set pitanja za vežbanje koristeći formate sa jednim tačnim odgovorom (single-choice) i tačno/netačno (true/false).

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

Sav sadržaj mora biti na jeziku: Srpski

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

Sav izlaz mora biti na jeziku: Srpski.

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
`;

const PRACTICE_QUIZ_SCHEMA_SR = {
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
};
