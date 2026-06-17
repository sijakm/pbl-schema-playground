import json

with open("SharedGeneratorApi/translations.json", "r", encoding="utf-8") as f:
    translations = json.load(f)

text_en = "Purpose: Activating students’ prior knowledge isn’t just a warm-up—it’s neuroscience in action. When students recall what they already believe or remember about materials, particles, or chemical changes, they activate existing neural pathways. This “elaborative encoding” makes it easier for the brain to connect new chemistry concepts to what is already known, strengthening long-term retention. This activity helps you uncover accurate ideas, partial ideas, and misconceptions that will become powerful anchors for learning throughout the project."

# In a real scenario we would translate this, but for now we'll put the English text in all or translate them if possible.
# Wait, I can translate it using simple text replacement or just paste the English text for all. The user provided the English text.
# Let's translate it roughly, or just copy it. Usually we just put the English text and they fix it later, or I can provide translations.

translations_dict = {
    "en": text_en,
    "bs": "Svrha: Aktiviranje prethodnog znanja učenika nije samo zagrevanje — to je primenjena neuronauka. Kada se učenici prisete onoga što već veruju ili znaju o materijalima, česticama ili hemijskim promenama, oni aktiviraju postojeće neuronske puteve. Ovo \"elaborativno kodiranje\" olakšava mozgu da poveže nove hemijske koncepte sa onim što je već poznato, jačajući dugoročno zadržavanje. Ova aktivnost vam pomaže da otkrijete tačne ideje, delimične ideje i zablude koje će postati snažna sidra za učenje tokom projekta.",
    "sr": "Сврха: Активирање претходног знања ученика није само загревање — то је примењена неуронаука. Када се ученици присете онога што већ верују или знају о материјалима, честицама или хемијским променама, они активирају постојеће неуронске путеве. Ово \"елаборативно кодирање\" олакшава мозгу да повеже нове хемијске концепте са оним што је већ познато, јачајући дугорочно задржавање. Ова активност вам помаже да откријете тачне идеје, делимичне идеје и заблуде које ће постати снажна сидра за учење током пројекта.",
    "id": "Tujuan: Mengaktifkan pengetahuan awal siswa bukan sekadar pemanasan — ini adalah aksi neurosains. Ketika siswa mengingat apa yang sudah mereka yakini atau ingat tentang materi, partikel, atau perubahan kimia, mereka mengaktifkan jalur saraf yang ada. \"Pengodean elaboratif\" ini memudahkan otak untuk menghubungkan konsep kimia baru dengan apa yang sudah diketahui, memperkuat retensi jangka panjang. Aktivitas ini membantu Anda mengungkap ide akurat, ide parsial, dan miskonsepsi yang akan menjadi jangkar kuat untuk pembelajaran di sepanjang proyek.",
    "es": "Propósito: Activar el conocimiento previo de los estudiantes no es solo un calentamiento, es neurociencia en acción. Cuando los estudiantes recuerdan lo que ya creen o recuerdan sobre materiales, partículas o cambios químicos, activan vías neuronales existentes. Esta \"codificación elaborativa\" facilita que el cerebro conecte nuevos conceptos químicos con lo que ya se sabe, fortaleciendo la retención a largo plazo. Esta actividad lo ayuda a descubrir ideas precisas, ideas parciales y conceptos erróneos que se convertirán en poderosos anclajes para el aprendizaje durante todo el proyecto.",
    "ru": "Цель: Активация предшествующих знаний учеников — это не просто разминка, это нейробиология в действии. Когда ученики вспоминают то, во что они уже верят или помнят о материалах, частицах или химических изменениях, они активируют существующие нейронные пути. Это «элаборативное кодирование» облегчает мозгу привязку новых химических концепций к тому, что уже известно, укрепляя долговременное запоминание. Эта активность помогает вам выявить точные идеи, частичные идеи и заблуждения, которые станут мощными якорями для обучения на протяжении всего проекта."
}

for lang in translations:
    translations[lang]["PBLAssessPriorKnowledgePurposeText"] = translations_dict.get(lang, text_en)

with open("SharedGeneratorApi/translations.json", "w", encoding="utf-8") as f:
    json.dump(translations, f, indent=2, ensure_ascii=False)
