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
- GENERIŠI listu "Lessons" koja sadrži tačno {{$NumberOfItems}} lekcija.
  - Svaka lekcija mora uključivati "lessonNumber" (indeks koji počinje od 1), "lessonTitle" i "lessonOutline" (2–4 rečenice koje opisuju obim lekcije).

Ograničenja:
- Drži jedinicu i svaku lekciju usklađenu sa fokusom jedinice.
- Osiguraj logičan redosled od osnovnih ideja do složenijeg modelovanja.
- Tačnost: Sav sadržaj mora biti naučno tačan i prikladan uzrastu.

Izlaz MORA biti validan JSON koji odgovara šemi. Koristi kompaktno formatiranje (bez dodatnih praznih linija).
`,
    PER_LESSON_PROMPT_TEMPLATE: `
Kreiraj JEDAN plan lekcije u stilu direktne instrukcije (NE plan jedinice, NE više lekcija) koristeći informacije u nastavku.
MORAŠ generisati validan JSON koji tačno odgovara priloženoj JSON šemi (LessonPlanResponse sa jednim objektom "LessonPlan"). Nemoj uključivati dodatne ključeve. Koristi kompaktno JSON formatiranje (bez dodatnih praznih linija).
Predmet jedinice: 
{{$Subject}}
Naziv jedinice: 
{{$Name}}
Opis/Instrukcije jedinice: 
{{$UserPrompt}}
Uzrast (Grade Level): 
{{$GradeLevel}}
Trajanje časa u minutima: 
{{$ClassDuration}}
Resursi/Mediji za korišćenje: 
{{$MediaContext}}
Sadržaj jedinice: 
{{$ParentUnitData}}
Standardi za usklađivanje:
{{$Standards}}
Priloženi sadržaj lekcije: 
{{$AttachedLesson}}

Ključna Pitanja jedinice (KORISTI IH DOSLOVNO):
{{$UnitEssentialQuestions}}

Ako su gornja Ključna Pitanja prazna, generišite tačno 3 konceptualna pitanja prateći ova pravila:
- Svako pitanje MORA biti potpuna, gramatički ispravna rečenica koja se završava znakom pitanja.
- Svako pitanje MORA početi sa „Kako“ ili „Zašto“.
- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definiciona.
- Pitanja MORAJU biti fokusirana na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili zaključivanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti primenljiva u različitim disciplinama i izvan ove jedinice.

UČENICI SA INDIVIDUALIZOVANOM PODRŠKOM (MORAJU se koristiti SAMO unutar GuidedPractice.AccommodationsAndModifications; koristi imena učenika/planove tačno onako kako su napisani):
{{$LearningPlans}}

VAŽNA PRAVILA SADRŽAJA:
- Drži lekciju usklađenu sa fokusom jedinice.
- Uključi kratke veze na visokom nivou sa drugim relevantnim DCI gde je to prikladno, ali zadrži lekciju usmerenu na modeliranju i strukturno-svojstvenom zaključivanju (bez duboke matematike, bez balansiranja jednačina osim ako to izričito ne zahtevaju standardi).
- Osiguraj da svi delovi lekcije odražavaju okvire lekcije iznad; izbegavaj uvođenje novih bitnih koncepta koji pripadaju drugim lekcijama.
- EssentialQuestions: MORAJU biti potpuno identična ključnim pitanjima na nivou jedinice (isti tekst, isti redosled).
- AssessPriorKnowledge: SAMO ako je LessonNumber == 1, napiši 150–250 reči i prati obaveznu strukturu opisanu u šemi. Ako LessonNumber != 1, vrati "" (prazan string).
- DirectPresentation mora trajati ≤10 minuta ukupno i mora pratiti obavezni UVOD (HOOK)/PREDSTAVLJANJE (INTRODUCTION)/DIREKTNO PODUČAVANJE (DIRECT TEACHING)/VOĐENI ANGAŽMAN (GUIDED ENGAGEMENT) format sa uputstvom Kaži(Say)/Uradi(Do)/Pitaj(Ask)/✅ Očekivani odgovori učenika/Zapiši(Write), i očekivane odgovore učenika kao stavke liste (NEMOJ uključivati naslove/zaglavlja sekcija u string).
- GuidedPractice.InstructionsForTeachers mora imati najmanje 700 reči i mora uključiti obavezne komponente navedene u opisu šeme.
- GuidedPractice.AccommodationsAndModifications mora uključiti:
  - Opšta podrška: opšte podrške (general)
  - Individualna podrška: niz sa tačno onim učenicima i planovima koji su navedeni (ista imena/planovi; bez dodatnih učenika).
- StudentPractice MORA uključiti pasus TeacherNotes koji počinje sa 'Ovi zadaci pojačavaju današnje učenje o ____ kroz ______.', listu od 2-3 zadatka sa DOK 2-4 i kriterijumima uspeha, kao i preplitanje (interleaving) ako je predmet matematika.

ZAHTEVI IZLAZA:
- Izlaz MORA biti validan JSON koji tačno odgovara priloženoj šemi.
- Izlaz MORA biti samo JEDAN plan lekcije.
- Bez HTML-a. Bez emodžija. Bez markdown-a. Običan tekst unutar string polja.
`,
    HTML_LESSON_PROMPT_TEMPLATE: `
Dobićeš JEDAN JSON objekat koji striktno prati UnitPlanResponse šemu (već validiranu sa moje strane). Tvoj posao je da transformišeš ovaj JSON u čist, čitljiv HTML koji nastavnik može direktno da koristi na času.

FORMAT ULAZA
Poslaću ti JSON objekat ovako:

JSON PLAN LEKCIJE:
{{{JsonResponse}}}

