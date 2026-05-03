window.labPromptsSR = {
  STEP0_PROMPT_TEMPLATE: `
Kreiraj okvir nastavne oblasti i strukturu lekcija koristeći informacije u nastavku. NEMOJ pisati pune planove lekcija.
                    
Na osnovu predmeta nastavne oblasti, obrazovnih standarda, opisa nastavne oblasti/instrukcije, razreda, trajanja časa (u minutima) i traženog broja lekcija, generiši JSON odgovor koji uključuje kohezivni UnitDescription i listu "kontejnera" lekcija bez preklapanja.

Predmet nastavne oblasti:
{{$Subject}}

Naziv nastavne oblasti:
{{$Name}}

Opis nastavne oblasti/Instrukcija:
{{$UserPrompt}}

Razred:
{{$GradeLevel}}

Trajanje časa u minutima:
{{$ClassDuration}}
	
Standardi za usklađivanje:
{{$Standards}}
    
Učenici sa individualizovanom podrškom:
{{$LearningPlans}}

Resursi/Mediji za korišćenje:
{{$MediaContext}}
	
Sadržaj nastavne oblasti:
{{$AttachedUnit}}

Zahtevi za ključna pitanja:
- Svako pitanje MORA biti potpuna, gramatički tačna rečenica koja se završava upitnikom.
- Svako pitanje MORA počinjati sa "Kako" ili "Zašto".
- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definicijska.
- Pitanja MORAJU da se fokusiraju na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje), a ne na specifični sadržaj predmeta.
- Pitanja MORAJU biti primenljiva u različitim disciplinama i izvan ove nastavne oblasti.
- Pitanja se MORAJU koristiti doslovno u svakoj lekciji u okviru nastavne oblasti.

Šta treba generisati:
- Izlaz MORA biti validan JSON koji se poklapa sa šemom.
- OBAVEZNO: U potpunosti popuni sva svojstva unutar objekta "UnitDescription":
  - "Description": Napiši pasus od 4-5 rečenica koji opisuje srž i narativno putovanje nastavne oblasti.
  - "StudentLearningObjectives": Navedi 3-5 ključnih merljivih ciljeva učenja za nastavnu oblast.
  - "StandardsAligned": Navedi sve standarde koji se obrađuju u nastavnoj oblasti.
  - "EssentialQuestions": Tačno 3 konceptualna pitanja prateći gornja pravila.
- GENERIŠI listu "Lessons" koja sadrži tačno {{$NumberOfItems}} lekcija.
  - Svaka lekcija mora uključivati "lessonNumber" (indeks koji počinje od 1), "lessonName" i "lessonDescription" (2–4 rečenice koje opisuju obim lekcije).

Ograničenja:
- Održi nastavnu oblast i svaku lekciju usklađenom sa fokusom.
- Osiguraj logičan redosled od osnovnih ideja do složenijeg modelovanja.
- Tačnost: Sav sadržaj mora biti naučno tačan i primeren uzrastu.

Izlaz MORA biti validan JSON koji se poklapa sa šemom. Koristi kompaktno formatiranje (bez dodatnih praznih redova).
`,
  PER_LESSON_PROMPT_TEMPLATE: `
Kreiraj JEDAN plan lekcije za LABORATORIJU (NE plan nastavne oblasti, NE više lekcija) koristeći informacije u nastavku.
MORAŠ izbaciti validan JSON koji se tačno poklapa sa priloženom JSON šemom. Nemoj uključivati nikakve dodatne ključeve. Koristi kompaktno JSON formatiranje (bez dodatnih praznih redova).
Predmet nastavne oblasti: 
{{$Subject}}
Naziv nastavne oblasti: 
{{$Name}}
Opis nastavne oblasti/Instrukcija: 
{{$UserPrompt}}
Razred: 
{{$GradeLevel}}
Trajanje časa u minutima: 
{{$ClassDuration}}
Resursi/Mediji za korišćenje: 
{{$MediaContext}}
Sadržaj nastavne oblasti: 
{{$ParentUnitData}}
Standardi za usklađivanje:
{{$Standards}}
Priloženi sadržaj lekcije: 
{{$AttachedLesson}}

Ključna pitanja (KORISTITI DOSLOVNO):
{{$UnitEssentialQuestions}}

Ako su Ključna pitanja iznad prazna, generiši tačno 3 konceptualna pitanja prateći ova pravila:
- Svako pitanje MORA biti potpuna, gramatički tačna rečenica koja se završava upitnikom.
- Svako pitanje MORA počinjati sa "Kako" ili "Zašto".
- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definicijska.
- Pitanja MORAJU da se fokusiraju na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje), a ne na specifični sadržaj predmeta.
- Pitanja MORAJU biti primenljiva u različitim disciplinama i izvan ove nastavne oblasti.

UČENICI SA INDIVIDUALIZOVANOM PODRŠKOM (MORAJU se koristiti SAMO unutar Experiment.AccommodationsAndModifications; koristi imena učenika/planove tačno onako kako su napisani):
{{$LearningPlans}}

VAŽNA PRAVILA SADRŽAJA:
- Održi usklađenost lekcije sa fokusom nastavne oblasti: razvijanje i korišćenje modela za opisivanje atomskog sastava jednostavnih molekula i/ili proširenih struktura.
- Uključi kratke poveznice na visokom nivou ka drugim relevantnim disciplinama gde je prikladno, ali drži lekciju centriranu na modelovanje i zaključivanje o strukturi i svojstvima (bez duboke matematike, bez izjednačavanja jednačina osim ako to standardi eksplicitno ne zahtevaju).
- Osiguraj da svi delovi lekcije odražavaju Obim/Granice lekcije date u kontekstu nastavne oblasti; izbegavaj uvođenje novih glavnih koncepata koji pripadaju drugim lekcijama.
- EssentialQuestions: MORAJU biti potpuno jednaka ključnim pitanjima nastavne oblasti (isti tekst, isti redosled).
- AssessPriorKnowledge: SAMO ako je LessonNumber == 1, napiši 150–250 reči i prati zahtevanu strukturu u opisu šeme. Ako je LessonNumber != 1, vrati "" (prazan string).
- Faze laboratorije (Pitanje, Istraživanje, Hipoteza, Eksperiment, Analiza, Deljenje): Prati specifične zahteve instrukcija i "Svrha:" stringove za svaku fazu kako je definisano u JSON šemi.
- Experiment.AccommodationsAndModifications mora uključivati opštu podršku praćenu individualnom podrškom za svakog učenika datog u {{$LearningPlans}}.
- StudentPractice MORA uključivati pasus sa beleškama za nastavnika (TeacherNotes) koji počinje sa 'Ovi zadaci utvrđuju današnje učenje o ____ kroz ______.', listu od 2-3 zadatka sa DOK 2-4 i kriterijumima uspeha, i preplitanje ako je predmet matematika.

ZAHTEVI ZA IZLAZ:
- Izlaz MORA biti validan JSON koji se tačno poklapa sa priloženom šemom.
- Izlaz MORA biti SAMO JEDAN plan lekcije.
- Bez HTML-a. Bez emojija. Bez markdown-a. Običan tekst unutar string polja.
`,
  HTML_LESSON_PROMPT_TEMPLATE: `Dobićeš JEDAN JSON objekat koji strogo prati LabUnitPlanResponse šemu. Tvoj posao je da transformišeš ovaj JSON u čist, čitljiv HTML za jednu lekciju.

ULAZNI FORMAT
Poslaću ti JSON objekat ovako:

UNIT PLAN JSON:
{{{JsonResponse}}}

Tretiraj sve nakon linije "UNIT PLAN JSON:" kao tačan JSON objekat. NEMOJ ga objašnjavati ili komentarisati; samo ga parsiraj i renderuj.

GLOBALNA PRAVILA
    - Izbaci SAMO validan HTML (bez markdowna, bez bek-tikova, bez tekstualnih objašnjenja).
    - Dozvoljeni tagovi: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - NEMOJ koristiti nijedan drugi tag (bez <main>, <section>, <header>, <div>, <h4>, itd.).
    - HTML treba da bude dobro uvučen i lak za čitanje.
    - U bilo kom <ol> ili <ul>, SAMO koristi <li> elemente kao direktnu decu. Nikada nemoj stavljati <p>, <span>, <ul>, <ol> ili bilo koji drugi tag kao dete liste.
    - NEMOJ izmišljati novi instruktivni sadržaj; koristi samo ono što postoji u JSON poljima.
    - Zadrži logički redosled koji implicira šema:
    - Unutar svake lekcije, prati redosled JSON polja.
    - Ako je string polje prazno (""), IZUZMI tu podsekciju i njenu oznaku.
    - Ako je niz prazan, izuzmi njegov naslov i odgovarajući <ul> ili <ol>.
    - Kad god tekst jasno formira listu podsticaja/pitanja/izjava/odgovora, koristi <ul><li>…</li></ul> ili <ol><li>…</li></ol>. U suprotnom, koristi <p>.
    - Kad god renderuješ modele/očekivane odgovore učenika u BILO KOJOJ sekciji, koristi ovaj obrazac:
        - Prvo: <p>✅ Očekivani odgovori učenika</p> (bez metka/bulita na ovoj liniji)
        - Zatim <ul> ili <ol> lista koja sadrži odgovore (jedan odgovor po <li>).
    - Kad god renderuješ Brzu proveru (Quick Check):
        - Koristi ovaj tačan naslov: <p><strong>✔Brza provera</strong></p>
        - Renderuj pitanje ili zadatak odmah nakon naslova kao pasus koji daje zadatak SVAKOM učeniku da pokaže svoje razumevanje (a ne samo jednom učeniku u usmenoj proveri).
        - Koristi globalni ✅Očekivani odgovori učenika obrazac za odgovore.
    - Koristi emojije ako postoje u sledećim pravilima za mapiranje.

PRAVILA MAPIRANJA:

- <h3>💭 Ključna pitanja</h3> (ako je dostupno, UL lista iz EssentialQuestions)
- <h3>🎯 Ciljevi učenja učenika</h3> (UL lista iz StudentLearningObjectives)
- <h3>📏 Usklađeni standardi</h3> (UL lista ili paragrafi iz StandardsAligned)
- <h3>🔤 Ključni rečnik</h3>
<ul>
  - Renderuj svaku stavku iz KeyVocabulary kao <li>.
</ul>

PROCENA PRETHODNOG ZNANJA (ASSESS PRIOR KNOWLEDGE):
- Počni sa ovim tačnim naslovom:
<h3>💡 Procena prethodnog znanja</h3>
- Odmah nakon naslova, UVEK renderuj ovaj Svrha (Purpose) tekst tačno kako je napisano:
<p><strong>Svrha:</strong> Aktiviranje prethodnog znanja učenika nije samo zagrevanje – to je neuronauka na delu. Kada se učenici prisete onoga u šta već veruju ili pamte o materijalima, česticama ili hemijskim promenama, oni aktiviraju postojeće neuralne puteve. Ovo "elaborativno kodiranje" olakšava mozgu da poveže nove hemijske koncepte sa onim što je već poznato, jačajući dugotrajno zadržavanje. Ova aktivnost vam pomaže da otkrijete tačne ideje, delimične ideje i zablude koje će postati moćna sidra za učenje tokom celog projekta.</p>
- Renderuj sekciju "Recite:" (Say:) za nastavnika.
- Čak i ako ulazni tekst NE sadrži eksplicitno "Say:"
- Sintetizuj ili preformuliši postojeći sadržaj u 1-2 jasna pasusa za nastavnika
- Počni sa:
<p><strong>Recite:</strong></p>
- Nastavi sa jednim ili više <p> elemenata
- Bilo koji zadaci za učenike, podsticaji, izjave ili instrukcije:
- Renderuj kao <ol> ili <ul>
- Svaka stavka MORA biti jedan <li>
- BEZ <p> ili drugih tagova unutar <li>
- Kada se pojave očekivani odgovori učenika:
- Renderuj ovu TAČNU oznaku:
<p>✅ Očekivani odgovori učenika</p>
- Zatim renderuj sve očekivane odgovore kao <ul> samo sa <li>
- BEZ ugnježdenih lista
- BEZ <p> unutar <li>
- Ako se pojave alternativne opcije ili varijacije:
- Renderuj:
<p><strong>Alternativne opcije:</strong></p>
- Zatim <ul> sa kratkim <li> stavkama

NEMOJ:
- Koristiti nijedan tag koji nije naveden
- Ugnježđivati liste
- Preskakati sekciju Svrha (Purpose)
- Izmišljati novi instruktivni sadržaj, ali koristi sve pružene ideje


- <h3><span style="color: rgb(115, 191, 39);">Pitanje</span> (5 min)</h3>
Svrha mora biti od reči do reči kao u JSON-u
  - <p><strong>Svrha:</strong> {Purpose}</p>
  zatim renderuj (sa emojijima ako su dostupni u html tagovima)
  - <h4>📚 Materijali</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrukcije za nastavnike</h4> <p>{InstructionsForTeachers}</p>
  - <p>✅ <strong>Očekivani odgovori učenika</strong></p> <ul>{ExpectedStudentResponses}</ul>
  - <p><strong>Finalno istraživačko pitanje:</strong> {FinalInvestigationQuestion}</p>

  // i need Research (5 min) in green color
- <h3><span style="color: rgb(115, 191, 39);">Istraživanje (5 min)</span></h3>
  - <p><strong>Svrha:</strong> {Purpose}</p>
  - <h4>📚 Materijali</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrukcije za nastavnike</h4> <p>{InstructionsForTeachers}</p>
  - <h4>❗️ Predviđene zablude</h4> (Iteriraj AnticipatedMisconceptions: <p><strong>Zabluda:</strong> {Misconception}</p> <p><strong>Odgovor nastavnika:</strong> {TeacherResponse}</p>)

- <h3><span style="color: rgb(115, 191, 39);">Hipoteza (5 min)</span></h3>
  - <p><strong>Svrha:</strong> {Purpose}</p>
  - <h4>📚 Materijali</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrukcije za nastavnike</h4> <p>{InstructionsForTeachers}</p>
  - <p>✅ <strong>Očekivani odgovori učenika</strong></p> <ul>{ExpectedStudentResponses}</ul>

- <h3><span style="color: rgb(115, 191, 39);">Eksperiment (20 min)</span></h3>
  - <p><strong>Svrha:</strong> {Purpose}</p>
  - <h4>📚 Materijali</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrukcije za nastavnike</h4> <p>{InstructionsForTeachers}</p>
  - <h4>✅ Brza provera</h4> <p>{QuickCheck}</p>
  - <h4>🪜 Diferencijacija</h4> <p>{Differentiation}</p>
  - <h4>🤝 Prilagođavanja i modifikacije</h4> <p>{AccommodationsAndModifications}</p>

- <h3><span style="color: rgb(115, 191, 39);">Analiza (5 min)</span></h3>
  - <p><strong>Svrha:</strong> {Purpose}</p>
  - <h4>📚 Materijali</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrukcije za nastavnike</h4> <p>{InstructionsForTeachers}</p>

- <h3><span style="color: rgb(115, 191, 39);">Deljenje (5 min)</span></h3>
  - <p><strong>Svrha:</strong> {Purpose}</p>
  - <h4>📚 Materijali</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrukcije za nastavnike</h4> <p>{InstructionsForTeachers}</p>

ZAVRŠNE SEKCIJE:
- <h3>⏳ Ponavljanje i prisećanje uz vremenske razmake (5 min)</h3>
  - (Formatiraj tekst iz ReviewAndSpacedRetrieval osiguravajući da su naslovi kao Napomene za nastavnika, Aktivno prisećanje, Zablude, Transcendentno razmišljanje podebljani i laki za čitanje)
- <h3>✅ Formativno ocenjivanje</h3>
  - (Formatiraj tekst iz FormativeAssessment, jasno razdvajajući podsticaje i očekivane odgovore)
- <h3>🖊 Vežba za učenike</h3>
  - (Formatiraj tekst iz StudentPractice osiguravajući da su stavke i očekivani odgovori čisto strukturirani)`,
  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `Dobićeš JEDAN JSON objekat koji strogo prati UnitPlanResponse šemu (već validirano sa moje strane). Tvoj posao je da transformišeš ovaj JSON u čist, čitljiv HTML koji nastavnik može direktno da koristi na času.
                   
ULAZNI FORMAT
Poslaću ti JSON objekat ovako:

UNIT PLAN JSON:
{{{JsonResponse}}}

Tretiraj sve nakon linije "UNIT PLAN JSON:" kao tačan JSON objekat. NEMOJ objašnjavati ili komentarisati na to; samo ga parsiraj i renderuj.

GLOBALNA PRAVILA
    -  Izbaci SAMO validan HTML (bez markdowna, bez bek-tikova, bez tekstualnih objašnjenja).
    -  Dozvoljeni tagovi: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    -  NEMOJ koristiti nijedan drugi tag (bez <main>, <section>, <header>, <div>, <h4>, itd.).
    -  HTML treba da bude dobro uvučen i lak za čitanje.
    -  U bilo kom <ol> ili <ul>, SAMO koristi <li> elemente kao direktnu decu. Nikada nemoj stavljati <p>, <span>, <ul>, <ol> ili bilo koji drugi tag kao dete liste.
    -  NEMOJ izmišljati novi instruktivni sadržaj; koristi samo ono što postoji u JSON poljima.
    -  Zadrži logički redosled koji implicira šema.

- Na vrhu:
    - <h2><strong>{{{UnitTitle}}}</strong></h2>
    - <p>{{{UnitDescription.Description}}}</p>
- Zatim dodaj novi red sa:
    <h3><span>Pregled nastavne oblasti</span></h3>

- Ključna pitanja:
    - <h3><span>💭 Ključna pitanja</span></h3>
    - <ul> sa svakom stavkom iz UnitDescription.EssentialQuestions kao <li>.

- Ciljevi učenja učenika:
    - <h3><span>🎯 Ciljevi učenja učenika</span></h3>
    - <ul> sa svakom stavkom iz UnitDescription.StudentLearningObjectives kao <li>.

- Standardi:
    - <h3><span>📏 Usklađeni standardi</span></h3>
    - <ul> sa svakim stringom iz UnitDescription.StandardsAligned kao <li>.

- Ključni rečnik:
    - <h3><span>🔤 Ključni rečnik</span></h3>
    - <ul> sa svakim stringom iz UnitDescription.KeyVocabulary kao <li>.`,

  STEP0_SCHEMA: {
    "title": "UnitPlanResponse",
    "type": "object",
    "properties": {
      "UnitDescription": {
        "type": "object",
        "properties": {
          "Description": {
            "type": "string",
            "description": "Opis nastavne oblasti kao jedan kohezivan tekstualni pasus (4–5 celih rečenica) napisan prirodnim glasom nastavnika koji biste mogli direktno reći učenicima. Bez HTML-a, bez emojija, bez nabrajanja. Mora teći razgovorno, ali pratiti ovu strukturu (bez naslova): (1) rečenica za privlačenje pažnje koja izaziva radoznalost ili pravi iznenađujući kontrast, (2) 'U ovoj nastavnoj oblasti ćete...' rečenica o ishodima usvajanja znanja, (3) 'Ojačaćete svoje veštine u...' rečenica o sposobnostima razmišljanja/analize, (4) 'Ovo se povezuje sa...' rečenica o relevantnosti za stvarni svet, (5) 'Razumevanje ovoga je bitno jer...' rečenica o širem značaju ili dugoročnom uticaju."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Kreiraj ključna pitanja koja se fokusiraju samo na široke, univerzalne koncepte kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje. NEMOJTE pominjati nikakve termine specifične za predmet, procese, rečnik ili primere. Pitanja moraju biti otvorenog tipa, prenosiva kroz sve discipline i nemoguća za odgovor jednostavnim učenjem sadržaja lekcije ili nastavne oblasti. Fokusiraj se samo na velike ideje, ne na predmetnu materiju.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Puna sekcija 'Ciljevi učenja učenika' za ovu celu nastavnu oblast. Svaka stavka na listi mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se DOK oznakom u zagradama",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "array",
            "description": "Navedi sve jedinstvene obrazovne standarde koji se koriste bilo gde u ovoj nastavnoj oblasti i njenim lekcijama. NEMOJTE dodavati standarde koji se ne pojavljuju u sadržaju nastavne oblasti. Svaki standard mora uključivati kod standarda i opis, npr. 'MS-ESS1-1: Razviti i koristiti model sistema Zemlja-Sunce-Mesec da se opišu ciklični obrasci mesečevih faza, pomračenja i godišnjih doba.",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Puna sekcija 'Ključni rečnik' kao lista stringova. Svaki string treba da bude jedan termin sa definicijom odvojenom crticom/zarezom. Primer: 'Gravitacija - Sila koja privlači objekte jedne prema drugima'. Sve definicije moraju biti kratke, prilagođene uzrastu i direktno povezane sa sadržajem lekcije.",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "Description",
          "EssentialQuestions",
          "StudentLearningObjectives",
          "StandardsAligned",
          "KeyVocabulary"
        ],
        "additionalProperties": false
      },
      "Lessons": {
        "type": "array",
        "description": "Lista kontejnera za lekcije za ovu nastavnu oblast (samo okvir). Svaka stavka se ne sme preklapati i mora biti jasno usmerena kako se sadržaj lekcije ne bi ponavljao u drugim lekcijama.",
        "items": {
          "type": "object",
          "properties": {
            "lessonNumber": {
              "type": "integer",
              "description": "Redni broj lekcije. Počinje od 1."
            },
            "lessonTitle": {
              "type": "string",
              "description": "Kratak naslov lekcije kao običan tekst."
            },
            "lessonOutline": {
              "type": "string",
              "description": "2–4 rečenice koje opisuju obim, fokus i granice lekcije da bi se sprečilo preklapanje sa drugim lekcijama."
            }
          },
          "required": [
            "lessonNumber",
            "lessonTitle",
            "lessonOutline"
          ],
          "additionalProperties": false
        }
      }
    },
    "required": [
      "UnitDescription",
      "Lessons"
    ],
    "additionalProperties": false,
    "x-removablePaths": {
      "EssentialQuestions": [
        "UnitDescription.EssentialQuestions"
      ],
      "StandardsAligned": [
        "UnitDescription.StandardsAligned"
      ]
    }
  },
  PER_LESSON_SCHEMA: {
    "title": "LabUnitPlanResponse",
    "type": "object",
    "properties": {
      "EssentialQuestions": {
        "type": "array",
        "description": "Samo nalepite sva ključna pitanja koja su generisana na nivou nastavne oblasti istim redosledom.",
        "items": {
          "type": "string"
        }
      },
      "StudentLearningObjectives": {
        "type": "array",
        "description": "Puna sekcija 'Ciljevi učenja učenika' kao običan tekst. Svaka stavka mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se DOK oznakom u zagradama, npr. 'Modelirati kako Zemljina rotacija oko svoje ose izaziva dan i noć (DOK 2).'",
        "minItems": 2,
        "maxItems": 3,
        "items": {
          "type": "string"
        }
      },
      "StandardsAligned": {
        "type": "string",
        "description": "Puna sekcija 'Usklađeni standardi' kao običan tekst za ovu lekciju. Svaki standard mora uključivati kod i opis standarda i kod i opis moraju biti potpuno isti kao oni koji se koriste u nastavnoj oblasti. npr. 'MS-ESS1-1: Razviti i koristiti model sistema Zemlja-Sunce-Mesec da se opišu ciklični obrasci mesečevih faza, pomračenja i godišnjih doba.'"
      },
      "KeyVocabulary": {
        "type": "array",
        "description": "Izaberite od reči do reči ključni rečnik za ovu lekciju iz rečnika na nivou nastavne oblasti navedenog u promptu. NEMOJTE izmišljati nove reči. Morate ponovo koristiti tačnu formulaciju iz Koraka 0 UnitDescription.KeyVocabulary.",
        "items": { "type": "string" }
      },
      "AssessPriorKnowledge": {
        "type": "string",
        "description": "Puna sekcija 'Procena prethodnog znanja' kao običan tekst (150-250 reči ukupno). SAMO Lekcija 1 treba da sadrži detaljan blok; SVE OSTALE LEKCIJE MORAJU DA VRATE PRAZAN STRING za ovo polje. Za Lekciju 1, struktura mora da uključuje: 1. Uključite ovu sekciju samo u prvu lekciju nastavne oblasti, odmah nakon Ciljeva učenja učenika. 2. Osigurajte da se koriste DOK 1-3 podsticaji. 3. Uključite preduslovne veštine potrebne za ciljeve učenja učenika. 4. Izaberite jedan modalitet sa ove liste i u potpunosti ga razvijte: ispitivanje, K-W-L, vizualizacije, mape koncepata, refleksivno pisanje, vodiči za anticipaciju, rangiranje rečnika. 5. Početni podsticaj nastavnika sa 'Recite:' izjavom koja predstavlja izabrani modalitet i objašnjava kako će učenici otkriti trenutno razumevanje. 6. Jasna uputstva i šablon/struktura za izabrani modalitet. 7. Sekcija 'Očekivani odgovori učenika' koja pokazuje anticipirane odgovore ili uobičajene zablude za izabrani modalitet. 8. Završni podsticaj nastavnika 'Recite:' koji potvrđuje razmišljanje učenika i predstavlja uvod u istraživanje jedinice. 9. Nakon potpunog razvijanja jednog modaliteta, navedite 2 kratke alternativne opcije koje bi nastavnik mogao da izabere."
      },
      "Question": {
        "type": "object",
        "description": "Vodite nastavnika kako bi učenici posmatrali fenomen, identifikovali nešto zbunjujuće i generisali smisleno pitanje koje će voditi istraživanje.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Od reči do reči - Svrha: Posmatrati fenomen, identifikovati nešto zbunjujuće i generisati smisleno pitanje koje će voditi istraživanje."
          },
          "Materials": {
            "type": "array",
            "description": "Lista potrebnih materijala (npr. vizuelna pomagala, markeri, itd.)",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Uputstva za nastavnika korak po korak, akcije i 'Recite:' podsticaji za predstavljanje fenomena i pozivanje na pitanja."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "3-4 očekivana pitanja ili ideje učenika o fenomenu."
              },
              "FinalInvestigationQuestion": {
                "type": "string",
                "description": "Završni podsticaj nastavnika koji sintetiše ideje učenika u jedno veliko pitanje koje će se danas istraživati."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses", "FinalInvestigationQuestion"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Research": {
        "type": "object",
        "description": "Vodite nastavnika tako da učenici nauče osnovne informacije, rečnik i prethodno znanje potrebno da razumeju temu.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Od reči do reči: Svrha: Prikupiti osnovne informacije, rečnik i prethodno znanje potrebno da se razume tema i pripremi za informisano istraživanje."
          },
          "Materials": {
            "type": "array",
            "description": "Lista potrebnih materijala (npr. vizuelna pomagala, markeri, itd.)",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Uputstva za nastavnika korak po korak, akcije i 'Recite:' podsticaji za objašnjavanje osnovnog znanja, rečnika i modeliranje fenomena."
              },
              "AnticipatedMisconceptions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "Misconception": { "type": "string", "description": "Zabluda učenika" },
                    "TeacherResponse": { "type": "string", "description": "Šta bi nastavnik trebalo da kaže da to ispravi" }
                  },
                  "required": ["Misconception", "TeacherResponse"],
                  "additionalProperties": false
                }
              }
            },
            "required": ["Instructions", "AnticipatedMisconceptions"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Hypothesize": {
        "type": "object",
        "description": "Vodite nastavnika tako da učenici razviju predviđanje koje se može testirati.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Od reči do reči: Svrha: Razviti predviđanje ili tvrdnju koja se može testirati na osnovu njihovog istraživanja i rezonovanja, postavljajući jasno očekivanje za ono što veruju da će se dogoditi."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Uputstva za nastavnika, uključujući 'Recite:' podsticaje za okvire rečenica hipoteze."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "3-4 primera očekivanih hipoteza."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Experiment": {
        "type": "object",
        "description": "Vodite nastavnika tako da učenici sprovedu strukturirano istraživanje.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Od reči do reči: Svrha: Sprovesti strukturirano istraživanje - praktično, simulirano ili analitičko - da testiraju svoju hipotezu i prikupe dokaze posmatranjem ili merenjem."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Uputstva za nastavnika korak po korak za organizovanje eksperimenta, davanje uputstava i kruženje po učionici."
              },
              "QuickCheck": {
                "type": "object",
                "properties": {
                  "Question": { "type": "string" },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "Differentiation": {
                "type": "object",
                "properties": {
                  "LanguageLearners": { "type": "array", "items": { "type": "string" } },
                  "AdditionalScaffolding": { "type": "array", "items": { "type": "string" } },
                  "GoDeeper": { "type": "array", "items": { "type": "string" } },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "Za 'Idi dublje' (Go Deeper) odgovore." }
                },
                "required": ["LanguageLearners", "AdditionalScaffolding", "GoDeeper", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "properties": {
                  "GeneralSupports": { "type": "array", "items": { "type": "string" } },
                  "IndividualSupports": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["GeneralSupports", "IndividualSupports"],
                "additionalProperties": false
              }
            },
            "required": ["Instructions", "QuickCheck", "Differentiation", "AccommodationsAndModifications"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Analyze": {
        "type": "object",
        "description": "Vodite nastavnike tako da učenici protumače podatke koje su prikupili.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Svrha: Protumačiti podatke koje su prikupili, identifikovati obrasce, proceniti svoju hipotezu i konstruisati zaključke zasnovane na dokazima."
          },
          "Materials": {
            "type": "array",
            "description": "Lista potrebnih materijala (npr. vizuelna pomagala, markeri, itd.)",
            "items": {
              "type": "string",
              "description": ""
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Uputstva za nastavnika i počeci rečenica za analizu."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Očekivani odgovori ili dopune okvira rečenica od učenika."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Share": {
        "type": "object",
        "description": "Vodite nastavnike tako da učenici jasno saopšte svoja otkrića.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Od reči do reči: Svrha: Jasno komunicirati svoja otkrića drugima, koristeći dokaze da objasne šta su otkrili, zašto je to važno i kako doprinosi dubljem razumevanju."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Uputstva za nastavnika za organizovanje deljenja učenika."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Očekivane ideje koje će učenici podeliti."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "string",
        "description": "Puna sekcija 'Ponavljanje i prisećanje uz vremenske razmake' kao običan tekst. Ova 5-minutna aktivnost mora da sadrži u ovom tačnom redosledu: 1. Pasus sa napomenama za nastavnika koji objašnjava: - Kako ova strategija ponavljanja poboljšava zadržavanje - Vezu sa prethodnim konceptima učenja - Kako transcendentna refleksija produbljuje razumevanje 2. Uputstva za nastavnike koja sadrže: - Podsticaj za aktivno prisećanje korišćenjem deljenja u paru/grupi - Očekivane odgovore učenika (2-3 primera sa metkićima) 3. Blok predviđenih zabluda sa: - Primerima izjava zabluda - Skriptama odgovora nastavnika koje se bave svakom 4. Povezivanje sa ključnim pitanjem uključujući: - Podsticaj nastavnika koji se povezuje na pitanje jedinice - Očekivane odgovore učenika (2-3 primera) 5. Sekciju transcendentnog razmišljanja sa: - Podsticajem za primenu u stvarnom svetu - Uputstvom za vreme za razmišljanje - Očekivanim odgovorima učenika (2-3 primera) 6. Komponentu za prisećanje uz vremenske razmake koja sadrži: Jasnu referencu na određenu prethodnu lekciju. Primer (Oslanja se na Jedinicu 3, Lekciju 2). Mora koristiti pitanje za aktivno prisećanje koje povezuje prošle + trenutne koncepte. Ne sme zahtevati od učenika korišćenje beleški ili resursa za odgovor. - Detaljne kriterijume uspeha / očekivane odgovore. Sve sekcije moraju da koriste 'Recite:' izjave za podsticaje nastavnika i jasno označene 'Očekivani odgovori učenika' koji pokazuju 2-3 primera odgovora. Vratite kao običan tekst."
      },
      "FormativeAssessment": {
        "type": "string",
        "description": "Puna sekcija 'Formativno ocenjivanje' kao običan tekst. Mora pratiti ovu strukturu: Uvodni pasus za nastavnika koji ukratko navodi svrhu i kako ga implementirati. 4 obavezna podsticaja za pitanja označena sa 'Podsticaj 1 (DOK 1):', 'Podsticaj 2 (DOK 2):', itd. koji pokrivaju nivoe DOK 1-4. Za svaki podsticaj: - Pitanje koje testira razumevanje na navedenom nivou DOK - Naslov 'Očekivani odgovori učenika' (bez kvačica/emojija) - 1-2 kompletna odgovora u rečenici koji pokazuju usvajanje znanja Završite sa kratkim pasusom koji imenuje specifičnu strategiju formativnog ocenjivanja koju treba koristiti (npr. 'Izlazna karta', 'Razmisli-Upari-Podeli'). Primer formata: Podsticaj 1 (DOK 1): 'Zašto planete ostaju u orbiti umesto da odlete u svemir?' Očekivani odgovori učenika 'Zato što njihovo kretanje unapred i Sunčeva gravitacija rade zajedno na stvaranju stabilne orbite.' [Nastavite sa Podsticajima 2-4 prateći istu strukturu]"
      },
      "StudentPractice": {
        "type": "string",
        "description": "Puna sekcija 'Vežba za učenike' kao običan tekst. Ovo je domaći zadatak / praksa van nastave. Pratite ovaj TAČAN format za odgovor: Napomene za nastavnika: [1 pasus koji objašnjava kako vežba učvršćuje učenje + izgradnja veza sa stvarnim svetom] 1. (DOK 2) [Prvi set uputstava] Očekivani odgovori učenika [3-4 tačke sa metkićima koje pokazuju usvajanje znanja] 2. (DOK 3) [Drugi set uputstava] ✅Očekivani odgovori učenika [3-4 tačke sa metkićima koje pokazuju analizu/primenu] 3. (DOK 3) [Treći set uputstava] Očekivani odgovori učenika [3-4 tačke sa metkićima koje pokazuju sintezu/evaluaciju] Refleksija: Završite sa jednom refleksijom o samoregulaciji ili transcendentnom razmišljanju, kao što je: 'Koji dokaz o današnjem naučnom konceptu možete naći u svom domu ili susedstvu?', 'Kako vam ono što ste danas naučili pomaže da drugačije vidite svet?', 'Sa kojim izazovima ste se suočili radeći ovo kod kuće i kako ste ih prevazišli?', ili 'Kako bi ovaj koncept mogao uticati na našu zajednicu ili buduća otkrića?'"
      }
    },
    "required": [
      "EssentialQuestions",
      "StudentLearningObjectives",
      "StandardsAligned",
      "KeyVocabulary",
      "AssessPriorKnowledge",
      "Question",
      "Research",
      "Hypothesize",
      "Experiment",
      "Analyze",
      "Share",
      "ReviewAndSpacedRetrieval",
      "FormativeAssessment",
      "StudentPractice"
    ],
    "additionalProperties": false
  }
};
