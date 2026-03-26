window.promptsSR = {
STEP0_PROMPT_TEMPLATE: `
Kreiraj nacrt jedinice i strukturu lekcija koristeći informacije u nastavku. NEMOJ pisati pune planove lekcija.
                    
Na osnovu predmeta jedinice (Unit Subject), obrazovnih standarda, opisa/instrukcija jedinice (Unit Description/Instruction), uzrasta (Grade Level), trajanja časa u minutima (Duration of class period), i zahtevanog broja lekcija (Number of Lessons), generiši JSON odgovor koji uključuje kohezivan opis jedinice (UnitDescription) i listu „kontejnera“ lekcija (Lessons) koji se ne preklapaju.

Predmet jedinice (Unit Subject):
{{$Subject}}

Naziv jedinice (Unit Name):
{{$Name}}

Opis/Instrukcije jedinice (Unit Description/Instruction):
{{$UserPrompt}}

Uzrast (Grade Level):
{{$GradeLevel}}

Trajanje dvočasa/časa u minutima:
{{$ClassDuration}}
  
Standardi za usklađivanje:
{{$Standards}}
    
Učenici sa individualizovanom podrškom:
{{$LearningPlans}}

Resursi/Mediji za korišćenje:
{{$MediaContext}}
  
Sadržaj jedinice:
{{$AttachedUnit}}

Zahtevi za Ključna Pitanja (Essential Questions):
- Svako pitanje MORA biti potpuna, gramatički ispravna rečenica koja se završava znakom pitanja.
- Svako pitanje MORA početi sa „Kako“ ili „Zašto“.
- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definiciona.
- Pitanja MORAJU biti fokusirana na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili zaključivanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti primenljiva u različitim disciplinama i izvan ove jedinice.
- Pitanja MORAJU biti ponovljena doslovno u svakoj lekciji unutar jedinice.

Šta generisati:
- Izlaz MORA biti validan JSON koji odgovara šemi.
- OBAVEZNO: Potpuno popuni sva svojstva unutar objekta "UnitDescription":
  - "Description": Napiši pasus od 4-5 rečenica koji opisuje srž fokusa jedinice i narativno putovanje.
  - "StudentLearningObjectives": Navedi 3-5 ključnih merljivih ciljeva učenja za jedinicu.
  - "StandardsAligned": Navedi sve standarde koji se obrađuju tokom jedinice.
  - "EssentialQuestions": Tačno 3 konceptualna pitanja prateći gore navedena pravila.
- GENERIŠI listu "Lessons" koja sadrži tačno {{$NumberOfLessons}} lekcija.
  - Svaka lekcija mora uključivati "lessonNumber" (indeks koji počinje od 1), "lessonTitle" i "lessonOutline" (2–4 rečenice koje opisuju obim lekcije).

Ograničenja:
- Drži jedinicu i svaku lekciju usklađenu sa fokusom jedinice.
- Osiguraj logičan redosled od osnovnih ideja do složenijeg modelovanja.
- Tačnost: Sav sadržaj mora biti naučno tačan i prikladan uzrastu.

Izlaz MORA biti validan JSON koji odgovara šemi. Koristi kompaktno formatiranje (bez dodatnih praznih linija).
`,
PER_LESSON_PROMPT_TEMPLATE: `
Kreiraj JEDAN plan lekcije u kolaborativnom stilu (NE plan jedinice, NE više lekcija) koristeći informacije u nastavku.

MORAŠ generisati validan JSON koji tačno odgovara priloženoj JSON šemi (LessonPlanResponse sa jednim objektom "LessonPlan"). Nemoj uključivati dodatne ključeve. Koristi kompaktno JSON formatiranje (bez dodatnih praznih linija).

KONTEKST JEDINICE (samo za čitanje radi koherentnosti):
Predmet jedinice:
{{$Subject}}

Sadržaj jedinice: 
{{$ParentUnitData}}

Opis/Instrukcije jedinice: Kreiraj jedinicu koristeći sledeće standarde:
{{$Standards}}

Uzrast (Grade Level):
{{$GradeLevel}}

Resursi/Mediji za korišćenje: 
{{$MediaContext}}

Trajanje časa u minutima:
{{$ClassDuration}}

Naslov lekcije:
{{$Name}}

Opis/Instrukcije jedinice: 
{{$UserPrompt}}

Ključna Pitanja jedinice (KORISTI IH DOSLOVNO):
{{$UnitEssentialQuestions}}

UČENICI SA INDIVIDUALIZOVANOM PODRŠKOM (MORAJU se koristiti SAMO unutar CollaborativeActivities.AccommodationsAndModifications; koristi imena učenika/planove tačno onako kako su napisani):
{{$LearningPlans}}

VAŽNA PRAVILA SADRŽAJA (Kolaborativni stil):
- Drži lekciju usklađenu sa fokusom jedinice i gore navedenim okvirom/granicama lekcije; izbegavaj uvođenje novih bitnih koncepta koji pripadaju drugim lekcijama.
- Kulturna relevantnost i inkluzija: uključi višestruke perspektive; poveži se sa različitim zajednicama; izbegavaj stereotipe; prikaži uticaje na sve uključene.
- Transfer: kroz celu lekciju ugradi primenu u stvarnom svetu i zaključivanje.
- Preplitanje (Interleaving): kada učenici vežbaju/primenjuju, mešaj strategije ili koncepte (ne blokirano vežbanje). Ako lekcija sadrži bilo kakvo matematičko zaključivanje, uključi barem jednu isprepletenu stavku DOK 3–4 nivoa koja meša trenutni sadržaj sa konceptom iz ranije lekcije i zahteva od učenika da opravdaju izbor strategije.

PRAVILA SPECIFIČNA ZA POLJA:
- EssentialQuestions: MORAJU biti potpuno identična ključnim pitanjima na nivou jedinice (isti tekst, isti redosled).
- AssessPriorKnowledge: Ako je ovaj odeljak obavezan (npr. za prvu lekciju ili kada se uvode novi glavni koncepti), napiši 150–250 reči prateći obaveznu strukturu u opisu šeme. U suprotnom, vrati "" (prazan string).
- Instruction:
  - Ovo je ista struktura kao kod Direktne prezentacije, ali preimenovana.
  - Struktura mora teći prirodno sa uputstvima: Kaži (Say)/Uradi (Do)/Pitaj (Ask)/Slušaj da čuješ (Listen for)/Zapiši (Write).
  - VAŽNO: NEMOJ uključivati naslove pisane svim velikim slovima (kao UVOD, PREZENTACIJA, itd.) za odeljke.
  - VAŽNO: NEMOJ uključivati trajanje vremena za pojedinačna uputstva ili korake.
  - TranscendentThinking: Navedi jedno pitanje o primeni u stvarnom svetu koje povezuje učenje sa svrhom/značenjem, praćeno oznakom 'Očekivani odgovori učenika:' i 2–3 primera.
- GroupStructureAndRoles (3–4 minuta):
  - Izlaz MORA biti usmeren ka nastavniku i MORA pratiti tačno ovu strukturu i oznake (isti redosled, isti emodžiji/karakteri):
  
  OBAVEZAN FORMAT (tačni naslovi/oznake):
  Veličina grupe: [jedno od: parovi / trijade / 4–5 učenika]
  
  📋 Instrukcije za nastavnike
  Kaži: "[1–2 rečenice: objasni da su uloge važne i da ćeš modelovati kako svaka uloga izgleda]"
  
  Uloge:
  Facilitator: [drži grupu na zadatku; podstiče učešće; osigurava da svako progovori barem jednom]
  Zapisničar: [piše oznake i grupno zaključivanje; beleži dokaze/konsenzus]
  Menadžer materijala: [prikuplja/distribuira materijale; proverava vraćanje materijala; podržava bezbedno rukovanje]
  Merač vremena: [prati vreme za svaku fazu; daje upozorenja na 1 minut do kraja]
  Prezentator: [deli grupni model i objašnjenje; koristi okvire rečenica]
  
  Rotacija:
  - Uključi jednu rečenicu koja precizira kada se uloge rotiraju u OVOJ lekciji (npr. „Rotirajte uloge nakon Faze A i ponovo pre galerijske šetnje.“)
  
  Ograničenja:
  - Uloge moraju biti tačno ovih pet naziva (Facilitator, Zapisničar, Menadžer materijala, Merač vremena, Prezentator) i svaka mora imati konkretnu dužnost vezanu za CollaborativeActivities lekcije.
  - Veličina grupe mora odgovarati strukturi zadatka (npr. ako koristiš jigsaw, preferiraj 4–5; ako je brza izgradnja i deljenje, trijade/parovi).
  - Ukupna dužina treba da bude ~120–180 reči.
- CollaborationGuidelines:
  - Trajanje ~5 minuta.
  - Vrati prazan string za ovo polje jer za sada imam fiksni tekst.
- CollaborativeActivities:
  - Kreiraj međuzavisnu kolaborativnu aktivnost (kolaborativna zamena za vođenu praksu) usklađenu sa obimom ove lekcije.
  - Svaki učenik mora doprineti i grupe moraju proizvesti zajednički proizvod ili odluku.
  - Uključi vremenske odrednice, skriptu „Kaži:“ za nastavnika, uputstva za cirkulaciju + očekivane odgovore, i brzu proveru gde SVI učenici odgovaraju + očekivani odgovori.
  - Uključi Diferencijaciju (3 nivoa) i AccommodationsAndModifications (Opšta i Individualna podrška tačno onako kako je navedeno).
  - Ako je ovo čas matematike, uključi jedan isprepleteni problem DOK 3–4 nivoa koji meša trenutni sadržaj sa prethodnom lekcijom/jedinicom i objasni zašto je uključen; u suprotnom izostavi preplitanje.
- ReflectionOnGroupDynamics:
  - Trajanje ~5 minuta.
  - Uključi 2–4 pitanja za debrief učenika (npr. šta je išlo dobro, izazov, da li se tvoj glas čuo).
  - Navedi poteze za olakšavanje od strane nastavnika (brzi izlazni listić, grupna samoprocena 1–5, ili dvominutna diskusija), sa uputstvima nastavnika i očekivanim odgovorima učenika.
  - Eksplicitno poveži refleksiju sa CollaborationGuidelines.
- ReviewAndSpacedRetrieval:
  - Ista struktura i zahtevi kao u verziji za direktnu instrukciju (vidi opis šeme).
  - Mora uključiti proveru izvlačenja informacija (retrieval check) koja se povezuje sa JEDNIM konceptom iz prethodne lekcije (navedi broj prethodne lekcije).
- StudentPractice:
  - Domaći zadatak / praksa van časa.
  - Mora pratiti tačan format zahtevan u opisu šeme (uključujući ✅Očekivani odgovori učenika oznake).

ZAHTEVI IZLAZA:
- Izlaz MORA biti validan JSON koji tačno odgovara priloženoj šemi.
- Izlaz MORA biti samo JEDAN plan lekcije.
- Bez HTML-a. Bez emodžija. Bez markdown-a. Običan tekst unutar string polja.
`,
HTML_LESSON_PROMPT_TEMPLATE: `
Dobićeš JEDAN JSON objekat koji striktno prati LessonPlanResponse šemu (već validiranu sa moje strane). Tvoj posao je da transformišeš ovaj JSON u čist, čitljiv HTML koji nastavnik može direktno da koristi na času.

FORMAT ULAZA
Poslaću ti JSON objekat ovako:

JSON PLAN LEKCIJE:
{{{JsonResponse}}}

Sve nakon linije „JSON PLAN LEKCIJE:“ tretiraj kao tačan JSON objekat. NEMOJ ga objašnjavati niti komentarisati; samo ga parsiraj i renderuj.

GLOBALNA PRAVILA
- Izlaz MORA biti isključivo validan HTML (bez markdown-a, bez backticks-a, bez proznih objašnjenja).
- Dozvoljeni tagovi: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
- NEMOJ koristiti nijedan drugi tag (nema <main>, <section>, <header>, <div>, <h4>, itd.).
- HTML treba da bude dobro uvučen i lako čitljiv.
- U bilo kom <ol> ili <ul>, koristi ISKLJUČIVO <li> elemente kao direktnu decu. Nikada nemoj stavljati <p>, <span>, <ul>, <ol>, ili bilo koji drugi tag kao dete liste.
- NEMOJ izmišljati novi instruktivni sadržaj; koristi samo ono što postoji u JSON poljima.
- Sačuvaj logički redosled koji podrazumeva šema.
- Ako je polje stringa prazno (""), IZOSTAVI taj pododeljak i njegovu oznaku.
- Ako je niz prazan, izostavi njegov naslov i odgovarajući <ul> ili <ol>.
- Kad god tekst jasno formira listu uputstava/pitanja/izjava/odgovora, koristi <ul><li>…</li></ul> ili <ol><li>…</li></ol>. U suprotnom, koristi <p>.
- Kad god renderuješ očekivane/model odgovore učenika, koristi ovaj obrazac:
  - Prvo: <p>✅ Očekivani odgovori učenika</p>
  - Zatim: <ul><li>…</li></ul> (ili <ol> ako je poređano)
  - NEMOJ gnezditi liste unutar <li>.

POČETAK STRANICE
- NEMOJ uključivati naslov lekcije (nemoj koristiti <h2>); započni svoj izlaz direktno sa odeljkom <h3>💭 Ključna Pitanja</h3> i nastavi odatle.

KLJUČNA PITANJA (ESSENTIAL QUESTIONS)
- <h3>💭 Ključna Pitanja</h3>
- <ul> gde je svaka stavka iz LessonPlan.EssentialQuestions jedan <li>.

KLJUČNI VOKABULAR (KEY VOCABULARY)
- <h3>🔤 Ključni vokabular</h3>
- <ol> gde je svaka stavka iz KeyVocabulary jedan <li>, prateći „Termin – Definicija“:
  <li><strong>Termin</strong> – Definicija</li>

CILJEVI UČENJA (STUDENT LEARNING OBJECTIVES)
- <h3>🎯 Ciljevi učenja</h3>
- <ul> sa svakom stavkom iz LessonPlan.StudentLearningObjectives kao <li>.

USKLAĐENI STANDARDI (STANDARDS ALIGNED) - STROGO PRAVILO: UVEK RENDERUJ
- <h3>📏 Usklađeni standardi</h3>
- <ul> sa svakim stringom iz StandardsAligned kao <li>.
- Pozicija: odmah nakon ciljeva.

PROCENA PREDZNANJA (ASSESS PRIOR KNOWLEDGE)
    - Ovaj pododeljak se pojavljuje SAMO ako svojstvo "AssessPriorKnowledge" postoji u JSON-u i nije prazan string.
    - Postavi ga odmah nakon bloka <h3>🎯 Ciljevi učenja</h3> za tu lekciju.

    Renderovanje:
        - <h3>💡 Procena predznanja</h3>
        - Renderuj sledeći pasus: <p><strong>Napomena za nastavnika: </strong>Aktiviranje predznanja učenika nije samo zagrevanje – to je neuronauka na delu. Ovaj proces aktivira postojeće neuronske puteve, olakšavajući mozgu da poveže nove informacije sa onim što je već poznato. Ova tehnika, nazvana elaborativno kodiranje, pomaže učenicima da brže i efikasnije prebace znanje u dugoročnu memoriju, poboljšavajući i razumevanje i zadržavanje. </p>
        - Pregled:
            - Renderuj sve uvodne pasuse sa uputstvima nastavnika koji uvode aktivnost kao jedan ili više <p> blokova pre bilo kakvih lista.
        - Instrukcije:
            - Renderuj instrukcije za nastavnika kao listu sa mecima (<ul>) gde svaka instrukcija postaje jedan <li> sa običnim tekstom (NEMOJ uključivati HTML unutar <li>).
            - NEMOJ gnezditi liste unutar bilo kog <li>; sve liste moraju biti na najvišem nivou i sadržati samo <li>.
        - Šablon/Struktura:
            - Renderuj tekst Šablon/Struktura kao jedan pasus <p> koji sadrži skriptu za nastavnika (npr. Kaži: ... Uradi: ...), čuvajući tačne reči i interpunkciju.
            - Odmah nakon tog <p>, ako su dati očekivani odgovori učenika, renderuj:
            <p>✅ Očekivani odgovori učenika</p>
            praćeno sa <ul> gde je svaki odgovor jedan <li> sa običnim tekstom.
            - NEMOJ stavljati ove liste odgovora unutar bilo kog drugog <li> ili liste.
        - Završne linije:
            - Sve završne rečenice nastavnika date kao poseban pasus treba renderovati kao sopstveni <p> nakon lista.
    - Alternativne opcije:
        - Postavi ovo NAKON završnog </ol> glavne numerisane liste.
        - Prvi izlaz: <p><strong>Alternativne opcije</strong></p>
        - Zatim renderuj nezavisnu numerisanu listu na najvišem nivou <ol> gde je svaka opcija jedan <li> sa običnim tekstom.

INSTRUКCIJA (INSTRUCTION)
- <h3><span style="color: rgb(115, 191, 39);">Instrukcija</span></h3>
- Materijali:
  <p><strong>📚 Materijali</strong></p>
  <ul>...</ul>
- Instrukcije za nastavnike:
  <p><strong>📋 Instrukcije za nastavnike</strong></p>
  Renderuj Instruction.InstructionsForTeachers kao čitljive <p> blokove. Kada tekst sadrži liste (kao Listen for: bullets), koristi odvojene <ul> liste na najvišem nivou nakon povezanog <p>. Nemoj gnezditi liste unutar <li>.
- Moguća pogrešna uverenja:
  <p><strong>⚠️ Moguća pogrešna uverenja</strong></p>
  Koristi <p> i/ili <ul> na najvišem nivou (samo običan tekst u <li>).
- Transcendentno razmišljanje:
  - <h3>🌍 Transcendentno razmišljanje</h3>
  - Renderuj pitanje kao vodeći pasus (<p>).
  - Zatim renderuj sve očekivane/model odgovore učenika koristeći globalni obrazac <p>✅ Očekivani odgovori učenika</p> praćen listom sa mecima (<ul>) izvan bilo koje stavke liste.
- Brza provera (Quick Check):
  <p><strong>Brza provera</strong></p>
  Renderuj kao <p> plus ✅ obrazac ako odgovori postoje.

STRUKTURA I ULOGE GRUPE (GROUP STRUCTURE & ROLES)
- <h3><span style="color: rgb(115, 191, 39);">Struktura i uloge grupe (3–4 min)</span></h3>
- Nakon ovoga renderuj tačno ovaj pasus:
  <p><strong>Odredite svrhu: </strong>Koja je glavna svrha vašeg grupisanja u ovoj aktivnosti — podrška vršnjaka, bogata diskusija, izazov ili efikasnost? Kada saznate svrhu, odaberite najbolji metod grupisanja: mešovite sposobnosti, zasnovano na interesovanjima, zasnovano na veštinama ili nasumično. </p>

STROGA PRAVILA (bez gnježdenja):
- NE SMEŠ stavljati nijedan <ul> ili <ol> unutar <li>. Bez gnježdenih lista bilo gde u ovom odeljku.
- Ako LessonPlan.GroupStructureAndRoles sadrži pododeljke kao "Uloge:" i "Rotacija:", MORAŠ ih izravnati u bilo:
  A) Zasebne <p> blokove, ILI
  B) Jednu <ul> listu na najvišem nivou gde je SVAKA stavka sopstveni <li>.

OBAVEZAN OBRAZAC RENDERONANJA:
1) Renderuj "Veličina grupe:" kao sopstveni <p> (običan tekst).
2) Renderuj "📋 Instrukcije za nastavnike" kao <p><strong>📋 Instrukcije za nastavnike</strong></p> ako su prisutne.
3) Renderuj "Kaži:" liniju(e) kao jedan ili više <p> blokova (običan tekst).
4) Renderuj uloge kao JEDNU <ul> listu na najvišem nivou sa tačno pet <li> stavki, koristeći samo inline <strong> (bez gnježdenih lista):
   <ul>
     <li><strong>Facilitator:</strong> ...</li>
     <li><strong>Zapisničar:</strong> ...</li>
     <li><strong>Menadžer materijala:</strong> ...</li>
     <li><strong>Merač vremena:</strong> ...</li>
     <li><strong>Prezentator:</strong> ...</li>
   </ul>
5) Renderuj "Rotacija:" kao sopstvenu <p> liniju (običan tekst). Ako rotacija ima više rečenica/koraka, drži ih kao zasebne <p> blokove (NE listu).
6) Ako se pojavi dodatni objašnjavajući tekst (npr. "Ograničenja:"), renderuj ga kao <p> (običan tekst), NE kao listu.

SMERNICE ZA SARADNJU (COLLABORATION GUIDELINES)
- <h3><span style="color: rgb(115, 191, 39);">Smernice za saradnju (5 min)</span></h3>
- Nakon ovoga renderuj TAČNO sledeće:
<p>Koristite uputstva ispod da vodite grupe učenika ka kreiranju sopstvenih grupnih normi.</p>
<ul>
  <li>Šta vam je potrebno jedni od drugih da bi se ovo osećalo fer, sa poštovanjem i produktivno?</li>
  <li>Napravite kratku listu od 3–5 grupnih normi oko kojih se svi slažete da ćete ih slediti. Zapitajte se: Kako ćemo se uveriti da se svačiji glas čuje? Kako ćemo rešavati neslaganja?</li>
  <li>Zamislite da se neko novi pridružio vašoj grupi. Koja pravila ili dogovore biste mu objasnili kako bi znao kako vaša grupa sarađuje? Zapišite ih kao vaše norme.</li>
  <li>Okrenite se i razgovarajte: Šta je pomoglo da vaša poslednja grupna aktivnost prođe dobro? Šta ju je činilo frustrirajućom? Pretvorite te ideje u ‘Uradi’ i ‘Nemoj raditi’ norme za ovu grupu.</li>
  <li>Kreirajte jednu rečenicu koja počinje sa ‘U našoj grupi ćemo uvek…’ i jednu koja počinje sa ‘U našoj grupi nećemo…’. Koristite ih da izgradite svoj puni set normi.</li>
</ul>

KOLABORATIVNE AKTIVNOSTI (COLLABORATIVE ACTIVITIES)
- <h3><span style="color: rgb(115, 191, 39);">Kolaborativne aktivnosti (25 min)</span></h3>

Materijali:
- <p><strong>📚 Materijali</strong></p>
- Renderuj LessonPlan.CollaborativeActivities.Materials kao JEDNU <ul> listu na najvišem nivou.
- STROGO PRAVILO: Bez gnježdenih lista. Ako linija materijala sadrži oznaku kao "Komplet za ispravke:" praćenu podstavkama, IZRAVNAJ pisanjem zasebnih <li> stavki koje počinju prefiksom oznake, npr.:
  <li>Komplet za ispravke — Kanap za podešavanje putanja orbite</li>

Instrukcije za nastavnike:
- <p><strong>📋 Instrukcije za nastavnike</strong></p>
- Renderuj uputstva nastavnika kao JEDNU numerisanu listu <ol>.
- Podeli izvorni tekst na numerisane korake. Ako tekst već ima numeraciju (1), 1., 1) itd., svaki postaje jedan <li>.
- STROGO PRAVILO: Bez gnježdenih lista bilo gde unutar <li>. Za predstavljanje podtačaka ili očekivanih odgovora, IZRAVNAJ ih u dodatne uzastopne <li> stavke u ISTOJ <ol> listi.
- Za očekivane odgovore učenika:
  - Renderuj oznaku "Očekivani odgovor učenika:" (ili slično) jednom kao sopstveni <li>.
  - Renderuj svaki sledeći odgovor/metak kao zaseban <li> sa stilom za uvlačenje: <li style="padding-left: 2em; list-style-type: none;">✅ ...</li>
- Uputstva za cirkulaciju moraju biti renderovana kao jedna numerisana <li> stavka u nizu. Ili ako je dato više odgovora, prati gore navedeni obrazac "Očekivani odgovor učenika:".

Brza provera:
- Ako izvor uključuje brzu proveru, renderuj je kao:
  <li>Brza provera — …</li>
  zatim svaki očekivani odgovor kao zasebne <li> linije:
  <li>✅ Očekivani odgovor učenika — …</li>
- Diferencijacija:
  <p><strong>🪜 Diferencijacija</strong></p>
  Koristi <p> blokove za tekst odeljka. Za označene pododeljke kao što su „Učenici koji uče jezik“, „Učenici kojima je potrebna dodatna podrška“, „Za napredne učenike“, renderuj:
    <p><strong>Oznaka</strong></p>
    <ul><li>...</li></ul>
- Prilagođavanja i modifikacije:
  <p><strong>🤝 Prilagođavanja i modifikacije</strong></p>
  - Opšta podrška:
    <p><strong>Opšta podrška:</strong></p>
    Renderuj svaku stavku opšte podrške kao stavku liste unutar <ul> liste na najvišem nivou. Svaki <li> mora biti običan tekst.
  - Individualna podrška:
    <p><strong>Individualna podrška:</strong></p>
    Za svakog učenika u nizu IndividualSupport:
      - Renderuj ime učenika kao <p> sa crvenim tekstom: <p><span style="color: rgb(204, 0, 0);">Ime učenika</span></p>.
      - Zatim renderuj <ul> listu koja sadrži tačno dva <li> elementa:
          <li>{PlanProvided}</li>
          <li>{PlanImplementation}</li>
      - Ponovi ovaj obrazac za svakog učenika.

REFLEKSIJA O DINAMICI GRUPE (REFLECTION ON GROUP DYNAMICS)
- <h3><span style="color: rgb(115, 191, 39);">Refleksija o dinamici grupe (5 min)</span></h3>

- LessonPlan.ReflectionOnGroupDynamics je jedan string koji može sadržati označene segmente kao što su:
  "Teacher facilitation moves:", "Prompts for students:", "Teacher moves:", "Expected student answers:", "Link back ..."

1) Materijali:
   - <p><strong>📚 Materijali</strong></p>
   - Parsiraj sve nakon "Materijali:". Ako je "None", renderuj <ul><li>Nema</li></ul>, inače podeli u JEDNU <ul> listu na najvišem nivou.

2) Napomene za nastavnika:
   - Renderuj: <p><strong>Napomene za nastavnika</strong></p>
   - Zatim pun tekst napomena (koji objašnjava zašto/kako strategija pomaže) kao jedan ili više <p> blokova.

3) Aktivno prisećanje:
   - Renderuj:
     <p><strong>📋 Instrukcije za nastavnike</strong></p>
     <p><strong>Aktivno prisećanje</strong></p>
   - Renderuj 2–3 uputstva za izvlačenje kao listu na najvišem nivou <ol>.
   - Ukloni sva trajanja vremena (npr. "(30 sek)") iz teksta.
   - Za bilo koje očekivane odgovore učenika, koristi ✅ obrazac (p + ul) odmah nakon uputstva.

4) Ispravljanje uobičajenih pogrešnih uverenja:
   - Renderuj: <p><strong>Ispravljanje uobičajenih pogrešnih uverenja</strong></p>
   - Ovo SE MORA pojaviti odmah ispod odeljka Aktivno prisećanje.
   - Renderuj kao <ul> gde je svaka stavka jedan <li> sa običnim tekstom.

5) Povezivanje sa ključnim pitanjem + Transcendentno razmišljanje + Prostorno izvlačenje:
   - Renderuj svako sa specifičnom ikonicom i oznakom:
     <p><strong>💭 Povezivanje sa ključnim pitanjem</strong></p>
     <p><strong>🌍 Transcendentno razmišljanje</strong></p>
     <p><strong>⏳ Prisećanje uz vremenske razmake</strong></p>
   - Zatim renderuj njihov sadržaj kao <p>.

FORMATIVNA PROCENA
- <p><strong>✅ Formativna procena</strong></p>
- Renderuj uvodni pasus (ako je prisutan).
- Zatim otvori JEDNU <ul> listu na najvišem nivou.
- Kreiraj DVA <li> elementa (jedan za uputstvo, jedan za odgovor) za SVAKO od 4 uputstva u JSON sadržaju, držeći ih u istoj ravnoj <ul> listi:
  - <li>Uputstvo X (DOK Y) — "Tekst pitanja"</li>
  - <li>✅ Očekivani odgovor učenika — Tekst odgovora</li>
- NEMOJ koristiti gnježdene liste. NEMOJ koristiti <p> unutar <li>.

VEŽBA UČENIKA (STUDENT PRACTICE)
- <h3><span style="color: rgb(115, 191, 39);">🖊 Vežba učenika</span></h3>
- Renderuj Napomene za nastavnika kao <p> blokove.
- Renderuj zadatke kao jednu <ol> listu sa <li> stavkama.
- Renderuj sve ✅ Očekivani odgovori učenika blokove koristeći ✅ obrazac, izvan bilo kog <li>.
`,
UNIT_COMMON_HTML_PROMPT_TEMPLATE: `
Dobićeš JEDAN JSON objekat koji striktno prati UnitPlanResponse šemu (već validiranu sa moje strane). Tvoj posao je da transformišeš ovaj JSON u čist, čitljiv HTML koji nastavnik može direktno da koristi na času.

FORMAT ULAZA
Poslaću ti JSON objekat ovako:

JSON NACRT JEDINICE:
{{{JsonResponse}}}

Sve nakon linije „JSON NACRT JEDINICE:“ tretiraj kao tačan JSON objekat. NEMOJ ga objašnjavati niti komentarisati; samo ga parsiraj i renderuj.

GLOBALNA PRAVILA
    - Izlaz MORA biti isključivo validan HTML (bez markdown-a, bez backticks-a, bez proznih objašnjenja).
    - Dozvoljeni tagovi: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - NEMOJ koristiti nijedan drugi tag (nema <main>, <section>, <header>, <div>, <h4>, itd.).
    - HTML treba da bude dobro uvučen i lako čitljiv.
    - U bilo kom <ol> ili <ul>, koristi ISKLJUČIVO <li> elemente kao direktnu decu. Nikada nemoj stavljati <p>, <span>, <ul>, <ol>, ili bilo koji drugi tag kao dete liste.
    - NEMOJ izmišljati novi instruktivni sadržaj; koristi samo ono što postoji u JSON poljima.
    - Sačuvaj logički redosled koji podrazumeva šema:
        1. Informacije na nivou jedinice (naslov, opis, ključna pitanja, ciljevi, standardi)
        2. Zatim lekcije u rastućem redosledu LessonNumber
        3. Unutar svake lekcije, prati redosled polja šeme.
    - Ako je polje stringa prazno (""), IZOSTAVI taj pododeljak i njegovu oznaku.
    - Ako je niz prazan, izostavi njegov naslov i odgovarajući <ul> ili <ol>.
    - Kad god tekst jasno formira listu uputstava/pitanja/izjava/odgovora, koristi <ul><li>…</li></ul> ili <ol><li>…</li></ol>. U suprotnom, koristi <p>.
    - Kad god renderuješ model/očekivane odgovore učenika u BILO KOM odeljku (kad god šema ili tekst jasno ukazuje na „Expected Student Responses“, „Model responses“, „Sample answers“ ili slično), koristi ovaj obrazac:
    - Prvo: <p>✅ Očekivani odgovori učenika</p>
    - Zatim listu odgovora:
    - <ul><li>…</li></ul> za nepoređane odgovore.
    - <ol><li>…</li></ol> kada je tekst jasno numerisan ili poređan (npr. 1., 2., 3.).

- Na vrhu stranice:
    - <h1> sa naslovom jedinice (Unit Plan Title).
    - Jedan <p> za opis jedinice (UnitDescription.Description).

- Ključna pitanja (Essential Questions):
    - <h2>💭 Ključna Pitanja</h2>
    - <ul> sa svakom stavkom iz EssentialQuestions kao <li>.

- Ciljevi učenja učenika (Student Learning Objectives):
    - <h2>🎯 Ciljevi učenja</h2>
    - <ul> sa svakom stavkom iz StudentLearningObjectives kao <li>.

- Standardi (Standards):
    - <h2>📏 Usklađeni standardi</h2>
    - <ul> sa svakim stringom iz StandardsAligned kao <li>.
`,
STEP0_SCHEMA: {
  "title": "UnitPlanResponse",
  "type": "object",
  "properties": {
    "UnitDescription": {
      "type": "object",
      "properties": {
        "Description": {
          "type": "string",
          "description": "Opis jedinice kao jedan kohezivan pasus običnog teksta (4–5 potpunih rečenica) napisan prirodnim glasom nastavnika koji bi se mogao reći direktno učenicima. Bez HTML-a, bez emodžija, bez nabrajanja (bullets). Mora teći konverzacijski, ali pratiti ovu strukturu (bez naslova): (1) rečenica „udica“ koja izaziva radoznalost ili pravi iznenađujući kontrast, (2) rečenica „U ovoj jedinici ćete...“ o ishodima savladavanja, (3) rečenica „Ojačaćete svoje veštine u...“ o sposobnostima razmišljanja/analize, (4) rečenica „Ovo se povezuje sa...“ o relevantnosti u stvarnom svetu, (5) rečenica „Razumevanje ovoga je važno jer...“ o širem značaju ili dugoročnom uticaju."
        },
        "EssentialQuestions": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Kreiraj ključna pitanja koja se fokusiraju isključivo na široke, univerzalne koncepte kao što su promena, dokazi, obrasci, odnosi, sistemi ili zaključivanje. NEMOJ pominjati usko stručne termine specifične za predmet, procese, vokabular ili primere. Pitanja moraju biti otvorenog tipa, prenosiva kroz sve discipline i nemoguća za odgovor jednostavnim učenjem sadržaja lekcije ili jedinice. Fokusiraj se samo na velike ideje, a ne na samu materiju predmeta.",
          "items": {
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "Kompletan odeljak „Ciljevi učenja učenika“ za celu ovu jedinicu. Svaka stavka na listi mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se DOK oznakom u zagradi.",
          "items": {
            "type": "string"
          }
        },
        "StandardsAligned": {
          "type": "array",
          "description": "Navedi sve jedinstvene obrazovne standarde korišćene bilo gde u ovoj jedinici i njenim lekcijama. NEMOJ dodavati standarde koji se ne pojavljuju u sadržaju jedinice. Svaki standard mora uključivati kod standarda i opis, npr. 'MS-ESS1-1: Razvijanje i korišćenje modela sistema Zemlja–Sunce–Mesec za opisivanje cikličnih obrazaca lunarnih faza, pomračenja i godišnjih doba.'",
          "items": {
            "type": "string"
          }
        }
      },
      "required": [
        "Description",
        "EssentialQuestions",
        "StudentLearningObjectives",
        "StandardsAligned"
      ],
      "additionalProperties": false
    },
    "Lessons": {
      "type": "array",
      "description": "Lista kontejnera lekcija za ovu jedinicu (samo nacrt). Svaka stavka mora biti bez preklapanja i jasno ograničena kako se sadržaj lekcija ne bi ponavljao kroz lekcije.",
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
            "description": "2–4 rečenice koje opisuju obim lekcije, fokus i granice kako bi se sprečilo preklapanje sa drugim lekcijama."
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
  "title": "LessonPlanResponse",
  "type": "object",
  "properties": {
    "LessonDescription": {
      "type": "object",
      "properties": {
        "LessonNumber": {
          "type": "integer",
          "description": "Redni broj lekcije unutar jedinice (indeks koji počinje od 1)."
        },
        "LessonTitle": {
          "type": "string",
          "description": "Kratak deskriptivni naslov za lekciju. NEMOJ uključivati emodžije ovde."
        },
        "EssentialQuestions": {
          "type": "array",
          "description": "Zalepi doslovno ključna pitanja sa nivoa jedinice istim redosledom.",
          "items": {
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "type": "array",
          "description": "Lista stringova u formatu 'Termin - Definicija'. Definicije moraju biti kratke, prilagođene uzrastu i vezane za ovu lekciju.",
          "items": {
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "2–3 merljiva cilja, od kojih se svaki završava DOK oznakom u zagradi.",
          "items": {
            "type": "string"
          }
        },
        "StandardsAligned": {
          "type": "string",
          "description": "Usklađeni obrazovni standardi za ovu lekciju. Moraju se tačno podudarati sa standardima jedinice u kodu i opisu."
        },
        "AssessPriorKnowledge": {
          "type": "string",
          "description": "Kompletan odeljak „Procena predznanja“ kao običan tekst (ukupno 150-250 reči). SAMO lekcija 1 treba da sadrži detaljan blok; SVE OSTALE LEKCIJE MORAJU VRATITI PRAZAN STRING za ovo polje. Za lekciju 1, struktura mora uključivati: 1. Uključi ovaj odeljak samo u prvu lekciju jedinice, postavljen odmah nakon ciljeva učenja učenika. 2. Osiguraj da se koriste DOK 1-3 uputstva. 3. Uključi preduslovne veštine potrebne za ciljeve učenja učenika. 4. Izaberi jedan modalitet sa ove liste i potpuno ga razvij: ispitivanje, K-W-L, vizuelni prikazi, konceptualne mape, refleksivno pisanje, vodiči za predviđanje, ocena vokabulara. 5. Početno uputstvo nastavnika sa rečenicom „Kaži:“ koja uvodi izabrani modalitet i objašnjava kako će učenici ispoljiti trenutno razumevanje. 6. Jasna uputstva i šablon/struktura za izabrani modalitet. 7. Odeljak „Očekivani odgovori učenika“ koji prikazuje predviđene odgovore ili uobičajena pogrešna uverenja za izabrani modalitet. 8. Završno uputstvo nastavnika „Kaži:“ koje potvrđuje razmišljanje učenika i najavljuje istraživanje u jedinici. 9. Nakon potpunog razvijanja jednog modaliteta, navedi 2 kratke alternativne opcije koje nastavnik može izabrati."
        },
        "Instruction": {
          "type": "object",
          "description": "Odeljak 'Instrukcija' kolaborativne lekcije (ekvivalent Direktnoj prezentaciji).",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Lista materijala.",
              "items": {
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "type": "string",
              "description": "Skripta za nastavnika sa uputstvima Kaži/Uradi/Pitaj/Slušaj da čuješ/Zapiši. NEMOJ koristiti naslove pisane svim velikim slovima za odeljke i NEMOJ uključivati vremenske oznake za pojedinačne korake."
            },
            "AnticipatedMisconceptions": {
              "type": "string",
              "description": "Uobičajena pogrešna uverenja i tačan jezik za ispravljanje svakog od njih."
            },
            "TranscendentThinking": {
              "type": "string",
              "description": "Pitanje o primeni u stvarnom svetu koje povezuje učenje sa svrhom/značenjem, sa 2–3 očekivana odgovora učenika koji pokazuju dublje razumevanje."
            },
            "QuickCheck": {
              "type": "string",
              "description": "Finalno pitanje za proveru razumevanja sa 2–3 očekivana odgovora učenika."
            }
          },
          "required": [
            "Materials",
            "InstructionsForTeachers",
            "AnticipatedMisconceptions",
            "TranscendentThinking",
            "QuickCheck"
          ],
          "additionalProperties": false
        },
        "GroupStructureAndRoles": {
          "type": "string",
          "description": "3–4 minuta postavke za veličinu grupe + rotirajuće uloge + dužnosti + uputstvo nastavnika o strategiji grupisanja."
        },
        "CollaborationGuidelines": {
          "type": "string",
          "description": "~5 minuta. 3–5 normi, uputstva nastavnika za norme koje kreiraju učenici (puna + kratka) i podrška za ravnopravno učešće."
        },
        "CollaborativeActivities": {
          "type": "object",
          "description": "Međuzavisni grupni rad (kolaborativna zamena za vođenu praksu). Fokusiran na nastavnika, visoko strukturiran i dizajniran tako da učenici ne mogu sami da završe zadatak. Mora uključivati: (a) jasnu međuzavisnost (jigsaw, postizanje konsenzusa, galerijska šetnja, izazov strukturiranog rešavanja problema ili slično), (b) eksplicitno vreme za svaku fazu (npr. '8 minuta diskusija, 2 minuta priprema odgovora'), (c) skriptovano vođenje nastavnika koristeći „Kaži:“ izjave svuda, (d) zajednički grupni proizvod (tvrdnja, model, grafikon, set rešenja, artefakt za galeriju itd.), (e) uputstva tokom cirkulacije sa očekivanim odgovorima učenika, (f) barem jednu proveru odgovora SVIH učenika (bele table, brzo pisanje, glasanje, palčevi itd.) sa očekivanim odgovorima, (g) brzo pitanje za proveru + očekivani odgovori, (h) diferencijaciju u tri nivoa fokusiranu na nastavu (ne na prilagođavanja), i (i) prilagođavanja i modifikacije (AccommodationsAndModifications) podeljene na opštu podršku i individualnu podršku koja se tačno podudara sa datim učenicima/planovima. Osiguraj kulturnu relevantnost i inkluziju pozivanjem na višestruke perspektive i osiguravanjem ravnopravnog učešća.",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Kompletna lista materijala za nastavnika + učenike koji se koriste u ovoj kolaborativnoj aktivnosti. Uključi sve pripremljene stavke (kartice sa uputstvima, okviri rečenica, kartice uloga, liste za proveru, rubrike, listovi za galerijsku šetnju, bele table, tajmeri, vizuelni prikazi, banke reči itd.). Jedna stavka po elementu niza; bez mesta za popunjavanje (placeholders).",
              "items": {
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "type": "string",
              "description": "Skripta upućena nastavniku za kolaborativnu aktivnost od 25 minuta. MORA biti koncizna i uklopiti se u vremenski okvir (ciljaj na ukupno 6-10 numerisanih koraka). NEMOJ koristiti naslove pisane svim velikim slovima (npr. POSTAVKA, MODELOVANJE). NEMOJ uključivati trajanje vremena za pojedinačne korake. Uputstva za cirkulaciju moraju biti integrisana kao pojedinačni numerisani zadaci (npr. '5. Uputstvo za cirkulaciju: ...'). Očekivani odgovori učenika moraju pratiti odgovarajući zadatak: napiši 'Očekivani odgovor učenika:' jednom kao numerisani korak, a zatim navedi svaki odgovor uvučen u novom redu počevši sa znakom potvrde (✅). Primer:\n5. Uputstvo za cirkulaciju: [pitanje]\n6. Očekivani odgovor učenika:\n7. ✅ Odgovor 1\n8. ✅ Odgovor 2"
            },
            "Differentiation": {
              "type": "string",
              "description": "ISKLJUČIVO instruktivna diferencijacija (ne prilagođavanja/modifikacije). Mora biti organizovana u tri označena nivoa tačno ovim redosledom: 'Učenici koji uče jezik:', 'Učenici kojima je potrebna dodatna podrška:', 'Za napredne učenike:'. Svaki nivo mora uključivati konkretne poteze u nastavi (2–3 strategije za prva dva nivoa; 1–2 zadatka za proširenje za „Za napredne učenike“) usklađene sa istim ciljevima učenja. Uključi barem jedan očekivani odgovor/primer po nivou koji pokazuje kako uspeh izgleda. Zadrži nivo zahtevnosti; variraj složenost, podršku i zahteve diskursa."
            },
            "AccommodationsAndModifications": {
              "type": "object",
              "description": "Podrška pristupu za ovu aktivnost, podeljena na (1) opštu podršku za sve učenike i (2) individualnu podršku (IndividualSupport) za učenike sa planovima. Fokusiraj se na pristup bez smanjenja zahtevnosti. Za svaku podršku uključi konkretne alate (tačni počeci rečenica, izgled organizatora, vizuelni opis, koraci liste za proveru itd.). IndividualSupport MORA uključivati tačno one učenike date u uputstvu (ista imena, isti tekst PlanProvided) i mora dodati PlanImplementation koji je specifičan za OVU aktivnost.",
              "properties": {
                "General": {
                  "type": "string",
                  "description": "Opšta podrška za celo odeljenje tokom ove kolaborativne aktivnosti (nije specifična za učenika). Mora biti konkretna i upotrebljiva (npr. tačni okviri rečenica, lista za proveru u 3 koraka, opisani poster/podsetnik, data banka reči, raščlanjene kartice sa zadacima, unapred označeni šabloni). Nemoj smanjivati zahtevnost; poboljšaj pristup."
                },
                "IndividualSupport": {
                  "type": "array",
                  "minItems": 0,
                  "description": "Tačno navedeni učenici (ni manje, ni više). StudentName i PlanProvided moraju se tačno podudarati sa uputstvom. PlanImplementation mora pružiti konkretnu podršku za OVU aktivnost (okviri rečenica, delimično popunjen organizator, dvojezične oznake, tok rada govor-u-tekst itd.).",
                  "items": {
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string"
                      },
                      "PlanProvided": {
                        "type": "string"
                      },
                      "PlanImplementation": {
                        "type": "string",
                        "description": "Konkretni alati/počeci rečenica/vizuelni prikazi/organizatori za ovaj zadatak."
                      }
                    },
                    "required": [
                      "StudentName",
                      "PlanProvided",
                      "PlanImplementation"
                    ],
                    "additionalProperties": false
                  }
                }
              },
              "required": [
                "General",
                "IndividualSupport"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "Materials",
            "InstructionsForTeachers",
            "Differentiation",
            "AccommodationsAndModifications"
          ],
          "additionalProperties": false
        },
        "ReflectionOnGroupDynamics": {
          "type": "string",
          "description": "~5 minuta. Strukturirani debrief o tome kako je grupa radila + potezi za olakšavanje od strane nastavnika + očekivani odgovori učenika; povezivanje unazad sa normama."
        },
        "ReviewAndSpacedRetrieval": {
          "type": "string",
          "description": "Kompletan odeljak „Pregled i prisećanje uz vremenske razmake“ kao običan tekst (400-600 reči). MORA uključivati ove komponente po redu: (1) Lista materijala, (2) Napomene za nastavnika: Jedan pasus koji objašnjava „zašto“ i „kako“ (teorija/nauka), a ne uputstva za nastavnika. Koristi ovaj početak: 'Napomena za nastavnika: Ova strategija podstiče zadržavanje informacija kroz aktivno prisećanje i povezuje današnje ideje o [tema] sa prethodnim konceptima [koncept]. Prisećanje uz vremenske razmake pomaže učenicima da prepoznaju kako [tema] utiče na [velika ideja]...', (3) Aktivno prisećanje: 2-3 numerisane stavke koje traže od učenika da se prisete NOVOG učenja iz DANAŠNJE lekcije (NE dopunjavanje praznina, BEZ izlaznih listića, BEZ refleksije o poboljšanju), (4) Ispravljanje uobičajenih pogrešnih uverenja: Postavljeno odmah ispod Aktivnog prisećanja i usklađeno sa postavljenim pitanjima, (5) Povezivanje sa ključnim pitanjem: Uputstvo nastavnika koje povezuje sa pitanjem jedinice + očekivani odgovori, (6) Transcendentno razmišljanje: Pitanje o primeni u stvarnom svetu + očekivani odgovori, (7) Prisećanje uz vremenske razmake: Prisećanje iz specifične prethodne lekcije/jedinice (navodeći broj lekcije). Za sva uputstva, uključi „Očekivani odgovor učenika:“ sa 2-3 konkretna primera."
        },
        "FormativeAssessment": {
          "type": "string",
          "description": "Kompletan odeljak „Formativna procena“ kao običan tekst. Ovo MORA sadržati tačno 4 pitanja označena sa 'Uputstvo 1 (DOK 1):', 'Uputstvo 2 (DOK 2):', 'Uputstvo 3 (DOK 3):' i 'Uputstvo 4 (DOK 4):'. Za svako uputstvo: - Pitanje koje testira razumevanje na navedenom DOK nivou - Naslov '✅ Očekivani odgovori učenika' - 1-2 uzorka odgovora koji pokazuju savladavanje. NEMOJ uključivati odeljak 'Refleksija'. Primer formata: Uputstvo 1 (DOK 1): 'Zašto planete ostaju u orbiti?' ✅ Očekivani odgovori učenika - 'Gravitacija i kretanje napred.' [Nastavi za uputstva 2-4]"
        },
        "StudentPractice": {
          "type": "string",
          "description": "Domaći zadatak / praksa van časa. Mora pratiti isti obavezni format kao i Direktna instrukcija, uključujući ✅ Očekivani odgovori učenika."
        }
      },
      "required": [
        "LessonNumber",
        "LessonTitle",
        "EssentialQuestions",
        "KeyVocabulary",
        "StudentLearningObjectives",
        "StandardsAligned",
        "AssessPriorKnowledge",
        "Instruction",
        "GroupStructureAndRoles",
        "CollaborationGuidelines",
        "CollaborativeActivities",
        "ReflectionOnGroupDynamics",
        "ReviewAndSpacedRetrieval",
        "FormativeAssessment",
        "StudentPractice"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "LessonDescription"
  ],
  "additionalProperties": false,
  "x-removablePaths": {
    "EssentialQuestions": [
      "LessonDescription.EssentialQuestions"
    ],
    "StandardsAligned": [
      "LessonDescription.StandardsAligned"
    ],
    "AssessPriorKnowledge": [
      "LessonDescription.AssessPriorKnowledge"
    ],
    "SpacedLearningAndRetrieval": [
      "LessonDescription.ReviewAndSpacedRetrieval"
    ],
    "FormativeAssessment": [
      "LessonDescription.FormativeAssessment"
    ],
    "AccommodationsAndModifications": [
      "CollaborativeActivities.AccommodationsAndModifications"
    ]
  }
}
};