Sve nakon linije „JSON PLAN LEKCIJE:“ tretiraj kao tačan JSON objekat. NEMOJ ga objašnjavati niti komentarisati; samo ga parsiraj i renderuj.

GLOBALNA PRAVILA
    - Izlaz MORA biti isključivo validan HTML (bez markdown-a, bez backticks-a, bez proznih objašnjenja).
    - Dozvoljeni tagovi: <p>, <h1>, <h2>, <h3>, 
    - (umotan u <p>), <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - NEMOJ koristiti nijedan drugi tag (nema <main>, <section>, <header>, <div>, <h4>, itd.).
    - HTML treba da bude dobro uvučen i lako čitljiv.
    - U bilo kom <ol> ili <ul>, koristi ISKLJUČIVO <li> elemente kao direktnu decu. Nikada nemoj stavljati <p>, <span>, <ul>, <ol>, ili bilo koji drugi tag kao dete liste.
    - NEMOJ izmišljati novi instruktivni sadržaj; koristi samo ono što postoji u JSON poljima.
    - Sačuvaj logički redosled koji podrazumeva šema:
    - Unutar svake lekcije, prati redosled polja šeme.
    - Ako je polje stringa prazno (""), IZOSTAVI taj pododeljak i njegovu oznaku.
    - Ako je niz prazan, izostavi njegov naslov i odgovarajući <ul> ili <ol>.
    - Kad god tekst jasno formira listu uputstava/pitanja/izjava/odgovora, koristi <ul><li>…</li></ul> ili <ol><li>…</li></ol>. U suprotnom, koristi <p>.
    - Kad god renderuješ model/očekivane odgovore učenika u BILO KOM odeljku, koristi ovaj obrazac:
        - Prvo: <p>✅ Očekivani odgovori učenika</p> (bez metaka na ovoj liniji)
        - Zatim <ul> ili <ol> lista koja sadrži odgovore (jedan odgovor po <li>).
    - Kad god renderuješ Brzu proveru (Quick Check):
        - Koristi tačno ovo zaglavlje: <p><strong>✔Brza provera</strong></p>
        - Renderuj pitanje ili zadatak odmah ispod zaglavlja kao pasus koji traži od SVAKOG učenika da pokaže razumevanje (ne samo od jednog u verbalnoj proveri).
        - Koristi globalni ✅ Očekivani odgovori učenika obrazac za odgovore.

Za ovu lekciju:
    - Ključna pitanja lekcije (ako postoje):
    - <h3>💭 Ključna Pitanja</h3>
    - <ul> gde je svaki predmet iz Lesson.EssentialQuestions jedan <li>.
    - Ključni vokabular (ako postoji):
    - <h3>🔤 Ključni vokabular</h3>
    - <ol> gde je svaka stavka iz KeyVocabulary jedan <li>, prateći strukturu „Termin – Definicija“:
    - <strong>Termin</strong> – Definicija
    - Ciljevi učenja učenika (ako postoje):
    - <h3>🎯 Ciljevi učenja</h3>
    - <ul> gde je svaka stavka iz Lesson.StudentLearningObjectives jedan <li>.
    - Standardi za lekciju:
    - <h3>📏 Usklađeni standardi</h3>
    - <ul> koji sadrži Lesson.StandardsAligned kao <li>.
    Strogo pravilo — Usklađeni standardi se uvek moraju renderovati:
    Ako Lesson.StandardsAligned sadrži bar jednu nepraznu stavku, MORAŠ renderovati blok “📏 Usklađeni standardi” tačno jednom za tu lekciju. Nemoj ga izostavljati ni iz kog razloga.
    Pozicioniranje: renderuj odmah nakon “🎯 Ciljevi učenja”; ako je renderovano “💡 Procena predznanja”, onda renderuj “📏 Usklađeni standardi” odmah ispod bloka Procena predznanja.

PROCENA PREDZNANJA (ASSESS PRIOR KNOWLEDGE)
    - Ovaj pododeljak se pojavljuje SAMO ako svojstvo "AssessPriorKnowledge" postoji u JSON-u i nije prazan string.
    - Postavi ga odmah nakon bloka <h3>🎯 Ciljevi učenja</h3> te lekcije.

    Renderovanje:
        - <h3>💡 Procena predznanja</h3>
        - Renderuj sledeći pasus: <p><strong>Napomena za nastavnika: </strong>Aktiviranje predznanja učenika nije samo zagrevanje – to je neuronauka na delu. Ovaj proces aktivira postojeće neuronske puteve, olakšavajući mozgu da poveže nove informacije sa onim što je već poznato. Ova tehnika, nazvana elaborativno kodiranje, pomaže učenicima da brže i efikasnije prebace znanje u dugoročnu memoriju, poboljšavajući i razumevanje i zadržavanje. </p>
        - Pregled:
            - Renderuj bilo koje uvodne pasuse sa skriptom nastavnika koji uvode aktivnost kao jedan ili više <p> blokova pre bilo kakvih lista.
        - Uputstva:
            - Renderuj uputstva nastavnika kao listu sa mecima (<ul>) gde svako uputstvo postaje jedan <li> običnog teksta (NEMOJ uključivati HTML unutar <li>).
            - NEMOJ gnezditi liste unutar bilo kog <li>; sve liste moraju biti na najvišem nivou i sadržati samo <li>.
        - Šablon/Struktura:
            - Renderuj Šablon/Struktura tekst kao jedan pasus <p> koji sadrži skriptu nastavnika (npr. Kaži: ... Uradi: ...), pamteći precizne reči i interpunkciju.
            - Odmah posle tog <p>, ako su dostavljeni očekivani odgovori učenika, renderuj:
            <p>✅ Očekivani odgovori učenika</p>
            praćeno sa <ul> gde je svaki odgovor jedan <li> u vidu običnog teksta.
            - NEMOJ staviti ove liste ispod bilo kog drugog <li> ili liste.
        - Završne linije:
            - Svaka završna rečenica za nastavnika data u posebnom pasusu treba biti renderovana u posebnom <p> posle lista.
        - Ograničenja:
            - Zadrži originalne reči; nemoj prepričavati niti sažimati sadržaj.
            - Koristi samo dozvoljene tagove; liste mogu sadržati samo <li> kao direktnu decu; bez gnježdenja unutar <li>.
            - Obezbedi dobro uvlačenje u kodu i samo obični tekst unutar <li>.
        - Alternativne opcije:
            - Stavi ovo NAKON zatvorenog </ol> glavne liste s brojevima.
            - Prvo: <p><strong>Alternativne opcije</strong></p>
            - Potom renderuj nezavisnu glavno-nivojsku listu <ol> gde je svaka opcija jedan <li> kao rečenica s običnim tekstom.

