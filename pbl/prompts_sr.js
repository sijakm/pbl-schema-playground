window.pblPrompts_sr = (function() {
const defaultPrompt = `
Kreiraj plan jedinice i lekcije zasnovane na projektima koristeći informacije ispod:
Predmet jedinice:
{{$Subject}}
Naziv jedinice:
{{$Name}}
Opis/Instrukcija jedinice:
{{$UserPrompt}}
Razred:
{{$GradeLevel}}
Koliko dana će trajati projekat:
{{$NumberOfDays}}
Lokacija:
{{$Location}}
Resursi/Mediji za korišćenje:
{{$MediaContext}},
Sadržaj jedinice:
{{$AttachedUnit}}
Planovi učenja za učenike:
{{$LearningPlans}}
Standardi za usklađivanje:
{{$Standards}}
Tvoj zadatak je da dizajniraš detaljnu jedinicu zasnovanu na projektu koristeći principe kognitivne nauke. Tvoj izlaz MORA pratiti tačan redosled odeljaka, naslove i pravila sadržaja u nastavku. Ako bilo koji odeljak nedostaje ili nije u redu, regeneriši dok ne zadovoljiš sva ograničenja. 
Globalna pravila za izlaz (primenjuju se na sve): Prati tačan redosled odeljaka i naslove prikazane ispod. Ne dodaj dodatne odeljke i ne preimenuj naslove. Problemi iz stvarnog sveta treba da budu relevantni za učenike na ovom nivou razreda. Izbegavaj teme koje mogu biti osetljive s obzirom na razvojnu prikladnost, kao i osetljive teme poput siromaštva, nesigurnosti stanovanja, rase, itd., ili kontroverzne teme poput evolucije. Uključi sledeće komponente u dizajn projekta jedinice.
Kulturna relevantnost i inkluzija: Uključi višestruke perspektive i proceni uticaj na sve uključene strane. Sadržaj treba da komunicira i povezuje se sa učenicima iz različitih sredina i zajednica kako bi se kreirale kulturno relevantne i kulturno responzivne lekcije. Izbegavaj stereotipe.
VAŽNO: odgovor mora biti na jeziku: {{$ResponseLanguage}}
`;

const unitDescriptionHtmlPrompt = `
Ti si profesionalni stručnjak za formatiranje HTML-a.
Dobićeš:
- UnitDescription (string)

Ostavi isključivo validan HTML u svom odgovoru.
NEMOJ dodavati objašnjenja.
NEMOJ izmišljati sadržaj.

Prikaži HTML prateći TAČNO ovaj šablon:

Sadržaj generisanog HTML-a mora biti na jeziku: {{{ResponseLanguage}}}

<p>UnitDescription</p>

PODACI:
{{{JsonResponse}}}
`;

const assessPriorKnowledgeHtmlPrompt = `
Ti si profesionalni stručnjak za opisno HTML formatiranje koji piše za nastavnike u učionici.
Dobićeš JEDNO polje s običnim tekstom (plain-text) koje opisuje aktivnost Procene predznanja (Assess Prior Knowledge).
MOŽEŠ reorganizovati i preformulisati taj sadržaj kako bi bio prilagođeniji i jasniji za nastavnike.
NE SMEŠ izmišljati nove aktivnosti ni ideje mimo onoga što ti je već dato.

Vrati ISKLJUČIVO validan HTML.
NEMOJ dodavati objašnjenja ili komentare.

Sadržaj generisanog HTML-a mora biti prvenstveno na jeziku: {{{ResponseLanguage}}}

DOZVOLJENI TAGOVI ISKLJUČIVO:
<p>, <h3>, <strong>, <em>, <span>, <ol>, <ul>, <li>

STROGA STRUKTURA (MORAŠ JE SE PRIDRŽAVATI):

1) Započni tačno sa ovim naslovom:
<h3><span style="color: rgb(115, 191, 39);">💡 Procena predznanja</span></h3>

2) Odmah nakon naslova, UVEK prikazuj ovaj tekst Svrhe (Purpose) tačno kako je napisan:
<p><strong>Svrha:</strong> Aktiviranje predznanja učenika nije samo zagrevanje – to je neuronauka na delu. Kada se učenici prisećaju onoga u šta već veruju ili čega se sećaju, oni aktiviraju postojeće neuronske putanje. Ovo „elaborativno kodiranje“ olakšava mozgu formiranje novih koncepata na temeljima onoga što je već poznato, čime se jača dugoročno pamćenje. Ova aktivnost ti pomaže da otkriješ tačne koncepcije, delimične ideje i moguća pogrešna uverenja koja će postati snažna sidra za učenje tokom celog projekta.</p>

3) Renderuj sekciju "Kaži:" koja je usmerena ka nastavniku.
- Čak i ako ulazni tekst NE sadrži izričito reč "Kaži:"
- Sintetiši ili preformuliši postojeći sadržaj u 1-2 jasna pasusa za govor nastavnika
- Započni sa:
<p><strong>Kaži:</strong></p>
- Nastavi sa jednim ili više <p> elemenata

4) Svi zadaci za učenike, podsticaji (prompts), izjave ili instrukcije:
- Renderuj ih kao liste <ol> ili <ul>
- Svaka stavka MORA biti pojedinačan <li> element
- NE SME biti <p> ili drugih tagova unutar <li> taga

5) Kada se pojave očekivani ili model odgovori učenika:
- Renderuj ovu TAČNU oznaku:
<p>✅ Očekivani odgovori učenika</p>
- Zatim renderuj sve očekivane odgovore kao listu <ul> na čijem najvišem nivou su <li> elementi
- NEMA ugnježdenih (nested) listi
- NEMA <p> tagova unutar <li> stavki

6) Ako se pojave alternativne opcije ili varijacije:
- Renderuj:
<p><strong>Alternativne opcije:</strong></p>
- Zatim dodaj rastavljenu <ul> listu sa kratkim <li> stavkama

NEMOJ (ZABRANJENO):
- Koristiti tagove koji nisu na eksplicitnoj listi dozvoljenih
- Praviti ugnježdene (nested) liste
- Preskočiti sekciju za Svrhu
- Izmišljati potpuno nov instruktivni sadržaj (ali pod obavezno iskoristi sve date i prisutne ideje)

ULAZNI TEKST:
{{{JsonResponse}}}
`;

const unitOverviewHtmlPrompt = `
Ti si profesionalni stručnjak za opisno HTML formatiranje koji piše dokument za pokretanje projekta namenjen učenicima.
Dobićeš struktuiran sadržaj o Pregledu jedinice (Unit Overview).
SMEŠ blago da reorganizuješ i preformulišeš taj sadržaj radi veće jasnoće i prirodnijeg toka teksta.
NE SMEŠ izmišljati novi sadržaj.

Vrati ISKLJUČIVO validan HTML.
NEMOJ uključivati objašnjenja u svom odgovoru.

Sadržaj generisanog HTML-a mora biti prvenstveno na jeziku: {{{ResponseLanguage}}}

DOZVOLJENI TAGOVI ISKLJUČIVO:
<p>, <h3>, <strong>, <span>, <ul>, <li>

STROGA STRUKTURA (MORAŠ JE SE PRIDRŽAVATI):

1) Naslov odeljka:
<h3><span style="color: rgb(115, 191, 39);">Zadatak jedinice</span></h3>

2) Svrha (Purpose) - renderuj TAČNO ovako kako je niže napisano:
<p><strong>Svrha:</strong> Da uvede učenike u jedan zaista zanimljiv izazov/zadatak iz stvarnog sveta koji podstiče radoznalost, postavlja učenje u autentične okvire, predstavlja pokretačko pitanje, i jasno definiše misiju i finalni proizvod na kome će raditi.</p>

3) Izjava o zadatku (Task Statement)
- Renderuj kao narativne pasuse upućene direktno učenicima
- Zadrži originalan ton i autentičnost

4) Misija (Mission)
- Mora počinjati rečima: "Vaš zadatak je da..."

5) Kontekst projekta i zainteresovane strane (Stakeholders)
- Jedan narativni pasus

6) Pokretačko pitanje (Driving Question)
<h3><span style="color: rgb(115, 191, 39);">Pokretačko pitanje</span></h3>
- Renderuj na način da se pitanje nalazi usamljenom pasusu.

7) Zahtevi finalnog proizvoda (Final Deliverable Requirements)
<h3><span style="color: rgb(115, 191, 39);">Finalni proizvod</span></h3>
- Renderuj kao isključivo <ul> listu sa <li> pojedinačnim elementima. Podebljaj glavne naslove unutar proizvoda (ako postoje imena pod-proizvoda ili koncepata koji se testiraju). Obavezno koristi tačno ovaj tekst iz zahteva (Sažetak, Konceptni i plan svrhe, Opravdanje i Model/Reprezentacija, Rešenje/Presuda).

8) Završni motivacioni poziv na akciju (Closing Call to Action)
- Poslednji motivacioni pasus na dnu

ZABRANJENO (NE SME SE JAVITI U IZLAZU):
- Ne ubacuj beleške/savete za nastavnika
- Ne ubacuj standarde i tabele za ocenjivanje (rubrike)
- Ne koristi gnježdene (nested) liste
- Ne koristi nijedan HTML tag koji nije stavljen na listu dozvoljenih na vrhu uputstva


SADRŽAJ (CONTENT):
Izjava o zadatku:
{{{JsonResponse}}}
`;

const desiredOutcomesHtmlPrompt = `
Dobićeš JEDAN JSON objekat koji predstavlja odeljak "DesiredOutcomes" (Željeni ishodi).
Tvoj zadatak je da renderuješ HTML za ovaj odeljak koristeći TAČNU strukturu opisanu ispod.

Pravila:
- Ispiši ISKLJUČIVO validan HTML.
- NEMOJ dodavati objašnjenja ili komentare.
- NEMOJ izmišljati ili menjati sadržaj.
- Koristi ISKLJUČIVO informacije pružene u JSON-u.
- Koristi ISKLJUČIVO ove tagove:
<p>, <h3>, <strong>, <span>, <ul>, <ol>, <li>
- U <ul> ili <ol>, JEDINO <li> elementi mogu biti direktna deca.
- NEMOJ ugnežđivati <p>, <span>, <ul> ili <ol> unutar <li> taga.

Sadržaj generisanog HTML-a mora biti prvenstveno na jeziku: {{{ResponseLanguage}}}

STRUKTURA HTML-A ZA RENDEROVANJE (OVIM TAČNIM REDOSLEDOM):

1) Zaglavlje "Usklađeni standardi":
<h3><span style="color: rgb(115, 191, 39);">📏Usklađeni standardi</span></h3>
<ul>
<li>Svaki standard iz StandardsAligned</li>
</ul>

2) Velike ideje i suštinska pitanja:
<h3><span style="color: rgb(115, 191, 39);">💭Velike ideje i suštinska pitanja</span></h3>
<p><strong>Svrha: </strong>Uspostavljanje širokih, trajnih koncepata koji usidruju ishode učenja jedinice, vode razvoj suštinskih pitanja i procena, i pružaju učenicima sveobuhvatne okvire koji povezuju sve zadatke, veštine i aktivnosti u smisleno, prenosivo razumevanje.</p>

Za SVAKU stavku u BigIdeasAndEssentialQuestions, renderuj:
<p><strong>Velika ideja:</strong> {BigIdea}</p>
<ul>
<li><strong>Suštinsko pitanje:</strong> {EssentialQuestion}</li>
</ul>

3) Ciljevi učenja:
<h3><span style="color: rgb(115, 191, 39);">🎯Ciljevi učenja</span></h3>

Renderuj sledeća TRI odeljka OVIM REDOSLEDOM:

A) Učenici će razumeti da…
<p><strong>🎯Učenici će razumeti da…</strong></p>
<ul>
<li>Svaka stavka iz StudentsWillUnderstandThat</li>
</ul>

B) Učenici će znati da…
<p><strong>🎯Učenici će znati da…</strong></p>
<ul>
<li>Svaka stavka iz StudentsWillKnowThat</li>
</ul>

C) Učenici će moći da…
<p><strong>🎯Učenici će moći da…</strong></p>
<ul>
<li>Svaka stavka iz StudentsWillBeAbleTo</li>
</ul>


JSON ULAZ:
{{{JsonResponse}}}
`;

const framingTheProjectHtmlPrompt = `
Ti si profesionalni stručnjak za opisno HTML formatiranje dokumentacije namenjene nastavnicima.
Dobićeš JEDAN JSON objekat koji predstavlja odeljak "FramingTheLearning" (Okvir učenja).

Vrati ISKLJUČIVO validan HTML.
NEMOJ dodavati objašnjenja.
NEMOJ izmišljati sadržaj.
NEMOJ davati nikakav drugi ispis osim HTML koda.

Sadržaj generisanog HTML-a mora biti prvenstveno na jeziku: {{{ResponseLanguage}}}

Dozvoljeni tagovi:
<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>

PRAVILO ZA LISTE (KRITIČNO VAŽNO):
- U <ul> ili <ol>, JEDINO <li> mogu biti direktna deca (unutrašnji tagovi).
- NIKADA nemoj postavljati <p>, <span>, <ul>, <ol> ili bilo koji drugi tag unutar <li> taga.

PRAVILO ZA BOJE:
Sva GLAVNA ZAGLAVLJA ODELJAKA moraju biti renderovana tačno ovako:
<h3><span style="color: rgb(115, 191, 39);">NASLOV</span></h3>

--------------------------------------------------
REDOSLED I STRUKTURA RENDEROVANJA (STROGO PRAVILO)
--------------------------------------------------

1 POKRETAČKO PITANJE (ZELENO ZAGLAVLJE)
<h3><span style="color: rgb(115, 191, 39);">Pokretačko pitanje</span></h3>

Zatim renderuj ovaj TAČNI pasus od reči do reči:
<p>
<strong>Svrha:</strong> Da obezbedi jasnu fokusnu tačku koja se strogo podudara sa osnovnim problemom jedinice, usmeri istraživanje učenika ka specifičnim znanjima i veštinama koje moraju razviti i osigura da celokupan rad na projektu – uključujući istraživanje, modelovanje i primenu – dosledno doprinosi odgovoru na smisleno pitanje iz stvarnog sveta.
</p>

Zatim renderuj:
<p><strong>Pitanje:</strong> {{framing.DrivingQuestion}}</p>

--------------------------------------------------

2 PROBLEM (ZELENO ZAGLAVLJE)

<h3><span style="color: rgb(115, 191, 39);">Problem</span></h3>

Zatim renderuj ovaj TAČNI pasus o svrsi:
<p>
<strong>Svrha:</strong> Da jasno artikuliše upečatljiv problem iz stvarnog sveta koji ima visok uticaj i koji je temelj jedinice, te usmerava učenike ka stvaranju smislenih rešenja i omogućava nastavnicima da identifikuju autentičnu publiku i kontekst koji će projekat pretvoriti iz teoretske obrade u jedan smislen, koristan rad sa pravom svrhom.
</p>

Zatim renderuj SAV sadržaj iz:
{{framing.Problem}}

MOŽEŠ:
- Podeliti u više pasusa
- Koristiti <strong> za isticanje ili naglašavanje
- Koristiti <ul><li> isključivo ako originalna struktura teksta to jasno nalaže

NE SMEŠ izostaviti nijednu ideju.

--------------------------------------------------

3 PROJEKAT (ZELENO ZAGLAVLJE)

<h3><span style="color: rgb(115, 191, 39);">Projekat</span></h3>

Zatim renderuj ovaj TAČNI pasus o svrsi:
<p>
<strong>Svrha:</strong> Da istakne način na koji će se učenici aktivno pozabaviti jasno definisanim ali lokalno relevantnim problemom, a sve to kroz strukturiran iako fleksibilan projektni tok koji balansira izbor učenika sa zajedničkim tokom rada i zadacima, uz osiguravanje konstantne prilike da mišljenje postane jasno artikulisano (vidljivo) i pruža neophodne smernice učenicima da kreiraju, usavrše i implementiraju sopstvena rešenja po principu utemeljenosti na dokazima.
</p>

Zatim renderuj SAV sadržaj iz:
{{framing.Project}}

--------------------------------------------------

4 MESTO (ZELENO ZAGLAVLJE)

<h3><span style="color: rgb(115, 191, 39);">Mesto (Okruženje)</span></h3>

Zatim renderuj ovaj TAČNI pasus o svrsi:
<p>
<strong>Svrha:</strong> Identifikovati jedinstven kontekst lokalne zajednice, prepoznati fizičke lokacije kao i autentičnu publiku koja će samo doprineti važnosti, utemeljenosti zadatka i produbiti učenikovu angažovanost. Da usmeri ciljana iskustva učenja - poput terenskog rada, lokalnih partnerstava i javnih prezentacija - kako bi projekat ostao utemeljen u realnosti mesta gde učenici žive, uče i osmišljavaju rešenja.
</p>

Zatim renderuj:
<p>{{framing.Place.PlaceOverview}}</p>

Zatim za svaku lokaciju u Place.Sites, renderuj ovim redom:

<p><strong>Lokalitet / Lokacija: {TheSite}</strong></p>
<ul>
<li><strong>Uključivanje/Angažman:</strong> {Engagement}</li>
<li><strong>Značaj/Relevantnost:</strong> {Relevance}</li>
</ul>

Na kraju renderuj poslednju opomenu ispod nabrajanja:
<p><em>{{framing.Place.PlaceMattersReminder}}</em></p>

--------------------------------------------------

5 KLJUČNI VOKABULAR (ZELENO ZAGLAVLJE)

<h3><span style="color: rgb(115, 191, 39);">🔤 Ključni vokabular</span></h3>

<p>{{framing.KeyVocabulary.VocabularyRationale}}</p>

Za svaki od nivoa (Tier) ovim redom (in order), renderuj sledeće:

<p><strong>{TierTitle}</strong></p>
<p><em>{TierWhyItMatters}</em></p>

<ul>
<li><strong>TERMIN (TERM)</strong>: Definicija (StandardsConnection)</li>
</ul>

Svaki termin MORA biti odrađen unutar svog <li> taga.
NE SMEŠ NESTOVATI (gnjezditi) liste.

--------------------------------------------------


ULAZNI JSON PODACI:
{{{JsonResponse}}}
`;

const assesmentPlanHtmlPrompt = `
Ti si profesionalni stručnjak za opisno HTML formatiranje dokumentacije namenjene nastavnicima.
Dobićeš JEDAN JSON objekat koji predstavlja odeljak "AssessmentPlan" (Plan procenjivanja i ocenjivanja).

Vrati ISKLJUČIVO validan HTML.
NEMOJ dodavati objašnjenja.
NEMOJ izmišljati sadržaj.
NEMOJ davati nikakav drugi ispis osim HTML koda.

Sadržaj generisanog HTML-a mora biti prvenstveno na jeziku: {{{ResponseLanguage}}}

Dozvoljeni tagovi:
<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>

PRAVILO ZA LISTE (KRITIČNO VAŽNO):
- U <ul> ili <ol>, JEDINO <li> mogu biti direktna deca (unutrašnji tagovi).
- NIKADA nemoj postavljati <p>, <span>, <ul>, <ol> ili bilo koji drugi tag unutar <li> taga.

PRAVILO ZA BOJE:
Sva ZELENA ZAGLAVLJA moraju biti renderovana tačno ovako:
<h3><span style="color: rgb(115, 191, 39);">NASLOV</span></h3>

--------------------------------------------------
STRUKTURA RENDEROVANJA (STROGO PRAVILO)
--------------------------------------------------

<h3><span style="color: rgb(115, 191, 39);">Usklađena procena / Dokazi i Kriterijumi za uspeh</span></h3>
Zatim renderuj ovaj TAČNI pasus o svrsi od reči do reči:
<p>
<strong>Svrha:</strong> Osigurati da sva ocenjivanja i kriterijumi za uspeh budu namenski i transparentno usklađeni sa ciljevima učenja nastavne jedinice. Pružajući precizne mere učeničkog razumevanja, kreiraju se i prilike da učenici zajedno sa nastavnikom izgrade kriterijume — čime se kod njih povećava jasnoća, osećaj vlasništva i samoregulacija dok rade na postizanju visokokvalitetnih rezultata, potkrepljenih utvrđenim standardima.
</p>

--------------------------------------------------
FORMATIVNA PROCENA / KRITERIJUMI ZA USPEH
--------------------------------------------------

<h3><span style="color: rgb(145,56,230);">Rubrika za formativnu procenu</span></h3>

Renderuj SVAKU stavku formativne procene (Formative Assessment) kao vertikalni blok prateći tačnu strukturu ispod.
Ponovi ovu strukturu u potpunosti za svaku stavku u onom redosledu u kojem su dobijene.

OBAVEZNA STRUKTURA (NEMA ODUSTUPANJA):

<p><strong>Kriterijum za uspeh:</strong> {CriteriaForSuccess}</p>

<p><strong>Pokazatelji uspeha: </strong>{SuccessCriteria}</p>

<p><strong>Tačka za demonstraciju: </strong>{PointOfDemonstration}</p>

<p>--------------------------------------------------</p>
NEMOJ spajati više različitih stavki zajednom.
NEMOJ koristiti liste.
NEMOJ preskočiti ili izostaviti nijedan red.

--------------------------------------------------
ANALITIČKA RUBRIKA ODGOVORA (ANALYTIC RUBRIC)
--------------------------------------------------

<h3><span style="color: rgb(145,56,230);">Analitička rubrika</span></h3>

Za SVAKI red u polju AnalyticRubric izbaci grupisan blok iznad svakog nabrajanja na sledeći način:

<p><strong>Kriterijum:</strong> {Criterion}</p>
<ul>
<li><strong>Početnik (Novice):</strong> {Novice}</li>
<li><strong>Šegrt/Učenik (Apprentice):</strong> {Apprentice}</li>
<li><strong>Praktičar (Practitioner):</strong> {Practitioner}</li>
<li><strong>Ekspert (Expert):</strong> {Expert}</li>
</ul>

--------------------------------------------------
AUTENTIČNA PUBLIKA (AUTHENTIC AUDIENCE)
--------------------------------------------------

<h3><span style="color: rgb(115, 191, 39);">Autentična publika</span></h3>

<p>
<strong>Svrha:</strong> Da se identifikuje i uključi stvarna publika, van učionice, što produbljuje važnost i realnost učeničkog angažmana.  Istovremeno, učenici se ohrabruju da sami biraju zainteresovane strane, stručnjake ili članove zajednice, čije učešće pojačava osećaj vlasništva motivaciju i sam kvalitet konačnih proizvoda rada.
</p>

<p><strong>Primarna publika</strong></p>
<p>{{assessment.AuthenticAudience.PrimaryAudienceDescription}}</p>

<p><strong>Zašto je ova publika kvalifikovana</strong></p>
<p>{{assessment.AuthenticAudience.WhyThisAudienceIsQualified}}</p>

<p><strong>Kako ova publika uzdiže projekat</strong></p>
<p>{{assessment.AuthenticAudience.HowThisAudienceElevatesTheProject}}</p>

<p><strong>Učestvovanje učenika u odabiru publike</strong></p>
<p>{{assessment.AuthenticAudience.StudentParticipationInAudienceSelection}}</p>



ULAZNI JSON PODACI:
{{{JsonResponse}}}
`;

const learningPlanHtmlPrompt = `
Ti si profesionalni edukativni stručnjak za opisno HTML formatiranje.
Dobićeš JEDAN JSON objekat koji predstavlja odeljak plana lekcije pod nazivom "LearningPlan" (Plan učenja).
Tvoj zadatak je da renderuješ čist HTML kôd, koristan nastavnicima, koji jasno objašnjava kako se odvija projekat kroz faze.

Sadržaj generisanog HTML-a mora biti prvenstveno na jeziku: {{{ResponseLanguage}}}

KRITIČNA PRAVILA
- Vrati ISKLJUČIVO validan HTML.
- Dozvoljeni tagovi: <p>, <h2>, <h3>, <strong>, <ul>, <li>, <span>.
- NEMOJ koristiti tabele (tables), div, section, header, niti bilo koje druge tagove koji nisu dozvoljeni.
- NEMOJ izmišljati sadržaj.
- NEMOJ preskočiti nikakve informacije.
- Blago parafraziranje je dozvoljeno ISKLJUČIVO za poboljšanje jasnoće teksta i organizacije.
- Liste se SMEJU koristiti ISKLJUČIVO tamo gde JSON već predstavlja liste elemenata.
- Nikad ne stavljaj <p>, <ul> ili <span> unutar <li> tagova.

STRUKTURA SEKCIJA (OBAVEZAN REDOSLED)

1. Zeleno zaglavlje: Pregled plana učenja (Learning Plan Overview)
- Renderuj pregled plana ("LearningPlanOverview") kao običan paragraf.

2.- Za SVAKU pojedinačnu Fazu (Phase):
- Naslov faze u formatu: <h3><span style="color: rgb(145,56,230);">NASLOV FAZE</span></h3>
- Opis faze (kao paragraf)
- Naglašeni koncepti ili veštine (podebljana oznaka uz naslov unutar paragrafa + paragraf)
- Kolaboracija i vidljivo razmišljanje (podebljana oznaka unutar paragrafa + paragraf)
- Ključna iskustva učenja (kao lista nabrajanja)

3. Podebljano zaglavlje: Projektni ciljevi u obliku <h3><span style="color: rgb(145,56,230);">Projektni ciljevi</span></h3>
- Renderuj svaki cilj ("ProjectGoal") kao samostalan blok paragrafa sa podebljanim imenom.

4. Podebljano zaglavlje: Sažetak konačnog proizvoda (Final Deliverable Summary)
- Renderuj sažetak proizvoda u obliku isključive <ul> liste.

5. Zeleno zaglavlje: Predlozi za grupisanje (Group Suggestions)
- Veličina grupe (podebljani tekst početka + paragraf)
- Rotirajuće uloge i dužnosti (lista nabrajanja)

<p><strong>Pitanje vodilja za planiranje od strane nastavnika</strong></p>
<p>Kako bi pomogao nastavnicima da donesu prave odluke oko grupisanja, UVEK priloži tačno ovaj upit ispod (planersko pitanje) unutar odgovora:</p>
<ul>
  <li>“Šta je glavna svrha tvog grupisanja unutar naredne aktivnosti — vršnjačka podrška, bogata diskusija, izazov ili isključivo operaciona efikasnost? Kada imenuješ pravu svrhu, zapitaj se koji pristup grupisanju tu najbolje odgovara tvom cilju: mešane sposobnosti, grupe prema interesovanjima, grupe na račun veština učenika ili samo nasumično dodeljivanje?”</li>
  <li>Ovo pitanje u mnogome ohrabruje nastavnika da izabere pametne metode grupisanja koje se zapravo na kraju slažu sa instruktivnim predajnim ciljevima lekcije umesto prepuštanja slučaju zbog navike i radnog komfora.</li>
</ul>

<p><strong>Preporuke za strategiju grupisanja</strong></p>
<p>Osim opaski, nastavnici bi mogli da uzmu u obzir ovakve stvari i njihove razlike:</p>
<ul>
  <li><strong>Grupe mešovitih sposobnosti:</strong> Najodgovarajuće onda kada zadaci zahtevaju zaključivanje/rezonovanje, poređenje dokaza i deljenje unutar različitih nivoa spremnosti i predznanja (npr. diskusija i zajedničkog nalaženja odgovora).</li>
  <li><strong>Grupe zasnovane na interesovanjima:</strong> Prava i sigurna pogodba na građenju i razvoju različitih kreativnih radova. Omogućava učenicima kolaboraciju i pronalaženje mnogo adekvatnijih tema ili stilskih pravaca koje iziskuju pažnju istomišljenika koji se tu nalaze što dovodi do mnogo bolje povezanosti unutar iste takve grupe.</li>
  <li><strong>Grupe zasnovane na veštinama:</strong> Suštinska i jasna kategorija. Korisno kada se zahtevaju radne operacije i nikakva kreativna tačnost - nego stroga tehnička preciznost ili ponavljanje bez umora (npr. izrada modela crteza po kalupu, ili rešavanje matematičke algebre iste težine).</li>
  <li><strong>Nasumične grupe:</strong> Vrlo korisno tokom samog otpočetka projekata. Istraživački rani zadaci pomažu grupi dece da razviju poznanstva, grade zajednicu razreda te razbijaju potkrepljenu i ustalkjenu zavisnost od jednih te istih "čestih" grupa na koje su se već jako puno obikli.</li>
</ul>

FORMAT ZELENOG ZAGLAVLJA (STROGO PRAVILO)
<h3><span style="color: rgb(115, 191, 39);">NASLOV</span></h3>

FORMAT PODEBLJANOG ZAGLAVLJA (STROGO PRAVILO)
<p><strong>NASLOV</strong></p>


JSON PLAN UČENJA (LEARNING PLAN JSON):
{{{JsonResponse}}}
`;

const teacherGuidancePhase1HtmlPrompt = `
Ti si profesionalni edukativni stručnjak za opisno HTML formatiranje.

Dobićeš JEDAN JSON objekat koji predstavlja odeljak TeacherGuidancePhase1.
Tvoj zadatak je da renderuješ čist HTML kôd, namenjen nastavnicima, koji se poklapa sa očekivanim instruktivnim rasporedom lekcije.

Sadržaj generisanog HTML-a mora biti prvenstveno na jeziku: {{{ResponseLanguage}}}

KRITIČNA PRAVILA
- Vrati ISKLJUČIVO validan HTML broj 5.
- Dozvoljeni tagovi ISKLJUČIVO: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- NEMOJ izmišljati sadržaj.
- NEMOJ propustiti ili izostaviti nikakve informacije.
- NEMOJ stavljati <p>, <ul> ili <span> unutar <li> taga.
- Liste se SMEJU koristiti samo kada polje JSON-a zaista predstavlja niz (array).
- Zadrži logički redosled tačno onako kako je navedeno u nastavku.

REDOSLED ODELJAKA (OBAVEZAN/ZAHTEVAN)

<h3><span style="color: rgb(115, 191, 39);">Faza 1 – Pokretanje (Launch)</span></h3>

1. Izjava o fokusu (Focus Statement) kao podebljani natpis
- Označi tekst debljim slovima "Izjava o fokusu" i stavi kao paragraf 
- Renderuj Phase1_FocusStatement unutar paragrafa.

2. Kolaborativne aktivnosti (podebljani naslov)
- Svaka aktivnost (Activity) mora sadržati sledeće:
  - Naslov aktivnosti u obliku <h3><span style="color: rgb(145,56,230);">NASLOV AKTIVNOSTI</span></h3>
  - Uloga nastavnika (Teacher Role)
  - Iskustvo učenika (Student Experience)
  - Artefakti učenja (Artifacts of Learning) - u obliku nabrajanja

3. Pitanja vodilje (Guiding Questions)
- Naslov ljubičastom bojom (rgb(145,56,230))
- Nabrajanje kao lista sa buletima

4. Diferencijacija (Differentiation)
<p><strong style="color: rgb(145, 56, 230);">🪜 Diferencijacija</strong></p>
<ul>
<li><strong>Učenici koji uče jezik: </strong>{{{Differentiation_LanguageLearners}}}</li>
<li><strong>Učenici kojima je potrebna dodatna podrška: </strong>{{{Differentiation_Scaffolding}}}</li>
<li><strong>Za napredne učenike: </strong>{{{Differentiation_GoDeeper}}}</li>
</ul>

5. Smeštaj, Prilagodbe i modifikacije (Accommodations & Modifications)
<p><strong style="color: rgb(145, 56, 230);">🤝 Prilagođavanja i modifikacije</strong></p>

- Opšta podrška (ako postoji generalna):
  - Započni paragraf oznakom: <p><strong>Opšta podrška:</strong></p>
  - Renderuj svaku stavku iz {{{AccommodationsAndModifications_General}}} kao <li> unutar krovne <ul> liste. Svaki <li> sme menjati običan tekst samo.

- Individualizovana podrška (OBAVEZNO ZA SVAKOG POJEDINCA):
  - Koristi paragraf sa sledećom oznakom: <p><strong>Individualna podrška:</strong></p>
  - Za OBAVEZNO SVAKOG pojedinačnog učenika u {{{AccommodationsAndModifications_IndividualSupport}}} tekstu (nizu):
    - Renderuj ime učenika kao <p> sa obojenim crvenim tekstom: <p><span style="color: rgb(204, 0, 0);">{{StudentName}}</span></p>.
    - Zatim dodaj <ul> spisak koji mora sadržati TAČNO dva <li> elementa:
      - <li>{{PlanProvided}}</li>
      - <li>{{PlanImplementation}}</li>
    - Ponovi ovaj striktan šablon za apsolutno svakog učenika na listi.
- Koristi SAMO navedena imena učenika i njihove planove prisutne i vidljive u JSON-u (Nemoj izmišljati dodatne učenike).

6. Moguća pogrešna uverenja (Anticipated Misconceptions)
<p><strong style="color: rgb(145, 56, 230);">❗ Moguća pogrešna uverenja</strong></p>
- Par: pogrešno uverenje (Misconception{i}) + Reakcije nastavnika (Teacher Response) ispisuj kao rednu (ordered) listu isključivo.

7. Pitanja za transcedentno/duboko razmišljanje (Transcendent Thinking)
<p><strong style="color: rgb(145, 56, 230);">🌍 Transcendentno razmišljanje</strong></p>
- Pitanje / Podsticaj (Prompt)
- Očekivani odgovori učenika sa naslovom <p>✅ Očekivani odgovori učenika:</p> i stavkama liste.

8. Brze provere (Quick Checks)
<p><strong style="color: rgb(145, 56, 230);">✔ Brze provere</strong></p>
- Naslov bez boje sa terminom Timing-om/tajmingom
- Tajming se redi se od početka (beginning) -> sredina (mid-phase) -> kraj (end of phase)
- Pitanje / Podsticaj
- Očekivani odgovori učenika (Expected Student Responses) ili Kriterijumi uspeha (SuccessCriteria) u vidu tabele (bullet list) pod imenom <p>✅ Očekivani odgovori učenika:</p> ili <p>✅ Kriterijumi za uspeh:</p>

9. Prisećanje uz vremenske razmake (Spaced Retrieval)
<p><strong style="color: rgb(145, 56, 230);">⏳ Prisećanje uz vremenske razmake</strong></p>

Za SVAKI unos (EACH entry) u polju Phase1_SpacedRetrieval:

Polje ExpectedResponseOrSuccessCriteria je VEOMA DUG blok običnog teksta.
TI MORAŠ to ispravno da skeniraš, filtriraš i reorganizuješ u sledeću HTML strukturu.
Redosled vremena opet mora biti početak -> sredina faze -> kraj faze.

OBAVEZAN DIZAJN IZLAZNE STRUKTURE (STRIKTNO TIM REDOSLEDOM):

<p><strong>Tajming:</strong> {{Timing}}</p>
<p><strong>Naslanja se na/Potiče od:</strong> {{DrawsFrom}}</p>
<p><strong>Pitanje:</strong> {{Question}} DOK: {{DOK}}</p>

Na osnovu ExpectedResponseOrSuccessCriteria teksta:
- Izvuci / izdvoji ISKLJUČIVO one odgovore koji su namenjeni učenicima
- ZANEMARI / IZBRIŠI priložene beleške za nastavnike, predviđene materijale i instrukcije

<p>✅ Očekivani odgovori učenika:</p>
<ul>
  <li>Svaki odgovor postavi kao nezavistan "bullet" unutar liste.</li>
</ul>

STROGA PRAVILA ZA TAJ PROCES:
- NE SMEŠ izbaciti celu sirovu gomilu teksta odjednom!
- NE SMEŠ ubaciti više različitih sekcija pod isti, spojeni <p> tag!
- Očekivani odgovori učenika MORAJU uvek biti isključivo oblika <ul> liste.
- Ako su njihovi odgovori napisani u formi dugih rečenica, OBAVEZNO ih cepaj na logičke bulet celine.

10. Vežba za učenike (Student Practice)
<p><strong style="color: rgb(145, 56, 230);">🖊 Samostalna vežba</strong></p>

<p><strong>Beleške za nastavnika:</strong> {{Phase1_StudentPractice_TeacherNotes}}</p>

Za SVAKI ZADATAK POJEDINAČNO u polju Phase1_StudentPractice_Tasks (Numerisano pod 1, 2, 3...):
<p><strong>{{Number}}. (DOK {{DOK}})</strong> {{StudentDirections}}</p>
<p><strong>Kriterijumi uspeha (Success Criteria)</strong></p>
<ul>
  <li>Svaki element obaveznog zadatka izbaci iz {SuccessCriteria} liste tačno ZA TAJ ZADATAK.</li>
</ul>

PRAVILA ZA VEŽBU:
- Napomena za nastavnike MORA uvek početi rečima: "Ovi zadaci obnavljaju i učvršćuju današnje gradivo o ____ pomoću ______." (dopuni praznine informacijama) nakon čega sledi obrazloženje kako to dugoročno jača njihovu memoriju.
- DOK nivo za SVE navedene zadatke MORA biti procenjen kao 2, 3 ili 4. Nivo DOK 1 je STROGO ZABRANJEN!
- Nikada nemo grupisati više različitih zadataka pod isti <ul> tab.
- NE PISATI sirove tekstualne 'raw string' reči nego tagovane elemente.
- NE stavljati nikakav <p> ili gnježdeni <ul> u samom koraku <li> liste.

11. Refleksija / Osvrt za kraj (Reflection)
<p><strong>🔎 Refleksija: </strong>{{Phase1_ReflectionPrompt.Introduction}}</p>
<ul>
  <li>Izradi svaki postulat / upit iz {{Phase1_ReflectionPrompt.Prompts}} kao nezavistan bulet.</li>
</ul>

UPUTSTVA NASTAVNIKA ZA PRETHODNU FAZU:
{{{JsonResponse}}}
`;

const teacherGuidancePhase2HtmlPrompt = `
Ti si profesionalni edukativni stručnjak za opisno HTML formatiranje.

Dobićeš JEDAN JSON objekat koji predstavlja odeljak TeacherGuidancePhase2.
Tvoj zadatak je da renderuješ čist HTML kôd, namenjen nastavnicima, koji se poklapa sa očekivanim instruktivnim rasporedom lekcije.

Sadržaj generisanog HTML-a mora biti prvenstveno na jeziku: {{{ResponseLanguage}}}

KRITIČNA PRAVILA
- Vrati ISKLJUČIVO validan HTML broj 5.
- Dozvoljeni tagovi ISKLJUČIVO: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- NEMOJ izmišljati sadržaj.
- NEMOJ propustiti ili izostaviti nikakve informacije.
- NEMOJ stavljati <p>, <ul> ili <span> unutar <li> taga.
- Liste se SMEJU koristiti samo kada polje JSON-a zaista predstavlja niz (array).
- Zadrži logički redosled tačno onako kako je navedeno u nastavku.

REDOSLED ODELJAKA (OBAVEZAN/ZAHTEVAN)

<h3><span style="color: rgb(115, 191, 39);">Faza 2 – Istraživanje, razvoj i usavršavanje rešenja</span></h3>

1. Izjava o fokusu (Focus Statement) kao podebljani natpis
- Označi tekst debljim slovima "Izjava o fokusu" i stavi kao paragraf 
- Renderuj Phase2_FocusStatement unutar paragrafa.

2. Kolaborativne aktivnosti (podebljani naslov)
- Svaka aktivnost (Activity) mora sadržati sledeće:
  - Naslov aktivnosti u obliku <h3><span style="color: rgb(145,56,230);">NASLOV AKTIVNOSTI</span></h3>
  - Uloga nastavnika (Teacher Role)
  - Iskustvo učenika (Student Experience)
  - Artefakti učenja (Artifacts of Learning) - u obliku nabrajanja

3. Pitanja vodilje (Guiding Questions)
- Naslov ljubičastom bojom (rgb(145,56,230))
- Nabrajanje kao lista sa buletima

4. Diferencijacija (Differentiation)
<p><strong style="color: rgb(145, 56, 230);">🪜 Diferencijacija</strong></p>
<ul>
<li><strong>Učenici koji uče jezik: </strong>{{{Differentiation_LanguageLearners}}}</li>
<li><strong>Učenici kojima je potrebna dodatna podrška: </strong>{{{Differentiation_Scaffolding}}}</li>
<li><strong>Za napredne učenike: </strong>{{{Differentiation_GoDeeper}}}</li>
</ul>

5. Smeštaj, Prilagodbe i modifikacije (Accommodations & Modifications)
<p><strong style="color: rgb(145, 56, 230);">🤝 Prilagođavanja i modifikacije</strong></p>

- Opšta podrška (ako postoji generalna):
  - Započni paragraf oznakom: <p><strong>Opšta podrška:</strong></p>
  - Renderuj svaku stavku iz {{{AccommodationsAndModifications_General}}} kao <li> unutar krovne <ul> liste. Svaki <li> sme menjati običan tekst samo.

- Individualizovana podrška (OBAVEZNO ZA SVAKOG POJEDINCA):
  - Koristi paragraf sa sledećom oznakom: <p><strong>Individualna podrška:</strong></p>
  - Za OBAVEZNO SVAKOG pojedinačnog učenika u {{{AccommodationsAndModifications_IndividualSupport}}} tekstu (nizu):
    - Renderuj ime učenika kao <p> sa obojenim crvenim tekstom: <p><span style="color: rgb(204, 0, 0);">{{StudentName}}</span></p>.
    - Zatim dodaj <ul> spisak koji mora sadržati TAČNO dva <li> elementa:
      - <li>{{PlanProvided}}</li>
      - <li>{{PlanImplementation}}</li>
    - Ponovi ovaj striktan šablon za apsolutno svakog učenika na listi.
- Koristi SAMO navedena imena učenika i njihove planove prisutne i vidljive u JSON-u (Nemoj izmišljati dodatne učenike).

6. Moguća pogrešna uverenja (Anticipated Misconceptions)
<p><strong style="color: rgb(145, 56, 230);">❗ Moguća pogrešna uverenja</strong></p>
- Par: pogrešno uverenje (Misconception{i}) + Reakcije nastavnika (Teacher Response) ispisuj kao rednu (ordered) listu isključivo.

7. Pitanja za transcedentno/duboko razmišljanje (Transcendent Thinking)
<p><strong style="color: rgb(145, 56, 230);">🌍 Transcendentno razmišljanje</strong></p>
- Pitanje / Podsticaj (Prompt)
- Očekivani odgovori učenika sa naslovom <p>✅ Očekivani odgovori učenika:</p> i stavkama liste.

8. Brze provere (Quick Checks)
<p><strong style="color: rgb(145, 56, 230);">✔ Brze provere</strong></p>
- Naslov bez boje sa terminom Timing-om/tajmingom
- Tajming se redi se od početka (beginning) -> sredina (mid-phase) -> kraj (end of phase)
- Pitanje / Podsticaj
- Očekivani odgovori učenika (Expected Student Responses) ili Kriterijumi uspeha (SuccessCriteria) u vidu tabele (bullet list) pod imenom <p>✅ Očekivani odgovori učenika:</p> ili <p>✅ Kriterijumi za uspeh:</p>

9. Prisećanje uz vremenske razmake (Spaced Retrieval)
<p><strong style="color: rgb(145, 56, 230);">⏳ Prisećanje uz vremenske razmake</strong></p>

Za SVAKI unos (EACH entry) u polju Phase2_SpacedRetrieval:

Polje ExpectedResponseOrSuccessCriteria je VEOMA DUG blok običnog teksta.
TI MORAŠ to ispravno da skeniraš, filtriraš i reorganizuješ u sledeću HTML strukturu.
Redosled vremena opet mora biti početak -> sredina faze -> kraj faze.

OBAVEZAN DIZAJN IZLAZNE STRUKTURE (STRIKTNO TIM REDOSLEDOM):

<p><strong>Tajming:</strong> {{Timing}}</p>
<p><strong>Naslanja se na/Potiče od:</strong> {{DrawsFrom}}</p>
<p><strong>Pitanje:</strong> {{Question}} DOK: {{DOK}}</p>

Na osnovu ExpectedResponseOrSuccessCriteria teksta:
- Izvuci / izdvoji ISKLJUČIVO one odgovore koji su namenjeni učenicima
- ZANEMARI / IZBRIŠI priložene beleške za nastavnike, predviđene materijale i instrukcije

<p>✅ Očekivani odgovori učenika:</p>
<ul>
  <li>Svaki odgovor postavi kao nezavistan "bullet" unutar liste.</li>
</ul>

STROGA PRAVILA ZA TAJ PROCES:
- NE SMEŠ izbaciti celu sirovu gomilu teksta odjednom!
- NE SMEŠ ubaciti više različitih sekcija pod isti, spojeni <p> tag!
- Očekivani odgovori učenika MORAJU uvek biti isključivo oblika <ul> liste.
- Ako su njihovi odgovori napisani u formi dugih rečenica, OBAVEZNO ih cepaj na logičke bulet celine.

10. Vežba za učenike (Student Practice)
<p><strong style="color: rgb(145, 56, 230);">🖊 Samostalna vežba</strong></p>

<p><strong>Beleške za nastavnika:</strong> {{Phase2_StudentPractice_TeacherNotes}}</p>

Za SVAKI ZADATAK POJEDINAČNO u polju Phase2_StudentPractice_Tasks (Numerisano pod 1, 2, 3...):
<p><strong>{{Number}}. (DOK {{DOK}})</strong> {{StudentDirections}}</p>
<p><strong>Kriterijumi uspeha (Success Criteria)</strong></p>
<ul>
  <li>Svaki element obaveznog zadatka izbaci iz {SuccessCriteria} liste tačno ZA TAJ ZADATAK.</li>
</ul>

PRAVILA ZA VEŽBU:
- Napomena za nastavnike MORA uvek početi rečima: "Ovi zadaci obnavljaju i učvršćuju današnje gradivo o ____ pomoću ______." (dopuni praznine informacijama) nakon čega sledi obrazloženje kako to dugoročno jača njihovu memoriju.
- DOK nivo za SVE navedene zadatke MORA biti procenjen kao 2, 3 ili 4. Nivo DOK 1 je STROGO ZABRANJEN!
- Nikada nemo grupisati više različitih zadataka pod isti <ul> tab.
- NE PISATI sirove tekstualne 'raw string' reči nego tagovane elemente.
- NE stavljati nikakav <p> ili gnježdeni <ul> u samom koraku <li> liste.

11. Refleksija / Osvrt za kraj (Reflection)
<p><strong>🔎 Refleksija: </strong>{{Phase2_ReflectionPrompt.Introduction}}</p>
<ul>
  <li>Izradi svaki postulat / upit iz {{Phase2_ReflectionPrompt.Prompts}} kao nezavistan bulet.</li>
</ul>

UPUTSTVA NASTAVNIKA ZA PRETHODNU FAZU:
{{{JsonResponse}}}
`;

const teacherGuidancePhase3HtmlPrompt = `
Ti si profesionalni edukativni stručnjak za opisno HTML formatiranje.

Dobićeš JEDAN JSON objekat koji predstavlja odeljak TeacherGuidancePhase3.
Tvoj zadatak je da renderuješ čist HTML kôd, namenjen nastavnicima, koji se poklapa sa očekivanim instruktivnim rasporedom lekcije.

Sadržaj generisanog HTML-a mora biti prvenstveno na jeziku: {{{ResponseLanguage}}}

KRITIČNA PRAVILA
- Vrati ISKLJUČIVO validan HTML broj 5.
- Dozvoljeni tagovi ISKLJUČIVO: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- NEMOJ izmišljati sadržaj.
- NEMOJ propustiti ili izostaviti nikakve informacije.
- NEMOJ stavljati <p>, <ul> ili <span> unutar <li> taga.
- Liste se SMEJU koristiti samo kada polje JSON-a zaista predstavlja niz (array).
- Zadrži logički redosled tačno onako kako je navedeno u nastavku.

REDOSLED ODELJAKA (OBAVEZAN/ZAHTEVAN)

<h3><span style="color: rgb(115, 191, 39);">Faza 3 – Prezentacija i refleksija</span></h3>

1. Izjava o fokusu (Focus Statement) kao podebljani natpis
- Označi tekst debljim slovima "Izjava o fokusu" i stavi kao paragraf 
- Renderuj Phase3_FocusStatement unutar paragrafa.

2. Kolaborativne aktivnosti (podebljani naslov)
- Svaka aktivnost (Activity) mora sadržati sledeće:
  - Naslov aktivnosti u obliku <h3><span style="color: rgb(145,56,230);">NASLOV AKTIVNOSTI</span></h3>
  - Uloga nastavnika (Teacher Role)
  - Iskustvo učenika (Student Experience)
  - Artefakti učenja (Artifacts of Learning) - u obliku nabrajanja

3. Pitanja vodilje (Guiding Questions)
- Naslov ljubičastom bojom (rgb(145,56,230))
- Nabrajanje kao lista sa buletima

4. Diferencijacija (Differentiation)
<p><strong style="color: rgb(145, 56, 230);">🪜 Diferencijacija</strong></p>
<ul>
<li><strong>Učenici koji uče jezik: </strong>{{{Differentiation_LanguageLearners}}}</li>
<li><strong>Učenici kojima je potrebna dodatna podrška: </strong>{{{Differentiation_Scaffolding}}}</li>
<li><strong>Za napredne učenike: </strong>{{{Differentiation_GoDeeper}}}</li>
</ul>

5. Smeštaj, Prilagodbe i modifikacije (Accommodations & Modifications)
<p><strong style="color: rgb(145, 56, 230);">🤝 Prilagođavanja i modifikacije</strong></p>

- Opšta podrška (ako postoji generalna):
  - Započni paragraf oznakom: <p><strong>Opšta podrška:</strong></p>
  - Renderuj svaku stavku iz {{{AccommodationsAndModifications_General}}} kao <li> unutar krovne <ul> liste. Svaki <li> sme menjati običan tekst samo.

- Individualizovana podrška (OBAVEZNO ZA SVAKOG POJEDINCA):
  - Koristi paragraf sa sledećom oznakom: <p><strong>Individualna podrška:</strong></p>
  - Za OBAVEZNO SVAKOG pojedinačnog učenika u {{{AccommodationsAndModifications_IndividualSupport}}} tekstu (nizu):
    - Renderuj ime učenika kao <p> sa obojenim crvenim tekstom: <p><span style="color: rgb(204, 0, 0);">{{StudentName}}</span></p>.
    - Zatim dodaj <ul> spisak koji mora sadržati TAČNO dva <li> elementa:
      - <li>{{PlanProvided}}</li>
      - <li>{{PlanImplementation}}</li>
    - Ponovi ovaj striktan šablon za apsolutno svakog učenika na listi.
- Koristi SAMO navedena imena učenika i njihove planove prisutne i vidljive u JSON-u (Nemoj izmišljati dodatne učenike).

6. Moguća pogrešna uverenja (Anticipated Misconceptions)
<p><strong style="color: rgb(145, 56, 230);">❗ Moguća pogrešna uverenja</strong></p>
- Par: pogrešno uverenje (Misconception{i}) + Reakcije nastavnika (Teacher Response) ispisuj kao rednu (ordered) listu isključivo.

7. Pitanja za transcedentno/duboko razmišljanje (Transcendent Thinking)
<p><strong style="color: rgb(145, 56, 230);">🌍 Transcendentno razmišljanje</strong></p>
- Pitanje / Podsticaj (Prompt)
- Očekivani odgovori učenika sa naslovom <p>✅ Očekivani odgovori učenika:</p> i stavkama liste.

8. Brze provere (Quick Checks)
<p><strong style="color: rgb(145, 56, 230);">✔ Brze provere</strong></p>
- Naslov bez boje sa terminom Timing-om/tajmingom
- Tajming se redi se od početka (beginning) -> sredina (mid-phase) -> kraj (end of phase)
- Pitanje / Podsticaj
- Očekivani odgovori učenika (Expected Student Responses) ili Kriterijumi uspeha (SuccessCriteria) u vidu tabele (bullet list) pod imenom <p>✅ Očekivani odgovori učenika:</p> ili <p>✅ Kriterijumi za uspeh:</p>

9. Prisećanje uz vremenske razmake (Spaced Retrieval)
<p><strong style="color: rgb(145, 56, 230);">⏳ Prisećanje uz vremenske razmake</strong></p>

Za SVAKI unos (EACH entry) u polju Phase3_SpacedRetrieval:

Polje ExpectedResponseOrSuccessCriteria je VEOMA DUG blok običnog teksta.
TI MORAŠ to ispravno da skeniraš, filtriraš i reorganizuješ u sledeću HTML strukturu.
Redosled vremena opet mora biti početak -> sredina faze -> kraj faze.

OBAVEZAN DIZAJN IZLAZNE STRUKTURE (STRIKTNO TIM REDOSLEDOM):

<p><strong>Tajming:</strong> {{Timing}}</p>
<p><strong>Naslanja se na/Potiče od:</strong> {{DrawsFrom}}</p>
<p><strong>Pitanje:</strong> {{Question}} DOK: {{DOK}}</p>

Na osnovu ExpectedResponseOrSuccessCriteria teksta:
- Izvuci / izdvoji ISKLJUČIVO one odgovore koji su namenjeni učenicima
- ZANEMARI / IZBRIŠI priložene beleške za nastavnike, predviđene materijale i instrukcije

<p>✅ Očekivani odgovori učenika:</p>
<ul>
  <li>Svaki odgovor postavi kao nezavistan "bullet" unutar liste.</li>
</ul>

STROGA PRAVILA ZA TAJ PROCES:
- NE SMEŠ izbaciti celu sirovu gomilu teksta odjednom!
- NE SMEŠ ubaciti više različitih sekcija pod isti, spojeni <p> tag!
- Očekivani odgovori učenika MORAJU uvek biti isključivo oblika <ul> liste.
- Ako su njihovi odgovori napisani u formi dugih rečenica, OBAVEZNO ih cepaj na logičke bulet celine.

10. Vežba za učenike (Student Practice)
<p><strong style="color: rgb(145, 56, 230);">🖊 Samostalna vežba</strong></p>

<p><strong>Beleške za nastavnika:</strong> {{Phase3_StudentPractice_TeacherNotes}}</p>

Za SVAKI ZADATAK POJEDINAČNO u polju Phase3_StudentPractice_Tasks (Numerisano pod 1, 2, 3...):
<p><strong>{{Number}}. (DOK {{DOK}})</strong> {{StudentDirections}}</p>
<p><strong>Kriterijumi uspeha (Success Criteria)</strong></p>
<ul>
  <li>Svaki element obaveznog zadatka izbaci iz {SuccessCriteria} liste tačno ZA TAJ ZADATAK.</li>
</ul>

PRAVILA ZA VEŽBU:
- Napomena za nastavnike MORA uvek početi rečima: "Ovi zadaci obnavljaju i učvršćuju današnje gradivo o ____ pomoću ______." (dopuni praznine informacijama) nakon čega sledi obrazloženje kako to dugoročno jača njihovu memoriju.
- DOK nivo za SVE navedene zadatke MORA biti procenjen kao 2, 3 ili 4. Nivo DOK 1 je STROGO ZABRANJEN!
- Nikada nemo grupisati više različitih zadataka pod isti <ul> tab.
- NE PISATI sirove tekstualne 'raw string' reči nego tagovane elemente.
- NE stavljati nikakav <p> ili gnježdeni <ul> u samom koraku <li> liste.

11. Refleksija / Osvrt za kraj (Reflection)
<p><strong>🔎 Refleksija: </strong>{{Phase3_ReflectionPrompt.Introduction}}</p>
<ul>
  <li>Izradi svaki postulat / upit iz {{Phase3_ReflectionPrompt.Prompts}} kao nezavistan bulet.</li>
</ul>

UPUTSTVA NASTAVNIKA ZA PRETHODNU FAZU:
{{{JsonResponse}}}
`;

const unitPreparationAndConsiderationsHtmlPrompt = `
Ti si profesionalni stručnjak za opisno HTML formatiranje.
Dobićeš JEDAN JSON objekat koji predstavlja odeljak UnitPreparationAndConsiderations (Priprema i razmatranja jedinice).
Tvoj zadatak je da renderuješ čist HTML kôd, namenjen nastavnicima, koji se po izgledu poklapa sa potpuno doteranim dokumentom za nastavni plan.

Sadržaj generisanog HTML-a mora biti prvenstveno na jeziku: {{{ResponseLanguage}}}

KRITIČNA PRAVILA
- Vrati ISKLJUČIVO validan HTML.
- Dozvoljeni tagovi su isključivo ovi: <p>, <h3>, <strong>, <ul>, <li>, <span>.
- NEMOJ izmišljati sadržaj.
- NEMOJ propustiti ili izostaviti nikakve informacije iz dobijenog JSON-a.
- NEMOJ stavljati <p>, <ul> ili <span> unutar <li> taga!
- Liste se SMEJU koristiti isključivo kada polje JSON-a zaista predstavlja niz (array).
- Zadrži logički redosled tačno onako kako je navedeno unutar zahtevane strukture u nastavku teksta.

OBAVEZNA (ZAHTEVANA) STRUKTURA IZLAZA

<p><strong><span style="color: rgb(115, 191, 39);">Materijali, oprema i ključni resursi</span></strong></p>

1. Materijali i oprema u učionici (Classroom Materials & Equipment)
- Renderuj "ClassroomMaterialsAndEquipment" ugovorom u oblilu liste koja koristi oznake i brojke nabrajanja.

2. Lokalni resursi i resursi u zajednici (Local & Community-Based Resources)
- Za svaki obezbeđen resurs renderuj sledeće po redu u paragrafima ili redu:
- Lokacija (Lokaciju OBAVEZNO označi podebljanim tekstom)
- Kako se učenici angažuju / Uključuju u to
- Zašto je taj element relevantan / Bitnost

3. Digitalni alati i onlajn resursi (Digital Tools & Online Resources)
- Renderuj "DigitalToolsAndOnlineResources" na normalni način tj. takođe kao isključivu ugnježdenu ne-numeričku bullet <ul> listu.

<p><strong><span style="color: rgb(115, 191, 39);">Integracija tehnologije</span></strong></p>

4. Tehnologija za produbljivanje istraživanja i disciplinarnog razmišljanja
5. Tehnologija za modelovanje i vizuelno predstavljanje
6. Tehnologija za saradnju (kolaboraciju) i diskusiju
7. Tehnologija za kreiranje, izvedbu i predstavljanje konačnog proizvoda

Za apsolutno svaki navedeni tehnološki alat redom iznad renderuj:
- Naziv alata (Naziv alata upiši isključivo kao boldirani snažan/podebljani tekst)
- Kako i na koji način treba da ga koriste ti učenici na času
- Koja je tačna njegova Povezanost sa osnovnim projektom (Connection to Project)
- Koji ISTE Standard pogađa tim putem

8. Razmatranja o pravičnosti i pristupačnosti (Equity & Accessibility Considerations)
- Završni korak. Renderuj celu navedenu sekciju isključivo kao običnu listu nabrajanja obeleženu kružićima tj. stavkama na jednom stupnju.


JSON PODACI ZA PRIPREMU JEDINICE (UNIT PREPARATION JSON):
{{{JsonResponse}}}
`;

const pblResponseSchema = {
    "title": "PBLUnitPlanResponse",
    "type": "object",
    "additionalProperties": false,
    "required": [
        "UnitPlan"
    ],
    "properties": {
        "UnitPlan": {
            "type": "object",
            "description": "Vrati kompletan plan jedinice zasnovan na projektima (PBL). NEMOJ dodavati dodatne ključeve. Popuni svako obavezno polje. Mora raditi za BILO KOJI predmet. Lokalizuj zainteresovane strane/publiku/resurse prema unetoj lokaciji/poštanskom broju bez izmišljanja tačnih adresa ili brojeva telefona.",
            "additionalProperties": false,
            "required": [
                "UnitDescription",
                "AssessPriorKnowledge",
                "UnitOverview",
                "DesiredOutcomes",
                "FramingTheLearning",
                "AssessmentPlan",
                "LearningPlan",
                "UnitPreparationAndConsiderations",
                "TeacherGuidancePhase1",
                "TeacherGuidancePhase2",
                "TeacherGuidancePhase3"
            ],
            "properties": {
                "UnitDescription": {
                    "type": "string",
                    "description": "JEDAN kohezivan pasus (4-5 kompletnih rečenica): uvod (hook), ishodi majstorstva, veštine/transfer, realna relevantnost, svrha/uticaj; mora se prirodno referencirati na lokalnu zajednicu. Ovaj pasus mora biti upućen direktno učenicima."
                },
                "AssessPriorKnowledge": {
                    "type": "string",
                    "description": "Kompletna sekcija 'Procena predznanja' kao običan tekst (ukupno 150-250 reči). SAMO Lekcija 1 treba da sadrži detaljan blok; SVE OSTALE LEKCIJE MORAJU VRATITI PRAZAN STRING za ovo polje. Za Lekciju 1, struktura mora uključivati: 1. Uključi ovu sekciju samo u prvu lekciju jedinice, postavljenu odmah nakon ciljeva učenja učenika. 2. Osiguraj da se koriste DOK 1-3 podsticaji. 3. Uključi preduslovne veštine potrebne za ciljeve učenja učenika. 4. Izaberi jedan modalitet sa ove liste i u potpunosti ga razvij: ispitivanje, K-W-L, vizuelni prikazi, konceptualne mape, reflektivno pisanje, vodiči za anticipaciju, procena rečnika. 5. Početni podsticaj nastavnika sa 'Kaži:' izjavom koja uvodi izabrani modalitet i objašnjava kako će učenici ispoljiti trenutno razumevanje. 6. Jasna uputstva i šablon/struktura za izabrani modalitet. 7. Sekcija 'Očekivani odgovori učenika' koja prikazuje predviđene odgovore ili uobičajena pogrešna uverenja za izabrani modalitet. 8. Završni podsticaj nastavnika 'Kaži:' koji potvrđuje razmišljanje učenika i najavljuje istraživanje u okviru jedinice. 9. Nakon potpunog razvoja jednog modaliteta, pruži 2 kratke alternativne opcije koje bi nastavnik mogao izabrati."
                },
                "UnitOverview": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "TaskStatement",
                        "DrivingQuestion",
                        "Mission",
                        "ProjectContextAndStakeholders",
                        "FinalDeliverableRequirements",
                        "ClosingCallToAction"
                    ],
                    "properties": {
                        "TaskStatement": {
                            "type": "string",
                            "description": "Poruka za pokretanje upućena učenicima (400-600 reči) napisana kao da ju je napisao verodostojan lokalni entitet/osoba. Hitna, značajna, autentična. Bez standarda/rubrika/tempa. Naslovi poruku upućenu učenicima."
                        },
                        "DrivingQuestion": {
                            "type": "string",
                            "description": "Jedno snažno otvoreno Pokretačko pitanje utemeljeno u mestu i potrebama zainteresovanih strana. MORA biti ponovljeno doslovno u FramingTheLearning.DrivingQuestion."
                        },
                        "Mission": {
                            "type": "string",
                            "description": "Pasus koji počinje sa 'Vaš zadatak je da...' opisujući šta će učenici kreirati/raditi i zašto je to važno zajednici/publici."
                        },
                        "ProjectContextAndStakeholders": {
                            "type": "string",
                            "description": "Kratak narativ: na koga se utiče, zašto je to sada važno lokalno i kojim zainteresovanim stranama/publici je stalo."
                        },
                        "FinalDeliverableRequirements": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "string"
                            },
                            "description": "Napisano za učenike, opišite finalni proizvod koji će kreirati i autentičnu publiku kojoj služi, počevši sa kratkim rezimeom, a zatim zahtevajte četiri komponente: (1) Plan koncepta i svrhe koji objašnjava ideju kroz vizuelni ili pisani prikaz i zašto je važna zajednici ili kontekstu; (2) Obrazloženje zasnovano na dokazima koje zahteva analizu najmanje dva relevantna faktora i objašnjenje izbora koristeći dokaze iz istraživanja, podataka, eksperimentisanja ili zapažanja; (3) Model ili reprezentaciju koja opisuje tip kreiranog modela, šta on predstavlja, kako objašnjava osnovne mehanizme ili rezonovanje i neophodne distinkcije; i (4) Presudu, zaključni argument potkrepljen dokazima koji objašnjava zašto je rešenje efikasno, izvodljivo ili značajno, sumirajući rezonovanje, dokaze i modele, i komunicirajući vrednost autentičnoj publici, sa završnom izjavom koja naglašava primenu disciplinarnog znanja, korišćenje dokaza, modelovanje složenih ideja i realne implikacije."
                        },
                        "ClosingCallToAction": {
                            "type": "string",
                            "description": "Inspirativan završetak: zajednica/publika računa na učenike; naglasite uticaj."
                        }
                    }
                },
                "DesiredOutcomes": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "StandardsAligned",
                        "BigIdeasAndEssentialQuestions",
                        "LearningObjectives"
                    ],
                    "properties": {
                        "StandardsAligned": {
                            "type": "array",
                            "minItems": 1,
                            "items": {
                                "type": "string"
                            },
                            "description": "Standardi navedeni doslovno kada su obezbeđeni, format 'KOD: opis'."
                        },
                        "BigIdeasAndEssentialQuestions": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 4,
                            "description": "Generiši 3-4 para Velike ideje i Suštinskog pitanja koji uspostavljaju trajne, prenosive koncepte koji usidruju celu jedinicu, vode dizajn istraživanja i procene, i pružaju sveobuhvatan konceptualni okvir koji povezuje sve zadatke, veštine i aktivnosti u smisleno razumevanje.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "BigIdea",
                                    "EssentialQuestion"
                                ],
                                "properties": {
                                    "BigIdea": {
                                        "type": "string",
                                        "description": "Široka, konceptualna izjava o trajnom razumevanju koja objašnjava fundamentalni princip koji leži u osnovi jedinice, povezuje sve zadatke i procene, podržava prenosivo učenje izvan specifičnog konteksta i odražava suštinsko disciplinarno razmišljanje, a ne izolovane činjenice."
                                    },
                                    "EssentialQuestion": {
                                        "type": "string",
                                        "description": "Kreiraj suštinska pitanja koja se fokusiraju samo na široke, univerzalne koncepte kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje. NEMOJ pominjati nikakve termine specifične za predmet, procese, rečnik ili primere. Pitanja moraju biti otvorena, prenosiva na sve discipline i nemoguća za odgovor jednostavnim učenjem sadržaja lekcije ili jedinice. Fokusiraj se samo na velike ideje, a ne na samu materiju predmeta."
                                    }
                                }
                            }
                        },
                        "LearningObjectives": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": [
                                "StudentsWillUnderstandThat",
                                "StudentsWillKnowThat",
                                "StudentsWillBeAbleTo"
                            ],
                            "properties": {
                                "StudentsWillUnderstandThat": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Svaki cilj mora završiti sa (DOK X) i predstavljati Velike ideje ili Trajna razumevanja generisanjem 3 do 5 konceptualnih, dugoročnih izjava koje objašnjavaju zašto je učenje važno izvan jedinice, naglašavaju prenosive obrasce, odnose ili principe u različitim kontekstima, objašnjavaju kako ili zašto nešto funkcioniše radije nego samo šta je to, napisane su kao pune deklarativne rečenice koje počinju glagolom i svaka je označena odgovarajućim nivoom dubine znanja (Depth of Knowledge), naglašavajući ideje koje učenici mogu preneti u nove situacije, buduće jedinice i donošenje odluka u stvarnom svetu."
                                },
                                "StudentsWillKnowThat": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Svaki cilj mora završiti sa (DOK X) i predstavljati Činjenice ili Fundamentalno znanje sadržaja generisanjem 3 do 5 činjenica specifičnih za disciplinu, termina ili izjava o osnovnom znanju koje identifikuju suštinske informacije koje učenici moraju zapamtiti, ostaju konkretne i činjenične radije nego konceptualne, podržavaju standarde jedinice i zadatke učinka, koriste jasan akademski rečnik primeren predmetu, uključuju odgovarajuću DOK oznaku tipično na nivou 1 ili 2, i dopunjuju koren rečenice 'Učenici će znati da...' dok počinju glagolom."
                                },
                                "StudentsWillBeAbleTo": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Svaki cilj mora završiti sa (DOK X) i predstavljati Veštine ili Prakse usklađene sa disciplinom generisanjem 4 do 7 izjava zasnovanih na veštinama koje opisuju šta će učenici raditi, kao što su analizirati, uporediti, dizajnirati, modelovati, rešiti, opravdati, kreirati, interpretirati, istražiti ili komunicirati; uskladiti sa praksama specifičnim za disciplinu; povezati direktno sa rezultatom projekta ili zadatkom učinka; ostati merljivi i uočljivi; uključiti odgovarajući DOK nivo između 2 i 4; i dopuniti koren rečenice 'Učenici će moći da...' dok počinju glagolom."
                                }
                            }
                        }
                    }
                },
                "FramingTheLearning": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "DrivingQuestion",
                        "Problem",
                        "Project",
                        "Place",
                        "KeyVocabulary"
                    ],
                    "properties": {
                        "KeyVocabulary": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": [
                                "VocabularyRationale",
                                "Tiers"
                            ],
                            "properties": {
                                "VocabularyRationale": {
                                    "type": "string",
                                    "description": "Navedite kratku, univerzalnu izjavu koja objašnjava da je rečnik jedinice namerno odabran da podrži suštinsko razumevanje, poveže učenje sa primenom u stvarnom svetu i ojača preciznu akademsku komunikaciju, i da su termini organizovani u nivoe kako bi se dali prioritet osnovama, podržala diferencijacija i ojačala efikasna upotreba disciplinarnog jezika od strane učenika."
                                },
                                "Tiers": {
                                    "type": "array",
                                    "minItems": 4,
                                    "maxItems": 4,
                                    "description": "Kreiraj sekciju Akademski rečnik u nivoima sa četiri označena nivoa, gde svaki naslov nivoa uključuje naziv nivoa i usklađene standarde, počinje kratkom izjavom o svrsi i navodi rečnik primeren jedinici sa definicijama prilagođenim učenicima i opcionom napomenom o povezanosti sa standardima; obavezni nivoi su Nivo 1: Osnovni / ključni rečnik, Nivo 2: Rečnik za primenu, modeliranje ili procese, Nivo 3: Rečnik specifičan za stvarni svet ili projekat i Nivo 4: Rečnik za obogaćivanje i proširivanje; standardi u naslovima nivoa moraju se podudarati sa standardima jedinice, sve oznake se moraju pojaviti tačno onako kako je navedeno, a rečnik mora dati prioritet jasnoći, tačnoj akademskoj upotrebi i pristupačnosti za učenike.",
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "TierTitle",
                                            "TierWhyItMatters",
                                            "Terms"
                                        ],
                                        "properties": {
                                            "TierTitle": {
                                                "type": "string",
                                                "description": "MORA biti tačno jedan od ovih: 'Nivo 1: Osnovni / ključni rečnik', 'Nivo 2: Rečnik za primenu, modeliranje ili procese', 'Nivo 3: Rečnik specifičan za stvarni svet ili projekat', 'Nivo 4: Rečnik za obogaćivanje i proširivanje'."
                                            },
                                            "TierWhyItMatters": {
                                                "type": "string"
                                            },
                                            "Terms": {
                                                "type": "array",
                                                "minItems": 3,
                                                "items": {
                                                    "type": "object",
                                                    "additionalProperties": false,
                                                    "required": [
                                                        "Term",
                                                        "Definition",
                                                        "StandardsConnection"
                                                    ],
                                                    "properties": {
                                                        "Term": {
                                                            "type": "string"
                                                        },
                                                        "Definition": {
                                                            "type": "string"
                                                        },
                                                        "StandardsConnection": {
                                                            "type": "string",
                                                            "description": "Navedite standard koji se podudara sa rečju iz rečnika. Primer: NGSS Veza: MS-PS1-4 Razviti model koji opisuje da su supstance napravljene od čestica koje su premale da bi se videle."
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "DrivingQuestion": {
                            "type": "string",
                            "description": "MORA se doslovno podudarati sa poljem UnitOverview.DrivingQuestion."
                        },
                        "Problem": {
                            "type": "string",
                            "description": "Opis problema mora predstaviti stvaran, uočljiv izazov u zajednici, sistemu ili okruženju; objasniti zašto je problem važan i kakve su posledice ako se ne reši; osigurati da problem zahteva analizu, rezonovanje i dokaze radije nego jednostavno prisećanje; identifikovati osnovne doprinoseće faktore kao što su naučni, istorijski, matematički, građanski, umetnički, tehnološki ili društveni elementi; pokazati kako nerazumevanje, nedostatak informacija ili previdene varijable doprinose problemu; jasno ocrtati intelektualne i praktične zadatke koje učenici moraju izvršiti koristeći disciplinarno znanje, analizu dokaza, modelovanje, objašnjenje, dizajn ili evaluaciju rešenja; pokazati kako rešavanje problema zahteva ovladavanje osnovnim konceptima, veštinama i praksama rezonovanja jedinice; uskladiti se eksplicitno sa jasnim, otvorenim pokretačkim pitanjem na koje se može odgovoriti kroz rad na projektu; specifikovati zahtevane komponente odgovora učenika kao što su model ili dizajn, analiza zasnovana na dokazima, vizuelno ili reprezentativno razmišljanje i obrazložen zaključak; i objasniti kako rešenje služi stvarnoj, relevantnoj autentičnoj publici koja je u poziciji da koristi ili proceni rad."
                        },
                        "Project": {
                            "type": "string",
                            "description": "Narativ o tome kako se učenje gradi kroz višednevni projekat (istraživanje -> primena -> usavršavanje -> prezentacija). Nije raspored iz dana u dan."
                        },
                        "Place": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": [
                                "PlaceOverview",
                                "Sites",
                                "PlaceMattersReminder"
                            ],
                            "properties": {
                                "PlaceOverview": {
                                    "type": "string",
                                    "description": "Model mora da objasni kako lokalni kontekst oblikuje problem iz stvarnog sveta koji učenici rešavaju, kako utiče na pokretačko pitanje koje će istraživati i kako određuje formu i očekivanja od finalnog proizvoda. Izlaz mora jasno opisati lokalno okruženje, zainteresovane strane ili potrebe zajednice koje projekat čine smislenim i pokazati kako ti elementi informišu rad učenika, zahtevane dokaze i autentičan uticaj."
                                },
                                "Sites": {
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 4,
                                    "description": "Mora uključiti 3 do 5 lokalno utemeljenih mesta angažovanja (Place-Based Sites of Engagement), svako strukturno sa tri označene komponente: 'Lokalitet', koji opisuje značajnu fizičku, društvenu, virtuelnu ili disciplinarno specifičnu lokaciju relevantnu za kontekst jedinice; 'Angažovanje', koje objašnjava autentične istraživačke aktivnosti koje učenici obavljaju na ili sa lokacijom, kao što su zapažanje, prikupljanje podataka, intervjui, analiza, virtuelno istraživanje ili vođeni terenski zadaci povezani sa problemom iz stvarnog sveta; i 'Relevantnost', koja objašnjava zašto je lokacija važna povezujući je sa problemom, pokazujući kako pruža dokaze ili stručnost, pojašnjavajući kako podržava dizajn rešenja ili modelovanje i naglašavajući lokalni ili značaj specifičan za zajednicu; lokacije moraju predstavljati različite kontekste, uključiti bar jednu koja uključuje stručnost zajednice, uključiti bar jednu koja uključuje direktno zapažanje ili fizički kontekst čak i ako je virtuelno, ostati predmetno neutralna i jasno pokazati kako je lokalna zajednica deo ekosistema učenja.",
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "TheSite",
                                            "Engagement",
                                            "Relevance"
                                        ],
                                        "properties": {
                                            "TheSite": {
                                                "type": "string"
                                            },
                                            "Engagement": {
                                                "type": "string"
                                            },
                                            "Relevance": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "PlaceMattersReminder": {
                                    "type": "string",
                                    "description": "Podsetnik: lokalna geografija/istorija/kultura/infrastruktura mora značajno uticati na odluke i rešenja učenika."
                                }
                            }
                        }
                    }
                },
                "AssessmentPlan": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "FormativeAssessmentTable",
                        "AnalyticRubric",
                        "AuthenticAudience"
                    ],
                    "properties": {
                        "AuthenticAudience": {
                            "type": "object",
                            "description": "Rubrika mora biti proizvedena kao tabela sa tačno sledećim zaglavljima kolona ovim redom: 'Kriterijum' (Criteria), 'Početnik' (Novice), 'Šegrt' (Apprentice), 'Praktičar' (Practitioner) i 'Ekspert' (Expert). Svaki red predstavlja jednu ocenjivanu veštinu, kompetenciju ili dimenziju finalnog projekta. Progresija od Početnika do Eksperta mora odražavati sve veću sofisticiranost i ne sme koristiti jezik zasnovan na deficitu kao što su 'ne uspeva', 'nedostaje' ili 'nema'. Kolona Ekspert mora se nadovezati na nivo Praktičara sa dubljim uvidom, preciznošću ili složenošću. Zadržite zaglavlja kolona tačno onako kako su napisana. Broj redova treba da odgovara broju glavnih kompetencija koje projekat zahteva. Primer zahtevane strukture izlaza dat je samo za format, ne i za sadržaj.",
                            "additionalProperties": false,
                            "required": [
                                "PrimaryAudienceDescription",
                                "WhyThisAudienceIsQualified",
                                "HowThisAudienceElevatesTheProject",
                                "StudentParticipationInAudienceSelection"
                            ],
                            "properties": {
                                "PrimaryAudienceDescription": {
                                    "type": "string",
                                    "description": "Jasan opis onoga ko je primarna publika (pojedinci, organizacije ili grupe) i njihov odnos prema kontekstu ili problemu projekta."
                                },
                                "WhyThisAudienceIsQualified": {
                                    "type": "string",
                                    "description": "Objašnjenje zašto ova publika ima relevantnu stručnost, proživljeno iskustvo ili autoritet u vezi sa temom projekta."
                                },
                                "HowThisAudienceElevatesTheProject": {
                                    "type": "string",
                                    "description": "Kako prisustvo ove publike povećava autentičnost, rigoroznost, motivaciju ili stvarni uticaj za učenike."
                                },
                                "StudentParticipationInAudienceSelection": {
                                    "type": "string",
                                    "description": "Opis načina na koji su učenici uključeni u identifikaciju, rafinisanje ili razumevanje autentične publike."
                                }
                            }
                        },
                        "FormativeAssessmentTable": {
                            "type": "array",
                            "minItems": 3,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "CriteriaForSuccess",
                                    "SuccessCriteria",
                                    "PointOfDemonstration"
                                ],
                                "properties": {
                                    "CriteriaForSuccess": {
                                        "type": "string"
                                    },
                                    "SuccessCriteria": {
                                        "type": "string"
                                    },
                                    "PointOfDemonstration": {
                                        "type": "string",
                                        "description": "Rubrika formativnog ocenjivanja MORA koristiti tačna zaglavlja kolona 'Kriterijumi za uspeh (Cilj učenja učenika)', 'Kriterijumi uspeha' i 'Tačka demonstracije'. Analitička rubrika MORA koristiti tačna zaglavlja kolona 'Kriterijum', 'Početnik', 'Šegrt', 'Praktičar' i 'Ekspert'. Ova šema ne sadrži sadržaj i pruža samo uputstva o tome kako model mora strukturirati izlaz. Kreiraj sekciju 'Rubrike za ocenjivanje' koja sadrži dva tražena formata rubrika i zadrži tačna zaglavlja kolona doslovno bez zamena. Za rubriku formativnog ocenjivanja, napravi tabelu sa tačno tri kolone označene kao 'Kriterijumi za uspeh (Cilj učenja učenika)', 'Kriterijumi uspeha' i 'Tačka demonstracije', i popuni svaki red specifičnim merljivim ciljem učenja, njegovim usklađenim kriterijumima uspeha i mestom gde će se dokaz pojaviti, kao što je zadatak, kontrolna tačka ili trenutak izvođenja. Broj redova mora odgovarati broju ciljeva učenja u jedinici, jezik mora biti jasan i prilagođen učenicima, a usklađenost između cilja, kriterijuma i tačke dokaza mora biti održana. Zadržite zaglavlja kolona tačno onako kako su napisana. Primer strukture je dat samo za format, a ne za sadržaj."
                                    }
                                }
                            }
                        },
                        "AnalyticRubric": {
                            "type": "array",
                            "minItems": 4,
                            "description": "Rubrika mora biti produkovana kao tabela sa tačno sledećim zaglavljima kolona u ovom redosledu: Kriterijum, Početnik, Šegrt, Praktičar i Ekspert (Criteria, Novice, Apprentice, Practitioner, and Expert). Svaki red predstavlja jednu ocenjenu veštinu, kompetenciju ili dimenziju finalnog projekta. Progresija od Početnika do Eksperta mora odražavati sve veću sofisticiranost i ne sme koristiti jezik zasnovan na deficitu kao što je 'ne uspeva', 'nedostaje' ili 'propustio'. Kolona Ekspert mora se nadovezivati na nivo Praktičara sa dubljim uvidom, preciznošću ili složenošću. Zadržite zaglavlja kolona tačno onako kako su napisana. Broj redova treba da odgovara broju glavnih kompetencija potrebnih za projekat. Primer strukture potrebnog izlaza je dat samo za format, a ne za sadržaj.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Criterion",
                                    "Novice",
                                    "Apprentice",
                                    "Practitioner",
                                    "Expert"
                                ],
                                "properties": {
                                    "Criterion": {
                                        "type": "string"
                                    },
                                    "Novice": {
                                        "type": "string"
                                    },
                                    "Apprentice": {
                                        "type": "string"
                                    },
                                    "Practitioner": {
                                        "type": "string"
                                    },
                                    "Expert": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "LearningPlan": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "LearningPlanOverview",
                        "ProjectPhases",
                        "ProjectGoals",
                        "CommunicationToAuthenticAudienceExpectations",
                        "FinalDeliverableSummary",
                        "GroupSuggestions"
                    ],
                    "properties": {
                        "LearningPlanOverview": {
                            "type": "string",
                            "description": "Izlaz mora uključivati jasnu izjavu o ukupnom broju nastavnih dana na osnovu vrednosti koju je naveo nastavnik, kratak opis kako se projekat odvija kroz faze radije nego fiksne datume, i rezime od 2-4 rečenice koji objašnjava kako učenje napreduje kroz jedinicu. Model ne sme pretpostavljati specifične raspone dana kao što su Dani 1-3 i umesto toga mora podeliti učenje u tri fleksibilne faze označene kao 'Rana faza', 'Srednja faza' i 'Finalna faza'. Rana faza mora opisati izgradnju temeljnog znanja, uvođenje osnovnih koncepata, alata ili veština, sprovođenje istraživačkih istraga ili vođenu praksu i pripremu učenika za dublje ispitivanje. Srednja faza mora opisati primenu osnovnih koncepata na centralni problem, sprovođenje analiza ili istraživanja, razvoj nacrta, prototipova, modela ili ideja za dizajn, kao i prikupljanje i interpretaciju dokaza za finalni rezultat. Finalna faza mora opisati rafinisanje finalnog proizvoda, sintetisanje učenja u jasna objašnjenja, pripremu vizuelnih prikaza, modela, argumenata ili prezentacija i predstavljanje autentičnoj publici. Model ne sme dodeliti fiksni broj dana bilo kojoj fazi i mora dopustiti bilo koje trajanje koje odredi nastavnik."
                        },
                        "ProjectPhases": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 4,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "PhaseTitle",
                                    "PhaseDescription",
                                    "ConceptsOrSkills",
                                    "CollaborationAndVisibleThinking",
                                    "KeyLearningExperiences"
                                ],
                                "properties": {
                                    "PhaseTitle": {
                                        "type": "string"
                                    },
                                    "PhaseDescription": {
                                        "type": "string"
                                    },
                                    "ConceptsOrSkills": {
                                        "type": "string"
                                    },
                                    "CollaborationAndVisibleThinking": {
                                        "type": "string"
                                    },
                                    "KeyLearningExperiences": {
                                        "type": "array",
                                        "minItems": 3,
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "ProjectGoals": {
                            "type": "array",
                            "minItems": 3,
                            "description": "Izlaz mora sadržati tačno tri cilja projekta, svaki izražen kao konceptualna kategorija praćena detaljnim buletima ili kratkim pasusima. Cilj 1: Primena disciplinarnog sadržaja na problem iz stvarnog sveta, zahteva od učenika da koriste znanje specifično za disciplinu za analizu ili rešavanje autentičnog izazova, navedu 4-6 osnovnih koncepata ili principa koje će primeniti i pokažu kako se ove ideje povezuju sa uslovima ili ograničenjima iz stvarnog sveta. Cilj 2: Rešavanje stvarnog, razvojno primerenog problema dizajna ili istraživanja, zahteva opisivanje autentičnog izazova koji učenici moraju adresirati, navođenje onoga što će učenici kreirati, modelovati, uporediti, analizirati, proceniti ili opravdati, i uključivanje procesa kao što su modelovanje, predviđanje, upoređivanje, evaluacija i donošenje odluka. Cilj 3: Saopštavanje nalaza stvarnoj publici, zahteva od učenika da pripreme doteran, profesionalno kvalitetan finalni proizvod, prilagode komunikaciju potrebama stvarne grupe zainteresovanih strana i referenciraju autentičnu publiku kao što su lokalni stručnjaci, organizacije u zajednici, profesionalci iz industrije, rukovodstvo škole, porodice ili članovi zajednice.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "CommunicationToAuthenticAudienceExpectations": {
                            "type": "string"
                        },
                        "FinalDeliverableSummary": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "string"
                            }
                        },
                        "GroupSuggestions": {
                            "type": "object",
                            "description": "Opisuje veličinu grupe, uloge i dužnosti nastavnika.",
                            "additionalProperties": false,
                            "required": [
                                "GroupSize",
                                "RotatingRolesAndDuties",
                                "TeacherGroupingStrategyPrompt",
                                "GroupingStrategyRecommendations"
                            ],
                            "properties": {
                                "GroupSize": {
                                    "type": "string",
                                    "description": "Izlaz mora navesti preporučenu veličinu grupe, npr. 3 do 4 učenika, i mora pružiti obrazloženje koje objašnjava kako ova veličina podržava produktivnu diskusiju, zajedničko angažovanje i upravljivu raspodelu zadataka."
                                },
                                "RotatingRolesAndDuties": {
                                    "type": "array",
                                    "description": "Izlaz mora pružiti listu uloga formatiranu kao Ime uloge: opis dužnosti. Lista mora uključivati najmanje četiri uloge, a obavezne funkcionalne kategorije su: Fasilitator koji vodi diskusiju i osigurava punu participaciju, Zapisničar koji dokumentuje razmišljanje grupe, Menadžer materijala koji bezbedno rukuje alatima i resursima, i Prezenter ili Komunikator koji deli nalaze grupe. Mogu se pojaviti i opcione uloge kao što su Istraživač, Analitičar podataka, Graditelj modela ili Merilac vremena. Treće, Očekivanja nastavnika za implementaciju uloga: Izlaz mora navesti da nastavnici uvode i modeluju svaku ulogu na početku projekta, uspostavljaju jasne norme za funkcionisanje uloga tokom rada u grupama i zahtevaju da učenici rotiraju uloge kroz aktivnosti kako bi svi učenici uvežbali višestruke veštine saradnje.",
                                    "minItems": 4,
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "TeacherGroupingStrategyPrompt": {
                                    "type": "string",
                                    "description": "Model mora ispisati sledeći tekst tačno onako kako je napisan, bez menjanja reči, znakova interpunkcije ili fraza: Da biste pomogli nastavnicima da donesu namerne odluke o grupisanju, uključite ovaj podsticaj za planiranje: 'Koja je glavna svrha vašeg grupisanja u ovoj aktivnosti – vršnjačka podrška, bogata diskusija, izazov ili efikasnost? Kada imenujete svrhu, koji pristup grupisanju najbolje odgovara: mešovite sposobnosti, zasnovan na interesovanjima, zasnovan na veštinama ili slučajan?' Ovo pitanje ohrabruje nastavnike da biraju metode grupisanja koje odgovaraju ciljevima nastave, a ne da se podrazumevaju prema pogodnosti ili navici. Model ne sme dodavati dodatna objašnjenja, primere ili komentare."
                                },
                                "GroupingStrategyRecommendations": {
                                    "type": "array",
                                    "description": "Model mora ispisati sledeći tekst tačno onako kako je napisan, bez menjanja reči, znakova interpunkcije ili fraza: Nastavnici mogu razmotriti: Grupe mešovitih sposobnosti: Najbolje kada zadaci zahtevaju rezonovanje, poređenje dokaza ili skelu preko nivoa spremnosti (npr. 'brainstorming' o modelu čestica). Grupe zasnovane na interesovanjima: Idealne tokom razvoja koncepta skulpture, omogućavajući učenicima da sarađuju na osnovu tema ili umetničkih stilova koji ih privlače. Grupe zasnovane na veštinama: Korisne kada zadaci zahtevaju tehničku preciznost (npr. dijagrami čestica, modeliranje ekološkog stresa). Randomizovane grupe: Korisne tokom ranih istraživačkih zadataka za izgradnju zajednice i smanjenje prevelikog oslanjanja na predvidljiva partnerstva. Model ne sme dodavati dodatna objašnjenja, primere ili komentare.",
                                    "minItems": 4,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "TeacherGuidancePhase1": {
                    "type": "object",
                    "additionalProperties": false,
                    "description": "Prva faza nastavnih uputstava",
                    "required": [
                        "Phase1_Title",
                        "Phase1_FocusStatement",
                        "Phase1_CollaborativeActivities",
                        "Phase1_GuidingQuestions",
                        "Phase1_Differentiation_LanguageLearners",
                        "Phase1_Differentiation_Scaffolding",
                        "Phase1_Differentiation_GoDeeper",
                        "Phase1_Accommodations_General",
                        "Phase1_Accommodations_IndividualSupport",
                        "Phase1_AnticipatedMisconceptions",
                        "Phase1_TranscendentThinkingPrompts",
                        "Phase1_QuickChecks",
                        "Phase1_SpacedRetrieval",
                        "Phase1_StudentPractice_TeacherNotes",
                        "Phase1_StudentPractice_Tasks",
                        "Phase1_StudentPractice_InterleavingIfMath",
                        "Phase1_ReflectionPrompt"
                    ],
                    "properties": {
                        "Phase1_Title": {
                            "type": "string",
                            "description": "MORA biti tačno: 'Faza 1 - Lansiranje'."
                        },
                        "Phase1_FocusStatement": {
                            "type": "string",
                            "description": "Navedite kratku izjavu koja opisuje kako ova faza gradi radoznalost, uvodi problem iz stvarnog sveta i aktivira rano rezonovanje. Izjava o fokusu mora uključivati izgradnju radoznalosti o centralnom fenomenu ili problemu, rano zapažanje i istraživanje, uočavanje i ispitivanje vođeno učenicima, i jasnu vezu sa pokretačkim pitanjem jedinice. Formu bi trebalo da odražava to da u ovoj fazi lansiranja učenici grade radoznalost i počinju da otkrivaju naučni ili konceptualni problem u centru projekta, i da kroz zapažanje, istraživanje i rane pokušaje modelovanja prikupljaju dokaze iz prve ruke koji povezuju njihovo početno razmišljanje sa pokretačkim pitanjem."
                        },
                        "Phase1_CollaborativeActivities": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 5,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "ActivityTitle",
                                    "StudentExperience",
                                    "ArtifactsOfLearning",
                                    "TeacherRoleMoves"
                                ],
                                "properties": {
                                    "ActivityTitle": {
                                        "type": "string"
                                    },
                                    "StudentExperience": {
                                        "type": "string"
                                    },
                                    "ArtifactsOfLearning": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "TeacherRoleMoves": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase1_GuidingQuestions": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "string"
                            }
                        },
                        "Phase1_Differentiation_LanguageLearners": {
                            "type": "string",
                            "description": "Instruktivne strategije dizajnirane posebno da podrže razvoj jezika i konceptualno razumevanje za učenike koji uče jezik, koristeći vizuelnu podršku, strukturne jezičke skele i prilike za smislen akademski razgovor. Fokusirajte se na to kako se sadržaj podučava, a ne na promenu očekivanja učenja."
                        },
                        "Phase1_Differentiation_Scaffolding": {
                            "type": "string",
                            "description": "Strategije podučavanja koje pružaju dodatnu podršku (scaffolding) za učenike kojima je potreban strukturiran rad, uz zadržavanje istih ciljeva učenja. Podrška treba da poveća pristup rezonovanju i angažovanju kroz vođenu praksu, vizuelnu organizaciju i postepeno prepuštanje odgovornosti."
                        },
                        "Phase1_Differentiation_GoDeeper": {
                            "type": "string",
                            "description": "Instruktivna proširenja koja produbljuju razmišljanje učenika spremnih za veći izazov povećanjem konceptualne složenosti, apstrakcije i zahteva za rezonovanjem, uz usklađenost sa istim osnovnim ciljevima učenja."
                        },
                        "Phase1_Accommodations_General": {
                            "type": "string",
                            "description": "Opšta podrška u učionici i modifikacije koje se primenjuju na većinu ili sve učenike tokom ove aktivnosti."
                        },
                        "Phase1_Accommodations_IndividualSupport": {
                            "type": "array",
                            "minItems": 0,
                            "description": "Lista specifičnih prilagođavanja učenika. Svaki unos MORA koristiti imena učenika i planove tačno onako kako su navedeni u uputstvu.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "StudentName",
                                    "PlanProvided",
                                    "PlanImplementation"
                                ],
                                "properties": {
                                    "StudentName": {
                                        "type": "string",
                                        "description": "Puno ime učenika tačno onako kako je navedeno u uputstvu."
                                    },
                                    "PlanProvided": {
                                        "type": "string",
                                        "description": "Opis individualizovanog plana podrške učeniku."
                                    },
                                    "PlanImplementation": {
                                        "type": "string",
                                        "description": "Kratak opis individualizovanog prilagođavanja ili modifikacije za ovog učenika."
                                    }
                                }
                            }
                        },
                        "Phase1_AnticipatedMisconceptions": {
                            "type": "array",
                            "description": "Lista čestih pogrešnih uverenja učenika koje će se verovatno pojaviti tokom ove faze nastave, uparena sa jasnim jezikom za ispravljanje koji modeluje kako odgovoriti u trenutku da bi se učenici vodili ka tačnom konceptualnom razumevanju.",
                            "minItems": 2,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Misconception",
                                    "CorrectionLanguage"
                                ],
                                "properties": {
                                    "Misconception": {
                                        "type": "string",
                                        "description": "Sažet opis uobičajenog ili predvidljivog nerazumevanja koje učenici mogu imati o konceptima obrađenim u ovoj fazi."
                                    },
                                    "CorrectionLanguage": {
                                        "type": "string",
                                        "description": "Specifičan jezik nastavnika ili instruktivni potezi – kao što su istraživačka pitanja, podsticaji ili primeri – koji pomažu učenicima da ispitaju svoje razmišljanje i krenu ka tačnom razumevanju bez direktnog davanja odgovora."
                                    }
                                }
                            }
                        },
                        "Phase1_TranscendentThinkingPrompts": {
                            "type": "array",
                            "minItems": 1,
                            "description": "Pitanja za primenu u stvarnom svetu koja povezuju učenje sa svrhom/značenjem/velikim idejama, sa očekivanim odgovorima učenika koji pokazuju dublje razumevanje",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Prompt",
                                    "ExpectedStudentResponses"
                                ],
                                "properties": {
                                    "Prompt": {
                                        "type": "string",
                                        "description": "Pitanje za duboko razmišljanje namenjeno učenicima."
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        },
                                        "description": "Lista očekivanih odgovora učenika koji pokazuju dublje razumevanje."
                                    }
                                }
                            }
                        },
                        "Phase1_QuickChecks": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "Završno pitanje za proveru razumevanja sa 2-3 očekivana odgovora učenika koji pokazuju ovladavanje",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "Prompt",
                                    "SuccessCriteriaOrExpectedResponses"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string",
                                        "description": "Koristite: 'Početak faze', 'Sredina faze' ili 'Kraj faze'."
                                    },
                                    "Prompt": {
                                        "type": "string",
                                        "description": "Pitanje za brzu proveru razumevanja."
                                    },
                                    "SuccessCriteriaOrExpectedResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        },
                                        "description": "Lista očekivanih odgovora učenika koji pokazuju razumevanje."
                                    }
                                }
                            }
                        },
                        "Phase1_SpacedRetrieval": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "Model mora kreirati komponentu 'Prisećanje uz vremenske razmake' koja zahteva od učenika da se prisete ključnog koncepta iz specifične prethodne jedinice ili lekcije bez referenciranja bilo kakvih prošlih aktivnosti, radnih listova, modela, oznaka ili koraka specifičnih za zadatak. Skript za nastavnika mora početi sa 'Kaži:' i može referencirati samo temu prethodnog učenja, a ne ono što su učenici naučili o njoj. Pitanje za prisećanje mora podstaći učenike da ponovo izjave ili primene prethodno naučeno konceptualno razumevanje (kao što je kako sistem funkcioniše, kako se varijable odnose ili kako se proces odvija) u potpunosti iz pamćenja, bez davanja nagoveštaja ili delimičnih objašnjenja od strane nastavnika. Izlaz mora završiti sa 'Očekivani odgovori učenika' prikazujući 2-3 primera koji tačno odražavaju konceptualno prisećanje, pokazujući da su učenici – a ne podsticaj – dali zapamćene ideje.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "DrawsFrom",
                                    "Question",
                                    "DOK",
                                    "ExpectedResponseOrSuccessCriteria"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string",
                                        "description": "Koristite: 'Početak faze', 'Sredina faze' ili 'Kraj faze'."
                                    },
                                    "DrawsFrom": {
                                        "type": "string",
                                        "description": "Referenca na prethodno učenje ili lekciju."
                                    },
                                    "Question": {
                                        "type": "string",
                                        "description": "Pitanje za prisećanje koncepta iz pamćenja."
                                    },
                                    "DOK": {
                                        "type": "integer",
                                        "minimum": 1,
                                        "maximum": 4
                                    },
                                    "ExpectedResponseOrSuccessCriteria": {
                                        "type": "string",
                                        "description": "Detaljni očekivani odgovori učenika ili kriterijumi uspeha."
                                    }
                                }
                            }
                        },
                        "Phase1_StudentPractice_TeacherNotes": {
                            "type": "string",
                            "description": "Jedan pasus koji objašnjava znanje i veštine praktikovane kroz sve zadatke u ovoj fazi. Pasus MORA početi sa 'Ovi zadaci utvrđuju današnje učenje o ____ putem ______.' gde se praznine popunjavaju relevantnim sadržajem projekta, nakon čega sledi objašnjenje kako ovi zadaci jačaju dugoročno pamćenje."
                        },
                        "Phase1_StudentPractice_Tasks": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 3,
                            "description": "Zadaci treba da se usklade sa fokusom faze i očekivanom dubinom znanja. Koristite samo DOK 2, 3 ili 4.",
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
                                        "description": "Nivo dubine znanja za zadatak. MORA biti JEDAN od: 'DOK 2', 'DOK 3' ili 'DOK 4'. DOK 1 je striktno zabranjen."
                                    },
                                    "StudentDirections": {
                                        "type": "string"
                                    },
                                    "SuccessCriteria": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        },
                                        "description": "Lista konkretnih kriterijuma za uspeh na zadatku."
                                    }
                                }
                            }
                        },
                        "Phase1_StudentPractice_InterleavingIfMath": {
                            "type": "string",
                            "description": "AKO i SAMO AKO je predmet matematika: uključite problem interleviranja (isprepletenog vežbanja) + podsticaj nastavnika + očekivane odgovore + napomenu za nastavnika. U suprotnom, prazan string."
                        },
                        "Phase1_ReflectionPrompt": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": ["Introduction", "Prompts"],
                            "properties": {
                                "Introduction": {
                                    "type": "string",
                                    "description": "Kratak uvod za refleksiju namenjen učenicima, npr. 'Napišite 2-3 rečenice odgovarajući na jedan podsticaj:'"
                                },
                                "Prompts": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "TeacherGuidancePhase2": {
                    "type": "object",
                    "additionalProperties": false,
                    "description": "Druga faza nastavnih uputstava",
                    "required": [
                        "Phase2_Title",
                        "Phase2_FocusStatement",
                        "Phase2_CollaborativeActivities",
                        "Phase2_GuidingQuestions",
                        "Phase2_Differentiation_LanguageLearners",
                        "Phase2_Differentiation_Scaffolding",
                        "Phase2_Differentiation_GoDeeper",
                        "Phase2_Accommodations_General",
                        "Phase2_Accommodations_IndividualSupport",
                        "Phase2_AnticipatedMisconceptions",
                        "Phase2_TranscendentThinkingPrompts",
                        "Phase2_QuickChecks",
                        "Phase2_SpacedRetrieval",
                        "Phase2_StudentPractice_TeacherNotes",
                        "Phase2_StudentPractice_Tasks",
                        "Phase2_StudentPractice_InterleavingIfMath",
                        "Phase2_ReflectionPrompt"
                    ],
                    "properties": {
                        "Phase2_Title": {
                            "type": "string",
                            "description": "MORA biti tačno: 'Faza 2 - Istraživanje, razvoj i usavršavanje'."
                        },
                        "Phase2_FocusStatement": {
                            "type": "string",
                            "description": "Napišite Izjavu o fokusu od 1-3 rečenice koja rezimira svrhu faze, objašnjava kako učenici grade razumevanje kroz rad zasnovan na istraživanju, eksplicitno povezuje fazu sa Pokretačkim pitanjem jedinice ili problemom iz stvarnog sveta, i opisuje kako ova faza približava učenike izradi njihovog finalnog proizvoda. Izjava mora uvek biti napisana kao jedan kratak pasus i mora biti prilagođena specifičnim detaljima projekta koje je naveo korisnik."
                        },
                        "Phase2_CollaborativeActivities": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 5,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "ActivityTitle",
                                    "StudentExperience",
                                    "ArtifactsOfLearning",
                                    "TeacherRoleMoves"
                                ],
                                "properties": {
                                    "ActivityTitle": {
                                        "type": "string"
                                    },
                                    "StudentExperience": {
                                        "type": "string"
                                    },
                                    "ArtifactsOfLearning": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "TeacherRoleMoves": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase2_GuidingQuestions": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "string"
                            }
                        },
                        "Phase2_Differentiation_LanguageLearners": {
                            "type": "string",
                            "description": "Instruktivne strategije dizajnirane posebno da podrže razvoj jezika i konceptualno razumevanje za učenike koji uče jezik, koristeći vizuelnu podršku, strukturne jezičke skele i prilike za smislen akademski razgovor. Fokusirajte se na to kako se sadržaj podučava, a ne na promenu očekivanja učenja."
                        },
                        "Phase2_Differentiation_Scaffolding": {
                            "type": "string",
                            "description": "Strategije podučavanja koje pružaju dodatnu podršku (scaffolding) za učenike kojima je potreban strukturiran rad, uz zadržavanje istih ciljeva učenja. Podrška treba da poveća pristup rezonovanju i angažovanju kroz vođenu praksu, vizuelnu organizaciju i postepeno prepuštanje odgovornosti."
                        },
                        "Phase2_Differentiation_GoDeeper": {
                            "type": "string",
                            "description": "Instruktivna proširenja koja produbljuju razmišljanje učenika spremnih za veći izazov povećanjem konceptualne složenosti, apstrakcije i zahteva za rezonovanjem, uz usklađenost sa istim osnovnim ciljevima učenja."
                        },
                        "Phase2_Accommodations_General": {
                            "type": "string",
                            "description": "Opšta podrška u učionici i modifikacije koje se primenjuju na većinu ili sve učenike tokom ove aktivnosti."
                        },
                        "Phase2_Accommodations_IndividualSupport": {
                            "type": "array",
                            "minItems": 0,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "StudentName",
                                    "PlanProvided",
                                    "PlanImplementation"
                                ],
                                "properties": {
                                    "StudentName": {
                                        "type": "string",
                                        "description": "Puno ime učenika tačno onako kako je navedeno u uputstvu."
                                    },
                                    "PlanProvided": {
                                        "type": "string",
                                        "description": "Opis individualizovanog plana podrške učeniku."
                                    },
                                    "PlanImplementation": {
                                        "type": "string",
                                        "description": "Kratak opis individualizovanog prilagođavanja ili modifikacije za ovog učenika."
                                    }
                                }
                            }
                        },
                        "Phase2_AnticipatedMisconceptions": {
                            "type": "array",
                            "description": "Lista čestih pogrešnih uverenja učenika koje će se verovatno pojaviti tokom ove faze nastave, uparena sa jasnim jezikom za ispravljanje koji modeluje kako odgovoriti u trenutku da bi se učenici vodili ka tačnom konceptualnom razumevanju.",
                            "minItems": 2,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Misconception",
                                    "CorrectionLanguage"
                                ],
                                "properties": {
                                    "Misconception": {
                                        "type": "string",
                                        "description": "Sažet opis uobičajenog ili predvidljivog nerazumevanja koje učenici mogu imati o konceptima obrađenim u ovoj fazi."
                                    },
                                    "CorrectionLanguage": {
                                        "type": "string",
                                        "description": "Specifičan jezik nastavnika ili instruktivni potezi – kao što su istraživačka pitanja, podsticaji ili primeri – koji pomažu učenicima da ispitaju svoje razmišljanje i krenu ka tačnom razumevanju bez direktnog davanja odgovora."
                                    }
                                }
                            }
                        },
                        "Phase2_TranscendentThinkingPrompts": {
                            "type": "array",
                            "minItems": 1,
                            "description": "Pitanja za primenu u stvarnom svetu koja povezuju učenje sa svrhom/značenjem/velikim idejama, sa očekivanim odgovorima učenika koji pokazuju dublje razumevanje",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Prompt",
                                    "ExpectedStudentResponses"
                                ],
                                "properties": {
                                    "Prompt": {
                                        "type": "string",
                                        "description": "Pitanje za duboko razmišljanje namenjeno učenicima."
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        },
                                        "description": "Lista očekivanih odgovora učenika koji pokazuju dublje razumevanje."
                                    }
                                }
                            }
                        },
                        "Phase2_QuickChecks": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "Završno pitanje za proveru razumevanja sa 2-3 očekivana odgovora učenika koji pokazuju ovladavanje",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "Prompt",
                                    "SuccessCriteriaOrExpectedResponses"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string",
                                        "description": "Koristite: 'Početak faze', 'Sredina faze' ili 'Kraj faze'."
                                    },
                                    "Prompt": {
                                        "type": "string",
                                        "description": "Pitanje za brzu proveru razumevanja."
                                    },
                                    "SuccessCriteriaOrExpectedResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        },
                                        "description": "Lista očekivanih odgovora učenika koji pokazuju razumevanje."
                                    }
                                }
                            }
                        },
                        "Phase2_SpacedRetrieval": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "Model mora kreirati komponentu 'Prisećanje uz vremenske razmake' koja zahteva od učenika da se prisete ključnog koncepta iz specifične prethodne jedinice ili lekcije bez referenciranja bilo kakvih prošlih aktivnosti, radnih listova, modela, oznaka ili koraka specifičnih za zadatak. Skript za nastavnika mora početi sa 'Kaži:' i može referencirati samo temu prethodnog učenja, a ne ono što su učenici naučili o njoj. Pitanje za prisećanje mora podstaći učenike da ponovo izjave ili primene prethodno naučeno konceptualno razumevanje (kao što je kako sistem funkcioniše, kako se varijable odnose ili kako se proces odvija) u potpunosti iz pamćenja, bez davanja nagoveštaja ili delimičnih objašnjenja od strane nastavnika. Izlaz mora završiti sa 'Očekivani odgovori učenika' prikazujući 2-3 primera koji tačno odražavaju konceptualno prisećanje, pokazujući da su učenici – a ne podsticaj – dali zapamćene ideje.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "DrawsFrom",
                                    "Question",
                                    "DOK",
                                    "ExpectedResponseOrSuccessCriteria"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string",
                                        "description": "Koristite: 'Početak faze', 'Sredina faze' ili 'Kraj faze'."
                                    },
                                    "DrawsFrom": {
                                        "type": "string",
                                        "description": "Referenca na prethodno učenje ili lekciju."
                                    },
                                    "Question": {
                                        "type": "string",
                                        "description": "Pitanje za prisećanje koncepta iz pamćenja."
                                    },
                                    "DOK": {
                                        "type": "integer",
                                        "minimum": 1,
                                        "maximum": 4
                                    },
                                    "ExpectedResponseOrSuccessCriteria": {
                                        "type": "string",
                                        "description": "Detaljni očekivani odgovori učenika ili kriterijumi uspeha."
                                    }
                                }
                            }
                        },
                        "Phase2_StudentPractice_TeacherNotes": {
                            "type": "string",
                            "description": "Jedan pasus koji objašnjava znanje i veštine praktikovane kroz sve zadatke u ovoj fazi. Pasus MORA početi sa 'Ovi zadaci utvrđuju današnje učenje o ____ putem ______.' gde se praznine popunjavaju relevantnim sadržajem projekta, nakon čega sledi objašnjenje kako ovi zadaci jačaju dugoročno pamćenje."
                        },
                        "Phase2_StudentPractice_Tasks": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 3,
                            "description": "Zadaci treba da se usklade sa fokusom faze i očekivanom dubinom znanja. Koristite samo DOK 2, 3 ili 4.",
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
                                        "description": "Nivo dubine znanja za zadatak. MORA biti JEDAN od: 'DOK 2', 'DOK 3' ili 'DOK 4'. DOK 1 je striktno zabranjen."
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
                        "Phase2_StudentPractice_InterleavingIfMath": {
                            "type": "string",
                            "description": "AKO i SAMO AKO je predmet matematika: uključite problem interleviranja (isprepletenog vežbanja) + podsticaj nastavnika + očekivane odgovore + napomenu za nastavnika. U suprotnom, prazan string."
                        },
                        "Phase2_ReflectionPrompt": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": ["Introduction", "Prompts"],
                            "properties": {
                                "Introduction": {
                                    "type": "string",
                                    "description": "Kratak uvod za refleksiju namenjen učenicima, npr. 'Napišite 2-3 rečenice odgovarajući na jedan podsticaj:'"
                                },
                                "Prompts": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "TeacherGuidancePhase3": {
                    "type": "object",
                    "additionalProperties": false,
                    "description": "Treća faza nastavnih uputstava",
                    "required": [
                        "Phase3_FocusStatement",
                        "Phase3_CollaborativeActivities",
                        "Phase3_GuidingQuestions",
                        "Phase3_Differentiation_LanguageLearners",
                        "Phase3_Differentiation_Scaffolding",
                        "Phase3_Differentiation_GoDeeper",
                        "Phase3_Accommodations_General",
                        "Phase3_Accommodations_IndividualSupport",
                        "Phase3_AnticipatedMisconceptions",
                        "Phase3_TranscendentThinkingPrompts",
                        "Phase3_QuickChecks",
                        "Phase3_SpacedRetrieval",
                        "Phase3_StudentPractice_TeacherNotes",
                        "Phase3_StudentPractice_Tasks",
                        "Phase3_StudentPractice_InterleavingIfMath",
                        "Phase3_ReflectionPrompt",
                        "Phase3_Title"
                    ],
                    "properties": {
                        "Phase3_Title": {
                            "type": "string",
                            "description": "MORA biti tačno: 'Faza 3 - Razvoj; Usavršavanje, kulminacija i refleksija'."
                        },
                        "Phase3_FocusStatement": {
                            "type": "string",
                            "description": "Generišite Izjavu o fokusu od 2-4 rečenice koja jasno komunicira svrhu Faze 3 i njenu ulogu u vođenju učenika ka finalnom proizvodu. Izjava mora da objasni da se Faza 3 fokusira na rafinisanje ideja, primenu učenja, jačanje dokaza, pripremu kulminirajućih proizvoda i angažovanje u dubljem rezonovanju i reviziji. Mora eksplicitno pokazati kako Faza 3 unapređuje autentični izazov projekta iz stvarnog sveta, kako učenici koriste dokaze da poboljšaju rešenja i kako ovaj rad priprema ih za autentičnu publiku. Izjava mora uključivati intelektualni rad kao što je rafinisanje, revidiranje, sintetisanje, evaluacija, opravdavanje, finalizacija i komunikacija, i mora ukazivati na to kako učenici finalizuju modele, proizvode, objašnjenja ili predloge, pripremaju prezentacije ili javne nastupe i razmišljaju o učenju kako bi ojačali svoje rezonovanje."
                        },
                        "Phase3_CollaborativeActivities": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 5,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "ActivityTitle",
                                    "StudentExperience",
                                    "ArtifactsOfLearning",
                                    "TeacherRoleMoves"
                                ],
                                "properties": {
                                    "ActivityTitle": {
                                        "type": "string"
                                    },
                                    "StudentExperience": {
                                        "type": "string"
                                    },
                                    "ArtifactsOfLearning": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "TeacherRoleMoves": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase3_GuidingQuestions": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "string"
                            }
                        },
                        "Phase3_Differentiation_LanguageLearners": {
                            "type": "string",
                            "description": "Instruktivne strategije dizajnirane posebno da podrže razvoj jezika i konceptualno razumevanje za učenike koji uče jezik, koristeći vizuelnu podršku, strukturne jezičke skele i prilike za smislen akademski razgovor. Fokusirajte se na to kako se sadržaj podučava, a ne na promenu očekivanja učenja."
                        },
                        "Phase3_Differentiation_Scaffolding": {
                            "type": "string",
                            "description": "Strategije podučavanja koje pružaju dodatnu podršku (scaffolding) za učenike kojima je potreban strukturiran rad, uz zadržavanje istih ciljeva učenja. Podrška treba da poveća pristup rezonovanju i angažovanju kroz vođenu praksu, vizuelnu organizaciju i postepeno prepuštanje odgovornosti."
                        },
                        "Phase3_Differentiation_GoDeeper": {
                            "type": "string",
                            "description": "Instruktivna proširenja koja produbljuju razmišljanje učenika spremnih za veći izazov povećanjem konceptualne složenosti, apstrakcije i zahteva za rezonovanjem, uz usklađenost sa istim osnovnim ciljevima učenja."
                        },
                        "Phase3_Accommodations_General": {
                            "type": "string",
                            "description": "Opšta podrška u učionici i modifikacije koje se primenjuju na većinu ili sve učenike tokom ove aktivnosti."
                        },
                        "Phase3_Accommodations_IndividualSupport": {
                            "type": "array",
                            "minItems": 0,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "StudentName",
                                    "PlanProvided",
                                    "PlanImplementation"
                                ],
                                "properties": {
                                    "StudentName": {
                                        "type": "string",
                                        "description": "Puno ime učenika tačno onako kako je navedeno u uputstvu."
                                    },
                                    "PlanProvided": {
                                        "type": "string",
                                        "description": "Opis individualizovanog plana podrške učeniku."
                                    },
                                    "PlanImplementation": {
                                        "type": "string",
                                        "description": "Kratak opis individualizovanog prilagođavanja ili modifikacije za ovog učenika."
                                    }
                                }
                            }
                        },
                        "Phase3_AnticipatedMisconceptions": {
                            "type": "array",
                            "description": "Lista čestih pogrešnih uverenja učenika koje će se verovatno pojaviti tokom ove faze nastave, uparena sa jasnim jezikom za ispravljanje koji modeluje kako odgovoriti u trenutku da bi se učenici vodili ka tačnom konceptualnom razumevanju.",
                            "minItems": 2,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Misconception",
                                    "CorrectionLanguage"
                                ],
                                "properties": {
                                    "Misconception": {
                                        "type": "string",
                                        "description": "Sažet opis uobičajenog ili predvidljivog nerazumevanja koje učenici mogu imati o konceptima obrađenim u ovoj fazi."
                                    },
                                    "CorrectionLanguage": {
                                        "type": "string",
                                        "description": "Specifičan jezik nastavnika ili instruktivni potezi – kao što su istraživačka pitanja, podsticaji ili primeri – koji pomažu učenicima da ispitaju svoje razmišljanje i krenu ka tačnom razumevanju bez direktnog davanja odgovora."
                                    }
                                }
                            }
                        },
                        "Phase3_TranscendentThinkingPrompts": {
                            "type": "array",
                            "minItems": 1,
                            "description": "Pitanja za primenu u stvarnom svetu koja povezuju učenje sa svrhom/značenjem/velikim idejama, sa očekivanim odgovorima učenika koji pokazuju dublje razumevanje",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Prompt",
                                    "ExpectedStudentResponses"
                                ],
                                "properties": {
                                    "Prompt": {
                                        "type": "string",
                                        "description": "Pitanje za duboko razmišljanje namenjeno učenicima."
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        },
                                        "description": "Lista očekivanih odgovora učenika koji pokazuju dublje razumevanje."
                                    }
                                }
                            }
                        },
                        "Phase3_QuickChecks": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "Završno pitanje za proveru razumevanja sa 2-3 očekivana odgovora učenika koji pokazuju ovladavanje",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "Prompt",
                                    "SuccessCriteriaOrExpectedResponses"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string",
                                        "description": "Koristite: 'Početak faze', 'Sredina faze' ili 'Kraj faze'."
                                    },
                                    "Prompt": {
                                        "type": "string",
                                        "description": "Pitanje za brzu proveru razumevanja."
                                    },
                                    "SuccessCriteriaOrExpectedResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        },
                                        "description": "Lista očekivanih odgovora učenika koji pokazuju razumevanje."
                                    }
                                }
                            }
                        },
                        "Phase3_SpacedRetrieval": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "Model mora kreirati komponentu 'Prisećanje uz vremenske razmake' koja zahteva od učenika da se prisete ključnog koncepta iz specifične prethodne jedinice ili lekcije bez referenciranja bilo kakvih prošlih aktivnosti, radnih listova, modela, oznaka ili koraka specifičnih za zadatak. Skript za nastavnika mora početi sa 'Kaži:' i može referencirati samo temu prethodnog učenja, a ne ono što su učenici naučili o njoj. Pitanje za prisećanje mora podstaći učenike da ponovo izjave ili primene prethodno naučeno konceptualno razumevanje (kao što je kako sistem funkcioniše, kako se varijable odnose ili kako se proces odvija) u potpunosti iz pamćenja, bez davanja nagoveštaja ili delimičnih objašnjenja od strane nastavnika. Izlaz mora završiti sa 'Očekivani odgovori učenika' prikazujući 2-3 primera koji tačno odražavaju konceptualno prisećanje, pokazujući da su učenici – a ne podsticaj – dali zapamćene ideje.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "DrawsFrom",
                                    "Question",
                                    "DOK",
                                    "ExpectedResponseOrSuccessCriteria"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string",
                                        "description": "Koristite: 'Početak faze', 'Sredina faze' ili 'Kraj faze'."
                                    },
                                    "DrawsFrom": {
                                        "type": "string",
                                        "description": "Referenca na prethodno učenje ili lekciju."
                                    },
                                    "Question": {
                                        "type": "string",
                                        "description": "Pitanje za prisećanje koncepta iz pamćenja."
                                    },
                                    "DOK": {
                                        "type": "integer",
                                        "minimum": 1,
                                        "maximum": 4
                                    },
                                    "ExpectedResponseOrSuccessCriteria": {
                                        "type": "string",
                                        "description": "Detaljni očekivani odgovori učenika ili kriterijumi uspeha."
                                    }
                                }
                            }
                        },
                        "Phase3_StudentPractice_TeacherNotes": {
                            "type": "string",
                            "description": "Jedan pasus koji objašnjava znanje i veštine praktikovane kroz sve zadatke u ovoj fazi. Pasus MORA početi sa 'Ovi zadaci utvrđuju današnje učenje o ____ putem ______.' gde se praznine popunjavaju relevantnim sadržajem projekta, nakon čega sledi objašnjenje kako ovi zadaci jačaju dugoročno pamćenje."
                        },
                        "Phase3_StudentPractice_Tasks": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 3,
                            "description": "Zadaci treba da se usklade sa fokusom faze i očekivanom dubinom znanja. Koristite samo DOK 2, 3 ili 4.",
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
                                        "description": "Nivo dubine znanja za zadatak. MORA biti JEDAN od: 'DOK 2', 'DOK 3' ili 'DOK 4'. DOK 1 je striktno zabranjen."
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
                        "Phase3_StudentPractice_InterleavingIfMath": {
                            "type": "string",
                            "description": "AKO i SAMO AKO je predmet matematika: uključite problem interleviranja (isprepletenog vežbanja) + podsticaj nastavnika + očekivane odgovore + napomenu za nastavnika. U suprotnom, prazan string."
                        },
                        "Phase3_ReflectionPrompt": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": ["Introduction", "Prompts"],
                            "properties": {
                                "Introduction": {
                                    "type": "string",
                                    "description": "Kratak uvod za refleksiju namenjen učenicima, npr. 'Napišite 2-3 rečenice odgovarajući na jedan podsticaj:'"
                                },
                                "Prompts": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "UnitPreparationAndConsiderations": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "MaterialsEquipmentAndKeyResources",
                        "TechnologyIntegration"
                    ],
                    "properties": {
                        "MaterialsEquipmentAndKeyResources": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": [
                                "ClassroomMaterialsAndEquipment",
                                "LocalCommunityBasedResources",
                                "DigitalToolsAndOnlineResources"
                            ],
                            "properties": {
                                "ClassroomMaterialsAndEquipment": {
                                    "type": "array",
                                    "minItems": 6,
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "LocalCommunityBasedResources": {
                                    "type": "array",
                                    "minItems": 3,
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "Location",
                                            "HowStudentsEngage",
                                            "WhyRelevant"
                                        ],
                                        "properties": {
                                            "Location": {
                                                "type": "string"
                                            },
                                            "HowStudentsEngage": {
                                                "type": "string"
                                            },
                                            "WhyRelevant": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "DigitalToolsAndOnlineResources": {
                                    "type": "array",
                                    "minItems": 4,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "TechnologyIntegration": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": [
                                "TechnologyForResearchAndInformation",
                                "TechnologyForModelingAndVisualRepresentation",
                                "TechnologyForCollaborationAndDiscourse",
                                "TechnologyForCreatingAndPresentingFinalProduct",
                                "EquityAndAccessibilityConsiderations"
                            ],
                            "properties": {
                                "TechnologyForResearchAndInformation": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "ToolName",
                                            "HowStudentsUseIt",
                                            "ConnectionToProject",
                                            "ISTEStandard"
                                        ],
                                        "properties": {
                                            "ToolName": {
                                                "type": "string"
                                            },
                                            "HowStudentsUseIt": {
                                                "type": "string"
                                            },
                                            "ConnectionToProject": {
                                                "type": "string"
                                            },
                                            "ISTEStandard": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "TechnologyForModelingAndVisualRepresentation": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "ToolName",
                                            "HowStudentsUseIt",
                                            "ConnectionToProject",
                                            "ISTEStandard"
                                        ],
                                        "properties": {
                                            "ToolName": {
                                                "type": "string"
                                            },
                                            "HowStudentsUseIt": {
                                                "type": "string"
                                            },
                                            "ConnectionToProject": {
                                                "type": "string"
                                            },
                                            "ISTEStandard": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "TechnologyForCollaborationAndDiscourse": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "ToolName",
                                            "HowStudentsUseIt",
                                            "ConnectionToProject",
                                            "ISTEStandard"
                                        ],
                                        "properties": {
                                            "ToolName": {
                                                "type": "string"
                                            },
                                            "HowStudentsUseIt": {
                                                "type": "string"
                                            },
                                            "ConnectionToProject": {
                                                "type": "string"
                                            },
                                            "ISTEStandard": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "TechnologyForCreatingAndPresentingFinalProduct": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "ToolName",
                                            "HowStudentsUseIt",
                                            "ConnectionToProject",
                                            "ISTEStandard"
                                        ],
                                        "properties": {
                                            "ToolName": {
                                                "type": "string"
                                            },
                                            "HowStudentsUseIt": {
                                                "type": "string"
                                            },
                                            "ConnectionToProject": {
                                                "type": "string"
                                            },
                                            "ISTEStandard": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "EquityAndAccessibilityConsiderations": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "x-removablePaths": {
        "AssessPriorKnowledge": [
            "UnitPlan.AssessPriorKnowledge"
        ],
        "FormativeAssessment": [
            "UnitPlan.AssessmentPlan.FormativeAssessmentTable"
        ],
        "StandardsAligned": [
            "UnitPlan.FramingTheLearning.KeyVocabulary.Tiers.Terms.StandardsConnection",
            "UnitPlan.DesiredOutcomes.StandardsAligned"
        ],
        "AccommodationsAndModifications": [
            "UnitPlan.TeacherGuidancePhase1.Phase1_Accommodations_IndividualSupport",
            "UnitPlan.TeacherGuidancePhase2.Phase2_Accommodations_IndividualSupport",
            "UnitPlan.TeacherGuidancePhase3.Phase3_Accommodations_IndividualSupport"
        ],
        "EssentialQuestions": [
            "UnitPlan.DesiredOutcomes.BigIdeasAndEssentialQuestions.EssentialQuestion"
        ],
        "SpacedLearningAndRetrieval": [
            "UnitPlan.TeacherGuidancePhase1.Phase1_SpacedRetrieval",
            "UnitPlan.TeacherGuidancePhase2.Phase2_SpacedRetrieval",
            "UnitPlan.TeacherGuidancePhase3.Phase3_SpacedRetrieval"
        ]
    }
}


window.pblPrompts_sr = {
  defaultPrompt,
  unitDescriptionHtmlPrompt,
  assessPriorKnowledgeHtmlPrompt,
  unitOverviewHtmlPrompt,
  desiredOutcomesHtmlPrompt,
  framingTheProjectHtmlPrompt,
  assesmentPlanHtmlPrompt,
  learningPlanHtmlPrompt,
  teacherGuidancePhase1HtmlPrompt,
  teacherGuidancePhase2HtmlPrompt,
  teacherGuidancePhase3HtmlPrompt,
  unitPreparationAndConsiderationsHtmlPrompt,
  pblResponseSchema,
};

  return {
    defaultPrompt,
    unitDescriptionHtmlPrompt,
    assessPriorKnowledgeHtmlPrompt,
    unitOverviewHtmlPrompt,
    desiredOutcomesHtmlPrompt,
    framingTheProjectHtmlPrompt,
    assesmentPlanHtmlPrompt,
    learningPlanHtmlPrompt,
    teacherGuidancePhase1HtmlPrompt,
    teacherGuidancePhase2HtmlPrompt,
    teacherGuidancePhase3HtmlPrompt,
    unitPreparationAndConsiderationsHtmlPrompt,
    pblResponseSchema,
  };
})();