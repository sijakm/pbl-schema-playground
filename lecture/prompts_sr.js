window.labPromptsSR = {
  STEP0_PROMPT_TEMPLATE: `
Kreirajte plan jedinice i strukturu lekcije koristeći informacije u nastavku. NE pišite kompletne planove lekcija.
                    
Na osnovu predmeta jedinice (Unit Subject), obrazovnih standarda, opisa/uputstva jedinice (Unit Description/Instruction), razreda/nivoa obrazovanja (Grade Level), trajanja časa u minutima (Duration of class period) i zahtevanog broja lekcija (Number of Lessons), generišite JSON odgovor koji uključuje kohezivan UnitDescription i listu "kontejnera" lekcija koji se ne preklapaju.

Predmet jedinice:
{{$Subject}}

Naziv jedinice:
{{$Name}}

Opis/uputstvo jedinice:
{{$UserPrompt}}

Razred/nivo obrazovanja:
{{$GradeLevel}}

Trajanje časa u minutima:
{{$ClassDuration}}
	
Standardi za usklađivanje:
{{$Standards}}
    
Učenici sa individualizovanom podrškom:
{{$LearningPlans}}

Resursi/mediji za korišćenje:
{{$MediaContext}}
	
Sadržaj jedinice:
{{$AttachedUnit}}

Zahtevi za suštinska pitanja (Essential Questions):
- Svako pitanje MORA biti potpuna, gramatički ispravna rečenica koja se završava upitnikom.
- Svako pitanje MORA početi sa "Kako" ili "Zašto".
- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definiciona.
- Pitanja MORAJU biti fokusirana na široke, univerzalne ideje (kao što su promena, dokaz, obrasci, odnosi, sistemi ili rezonovanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti prenosiva na druge discipline i primenjiva izvan ove jedinice.
- Pitanja MORAJU biti ponovljena doslovno u svakoj lekciji unutar jedinice.

Šta treba generisati:
- Izlaz MORA biti validan JSON koji odgovara šemi.
- OBAVEZNO: U potpunosti popunite sva svojstva unutar objekta "UnitDescription":
  - "Description": Napišite pasus od 4-5 rečenica koji opisuje fokus jedinice i narativno putovanje.
  - "StudentLearningObjectives": Navedite 3-5 ključnih merljivih ciljeva učenja za jedinicu.
  - "StandardsAligned": Navedite sve standarde koji se obrađuju tokom jedinice.
  - "EssentialQuestions": Tačno 3 konceptualna pitanja prateći gore navedena pravila.
- GENERIŠITE listu "Lessons" koja sadrži tačno {{$NumberOfItems}} lekcija.
  - Svaka lekcija mora uključivati "lessonNumber" (indeks od 1), "lessonName" i "lessonDescription" (Pasus od 2–4 rečenice koji opisuje obim lekcije).

Ograničenja:
- Držite jedinicu i svaku lekciju usklađenu sa fokusom jedinice.
- Osigurajte logičan redosled od osnovnih ideja do složenijeg modeliranja.
- Tačnost: Sav sadržaj mora biti naučno tačan i prilagođen uzrastu.

Izlaz MORA biti validan JSON koji odgovara šemi. Koristite kompaktno formatiranje (bez dodatnih praznih linija).
`,
  PER_LESSON_PROMPT_TEMPLATE: `
Kreirajte JEDAN plan lekcije za PREDAVANJE (NE plan jedinice, NE više lekcija) koristeći informacije u nastavku.
MORATE generisati validan JSON koji se tačno poklapa sa priloženom JSON šemom. Ne uključujte nikakve dodatne ključeve. Koristite kompaktno JSON formatiranje (bez dodatnih praznih linija).
Predmet jedinice: 
{{$Subject}}
Naziv jedinice: 
{{$Name}}
Opis/uputstvo jedinice: 
{{$UserPrompt}}
Razred/nivo obrazovanja: 
{{$GradeLevel}}
Trajanje časa u minutima 
{{$ClassDuration}}
Resursi/mediji za korišćenje: 
{{$MediaContext}}
Sadržaj jedinice: 
{{$ParentUnitData}}
Standardi za usklađivanje:
{{$Standards}}
Priloženi sadržaj lekcije: 
{{$AttachedLesson}}

Suštinska pitanja jedinice (KORISTITE IH DOSLOVNO):
{{$UnitEssentialQuestions}}

Ako su gorenavedena Suštinska pitanja jedinice prazna, generišite tačno 3 konceptualna pitanja prateći ova pravila:
- Svako pitanje MORA biti potpuna, gramatički ispravna rečenica koja se završava upitnikom.
- Svako pitanje MORA početi sa "Kako" ili "Zašto".
- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definiciona.
- Pitanja MORAJU biti fokusirana na široke, univerzalne ideje (kao što su promena, dokaz, obrasci, odnosi, sistemi ili rezonovanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti prenosiva na druge discipline i primenjiva izvan ove jedinice.


UČENICI SA INDIVIDUALIZOVANOM PODRŠKOM (MORAJU se koristiti SAMO unutar Experiment.AccommodationsAndModifications; koristite imena učenika/planove tačno onako kako su napisani):
{{$LearningPlans}}

VAŽNA PRAVILA ZA SADRŽAJ:
- Držite lekciju usklađenu sa fokusom jedinice: razvoj i korišćenje modela za opisivanje atomskog sastava jednostavnih molekula i/ili proširenih struktura.
- Uključite kratke veze na visokom nivou sa drugim relevantnim DCI-jevima gde je to prikladno, ali držite lekciju usredsređenu na modeliranje i rezonovanje o odnosu strukture i svojstava (bez duboke matematike, bez balansiranja jednačina osim ako to standardi eksplicitno ne zahtevaju).
- Osigurajte da svi delovi lekcije odražavaju Obim/Granice lekcije date u kontekstu jedinice; izbegavajte uvođenje novih velikih koncepata koji pripadaju drugim lekcijama.
- EssentialQuestions: MORA biti tačno jednako suštinskim pitanjima na nivou jedinice (isti tekst, isti redosled).
- AssessPriorKnowledge: SAMO ako je LessonNumber == 1, popunite objekat kako je definisano u šemi. Za SVE OSTALE LEKCIJE, MORATE vratiti prazan objekat {} bez ključeva unutra. NEMOJTE koristiti vrednosti poput "N/A", "none", ili prazne nizove.
- Faze laboratorije (Question, Research, Hypothesize, Experiment, Analyze, Share): Pratite specifične nastavne zahteve i "Purpose:" stringove za svaku fazu definisanu u JSON šemi.
- Experiment.AccommodationsAndModifications mora uključivati opštu podršku praćenu individualnom podrškom za svakog učenika navedenog u {{$LearningPlans}}.
- Kada predlažete "okvire rečenica" (sentence frames) ili "početke rečenica" (sentence starters) bilo gde u planu lekcije (posebno u Individualized Supports), MORATE obezbediti stvarne, specifične rečenice prilagođene sadržaju lekcije kako bi nastavnik mogao direktno da ih koristi.
- StudentPractice MORA uključivati TeacherNotes pasus koji počinje sa 'These tasks reinforce today’s learning about ____ by ______.', listu od 2-3 zadatka sa DOK 2-4 i kriterijumima uspeha, i ispreplitanje (interleaving) ako je predmet matematika.

ZAHTEVI ZA IZLAZ:
- Izlaz MORA biti validan JSON koji se tačno poklapa sa priloženom šemom.
- Izlaz MORA biti samo JEDAN plan lekcije.
- Bez HTML-a. Bez emodžija. Bez markdown-a. Običan tekst unutar string polja.
`,
  HTML_LESSON_PROMPT_TEMPLATE: `Dobićete JEDAN JSON objekat koji striktno prati šemu LabUnitPlanResponse. Vaš zadatak je da transformišete ovaj JSON u čist, čitljiv HTML za jednu lekciju.

FORMAT ULAZA
Poslaću vam JSON objekat na sledeći način:

UNIT PLAN JSON:
{{{JsonResponse}}}

Tretirajte sve nakon linije "UNIT PLAN JSON:" kao tačan JSON objekat. NE objašnjavajte niti komentarišite; samo ga parsirajte i renderujte.

GLOBALNA PRAVILA
    - Izlaz MORA biti isključivo validan HTML (bez markdown-a, bez backticks-a, bez proznih objašnjenja).
    - Dozvoljeni tagovi: <p>, <h1>, <h2>, <h3>, 
    - (umotano unutar <p>), <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - NE koristite nijedan drugi tag (bez <main>, <section>, <header>, <div>, <h4>, itd.).
    - HTML treba da bude lepo uvučen i lak za čitanje.
    - U bilo kom <ol> o <ul>, koristite ISKLJUČIVO <li> elemente kao direktnu decu. Nikada ne stavljajte <p>, <span>, <ul>, <ol> ili bilo koji drugi tag kao dete liste.
    - NE izmišljajte novi nastavni sadržaj; koristite samo ono što postoji u JSON poljima.
    - Sačuvajte logički redosled koji šema nalaže:
    - Unutar svake lekcije, pratite redosled polja u šemi.
    - Ako je tekstualno polje prazno (""), IZOSTAVITE tu podsekciju i njenu oznaku.
    - Ako je niz prazan, izostavite njegov naslov i odgovarajući <ul> ili <ol>.
    - Kad god tekst jasno formira listu pitanja/izjava/odgovora, koristite <ul><li>…</li></ul> ili <ol><li>…</li></ol>. U suprotnom koristite <p>.
    - Kad god renderujete očekivane odgovore učenika u BILO KOJEM odeljku, koristite ovaj šablon:
        - Prvo: <p>✅ Očekivani odgovori učenika</p> (bez tačaka/nabrajanja u ovoj liniji)
        - Zatim <ul> ili <ol> lista koja sadrži odgovore (jedan odgovor po <li>).
    - Kad god renderujete brzu proveru (Quick Check):
        - Koristite tačno ovaj naslov: <h3><span>✔ Brza provera</span></h3>
        - Uključite usklađenost strategije a zatim i pitanje/zadatak pod navodnicima.
        - Koristite globalni šablon za ✅Očekivani odgovori učenika za odgovore.
    - Koristite emodžije ako postoje u sledećim pravilima mapiranja.

PRAVILA MAPIRANJA:

PRVO, uvek generišite ova 4 uvodna odeljka ako su podaci dostupni u JSON-u:
- <h3>💭 Ključna pitanja</h3> (ako je dostupno, UL lista iz EssentialQuestions)
- <h3>🔤 Ključni rečnik</h3> (UL lista iz KeyVocabulary)
- <h3>🎯 Ciljevi učenja učenika</h3> (UL lista iz StudentLearningObjectives)
- <h3>📏 Usklađeni standardi</h3> (UL lista iz StandardsAligned. Čak i ako je ulaz jedan string, parsirajte standarde i renderujte ih kao listu sa tačkama <ul><li>...</li></ul>)

ZATIM, pređite na SECTION 0:

SECTION 0: PROCENA PRETHODNOG ZNANJA (USLOVNO)
==================================================
USLOV: Renderujte ovaj odeljak SAMO ako je trenutna lekcija Lekcija 1. Za sve ostale lekcije preskočite ovaj ceo odeljak (ne renderujte NIŠTA, čak ni naslove).

KRITIČNA PROVERA: Pre renderovanja BILO KOG HTML-a za ovaj odeljak, pogledajte AssessPriorKnowledge objekat.
- Ako je AssessPriorKnowledge {} (prazan objekat), ILI ako je SayIntroduction "", null, " " ili "N/A", PRESKOČITE OVAJ ODELJAK I PREĐITE NA SLEDEĆI. NE zaustavljajte celokupnu generaciju.
- Za sve ostale lekcije (Lekcija 2, 3, itd.) MORATE preskočiti ovaj ceo odeljak bez obzira na sadržaj.

AKO (i samo ako) je trenutna lekcija Lekcija 1 I AssessPriorKnowledge sadrži stvarni sadržaj:
<h3>💡 Procena prethodnog znanja</h3>
<p><strong>Beleška za nastavnika:</strong> Aktiviranje prethodnog znanja učenika nije samo zagrevanje — to je neuronauka na delu. Ovaj proces aktivira postojeće neuronske puteve, olakšavajući mozgu da poveže nove informacije sa onim što je već poznato. Ova tehnika, nazvana elaborativno kodiranje, pomaže učenicima da brže i efikasnije prebace znanje u dugoročnu memoriju, poboljšavajući i razumevanje i retenciju.</p>
  - <p><strong>Recite:</strong> “{SayIntroduction}”</p>
  - <p>Projektujte ili pročitajte sledeće izjave jednu po jednu:</p>
  - <ul>{StatementsToProject}</ul> (svaka stavka kao <li>“Izjava”</li>)
  - <p><strong>Recite:</strong> “{SayInstructions}”</p>
  - <p><strong>✅ Očekivani odgovori učenika</strong></p>
  - <ul>{ExpectedStudentResponses}</ul> (svaka stavka kao <li>“Izjava” → Odgovor</li>)
  - <p><strong>Recite:</strong> “{SayConclusion}”</p>
  - <p>{ActionConclusion}</p>
  - <p><strong>Alternativne opcije</strong></p>
  - <ul>{AlternateOptions}</ul> (svaka stavka kao <li><strong>NazivOpcije:</strong> Opis</li>)
- Ako trenutna lekcija NIJE Lekcija 1, preskočite ovaj ceo odeljak (ne renderujte NIŠTA za AssessPriorKnowledge).



- <h3><span style="color: rgb(115, 191, 39);">Cilj {Duration}</span></h3>
  - <p><strong>Svrha:</strong> Posmatrati fenomen, identifikovati nešto zbunjujuće i formulisati smisleno pitanje koje će voditi istraživanje.</p>
  - <p><strong>📚 Materijali</strong></p> <ul>{Materials}</ul> (svaka stavka kao <li>)
  - <p><strong>📋 Uputstva za nastavnike</strong></p> <ol>{InstructionsForTeachers}</ol> (svaka stavka kao <li>)

- <h3><span style="color: rgb(115, 191, 39);">Isporuka sadržaja i interaktivne aktivnosti {Duration}</span></h3>
  - <p><strong>📚 Materijali</strong></p>
    - <p><strong>Materijali isključivo za nastavnika:</strong></p> <ul>{TeacherOnlyMaterials}</ul> (svaka stavka kao <li>)
    - <p><strong>Materijali za učenike:</strong></p> <ul>{StudentMaterials}</ul> (svaka stavka kao <li>)
  - <p><strong>📋 Uputstva za nastavnike</strong></p>
    - <p><strong>Udica (Hook)</strong></p> <ul>{Hook}</ul> (svaka stavka kao <li>)
    - <p><strong>Rečnik</strong></p> <ul>{Vocabulary}</ul> (svaka stavka kao <li>)
    - <p><strong>Razjašnjavanje cilja</strong></p> <ul>{ClarifyObjective}</ul> (svaka stavka kao <li>)
    - <p><strong>Novi koncepti i znanja</strong></p> <ul>{NewConceptsAndKnowledge}</ul> (svaka stavka kao <li>)
    - <p><strong>⚡ Resetovanje pažnje i interaktivna aktivnost (1-3 minuta)</strong></p>
      - <p>{StandardParagraph}</p>
      - <p><strong>Uputstva:</strong></p> <ul>{Directions}</ul> (svaka stavka kao <li>)
      - <p><strong>Zašto ovo funkcioniše:</strong></p> <ul>{WhyThisWorks}</ul> (svaka stavka kao <li>)
    - <p><strong>Nastavak nastave nakon aktivnosti</strong></p> <ul>{ContinueInstruction}</ul> (svaka stavka kao <li>)
- <p><strong>⚠️ Predviđene zablude</strong></p>
      - Prolazak kroz AnticipatedMisconceptions:
        <p>{Misconception} (Osigurajte da se ovde NE koriste bold/strong tagovi)</p>
        <ul><li>{TeacherResponse} (Osigurajte da se ovde NE koriste bold/strong tagovi)</li></ul>
- <h3><span style="color: rgb(115, 191, 39);">Povezivanje (3 min)</span></h3>
  - <p><strong>💭 Ključno pitanje:</strong> {EssentialQuestionVerbatim}</p>
  - <p><strong>Recite:</strong> “{ConnectToEQ.Say}”</p>
  - <p><strong>Podsticaji (Prompts):</strong></p>
  - <ul>{ConnectToEQ.Prompts}</ul> (svaka stavka kao <li>)
  - <p>✅ Očekivani odgovori učenika</p>
  - <ul>{ExpectedStudentResponses}</ul> (svaka stavka kao <li>)

- <h3><span>🪜 Diferencijacija</span></h3>
  - <p><strong>Učenici koji uče jezik</strong></p> <ul>{LanguageLearners}</ul> (svaka stavka kao <li>)
  - <p><strong>Učenici kojima je potrebna dodatna podrška (skela)</strong></p> <ul>{StudentsInNeedOfAdditionalScaffolding}</ul> (svaka stavka kao <li>)
  - <p><strong>Idi dublje</strong></p>
    - <ul>{GoDeeper.Challenges}</ul> (svaka stavka kao <li>)
    - <p>✅ Očekivani odgovori učenika</p>
    - <ul>{GoDeeper.ExpectedStudentResponses}</ul> (svaka stavka kao <li>)

- <h3><span>🤝 Prilagođavanja i modifikacije</span></h3>
  - <p><strong>Opšta podrška:</strong></p> <ul>{GeneralSupports}</ul> (svaka stavka kao <li>)
  - <p><strong>Individualizovana podrška:</strong></p> {IndividualizedSupports} (za svakog učenika, formatirajte njegovo ime kao <p><strong><span style="color: rgb(240, 56, 40);">Ime:</span></strong></p>. Podelite njihove specifične podrške u posebne stavke i stavite svaku u svoj <li> unutar <ul>)

- <h3><span style="color: rgb(115, 191, 39);">🧠 Ponavljanje i razmaknuto prisećanje (5 min)</span></h3>
  - <p><strong>Beleške za nastavnika:</strong> [Generišite kratak pasus sa beleškama za nastavnika koji objašnjava kako ova strategija aktivnog prisećanja jača pamćenje tražeći od učenika da se prisete ključnih ideja sa lekcije nakon kratke pauze. Povežite to sa specifičnim učenjem iz današnje lekcije i uključite kratku transcendentnu refleksiju koja pomaže učenicima da vide širu primenu/značenje ovih koncepata u stvarnom svetu.]</p>
  - <h3><span>🔁 Aktivno prisećanje</span></h3>
  - <p><strong>Recite:</strong> “{ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.Question}”</p> (Osigurajte da svaka poruka nastavnika počinje sa tačno jednim Recite. Ako JSON već sadrži "Recite:", uklonite ga pre umotavanja.)
  - <p>✅ Očekivani odgovori učenika</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.ExpectedStudentResponses}</ul> (svaka stavka kao <li>)
  - <h3><span>💭 Povezivanje sa ključnim pitanjem</span></h3>
  - <p><strong>Recite:</strong> “{ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.Question}”</p> (Osigurajte da svaka poruka nastavnika počinje sa tačno jednim Recite. Ako JSON već sadrži "Recite:", uklonite ga pre umotavanja.)
  - <p>✅ Očekivani odgovori učenika</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.ExpectedStudentResponses}</ul> (svaka stavka kao <li>)
  - <h3><span>⌛ Razmaknuto prisećanje</span></h3>
  - <p>{ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.TeacherSay}</p> (Osigurajte da svaka poruka nastavnika počinje sa tačno jednim Recite. Ako JSON već sadrži "Recite:", uklonite ga pre umotavanja. Pomerite sve "(Preuzeto iz...)" metapodatke u tekstu da budu jasno stilizovani na početku poruke)
  - <p>✅ Očekivani odgovori učenika</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.ExpectedStudentResponses}</ul> (svaka stavka kao <li>)

- <h3><span style="color: rgb(115, 191, 39);">Pitanja, odgovori i diskusija {Duration}</span></h3>
  - <p><strong>📋 Uputstva za nastavnike</strong></p>
    - <p>1. {QAndAAndDiscussion.InstructionsForTeachers.Step1_Invite}</p> (Osigurajte da svaka poruka nastavnika počinje sa tačno jednim Recite. Ako JSON već sadrži "Recite:", uklonite ga pre umotavanja.)
    - <p>2. Pitajte:</p>
    - <ul>{QAndAAndDiscussion.InstructionsForTeachers.Step2_AskQuestions}</ul> (svaka stavka kao <li>)
    - <p>3. {QAndAAndDiscussion.InstructionsForTeachers.Step3_Capture}</p> (Osigurajte da sve poruke nastavnika kao što su 'Recite:' ili 'Zapišite:' u tekstu budu jasno stilizovane.)
    - <p>4. {QAndAAndDiscussion.InstructionsForTeachers.Step4_Answer}</p> (Osigurajte da sve poruke nastavnika kao što su 'Recite:' ili 'Odgovorite na:' u tekstu budu jasno stilizovane.)
  - <p>Beleška za nastavnika:</p>
  - <ul>
      <li>Odgovorite na pitanja koja se direktno povezuju sa današnjim ciljem</li>
      <li>“Parkirajte” dublja pitanja ili ona fokusirana na budućnost tako što ćete ih zaokružiti ili staviti zvezdicu pored njih</li>
      <li>Ponovo se osvrnite na parkirana pitanja u narednim lekcijama kako biste pokazali kontinuitet učenja</li>
    </ul>

- <h3><span style="color: rgb(115, 191, 39);">Zaključak {Duration}</span></h3>
  - <p>{Conclusion.BuildCuriosity}</p> (Osigurajte da svaka poruka nastavnika počinje sa tačno jednim Recite. Ako JSON već sadrži "Recite:", uklonite ga pre umotavanja.)

- <h3><span style="color: rgb(115, 191, 39);">✅Formativno ocenjivanje (5 min)</span></h3>
  - Iz formativeAssessment običnog teksta, ekstrahujte i renderujte Promptove 1–4 u ovoj tačnoj strukturi (nemojte izmišljati pitanja; ekstrahujte iz teksta; očistite formatiranje):
    - <p><strong>Podsticaj 1 (DOK 1):</strong></p>
    - <p>{Prompt 1 question}</p>
    - <p>✅ Očekivani odgovori učenika</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Podsticaj 2 (DOK 2):</strong></p>
    - <p>{Prompt 2 question}</p>
    - <p>✅ Očekivani odgovori učenika</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Podsticaj 3 (DOK 3):</strong></p>
    - <p>{Prompt 3 question}</p>
    - <p>✅ Očekivani odgovori učenika</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Podsticaj 4 (DOK 4):</strong></p>
    - <p>{Prompt 4 question}</p>
    - <p>✅ Očekivani odgovori učenika</p> <ul><li>{1–2 expected responses}</li></ul>

- <h3><span style="color: rgb(115, 191, 39);">🖋️ Praksa učenika</span></h3>
  - <p><strong>Beleške za nastavnika:</strong> {StudentPractice.TeacherNotes}</p>
  - Za svaki zadatak u StudentPractice.Tasks:
    - <p>{task.TaskTitle} {task.Instruction}</p>
    - <p>✅ Očekivani odgovori učenika</p>
    - <ul>{task.ExpectedStudentResponses}</ul> (svaka stavka kao <li>)
  - <p><strong>{StudentPractice.Reflection.Instruction}</strong></p>
  - <ul>{StudentPractice.Reflection.Prompts}</ul> (svaka stavka kao <li>)`,
  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `Dobićete JEDAN JSON objekat koji striktno prati šemu UnitPlanResponse (već validiranu sa moje strane). Vaš zadatak je da transformišete ovaj JSON u čist, čitljiv HTML koji nastavnik može direktno koristiti u učionici.
                   
FORMAT ULAZA
Poslaću vam JSON objekat na sledeći način:

UNIT PLAN JSON:
{{{JsonResponse}}}

Tretirajte sve nakon linije "UNIT PLAN JSON:" kao tačan JSON objekat. NE objašnjavajte niti komentarišite; samo ga parsirajte i renderujte.

GLOBALNA PRAVILA
    - Izlaz MORA biti isključivo validan HTML (bez markdown-a, bez backticks-a, bez proznih objašnjenja).
    - Dozvoljeni tagovi: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - NE koristite nijedan drugi tag (bez <main>, <section>, <header>, <div>, <h4>, itd.).
    - HTML treba da bude lepo uvučen i lak za čitanje.
    - U bilo kom <ol> ili <ul>, koristite ISKLJUČIVO <li> elemente kao direktnu decu. Nikada ne stavljajte <p>, <span>, <ul>, <ol> ili bilo koji drugi tag kao dete liste.
    - NE izmišljajte novi nastavni sadržaj; koristite samo ono što postoji u JSON poljima.
    - Sačuvajte logički redosled koji šema nalaže.

- Na samom vrhu:
    - <h1>Pregled plana tematske celine (Unit Plan Overview)</h1>
    - <p>{{{UnitDescription.Description}}}</p>
- Zatim dodajte novu liniju sa:
    <h1>Pregled tematske celine (Unit Overview)</h1>

- Ključna pitanja:
    - <h2>💭 Ključna pitanja</h2>
    - <ul> sa svakom stavkom iz UnitDescription.EssentialQuestions kao <li>.

- Ciljevi učenja učenika:
    - <h2>🎯 Ciljevi učenja učenika</h2>
    - <ul> sa svakom stavkom iz UnitDescription.StudentLearningObjectives kao <li>.

- Standardi:
    - <h2>📏 Usklađeni standardi</h2>
    - <ul> sa svakom stavkom iz UnitDescription.StandardsAligned kao <li>.

- Ključni rečnik:
    - <h2>🔤 Ključni rečnik</h2>
    - <ul> sa svakom stavkom iz UnitDescription.KeyVocabulary kao <li>.`,

  STEP0_SCHEMA: {
    "title": "UnitPlanResponse",
    "type": "object",
    "properties": {
      "UnitDescription": {
        "type": "object",
        "properties": {
          "Description": {
            "type": "string",
            "description": "Opis jedinice kao jedan kohezivan pasus u običnom tekstu (4-5 potpunih rečenica) napisan prirodnim glasom nastavnika koji možete reći direktno učenicima. Bez HTML-a, bez emodžija, bez nabrajanja. Mora da teče razgovorno, ali da prati ovu strukturu (bez naslova): (1) uvodna rečenica koja izaziva radoznalost ili stvara iznenađujući kontrast, (2) rečenica 'U ovoj jedinici ćete...' o ishodima savladavanja gradiva, (3) rečenica 'Ojačaćete svoje veštine u...' o sposobnostima razmišljanja/analize, (4) rečenica 'Ovo se povezuje sa...' o važnosti u stvarnom svetu, (5) rečenica 'Razumevanje ovoga je važno jer...' o širem značaju ili dugoročnom uticaju."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Kreirajte suštinska pitanja koja se fokusiraju samo na široke, univerzalne koncepte kao što su promena, dokaz, obrasci, odnosi, sistemi ili rezonovanje. NE pominjite pojmove, procese, rečnik ili primere specifične za predmet. Pitanja moraju biti otvorenog tipa, prenosiva na sve discipline i nemoguća za odgovor puko učenjem sadržaja lekcije ili jedinice. Fokusirajte se samo na velike ideje, a ne na samu temu.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Ceo odeljak 'Ciljevi učenja učenika' za celu ovu jedinicu. Svaka stavka na listi mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se DOK oznakom u zagradi.",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "array",
            "description": "Navedite sve jedinstvene obrazovne standarde koji se koriste bilo gde u ovoj jedinici i njenim lekcijama. NE dodajte standarde koji se ne pojavljuju u sadržaju jedinice. Svaki standard mora da sadrži šifru standarda i opis, npr. 'MS-ESS1-1: Razviti i koristiti model sistema Zemlja-Sunce-Mesec za opisivanje cikličnih obrazaca lunarnih faza, pomračenja i godišnjih doba.'",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Ceo odeljak 'Ključni rečnik' kao lista stringova. Svaki string treba da bude jedan pojam sa definicijom odvojenom crticom. Primer: 'Gravitacija - Sila koja privlači objekte jedne prema drugima'. Sve definicije moraju biti kratke, prilagođene uzrastu i direktno povezane sa sadržajem lekcije.",
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
        "description": "Lista kontejnera lekcija za ovu jedinicu (samo nacrt). Svaka stavka mora biti bez preklapanja i jasno ograničena tako da se sadržaj lekcije ne ponavlja u drugim lekcijama.",
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
    "title": "LectureUnitPlanResponse",
    "type": "object",
    "properties": {
      "EssentialQuestions": {
        "type": "array",
        "description": "Samo nalepite sva suštinska pitanja koja su generisana na nivou jedinice u istom redosledu.",
        "items": { "type": "string" }
      },
      "KeyVocabulary": {
        "type": "array",
        "description": "Lista pojmova rečnika sa definicijama (npr. 'Periodni sistem – Tabela hemijskih elemenata...'). Uključite SAMO pojmove koji se aktivno koriste u ovoj konkretnoj lekciji.",
        "items": { "type": "string" }
      },
      "StudentLearningObjectives": {
        "type": "array",
        "description": "Ceo odeljak 'Ciljevi učenja učenika' kao običan tekst. Svaka stavka mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se DOK oznakom u zagradi.",
        "minItems": 2,
        "maxItems": 3,
        "items": { "type": "string" }
      },
      "StandardsAligned": {
        "type": "string",
        "description": "Ceo odeljak 'Usklađeni standardi' kao običan tekst za ovu lekciju. Svaki standard mora sadržati šifru standarda i opis, a šifra i opis moraju biti potpuno isti kao oni korišćeni u jedinici. npr. 'MS-ESS1-1: Razviti i koristiti model sistema Zemlja-Sunce-Mesec za opisivanje cikličnih obrazaca lunarnih faza, pomračenja i godišnjih doba.'"
      },
      "AssessPriorKnowledge": {
        "type": "object",
        "description": "Ceo odeljak 'Procenite prethodno znanje'. KRITIČNO: Pogledajte 'lessonNumber' u priloženom sadržaju lekcije. AKO je ovo Lekcija 1, popunite ovaj objekat u potpunosti. AKO je ovo Lekcija 2, 3 ili bilo koja druga lekcija, MORATE VRATITI PRAZAN OBJEKAT {} bez svojstava. Nemojte ovo popunjavati ni za jednu lekciju osim za Lekciju 1. Za Lekciju 1, struktura mora uključivati:",
        "properties": {
          "SayIntroduction": { "type": "string", "description": "Šta nastavnik kaže da predstavi aktivnost." },
          "StatementsToProject": { "type": "array", "items": { "type": "string" }, "description": "Lista tvrdnji za projektovanje ili čitanje, koje sadrže i tačne ideje i uobičajene zablude." },
          "SayInstructions": { "type": "string", "description": "Šta nastavnik kaže da uputi učenike šta da rade sa tvrdnjama." },
          "ExpectedStudentResponses": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Očekivani odgovori/označavanja učenika za svaku tvrdnju."
          },
          "SayConclusion": { "type": "string", "description": "Šta nastavnik kaže za kraj aktivnosti." },
          "ActionConclusion": { "type": "string", "description": "Akcija nastavnika za zaključivanje (npr. crtanje dijagrama)." },
          "AlternateOptions": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Lista alternativnih opcija za aktivnost."
          }
        },
        "required": ["SayIntroduction", "StatementsToProject", "SayInstructions", "ExpectedStudentResponses", "SayConclusion", "ActionConclusion", "AlternateOptions"],
        "additionalProperties": false
      },
      "Objective": {
        "type": "object",
        "description": "Kreirajte odeljak Cilj koji jasno navodi ciljeve učenja učenika za lekciju.",
        "properties": {
          "Duration": { "type": "string", "description": "Procena vremena (npr. '(2-3 min)')" },
          "Materials": { "type": "array", "items": { "type": "string" } },
          "InstructionsForTeachers": { "type": "array", "items": { "type": "string" }, "description": "Mora da sadrži: 1) Objasnite ciljeve učenja koristeći direktan tekst za nastavnika (npr., Recite: '...') na jasan način prilagođen učenicima. 2) Zamolite učenike da zapišu ciljeve u svoje sveske. 3) Ukratko recite nastavniku kako da poveže ciljeve sa stvarnim životnim iskustvima učenika." }
        },
        "required": ["Duration", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ContentDeliveryAndInteractiveActivities": {
        "type": "object",
        "description": "Blok za predavanje i isporuku sadržaja.",
        "properties": {
          "Duration": { "type": "string", "description": "Procena vremena (npr. '(30 min)')" },
          "Materials": {
            "type": "object",
            "properties": {
              "TeacherOnlyMaterials": { "type": "array", "items": { "type": "string" } },
              "StudentMaterials": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["TeacherOnlyMaterials", "StudentMaterials"],
            "additionalProperties": false
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Hook": { "type": "array", "items": { "type": "string" }, "description": "Napišite dramatičan uvod visokog angažovanja koji se isporučuje kroz reči nastavnika. Treba da bude iznenađujući, da gradi radoznalost i da bude povezan sa glavnim konceptom." },
              "Vocabulary": { "type": "array", "items": { "type": "string" }, "description": "Navedite ključne pojmove rečnika. Obezbedite reči nastavnika za definisanje svakog pojma formatirane striktno kao: '[Pojam] - Recite: \"[Definicija/Tekst]\"'. Primer: 'Poluga - Recite: \"Poluga je jednostavna mašina...\"'." },
              "ClarifyObjective": { "type": "array", "items": { "type": "string" }, "description": "Razjasnite današnji cilj učenja učenika za ovu konkretnu lekciju deleći tekst za nastavnika." },
              "NewConceptsAndKnowledge": { "type": "array", "items": { "type": "string" }, "description": "Napišite detaljno predavanje za nastavnika sa tekstom (Recite: “…”). Uključite korak-po-korak šta nastavnik govori, radi i šta može da demonstrira. Razbijte složene ideje, navedite primere/analogije, uspostavite eksplicitne veze sa prethodnim znanjem." },
              "AttentionReset": {
                "type": "object",
                "description": "Umetnite standardni pasus za resetovanje pažnje tačno onako kako je napisan: 'Ova aktivnost ponovo angažuje pažnju, resetuje kognitivni fokus i pojačava koncept kroz pokret + novinu, dok pruža svrsishodan uvod.',",
                "properties": {
                  "StandardParagraph": { "type": "string", "description": "Mora biti tačno: 'Ova aktivnost ponovo angažuje pažnju, resetuje kognitivni fokus i pojačava koncept kroz pokret + novinu, dok pruža svrsishodan uvod.'" },
                  "Directions": { "type": "array", "items": { "type": "string" }, "description": "Navedite uputstva za aktivnost, uključujući šta nastavnik govori i šta učenici i nastavnik treba da rade." },
                  "WhyThisWorks": { "type": "array", "items": { "type": "string" }, "description": "Objasnite u stavkama zašto aktivnost funkcioniše za ponovno angažovanje pažnje, resetovanje kognitivnog fokusa, jačanje koncepata i svrsishodan pregled. Npr. 'Stajanje + rotiranje resetuje pažnju.'" }
                },
                "required": ["StandardParagraph", "Directions", "WhyThisWorks"],
                "additionalProperties": false
              },
              "ContinueInstruction": { "type": "array", "items": { "type": "string" }, "description": "Detaljno predavanje za nastavnika sa tekstom (Recite: “…”). Razbijte složene ideje, obezbedite primere/analogije da privučete pažnju, nagovestite buduće učenje, proširite ključne ideje." },
              "AnticipatedMisconceptions": {
                "type": "array",
                "description": "Navedite predviđene uobičajene zablude učenika kako biste osigurali da je nastavnik spreman.",
                "items": {
                  "type": "object",
                  "properties": {
                    "Misconception": { "type": "string" },
                    "TeacherResponse": { "type": "string", "description": "Kako efikasno odgovoriti na potencijalno nerazumevanje učenika i usmeriti ih ka tačnom razumevanju." }
                  },
                  "required": ["Misconception", "TeacherResponse"],
                  "additionalProperties": false
                }
              },
              "Connect": {
                "type": "object",
                "description": "Povežite sa svrhom. Povežite sa jednim od suštinskih pitanja.",
                "properties": {
                  "EssentialQuestionVerbatim": { "type": "string", "description": "Koristite obezbeđeno suštinsko pitanje doslovno." },
                  "ConnectToEQ": {
                    "type": "object",
                    "properties": {
                      "Say": { "type": "string", "description": "Tekst nastavnika koji povezuje prethodnu aktivnost sa suštinskim pitanjem." },
                      "Prompts": { "type": "array", "items": { "type": "string" }, "description": "Specifične smernice/pitanja za učenike." }
                    },
                    "required": ["Say", "Prompts"],
                    "additionalProperties": false
                  },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "Duboki očekivani odgovori učenika koji koriste rezonovanje ili dokaze." }
                },
                "required": ["EssentialQuestionVerbatim", "ConnectToEQ", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "Differentiation": {
                "type": "object",
                "description": "Diferencirajte nastavu (kako predavati, a ne pojednostaviti materijale). Varirajte složenost i dubinu, promovišite aktivno angažovanje/jezik. Realistično za učionicu.",
                "properties": {
                  "LanguageLearners": { "type": "array", "items": { "type": "string" } },
                  "StudentsInNeedOfAdditionalScaffolding": { "type": "array", "items": { "type": "string" } },
                  "GoDeeper": {
                    "type": "object",
                    "properties": {
                      "Challenges": { "type": "array", "items": { "type": "string" } },
                      "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                    },
                    "required": ["Challenges", "ExpectedStudentResponses"],
                    "additionalProperties": false
                  }
                },
                "required": ["LanguageLearners", "StudentsInNeedOfAdditionalScaffolding", "GoDeeper"],
                "additionalProperties": false
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "description": "Navedite sve učenike sa planovima učenja u crvenom fontu. Grupišite učenike sa zajedničkom podrškom. Fokusirajte se na pristup.",
                "properties": {
                  "GeneralSupports": { "type": "array", "items": { "type": "string" }, "description": "Strategije koje nisu specifične za pojedinačnog učenika a koje poboljšavaju pristup za sve učenike (npr. vizuelni prikazi, unapred popunjene beleške, digitalni rečnik, uputstva u delovima)." },
                  "IndividualizedSupports": { "type": "array", "items": { "type": "string" }, "description": "Specifična prilagođavanja i modifikacije za imenovane učenike sa formalnim planovima. Navedite imena u CRVENOM fontu. Ako učenik zahteva okvire rečenica (sentence frames/starters), MORATE obezbediti stvarne konkretne rečenice prilagođene sadržaju ove lekcije." }
                },
                "required": ["GeneralSupports", "IndividualizedSupports"],
                "additionalProperties": false
              }
            },
            "required": [
              "Hook", "Vocabulary", "ClarifyObjective", "NewConceptsAndKnowledge", "AttentionReset",
              "ContinueInstruction", "AnticipatedMisconceptions", "Connect",
              "Differentiation", "AccommodationsAndModifications"
            ],
            "additionalProperties": false
          }
        },
        "required": ["Duration", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "object",
        "description": "Ceo odeljak 'Repaso i vremenski raspoređeno prisećanje'. Ova 5-minutna aktivnost mora da sadrži: 1. Uputstva za nastavnike koja sadrže: - Aktivno prisećanje (Active Recall) podsticaj koristeći deljenje u paru/grupi - Očekivani odgovori učenika (2-3 primeraka u stavkama) 2. Povezivanje sa suštinskim pitanjem 3. Komponentu vremenski raspoređenog prisećanja (Spaced Retrieval) koja sadrži: - Jasno pozivanje na specifičnu prethodnu lekciju - Pitanje koje povezuje prošle + trenutne koncepte - Detaljne kriterijume uspeha / očekivane odgovore. Svi odeljci moraju koristiti 'Recite:' izjave za reči nastavnika i jasno obeležene 'Očekivani odgovori učenika' koji prikazuju 2-3 primerna odgovora.",
        "properties": {
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Vodič korak-po-korak za nastavnika za 5-minutnu sesiju pregleda i vremenski raspoređenog prisećanja.",
            "properties": {
              "ActiveRecall": {
                "type": "object",
                "description": "Podstaknite učenike da se prisete ključnog učenja iz današnje lekcije koristeći samo dokaze iz predavanja/aktivnosti.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "Specifične reči nastavnika (koje počinju sa 'Recite:') koje podstiču učenike da razmisle o današnjoj lekciji i onome što je otkrila."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "3-4 primera visokokvalitetnih odgovora učenika koji pokazuju jasno razumevanje.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "EssentialQuestionConnection": {
                "type": "object",
                "description": "Pomozite učenicima da povežu današnji specifični koncept sa širim suštinskim pitanjima jedinice.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "Reči nastavnika (koje počinju sa 'Recite:') koje povezuju današnje nalaze sa jednim od suštinskih pitanja jedinice."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 primera kako učenici opravdavaju vezu.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "SpacedRetrieval": {
                "type": "object",
                "description": "Ponovo posetite koncept iz prethodne jedinice ili lekcije da biste ojačali kumulativno zadržavanje.",
                "properties": {
                  "TeacherSay": {
                    "type": "string",
                    "description": "Reči nastavnika (koje počinju sa 'Recite:') koje eksplicitno povezuju koncept iz prethodne lekcije sa današnjim radom. Mora uključiti meta-referencu (npr. '(Preuzeto iz Jedinice 1, Lekcije 2.)') direktno u tekstu."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 primera očekivanih odgovora.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["TeacherSay", "ExpectedStudentResponses"],
                "additionalProperties": false
              }
            },
            "required": ["ActiveRecall", "EssentialQuestionConnection", "SpacedRetrieval"],
            "additionalProperties": false
          }
        },
        "required": ["InstructionsForTeachers"],
        "additionalProperties": false
      },
      "QAndAAndDiscussion": {
        "type": "object",
        "description": "Blok za pitanja i odgovore i diskusiju.",
        "properties": {
          "Duration": { "type": "string", "description": "Procena vremena (npr. '(5 min)')" },
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Vodič za nastavnika za sesiju pitanja i odgovora i diskusije.",
            "properties": {
              "Step1_Invite": {
                "type": "string",
                "description": "Pozovite pitanja učenika, počevši sa 'Recite:' (npr. 'Recite: “Sada je vaša šansa da razmislite o onome što smo naučili i identifikujete bilo šta što još uvek izgleda važno za istraživanje.”')"
              },
              "Step2_AskQuestions": {
                "type": "array",
                "description": "3–4 pitanja nastavnika koja se povezuju sa današnjom lekcijom, izbegavajući reči 'zbunjeni' ili 'ne razumem', ali i dalje otkrivajući nesigurnost.",
                "items": { "type": "string" }
              },
              "Step3_Capture": {
                "type": "string",
                "description": "Uputstva za beleženje pitanja uključujući 'Recite:', 'Zapišite:', i još jednu 'Recite:' izjavu (npr., 'Recite: “Ako imate pitanje, to znači da razmišljate duboko. Hajde da zabeležimo te ideje.” Zapišite: Zapišite pitanja učenika na grafikonu pod nazivom “Pitanja koja još uvek imamo.” Recite: “Nastavićemo da dodajemo na ovaj grafikon tokom cele jedinice. Na neka pitanja možemo odgovoriti danas, a druga ćemo istražiti u budućim lekcijama.”')"
              },
              "Step4_Answer": {
                "type": "string",
                "description": "Uputstva za odgovaranje na pitanja uključujući 'Recite:', 'Odgovorite na:', i još jednu 'Recite:' izjavu (npr., 'Recite: “Hajde da pogledamo naša pitanja. Na koja možemo odgovoriti koristeći ono što smo danas naučili?” Odgovorite na: Odgovorite na nekoliko pitanja koristeći odgovore učenika i dokaze. Recite: “Neka od ovih pitanja pomoći će nam da vodimo ono što sledeće učimo. Naučnici ne odgovaraju na sve odjednom—oni nastavljaju da grade razumevanje tokom vremena.”')"
              }
            },
            "required": ["Step1_Invite", "Step2_AskQuestions", "Step3_Capture", "Step4_Answer"],
            "additionalProperties": false
          }
        },
        "required": ["Duration", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Conclusion": {
        "type": "object",
        "description": "Blok za zaključak časa.",
        "properties": {
          "Duration": { "type": "string", "description": "Procena vremena (npr. '(1 min)')" },
          "BuildCuriosity": {
            "type": "string",
            "description": "Najava sledeće lekcije koja gradi radoznalost i stvara neizvesnost, počevši sa 'Recite:'. Mora biti dugačka najmanje 3-4 rečenice (ili duže ako ima smisla graditi dublju radoznalost)."
          }
        },
        "required": ["Duration", "BuildCuriosity"],
        "additionalProperties": false
      },
      "FormativeAssessment": {
        "type": "string",
        "description": "Ceo odeljak 'Formativno ocenjivanje' kao običan tekst. Mora pratiti ovu strukturu: Uvodni pasus namenjen nastavniku koji ukratko navodi svrhu i način primene. 4 zahtevana pitanja/zadatka označena sa 'Podsticaj 1 (DOK 1):', 'Podsticaj 2 (DOK 2):', itd. koji pokrivaju DOK nivoe 1-4. Za svaku smernicu: - Pitanje koje testira razumevanje na navedenom DOK nivou - Naslov 'Očekivani odgovori učenika' (bez kvačica/emodžija) - 1-2 odgovora u obliku potpune rečenice koja pokazuju savladanost. Završite kratkim pasusom koji imenuje specifičnu strategiju formativnog ocenjivanja koju treba koristiti (npr., 'Izlazna karta', 'Razmisli-Upari-Podeli'). Primer formata: Podsticaj 1 (DOK 1): 'Zašto planete ostaju u orbiti umesto da odlete u svemir?' Očekivani odgovori učenika 'Zato što njihovo kretanje napred i Sunčeva gravitacija rade zajedno kako bi stvorili stabilnu orbitu.' [Nastavite sa Podsticajima 2-4 prateći istu strukturu]"
      },
      "StudentPractice": {
        "type": "object",
        "description": "Ceo odeljak 'Vežbanje učenika' za domaći zadatak / vežbanje van časa.",
        "properties": {
          "TeacherNotes": {
            "type": "string",
            "description": "Mora tačno pratiti ovaj šablon, popunjavajući deo u zagradi: 'Ovi domaći zadaci pojačavaju današnje učenje o [unesite koncepte lekcije] tražeći od učenika da posmatraju obrasce iz stvarnog sveta i objasne ih koristeći koncepte uvedene na času. Samostalnom primenom ideja iz učionice, učenici jačaju dugoročno zadržavanje znanja i grade sposobnost prenošenja naučnog razmišljanja u svakodnevna iskustva.'"
          },
          "Tasks": {
            "type": "array",
            "description": "Generišite 3 zadatka koji pokrivaju DOK nivoe 2 i 3.",
            "items": {
              "type": "object",
              "properties": {
                "TaskTitle": { "type": "string", "description": "npr., '1. (DOK 2)'" },
                "Instruction": { "type": "string", "description": "Jasna uputstva korak-po-korak za učenika za rad na zadatku." },
                "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "Očekivani odgovori učenika. NE uključujte kvačice/emodžije." }
              },
              "required": ["TaskTitle", "Instruction", "ExpectedStudentResponses"],
              "additionalProperties": false
            }
          },
          "Reflection": {
            "type": "object",
            "properties": {
              "Instruction": { "type": "string", "description": "npr., '4. Refleksija: Napišite 2-3 rečenice odgovarajući na jedan podsticaj:'" },
              "Prompts": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["Instruction", "Prompts"],
            "additionalProperties": false
          }
        },
        "required": ["TeacherNotes", "Tasks", "Reflection"],
        "additionalProperties": false
      }
    },
    "required": [
      "EssentialQuestions",
      "KeyVocabulary",
      "StudentLearningObjectives",
      "StandardsAligned",
      "AssessPriorKnowledge",
      "Objective",
      "ContentDeliveryAndInteractiveActivities",
      "ReviewAndSpacedRetrieval",
      "QAndAAndDiscussion",
      "Conclusion",
      "FormativeAssessment",
      "StudentPractice"
    ],
    "additionalProperties": false
  }
};