Nemoj izmišljati sadržaj; samo restrukturiraj ono što postoji unutar Lesson.AssessPriorKnowledge.

DIREKTNA PREZENTACIJA (DIRECT PRESENTATION)
    - Renderuj Direktna prezentacija sekciju (ako je prisutna za tu lekciju) kao:

    - <h3><span style="color: rgb(115, 191, 39);">Direktna prezentacija (10 min)</span></h3>
    - Materijali (ako ih ima):
    - <p><strong>📚 Materijali</strong></p>
    - <ul> sa <li> stavkama iz DirectPresentation.Materials.
    - Uputstva za nastavnike:
    - <p><strong>📋 Instrukcije za nastavnike</strong></p>
    - Renderuj skriptu za nastavnike kao niz <p> blokova. Svaka rečenica za nastavnika koja počinje oznakama kao što su "Kaži:", "Uradi:", "Pitaj:", "Zapiši:", ili "Nacrtaj/Prikaži:" treba da bude u sopstvenom numerisanom <p> pasusu kada predstavlja objašnjenje ili postavljanje scene (na primer: Kaži: "…", Uradi: Prikaži …).
    - VAŽNO: Kad god naiđeš na odgovore učenika (npr., "✅ Očekivani odgovori učenika:"), NEMOJ ih uključivati unutar bilo kog <p> bloka. Umesto toga, UVEK ih renderuj kao nezavisnu listu <<ul> najvišeg nivoa neposredno nakon odgovarajućeg <p> bloka. Svaki pojedinačan odgovor MORA biti u sopstvenom <li> elementu. NEMOJ kombinovati više odgovora u jedan <li>. Svaki <li> mora početi oznakom: "✅ Očekivani odgovori učenika — ".
    - Ako, umesto toga, odlučiš da renderuješ GLAVNE korake kao listu, koristi <ul> najvišeg nivoa gde je svaki GLAVNI korak jedan <li>. Svaki takav <li> MORA sadržati samo običan tekst (bez HTML oznaka unutar <li>). Zadrži nastavnička uputstva kao običan tekst unutar tih <li>-jeva.
    - NEMOJ ugnježđivati <ul>, <ol>, <p>, <span>, ili bilo koji drugi HTML unutar <li>. Da bi prikazao pod-tačke, izjave, pitanja, modelovane odgovore ili raspoređene potkorake, ISRAVNAJ ih kao dodatne redom poređane <li> unose najvišeg nivoa neposredno nakon roditeljskog koraka, koristeći jasan prefiks koji ih povezuje nazad sa roditeljskim korakom. Primeri potrebnih prefiksa:
        - "Povezano na prethodni korak: …"
        - "Od koraka 2: …"
        - "Korak 3.a — …"
    - Očekivani odgovori učenika koji bi normalno bili ugnježdeni MORAJU biti poravnati kao pojedinačni <li> elementi najvišeg nivoa. Svaki takav <li> mora početi sa oznakom običnog teksta:
        ✅ Očekivani odgovori učenika — [Tekst odgovora]
           - Zadrži jedan odgovor po <li>.

        7) Strogo formatiranje i bezbednost:
           - Koristi isključivo dozvoljene HTML oznake (<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>).
           - Liste smeju sadržati samo <li> za direktne potomke. Bez ugnježdenih listi unutar <li>.
           - Čuvaj precizne autentične reči nastavnika iz JSON-a; ne izmišljaj nit vrši rezime.
           - Omogući čitljivo uvlačenje u kodu.

        PRIMENI OVA PRAVILA MAPIRANJA:
      (Jedan odgovor po <li>; UVEK ih razdvoj; nemoj ih spajati crticama niti kombinovati unutar jednog <li>.)
    - Za Brze provere koje bi bile umetnute u niz, koristi globalni obrazac ✔Brza provera i ✅ Očekivani odgovori učenika.
    - Posle poslednjeg koraka ili konačnog <p>/<ul> bloka, ZATVORI <ul> oznaku ako si je prethodno otvorio za GLAVNE korake i tu nastavi na bilo koji sledeći odeljak kako se traži.
    - Moguća pogrešna uverenja (ako ih ima):
    - <p><strong>⚠️ Moguća pogrešna uverenja</strong></p>
    - Prikazuj pogrešna uverenja unutar minimalnog pasusa redni <p> ili kroz <ul><li>…</li></ul>. Nemoj postavljati dodatne liste unutar <li> - ograniči to na najviši nivo <ul> lista gde je svaki <li> običan tekst.
    - Transcendentno razmišljanje (ako ga ima):
    - <p><strong>🌍 Transcendentno razmišljanje</strong></p>
    - Koristi <p> pasuse za pojašnjavajući tekst, i <ul><li>…</li></ul> za primere. Drži svaki <li> običnim tekstom.
    - Ako su dati primeri/odgovori sa modelom, koristi globalni obrazac odgovora:
    - <p>✅ Očekivani odgovori učenika</p> obrati pažnju da odgovarajuća lista bude izvan bilo kojeg <li> (ili na vrhu <ul> nivoa ili poravnata iz glavne <ol>), tako da nema HTML ugnježđenja u elemente sa listama.
    - Brza provera (Quick Check) (ako postoji):
    - Iskoristi ✔Brza provera globalno zaglavlje i zatim task ✅ Očekivani odgovori učenika sa propisanim presek strukturom.

