import json

translations = {
    "StudentLearningObjective": {
        "sr-Latn": "Cilj učenja učenika",
        "sr-Cyrl": "Циљ учења ученика",
        "id": "Tujuan Pembelajaran Siswa",
        "es": "Objetivo de aprendizaje del estudiante",
        "ru": "Цель обучения студента"
    },
    "AlignedAssessmentEvidenceAndCriteriaForSuccess": {
        "sr-Latn": "Usklađeno ocenjivanje/dokazi i kriterijumi za uspeh",
        "sr-Cyrl": "Усклађено оцењивање/докази и критеријуми за успех",
        "id": "Penilaian/Bukti yang Selaras & Kriteria Keberhasilan",
        "es": "Evaluación/evidencia alineada y criterios de éxito",
        "ru": "Согласованная оценка/доказательства и критерии успеха"
    },
    "PlacePurposeValue": {
        "sr-Latn": "Da bi se identifikovali specifični konteksti zajednice, fizičke lokacije i autentična publika koji će produbiti relevantnost za učenike, ojačati problem iz stvarnog sveta u centru nastavne jedinice i informisati ciljana iskustva učenja — kao što su terenski rad, lokalna partnerstva i javne prezentacije — tako da projekat ostane utemeljen na stvarnom mestu gde učenici žive, uče i dizajniraju rešenja.",
        "sr-Cyrl": "Да би се идентификовали специфични контексти заједнице, физичке локације и аутентична публика који ће продубити релевантност за ученике, ојачати проблем из стварног света у центру наставне јединице и информисати циљана искуства учења — као што су теренски рад, локална партнерства и јавне презентације — тако да пројекат остане утемељен на стварном месту где ученици живе, уче и дизајнирају решења.",
        "id": "Untuk mengidentifikasi konteks komunitas tertentu, lokasi fisik, dan audiens autentik yang akan memperdalam relevansi siswa, memperkuat masalah dunia nyata di pusat unit, dan menginformasikan pengalaman pembelajaran yang ditargetkan—seperti kerja lapangan, kemitraan lokal, dan presentasi publik—sehingga proyek tetap didasarkan pada tempat nyata di mana siswa hidup, belajar, dan merancang solusi.",
        "es": "Identificar los contextos comunitarios específicos, las ubicaciones físicas y el público auténtico que profundizarán la relevancia para los estudiantes, fortalecerán el problema del mundo real en el centro de la unidad e informarán las experiencias de aprendizaje específicas —como el trabajo de campo, las asociaciones locales y las presentaciones públicas— de modo que el proyecto siga basándose en el lugar real donde los estudiantes viven, aprenden y diseñan soluciones.",
        "ru": "Для определения конкретных контекстов сообщества, физических мест и подлинной аудитории, которые углубят актуальность для учащихся, усилят реальную проблему в центре учебного модуля и послужат основой для целенаправленного обучения — например, полевых работ, местного партнерства и публичных презентаций — чтобы проект оставался основанным на реальном месте, где учащиеся живут, учатся и разрабатывают решения."
    },
    "StudentsWillBeAbleToLabel": {
        "sr-Latn": "Učenici će biti u stanju da...",
        "sr-Cyrl": "Ученици ће бити у стању да...",
        "id": "Siswa akan dapat...",
        "es": "Los estudiantes podrán...",
        "ru": "Учащиеся смогут..."
    },
    "AuthenticAudiencePurposeValue": {
        "sr-Latn": "Da bi se identifikovala i angažovala autentična publika van učionice koja produbljuje relevantnost i uticaj rada učenika u stvarnom svetu, istovremeno osnažujući učenike da učestvuju u izboru zainteresovanih strana, stručnjaka ili članova zajednice čije učešće poboljšava vlasništvo, motivaciju i kvalitet konačnih rezultata.",
        "sr-Cyrl": "Да би се идентификовала и ангажовала аутентична публика ван учионице која продубљује релевантност и утицај рада ученика у стварном свету, истовремено оснажујући ученике да учествују у избору заинтересованих страна, стручњака или чланова заједнице чије учешће побољшава власништво, мотивацију и квалитет коначних резултата.",
        "id": "Untuk mengidentifikasi dan melibatkan audiens autentik di luar kelas yang memperdalam relevansi dan dampak dunia nyata dari pekerjaan siswa, sambil memberdayakan siswa untuk berpartisipasi dalam memilih pemangku kepentingan, pakar, atau anggota komunitas yang keterlibatannya meningkatkan rasa kepemilikan, motivasi, dan kualitas hasil akhir.",
        "es": "Identificar e involucrar a un público auténtico más allá del aula que profundice la relevancia y el impacto en el mundo real del trabajo de los estudiantes, al mismo tiempo que empodera a los estudiantes para participar en la selección de partes interesadas, expertos o miembros de la comunidad cuya participación mejora la apropiación, la motivación y la calidad de los entregables finales.",
        "ru": "Выявить и привлечь реальную аудиторию за пределами класса, что углубляет актуальность и влияние студенческой работы в реальном мире, одновременно давая учащимся возможность участвовать в выборе заинтересованных сторон, экспертов или членов сообщества, чье участие повышает ответственность, мотивацию и качество конечных результатов."
    },
    "StudentParticipationInAudienceSelection": {
        "sr-Latn": "Učešće učenika u izboru publike",
        "sr-Cyrl": "Учешће ученика у избору публике",
        "id": "Partisipasi Siswa dalam Pemilihan Audiens",
        "es": "Participación de los estudiantes en la selección de la audiencia",
        "ru": "Участие студентов в выборе аудитории"
    },
    "StudentsWillKnowThatLabel": {
        "sr-Latn": "Učenici će znati da...",
        "sr-Cyrl": "Ученици ће знати да...",
        "id": "Siswa akan tahu bahwa...",
        "es": "Los estudiantes sabrán que...",
        "ru": "Учащиеся будут знать, что..."
    },
    "FormativeAssessmentRubric": {
        "sr-Latn": "Rubrika formativnog ocenjivanja",
        "sr-Cyrl": "Рубрика формативног оцењивања",
        "id": "Rubrik Penilaian Formatif",
        "es": "Rúbrica de evaluación formativa",
        "ru": "Рубрика формативного оценивания"
    },
    "BigIdeasAndEssentialQuestionsAmp": {
        "sr-Latn": "Velike ideje i suštinska pitanja",
        "sr-Cyrl": "Велике идеје и суштинска питања",
        "id": "Ide Besar & Pertanyaan Esensial",
        "es": "Grandes ideas y preguntas esenciales",
        "ru": "Большие идеи и ключевые вопросы"
    },
    "AlignedAssessmentPurposeValue": {
        "sr-Latn": "Da bi se osiguralo da su sve procene i kriterijumi uspeha namerno i transparentno usklađeni sa ciljevima učenja nastavne jedinice, pružajući tačne mere razumevanja učenika, istovremeno stvarajući mogućnosti za učenike da ko-konstruišu kriterijume sa nastavnikom - čime se povećava jasnoća, vlasništvo i samoregulacija dok rade ka visokokvalitetnim ishodima zasnovanim na standardima.",
        "sr-Cyrl": "Да би се осигурало да су све процене и критеријуми успеха намерно и транспарентно усклађени са циљевима учења наставне јединице, пружајући тачне мере разумевања ученика, истовремено стварајући могућности за ученике да ко-конструишу критеријуме са наставником - чиме се повећава јасноћа, власништво и саморегулација док раде ка висококвалитетним исходима заснованим на стандардима.",
        "id": "Untuk memastikan bahwa semua penilaian dan kriteria keberhasilan secara sengaja dan transparan diselaraskan dengan tujuan pembelajaran unit, memberikan ukuran yang akurat tentang pemahaman siswa sambil menciptakan peluang bagi siswa untuk menyusun kriteria bersama dengan guru—sehingga meningkatkan kejelasan, kepemilikan, dan pengaturan diri saat mereka bekerja menuju hasil yang berkualitas tinggi dan berbasis standar.",
        "es": "Asegurar que todas las evaluaciones y criterios de éxito estén alineados intencional y transparentemente con los objetivos de aprendizaje de la unidad, proporcionando medidas precisas de la comprensión de los estudiantes y creando oportunidades para que co-construyan criterios con el maestro, aumentando así la claridad, la apropiación y la autorregulación mientras trabajan hacia resultados de alta calidad basados en estándares.",
        "ru": "Убедиться, что все оценки и критерии успеха намеренно и прозрачно согласованы с целями обучения модуля, обеспечивая точные показатели понимания учащихся и создавая возможности для совместного с учителем определения критериев — тем самым повышая ясность, ответственность и саморегуляцию по мере их продвижения к высококачественным результатам, основанным на стандартах."
    },
    "EssentialQuestionLabel": {
        "sr-Latn": "Suštinsko pitanje:",
        "sr-Cyrl": "Суштинско питање:",
        "id": "Pertanyaan Esensial:",
        "es": "Pregunta esencial:",
        "ru": "Ключевой вопрос:"
    },
    "Practitioner": {
        "sr-Latn": "Praktičar",
        "sr-Cyrl": "Практичар",
        "id": "Praktisi",
        "es": "Profesional",
        "ru": "Практик"
    },
    "Novice": {
        "sr-Latn": "Početnik",
        "sr-Cyrl": "Почетник",
        "id": "Pemula",
        "es": "Principiante",
        "ru": "Новичок"
    },
    "PointOfDemonstration": {
        "sr-Latn": "Tačka demonstracije",
        "sr-Cyrl": "Тачка демонстрације",
        "id": "Titik Demonstrasi",
        "es": "Punto de demostración",
        "ru": "Точка демонстрации"
    },
    "ProblemPurposeValue": {
        "sr-Latn": "Da se jasno artikuliše fokusiran, visoko uticajan problem iz stvarnog sveta koji učvršćuje nastavnu jedinicu, vodi učenike ka razvoju smislenog rešenja i omogućava nastavnicima da identifikuju autentičnu publiku i kontekste koji transformišu projekat iz teorijske studije u svrsishodan, primenljiv rad sa opipljivom relevantnošću.",
        "sr-Cyrl": "Да се јасно артикулише фокусиран, високо утицајан проблем из стварног света који учвршћује наставну јединицу, води ученике ка развоју смисленог решења и омогућава наставницима да идентификују аутентичну публику и контексте који трансформишу пројекат из теоријске студије у сврсисходни, применљиви рад са опипљивом релевантношћу.",
        "id": "Untuk mengartikulasikan dengan jelas masalah dunia nyata yang terfokus dan berdampak tinggi yang menjadi jangkar unit, memandu siswa menuju pengembangan solusi yang bermakna, dan memungkinkan guru untuk mengidentifikasi audiens dan konteks autentik yang mengubah proyek dari studi teoretis menjadi pekerjaan yang bertujuan dan dapat ditindaklanjuti dengan relevansi yang nyata.",
        "es": "Articular claramente un problema del mundo real enfocado y de alto impacto que ancle la unidad, guíe a los estudiantes hacia el desarrollo de soluciones significativas y permita a los maestros identificar audiencias y contextos auténticos que transformen el proyecto de un estudio teórico en un trabajo con propósito y procesable con relevancia tangible.",
        "ru": "Четко сформулировать целенаправленную, высокоэффективную проблему реального мира, которая закрепляет учебный модуль, направляет учащихся к разработке осмысленного решения и позволяет учителям определять подлинную аудиторию и контексты, которые превращают проект из теоретического исследования в целенаправленную, практически применимую работу с ощутимой актуальностью."
    },
    "Apprentice": {
        "sr-Latn": "Šegrt",
        "sr-Cyrl": "Шегрт",
        "id": "Peserta magang",
        "es": "Aprendiz",
        "ru": "Ученик"
    },
    "StudentsWillUnderstandThatLabel": {
        "sr-Latn": "Učenici će razumeti da...",
        "sr-Cyrl": "Ученици ће разумети да...",
        "id": "Siswa akan memahami bahwa...",
        "es": "Los estudiantes entenderán que...",
        "ru": "Учащиеся поймут, что..."
    },
    "BigIdeasPurpose": {
        "sr-Latn": "Da se uspostave široki, trajni koncepti koji učvršćuju ishode učenja nastavne jedinice, usmeravaju razvoj suštinskih pitanja i procena, i pružaju učenicima sveobuhvatne okvire koji povezuju sve zadatke, veštine i aktivnosti u smisleno, prenosivo razumevanje.",
        "sr-Cyrl": "Да се успоставе широки, трајни концепти који учвршћују исходе учења наставне јединице, усмеравају развој суштинских питања и процена, и пружају ученицима свеобухватне оквире који повезују све задатке, вештине и активности у смислено, преносиво разумевање.",
        "id": "Untuk menetapkan konsep yang luas dan bertahan lama yang melabuhkan hasil pembelajaran unit, memandu pengembangan pertanyaan dan penilaian esensial, dan memberi siswa kerangka kerja menyeluruh yang menghubungkan semua tugas, keterampilan, dan aktivitas menjadi pemahaman yang bermakna dan dapat ditransfer.",
        "es": "Establecer los conceptos amplios y duraderos que anclan los resultados de aprendizaje de la unidad, guían el desarrollo de preguntas y evaluaciones esenciales, y brindan a los estudiantes marcos generales que conectan todas las tareas, habilidades y actividades en una comprensión significativa y transferible.",
        "ru": "Установить широкие, устойчивые концепции, которые закрепляют результаты обучения модуля, направляют разработку ключевых вопросов и оценок, и предоставляют учащимся общие рамки, соединяющие все задачи, навыки и действия в осмысленное, переносимое понимание."
    },
    "DrivingQuestionPurposeValue": {
        "sr-Latn": "Da se obezbedi jasna, čvrsto usklađena fokalna tačka koja učvršćuje osnovni problem nastavne jedinice, usmerava istraživanje učenika ka specifičnom znanju i veštinama koje moraju da razviju i osigurava da sav projektni rad—uključujući istraživanje, modelovanje i primenu—koherentno doprinosi odgovoru na smisleno pitanje iz stvarnog sveta.",
        "sr-Cyrl": "Да се обезбеди јасна, чврсто усклађена фокална тачка која учвршћује основни проблем наставне јединице, усмерава истраживање ученика ка специфичном знању и вештинама које морају да развију и осигурава да сав пројектни рад—укључујући истраживање, моделовање и примену—кохерентно доприноси одговору на смислено питање из стварног света.",
        "id": "Untuk memberikan titik fokus yang jelas dan selaras erat yang melabuhkan masalah inti unit, mengarahkan penyelidikan siswa menuju pengetahuan dan keterampilan spesifik yang harus mereka kembangkan, dan memastikan bahwa semua pekerjaan proyek—termasuk penyelidikan, pemodelan, dan aplikasi—secara koheren berkontribusi untuk menjawab pertanyaan dunia nyata yang bermakna.",
        "es": "Proporcionar un punto focal claro y estrechamente alineado que ancle el problema central de la unidad, dirija la investigación de los estudiantes hacia el conocimiento y las habilidades específicas que deben desarrollar y garantice que todo el trabajo del proyecto, incluida la investigación, el modelado y la aplicación, contribuya coherentemente a responder una pregunta significativa del mundo real.",
        "ru": "Обеспечить четкий, тесно согласованный фокус, который закрепляет основную проблему модуля, направляет исследования учащихся на конкретные знания и навыки, которые они должны развить, и гарантирует, что вся проектная работа — включая исследования, моделирование и применение — последовательно способствует ответу на значимый вопрос реального мира."
    },
    "BigIdeaLabel": {
        "sr-Latn": "Velika ideja:",
        "sr-Cyrl": "Велика идеја:",
        "id": "Ide Besar:",
        "es": "Gran idea:",
        "ru": "Большая идея:"
    },
    "Expert": {
        "sr-Latn": "Stručnjak",
        "sr-Cyrl": "Стручњак",
        "id": "Ahli",
        "es": "Experto",
        "ru": "Эксперт"
    },
    "PurposeLabel": {
        "sr-Latn": "Svrha:",
        "sr-Cyrl": "Сврха:",
        "id": "Tujuan:",
        "es": "Propósito:",
        "ru": "Цель:"
    },
    "ProjectPurposeValue": {
        "sr-Latn": "Da bi se objasnilo kako će se učenici aktivno uključiti u jasno definisan, lokalno relevantan problem kroz strukturisanu, ali fleksibilnu putanju projekta koja balansira izbor učenika sa zajedničkim fokusom, osigurava dosledne mogućnosti da se razmišljanje učini vidljivim i pruža neophodne skele učenicima da razviju, preciziraju i implementiraju sopstvena rešenja zasnovana na dokazima.",
        "sr-Cyrl": "Да би се објаснило како ће се ученици активно укључити у јасно дефинисан, локално релевантан проблем кроз структурисану, али флексибилну путању пројекта која балансира избор ученика са заједничким фокусом, осигурава доследне могућности да се размишљање учини видљивим и пружа неопходне скеле ученицима да развију, прецизирају и имплементирају сопствена решења заснована на доказима.",
        "id": "Untuk menguraikan bagaimana siswa akan secara aktif terlibat dengan masalah yang terdefinisi dengan jelas dan relevan secara lokal melalui jalur proyek yang terstruktur namun fleksibel yang menyeimbangkan pilihan siswa dengan fokus bersama, memastikan peluang yang konsisten untuk membuat pemikiran terlihat, dan memberikan perancah yang diperlukan bagi siswa untuk mengembangkan, menyempurnakan, dan menerapkan solusi berbasis bukti mereka sendiri.",
        "es": "Describir cómo los estudiantes participarán activamente en un problema claramente definido y localmente relevante a través de una ruta de proyecto estructurada pero flexible que equilibra la elección del estudiante con el enfoque compartido, garantiza oportunidades constantes para hacer visible el pensamiento y proporciona los andamiajes necesarios para que los estudiantes desarrollen, perfeccionen e implementen sus propias soluciones basadas en evidencia.",
        "ru": "Описать, как учащиеся будут активно заниматься четко определенной, локально значимой проблемой с помощью структурированной, но гибкой траектории проекта, которая уравновешивает выбор учащихся с общим фокусом, обеспечивает постоянные возможности сделать мышление видимым и предоставляет необходимые опоры для разработки, совершенствования и внедрения собственных решений, основанных на фактических данных."
    },
    "PBLAssessPriorKnowledgePurposeText": {
        "sr-Latn": "Svrha: Aktiviranje prethodnog znanja učenika nije samo zagrevanje — to je primenjena neuronauka. Kada se učenici prisete onoga što već veruju ili pamte, oni aktiviraju postojeće neuronske puteve. Ovo „elaborativno kodiranje“ olakšava mozgu da poveže nove koncepte sa onim što je već poznato, jačajući dugoročno zadržavanje. Ova aktivnost vam pomaže da otkrijete tačne ideje, delimične ideje i zablude koje će postati moćna sidra za učenje tokom čitavog projekta.",
        "sr-Cyrl": "Сврха: Активирање претходног знања ученика није само загревање — то је примењена неуронаука. Када се ученици присете онога што већ верују или памте, они активирају постојеће неуронске путеве. Ово „елаборативно кодирање“ олакшава мозгу да повеже нове концепте са оним што је већ познато, јачајући дугорочно задржавање. Ова активност вам помаже да откријете тачне идеје, делимичне идеје и заблуде које ће постати моћна сидра за учење током читавог пројекта.",
        "id": "Tujuan: Mengaktifkan pengetahuan awal siswa bukan hanya pemanasan—ini adalah aksi ilmu saraf. Saat siswa mengingat kembali apa yang sudah mereka yakini atau ingat tentang materi, mereka mengaktifkan jalur saraf yang ada. \"Pengodean elaboratif\" ini memudahkan otak untuk menghubungkan konsep baru dengan apa yang sudah diketahui, memperkuat retensi jangka panjang. Aktivitas ini membantu Anda mengungkap ide akurat, ide parsial, dan miskonsepsi yang akan menjadi jangkar kuat untuk pembelajaran di sepanjang proyek.",
        "es": "Propósito: Activar los conocimientos previos de los estudiantes no es solo un calentamiento, es neurociencia en acción. Cuando los estudiantes recuerdan lo que ya creen o recuerdan, activan las vías neuronales existentes. Esta \"codificación elaborativa\" facilita que el cerebro conecte nuevos conceptos con lo que ya se sabe, fortaleciendo la retención a largo plazo. Esta actividad le ayuda a descubrir ideas precisas, ideas parciales y conceptos erróneos que se convertirán en anclajes poderosos para el aprendizaje durante todo el proyecto.",
        "ru": "Цель: Активация предшествующих знаний учащихся — это не просто разминка, это нейронаука в действии. Когда учащиеся вспоминают то, во что они уже верят или что помнят, они активизируют существующие нейронные связи. Это «элаборативное кодирование» облегчает мозгу связывание новых концепций с тем, что уже известно, укрепляя долговременное запоминание. Это упражнение помогает вам выявить точные идеи, частичные идеи и заблуждения, которые станут мощными якорями для обучения на протяжении всего проекта."
    },
    "Criterion": {
        "sr-Latn": "Kriterijum",
        "sr-Cyrl": "Критеријум",
        "id": "Kriteria",
        "es": "Criterio",
        "ru": "Критерий"
    },
    "DOK": {
        "id": "DOK (Kedalaman Pengetahuan)",
        "es": "DOK (Profundidad de conocimiento)",
        "ru": "DOK (Глубина знаний)"
    },
    "Roles": {
        "es": "Roles"
    },
    "BeginningOfPhase": {
        "id": "Awal Fase",
        "es": "Inicio de la Fase",
        "ru": "Начало фазы"
    },
    "MidPhase": {
        "id": "Pertengahan Fase",
        "es": "Mitad de la Fase",
        "ru": "Середина фазы"
    },
    "EndOfPhase": {
        "id": "Akhir Fase",
        "es": "Fin de la Fase",
        "ru": "Конец фазы"
    },
    "DrawsFrom": {
        "id": "Berasal Dari",
        "es": "Basado en",
        "ru": "Основано на"
    },
    "ArtifactsOfLearning": {
        "id": "Artefak Pembelajaran",
        "es": "Artefactos de aprendizaje",
        "ru": "Артефакты обучения"
    },
    "Phase1Title": {
        "id": "Fase 1 - Peluncuran",
        "es": "Fase 1 - Lanzamiento",
        "ru": "Фаза 1 - Запуск"
    },
    "Phase2Title": {
        "id": "Fase 2 - Eksplorasi, Investigasi, dan Pengembangan; Penyempurnaan",
        "es": "Fase 2 - Exploración, investigación y desarrollo; Perfeccionamiento",
        "ru": "Фаза 2 - Исследование, изучение и разработка; Доработка"
    },
    "Phase3Title": {
        "id": "Fase 3 - Produksi dan Presentasi",
        "es": "Fase 3 - Producción y presentación",
        "ru": "Фаза 3 - Производство и презентация"
    },
    "TeacherRole": {
        "id": "Peran Guru",
        "es": "Rol del profesor",
        "ru": "Роль учителя"
    },
    "StudentExperience": {
        "id": "Pengalaman Siswa",
        "es": "Experiencia del estudiante",
        "ru": "Студенческий опыт"
    }
}

with open("translations.json", "r") as f:
    data = json.load(f)

for eng_key, langs in translations.items():
    for lang, translated_val in langs.items():
        if lang in data:
            data[lang][eng_key] = translated_val

# Also ensure that missing keys are at least initialized if they weren't in the dict
en_keys = data["en"].keys()
for lang in data:
    if lang == "en": continue
    for k in en_keys:
        if k not in data[lang]:
            data[lang][k] = data["en"][k] # Fallback just in case

with open("translations.json", "w", encoding='utf8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("Translations updated successfully.")
