window.hintsPrompts = {
    sr: {
        HINTS_PROMPT: `Vi ste obrazovni AI asistent. Vaš zadatak je da generišete tačno 3 nivoa nagoveštaja (Početni, Dopunski, Obrazovni) za SVAKO dostavljeno pitanje, koji pomažu učeniku da reši zadatak bez direktnog otkrivanja odgovora.

Nagoveštaji moraju pratiti pedagošku progresiju od šireg koncepta ka dubljem razumevanju logike pitanja.

Strogo se pridržavajte detaljnih uputstava i zahteva za dužinom teksta koji su definisani u JSON šemi.

Kontekst lekcije: {{$lesson_context}}
Naziv lekcije: {{$lesson_name}}
Opis lekcije: {{$lesson_description}}
Predmet: {{$subject}}
Nivo/Razred: {{$grade_level}}
Podaci o pitanju: {{$question_data}}
Jezik odgovora: {{$response_language}}`,
        HINTS_SCHEMA: {
            "title": "HintsResponse",
            "type": "object",
            "properties": {
                "hints": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "initial_hint": { 
                                "type": "string",
                                "description": "Nagoveštaj 1: Širi koncept (veoma opšti). Ne pominjati specifične delove odgovora, metode ili sisteme korišćene u pitanju. Fokusirati se isključivo na širu naučnu ili istorijsku temu."
                            },
                            "follow_up_hint": { 
                                "type": "string",
                                "description": "Nagoveštaj 2: Specifičniji trag koji dodaje jedan ključan detalj. Treba da suzi izbor, ali i dalje ostavi prostora za razmišljanje. Ne sme biti očigledan niti sadržati delove tačnog odgovora."
                            },
                            "reteach_hint": { 
                                "type": "string",
                                "minLength": 500,
                                "description": "Nagoveštaj 3: Vođeno razumevanje i obrazloženje logike. Ovaj deo MORA BITI VEOMA OPŠIRAN (MINIMUM 500 KARAKTERA). Treba detaljno da objasni kako učenik treba da razmišlja, koje korake u zaključivanju da preduzme i poveže pitanje sa širim kontekstom lekcije, a da pritom i dalje ne izgovori direktno tačan odgovor."
                            }
                        },
                        "required": ["initial_hint", "follow_up_hint", "reteach_hint"],
                        "additionalProperties": false
                    }
                }
            },
            "required": ["hints"],
            "additionalProperties": false
        },
        meta: {
            workItemTitle: "Tragovi džina: Asteroid koji je promenio Zemlju",
            subject: "Nauka / Istorija Zemlje",
            gradeLevel: "7-8. razred",
            lessonDescription: "Dokazi o prošlim udarima asteroida na površini Zemlje i njihove globalne posledice."
        },
        labels: {
            correctAnswer: "Tačan odgovor (za validaciju):"
        }
    },
    en: {
        HINTS_PROMPT: `You are an educational AI assistant. Your task is to generate exactly 3 tiered hints (Initial, Follow-up, Reteach) for EACH provided question, that help a student solve the question without directly revealing the answer.

The hints must follow a pedagogical progression from a broad concept to a deeper understanding of the question's logic.

Strictly adhere to the detailed instructions and character length requirements defined in the JSON schema.

Lesson Context: {{$lesson_context}}
Lesson Name: {{$lesson_name}}
Lesson Description: {{$lesson_description}}
Subject: {{$subject}}
Grade Level: {{$grade_level}}
Question Data: {{$question_data}}
Response Language: {{$response_language}}`,
        HINTS_SCHEMA: {
            "title": "HintsResponse",
            "type": "object",
            "properties": {
                "hints": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "initial_hint": { 
                                "type": "string",
                                "description": "Hint 1: Broad concept (very general). Do NOT include specific methods, objects, or systems used in the answer. Focus solely on the high-level scientific or historical topic."
                            },
                            "follow_up_hint": { 
                                "type": "string",
                                "description": "Hint 2: Narrower clue that adds one useful detail. Narrow the possibilities but still apply to multiple possible answers. Do not make it obvious or use parts of the correct answer."
                            },
                            "reteach_hint": { 
                                "type": "string",
                                "minLength": 500,
                                "description": "Hint 3: Guided understanding and logic explanation. This section MUST BE HIGHLY DETAILED AND COMPREHENSIVE (MINIMUM 500 CHARACTERS). It should explain the core reasoning, how to connect different pieces of evidence, and the logical steps the student should follow to arrive at the answer without stating it directly."
                            }
                        },
                        "required": ["initial_hint", "follow_up_hint", "reteach_hint"],
                        "additionalProperties": false
                    }
                }
            },
            "required": ["hints"],
            "additionalProperties": false
        },
        meta: {
            workItemTitle: "Traces of a Giant: The Asteroid That Changed Earth",
            subject: "Science / Earth History",
            gradeLevel: "Grade 7-8",
            lessonDescription: "Evidence of past asteroid impacts on Earth's surface and their global consequences."
        },
        labels: {
            correctAnswer: "Correct Answer (for validation):"
        }
    },
    lessonContext: {
        en: `Introduction
Imagine being a detective — but instead of solving a crime, you’re solving a mystery that happened 66 million years ago. That’s what scientists do when they study asteroid collisions. They can’t watch it happen, but they can look for clues left behind in rocks, fossils, and craters to tell the story of what happened long ago.
 
In this lesson, you’ll learn how scientists gather and interpret evidence from asteroid impacts to understand how these massive collisions reshaped life on Earth. You’ll study the signs of destruction — craters, debris, fossils — and learn how each one helps explain the chain of events that followed.
By the end of the lesson, you’ll think like a geologist and historian combined, connecting facts about space and Earth’s history to understand one of the most powerful natural events ever recorded. Ready to trace the evidence of the asteroid that changed everything? Let’s get started.
 
Key Vocabulary
Asteroid
Impact Crater
Extinction
Fossil Record
Shockwave
Debris Cloud
Chicxulub Crater
Mass Extinction
Climate Change (Post-Impact)
Evidence
 
🎯Student Learning Objectives
Identify types of scientific evidence that support past asteroid impacts (DOK 2).
Analyze how fossil and sediment layers reveal changes over time (DOK 3).
Interpret visual and textual data to form explanations about historical asteroid events (DOK 3).
 
📘Core Concepts
Uncovering Earth’s Impact Clues
 
When an asteroid strikes Earth, it doesn’t just leave a mark — it changes everything around it. The blast sends shockwaves through the ground, throws up debris into the air, and alters the planet’s climate. These effects leave behind clear evidence that scientists can study millions of years later.
The main types of evidence scientists look for are:
Impact Craters – These massive dents mark where the asteroid hit. Over time, some fill with water or sediment, hiding their shape from the surface.
Fossil Records – Layers of fossils show sudden disappearances of species, signaling extinction events.
Iridium Layers and Debris Clouds – After a collision, a thin layer of dust rich in iridium (a metal common in asteroids) settles across the globe.
Sediment Layers – Rock layers act like a timeline, helping scientists determine exactly when the impact occurred.
Key Takeaways:
Asteroid impacts leave behind long-lasting geological and biological clues.
Fosils and rock layers serve as Earth’s “memory” of ancient disasters.
Scientists use these clues to reconstruct what happened millions of years ago.
🤯 Did You Know? The iridium layer that marks the dinosaur extinction event can be found in rocks on every continent — even Antarctica!
🔎Reflect & Respond: Which piece of evidence — crater, fossils, or iridium — do you think provides the most convincing proof of a past asteroid collision? Why?
 
The Chicxulub Crater: A Giant’s Footprint
One of the most important discoveries in modern science is the Chicxulub Crater in Mexico. It’s buried deep underground and underwater, but its circular shape and composition match everything scientists expect from a major impact site.
About 66 million years ago, a massive asteroid — about 6 miles wide — struck Earth here. The energy it released was more powerful than billions of atomic bombs. The collision launched debris into the atmosphere, triggered earthquakes and tsunamis, and caused a global winter that blocked sunlight for months. The result? A mass extinction that wiped out 75% of life on Earth — including most dinosaurs.
🎥Watch Why the Dinosaurs Died
Key Takeaways:
The Chicxulub Crater provides strong evidence of the asteroid impact that ended the age of the dinosaurs.
The impact caused shockwaves, fires, and long-term climate change.
Scientists use the crater’s shape, mineral content, and fossil evidence nearby to confirm the event.
🤯 Did You Know? If the asteroid had landed in a different spot — like deep in the ocean — the global effects might have been less severe!
🔎Reflect & Respond: How do you think the planet’s ecosystems might have changed if the Chicxulub asteroid had hit a different part of the world?
 
Reading the Fossil Record
The fossil record is like a timeline of life on Earth. When scientists compare fossils from before and after the impact, they notice dramatic changes. In many layers, plant fossils vanish suddenly — showing that sunlight was blocked by the debris cloud. In ocean layers, small marine organisms disappear, suggesting that changes in temperature and chemistry made it hard to survive.
 
By piecing this together, scientists can link the fossil record to the asteroid impact, showing how one event caused long-lasting changes in life on Earth. These findings help scientists understand not just what happened to the dinosaurs, but how life evolves and adapts after catastrophe.
Key Takeaways:
The fossil record helps scientists understand how asteroid impacts changed ecosystems.
Mass extinctions show patterns of both destruction and recovery.
Studying past events helps predict how current climate changes might affect life today.
🤯 Did You Know? After the asteroid wiped out the dinosaurs, mammals began to evolve rapidly — eventually leading to humans!
🔎Reflect & Respond: Why do you think life on Earth was able to recover after such a massive extinction event?
 
🧠 What This Means
The evidence of past asteroid collisions reminds us that Earth is always changing — sometimes suddenly, sometimes over millions of years. These natural disasters have shaped the planet’s climate, landscapes, and the types of life that exist today.
By studying craters, fossils, and climate shifts, scientists aren’t just looking backward — they’re preparing for the future. Understanding these ancient events helps humanity protect Earth from possible future collisions and better handle environmental changes. Every layer of rock and every fossil is a page in Earth’s history book, waiting for curious minds to read it.`,
        sr: `Uvod
Zamisli da si detektiv — ali umesto rešavanja zločina, rešavaš misteriju koja se dogodila pre 66 miliona godina. To rade naučnici kada proučavaju sudare asteroida. Ne mogu da posmatraju kako se to dešava, ali mogu da traže tragove ostavljene u stenama, fosilima i kraterima kako bi ispričali priču o tome šta se dogodilo davno.

U ovoj lekciji naučićeš kako naučnici prikupljaju i interpretiraju dokaze o udarima asteroida da bi razumeli kako su ovi masivni sudari preoblikovali život na Zemlji. Proučavaćeš znakove uništenja — kratere, krhotine, fosile — i naučiti kako svaki od njih pomaže u objašnjavanju lanca događaja koji su usledili.
Do kraja lekcije razmišljaćeš kao geolog i istoričar zajedno, povezujući činjenice o svemiru i istoriji Zemlje kako bi razumeo jedan od najmoćnijih prirodnih događaja ikada zabeleženih. Spreman da pratiš dokaze o asteroidu koji je promenio sve? Hajde da počnemo.

Ključni rečnik
Asteroid
Udarni krater
Istrebljenje
Fosilni zapis
Udarni talas
Oblak krhotina
Krater Čiksulub
Masovno istrebljenje
Klimatske promene (nakon udara)
Dokaz

🎯Ciljevi učenja učenika
Identifikovati vrste naučnih dokaza koji podržavaju prošle udare asteroida (DOK 2).
Analizirati kako slojevi fosila i sedimenta otkrivaju promene tokom vremena (DOK 3).
Interpretirati vizuelne i tekstualne podatke radi formiranja objašnjenja o istorijskim događajima udara asteroida (DOK 3).

📘Osnovni koncepti
Otkrivanje tragova udara na Zemlji

Kada asteroid udari u Zemlju, on ne ostavi samo trag — on menja sve oko sebe. Eksplozija šalje udarne talase kroz tlo, izbacuje krhotine u vazduh i menja klimu planete. Ovi efekti ostavljaju jasne dokaze koje naučnici mogu proučavati milionima godina kasnije.
Glavne vrste dokaza koje naučnici traže su:
Udarni krateri – Ova masivna udupravljana označavaju mesto gde je asteroid udario. Vremenom se neki ispunjavaju vodom ili sedimentom, skrivajući svoj oblik od površine.
Fosilni zapisi – Slojevi fosila pokazuju iznenadni nestanak vrsta, signalizirajući događaje istrebljenja.
Slojevi iridijuma i oblaci krhotina – Nakon sudara, tanak sloj prašine bogat iridijumom (metal uobičajen u asteroidima) taloži se širom sveta.
Slojevi sedimenta – Slojevi stena deluju kao vremenska linija, pomažući naučnicima da odrede tačno kada se udar dogodio.
Ključni zaključci:
Udari asteroida ostavljaju dugotrajne geološke i biološke tragove.
Fosili i slojevi stena služe kao „pamćenje“ Zemlje o drevnim katastrofama.
Naučnici koriste ove tragove da rekonstruišu šta se dogodilo pre milionima godina.
🤯 Da li ste znali? Sloj iridijuma koji označava događaj istrebljenja dinosaurusa može se naći u stenama na svakom kontinentu — čak i na Antarktiku!
🔎Razmisli i odgovori: Koji dokaz — krater, fosili ili iridijum — po tvom mišljenju pruža najubedljiviji dokaz o prošlom sudaru asteroida? Zašto?

Krater Čiksulub: Otisak džina
Jedno od najvažnijih otkrića u modernoj nauci je krater Čiksulub u Meksiku. Sahranjen je duboko pod zemljom i vodom, ali se njegov kružni oblik i sastav poklapaju sa svime što naučnici očekuju od mesta velikog udara.
Pre oko 66 miliona godina, masivni asteroid — širok oko 10 kilometara — udario je u Zemlju ovde. Energija koju je oslobodio bila je moćnija od milijardi atomskih bombi. Sudar je lansirao krhotine u atmosferu, izazvao zemljotrese i cunamije i uzrokovao globalnu zimu koja je mesecima blokirala sunčevu svetlost. Rezultat? Masovno istrebljenje koje je zbrisalo 75% života na Zemlji — uključujući većinu dinosaurusa.
🎥Gledaj zašto su dinosaurusi izumrli
Ključni zaključci:
Krater Čiksulub pruža snažan dokaz o udaru asteroida koji je okončao doba dinosaurusa.\nUdar je izazvao udarne talase, požare i dugotrajne klimatske promene.
Naučnici koriste oblik kratera, sadržaj minerala i fosilne dokaze u blizini da bi potvrdili događaj.
🤯 Da li ste znali? Da je asteroid sleteo na drugo mesto — recimo duboko u okean — globalni efekti su mogli biti manje ozbiljni!
🔎Razmisli i odgovori: Kako misliš da bi se ekosistemi planete promenili da je asteroid Čiksulub udario u drugi deo sveta?

Čitanje fosilnog zapisa
Fosilni zapis je kao vremenska linija života na Zemlji. Kada naučnici uporede fosile od pre i posle udara, primećuju dramatične promene. U mnogim slojevima fosili biljaka iznenada nestaju — pokazujući da je sunčevu svetlost blokirao oblak krhotina. U okeanskim slojevima mali morski organizmi nestaju, što sugeriše da su promene u temperaturi i hemiji otežale preživljavanje.

Sklapajući ovo, naučnici mogu povezati fosilni zapis sa udarom asteroida, pokazujući kako je jedan događaj izazvao dugotrajne promene u životu na Zemlji. Ovi nalazi pomažu naučnicima da razumeju ne samo šta se dogodilo dinosaurusima, već i kako se život razvija i prilagođava nakon katastrofe.
Ključni zaključci:
Fosilni zapis pomaže naučnicima da razumeju kako su udari asteroida promenili ekosisteme.
Masovna istrebljenja pokazuju obrasce i uništenja i oporavka.
Proučavanje prošlih događaja pomaže u predviđanju kako bi trenutne klimatske promene mogle uticati na život danas.
🤯 Da li ste znali? Nakon što je asteroid zbrisao dinosauruse, sisari su počeli ubrzano da se razvijaju — što je na kraju dovelo do ljudi!
🔎Razmisli i odgovori: Zašto misliš da je život na Zemlji uspeo da se oporavi nakon tako masovnog događaja istrebljenja?

🧠 Šta ovo znači
Dokazi o prošlim sudarima asteroida podsećaju nas da se Zemlja uvek menja — nekada iznenada, nekada tokom miliona godina. Ove prirodne katastrofe su oblikovale klimu planete, pejzaže i vrste života koje danas postoje.
Proučavanjem kratera, fosila i klimatskih pomaka, naučnici ne gledaju samo unazad — oni se pripremaju za budućnost. Razumevanje ovih drevnih događaja pomaže čovečanstvu da zaštiti Zemlju od mogućih budućih sudara i bolje upravlja promenama u životnoj sredini. Svaki sloj stene i svaki fosil je stranica u istorijskoj knjizi Zemlje koja čeka radoznale umove da je pročitaju.`
    },
    sampleQuestions: {
        en: [
            {
                "question": "What direct evidence do scientists use to determine the exact timeline of an asteroid impact?",
                "questionType": 1,
                "answers": ["Impact craters", "Sediment layers", "Climate records", "Cave paintings"],
                "correctAnswers": [1],
                "correctAnswerText": "Sediment layers"
            },
            {
                "question": "What happened to the sunlight after the Chicxulub asteroid hit Earth?",
                "questionType": 1,
                "answers": ["It became much brighter", "It stayed the same", "It was blocked for months by a global debris cloud", "It turned red"],
                "correctAnswers": [2],
                "correctAnswerText": "It was blocked for months by a global debris cloud"
            },
            {
                "question": "True or False: The Chicxulub crater was easily found on the surface because of its perfect circular shape.",
                "questionType": 4,
                "answers": ["True", "False"],
                "correctAnswers": [1],
                "correctAnswerText": "False"
            },
            {
                "question": "Explain why plant fossils often disappear suddenly in the rock layers corresponding to the impact period.",
                "questionType": 0,
                "answers": [],
                "correctAnswers": [],
                "correctAnswerText": "The debris cloud blocked sunlight, preventing photosynthesis and killing many plants, which is then reflected in the fossil record."
            },
            {
                "question": "How did the asteroid impact indirectly benefit the evolution of mammals?",
                "questionType": 0,
                "answers": [],
                "correctAnswers": [],
                "correctAnswerText": "By eliminating the dominant dinosaurs, the impact cleared ecological niches, which allowed mammals to evolve rapidly and eventually lead to humans."
            }
        ],
        sr: [
            {
                "question": "Šta naučnici koriste kao preciznu 'vremensku liniju' da odrede kada se tačno dogodio udar asteroida?",
                "questionType": 1,
                "answers": ["Udarni krateri", "Slojevi sedimenta", "Klimatski zapisi", "Pećinski crteži"],
                "correctAnswers": [1],
                "correctAnswerText": "Slojevi sedimenta"
            },
            {
                "question": "Šta se dogodilo sa sunčevom svetlošću nakon udara asteroida Čiksulub?",
                "questionType": 1,
                "answers": ["Postala je mnogo svetlija", "Ostala je ista", "Bila je blokirana mesecima globalnim oblakom krhotina", "Postala je crvena"],
                "correctAnswers": [2],
                "correctAnswerText": "Bila je blokirana mesecima globalnim oblakom krhotina"
            },
            {
                "question": "Tačno ili netačno: Krater Čiksulub je lako pronađen na površini jer ima savršen kružni oblik.",
                "questionType": 4,
                "answers": ["Tačno", "Netačno"],
                "correctAnswers": [1],
                "correctAnswerText": "Netačno"
            },
            {
                "question": "Objasnite zašto fosili biljaka često naglo nestaju u slojevima stena koji odgovaraju periodu udara.",
                "questionType": 0,
                "answers": [],
                "correctAnswers": [],
                "correctAnswerText": "Oblak krhotina je blokirao sunčevu svetlost, onemogućavajući fotosintezu, što je dovelo do izumiranja mnogih biljaka, što se vidi u fosilnom zapisu."
            },
            {
                "question": "Kako je udar asteroida indirektno pogodovao evoluciji sisara?",
                "questionType": 0,
                "answers": [],
                "correctAnswers": [],
                "correctAnswerText": "Eliminacijom dominantnih dinosaurusa, udar je oslobodio ekološke niše, što je omogućilo sisarima da se ubrzano razvijaju i na kraju dovedu do ljudi."
            }
        ]
    }
};