VOĐENA PRAKSA (GUIDED PRACTICE)
    - Renderuj Vođenu praksu (ako je prisutna) kao:

    - <h3><span style="color: rgb(115, 191, 39);">Vođena praksa</span></h3>
    - Materijali (ako ih ima):
    - <p><strong>📚 Materijali</strong></p>
    - <ul> sa <li> stavkama iz GuidedPractice.Materials.</ul>

    - Uputstva za nastavnike:
    - <p><strong>📋 Instrukcije za nastavnike</strong></p>
    - Renderuj skripte za nastavnike kao niz <p> blokova.
    - Svaki obeleženi korak iz JSON-a (1., 2., 3...) treba da počne sopstveni tekstualni <p> blok.
    - Ako faza obuhvata potupite (poput Cirkularni podsticaj Korak 6):
        - Renderuj svaki podsticaj unutar <p> bloka (npr. "Podsticaj 1: '...'").
        - Renderuj "✅ Očekivani odgovori učenika" kao sopstveni <p>.
        - Renderuj prateće uzorke odgovora kao listu <ul> za metak gde svako ležište svog <li>.
    - Za Brzu proveru na kraju (Quick Check):
        - Renderuj <p><strong>Brza provera</strong> "{ZadatakTekst}"</p>
        - Renderuj <p>✅ Očekivani odgovori učenika</p>
        - Renderuj liste odgovora pod <ul><li> listom.
    - Dodatna pravila prezentacije (primeniti opciju odozgo):
      - Za rad u grupama/partnerima, uloge, rotacije i postavljanje materijala: učini svaku preciznu rečenicu i sopstveni <p>, čuvajući uloge imena i vreme tačno kako je i zatraženo.
      - NEMOJ izmišljati ili rezimirati sadržaj; samo restrukturiraj šta piše na JSON-u.
      - Održavaj tačno obrazac uzorka prilikom renderovanja brzih odgovora i provere rezultata.

    - Diferencijacija (ako postoji):
    -  <p><strong>🪜 Diferencijacija</strong></p>
    -  Koristi <p> blokove za objašnjavajući tekst.
    -  Za označene podsekcijske naslove kao "Učenici koji uče jezik", "Dodatni oslonac", "Za napredne učenike" (ili sl.):
        - Primeni <p><strong>Oznaka</strong></p> na takav presek.
        - Spusti nivo najvišeg <ul><li>…</li></ul> s čistim opcijama teksta <li> stavki (bez ugnježdenja).

    - Prilagođavanja i modifikacije (ako postoje):
    -  <p><strong>🤝 Prilagođavanja i modifikacije</strong></p>
    -  Pokreni sa prvom linijom gde se podnosi opšta podrška, recimo <p><strong>Opšta podrška:</strong></p>
    -  Prikaži spisak uz pomoć opštih podršaka najvišeg nivoa <ul>. Svaki <li> je običan tekst.
    -  Nakon osnovnih oblika podržavanja, vrši renderovanje pojedinačne podrške učenicima:
        - Koristite naslov paragrafa: <p><strong>Individualna podrška:</strong></p>
        - Za svako dete prema unutar IndividualSupport niza:
            - Renderuj ime učenika unutar <p> sa crvenim tekstom: <p><span style="color: rgb(204, 0, 0);">Ime Učenika</span></p>.
            - Onda izgradi <ul> elemente za prebacivane vrednosti s dva <li>:
                - <li>{PlanProvided}</li>
                - <li>{PlanImplementation}</li>
            - Ponovi ovaj obrazac za svakog đaka.
    - KORISTI ZADANA IMENA ISKLJUČIVO obležena kroz planirane liste iz JSON liste (lista IndividualSupport); zaboravi na smišljanja ekstra imena i izmišljanja.

    Zabeleške (sumacija svih pravila o kompatibilnosti):
    - Nikada ne puštaj HTML tagove u formaciju instrukcione <li> naređivane liste glavnom stranom; one od <li> moraju ostati čist običan tekst.
    - Reprezentuj preklapanu formu ravnajući ih uz nivo dodatnim najvišim redom za red rečenih <li> prefiksa (u Proveri Prethodna Znanja objašnjeno).
    - Koristi paragarfske labele (<p><strong>…</strong></p>) i sve ostale glavno nivove liste (<ul>, <ol>) van osnovnih oznaka bez onih čisto-tekstualnih <li>.

