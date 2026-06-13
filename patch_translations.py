import json

with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/SharedGeneratorApi/translations.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

additions = {
    "en": {
        "OrientationPhasePurpose": "**Purpose:** Students are introduced to a real mystery that sparks curiosity and motivates investigation. They recognize the problem and activate prior knowledge to prepare for deeper inquiry.",
        "ConceptualizationPhasePurpose": "**Purpose:** Students generate meaningful research questions, select a central question to investigate, and create an action plan that will guide their inquiry process.",
        "InvestigationPhasePurpose": "**Purpose:** Students actively explore the phenomenon through observation, model analysis, and evidence collection, building a data set they will later use to form conclusions.",
        "ConclusionPhasePurpose": "**Purpose:** Students analyze their collected data and use evidence to answer the research question, forming a clear explanation based on their findings.",
        "DiscussionPhasePurpose": "**Purpose:** Help students shift from what they figured out to why it matters.",
        "EngageTitle": "Engage – Introduce the phenomenon in a way that sparks curiosity without explaining it.",
        "ConnectTitle": "Connect – Help students link their observations to the broader mystery that will anchor the investigation.",
        "ActivateTitle": "Activate – Shift students into collaborative sensemaking.",
        "ProbeTitle": "Probe – Encourage refinement of thinking by pushing students to examine assumptions.",
        "FacilitationMovesLabel": "Facilitation Moves:",
        "PromptWithQuestionsSuchAs": "Prompt with questions such as",
        "Say": "Say"
    },
    "sr-Latn": {
        "OrientationPhasePurpose": "**Svrha:** Učenici se upoznaju sa pravom misterijom koja budi radoznalost i motiviše ih na istraživanje. Oni prepoznaju problem i aktiviraju prethodno znanje kako bi se pripremili za dublje istraživanje.",
        "ConceptualizationPhasePurpose": "**Svrha:** Učenici generišu smislena istraživačka pitanja, biraju centralno pitanje za istraživanje i kreiraju akcioni plan koji će voditi njihov proces.",
        "InvestigationPhasePurpose": "**Svrha:** Učenici aktivno istražuju fenomen kroz posmatranje, analizu modela i prikupljanje dokaza, formirajući skup podataka koji će kasnije koristiti za izvođenje zaključaka.",
        "ConclusionPhasePurpose": "**Svrha:** Učenici analiziraju prikupljene podatke i koriste dokaze kako bi odgovorili na istraživačko pitanje, formirajući jasno objašnjenje na osnovu svojih nalaza.",
        "DiscussionPhasePurpose": "**Svrha:** Pomoći učenicima da pređu sa onoga što su otkrili na to zašto je to važno.",
        "EngageTitle": "Engage – Predstavite fenomen na način koji budi radoznalost bez objašnjavanja.",
        "ConnectTitle": "Connect – Pomozite učenicima da povežu svoja zapažanja sa širom misterijom koja će biti osnova istraživanja.",
        "ActivateTitle": "Activate – Prebacite učenike u saradničko osmišljavanje.",
        "ProbeTitle": "Probe – Podstaknite usavršavanje razmišljanja podstičući učenike da preispitaju pretpostavke.",
        "FacilitationMovesLabel": "Potezi fasilitacije:",
        "PromptWithQuestionsSuchAs": "Postavite pitanja kao što su",
        "Say": "Recite"
    },
    "sr-Cyrl": {
        "OrientationPhasePurpose": "**Сврха:** Ученици се упознају са правом мистеријом која буди радозналост и мотивише их на истраживање. Они препознају проблем и активирају претходно знање како би се припремили за дубље истраживање.",
        "ConceptualizationPhasePurpose": "**Сврха:** Ученици генеришу смислена истраживачка питања, бирају централно питање за истраживање и креирају акциони план који ће водити њихов процес.",
        "InvestigationPhasePurpose": "**Сврха:** Ученици активно истражују феномен кроз посматрање, анализу модела и прикупљање доказа, формирајући скуп података који ће касније користити за извођење закључака.",
        "ConclusionPhasePurpose": "**Сврха:** Ученици анализирају прикупљене податке и користе доказе како би одговорили на истраживачко питање, формирајући јасно објашњење на основу својих налаза.",
        "DiscussionPhasePurpose": "**Сврха:** Помоћи ученицима да пређу са онога што су открили на то зашто је то важно.",
        "EngageTitle": "Engage – Представите феномен на начин који буди радозналост без објашњавања.",
        "ConnectTitle": "Connect – Помозите ученицима да повежу своја запажања са широм мистеријом која ће бити основа истраживања.",
        "ActivateTitle": "Activate – Пребаците ученике у сарадничко осмишљавање.",
        "ProbeTitle": "Probe – Подстакните усавршавање размишљања подстичући ученике да преиспитају претпоставке.",
        "FacilitationMovesLabel": "Потези фасилитације:",
        "PromptWithQuestionsSuchAs": "Поставите питања као што су",
        "Say": "Реците"
    },
    "id": {
        "OrientationPhasePurpose": "**Tujuan:** Siswa diperkenalkan pada misteri nyata yang memicu rasa ingin tahu dan memotivasi investigasi. Mereka mengenali masalah dan mengaktifkan pengetahuan sebelumnya untuk bersiap melakukan inkuiri yang lebih mendalam.",
        "ConceptualizationPhasePurpose": "**Tujuan:** Siswa menghasilkan pertanyaan penelitian yang bermakna, memilih pertanyaan sentral untuk diselidiki, dan membuat rencana aksi yang akan memandu proses inkuiri mereka.",
        "InvestigationPhasePurpose": "**Tujuan:** Siswa secara aktif mengeksplorasi fenomena melalui observasi, analisis model, dan pengumpulan bukti, membangun kumpulan data yang nantinya akan mereka gunakan untuk menarik kesimpulan.",
        "ConclusionPhasePurpose": "**Tujuan:** Siswa menganalisis data yang dikumpulkan dan menggunakan bukti untuk menjawab pertanyaan penelitian, membentuk penjelasan yang jelas berdasarkan temuan mereka.",
        "DiscussionPhasePurpose": "**Tujuan:** Membantu siswa beralih dari apa yang mereka temukan ke mengapa hal itu penting.",
        "EngageTitle": "Engage – Perkenalkan fenomena dengan cara yang memicu rasa ingin tahu tanpa menjelaskannya.",
        "ConnectTitle": "Connect – Bantu siswa menghubungkan pengamatan mereka dengan misteri yang lebih luas yang akan menjadi jangkar investigasi.",
        "ActivateTitle": "Activate – Arahkan siswa ke dalam pemahaman kolaboratif.",
        "ProbeTitle": "Probe – Dorong perbaikan pemikiran dengan mendorong siswa untuk memeriksa asumsi.",
        "FacilitationMovesLabel": "Langkah Fasilitasi:",
        "PromptWithQuestionsSuchAs": "Berikan prompt dengan pertanyaan seperti",
        "Say": "Katakan"
    },
    "es": {
        "OrientationPhasePurpose": "**Propósito:** Se presenta a los estudiantes un misterio real que despierta curiosidad y motiva la investigación. Reconocen el problema y activan conocimientos previos para prepararse para una indagación más profunda.",
        "ConceptualizationPhasePurpose": "**Propósito:** Los estudiantes generan preguntas de investigación significativas, seleccionan una pregunta central para investigar y crean un plan de acción que guiará su proceso de indagación.",
        "InvestigationPhasePurpose": "**Propósito:** Los estudiantes exploran activamente el fenómeno a través de la observación, el análisis de modelos y la recopilación de pruebas, creando un conjunto de datos que luego usarán para sacar conclusiones.",
        "ConclusionPhasePurpose": "**Propósito:** Los estudiantes analizan los datos recopilados y usan evidencia para responder la pregunta de investigación, formando una explicación clara basada en sus hallazgos.",
        "DiscussionPhasePurpose": "**Propósito:** Ayudar a los estudiantes a pasar de lo que descubrieron a por qué es importante.",
        "EngageTitle": "Engage – Introduzca el fenómeno de una manera que despierte la curiosidad sin explicarlo.",
        "ConnectTitle": "Connect – Ayude a los estudiantes a vincular sus observaciones con el misterio más amplio que anclará la investigación.",
        "ActivateTitle": "Activate – Lleve a los estudiantes hacia la creación de sentido colaborativo.",
        "ProbeTitle": "Probe – Fomente el refinamiento del pensamiento empujando a los estudiantes a examinar suposiciones.",
        "FacilitationMovesLabel": "Movimientos de Facilitación:",
        "PromptWithQuestionsSuchAs": "Indique con preguntas como",
        "Say": "Diga"
    },
    "ru": {
        "OrientationPhasePurpose": "**Цель:** Учащиеся знакомятся с реальной загадкой, которая пробуждает любопытство и мотивирует к исследованию. Они осознают проблему и активируют предшествующие знания, чтобы подготовиться к более глубокому исследованию.",
        "ConceptualizationPhasePurpose": "**Цель:** Учащиеся генерируют осмысленные исследовательские вопросы, выбирают центральный вопрос для исследования и создают план действий, который будет направлять их исследовательский процесс.",
        "InvestigationPhasePurpose": "**Цель:** Учащиеся активно исследуют явление посредством наблюдения, анализа моделей и сбора доказательств, создавая набор данных, который они позже будут использовать для формирования выводов.",
        "ConclusionPhasePurpose": "**Цель:** Учащиеся анализируют собранные данные и используют доказательства для ответа на исследовательский вопрос, формируя четкое объяснение на основе своих выводов.",
        "DiscussionPhasePurpose": "**Цель:** Помочь учащимся перейти от того, что они выяснили, к тому, почему это важно.",
        "EngageTitle": "Engage – Представьте явление так, чтобы вызвать любопытство, не объясняя его.",
        "ConnectTitle": "Connect – Помогите учащимся связать свои наблюдения с более широкой загадкой, которая ляжет в основу исследования.",
        "ActivateTitle": "Activate – Переключите учащихся на совместное осмысление.",
        "ProbeTitle": "Probe – Поощряйте уточнение мышления, побуждая учащихся проверять предположения.",
        "FacilitationMovesLabel": "Шаги фасилитации:",
        "PromptWithQuestionsSuchAs": "Задавайте вопросы, такие как",
        "Say": "Скажите"
    }
}

for lang, keys in additions.items():
    if lang in data:
        data[lang].update(keys)

with open('/Users/milansijak/Desktop/pegs_playground/pbl-schema-playground/SharedGeneratorApi/translations.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("translations updated")
