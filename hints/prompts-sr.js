const HINTS_PROMPT_SR = `Vi ste obrazovni AI asistent. Vaš zadatak je da generišete tačno 3 nivoa nagoveštaja (Početni, Dopunski, Obrazovni) za SVAKO dostavljeno pitanje, koji pomažu učeniku da reši zadatak bez direktnog otkrivanja odgovora.

Nagoveštaji moraju pratiti pedagošku progresiju od šireg koncepta ka dubljem razumevanju logike pitanja.

Strogo se pridržavajte detaljnih uputstava i zahteva za dužinom teksta koji su definisani u JSON šemi.

Kontekst lekcije: {{$lesson_context}}
Naziv lekcije: {{$lesson_name}}
Opis lekcije: {{$lesson_description}}
Predmet: {{$subject}}
Nivo/Razred: {{$grade_level}}
Podaci o pitanju: {{$question_data}}
Jezik odgovora: Srpski`;

const HINTS_SCHEMA_SR = {
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
};

const META_SR = {
    workItemTitle: "Tragovi džina: Asteroid koji je promenio Zemlju",
    subject: "Nauka / Istorija Zemlje",
    gradeLevel: "7-8. razred",
    lessonDescription: "Dokazi o prošlim udarima asteroida na površini Zemlje i njihove globalne posledice."
};

const LABELS_SR = {
    correctAnswer: "Tačan odgovor (za validaciju):"
};

const LESSON_CONTEXT_SR = `Uvod
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
Proučavanjem kratera, fosila i klimatskih pomaka, naučnici ne gledaju samo unazad — oni se pripremaju za budućnost. Razumevanje ovih drevnih događaja pomaže čovečanstvu da zaštiti Zemlju od mogućih budućih sudara i bolje upravlja promenama u životnoj sredini. Svaki sloj stene i svaki fosil je stranica u istorijskoj knjizi Zemlje koja čeka radoznale umove da je pročitaju.`;

const SAMPLE_QUESTIONS_SR = [
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
];