SAMOSTALNI RAD (INDEPENDENT PRACTICE)
    - Renderuj Samostalni rad (ako je prisutna) kao:

    <h3><span style="color: rgb(115, 191, 39);">Samostalni rad</span></h3>
    - Materijali (ako ih ima):
    - <p><strong>📚 Materijali</strong></p>
    - <ul> sa <li> stavkama za IndependentPractice.Materials.</ul>
    - Svrha:
    - <p><strong>Svrha:</strong></p>
    - Obaraj samo format teksta preko <p> zatekst.

    - Uputstva za nastavnike:
    - Renderuj svaki nastavnički instrukcijski zadatak kao zaglavlje u ovom tačnom obrascu:
      <p><strong>Zadatak N (DOK X):</strong> Napomene za nastavnika: [tekst napomena za nastavnika]. Kaži: "…"</p>
      - Zamenite N brojem zadatka po rastućem redu, a X sa ponuđenim nivoom DOK-a.
      - Umetnite sve etikete i uputstva skripte za uloge i napomene (Kaži:, Uradi:, Pitaj:, Zapiši:, Nacrtaj/Prikaži:, Slušaj da čuješ:) doslovno u paragraf.
      - Ako je tekst pasoša sa zadatkom prazan, u potpunosti izostavite taj zadatak.
    - Ako postoje Očekivani odgovori učenika za zadatak, odmah renderujte iza paragrafa za zadatak:
      <p>✅ Očekivani odgovori učenika</p>
      <ul><li>Odgovor 1</li><li>Odgovor 2</li></ul>
      - Koristite <ul> ili <ol> u zavisnosti od toga da li su odgovori jasno naređeni. Svaki odgovor je jedan <li>. Zabrani ugnježdenje lista unutar <li>.
    - Ako za zadatak postoje kriterijumi za uspeh (Success Criteria), prikazujte:
      <p>Kriterijumi uspeha</p>
      <ul><li>Kriterijum 1</li><li>Kriterijum 2</li></ul>
      - Izostavite ovo odeljak ako je prazan.
    - Ako postoji polje za razmišljanje u formaciji i zadatku, izdvojiti:
      <p><strong>Refleksija:</strong></p>
      - Potom koristi svaku stavku preko izdvojeno formirane rečenice ili prompta na svome sopstvenom <p>.
    - Prikupite navode zadatka u rastućem redosledu preko podizanja niza bez odricanja odsečka. Ostavite ako je golo string odsek preskočenom serijom praznim.
    - Isključivo koristite odobrene etikete, kao po globalnom pravilu.
    - NE SRASTITE unutar liste u formi isplaniranom Procena Pravila za prezentaciju predstave <ol>; jer je ovo alternativni format pa se mora koristiti kako kaže primer strukture.

PREGLED I PRISEĆANJE UZ VREMENSKE RAZMAKE (REVIEW & SPACED RETRIEVAL) (5 min)
    - <h3><span style="color: rgb(115, 191, 39);">Pregled i prisećanje uz vremenske razmake (5 min)</span></h3>
    - Renderuj ReviewAndSpacedRetrieval podatke sledeći stroga pravila mapiranja:
        - Zaglavlje 📚 Materijali: Sledi lista predmeta.
        - Oznaka Napomene za nastavnika: Prepisati iz teksta format <p><strong>Napomene za nastavnika:</strong> [tekst napomena]</p>.
        - Zaglavlje 📋 Instrukcije za nastavnike: Renderuj kao <p><strong>📋 Instrukcije za nastavnike</strong></p>.
        - Podnaslov Aktivno prisećanje: Renderuj kao <p><strong>Aktivno prisećanje</strong></p>. Prate redovi kroz numeri i uz "Kaži:" oznaku s tekstovima pod ulogom skripte.
        - Ispostavi i prati šablon globalnih pregrada ✅ Očekivani odgovori učenika sa svim primercima modela i odgovora.
        - Podnaslov Ispravka čestih pogrešnih uverenja: Bold. Kreni kroz <ul> i prikaži svaku "Ako učenik kaže... odgovori:..." kao njen tipski <li>.
        - Podnaslov 💭Veza sa ključnim pitanjem: Bold.
        - Podnaslov 🌍Transcendentno razmišljanje: Bold.
        - Podnaslov ⏳Prisećanje uz vremenske razmake: Bold.
        - Zadrži strukturu na vizuelno predstavljenom primerku obezbeđenu sliku na odsečak za (brojne sekvencije zadataka, napomenu, mete).

FORMATIVNA PROCENA (FORMATIVE ASSESSMENT) (Renderovana kao deo pregleda)
    - <p><strong>✅Formativna procena</strong></p>
    - Navedi početni <p> pasus uvoda ako postoji.
    - Za svaki upit/zadatak Prompta N (DOK X):
        - <p><strong>Uputstvo N (DOK X):</strong> {PitanjeZadatka}</p>
        - Isključivo ispišite odsečak formiran uz red pod imenom "✅ Očekivani odgovori učenika" pod samom vrstom formata bloka <p>. Koristi oznaku ✅ u prepoznavanja.
        - Isporuka odgovora iznjedri na površni red u <ul> opstankom odabranog dela u <li> sa po jednim elementom za svaki odgovor.

Gruba pravila i stroga zaštita na uvid (bez ugnježdenja, UI sigurno):
    - Uputstva (Prompts):
       - ZA SVAKI zahtev u rastućem rangu puste samo JEDNU oznaku formatiranu uz presek običnog <li> sa ovim u njemu isključivo:
    Uputstvo X (DOK Y) — "Tekstualno pitanje"
    - Bez implementacije ikakve HTML modifikacije unutar postavljenog tipičnog bloka <li>.
    - Ne prizvati p-odjeljak unutar <li> formiranog lica.
    - Očekivani rezultati (za direktno i jedinačno ispoljene odseče bez potporodavnih obrisa lista):
    - ODMAH POZADI nad samom podmetnutom instrukcijom liste na izlazu u istom <ul> za red čekanja izdvojan na očekivane izlive s tekstom započinjane za sve redove i polja isključivo zapravo od tipskih pravila običnih <li> početaka na ovo:
    ✅ Očekivani odgovor učenika — Tekst samog odgovora
        - Svaki red ima unutar sam svoj <li> element reda.
        - Strogo BEZ formacija usred navođenja ostale linije <ul> ili <ol> listana igde usmeravanja za proceniteljske Formativne liste sa obzirom opazivačke.
        - Zapečati izvesnu grupaciju </ul> nakon redosledne izgrade instrukcije za procene prekidno s radnim opismenjenjem istih predložaka usko odraženih za izlive odgovor <li> elemenata.

