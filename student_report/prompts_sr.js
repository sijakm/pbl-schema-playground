/**
 * Prompt Šablon za Izveštaj o Učeniku (Povratna Informacija)
 * Cleo: AI asistent za generisanje povratnih informacija.
 */

const STUDENT_REPORT_PROMPT_TEMPLATE_SR = `
Generišite povratnu informaciju od najviše 300 karaktera koristeći priložene podatke. (Koristićete ove informacije – ocene i komentare nastavnika na proverama, odgovore učenika, prisustvo.)

Povratna informacija treba da:
- Bude napisana u drugom licu, kao da se obraćate direktno učeniku.
- Sumira opšti angažman i trendove u postignuću (npr. stabilan napredak, nedavno poboljšanje ili pad).
- Istakne jednu vrlinu ili oblast uspeha specifičnu za ovaj kurs.
- Identifikuje jednu oblast za razvoj ili pruži konkretan savet za poboljšanje ili nastavak uspešnog rada.

Zahtevi za izlaz:
- BEZ HTML formatiranja.
- Isključivo običan tekst.
- Strogo ograničenje od 300 karaktera.

INFORMACIJE O UČENIKU:
{{$StudentInfo}}

KONTEKST SISTEMA OCENJIVANJA:
{{$GradingSystem}}

EVIDENCIJA PRISUSTVA:
{{$AttendanceData}}

OCENE:
{{$GradesData}}

KOMENTARI NASTAVNIKA, ODGOVORI NA PROVERAMA I TRENDOVI:
{{$QualitativeData}}
`;

const STUDENT_REPORT_SCHEMA_SR = {
  type: "object",
  properties: {
    feedback: {
      type: "string",
      description: "Generisana povratna informacija od Cleo, maks. 300 karaktera."
    }
  },
  required: ["feedback"],
  additionalProperties: false
};

window.studentReportPromptsSR = {
  STUDENT_REPORT_PROMPT_TEMPLATE_SR,
  STUDENT_REPORT_SCHEMA_SR
};
