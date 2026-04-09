window.promptsSR = {
  STEP0_PROMPT_TEMPLATE: `Kreiraj SAMO okvir unit-a zasnovanog na ISTRAŽIVANJU (Korak 0) koristeći informacije u nastavku. NEMOJ kreirati pun plan unit-a i NEMOJ pisati pune planove lekcija.

MORAŠ izbaciti validan JSON koji se tačno poklapa sa priloženom JSON šemom: UnitPlanResponse. Nemoj uključivati nikakve dodatne ključeve. Koristi kompaktno JSON formatiranje (bez dodatnih praznih redova ili razmaka između JSON propertija). Bez HTML-a. Bez emojija. Običan tekst unutar string polja.

Predmet unit-a: {{$Subject}}
Naziv unit-a: {{$Name}}
Opis unit-a/Instrukcija: {{$UserPrompt}}
Razred: {{$GradeLevel}}
Trajanje časa u minutima: {{$ClassDuration}}
Traženi broj lekcija: {{$NumberOfItems}}
Standardi za usklađivanje (koristi doslovno ako su prisutni; NEMOJ dodavati nove standarde): {{$Standards}}
Učenici sa individualizovanom podrškom (samo kontekst): {{$LearningPlans}}
Resursi/Mediji za korišćenje: {{$MediaContext}}
Sadržaj unit-a: {{$AttachedUnit}}
Priloženi sadržaj lekcije (ako postoji): {{$AttachedLesson}}

ZAHTEVI ZA OKVIR ISTRAŽIVANJA:
- Pristup je primarno istraživački. Lekcije MORAJU napredovati kroz ovaj luk:
  (1) fenomen/iskustvo + primećivanje/pitanja,
  (2) odabir pitanja + planiranje istraživanja,
  (3) prikupljanje dokaza + pronalaženje obrazaca,
  (4) izgradnja modela + revizija pomoću dokaza,
  (5) objašnjenje/argumentacija + komunikacija + transfer.
- Održi smisleno učenje kroz otkrivanje: učenici grade i revidiraju modele koristeći zapažanja i jednostavne podatke; naglasi dokaze, rezonovanje i komunikaciju.
- Zadrži usklađenost SAMO sa priloženim standardima. NEMOJ dodavati nikakve nove standarde ili okvire.
- Kulturološka relevantnost i inkluzija: uključi kratke kontekste ili perspektive relevantne za zajednicu bez stereotipa.
- Preplitanje i transfer: ponavljaj veštine kroz lekcije (posmatranje, modelovanje, argumentacija na osnovu dokaza, komunikacija).
- Lekcije MORAJU biti bez preklapanja sa jasnim granicama.

OGRANIČENJA NIZA LEKCIJA (LESSONS ARRAY):
- Niz Lessons MORA sadržati tačno {{$NumberOfItems}} lekcija.
- lessonNumber je zasnovan na 1 i strogo se povećava za 1.
- Osiguraj logičan redosled od osnovnih istraživačkih koraka do složenijeg modelovanja i objašnjavanja.
- Tempo mora odgovarati časovima od {{$ClassDuration}} minuta za razred {{$GradeLevel}}.

PRAVILO ZA OUTPUT:
Vrati SAMO JSON koji se validira prema UnitPlanResponse šemi.`,

  PER_LESSON_PROMPT_TEMPLATE: `Kreiraj JEDAN istraživački plan lekcije (NE plan unit-a, NE više lekcija) koristeći informacije u nastavku. MORAŠ izbaciti validan JSON koji se tačno poklapa sa priloženom JSON šemom: InquiryUnitPlanResponse. Nemoj uključivati nikakve dodatne ključeve. Koristi kompaktno JSON formatiranje (bez dodatnih praznih redova ili razmaka između JSON propertija). Bez HTML-a. Bez emojija. Bez markdown-a. Običan tekst unutar string polja.

Predmet unit-a: {{$Subject}}
Naziv unit-a: {{$Name}}
Opis unit-a/Instrukcija: {{$UserPrompt}}
Razred: {{$GradeLevel}}
Trajanje časa u minutima: {{$ClassDuration}}
Standardi za usklađivanje (koristi doslovno ako su prisutni; NEMOJ dodavati nove standarde): {{$Standards}}
Učenici sa individualizovanom podrškom (MORA se koristiti SAMO unutar InvestigationPhase.AccommodationsAndModifications; koristi imena učenika/planove tačno onako kako su napisani): {{$LearningPlans}}
Resursi/Mediji za korišćenje: {{$MediaContext}}
Sadržaj unit-a: {{$AttachedUnit}}

Elementi unit-a i lekcije iz Koraka 0 (koristi doslovno):
{{$ParentUnitData}}
- UnitDescription.EssentialQuestions (tačno onako kako je navedeno; ponovo koristi doslovno gde je relevantno): {{$UnitEssentialQuestions}}

Priloženi sadržaj lekcije (ako postoji): {{$AttachedLesson}}

ZAHTEVI ZA TOK ISTRAŽIVAČKE LEKCIJE:
- Ova lekcija mora pratiti istraživački luk i biti usklađena sa granicama okvira lekcije: Orijentacija → Konceptualizacija → Istraživanje → Zaključak → Diskusija.
- Održi smisleno učenje kroz otkrivanje: učenici grade i revidiraju ideje koristeći zapažanja i jednostavne podatke; naglasi dokaze, rezonovanje i komunikaciju.
- Kulturološka relevantnost i inkluzija: uključi kratke kontekste ili perspektive relevantne za zajednicu bez stereotipa.
- NEMOJ uvoditi značajne nove koncepte koji pripadaju drugim lekcijama; ostani unutar obima i granica okvira ove lekcije.
- Zadrži usklađenost SAMO sa priloženim standardima. NEMOJ dodavati nikakve nove standarde ili okvire.
- Nastavnikovi koraci moraju voditi razmišljanje bez direktnog davanja naučnih objašnjenja.

PRAVILA SPECIFIČNA ZA POLJA (mapiraj na šemu):
- AssessPriorKnowledge: SAMO ako je broj lekcije 1, napiši 150–250 reči i prati zahtevanu strukturu u opisu šeme; u suprotnom vrati "".
- InvestigationPhase.AccommodationsAndModifications:
  - General: uključi opštu podršku.
  - IndividualSupport: niz mora sadržati tačno navedene učenike i njihove planove (ista imena/planovi; bez dodatnih učenika; bez nedostajućih učenika).

PRAVILO ZA OUTPUT:
Vrati SAMO JSON koji se validira prema InquiryUnitPlanResponse šemi.`,

  HTML_LESSON_PROMPT_TEMPLATE: `Ti si profesionalni formater HTML-a za nastavu koji piše za nastavnike u učionici.

KRITIČNA PRAVILA
- Izbaci SAMO validan HTML.
- NEMOJ dodavati objašnjenja ili komentare.
- NEMOJ izmišljati sadržaj.
- Dozvoljeni tagovi SAMO: <p>, <h3>, <strong>, <em>, <span>, <ul>, <li>
- Liste smeju sadržati SAMO <li> kao direktnu decu.
- BEZ ugnježdenih lista.
- BEZ <p> unutar <li>.
- Zadrži redosled sekcija TAČNO onako kako je navedeno u nastavku. NEMOJ menjati redosled.

--------------------------------
ULAZNI JSON (InquiryUnitPlanResponse za JEDNU lekciju):
{{$LessonInquiryJson}}
--------------------------------

ZADATAK
Transformiši ULAZNI JSON u HTML namenjen nastavnicima koristeći SAMO dozvoljene tagove i prateći tačna pravila renderovanja i strukture u nastavku.

Prvo renderuj ključna pitanja i usklađene standarde:
<h3><span>💭 Ključna pitanja</span></h3>
<ul>
  - Renderuj svaku stavku iz EssentialQuestions kao <li>.
</ul>

<h3><span>📏 Usklađeni standardi</span></h3>
<ul>
  - Renderuj svaku stavku iz StandardsAligned kao <li>.
</ul>

==================================================
SEKCIJA 0: PROCENA PRETHODNOG ZNANJA (USLOVNO)
==================================================
Renderuj ovu sekciju SAMO ako AssessPriorKnowledge NIJE prazan string.

STROGA STRUKTURA (MORA SE TAČNO PRATITI):

<h3><span>💡 Procena prethodnog znanja</span></h3>

<p><strong>Napomena za nastavnika:</strong> Aktiviranje prethodnog znanja učenika nije samo zagrevanje – to je neuronauka na delu. Ovaj proces aktivira postojeće neuralne puteve, olakšavajući mozgu da poveže nove informacije sa onim što je već poznato. Ova tehnika, nazvana elaborativno kodiranje, pomaže učenicima da brže i efikasnije prebace znanje u dugoročnu memoriju, poboljšavajući i razumevanje i zadržavanje informacija.</p>

Zatim renderuj:

<p><strong>Recite:</strong></p>
- Jedan ili više <p> elemenata koji sintetišu govor nastavnika (čak i ako se "Say:" ne pojavljuje eksplicitno u ulazu).

Zadaci za učenike / podsticaji / izjave:
- Renderuj kao <ul> (napomena: <ol> NIJE dozvoljen tag, pa MORAŠ koristiti <ul>).
- Svaka stavka mora biti JEDAN <li>
- BEZ drugih tagova unutar <li>

Očekivani odgovori:
<p>✅ Očekivani odgovori učenika</p>
<ul>
  <li>...</li>
</ul>

Alternativne opcije (ako su prisutne):
<p><strong>Alternativne opcije:</strong></p>
<ul>
  <li>...</li>
</ul>

==================================================
SEKCIJA 1: FAZA ORIJENTACIJE – DEFINISANJE PROBLEMA
==================================================

<h3><span style="color: rgb(115, 191, 39);">Faza orijentacije – Definisanje problema (5 min)</span></h3>

<p><strong>Svrha:</strong> Učenici se upoznaju sa stvarnom misterijom koja budi radoznalost i motiviše istraživanje. Oni prepoznaju problem i aktiviraju prethodno znanje kako bi se pripremili za dublje istraživanje.</p>

<p><strong>📚 Materijali:</strong></p>
<ul>
  - Renderuj svaku stavku iz OrientationPhase.Materials kao <li>. Ako je prazno, izbaci <li>Nema</li>.
</ul>

<p><strong>📋 Instrukcije za nastavnike</strong></p>

<p><strong>Angažovanje (Engage) – Uvedite fenomen na način koji budi radoznalost bez davanja objašnjenja.</strong></p>
<p><strong>Recite:</strong> {OrientationPhase.InstructionsForTeachers.Engage.Prompt}</p>
<p><strong>Potezi za facilitaciju:</strong></p>
<ul>
  - Za svaki potez u OrientationPhase.InstructionsForTeachers.Engage.FacilitationMoves, renderuj kao <li>.
  <li><strong>Podstaknite pitanjima kao što su:</strong> {OrientationPhase.InstructionsForTeachers.Engage.PromptingOptions}</li>
</ul>

<p><strong>Povezivanje (Connect) – Pomozite učenicima da povežu svoja zapažanja sa širom misterijom koja će biti osnova istraživanja.</strong></p>
<p><strong>Recite:</strong> {OrientationPhase.InstructionsForTeachers.Connect.Prompt}</p>
<p><strong>Potezi za facilitaciju:</strong></p>
<ul>
  <li><strong>Podstaknite pitanjima kao što su:</strong> {OrientationPhase.InstructionsForTeachers.Connect.PromptingOptions}</li>
  - Za svaki potez u OrientationPhase.InstructionsForTeachers.Connect.FacilitationMoves, renderuj kao <li>.
</ul>

<p><strong>Aktivacija (Activate) – Prebacite učenike na zajedničko pronalaženje smisla.</strong></p>
<p><strong>Recite:</strong> {OrientationPhase.InstructionsForTeachers.Activate.Prompt}</p>
<p><strong>Potezi za facilitaciju:</strong></p>
<ul>
  - Za svaki potez u OrientationPhase.InstructionsForTeachers.Activate.FacilitationMoves, renderuj kao <li>.
  <li><strong>Podstaknite pitanjima kao što su:</strong> {OrientationPhase.InstructionsForTeachers.Activate.PromptingOptions}</li>
</ul>

<p><strong>Ispitivanje (Probe) – Podstaknite produbljivanje razmišljanja podstičući učenike da ispitaju pretpostavke.</strong></p>
<p><strong>Recite:</strong> {OrientationPhase.InstructionsForTeachers.Probe.Prompt}</p>
<p><strong>Potezi za facilitaciju:</strong></p>
<ul>
  <li><strong>Podstaknite pitanjima kao što su:</strong> {OrientationPhase.InstructionsForTeachers.Probe.PromptingOptions}</li>
  - Za svaki potez u OrientationPhase.InstructionsForTeachers.Probe.FacilitationMoves, renderuj kao <li>.
</ul>
<p>{OrientationPhase.InstructionsForTeachers.Probe.Closing}</p>

==================================================
SEKCIJA 2: FAZA KONCEPTUALIZACIJE – ISTRAŽIVAČKO PITANJE + PLAN AKCIJE
==================================================

<h3><span style="color: rgb(115, 191, 39);">Faza konceptualizacije – Istraživačko pitanje + Plan akcije (10 min)</span></h3>

<p><strong>Svrha:</strong> Učenici generišu smislena istraživačka pitanja, biraju centralno pitanje za istraživanje i kreiraju plan akcije koji će voditi njihov proces istraživanja.</p>

<p><strong>📚 Materijali:</strong></p>
<ul>
  - Renderuj svaku stavku iz ConceptualizationPhase.Materials kao <li>. Ako je prazno, izbaci <li>Nema</li>.
</ul>

<p><strong>📋 Instrukcije za nastavnike</strong></p>

<p><strong>Vođenje generisanja pitanja – Uvedite istraživanje podsticanjem radoznalosti, a ne izlaganjem sadržaja.</strong></p>
<p><strong>Recite:</strong> {ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.Prompt}</p>
<p><strong>Potezi za facilitaciju:</strong></p>
<ul>
  - Za svaki potez u ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.FacilitationMoves, renderuj kao <li>.
  <li><strong>Podstaknite pitanjima kao što su:</strong> {ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.PromptingOptions}</li>
</ul>

<p><strong>Identifikacija istraživačkog pitanja – Pomozite učenicima da zajednički odluče koje pitanje je najkorisnije za istraživanje.</strong></p>
<p><strong>Recite:</strong> {ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.Prompt}</p>
<p><strong>Potezi za facilitaciju:</strong></p>
<ul>
  - Za svaki potez u ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.FacilitationMoves, renderuj kao <li>.
  <li><strong>Podstaknite pitanjima kao što su:</strong> {ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.PromptingOptions}</li>
</ul>

<p><strong>Kreiranje plana akcije – Podržite učenike u dizajniranju sopstvenog istraživanja umesto da im date gotov plan.</strong></p>
<p><strong>Recite:</strong> {ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.Prompt}</p>
<p><strong>Potezi za facilitaciju:</strong></p>
<ul>
  - Za svaki potez u ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.FacilitationMoves, renderuj kao <li>.
  <li><strong>Podstaknite pitanjima kao što su:</strong> {ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.PromptingOptions}</li>
</ul>

==================================================
SEKCIJA 3: FAZA ISTRAŽIVANJA
==================================================

<h3><span style="color: rgb(115, 191, 39);">Faza istraživanja – Istraživanje + Ispitivanje + Eksperiment + Prikupljanje podataka (15 min)</span></h3>

<p><strong>Svrha:</strong> Učenici aktivno istražuju fenomen kroz posmatranje, analizu modela i prikupljanje dokaza, gradeći set podataka koji će kasnije koristiti za formiranje zaključaka.</p>

<p><strong>📚 Materijali:</strong></p>
<ul>
  - Renderuj svaku stavku iz InvestigationPhase.Materials kao <li>. Ako je prazno, izbaci <li>Nema</li>.
</ul>

<p><strong>📋 Instrukcije za nastavnike</strong></p>

<p><strong>Pokretanje istraživanja – Uvedite zadatak bez objašnjavanja sadržaja.</strong></p>
<p><strong>Recite:</strong> {InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.Prompt}</p>
<p><strong>Potezi za facilitaciju:</strong></p>
<ul>
  - Za svaki potez u InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.FacilitationMoves, renderuj kao <li>.
  <li><strong>Podstaknite pitanjima kao što su:</strong> {InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.PromptingOptions}</li>
</ul>

<p><strong>Očekivanja za saradnju – Predstavite zadatak kao međuzavistan rad u kojem svaki učenik doprinosi zajedničkoj analizi.</strong></p>
<p><strong>Recite:</strong> {InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.Prompt}</p>
<p><strong>Potezi za facilitaciju:</strong></p>
<ul>
  - Za svaki potez/očekivanje u InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.FacilitationMoves, renderuj kao <li>.
  <li><strong>Podstaknite pitanjima kao što su:</strong> {InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.PromptingOptions}</li>
</ul>

<p><strong>Podsticaji tokom cirkulisanja – Koristite samo dok obilazite grupe.</strong></p>

<p><strong>Konceptualni podsticaji</strong></p>
<ul>
  - Za svaki podsticaj u InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Conceptual, renderuj kao <li>.
</ul>

<p><strong>Podsticaji za rezonovanje</strong></p>
<ul>
  - Za svaki podsticaj u InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Reasoning, renderuj kao <li>.
</ul>

<p><strong>Podsticaji za saradnju</strong></p>
<ul>
  - Za svaki podsticaj u InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Collaboration, renderuj kao <li>.
</ul>

<p><strong>❗ <span style="color: rgb(145, 56, 230);">Česta pogrešna uverenja</span></strong></p>
- Za svaku stavku u InvestigationPhase.AnticipatedMisconceptions:
<p>{item.Misconception} (Osigurajte da se ovde NE koristi boldovanje/strong tagovi)</p>
<ul>
  <li>{item.TeacherResponse} (Osigurajte da se ovde NE koristi boldovanje/strong tagovi)</li>
</ul>

<p><strong>🪜 <span style="color: rgb(145, 56, 230);">Diferencijacija</span></strong></p>

<p><strong>Učenici kojima je jezik strani:</strong></p>
- Za svaku strategiju u InvestigationPhase.Differentiation.LanguageLearners.Strategies:
<p>{strategija}</p>
<p>Koristite okvire rečenica (sentence frames) za podršku objašnjavanju i rezonovanju:</p>
<ul>
  - Za svaki početak u InvestigationPhase.Differentiation.LanguageLearners.SentenceStarters, renderuj kao <li>.
</ul>

<p><strong>Dodatna podrška (skela):</strong></p>
- Za svaku strategiju u InvestigationPhase.Differentiation.AdditionalScaffolding.Strategies:
<p>{strategija}</p>
<p>Ponudite kontrolnu listu korak-po-korak za vođenje istraživanja:</p>
<ul>
  - Za svaku stavku u InvestigationPhase.Differentiation.AdditionalScaffolding.Checklist, renderuj kao <li>.
</ul>

<p><strong>Proširenja (idite dublje):</strong></p>
- Za svaku strategiju u InvestigationPhase.Differentiation.GoDeeper.Strategies:
<p>{strategija}</p>

<p><strong>Pitanje za napredno razmišljanje:</strong></p>
<ul>
  <li>Recite: "{InvestigationPhase.Differentiation.GoDeeper.AdvancedQuestion}"</li>
</ul>

<p><strong>✅ Očekivani odgovori učenika</strong></p>
<ul>
  - Za svaki odgovor u InvestigationPhase.Differentiation.GoDeeper.ExpectedResponses, renderuj kao <li>.
</ul>

<p><strong>🤝 Prilagođavanja i modifikacije</strong></p>

<p><strong>Opšta podrška:</strong></p>
<ul>
  <li>{Renderuj InvestigationPhase.AccommodationsAndModifications.General}</li>
</ul>

<p><strong>Individualna podrška:</strong></p>
<ul>
  - Za svaku stavku u InvestigationPhase.AccommodationsAndModifications.IndividualSupport renderuj:
  <li><strong>{StudentName}:</strong> {Plan}</li>
</ul>

<p><strong>✔ Brze provere</strong></p>
<ul>
  <li>{Renderuj InvestigationPhase.QuickCheck}</li>
</ul>

==================================================
SEKCIJA 4: FAZA ZAKLJUČKA
==================================================

<h3><span style="color: rgb(115, 191, 39);">Faza zaključka – Analiza saznanja + Odgovor na istraživačko pitanje (5 min)</span></h3>

<p><strong>Svrha:</strong> Učenici analiziraju svoje prikupljene podatke i koriste dokaze da odgovore na istraživačko pitanje, formirajući jasno objašnjenje zasnovano na svojim saznanjima.</p>

<p><strong>📚 Materijali:</strong></p>
<ul>
  - Renderuj svaku stavku iz ConclusionPhase.Materials kao <li>. Ako je prazno, izbaci <li>Nema</li>.
</ul>

<p><strong>📋 Instrukcije za nastavnike</strong></p>
<ul>
  <li>Recite: Pozovite učenike da se vrate na istraživačko pitanje i razmisle kako njihovi prikupljeni dokazi pomažu da se na njega odgovori.</li>
  <li>Recite: Podstaknite učenike da pregledaju svoje beleške i podatke i identifikuju obrasce koje primećuju kroz zapažanja.</li>
  <li>Podstaknite učenike da prodiskutuju o idejama koje se javljaju u malim grupama i uporede objašnjenja.</li>
  <li>Recite: Zamolite učenike da opravdaju ideje odgovarajući na podsticaje kao što su „Koji dokazi potkrepljuju ovu ideju?“</li>
  <li>Vodite učenike da doteraju objašnjenja kroz diskusiju sa vršnjacima bez potvrđivanja ili ispravljanja ideja.</li>
  <li>Recite: Uputite učenike da samostalno napišu objašnjenje, koristeći dokaze za potkrepljivanje svake tvrdnje.</li>
  <li>Neka učenici podele svoje napisano objašnjenje sa partnerom ili malom grupom.</li>
</ul>

<p><strong>Očekivani odgovori učenika</strong></p>
<ul>
  <li>Pozivanje na specifična zapažanja ili podatke kao dokaze.</li>
  <li>Tvrdnje koje su potkrepljene obrascima primećenim tokom istraživanja.</li>
  <li>Objašnjenja koja povezuju dokaze sa zaključcima.</li>
  <li>Korišćenje jezika rezonovanja kao što je „zato što“, „ovo pokazuje“ ili „na osnovu naših podataka“.</li>
</ul>

==================================================
SEKCIJA 5: FAZA DISKUSIJE
==================================================

<h3><span style="color: rgb(115, 191, 39);">Faza diskusije – Implikacije + Značenje + Buduća primena (5 min)</span></h3>

<p><strong>Svrha:</strong> Pomozite učenicima da pređu sa onoga što su otkrili na to zašto je to važno.</p>

<p><strong>📚 Materijali:</strong></p>
<ul>
  - Renderuj svaku stavku iz DiscussionPhase.Materials kao <li>. Ako je prazno, izbaci <li>Nema</li>.
</ul>

<p><strong>📋 Instrukcije za nastavnike</strong></p>
<ul>
  <li>Recite: Podstaknite učenike da odu dalje od pukog ponavljanja saznanja i počnu da objašnjavaju zašto je njihovo novo razumevanje važno.</li>
  <li>Olakšajte diskusiju u paru ili maloj grupi fokusiranu na primenu naučenog na šire situacije ili buduće kontekste.</li>
  <li>Koristite podsticaje koji podstiču učenike da prošire svoje rezonovanje na scenarije iz stvarnog sveta ili one orijentisane ka budućnosti.</li>
  <li>Vodite diskusiju pitanjima koja podstiču primenu, kao što je kako bi ovo razumevanje moglo informisati odluke ili rešiti probleme.</li>
  <li>Podržite pronalaženje smisla pomažući učenicima da generišu sopstvene primere umesto da im vi dajete primere.</li>
  <li>Cirkulišite da biste slušali, postavljali propratna pitanja i podsticali učenike da opravdaju ideje koristeći dokaze iz istraživanja.</li>
</ul>

<p><strong>✅ Očekivani odgovori učenika</strong></p>
<ul>
  <li>Učenici opisuju kako bi se njihovo razumevanje moglo primeniti van neposrednog istraživanja.</li>
  <li>Učenici povezuju saznanja sa odlukama u stvarnom svetu, budućim scenarijima ili širim idejama.</li>
  <li>Učenici objašnjavaju zašto je naučeno važno koristeći dokaze iz svog rada.</li>
  <li>Učenici predlažu implikacije ili posledice na osnovu svog novog razumevanja.</li>
</ul>

<p><strong>🌍 Transcendentno razmišljanje</strong></p>
<ul>
  <li>Recite: Pozovite učenike da razmisle o tome kako se ovo razumevanje povezuje sa višim ciljevima, budućim izazovima ili smislenim primenama u stvarnom svetu.</li>
  <li>Podstaknite učenike da napišu ili podele jednu rečenicu objašnjavajući zašto je ovo naučeno važno van učionice.</li>
  <li>Očekivani odgovori ističu dugoročni uticaj, relevantnost za buduće odluke ili veze sa većim sistemima ili idejama.</li>
</ul>

==================================================
SEKCIJA 6: PONAVLJANJE I PRISEĆANJE UZ VREMENSKE RAZMAKE
==================================================

Ti si profesionalni formater HTML-a za nastavu. Tvoj cilj je da transformišeš JSON podatke u čist vodič za učionicu namenjen nastavniku.

HTML I STILSKA OGRANIČENJA:
- Izbaci SAMO validan HTML koristeći dozvoljene tagove.
- Svaki <li> mora biti unutar <ul>. Nikada ne stavljaj <p> unutar <li>.
- Koristi emojije kao markere za sekcije kao što je prikazano u šablonu.

PRAVILA ZA OBRADU SADRŽAJA:
- Pravilo jednog „Recite“: Osiguraj da svaki podsticaj za nastavnika počinje sa tačno jednim <strong>Recite:</strong>. Ako JSON već sadrži „Say:“, ukloni ga pre obmotavanja.
- Migracija metapodataka: Za Prisećanje uz vremenske razmake, pronađi informaciju „(Draws from...)“ u JSON-u. Premesti je u naslov <strong> i obriši je iz tela „Recite:“.
- Inteligencija: Nemoj samo kopirati i lepiti. Ako je tekst u JSON-u neuredan, preformuliši ga da bude profesionalan i jasan za nastavnika BEZ izmišljanja novih ideja.

RENDERUJ OVU STRUKTURU TAČNO (popuni mesta iz JSON-a; ako su Materijali prazni izbaci <li>Nema</li>):

<h3><span style="color: rgb(115, 191, 39);">Ponavljanje i prisećanje uz vremenske razmake (5 min)</span></h3>

<p>📚 <strong>Materijali</strong></p>
<ul>
  [Izlistaj stavke iz ReviewAndSpacedRetrieval.Materials ili <li>Nema</li>]
</ul>

<p><strong>Napomene za nastavnika:</strong> [Napiši kratak pedagoški kontekst o aktivnom prisećanju i dugoročnom zadržavanju informacija na osnovu cilja lekcije, koristeći SAMO ideje prisutne u ulaznoj sekciji.]</p>

<h3>📋 Instrukcije za nastavnike</h3>

<p><strong>Aktivno prisećanje</strong></p>
<ul>
  <li><strong>Recite:</strong> [Izvuci i očisti ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.Question]</li>
</ul>
<p>✅ <strong>Očekivani odgovori učenika</strong></p>
<ul>
  [Renderuj ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.ExpectedStudentResponses kao <li> stavke]
</ul>

<p><strong>Ispravljanje čestih pogrešnih uverenja</strong></p>
<ul>
  <li>[Navedi sažet scenario za ispravljanje uobičajenih grešaka koristeći SAMO ono što se pojavljuje u ulaznoj sekciji; ako ništa nije eksplicitno, minimalno rezimiraj bez dodavanja novog sadržaja.]</li>
</ul>

<p><strong>💭 Veza sa ključnim pitanjem</strong></p>
<ul>
  <li><strong>Recite:</strong> [Kreiraj podsticaj koji povezuje današnje dokaze sa velikim pitanjem unit-a koristeći samo priloženi kontekst Ključnih pitanja unit-a ako su prisutna, u suprotnom neka bude generički i sadržajno neutralno.]</li>
</ul>
<p>✅ <strong>Očekivani odgovori učenika</strong></p>
<ul>
  <li>Učenici objašnjavaju kako su dokazi razjasnili širi obrazac.</li>
</ul>

<p><strong>🌍 Transcendentno razmišljanje</strong></p>
<ul>
  <li><strong>Recite:</strong> [Kreiraj podsticaj pitajući zašto je ovo važno u stvarnom svetu ili budućnosti, u skladu sa lekcijom.]</li>
</ul>
<p>✅ <strong>Očekivani odgovori učenika</strong></p>
<ul>
  <li>Učenici povezuju naučeno sa odlukama u stvarnom svetu ili globalnim sistemima.</li>
</ul>

<p><strong>⏳ Prisećanje uz vremenske razmake</strong></p>
<ul>
  <li><strong>Recite:</strong> [Očisti ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.TeacherSay uklanjanjem metapodataka i prefiksa „Say:“; izbaci samo srž instrukcije.]</li>
</ul>
<p>✅ <strong>Očekivani odgovori učenika</strong></p>
<ul>
  [Renderuj ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.ExpectedStudentResponses kao <li> stavke]
</ul>

==================================================
SEKCIJA 7: FORMATIVNO OCENJIVANJE
==================================================

<h3><span>✅ Formativno ocenjivanje</span></h3>

Iz običnog teksta FormativeAssessment-a, izvuci i renderuj podsticaje (Prompts) 1–4 u ovoj tačnoj strukturi (nemoj izmišljati podsticaje; izvuci iz teksta; očisti formatiranje):

<p><strong>Podsticaj 1 (DOK 1):</strong></p>
<p>{Pitanje za podsticaj 1}</p>
<p><strong>✅ Očekivani odgovori učenika</strong></p>
<ul>
  <li>{1–2 očekivana odgovora}</li>
</ul>

<p><strong>Podsticaj 2 (DOK 2):</strong></p>
<p>{Pitanje za podsticaj 2}</p>
<p><strong>✅ Očekivani odgovori učenika</strong></p>
<ul>
  <li>{1–2 očekivana odgovora}</li>
</ul>

<p><strong>Podsticaj 3 (DOK 3):</strong></p>
<p>{Pitanje za podsticaj 3}</p>
<p><strong>✅ Očekivani odgovori učenika</strong></p>
<ul>
  <li>{1–2 očekivana odgovora}</li>
</ul>

<p><strong>Podsticaj 4 (DOK 4):</strong></p>
<p>{Pitanje za podsticaj 4}</p>
<p><strong>✅ Očekivani odgovori učenika</strong></p>
<ul>
  <li>{1–2 očekivana odgovora}</li>
</ul>

==================================================
SEKCIJA 8: VEŽBA ZA UČENIKE
==================================================

NASLOV SEKCIJE (MORA):
<h3><span>🖊 Vežba za učenike</span></h3>

Renderuj običan tekst StudentPractice-a u HTML koristeći ovu OBAVEZNU strukturu i redosled (nemoj menjati redosled; nemoj dodavati zadatke; nemoj dodavati emojije):
- Pasus sa napomenama za nastavnika (Teacher Notes)
- Uputstva za Zadatak 1 (DOK 2)
- Očekivani odgovori učenika (kao <ul> sa 3–4 <li>)
- Uputstva za Zadatak 2 (DOK 3)
- Očekivani odgovori učenika (kao <ul> sa 3–4 <li>)
- Uputstva za Zadatak 3 (DOK 3) + zahtevani elementi
- Očekivani odgovori učenika (kao <ul> sa 3–4 <li>)
- Refleksija na kraju

Blokovi za očekivane odgovore učenika MORAJU biti:
<p><strong>✅ Očekivani odgovori učenika</strong></p>
<ul>
  <li>...</li>
</ul>

Refleksija MORA biti:
<p><strong>Refleksija:</strong></p>
<p>Jedan podsticaj za refleksiju.</p>

FINALNO PRAVILO ZA OUTPUT:
Vrati SAMO kombinovani HTML za sve sekcije po redu. Bez dodatnog omotačkog teksta.`,

  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `Ti si profesionalni formater HTML-a za nastavu koji piše za nastavnike u učionici.

Dobićeš strukturirani JSON koji predstavlja informacije o unit-u na visokom nivou.

KRITIČNA PRAVILA
- Izbaci SAMO validan HTML.
- NEMOJ dodavati objašnjenja ili komentare.
- NEMOJ izmišljati sadržaj.
- NEMOJ ponavljati sekcije.
- Dozvoljeni tagovi SAMO: <p>, <h2>, <h3>, <strong>, <em>, <span>, <ol>, <ul>, <li>
- Liste smeju sadržati SAMO <li> kao direktnu decu.
- BEZ ugnježdenih lista.
- BEZ <p> unutar <li>.

--------------------------------
SEKCIJA 1: OPIS
--------------------------------
Renderuj koristeći TAČAN šablon:

<h2><strong>{UnitTitle}</strong></h2>
<p>{UnitDescription}</p>
<h3><span>Pregled oblasti</span></h3>

--------------------------------
SEKCIJA 2: KLJUČNA PITANJA
--------------------------------
<h3><span>💭 Ključna pitanja</span></h3>
Renderuj kao neuređenu listu (unordered list).

--------------------------------
SEKCIJA 3: CILJEVI UČENJA UČENIKA
--------------------------------
<h3><span>🎯 Ciljevi učenja učenika</span></h3>
Renderuj kao neuređenu listu (unordered list).

--------------------------------
SEKCIJA 4: USKLAĐENI STANDARDI
--------------------------------
<h3><span>📏 Usklađeni standardi</span></h3>
Renderuj kao neuređenu listu (unordered list).

--------------------------------
SEKCIJA 5: KLJUČNI REČNIK
--------------------------------
<h3><span>🔤 Ključni rečnik</span></h3>
Renderuj kao uređenu listu (ordered list).

--------------------------------
ULAZNI JSON:
{{$UnitCommonJson}}
`,

  // ---- Šeme (JSON Schema objekti) ----
  STEP0_SCHEMA: {
    "title": "UnitPlanResponse",
    "type": "object",
    "properties": {
      "UnitDescription": {
        "type": "object",
        "properties": {
          "Description": {
            "type": "string",
            "description": "Opis kao jedan povezan pasus u običnom tekstu (4–5 celih rečenica) napisan prirodnim glasom nastavnika koji biste mogli direktno reći učenicima. Bez HTML-a, bez emojija, bez nabrajanja. Mora teći konverzacijski, ali pratiti ovu strukturu (bez naslova): (1) rečenica sa „udicom“ koja budi radoznalost ili pravi iznenađujući kontrast, (2) rečenica „U ovom unit-u ćete...“ o ishodima postignuća, (3) rečenica „Ojačaćete svoje veštine u...“ o sposobnostima razmišljanja/analize, (4) rečenica „Ovo se povezuje sa...“ o relevantnosti za stvarni svet, (5) rečenica „Razumevanje ovoga je važno jer...“ o širem značaju ili dugoročnom uticaju."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Kreiraj ključna pitanja koja se fokusiraju samo na široke, univerzalne koncepte kao što su promena, dokaz, obrasci, odnosi, sistemi ili rezonovanje. NEMOJ pominjati nikakve pojmove, procese, rečnik ili primere specifične za predmet. Pitanja moraju biti otvorenog tipa, prenosiva kroz sve discipline i nemoguća za odgovor jednostavnim učenjem sadržaja lekcije ili unit-a. Fokusiraj se samo na velike ideje, ne na predmetnu materiju.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Kompletna sekcija 'Ciljevi učenja učenika' za ceo unit. Svaka stavka na listi mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se sa DOK oznakom u zagradi",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "array",
            "description": "Navedi sve jedinstvene obrazovne standarde korišćene bilo gde u ovom unit-u i njegovim lekcijama. NEMOJ dodavati standarde koji se ne pojavljuju u sadržaju unit-a. Svaki standard mora uključivati kod standarda i opis, npr. 'MS-ESS1-1: Razviti i koristiti model sistema Zemlja–Sunce–Mesec za opisivanje cikličnih obrazaca lunarnih faza, pomračenja i godišnjih doba.'",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Kompletna sekcija 'Ključni rečnik' kao lista stringova. Svaki string treba da bude jedan termin sa definicijom odvojenom crticom. Primer: 'Gravitacija - Sila koja privlači objekte jedne prema drugima'. Sve definicije moraju biti kratke, prilagođene uzrastu i direktno povezane sa sadržajem lekcije.",
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
        "description": "Lista kontejnera lekcija za ovaj unit (samo okvir). Svaka stavka mora biti bez preklapanja i jasno omeđena tako da se sadržaj ne ponavlja kroz lekcije.",
        "items": {
          "type": "object",
          "properties": {
            "lessonNumber": {
              "type": "integer",
              "description": "Redni broj lekcije. Počevši od 1."
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
    "title": "InquiryUnitPlanResponse",
    "type": "object",
    "properties": {
      "AssessPriorKnowledge": {
        "type": "string",
        "description": "Kompletna sekcija 'Procena prethodnog znanja' kao običan tekst (ukupno 150-250 reči). SAMO Lekcija 1 treba da sadrži detaljan blok; SVE OSTALE LEKCIJE MORAJU VRATITI PRAZAN STRING za ovo polje. Za Lekciju 1, struktura mora uključivati: 1. Uključi ovu sekciju samo u prvu lekciju unit-a, odmah nakon Ciljeva učenja učenika. 2. Osiguraj korišćenje DOK 1-3 podsticaja. 3. Uključi preduslovne veštine potrebne za ciljeve učenja učenika. 4. Odaberi jedan modalitet sa ove liste i potpuno ga razvij: postavljanje pitanja, K-W-L, vizuelni prikazi, konceptualne mape, reflektivno pisanje, vodiči za predviđanje, ocenjivanje rečnika. 5. Početni podsticaj nastavnika sa izjavom 'Recite:' koja uvodi odabrani modalitet i objašnjava kako će učenici izneti trenutno razumevanje. 6. Jasna uputstva i šablon/struktura za odabrani modalitet. 7. Sekcija 'Očekivani odgovori učenika' koja pokazuje predviđene odgovore ili uobičajena pogrešna uverenja za odabrani modalitet. 8. Završni podsticaj nastavnika 'Recite:' koji potvrđuje razmišljanje učenika i najavljuje istraživanje u okviru unit-a. 9. Nakon potpunog razvoja jednog modaliteta, navedi 2 kratke alternativne opcije koje bi nastavnik mogao da izabere."
      },
      "EssentialQuestions": {
        "type": "array",
        "description": "Samo nalepi sva ključna pitanja na nivou unit-a istim redosledom ako su data. Ako nisu data, generiši tačno 3 konceptualna pitanja koja se fokusiraju samo na široke, univerzalne koncepte kao što su promena, dokaz, obrasci, odnosi, sistemi ili rezonovanje. NEMOJ pominjati nikakve pojmove, procese, rečnik ili primere specifične za predmet. Pitanja moraju biti otvorenog tipa, prenosiva kroz sve discipline i nemoguća za odgovor jednostavnim učenjem sadržaja lekcije ili unit-a. Fokusiraj se samo na velike ideje, ne na predmetnu materiju.",
        "items": {
          "type": "string"
        }
      },
      "StandardsAligned": {
        "type": "array",
        "description": "Kompletna sekcija 'Usklađeni standardi' za ovu lekciju. Svaki standard mora uključivati kod i opis standarda, i moraju biti potpuno isti onima koji su korišćeni u Unit-u. npr. 'MS-ESS1-1: Razviti i koristiti model sistema Zemlja–Sunce–Mesec za opisivanje cikličnih obrazaca lunarnih faza, pomračenja i godišnjih doba.'",
        "items": {
          "type": "string"
        }
      },
      "OrientationPhase": {
        "type": "object",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Doslovno: 'Svrha: Učenici se upoznaju sa stvarnom misterijom koja budi radoznalost i motiviše istraživanje. Oni prepoznaju problem i aktiviraju prethodno znanje kako bi se pripremili za dublje istraživanje.'"
          },
          "Materials": {
            "type": "array",
            "description": "Lista potrebnih materijala (npr. vizuelna sredstva, markeri, itd.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Engage": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Kreirajte scenario za uvođenje fenomena. Osigurajte da se fokusira na buđenje radoznalosti bez davanja naučnih objašnjenja." },
                  "FacilitationMoves": { "type": "array", "description": "Generišite 2-3 specifična pedagoška poteza koji vode tiho posmatranje i deljenje u paru. Uključite skripte koje počinju sa 'Recite:' (npr. 'Recite: Odvojite 30 sekundi da tiho posmatrate...'). Fokusirajte se na beleženje i organizovanje zapažanja učenika u smislene kategorije i podsticanje više perspektiva.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generišite 2-3 specifična podsticaja kao jedan string kako biste pomogli učenicima da identifikuju detalje, uoče obrasce i iznesu početna čuđenja. Ohrabrite učenike da objasne zašto određeni detalji deluju važno i da nadograđuju ili upoređuju svoja zapažanja." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "Connect": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Kreirajte specifičan scenario za nastavnika (koji počinje sa 'Recite:') koji pomaže učenicima da svoja zapažanja fenomena pretvore u istraživačka pitanja ili probleme dok grupišu ideje u ključne teme." },
                  "PromptingOptions": { "type": "string", "description": "Navedite 2-3 specifična podsticaja kako biste pomogli učenicima da povežu zapažanja sa osnovnim izazovima, opravdaju razmišljanje dokazima i odrede prioritete o tome šta vredi istraživati." },
                  "FacilitationMoves": { "type": "array", "description": "Predložite 2-3 poteza za podršku učenicima u doterivanju njihovih ideja i njihovom grupisanju, uz podsticanje da objasne svoje rezonovanje. Uključite instrukciju za beleženje i isticanje ponavljajućih pitanja bez davanja odgovora.", "items": { "type": "string" } }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves"],
                "additionalProperties": false
              },
              "Activate": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Razvijte instrukciju vođenu nastavnikom ('Recite:') za olakšavanje diskusije u paru ili grupi koja generiše specifične ideje, objašnjenja ili rešenja koristeći dostupne informacije i ograničenja. Podstaknite poređenje i rezonovanje." },
                  "PromptingOptions": { "type": "string", "description": "Navedite 2-3 podsticaja kako biste ohrabrili učenike da predlože ideje, objasne rezonovanje, razmotre alternativne pristupe i procene koji delovi njihovog razmišljanja su najsigurniji ili najneizvesniji." },
                  "FacilitationMoves": { "type": "array", "description": "Opišite 2-3 poteza tokom cirkulisanja za slušanje rezonovanja, traženje jasnoće/opravdanja i isticanje različitih pristupa bez ocenjivanja tačnosti.", "items": { "type": "string" } }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves"],
                "additionalProperties": false
              },
              "Probe": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Kreirajte scenario koji podstiče učenike da doteraju i testiraju svoje ideje ispitivanjem pretpostavki, razmatranjem različitih uslova i identifikacijom ključnih faktora ove lekcije." },
                  "PromptingOptions": { "type": "string", "description": "Predložite 2-3 specifična podsticaja za testiranje ideja u novim uslovima, identifikaciju slabosti i revidiranje razmišljanja koristeći dokaze za fenomene ove lekcije." },
                  "FacilitationMoves": { "type": "array", "description": "Navedite 2-3 specifična poteza za podsticanje učenika da se vrate na svoje početne ideje i revidiraju ih na osnovu dokaza i opravdaju promene u svom razmišljanju.", "items": { "type": "string" } },
                  "Closing": { "type": "string", "description": "Završna instrukcija da podstaknete učenike da testiraju i revidiraju svoje ideje, razmotre dugoročne efekte i promenu uslova, i koriste dokaze iz posmatranja kako bi ojačali ili odbacili svoja razmišljanja." }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves", "Closing"],
                "additionalProperties": false
              }
            },
            "required": ["Engage", "Connect", "Activate", "Probe"],
            "additionalProperties": false
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers"
        ],
        "additionalProperties": false
      },
      "ConceptualizationPhase": {
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Doslovno: 'Svrha: Učenici generišu smislena istraživačka pitanja, biraju centralno pitanje za istraživanje i kreiraju plan akcije koji će voditi njihov proces istraživanja.'"
          },
          "Materials": {
            "type": "array",
            "description": "Lista potrebnih materijala (npr. vizuelna sredstva, markeri, itd.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "GuideQuestionGeneration": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Kreirajte scenario za nastavnika (koji počinje sa 'Recite:') za uvod u sesiju osmišljavanja pitanja. Fokusirajte se na prelazak sa individualnog na deljenje u paru kako bi se proširile ideje." },
                  "FacilitationMoves": { "type": "array", "description": "Generišite 2-3 specifična poteza za podršku generisanju pitanja učenika. Uključite obezbeđivanje vremena za razmišljanje, javno beleženje svih pitanja i podsticanje učenika da doteraju, kombinuju ili prošire pitanja bez prosuđivanja.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generišite 2-3 specifična podsticaja kako biste pomogli učenicima da iznesu čuđenja, identifikuju šta žele da razumeju i fokusiraju se na ključne aspekte sistema ili dizajna." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "IdentifyResearchQuestion": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Kreirajte scenario ('Recite:') koji vodi učenike u odabiru pitanja koje bi im pomoglo da najviše nauče iz modela koji se može testirati." },
                  "FacilitationMoves": { "type": "array", "description": "Predložite 2-3 poteza koji vode učenike u razvrstavanju pitanja u teme i poređenju ideja na osnovu mogućnosti testiranja. Uključite poteze za podršku učenicima u doterivanju širokih pitanja u jasna istraživanja identifikovanjem varijabli.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generišite 2-3 podsticaja koji pomažu učenicima da procene pitanja na osnovu mogućnosti testiranja, jasnosti, fokusa na varijable i potencijala za generisanje korisnih dokaza." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CreateAnActionPlan": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Kreirajte scenario ('Recite:') koji podstiče učenike da definišu šta će posmatrati, menjati i prikupljati kao dokaze." },
                  "FacilitationMoves": { "type": "array", "description": "Opišite 2-3 poteza za podršku učenicima u dizajniranju plana istraživanja i identifikovanju varijabli. Uključite poteze koji podstiču učenike da planovi budu specifični i proverljivi, i osiguraju da imaju jasan način za utvrđivanje uspeha.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Navedite 2-3 specifična podsticaja kako biste pomogli učenicima da razjasne šta će menjati, šta će ostati isto i kako će upoređivati rezultate." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              }
            },
            "required": ["GuideQuestionGeneration", "IdentifyResearchQuestion", "CreateAnActionPlan"],
            "additionalProperties": false
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers"
        ],
        "additionalProperties": false
      },
      "InvestigationPhase": {
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Doslovno: Svrha: Učenici aktivno istražuju fenomen kroz posmatranje, analizu modela i prikupljanje dokaza, gradeći set podataka koji će kasnije koristiti za formiranje zaključaka"
          },
          "Materials": {
            "type": "array",
            "description": "Lista potrebnih materijala (npr. vizuelna sredstva, markeri, itd.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "LaunchInvestigation": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Kreirajte skripte (koje počinju sa 'Recite:') za uvođenje zbunjujućeg scenarija ili modela. Uključite instrukciju za 'Prikazivanje modela, scenarija, demonstracije ili kratke priče koja uključuje grešku, neefikasnost ili neočekivani rezultat' kako biste podstakli radoznalost." },
                  "FacilitationMoves": { "type": "array", "description": "Generišite 2-3 poteza za vođenje pokretanja. Uključite omogućavanje vremena učenicima za posmatranje pre reagovanja, podsticanje više interpretacija i naglašavanje da može postojati više validnih ideja.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generišite 2-3 specifična podsticaja kako biste pomogli učenicima da uoče važne ili neočekivane karakteristike, generišu moguća objašnjenja i opravdaju razmišljanje dokazima." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CollaborationExpectations": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Kreirajte scenario ('Recite:') za postavljanje zadatka kao međuzavisnog rada i naglasite zajedničku odgovornost. Uključite instrukcije za korišćenje početaka rečenica (npr. 'Mislim... zato što...') i struktura za participaciju kao što su žetoni za razgovor." },
                  "FacilitationMoves": { "type": "array", "description": "Navedite 3-5 specifičnih poteza ili ponašanja učenika koja treba pratiti tokom grupnog rada (npr. identifikovanje obrazaca, beleženje u zajedničke tabele podataka, upoređivanje interpretacija). Osigurajte da su fokusirani na to da svi učenici doprinose posmatranju i doterivanju ideja.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Navedite 2-3 podsticaja kako biste ohrabrili učenike da dele zapažanja, upoređuju interpretacije, opravdavaju tvrdnje dokazima i zajednički revidiraju ideje." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CirculationPrompts": {
                "type": "object",
                "description": "Specifični podsticaji koje nastavnik koristi dok obilazi grupe.",
                "properties": {
                  "Conceptual": { "type": "array", "description": "2-3 podsticaja fokusirana na ključne naučne ili koncepte lekcije (npr. 'Koji dokazi pokazuju da ovo radi?').", "items": { "type": "string" } },
                  "Reasoning": { "type": "array", "description": "2-3 podsticaja za podsticanje opravdanja i logike (npr. 'Kako ovaj pokušaj menja tvoje razmišljanje?').", "items": { "type": "string" } },
                  "Collaboration": { "type": "array", "description": "2-3 podsticaja za osiguravanje uključivanja svih glasova (npr. 'Ko još nije doprineo?').", "items": { "type": "string" } }
                },
                "required": ["Conceptual", "Reasoning", "Collaboration"],
                "additionalProperties": false
              }
            },
            "required": ["LaunchInvestigation", "CollaborationExpectations", "CirculationPrompts"],
            "additionalProperties": false
          },
          "AnticipatedMisconceptions": {
            "type": "array",
            "description": "Generišite 2-3 česta pogrešna uverenja učenika koja će se verovatno pojaviti tokom ove lekcije. Svaka stavka mora da se fokusira na specifično nerazumevanje i skriptu odgovora nastavnika.",
            "items": {
              "type": "object",
              "properties": {
                "Misconception": { "type": "string", "description": "Opišite pogrešno uverenje u 1 rečenici, počevši sa 'Učenici mogu misliti...'. NEMOJTE koristiti boldovanje niti strong tagove." },
                "TeacherResponse": { "type": "string", "description": "Jasna skripta odgovora za nastavnika (počevši sa 'Reakcija nastavnika: ') koja modeluje kako odgovoriti u trenutku pomoću specifičnog podsticaja (počevši sa 'Recite:'). NEMOJTE koristiti boldovanje niti strong tagove." }
              },
              "required": ["Misconception", "TeacherResponse"],
              "additionalProperties": false
            }
          },
          "Differentiation": {
            "type": "object",
            "properties": {
              "LanguageLearners": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Generišite 2-3 podrške specifične za lekciju (vizuelni materijali, banke reči, gestovi) koje pomažu učenicima kojima je jezik strani da pristupe idejama i iskažu ih.", "items": { "type": "string" } },
                  "SentenceStarters": { "type": "array", "description": "Generišite 3-4 početka rečenica koji pomažu učenicima da opišu, objasne i komuniciraju svoje razmišljanje za ovu specifičnu lekciju.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "SentenceStarters"],
                "additionalProperties": false
              },
              "AdditionalScaffolding": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Generišite 2-3 podrške korak-po-korak (strukturirani alati, modelovani primeri, razmišljanje naglas) i tačna uputstva koja pomažu učenicima da završe zadatak.", "items": { "type": "string" } },
                  "Checklist": { "type": "array", "description": "Generišite 3-4 pitanja za kontrolnu listu koja vode učenike u osmišljavanju njihovog učenja tokom istraživanja.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "Checklist"],
                "additionalProperties": false
              },
              "GoDeeper": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Generišite 2-3 proširenja koja povećavaju kompleksnost (specifični izazovi, identifikacija obrazaca) kako bi pomogli učenicima da prodube ili poboljšaju svoje razmišljanje koristeći dokaze.", "items": { "type": "string" } },
                  "AdvancedQuestion": { "type": "string", "description": "Generišite jedno kompleksno 'Recite:' pitanje za podsticanje dubljeg konceptualnog razumevanja." },
                  "ExpectedResponses": { "type": "array", "description": "Generišite 3-4 specifična primera visokokvalitetnih odgovora učenika na napredno pitanje.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "AdvancedQuestion", "ExpectedResponses"],
                "additionalProperties": false
              }
            },
            "required": ["LanguageLearners", "AdditionalScaffolding", "GoDeeper"],
            "additionalProperties": false
          },
          "AccommodationsAndModifications": {
            "type": "object",
            "description": "Opšta prilagođavanja za odeljenje plus individualni planovi podrške učenicima. Model mora koristiti SAMO imena učenika i planove navedene u promptu.",
            "properties": {
              "General": {
                "type": "string",
                "description": "Opšta podrška i modifikacije u učionici koje se primenjuju na većinu ili sve učenike tokom ove aktivnosti."
              },
              "IndividualSupport": {
                "type": "array",
                "description": "Lista specifičnih prilagođavanja za učenike. Svaki unos MORA koristiti imena učenika i planove tačno onako kako su navedeni u promptu.",
                "items": {
                  "type": "object",
                  "properties": {
                    "StudentName": {
                      "type": "string",
                      "description": "Puno ime učenika tačno onako kako je navedeno u promptu."
                    },
                    "Plan": {
                      "type": "string",
                      "description": "Kratak opis individualizovanog prilagođavanja ili modifikacije za ovog učenika."
                    }
                  },
                  "required": [
                    "StudentName",
                    "Plan"
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
          },
          "QuickCheck": {
            "type": "string",
            "description": "Finalno pitanje za proveru razumevanja sa 2-3 očekivana odgovora učenika koji pokazuju postignuće"
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "AnticipatedMisconceptions",
          "Differentiation",
          "AccommodationsAndModifications",
          "QuickCheck"
        ],
        "additionalProperties": false
      },
      "ConclusionPhase": {
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Doslovno: Svrha: Učenici analiziraju svoje prikupljene podatke i koriste dokaze da odgovore na istraživačko pitanje, formirajući jasno objašnjenje zasnovano na svojim saznanjima."
          },
          "Materials": {
            "type": "array",
            "description": "Lista potrebnih materijala (npr. vizuelna sredstva, markeri, itd.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "string",
            "description": "Instrukcije za nastavnike moraju pratiti ovu strukturu: nastavnici podstiču učenike da se vrate na istraživačko pitanje, pregledaju prikupljene podatke, identifikuju obrasce, doteraju ideje kroz grupnu diskusiju i opravdaju objašnjenja dokazima. Nastavnici moraju voditi, ali nikada davati naučna objašnjenja. Model mora uključiti skriptovane podsticaje nastavnika kao što su Pregledajte svoje beleške i podatke, Koje obrasce primećujete, Koji dokazi potkrepljuju ovu ideju i Koristite svoje podatke da potkrepite tvrdnju. Instrukcije moraju zahtevati od učenika da samostalno napišu objašnjenje, a zatim ga podele sa partnerom ili grupom. Očekivani odgovori učenika moraju pokazati rezonovanje zasnovano na dokazima na opšti način, bez primera specifičnih za domen. Ceo izlaz mora ostati sadržajno neutralan."
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers"
        ],
        "additionalProperties": false
      },
      "DiscussionPhase": {
        "type": "object",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Doslovno: Svrha: Pomozite učenicima da pređu sa onoga što su otkrili na to zašto je to važno."
          },
          "Materials": {
            "type": "array",
            "description": "Lista potrebnih materijala (npr. vizuelna sredstva, markeri, itd.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "string",
            "description": "Model mora generisati pasus koji instruiše nastavnike kako da olakšaju fazu diskusije u kojoj učenici idu dalje od jednostavnog izveštavanja o saznanjima i počinju da istražuju širi značaj, primene i implikacije svog učenja. Pasus mora usmeriti nastavnike da podstaknu učenike da povežu rezultate svog istraživanja sa situacijama iz stvarnog sveta, budućim scenarijima ili većim konceptualnim idejama. Treba da zahteva od modela da uključi uputstva za diskusiju u paru ili grupi, postavljanje pitanja od strane nastavnika koje podstiče učenike da prošire i primene svoje rezonovanje, i poteze za facilitaciju koji podržavaju učenike u generisanju sopstvenih primera umesto da se oslanjaju na one koje daje nastavnik. Šema takođe mora zahtevati od modela da izbaci set očekivanih odgovora učenika koji ilustruju kako bi učenici mogli da primene svoje razumevanje na autentične kontekste ili one orijentisane ka budućnosti."
          },
          "TranscendentThinking": {
            "type": "string",
            "description": "Pitanja o primeni u stvarnom svetu koja povezuju naučeno sa svrhom/značenjem/velikim idejama, sa očekivanim odgovorima učenika koji pokazuju dublje razumevanje"
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "TranscendentThinking"
        ],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "object",
        "description": "Kompletna sekcija 'Ponavljanje i prisećanje uz vremenske razmake' kao običan tekst. Ova 5-minutna aktivnost mora uključivati ovim tačnim redosledom: 1. Lista materijala (često nisu potrebni) 2. Pasus sa napomenama za nastavnika koji objašnjava: - Kako ova strategija ponavljanja poboljšava zadržavanje informacija - Veza sa prethodnim konceptima učenja - Kako transcendentna refleksija produbljuje razumevanje 3. Instrukcije za nastavnike koje sadrže: - Podsticaj za aktivno prisećanje koristeći deljenje u paru/grupi - Očekivani odgovori učenika (2-3 primera sa nabrajanjem) 4. Blok za ispravljanje čestih pogrešnih uverenja sa: - Primerima izjava o pogrešnim uverenjima - Skriptovima za odgovore nastavnika koji adresiraju svaku 5. Veza sa suštinskim pitanjem uključujući: - Podsticaj nastavnika koji povezuje sa pitanjem unit-a - Očekivani odgovori učenika (2-3 primera) 6. Sekcija Transcendentno razmišljanje sa: - Podsticajem za primenu u stvarnom svetu - Instrukcijom za vreme za razmišljanje - Očekivani odgovori učenika (2-3 primera) 7. Komponenta Prisećanje uz vremenske razmake koja sadrži: - Jasnu referencu na specifičnu prethodnu lekciju - Pitanje koje povezuje prošle + trenutne koncepte - Detaljne kriterijume uspeha / očekivane odgovore Sve sekcije moraju koristiti 'Recite:' izjave za podsticaje nastavnika i jasno obeležene 'Očekivane odgovore učenika' koji pokazuju 2-3 uzorka odgovora. Vratiti kao običan tekst.",
        "properties": {
          "Materials": {
            "type": "array",
            "description": "Potrebni fizički predmeti za ovu vođenu aktivnost (npr. 'Loptice od stiropora, kanap, markeri') formatirani kao lista",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "description": "",
            "properties": {
              "ActiveRecall": {
                "type": "object",
                "description": "",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": ""
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "Question",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              },
              "SpacedRetrieval": {
                "type": "object",
                "description": "Mora uključiti jasnu referencu na specifičnu prethodnu lekciju pored naslova Prisećanje uz vremenske razmake i naznačiti to ovako: '(Draws from Unit 3, Lesson 2.)' Mora koristiti pitanje za aktivno prisećanje koje povezuje prošle i trenutne koncepte. Ne sme zahtevati od učenika korišćenje beleški ili resursa za odgovor.",
                "properties": {
                  "TeacherSay": {
                    "type": "string",
                    "description": ""
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "TeacherSay",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              }
            },
            "required": [
              "ActiveRecall",
              "SpacedRetrieval"
            ],
            "additionalProperties": false
          }
        },
        "required": [
          "Materials",
          "InstructionsForTeachers"
        ],
        "additionalProperties": false
      },
      "FormativeAssessment": {
        "type": "string",
        "description": "Kompletna sekcija 'Formativno ocenjivanje' kao običan tekst. Mora pratiti ovu strukturu: Pasus uvoda namenjen nastavniku koji ukratko navodi svrhu i način primene. 4 zahtevana podsticaja (pitanja) obeležena sa 'Podsticaj 1 (DOK 1):', 'Podsticaj 2 (DOK 2):', itd. pokrivajući DOK nivoe 1-4. Za svaki podsticaj: - Pitanje koje testira razumevanje na navedenom DOK nivou - Zaglavlje 'Očekivani odgovori učenika' (bez simbola štikliranja/emojija) - 1-2 odgovora u formi cele rečenice koji pokazuju postignuće Završi kratkim pasusom koji imenuje specifičnu strategiju formativnog ocenjivanja koja se koristi (npr. 'Izlazni listić', 'Misli-Upari-Podeli'). Primer formata: Podsticaj 1 (DOK 1): 'Zašto planete ostaju u orbiti umesto da odlete u svemir?' Očekivani odgovori učenika 'Zato što njihovo kretanje unapred i Sunčeva gravitacija rade zajedno kako bi stvorili stabilnu orbitu.' [Nastaviti sa Podsticajima 2-4 prateći istu strukturu]"
      },
      "StudentPractice": {
        "type": "string",
        "description": "Kompletna sekcija 'Vežba za učenike' kao običan tekst. Ovo je domaći zadatak / vežba van časa. Prati TAČAN format za odgovor: Napomene za nastavnika: [1 pasus koji objašnjava kako zadaci učvršćuju učenje + grade veze sa stvarnim svetom] (DOK 2) [Prvi zadatak sa jasnim uputstvima za učenike] Očekivani odgovori učenika [3-4 stavke koje pokazuju postignuće] (DOK 3) [Drugi zadatak koji zahteva razmišljanje višeg reda] Očekivani odgovori učenika [3-4 stavke koje pokazuju analizu/primenu] (DOK 3) [Treći zadatak koji povezuje sa širim konceptima] Mora uključiti: [3+ specifična elementa koja učenici treba da adresiraju] Očekivani odgovori učenika [3-4 stavke koje pokazuju sintezu/evaluaciju] Refleksija: Završi jednim podsticajem za samoregulaciju ili transcendentno razmišljanje, kao što su: 'Koji dokaz današnjeg naučnog koncepta možeš pronaći u svom domu ili komšiluku?', 'Kako ti ono što si danas naučio/la pomaže da vidiš svet drugačije?', 'Sa kojim izazovima si se suočio/la radeći ovo kod kuće, i kako si ih prevazišao/la?', ili 'Kako bi ovaj koncept mogao uticati na našu zajednicu ili buduća otkrića?'"
      }
    },
    "required": [
      "AssessPriorKnowledge",
      "OrientationPhase",
      "ConceptualizationPhase",
      "InvestigationPhase",
      "ConclusionPhase",
      "DiscussionPhase",
      "ReviewAndSpacedRetrieval",
      "FormativeAssessment",
      "StudentPractice",
      "EssentialQuestions",
      "StandardsAligned"
    ],
    "additionalProperties": false,
    "x-removablePaths": {
      "EssentialQuestions": [
        "EssentialQuestions"
      ],
      "StandardsAligned": [
        "StandardsAligned"
      ],
      "AssessPriorKnowledge": [
        "AssessPriorKnowledge"
      ],
      "SpacedLearningAndRetrieval": [
        "ReviewAndSpacedRetrieval"
      ],
      "FormativeAssessment": [
        "FormativeAssessment"
      ],
      "AccommodationsAndModifications": [
        "InvestigationPhase.AccommodationsAndModifications"
      ]
    }
  }
};