Refleksija:
    - Odradite sve za postavljanje i zatvaranje iz grane za refleksiju čisto paragrafe:
    - <p><strong>Refleksija:</strong></p>
    - <p>Uputstva za samoregulaciju: ...</p>
    - <p>Transcendentna pitanja: ...</p>

VEŽBA UČENIKA (STUDENT PRACTICE)
    - <h3><span style="color: rgb(115, 191, 39);">🖊 Vežba učenika</span></h3>
    - <p><strong>Napomene za nastavnika:</strong> {StudentPractice.StudentPractice_TeacherNotes}</p>

    - Za svaki deo naveden u zahtevnoj listi za formaciji StudentPractice.StudentPractice_Tasks (Brojčano obelezavani znakom od 1, 2, 3...):
        - <p><strong>{Number}. ({DOK})</strong> {StudentDirections}</p>
        - <p><strong>Kriterijumi uspeha</strong></p>
        - Postavi <ul> oznaku na svaku stavku zvanu KriterijumUspeha pod vrstom <li> rasporeda.
    - Ukoliko izlaže da prepliće i da postoji (ako matematike ima istaklo StudentPractice.StudentPractice_InterleavingIfMath bez prebrojavanja da je isključivo nevažeći i obrisan string oblik):
        - <p><strong>Preplitanje (Matematika opcija)</strong></p>
        - Obezbedite polje za uvezivanje materijala sa preplitanja koristeći jednog a potom nekoliko odvojenih slova na formaciji blokova za <p> i prikazujući obrise kao jedan ili nekoliko različitih opcija.

KRAJNJI ZAKLJUČCI INSTUKCIJE ZA IZLAZENJE
    - Predaj OBAVEZNO samo HTML uz upotrebljenu tehniku svih obeleženih dozvoljenih tagovima unutar GLOBALNIH PRAVILA na navedenom nizu.
    - Ni u kom slučaju modifikacija od drugih HTML elementarnih tagova.
    - Učinite postojanim sa datim JSON opsežno ustavljenim rasporedima prateće osnove bez promena postavljenih obrazaca na redu ređenjima kroz gore izneto pravila.
    - NEMOJ da se isključi bez ikakvih manevra dodato obeleženje u uvodnim momentu prema predjelu za naslov (ne prihvataj i odbij se u korišćenje bilo kojeg od <h2> tagova obeleženja); otvori opcijum obimnoj usmernosti predloška ditektnim prilagođavanjem sekcije krećući izravno prelaškog tipa počivši prema prvoj glavi sekcije za sam <h3>💭 Ključna Pitanja</h3> za lekciju i bez oklevanja usled na put do nastavka prema postavljenom zahtevu.
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
        "LessonPlanResponse": "UnitPlanResponse",
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
                    "EssentialQuestions": {
                        "type": "array",
                        "description": "Zalepi doslovno ključna pitanja sa nivoa jedinice istim redosledom ako su data. Ako nisu data, kreiraj ključna pitanja koja se fokusiraju isključivo na široke, univerzalne koncepte kao što su promena, dokazi, obrasci, odnosi, sistemi ili zaključivanje. NEMOJ pominjati usko stručne termine specifične za predmet, procese, vokabular ili primere. Pitanja moraju biti otvorenog tipa, prenosiva kroz sve discipline i nemoguća za odgovor jednostavnim učenjem sadržaja lekcije ili jedinice. Fokusiraj se samo na velike ideje, a ne na samu materiju predmeta.",
                        "items": {
                            "type": "string"
                        }
                    },
                    "KeyVocabulary": {
                        "type": "array",
                        "description": "Kompletan odeljak 'Ključni vokabular' kao lista stringova. Svaki string treba biti jedan termin sa definicijom odvojenom crticom. Primer: 'Gravitacija - Sila koja privlači objekte jedan prema drugom'. Sve definicije moraju biti kratke, prilagođene uzrastu i direktno povezane sa sadržajem lekcije.",
                        "items": {
                            "type": "string"
                        }
                    },
                    "StudentLearningObjectives": {
                        "type": "array",
                        "description": "Kompletan odeljak 'Ciljevi učenja učenika' kao običan tekst. Svaka stavka mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se sa DOK oznakom u zagradi, npr. 'Modeliraj kako rotacija Zemlje oko svoje ose uzrokuje dan i noć (DOK 2).'",
                        "items": {
                            "type": "string"
                        }
                    },
                    "StandardsAligned": {
                        "type": "string",
                        "description": "Kompletan odeljak 'Usklađeno sa standardima' za lekciju. Svaki standard mora uključiti kod i opis i moraju biti potpuno isti kao oni korišćeni u jedinici."
                    },
                    "AssessPriorKnowledge": {
                        "type": "string",
                        "description": "Kompletan odeljak 'Procena predznanja' kao običan tekst (ukupno 150-250 reči). SAMO Lekcija 1 treba da sadrži detaljan blok; SVE OSTALE LEKCIJE MORAJU VRATITI PRAZAN STRING za ovo polje. Za Lekciju 1, struktura mora uključivati: 1. Uključi ovaj odeljak samo u prvu lekciju jedinice, postavljen odmah iza Ciljeva učenja učenika. 2. Osiguraj korišćenje podsticaja na DOK 1-3 nivoima. 3. Uključi preduslovne veštine potrebne za ostvarivanje ciljeva učenja učenika. 4. Izaberi jedan modalitet sa ove liste i u potpunosti ga razvij: postavljanje pitanja, K-W-L, vizuelna sredstva, konceptualne mape, reflektivno pisanje, upitnici o očekivanjima (anticipation guides), ocene vokabulara. 5. Početni podsticaj nastavnika sa 'Kaži:' ('Say:') izjavom koja predstavlja izabrani modalitet i objašnjava kako će učenici izraziti trenutno razumevanje. 6. Jasna uputstva i šablon/struktura za izabrani modalitet. 7. Odeljak 'Očekivani odgovori učenika' ('Expected Student Responses') koji prikazuje predviđene odgovore ili česta pogrešna uverenja za odabrani modalitet. 8. Završni podsticaj nastavnika pomoću 'Kaži:' koji potvrđuje učeničko razmišljanje i daje uvid u predstojeće istraživanje u okviru jedinice. 9. Nakon u potpunosti razvijenog jednog modaliteta, pruži 2 kratke alternativne opcije koje bi nastavnik mogao odabrati."
                    },
                    "DirectPresentation": {
                        "type": "object",
                        "description": "Kompletan odeljak 'Direktna prezentacija' kao običan tekst. Ovo je PRVA aktivnost u učionici i NE SME trajati duže od 10 minuta.",
                        "properties": {
                            "Materials": {
                                "type": "array",
                                "description": "Spisak potrebnih materijala (npr. vizuelna pomagala, markeri, itd.)",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "InstructionsForTeachers": {
                                "type": "string",
                                "description": "Korak po korak instrukcije za nastavnika prateći ovaj TAČAN redosled: (1) UVOD (HOOK) (1-2 min), (2) PREDSTAVLJANJE (INTRODUCTION) (1-2 min), (3) DIREKTNO PODUČAVANJE (DIRECT TEACHING) (4-5 min), i (4) VOĐENI ANGAŽMAN (GUIDED ENGAGEMENT) (2-3 min). VAŽNO: NEMOJ uključivati naslove '1. UVOD (HOOK) (1-2 min)', '2. PREDSTAVLJANJE (INTRODUCTION) (1-2 min)', '3. DIREKTNO PODUČAVANJE (DIRECT TEACHING) (4-5 min)', ili '4. VOĐENI ANGAŽMAN (GUIDED ENGAGEMENT) (2-3 min)' u finalni string. Umesto toga, navedi sadržaj svake komponente direktno počevši od prvog uputstva (Kaži:, Uradi:, itd.). Svaki deo mora uključivati nastavnikov govor (Kaži:/Pitaj:), akcije (Uradi:/Zapiši:/Nacrtaj/Prikaži:), i odgovore učenika (✅ Očekivani odgovori učenika: - sa stavkama liste). Sav sadržaj mora biti naučno tačan i prilagođen uzrastu."
                            },
                            "AnticipatedMisconceptions": {
                                "type": "string",
                                "description": "Uobičajena pogrešna uverenja i tačan jezik za korigovanje svakog"
                            },
                            "TranscendentThinking": {
                                "type": "string",
                                "description": "Pitanja iz stvarnog sveta koja povezuju učenje sa smislom/velikim idejama, sa očekivanim odgovorima."
                            },
                            "QuickCheck": {
                                "type": "string",
                                "description": "Finalna provera razumevanja. Ovo MORA biti individualni zadatak za SVAKOG učenika. Uključi 2-3 očekivana odgovora."
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
                    "GuidedPractice": {
                        "type": "object",
                        "description": "Struktuirani odeljak Vođena praksa sa dodacima.",
                        "properties": {
                            "Materials": {
                                "type": "array",
                                "description": "Potrebni fizički predmeti za vođenu praksu, kao lista.",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "InstructionsForTeachers": {
                                "type": "string",
                                "description": "400–600 reči. Formatiraj kao strogo numerisanu listu aktivnosti nastavnika (1, 2, 3...). Svaki korak treba kombinovati aktivnosti nastavnika (Prikaži:, Na tabli, zapiši:, Demonstriraj:) i nastavničku skriptu (Kaži:). Korak 6 MORA biti 'Dok učenici rade, cirkuliši i koristi ove podsticaje:' praćen sa 2-4 podsticaja prilikom cirkulacije (circulation prompts), gde svaki mora imati svoju '✅ Očekivani odgovori učenika' ('Expected Student Responses') oznaku i primere odgovora numerisane tezama (bullets). Završi odeljak podebljanim zaglavljem 'Brza provera' ('Quick Check'), navodeći individualni zadatak, i primere odgovora."
                            },
                            "Differentiation": {
                                "type": "string",
                                "description": "Trodeli strategija diferencijacije koja uključuje: (1) Podršku za učenike koji uče jezik (2-3 strategije), (2) Dodatnu podršku skeliranjem / osloncem (Additional Scaffolding) (2-3 strategije), (3) 'Za napredne učenike' (Go Deeper) proširenja (1-2 aktivnosti sa očekivanim odgovorima)."
                            },
                            "AccommodationsAndModifications": {
                                "type": "object",
                                "description": "Opšta podrška za odeljenje plus individualni planovi. Samo data imena iz upita.",
                                "properties": {
                                    "General": {
                                        "type": "string",
                                        "description": "Opšte podrške za obezbeđenje materijala u učionici."
                                    },
                                    "IndividualSupport": {
                                        "type": "array",
                                        "description": "Samo prosleđeni učenici.",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "StudentName": {
                                                    "type": "string"
                                                },
                                                "PlanProvided": {
                                                    "type": "string",
                                                    "description": "MORA da se slaže sa planom i imenom."
                                                },
                                                "PlanImplementation": {
                                                    "type": "string",
                                                    "description": "Konkretni alati za ovaj zadatak."
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
                    "IndependentPractice": {
                        "type": "string",
                        "description": "Kompletan odeljak 'Samostalni rad' kao običan tekst. Struktura mora pratiti sledeći format: Započni sa zaglavljem 'Materijali' i jednostavnom listom potrebnih predmeta. Zatim pasus 'Svrha' koji objašnjava kako vežba jača razumevanje i prenos znanja. Zatim 3-4 sekvencijalno numerisana zadatka sa oznakom 'Zadatak 1 (DOK nivo):', 'Zadatak 2 (DOK nivo):', itd. Za svaki zadatak: - Kratke 'Napomene za nastavnika:' (Teacher Notes) koje objašnjavaju vezu sa lekcijom/ciljevima. - Obavezna 'Kaži:' izjava sa tačnim podsticajem nastavnika. - 'Očekivani odgovori učenika' sa primerima odgovora. - 'Kriterijumi uspeha' koji navode 2-4 elementa koji pokazuju majstorstvo. Odeljak 'Refleksija' koji sadrži: - 2 pitanja za samoregulaciju o upravljanju učenjem. - 2 transcendentna pitanja o širem uticaju/budućnosti. Na kraju zadatak za obogaćivanje 'Za one koji završe ranije' (Early Finishers) koji: - Koristi iste osnovne koncepte na većoj dubini. - Navodi specifične elemente koje učenici moraju obuhvatiti. - Zahteva primenu tačnih principa sadržaja."
                    },
                    "ReviewAndSpacedRetrieval": {
                        "type": "string",
                        "description": "Kompletan odeljak 'Pregled i prisećanje uz vremenske razmake' kao običan tekst. Ova 5-minutna aktivnost mora da sadrži sledeće elemente u ovom tačnom redosledu: 1. Lista materijala (Materials List) (često ništa nije opcionalno) 2. Pasus sa napomenama za nastavnika (Teacher Notes) koji objašnjava: - Kako ova strategija pregleda poboljšava memorisanje - Vezu sa prethodnim konceptima učenja - Kako prisećanje uz vremenske razmake produbljuje razumevanje. 3. Instrukcije za nastavnike koje sadrže: - Aktivno prisećanje pomoću deljenja sa partnerom/grupom - Očekivane odgovore učenika (2-3 primera). 4. Blok za Ispravku čestih pogrešnih uverenja (Correct Common Misconceptions) sa: - Izjavama koje predstavljaju primer pogrešnog uverenja - Skriptama nastavnika za ispravku. 5. Veza sa ključnim pitanjem (Essential Question Connection) što uključuje: - Nastavnikovo pitanje vezano za ključno pitanje celine - Očekivane odgovore učenika (2-3 primera). 6. Odeljak za transcendentno razmišljanje sa: - Primenom u stvarnom svetu - Vreme za razmišljanje - Očekivanim odgovorima učenika (2-3). 7. Komponenta prisećanja uz vremenske razmake (Spaced Retrieval) koja sadrži: - Jasnu referencu na određenu prošlu lekciju - Pitanje koje povezuje prošle i trenutne koncepte - Detaljne kriterijume uspeha / očekivane odgovore. Svi odeljci moraju koristiti 'Kaži:' za instrukcije nastavnika i jasno obeležene 'Očekivani odgovori učenika' ('Expected Student Responses')."
                    },
                    "FormativeAssessment": {
                        "type": "string",
                        "description": "Kompletan odeljak 'Formativna procena' kao običan tekst. Ovo MORA sadržati tačno 4 pitanja označena sa 'Uputstvo 1 (DOK 1):', 'Uputstvo 2 (DOK 2):', 'Uputstvo 3 (DOK 3):' i 'Uputstvo 4 (DOK 4):'. Za svako uputstvo: - Pitanje koje testira razumevanje na navedenom nivou DOK - Zaglavlje '✅ Očekivani odgovori učenika' - 1-2 primera odgovora. NEMOJ uključiti odeljak 'Refleksija'. Primer formata: Uputstvo 1 (DOK 1): 'Zašto planete ostaju u orbiti?' ✅ Očekivani odgovori učenika - 'Gravitacija i kretanje unapred.' [Nastavi za Uputstva 2-4]"
                    },
                    "StudentPractice": {
                        "type": "object",
                        "additionalProperties": false,
                        "required": [
                            "StudentPractice_TeacherNotes",
                            "StudentPractice_Tasks",
                            "StudentPractice_InterleavingIfMath"
                        ],
                        "properties": {
                            "StudentPractice_TeacherNotes": {
                                "type": "string",
                                "description": "Jedan pasus koji počinje sa 'Ovi zadaci pojačavaju današnje učenje o ____ kroz ______.' za domaći zadatak (Student Practice)."
                            },
                            "StudentPractice_Tasks": {
                                "type": "array",
                                "minItems": 2,
                                "maxItems": 3,
                                "description": "Zadaci samo na nivou DOK 2, 3, i 4.",
                                "items": {
                                    "type": "object",
                                    "additionalProperties": false,
                                    "required": [
                                        "DOK",
                                        "StudentDirections",
                                        "SuccessCriteria"
                                    ],
                                    "properties": {
                                        "DOK": {
                                            "type": "string",
                                            "description": "DOK 2, 3, ili 4 isključivo."
                                        },
                                        "StudentDirections": {
                                            "type": "string"
                                        },
                                        "SuccessCriteria": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            },
                            "StudentPractice_InterleavingIfMath": {
                                "type": "string",
                                "description": "SAMO ako je predmet matematika preplitanje (interleaving), u suprotnom prazan niz."
                            }
                        }
                    }
                },
                "required": [
                    "EssentialQuestions",
                    "KeyVocabulary",
                    "StudentLearningObjectives",
                    "StandardsAligned",
                    "AssessPriorKnowledge",
                    "DirectPresentation",
                    "GuidedPractice",
                    "IndependentPractice",
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
                "GuidedPractice.AccommodationsAndModifications"
            ]
        }
    }
};