# Gestalt'ı kanıt sınıflarıyla denetleyip onaran skill kurun

Gestalt algı teorisi sabit bir "yedi yasa" listesi değildir: Wertheimer'ın 1923'te tanımladığı şey, öğelerin nasıl gruplandığını yönlendiren, birbirini destekleyen veya birbiriyle yarışan ve gücü değerlere bağlı olan faktörlerdir. Modern görme bilimi yakınlık ve benzerlik için ölçülebilir ve tekrarlanmış sonuçlar üretti, ama evrensel bir ilke sıralamasını, tam ön-dikkatli gruplamayı ve "1,5x boşluk" gibi arayüz kurallarını desteklemedi. Web tarafındaki en iyi nicel kanıt eski ve masaüstü odaklıdır; yapının aramayı hızlandırdığını gösterir, ama tek bir ilkenin modern bir web görevindeki etki büyüklüğünü vermez. Buna karşılık CSS ve tasarım sistemleri uygulanabilir karşılıklar sunar: `gap` katmanları, ortak bölge için yüzeyler, subgrid hizası, ortak hareket token'ları ve görsel grubu anlamsal olarak taşıyan `fieldset`, `nav` ve başlıklar. Tarayıcı ölçümü geometri ve stil **gerçeklerini** güvenilir biçimde saptar, ama bir gerçeğin Gestalt **ihlali** olması niyet bilgisi gerektirir. Bu yüzden doğru ürün, tek bir "Gestalt puanı" veren bir linter değil; normatif hata, ölçülmüş gerçek, aday bulgu ve yargıyı ayıran bir denetim motorudur. Önerilen dağıtım biçimi, `audit`, `generate` ve `fix` alt komutlarını tek yönlendirici `SKILL.md` altında toplayan, deterministik işleri (`install`, `detect`) bağımlılıksız bir Node CLI'ye bırakan ve `npx gestalt-skill` ile çalışan tek npm paketidir. Tüm eşikler kalibre edilene kadar danışma düzeyinde kalmalıdır; gerçek web sayfalarında insan algısına karşı doğrulanmış bir otomatik Gestalt dedektörü bu araştırmada bulunamadı.

## Bu rapordaki kanıt etiketleri iddianın gücünü sınırlar

Her önemli iddia iki eksende etiketlendi: kaynağın türü ve kaynağın bu araştırmada ne kadarının görüldüğü. Etiketler birbirinin yerine kullanılamaz: WCAG uyum zorunluluğu algısal etkinin kanıtı değildir, tasarım sistemi reçetesi de deney sonucu değildir.

| Etiket | Anlamı | Ne için kullanılabilir |
|---|---|---|
| **[HAKEMLİ]** | Dergi, konferans veya hakemli derleme bulgusu | Bilimsel iddia, ancak test edilen uyaran ve görevle sınırlı |
| **[ÖN BASKI/TEZ]** | arXiv kaydı, doktora tezi veya hakem durumu notlarda doğrulanmamış akademik çalışma | Yön gösterici kanıt |
| **[NORMATİF]** | WCAG ve teknikleri | Uyum gerçeği; algısal etki kanıtı değil |
| **[TASARIM SİSTEMİ]** | Material, Carbon, GOV.UK, Polaris ve benzerlerinin reçeteleri | Yerleşik uygulama; deneysel kanıt sayılmaz |
| **[SEKTÖR]** | NN/g, Baymard, UXmatters gibi uygulamalı gözlemler | Hata örüntüsü bulmak; etki büyüklüğü için değil |
| **[ARAÇ]** | Araç belgesi veya çıktısı | Aracın yaptığı iş; doğruluğu değil |
| **[MÜHENDİSLİK]** | Bu rapordaki sezgisel seçim veya çıkarım | Kalibre edilene kadar danışma düzeyinde |

Erişim düzeyi ayrıca belirtilir: **tam metin**, **derleme üzerinden** (Wagemans ve arkadaşlarının 2012 derlemesinin ilk yarısında okundu, özgün makale okunmadı), **özet** (yalnızca özet, katalog kaydı veya arama parçası) ve **ikincil** (başka bir kaynağın aktarımı). Sayfalar büyük ölçüde otomatik özetleyiciden geçerek okunduğu için kısa alıntılar basılmadan önce kaynağıyla karşılaştırılmalıdır.

## Wertheimer yasa listesi değil, rekabet eden faktörler tanımladı

Wertheimer'ın 1912 tarihli faz hareketi çalışması Gestalt psikolojisinin başlangıcı sayılır; yapılandırılmış bütünler duyumlardan önce gelen birimler olarak ele alınır **[HAKEMLİ · derleme üzerinden]** ([Wagemans vd. 2012 I](https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/)). Klasik gruplama faktörlerinin kaynağı 1923 makalesidir. 1938 İngilizce çevirisi yakınlık, benzerlik, "Uniform Destiny" (bugünkü ortak kader), nesnel hazırlık (objective set), yön, kapanış, "iyi eğri" ve geçmiş deneyimi adlandırır; "yasa" sözcüğü geçse de çalışma terimi "faktör"dür **[birincil kaynak · çeviri tam metin]** ([Wertheimer 1923/1938](https://psychclassics.yorku.ca/Wertheimer/Forms/forms.htm)). Daha önemlisi Wertheimer faktörlerin gücünü değiştirerek hangisinin kazandığını sınar ve belirli bir aralıkta **benzerliğin yakınlığa üstün geldiği** bir durum bildirir. Yani "yakınlık her zaman benzerliği yener" önermesi, teorinin kurucu metniyle bile çelişir.

Teorinin bütünleştirici fikri Prägnanz'dır: algı, koşulların izin verdiği en basit ve en kapsayıcı yapıyı alır **[HAKEMLİ · derleme üzerinden]** ([Wagemans vd. 2012 I](https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/)). Aynı derleme yaygın bir yanlışı da düzeltir: Gestalt teorisi özerk yasaları vurgulamış, ama tüm yasaların doğuştan olduğunu veya öğrenmenin rol oynamadığını öne sürmemiştir. Köhler'in elektriksel alan teorisi çürütülmüş, ön-dikkatli örgütlenme ise daha sonra nörofizyolojik destek bulmuştur. "Bütün, parçalarının toplamından büyüktür" sözünün yanlış alıntı olduğu kanısı yaygındır, fakat Koffka ve derlemenin II. bölümü okunamadığı için bu rapor bunu doğrulanmış sayamaz.

Sonraki ilkelerin adlı kaynakları vardır, ama bu kaynaklar çoğunlukla yalnızca özet düzeyinde görüldü. Ortak bölge Palmer'a (1992), tekdüze bağlılık ise Palmer ve Rock'a (1994) dayanır **[HAKEMLİ · özet]** ([Palmer vd. 2003 ve atıf yapan kayıtlar](https://palmerlab.berkeley.edu/pdf/PalmerBrooks&Nelson.pdf); [Kimchi 2000](https://newiipdm.haifa.ac.il/wp-content/uploads/2015/05/Kimchi_2000_VisionResearch.pdf)). Genelleştirilmiş ortak kader, fiziksel hareket olmadan ortak parlaklık değişimiyle gruplamayı tanımlar **[HAKEMLİ · özet]** ([Sekuler ve Bennett 2001](https://experts.mcmaster.ca/scholarly-works/212418)). Zamansal eşzamanlılık bu ek ilkeler arasında en zayıf zemindir, çünkü mekanizması ve bazı uyaranları tartışmalıdır **[HAKEMLİ · derleme üzerinden]** ([Wagemans vd. 2012 I](https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/); [Adelson ve Farid 1999](https://persci.mit.edu/pub_abstracts/farid_science_99_abs.html)). "Sıralama ilkesi" için birincil kaynak bulunamadı; bu başlık skill'in ilke kataloğuna girmemelidir.

Figür-zemin de gruplamayla aynı soru değildir. Gruplama "ne neyle birlikte?" sorusunu, figür-zemin ise "kenar hangi tarafa ait, hangisi önde?" sorusunu yanıtlar. Dışbükeylik, simetri, alt bölge, üst-alt kutupluluk, dikkat ve geçmiş deneyim figür atamasını etkiler; V2 nöronlarının yaklaşık yarısı kenar sahipliğine duyarlıdır **[HAKEMLİ · derleme üzerinden]** ([Wagemans vd. 2012 I](https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/)). Dışbükeylik oranının iki bölgeli görüntüde %57'den sekiz bölgeli görüntüde %89'a çıkması, tek bir yüzdenin sabit gibi aktarılamayacağını gösterir.

## Modern bilim ölçüm ekledi, sıralamayı ve evrenselliği kaldırdı

En sağlam nicel sonuçlar yakınlık için vardır. Nokta kafeslerinde gruplama olasılığı genel yapılandırmaya değil **göreli uzaklığa** bağlıdır (saf uzaklık yasası) ve uzaklık oranı yaklaşık 1,5'i aşınca uzak yöndeki gruplama neredeyse hiç görülmez. Oyama'nın üssü yaklaşık 2,89, Elder ve Goldberg'in doğal görüntü konturlarındaki üssü 2,92'dir; aynı doğal görüntü çalışmasında yakınlık gruplama kararı entropisini yaklaşık %75, iyi süreklilik ve benzerlik yaklaşık %10'ar azaltmıştır **[HAKEMLİ · derleme üzerinden]** ([Wagemans vd. 2012 I](https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/)). Yakınlık ile benzerlik, test edilen kafeslerde log-olasılık uzayında toplamsal birleşir; Kubovy ve van den Berg'in modeli ve parametreleri doğrudan okunmadı, yazar sırası da DOI üzerinden kontrol edilmelidir ([Kubovy sayfası](https://uva.theopenscholar.com/michael-kubovy/publications/whole-equal-sum-its-parts-probabilistic-model-grouping-proximity-and)).

Bu sayılar arayüz kuralı değildir. 1,5 oranı 300 ms'lik nokta kafeslerinden, %75 doğal görüntülerde kontur bağlamadan gelir; ikisi de bir kart ızgarasının veya formun boşluğunu belirlemez **[MÜHENDİSLİK]**. Taşınabilecek olan biçimdir: mutlak piksel yerine göreli boşluk kullanılmalı ve sonuç bir geçiş eğrisi olarak düşünülmelidir. Arayüz için geçerli bir eşik ayrı test gerektirir.

Bu araştırma evrensel bir ilke sıralaması bulamadı. Bulunanlar çiftli ve değerlere bağlı sonuçlardır: tekrar ayrımı görevinde ortak bölge bağlantılılığa baskın gelmiştir **[HAKEMLİ · özet]** ([Montoro vd. 2017](https://link.springer.com/content/pdf/10.3758/s13423-017-1254-3.pdf)); Quinlan ve Wilton'da yakınlık puanlamaları en güçlü etkilemiş, ama ortak renk ve şekil belirli koşullarda yakınlığı geçebilmiştir **[HAKEMLİ · özet]** ([Quinlan ve Wilton 1998](https://journals.sagepub.com/doi/10.1068/p270417)). Tekdüze bağlılığın ilk aşama olduğu önerisi tartışmalıdır **[HAKEMLİ · derleme üzerinden]** ([Wagemans vd. 2012 I](https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/)). Bir çalışmada yakınlığın, ortak bölgeyi de içeren birleşik ilkelerle benzer etki verdiği bildirilmiştir **[özet]** ([UNED kaydı](https://portalcientifico.uned.es/documentos/5f88eb2129995259ef2987ff)). Dolayısıyla UI eğitimlerindeki "kart, boşluğu yener" hükmü laboratuvarda bile kapanmış değildir; NN/g'nin "net bir sınır diğer gruplama işaretlerini bastırabilir" gözlemi yararlı bir sektör bulgusudur, deneysel genelleme değildir **[SEKTÖR]** ([NN/g Common Region](https://www.nngroup.com/articles/common-region/)).

Ön-dikkatli gruplama iddiası da daralmıştır. Bazı gruplamalar farkındalık olmadan davranışı etkiler, ama raporlanması dikkat ister ve dikkat talebi gruplama türüne göre değişir **[HAKEMLİ · özet]** ([Moore ve Egeth 1997](https://iro.uiowa.edu/esploro/outputs/journalArticle/Perception-without-attention-Evidence-of-grouping/9984002365102771); [Kimchi ve Razpurker-Apfeld 2004](https://cris.haifa.ac.il/en/publications/perceptual-grouping-and-attention-not-all-groupings-are-equal/); [Lamy vd. 2006](https://cris.tau.ac.il/en/publications/grouping-does-not-require-attention/)). Gelişim çalışmaları ilkelerin farklı takvimlerde işlevsel olduğunu, ama sonucun göreve bağlı kaldığını gösterir **[HAKEMLİ · özet]** ([Quinn vd. 2002](https://www.psychologicalscience.org/journals/psychological-science/1467-9280.00459/); [Quinn ve Bhatt 2005](https://moodle2.units.it/pluginfile.php/260290/mod_resource/content/0/Quinn_Bhatt_2005.pdf)). Küresel öncelik de evrensel değildir: Himba katılımcılarında güçlü yerel eğilim bildirilmiştir **[HAKEMLİ · özet]** ([Davidoff vd. 2008](https://core.ac.uk/download/110888.pdf)). Kültürel göz hareketi bulguları ise karışıktır ve tekrar edilememe tartışması vardır **[HAKEMLİ · özet]** ([Boland vd. 2008](https://public.websites.umich.edu/~jeboland/BolandChuaNisbett08.pdf)). Bu bulgular evrensellik iddiasına karşı temkin gerektirir, ama yerele özgü yerleşim kurallarını haklı çıkarmaz.

Klasik Gestalt'a yöneltilen ana eleştiri, mekanizma yerine gösteri sunması, yasaların belirsizliği ve her yeni faktör için yeni "yasa" türetilmesidir **[HAKEMLİ · derleme üzerinden]** ([Wagemans vd. 2012 I](https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/)). Aşağıdaki tablo skill'in reddetmesi gereken söylemleri özetler. Yanlış söylemlerin tasarım yazınındaki yaygınlığı sistematik olarak taranmadı; hükümler notların sentezidir.

| Yaygın söylem | Hüküm | Dayanak |
|---|---|---|
| Gestalt sabit 5-7 yasadır | Yanlış | Wertheimer'ın listesi farklıdır, faktörler sonradan eklenmiştir |
| Yakınlık her zaman benzerliği yener | Yanlış | [Wertheimer Bölüm III](https://psychclassics.yorku.ca/Wertheimer/Forms/forms.htm); [Quinlan ve Wilton](https://journals.sagepub.com/doi/10.1068/p270417) |
| İlkelerin bilinen tam sıralaması vardır | Kanıtlanmadı | Yalnızca çiftli, parametreye bağlı sonuçlar bulundu |
| Gruplama tamamen ön-dikkatlidir | Fazla güçlü | [Kimchi ve Razpurker-Apfeld 2004](https://cris.haifa.ac.il/en/publications/perceptual-grouping-and-attention-not-all-groupings-are-equal/) |
| Yasalar doğuştandır, deneyim önemsizdir | Yanlış | [Wagemans vd. 2012 I](https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/) |
| "1,5x boşluk" araştırma sonucudur | UI için desteksiz | Kafes koşulları ve Rush eleştirisi aynı derlemede |
| Prägnanz kesin öngörü kuralıdır | Abartılı | Aynı derleme; II. bölüm okunamadı |

## Arayüz kanıtı aramayı destekliyor, tek ilke etkisini vermiyor

Web'e aktarımın en güçlü dayanağı eski arama çalışmalarıdır. Tullis'in tezinde 520 karakter ekranında model, arama süresi varyansının %50,8'ini ve öznel puanların %80,5'ini açıklamış, 150 yeni ekranda tahmin ile gerçek arama süresi arasında r = 0,80 elde edilmiştir; en güçlü arama yordayıcıları grup sayısı ve grubun görsel açısıdır **[ÖN BASKI/TEZ · özet, doğrudan erişim 403]** ([Tullis](https://core.ac.uk/display/4438915)). Parush ve arkadaşlarında iyi gruplama ve hizalama daha kısa arama ve daha yüksek tercih ile ilişkilidir; N = 75 yalnızca ikincil kaynaktan görüldü **[HAKEMLİ · özet/ikincil]** ([Parush özeti](https://data.zhenzhi.com/details/1/887603301); [HFI](https://www.humanfactors.com/newsletters/web_page_design.asp)). Yerel yoğunluğun etkisi konusunda bu iki aktarım çelişir; muhtemelen bir etkileşimdir, ama tam metinle doğrulanamadı. Halverson ve Hornof'un 36 katılımcılı menü çalışmasında büyük anlamsal grupları işaretleyen görsel ipuçları en hızlı aramayı vermiştir; etki büyüklüğü görülmedi **[HAKEMLİ · özet]** ([Halverson listesi](https://scite.ai/authors/tim-halverson-g1QXPA?page=4)).

Bu çalışmaların ortak yönü şudur: yapı aramayı hızlandırır; grup sayısı ve boyutu, etiketler ve özellikle **anlamsal uyum** bunu değiştirir. Anlamla çelişen uzamsal gruplama muhtemelen zaman kaybettirir, ancak bu tahminin bir bölümü modellere dayanır ve kaynaklarda etki büyüklüğü görülmedi. 2026 tarihli bir hesaplamalı model de anlamsal gruplamanın uzamsal gruplamayla hizalandığında aramayı iyileştirdiğini bildirir **[ÖN BASKI · özet]** ([Sourulahti ve Jokinen](https://arxiv.org/abs/2606.26725)). Tek bir Gestalt ilkesi için izole edilmiş modern web veya mobil etki büyüklüğü, kart-boşluk karşılaştırması, kontrollü mobil gruplama deneyi veya gruplama için A/B kanıtı bulunamadı; ACM kitaplığı doğrudan aranamadığı için bu, yokluğun kanıtı değildir.

Hesaplamalı metrikler de doğrudan doğrulama sağlamaz. Görsel karmaşıklık ve estetik modelleri web'de varyansın %49'una kadarını, iPhone uygulamalarında türle birlikte %32'ye kadarını açıklar; ancak bu sayılar gruplamanın görev performansına etkisini değil, ekran görüntüsü çekiciliğini anlatır **[HAKEMLİ · özet/ikincil]** ([Miniukovich ve De Angeli](https://iris.unitn.it/handle/11572/101632)). Bu modeller çekiciliği açıklar; "yüksek estetik puanı = iyi gruplama" sonucunu haklı çıkarmaz. Xie ve arkadaşlarının ESEC/FSE 2022'deki bağlantılılık, benzerlik, yakınlık ve süreklilik temelli algoritması Android ekran görüntülerinde tespit edilmiş bileşenlerle F1 0,593, meta veriyle 0,672, Figma prototiplerinde 0,783 almıştır; karşılaştırma tabanı aynı koşullarda 0,092, 0,123 ve 0,232'dir **[HAKEMLİ · tam metin]** ([Xie vd. 2022](https://ar5iv.labs.arxiv.org/html/2206.10352)). Doğrulama verisi görünüm hiyerarşisi veya tasarımcı katmanlarıdır, insan algı çalışması değildir. Üstelik web'de insan etiketli algısal grup veri seti bulunamadı.

Uygulamalı sektör bulguları hata örüntüsü bulmak için değerlidir, etki tahmini için değildir. Sekiz kullanıcının altısının kaydırılabilir sayfayı fark etmemesi ve geniş boşlukların "sahte zemin" yaratması küçük örneklemli gözlemdir **[SEKTÖR · tam metin]** ([NN/g](https://www.nngroup.com/articles/illusion-of-completeness/)). Mobil dikey ekranda etiketi alanın üstüne koymak savunulabilir bir kuraldır, ama dayanağı eski cihaz dönemine ait, katılımcı sayısı ve istatistik vermeyen bir çalışmadır **[SEKTÖR · tam metin]** ([Baymard](https://baymard.com/blog/mobile-form-usability-label-position)). Masaüstünde mutlak kural yoktur: 11 kişilik çalışmada beş kişi sağa hizalı, beş kişi üstte etiketle daha hızlıdır **[özet]** ([Das vd. 2008](https://napier-repository.worktribe.com/OutputFile/232504)), Penzo'nun göz izleme yazısı ise N ve istatistik bildirmez **[SEKTÖR · tam metin]** ([Penzo](https://www.uxmatters.com/MT/archives/000107.php)).

Erişilebilirlik tarafında, görsel gruplamanın yardımcı teknoloji kullanıcılarına aktarılıp aktarılmadığını doğrudan test eden çalışma bulunamadı. Dolaylı kanıt aktarılmadığını düşündürür: ekran okuyucu anketinde yanıtlayanların %71,6'sı uzun sayfalarda bilgi bulmak için başlıkları kullanır **[anket · ikincil; kendi seçimiyle katılım]** ([Rochester özeti](https://www.rochester.edu/digital-accessibility/?p=7992)); büyüteç boşluğu da içerikle birlikte büyüterek bağlam kaybına ve kaydırma yüküne yol açar, 11 kullanıcılı bir sistem çalışması boşluğu sıkıştırmanın zaman kazandırdığını bildirir **[HAKEMLİ · özet]** ([SpaceX Mag](https://pure.psu.edu/en/publications/spacex-mag-an-automatic-scalable-and-rapid-space-compactor-for-op/)). DEHB ile UI gruplaması, düşük kontrastın kart gruplamasına etkisi, ortak kaderin UI gruplaması olarak etkisi ve web hareketinin vestibüler sonuçları için doğrudan kanıt bulunamadı. Yaşlı yetişkinlerde sonuçlar karışık yöndedir ve ağırlıkla UI dışıdır.

## CSS ve tasarım sistemleri ilkeleri uygulanabilir hale getirir, ama sayıları kanıt değildir

Web uygulamasının temel disiplini, ilkeyi önce ilişkiye, sonra CSS'e çevirmektir. Tablodaki eşlemeler büyük ölçüde sentezdir: sistemler yakınlık ve benzerliği açıkça yazar; bağlantılılık, kapanış ve Prägnanz'ı adıyla anan sistem sayfası bulunamadı, bunlar bileşenlerden çıkarıldı.

| İlke | CSS/HTML karşılığı | Tipik anti-örüntü | Onarım | Kanıt |
|---|---|---|---|---|
| Yakınlık | Parent `gap`, padding, iç içe stack | Her yerde tek değer | En az iki aralık katmanı; adım atlayarak ayır | [TASARIM SİSTEMİ] [M3](https://m3.material.io/foundations/layout/grids-spacing/spacing), [Carbon](https://carbondesignsystem.com/elements/spacing/overview/) |
| Benzerlik | Bileşen token'ları, ortak sınıf | Bağlantı gibi görünen metin | Eylem stilini eyleme ayır; durumu iki işaretle ver | [TASARIM SİSTEMİ] [M3](https://m3.material.io/foundations/layout/grids-spacing/spacing); [NORMATİF] [1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) |
| Ortak bölge | `background`, `border`, `<section>` | Kutu içinde kutu | İç kapsayıcıyı kaldır; boşluk veya başlık kullan | [SEKTÖR] [NN/g](https://www.nngroup.com/articles/common-region/); kural [MÜHENDİSLİK] |
| Bağlantılılık | `border-inline-start`, sözde öğe çizgi, SVG | Satır kaydırınca kopan çizgi | Bağlacı aynı kapsayıcıdan çiz, sarmayı test et | [MÜHENDİSLİK] |
| Kapanış | Taşma ipucu, scroll snap, iskelet | Kırpılma gibi görünen ipucu | Tutarlı kısmi boy, açık kontroller | [TASARIM SİSTEMİ] [M3](https://m3.material.io/components/carousel/guidelines); [SEKTÖR] [NN/g](https://www.nngroup.com/articles/skeleton-screens/) |
| Süreklilik | Grid, subgrid, baseline hizası | Kart altlıklarının farklı yükseklikte kalması | `grid-template-rows: subgrid` | [ARAÇ/başvuru] [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid); kural [MÜHENDİSLİK] |
| Ortak kader | Ortak süre ve eğri, `view-transition-class` | İlgili öğelerin alakasız hareketi | Tek token kümesi, küçük gecikme | [TASARIM SİSTEMİ] [Carbon](https://carbondesignsystem.com/elements/motion/overview/); kural [MÜHENDİSLİK] |
| Simetri | `place-items`, eşit izler | Uzun metin veya formu ortalamak | Kısa kompozisyonları ortala, formları başa hizala | [TASARIM SİSTEMİ] [M3](https://m3.material.io/components/dialogs/specs); kural [MÜHENDİSLİK] |
| Figür-zemin | `<dialog>`, `::backdrop`, yüzey rolleri | Fotoğraf üstünde düşük kontrast | Perde veya gradyan, test edilmiş kontrast | [TASARIM SİSTEMİ] [M3](https://m3.material.io/styles/elevation/applying-elevation); [NORMATİF] [1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) |
| Prägnanz | Daha az token, düzey ve stil | Aynı öğede kenarlık, gölge ve dolgu | Her düzeyde tek gruplama işareti | [TASARIM SİSTEMİ] [M3](https://m3.material.io/styles/elevation/applying-elevation); kural [MÜHENDİSLİK] |
| Odak noktası | Ölçek, boşluk, tek birincil düğme | Çok sayıda birincil CTA | Görünüm veya grup başına bir birincil | [TASARIM SİSTEMİ] [GOV.UK](https://design-system.service.gov.uk/components/button/) |

Aralıkta sistemler şunu paylaşır: yakınlık ilişkiyi bildirir, boşluk onu zayıflatır. Sayısal bir "grup içi / gruplar arası" oranı ise neredeyse hiç yayımlanmaz. En açık kodlama GOV.UK formudur: etiketten girdiye 5 px, küçük ekranda gruplar arasında 20 px, büyük ekranda 30 px **[TASARIM SİSTEMİ]** ([etiket](https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/components/label/_mixin.scss); [form grubu](https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/objects/_form-group.mixin.scss); [ölçek](https://design-system.service.gov.uk/styles/spacing/)). Carbon form öğeleri 32 px kullanır, ama eski v10 sayfası 24 px listelediği için değer sürüme bağlıdır **[TASARIM SİSTEMİ]** ([Carbon](https://carbondesignsystem.com/components/form/style/); [v10](https://v10.carbondesignsystem.com/components/form/style)). M3 diyaloğu 8, 16 ve 24 dp ile 1:2:3 üretir **[TASARIM SİSTEMİ, oran türetilmiş]** ([M3 Dialog](https://m3.material.io/components/dialogs/specs)). Bu değerlerden çıkarılan 1:2-1:4 katman aralığı yalnızca bir başlangıç noktasıdır **[MÜHENDİSLİK]**.

Sık yinelenen "iç boşluk ≤ dış boşluk" kuralının birincil kaynağı bulunamadı; bir blog ve bir proje PR'ı bu kuralı ifade eder ([Crosley](https://blakecrosley.com/blog/five-spacing-decisions); [tastemaker PR](https://github.com/codeswithroh/tastemaker/pull/30)). Polaris token'ları da kart padding'ini kart gap'ine eşit (16 px) tanımlayarak katı okumayı çürütür ([Polaris space.ts](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/themes/base/space.ts)). Bu tokenlar güncel web bileşeni katmanını yansıtmayabilir, ama görünür bir sınırın ek dış boşluk ihtiyacını azalttığı yorumuyla uyumludur. Skill'in savunabileceği kural daha dardır: **grup içi aralık, gruplar arası aralıktan görünür bir adımla küçük olmalıdır** **[MÜHENDİSLİK]**. 16'dan 20'ye tek adım görünmez kalabilir; GOV.UK'nin 3, 4 ve 5 numaralı birimleri küçük ekranda 15 px'e düştüğü için bu birimlere dayalı hiyerarşi mobilde kaybolur.

Kapsayıcı seçimi için pratik kural en zayıf işaretle başlamaktır: boşluk, sonra ton, en son kenarlık. NN/g, kenarlık eklemeden önce boşluğun yeterli olup olmadığına bakılmasını önerir ve Backcountry'nin kutulu filtrelerini gereksiz bulur **[SEKTÖR]** ([NN/g](https://www.nngroup.com/articles/common-region/)). Kartlar karışık içerikte iş görür, ama homojen öğeleri tarama ve karşılaştırma görevlerinde zorlaştırır **[SEKTÖR]** ([NN/g Cards](https://www.nngroup.com/articles/cards-component/)). "Her hiyerarşi düzeyinde bir kapsayıcı" kuralı bir çıkarımdır; kutu içinde kutu üzerine göz izleme verisi bulunamadı **[MÜHENDİSLİK]**.

Figür-zeminde WCAG kesin eşikler verir: normal metin için 4,5:1, büyük metin için 3:1, gerekli arayüz ve grafik öğeleri için 3:1; 2,999:1 başarısızdır **[NORMATİF]** ([1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html); [1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)). M3'ün %32 perde değeri ise görsel reçetedir ve içerik kontrastını garanti etmez **[TASARIM SİSTEMİ]** ([M3](https://m3.material.io/styles/elevation/applying-elevation)). Modal, boya kadar odak yönetimi de gerektirir: odak içeri girer, dışarısı etkisizleşir, kapanınca tetikleyiciye döner **[NORMATİF]** ([2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html); [F85](https://www.w3.org/WAI/WCAG22/Techniques/failures/F85)).

Ortak kader için sistemler süre ve eğri verir, kademeli gecikme değeri vermez. Carbon'un 70-700 ms token'ları ve eğrileri açıktır **[TASARIM SİSTEMİ]** ([Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)). M3'ün easing ve süre token'ları artık bakımı yapılmayan eski yapıdadır; sistem yay fiziğine geçmiştir **[TASARIM SİSTEMİ]** ([M3 token'ları](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs); [M3 fizik](https://m3.material.io/styles/motion/overview/how-it-works)). Aynı belge içi View Transitions, web.dev'e göre Firefox 144 ile Ekim 2025'te Baseline Newly available düzeyine ulaştı ([web.dev](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available)). Azaltılmış harekette 2.3.3 AAA düzeyindedir ve C39 tekniği `prefers-reduced-motion` kullanır **[NORMATİF]** ([2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html); [C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39)). Otomatik başlayan ve beş saniyeden uzun süren paralel hareket için ise 2.2.2 duraklatma mekanizması ister **[NORMATİF]** ([2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)). Hareketi silmek yerine opaklık geçişiyle değiştirme örneği MDN'de vardır ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)). `sibling-index()` desteği yalnızca ikincil kaynaktan görüldü ve yeniden kontrol edilmelidir ([ICS Media](https://ics.media/en/entry/260116/)).

Görsel grup anlamsal olarak ifade edilmezse yardımcı teknoloji için yoktur. Aşağıdaki eşleme bu raporun çıkarımıdır, başvurduğu ölçütler ise normatiftir: ilişkili girdiler için `fieldset` ve `legend`; bağlantı kümesi için etiketli `nav` ve `ul`; yinelenen kartlar için liste ve başlık; bölge için `section aria-labelledby`; tablo görünümü için `th scope` içeren gerçek tablo **[MÜHENDİSLİK; NORMATİF dayanak]** ([1.3.1](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html); [1.3.2](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)). Bununla birlikte H71, her denetimin etiketi yeterince açıksa `fieldset` zorunlu kılmaz, bu yüzden eksik fieldset otomatik hata sayılamaz **[NORMATİF]** ([H71](https://www.w3.org/WAI/WCAG21/Techniques/html/H71)). CSS `order` yalnızca görsel yeniden sıralama içindir ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Grid_layout_and_accessibility)). `reading-flow` Chrome 137'de geldi, ama MDN onu deneysel ve Baseline dışı gösterir; varsayılan doğruluk kaynağı DOM sırası kalmalıdır ([Chrome](https://developer.chrome.com/blog/reading-flow); [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/reading-flow)).

Gruplama ayrıca stres koşullarında yaşamalıdır: 320 CSS px yeniden akış, metin aralığı geçersiz kılmaları, 24×24 CSS px hedef boyutu ve RTL **[NORMATİF; RTL hariç]** ([1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html); [1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html); [2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)). Metin aralığı geçersiz kılındığında `gap` değişmez, ama satır aralığı büyür; satır boşluğunun grup boşluğunu geçme riski bu rapordaki bir akıl yürütmedir, WCAG'de ele alındığı görülmedi. 1.3.1, 1.3.2 ve 1.4.10 ölçütlerinin uyum düzeyleri okunan özetlerde yoktu; skill metnine yazılmadan önce kontrol edilmelidir. 2.4.11 Odak Gizlenmez okunmadı; yapışkan başlık için önerilen `scroll-padding` bir öneridir.

Üretim modunun temel kod iskeleti, ilişkiye göre adlandırılmış token ve üst öğeye ait aralıktır. Aşağıdaki kod örnektir ve değerler kaynaklı değildir **[MÜHENDİSLİK]**. M3 ve Carbon'un üst öğeye ait aralık ilkesiyle, DTCG'nin `px` ve `rem` boyut biçimiyle uyumludur ([M3](https://m3.material.io/styles/spacing/overview); [Carbon](https://carbondesignsystem.com/elements/spacing/overview/); [DTCG taslağı](https://www.designtokens.org/tr/drafts/format/)).

```json
{
  "group": { "$type": "dimension",
    "within":  { "$value": { "value": 0.5, "unit": "rem" }, "$description": "Etiket-girdi, ikon-metin" },
    "between": { "$value": { "value": 1.5, "unit": "rem" }, "$description": "Alan-alan, kart-kart" },
    "section": { "$value": { "value": 3,   "unit": "rem" }, "$description": "Sayfa bölümleri" }
  }
}
```

```css
.form    { display: grid; gap: var(--group-section); }
.fieldset{ display: grid; gap: var(--group-between); border: 0; padding: 0; }
.field   { display: grid; gap: var(--group-within); }
.cards   { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: var(--group-between); }
.card    { display: grid; grid-row: span 3; grid-template-rows: subgrid; }
```

İlişki adları (`within`, `between`) tasarım kuralını makinece denetlenebilir kılar: linter `within < between` koşulunu sınayabilir. DTCG'nin son yayımlı sürümü 2025.10'dur, güncel taslak ise uygulanmaması uyarısı taşır ve W3C standardı değildir. Subgrid, stil sorguları ve `sibling-index()` için Baseline durumu araştırmada tam doğrulanamadı.

## Denetim gerçeği, adayı ve yargıyı ayırmalı

Denetim motorunun ana tasarım kararı kanıt zinciridir. Tarayıcı, bir etiketin başka bir denetime daha yakın olduğunu kesin olarak ölçebilir; bunun gerçekten yanlış ilişkilendirmeye yol açtığını kanıtlayamaz. Aşağıdaki kapasite matrisi ve yanlış pozitif riskleri mekanizmadan akıl yürütmedir **[MÜHENDİSLİK]**; altındaki araç bilgileri kaynaklıdır.

| İhlal | En güçlü kanal | Başlıca yanlış pozitif | Azami iddia |
|---|---|---|---|
| Etiket-denetim belirsiz aralığı | DOM ilişkisi + geometri | Satır yüksekliği, satır içi etiket, yoğun tablo | Ölçülmüş geometri, aday ihlal |
| Yakınlık yapıyla çelişiyor | Grup ağacı - DOM/AX karşılaştırması | Sarmalayıcı div, birden çok geçerli gruplama | Aday |
| Stil yakın kopyaları | Hesaplanmış stil + statik envanter | Anlamsal varyant, durum, tema | Ölçülmüş, niyet bilinmiyor |
| Hizalama ıskası | Kenar geometrisi | Alt piksel, optik ayar, dönüşüm | Aday |
| Düz renkte kontrast | axe | Devre dışı denetim, dekoratif metin | Normatif hata |
| Görsel veya gradyan üstünde metin | Piksel örnekleme | Karusel, video, tembel görsel | Ölçülmüş örnek |
| Örtüşme | `elementsFromPoint` + piksel | Modal, yapışkan başlık, kasıtlı örtüşme | Ölçülmüş gerçek |
| Ortak kader | `getAnimations()` | Kademeli gecikme, görünmeyen JS animasyonu | Aday |
| Azaltılmış hareket | İki modun davranış farkı | Temel hareket, kasıtlı opaklık | Ölçülmüş fark |
| Tab ve görsel sıra | Gerçek Tab yolu | Çok kolon, RTL, kenar çubuğu | Aday; yerel tersinme ciddi |
| Eksik grup anlambilimi | AX ağacı, statik kural | H71 her zaman gerekmez | Aday |
| Kapanış, süreklilik, "aidiyet" | Yalnızca insan veya LLM | Savunulabilir metrik yok | Görüş olarak etiketlenmiş yargı |

LLM'nin yeri dardır. Bir çalışmada GPT-4 ile 12 uzman, 12 arayüzde karşılaştırıldı: kesinlik 0,603'e karşı 0,829, duyarlılık 0,380'e karşı 0,336, F1 0,466'ya karşı 0,478; Semantic Grouping en düşük ortalama doğruluğa sahip kategoridir ve 100 farklı ihlalin 62'sini yalnızca insanlar bulmuştur **[ÖN BASKI · tam metin]** ([Generating Automatic Feedback](https://arxiv.org/html/2403.13139)). UICrit'te insan eleştirileri 0,75, en iyi LLM kurulumu 0,48 puan almıştır; uzmanlar insan setlerini %81 oranında tercih etmiştir **[ÖN BASKI · tam metin; mobil ekran]** ([UICrit](https://arxiv.org/html/2407.08850v3)). Fleiss kappa 0,112 ve puanlama kappası 0,29-0,31 ise insan ölçütünün kendisinin zayıf olduğunu gösterir. Görme modellerinin siluet kapanışında yüksek skor alması da UI gruplamasını değerlendirebildikleri anlamına gelmez, çünkü o çalışma UI düzenlerini kapsamaz **[ÖN BASKI · tam metin]** ([Athreya ve Malladi](https://arxiv.org/html/2608.10195)). Bu nedenle LLM birincil keşif aracı olmamalı; tek bir sınırlı soruyu, kırpılmış görsel, bindirme ve ölçülmüş sayılarla yanıtlamalıdır **[MÜHENDİSLİK]**.

Algısal grup ağacı için en uygun yol, canlı sayfada kesin ilkelleri DOM'dan almak ve açıklanabilir bir özyinelemeli bölme yapmaktır. Xie'nin UIED hattını birincil yol yapmak gereksizdir, çünkü yalnızca bileşen tespitinin F1 değeri 0,626'dır ve bu hata bulgulara taşınır **[HAKEMLİ · tam metin; öneri MÜHENDİSLİK]** ([Xie vd. 2022](https://ar5iv.labs.arxiv.org/html/2206.10352)). Xie, DBSCAN eps ve minPts değerlerini vermez; birleştirme eşiği de değerlendirmedeki aynı doğruluk verisinden seçilmiştir, dolayısıyla kopyalanacak bir parametre yoktur. Çalışma, çalışma zamanı meta verisinin gizli öğeleri içerince tamamen yanlış gruplar üretebildiğini de bildirir. Görünürlük ve örtüşme filtresi bu yüzden zorunludur. VIPS web için blok tutarlılığı önerir, ama görülen kanıt algısal gruplama değil bilgi erişim görevidir ([VIPS](https://microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-2003-79.pdf)). Koch ve Oulasvirta'nın ön çalışması Gestalt yasalarını ayrıştırma sezgisi olarak kullanır, ama yalnızca özet düzeyinde görüldü ve grafik kesme yöntemi olarak aktarılmamalıdır **[HAKEMLİ · özet]** ([KochO16](https://researchr.org/publication/KochO16)).

```text
ilkeller = görünür metin parçaları + medya + denetimler + boyanmış kutular
süzgeç   = display, visibility, opacity 0, kırpılma, elementsFromPoint ile örtüşme

ağaç(R):
  boyanmış kapsayıcı varsa önce onlara göre böl      # mühendislik kararı, bilimsel üstünlük iddiası değil
  X/Y ekseninde büyük boşluk kesimlerini bul
  boşluk / yerel satır yüksekliği dağılımında kırılma ara
  kırılma varsa böl; yoksa kenar uzaklığıyla yerel agglomeratif kümele
  her kararı kaydet: boşluklar, kırılma gücü, kullanılan işaret
  iki ayrıştırma yakınsa: alternatifleri raporla, sessizce seçme

karşılaştır(algısal, anlamsal):
  grup form, fieldset, landmark, başlık bölümü, liste, tablo satırı veya kart sınırını aşıyorsa
  ya da anlamsal birim görsel gruplara bölünüyorsa → ipucu + bindirme; asla puan değil
```

En güvenilir ilk kural etiket testidir, çünkü `for` veya `aria-labelledby` niyeti verir. `oran = başka denetime uzaklık / kendi denetimine uzaklık`; 1'in altı ölçülmüş ters ilişki, 1-1,5 arası belirsiz aday, üstü bulgu yoktur. Ortak kapsayıcı, satır içi taban hizası, gizli etiket, kayan etiket ve farklı kolon durumları bastırılır. Buradaki 1,5'in Kubovy'nin kafes sonucuyla aynı sayı olması bir tesadüf olarak işlenmelidir: **rapor metni asla "araştırma 1,5x diyor" yazmamalıdır** **[MÜHENDİSLİK]**. Ölçüm, satır kutusunun yarı aralığı nedeniyle mürekkep kutusuna dayanmalıdır; `line-height: 2` yargıyı tersine çevirebilir. Eşik kalibrasyonu için hedef alandan 200 veya daha fazla etiketli kırpıntı önerilir; bu da kaynaklı değil, çalışma varsayımıdır.

Benzerlikte statik envanter ile hesaplanmış stil birlikte kullanılmalıdır. `css-analyzer` 200+ metrikle bildirilen değerleri sayar, ama yalnızca CSS dizesi okur **[ARAÇ]** ([css-analyzer](https://github.com/projectwallace/css-analyzer)). Rol kapsamlı kümeleme ise 42 düğmede 8 px ve iki düğmede 7 px köşe yarıçapı gibi asimetrik vakaları öne çıkarır; 20'ye 20 dağılım iki bilinçli varyant olabilir **[MÜHENDİSLİK]**. Hizalama ıskası için 1-4 CSS px aralığı doğrulanmamış bir başlangıçtır; web öğesi kenarları için farkına varılabilir eşik çalışması bulunamadı. AIM'in ızgara kalitesi metriği yalnızca betimleyici sinyal olarak ele alınmalıdır; metrik listesi ve doğrulama verileri okunamadı, kurulumu ağırdır **[ARAÇ · özet/ikincil]** ([AIM](https://github.com/aalto-ui/aim)).

Figür-zeminde önce axe çalışır ve "gözden geçirme" sonuçları geçmiş sayılmaz, iş kuyruğu sayılır. axe `color-contrast` kuralı WCAG 2 AA'dır; arka plan görseli, örtüşme ve gradyan için tamamlanmamış sonuç anahtarları üretir ve katkıcılar gradyanları aralık olarak modellemeyi reddedip ekran görüntüsü testine işaret etmiştir **[ARAÇ]** ([axe kuralları](https://raw.githubusercontent.com/dequelabs/axe-core/develop/doc/rule-descriptions.md); [issue 708](https://github.com/dequelabs/axe-core/issues/708)). Bunun üzerine metin görünür ve şeffaf iki kare alınarak glif kutusu altındaki p5, medyan ve en kötü kontrast raporlanabilir **[MÜHENDİSLİK]**. APCA ise WCAG 3 adayıdır, uyum ölçütü değildir ve Lc eşikleri kaynaklarda çelişir; ayrı bir danışma okuması olarak kalmalı, geçti/kaldı işareti taşımamalıdır ([APCA](https://github.com/Myndex/apca-introduction)).

Hareket denetimi tetikleyicileri fiilen sürmelidir, çünkü `document.getAnimations()` yalnızca o anda etkin olan animasyonları verir ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/getAnimations)). Playwright'ın `reducedMotion` öykünmesi iki modun karşılaştırılmasını sağlar **[ARAÇ]** ([Playwright](https://playwright.dev/docs/api/class-page)). Kod içinde `prefers-reduced-motion` bulunması tek başına az şey kanıtlar; test davranıştır. rAF, GSAP, canvas ve WebGL bu API'de büyük olasılıkla görünmez, bu kör nokta raporlanmalıdır **[MÜHENDİSLİK]**. Tab sırası Lighthouse'ta el ile yapılan kontroldür ve C27 de görsel-DOM sırasını el ile karşılaştırır; gerçek Tab basımlarıyla numaralı yol bindirmesi bu boşluğu doldurur **[ARAÇ/NORMATİF; yöntem MÜHENDİSLİK]** ([Lighthouse](https://developer.chrome.com/docs/lighthouse/accessibility/logical-tab-order); [C27](https://www.w3.org/WAI/WCAG21/Techniques/css/C27.html)).

Rapor bileşik puan vermemelidir: doğrulanmış bir Gestalt kalite puanı bulunamadı ve zayıf insan uyumu ondalıklı bir sayıyı haklı çıkarmaz. Şiddet (P0-P3) kullanıcı sonucunu, güven ise kuralın kalibrasyon durumunu anlatır; ikisi karıştırılmamalıdır **[MÜHENDİSLİK]**.

```yaml
id: gestalt.proximity.label-ambiguous
evidence_class: normative_failure | measured | candidate | judged
severity: P2
confidence: uncalibrated            # kalibrasyon yoksa high yazılmaz
principle: proximity
selector: "#shipping label[for=zip]"
measurements: { own_gap_px: 14, other_gap_px: 12, ratio: 0.86, method: ink-box }
threshold: { value: 1.0, provenance: "heuristic, uncalibrated" }
conditions: { failed: ["375x812 light"], passed: ["1280x800 light"], not_run: ["400%"] }
suppressions_checked: [common_region, baseline_inline]
falsifier: "Çevreleyen kart veya kullanıcı testi doğru ilişkilendirmeyi gösterir"
fix_hint: "Önceki alandan ayrımı artır"
```

Koşul matrisi yanlış kesinliği de azaltır: 320×256 yeniden akış ve 200 ile 400 yakınlaştırma normatif çerçeveye dayanır **[NORMATİF]**, ancak viewport öykünmesi gerçek zoom ile aynı değildir ([Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)); 375, 768, 1280, 1920 genişlikleri, yaklaşık %40 sözde yerel genişleme ve zorlanmış `dir=rtl` geleneksel seçimlerdir **[MÜHENDİSLİK]**. Ürün RTL göndermiyorsa zorlanmış `dir` yalancı hata üretebilir. Sınıfla çalışan koyu tema da `colorScheme` öykünmesine yanıt vermez ([Playwright](https://playwright.dev/docs/emulation)).

### Onarım en zayıf yeterli işaretle başlar ve her koşulda yeniden ölçülür

Bu kaynak setinde onarım yöntemlerini karşılaştıran bir çalışma yok; aşağıdaki iş akışı tasarım sistemi ve sektör önerilerinin mühendislik sentezidir. Her düzeltme önce nedeni sınıflandırmalıdır: yanlış ilişki, yanlış anlambilim, işaret çatışması veya stil sapması. Aynı görünen sorun, bazen CSS değil markup düzeltmesi ister.

| Sınıf | Birinci onarım | Yeniden ölçüm | Kaçınılacak |
|---|---|---|---|
| Etiket belirsizliği | Üst öğe `gap` katmanını ayır; DOM'da etiketi girdinin hemen önünde tut | Oran, 320 px, metin aralığı | Çocuk marginleriyle yama, `order` |
| Grup sınırı yok | Boşluk → ton → kenarlık sırasıyla dene; anlamsal başlık veya `fieldset` ekle | Grup ağacı, AX ağacı | İç içe kenarlık |
| İç içe kutu | İç kapsayıcıyı kaldır | Aday sayısı, görsel yargı | Gölge + kenarlık + dolgu birlikte |
| Yakın kopya stil | Baskın token'a taşı, ama önce varyant niyetini sor | Rol kümesi, tema, durumlar | Otomatik toplu birleştirme |
| Hizalama ıskası | Paylaşılan grid veya subgrid; tek pikselli yama değil | Birden çok viewport | Optik ayarı "düzeltmek" |
| Görsel üstünde metin | Scrim veya gradyan, sonra en açık bölgede ölç | Piksel p5 ve en kötü değer, koyu mod | %32 scrimi kanıt saymak |
| Odak veya örtüşme | `<dialog>`, odak dönüşü; yapışkan başlıkta yeniden kaydır | Gerçek Tab yolu | Yalnızca `z-index` |
| Ortak kader sapması | Tek süre ve eğri token'ı; azaltılmış harekette alternatif | `getAnimations()`, iki mod | Global `0.01ms` kapatması |
| Sahte zemin | Sert çizgiyi ve boşluğu azalt, içerikten ipucu göster | Gerçek cihaz, kaydırma | "Fazla" boşlukla ayrıştırma |

Otomasyon sınırı da kanıt sınıfına göre belirlenmelidir **[MÜHENDİSLİK]**. Tek anlamlı ve bilinen niyetli değişiklik (örneğin programatik ilişki kurmak) doğrudan önerilebilir, ama her dosya değişikliği kullanıcıya diff olarak gösterilmelidir. Aday bulgular açık onayla, yargılar yalnızca öneri olarak işlenmelidir. Her düzeltmeden sonra aynı koşul matrisi yeniden çalıştırılmalı; eski bulgunun kapandığı ve yeni bulgu doğmadığı gösterilmelidir. LLM'ye art arda döngü yaptırmak risklidir: bir çalışmada yinelemeli turlarda "doğru" oranı %52'den %39'a düşmüştür **[ÖN BASKI · tam metin]** ([aynı çalışma](https://arxiv.org/html/2403.13139)). Bu yüzden onarım döngüsünün durma ölçütü LLM kanaati değil, ölçümler ve insan onayı olmalı, tur sayısı da sınırlanmalıdır.

## Tek npm paketi üç yüzeyi güvenle dağıtabilir

Bu bilgi tek bir yönlendirici skill'e dönüşmelidir. Impeccable bu kalıbın somut örneğidir: bir `SKILL.md`, komut tablosu ve her komuta ait `reference/*.md`; argümansız çağrıda menü gösterir, otomatik çalışmaz **[ARAÇ]** ([SKILL.src.md](https://github.com/pbakaus/impeccable/blob/main/skill/SKILL.src.md)). Superpowers ise 15 ayrı skill ile çok sayıda tetikleyici verir **[ARAÇ]** ([repo](https://github.com/obra/superpowers)). `audit|generate|fix` için yönlendirici daha uygundur: başlangıç listesinde tek açıklama durur, komut ayrıntısı yalnızca yüklendiğinde maliyet üretir **[MÜHENDİSLİK]**. Açık spec buna destek verir: yaklaşık 100 token meta veri, önerilen 5000 token altı gövde, 500 satırın altında `SKILL.md`, bir düzey derinlikte başvuru dosyaları ([Spec](https://agentskills.io/specification)).

Yüzeyler net ayrılmalıdır. Terminal fiilleri kurulum ve deterministik taramadır; ajan komutları yargıdır. Aşağıdaki fiiller bir öneridir, var olan bir aracın bayrakları değildir **[MÜHENDİSLİK]**.

| Yüzey | Komut | İş | Kanıt davranışı |
|---|---|---|---|
| Ajan | `/gestalt audit [hedef]` | Detect + axe çıktısı toplar, sınırlı LLM paketleri hazırlar, sınıflandırılmış rapor verir | Puan yok; normatif, ölçülmüş, aday ve yargı ayrı |
| Ajan | `/gestalt generate [brief]` | İlişki token'ları, üst öğe aralığı, anlamsal iskelet, tek birincil eylem, hareket alternatifi üretir; çıktıyı detect'ten geçirir | Reçeteler kaynak etiketiyle; doğrulanmamış sayıyı araştırma diye sunmaz |
| Ajan | `/gestalt fix [hedef\|bulgu]` | Bulgudan diff önerir, koşul matrisinde yeniden ölçer | Aday için onay ister; tur sınırı uygular |
| Terminal | `npx gestalt-skill install [--providers] [--scope] [--yes] [--dry-run]` | Skill'i ajan dizinlerine kurar | Yönetilmeyen dosyayı `--force` olmadan ezmez |
| Terminal | `npx gestalt-skill update\|uninstall\|check\|help` | Yaşam döngüsü | Sürüm işareti dosyası |
| Terminal | `npx gestalt-skill detect <yol\|url> [--json]` | Deterministik tarama | Çıkış: 0 temiz, 2 bulgu, 1 tarama hatası |

Çıkış kodu kuralı Impeccable'dan alınmıştır **[ARAÇ]** ([README](https://github.com/pbakaus/impeccable/blob/main/README.md)). Impeccable'ın 62 kuralının adlarında gap-oranı gruplama, hizalama ıskası veya stil kümesi yakın kopyası görünmez; uygulama kodu ikili dosyada olduğu için `monotonous-spacing` kuralının gerçekte ne ölçtüğü bilinmiyor ve katalog değerlendirmesi ad ile açıklamaya dayanır ([README](https://github.com/pbakaus/impeccable); yerel `impeccable detect --list-rules`, sürüm 4.8.0). En mantıklı ilişki tamamlayıcılıktır: kuruluysa `detect --json` çıktısı alınır, seçici ve kural ailesine göre tekilleştirilir, ama motor ondan bağımsız kalır. JSON şeması yakalanmadığından bu entegrasyon önce örnek çıktıyla sınanmalıdır. 0-20 sağlık puanı ise taşınmamalıdır ([audit.md, yerel kurulu skill](https://github.com/pbakaus/impeccable)).

Dosya düzeni tek kaynaktan üç kanal besler **[MÜHENDİSLİK; yerel duman testiyle kısmen doğrulandı]**.

```text
gestalt-skill/
├── package.json
├── README.md
├── LICENSE
├── cli/bin/cli.mjs             # üst düzey bin/ değil
├── cli/lib/{install,detect,harnesses}.mjs
├── skills/gestalt/
│   ├── SKILL.md
│   ├── reference/{audit,generate,fix,routing,evidence,rules}.md
│   └── scripts/
├── .claude-plugin/{plugin.json,marketplace.json}
└── .github/workflows/publish.yml
```

```json
{
  "name": "gestalt-skill",
  "version": "0.1.0",
  "type": "module",
  "bin": { "gestalt-skill": "cli/bin/cli.mjs" },
  "files": ["cli/", "skills/", ".claude-plugin/"],
  "engines": { "node": ">=18.19" },
  "license": "MIT",
  "repository": { "type": "git", "url": "git+https://github.com/<owner>/gestalt-skill.git" },
  "peerDependencies": { "playwright": "*" },
  "peerDependenciesMeta": { "playwright": { "optional": true } }
}
```

Üst düzey `bin/` dizinindeki tuzak somuttur: Claude eklentisinde bu dizin Bash `PATH`'ine eklenir ve claude.ai ile Cowork böyle bir eklentiyi kurmaz **[ARAÇ]** ([Manifest](https://code.claude.com/docs/en/plugins-reference)). npx, tek `bin` girdisini veya paket adıyla eşleşeni çalıştırır ([npx](https://docs.npmjs.com/cli/v11/commands/npx)). `engines` yalnızca tavsiye niteliğindedir, bu yüzden CLI çalışma zamanında Node sürümünü de denetlemelidir ([package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)). `playwright` zorunlu bağımlılık olmamalı, isteğe bağlı peer olarak tembel yüklenmelidir; `npx` her çalışmada ağırlaşmaz. Node 18.19 tabanı önerisi Impeccable'ın beyanından alınmıştır ve kendi paketimizde sınanmamıştır; duman testi Node 26.10 ile çalıştı.

`SKILL.md` açık spec'in katı alt kümesine yazılmalıdır: `name` üst dizinle eşleşen 1-64 karakter, `description` 1024 karakter altı ([Spec](https://agentskills.io/specification)). Claude'un 1536 karakter sınırı daha geniştir ve bilinmeyen alanları sessizce yok sayar ([Claude Code skills](https://code.claude.com/docs/en/skills)). Impeccable kod yorumu Codex doğrulayıcısının bilinmeyen üst düzey anahtarları reddettiğini söyler; bu, OpenAI belgesinde görülmedi ([providers.js](https://github.com/pbakaus/impeccable/blob/main/scripts/lib/transformers/providers.js)). Bu yüzden `argument-hint` gibi alanlar için sağlayıcı başına dönüşüm ancak gerçek bir ret görülürse eklenmelidir. `allowed-tools` başlangıçta dışarıda bırakılmalıdır: spec'te deneyseldir, kaynaklar biçimde ayrışır ve Impeccable bunu etkinleştirme hatası nedeniyle Claude için çıkarmıştır; bu hatanın sürüp sürmediği doğrulanmadı ([issue #736](https://github.com/pbakaus/impeccable/issues/736)). `disable-model-invocation: true` da doğal dilde tetiklemeyi engellediği için ana skill'de kullanılmamalıdır ([Claude Code skills](https://code.claude.com/docs/en/skills)). Skill gövdesinde sürümü sabitlenmemiş `` !`npx ...` `` enjeksiyonu da kullanılmamalıdır: başarısız komut skill çağrısını iptal eder ve her etkinleştirmeye ağ erişimi ekler.

Kurulum hedeflerinde önce `.claude/skills/` ve `.agents/skills/` seçilmelidir. Claude Code'un belgeli konumları `.agents/skills`'i içermez; Codex `.agents/skills`'i, Cursor ikisini de okur ([Claude](https://code.claude.com/docs/en/skills); [OpenAI](https://learn.chatgpt.com/docs/build-skills); [Cursor](https://cursor.com/docs/skills)). Cursor'da iki yere kurulum yinelenmeye yol açabilir ve bu test edilmelidir. Gemini CLI, Copilot, OpenCode ve Windsurf yolları üretici belgelerinden değil, birbiriyle kısmen çelişen `vercel-labs/skills` tablosu ve Impeccable kaynağından geldi; ilk sürüme alınmamalıdır ([vercel agents.md](https://github.com/vercel-labs/skills/blob/main/docs/agents.md); [providers.rs](https://github.com/pbakaus/impeccable/blob/main/crates/skills/src/providers.rs)).

İkincil kanallar neredeyse bedavadır. `skills/gestalt/SKILL.md` düzeni `npx skills add <owner>/gestalt-skill` ile keşfedilir, ama `npx skills` 1.7.4 Node 22.20+ ister, git ve URL kaynaklarından kurar ve varsayılan olarak anonim telemetri açıktır ([commands.md](https://github.com/vercel-labs/skills/blob/main/docs/commands.md); [README](https://github.com/vercel-labs/skills/blob/main/README.md)). Claude eklentisi aynı dizini varsayılan olarak tarar ve `/plugin install gestalt@gestalt-skill` ile kurulur; komut bu durumda `/gestalt:gestalt` olur, dizin kurulumunda `/gestalt`, bu fark belgelerde açıkça anlatılmalıdır ([Manifest](https://code.claude.com/docs/en/plugins-reference); [Marketplace](https://code.claude.com/docs/en/plugin-marketplaces)). `npm` marketplace kaynağı henüz uygulanmamıştır; `npm` eklenti kaynağı ise desteklenir ve `npm-shrinkwrap.json` gerektirir ([Marketplace başvurusu](https://code.claude.com/docs/en/plugins/marketplace-reference.md); [Plugin loading](https://code.claude.com/docs/en/plugins/loading.md)). `plugin.json` içindeki sürüm her sürümde artırılmalıdır, yoksa kullanıcılar eski sürüme kilitlenir.

Tedarik zinciri güvenliği özellik değil, ön koşuldur. Snyk'in satıcı çalışması 3.984 skill'de %36,82 kusur ve 76 doğrulanmış kötü amaçlı skill bildirir; bağımsız tekrar bulunamadı ([Snyk](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)). Paket `postinstall` kullanmamalı, `files` izin listesi tutmalı, güvenilir yayıncılıkla yayımlanmalıdır (npm 11.5.1+, Node 22.14+, barındırılan GitHub Actions) ve ağ erişimi `compatibility` ile README'de belirtilmelidir ([Trusted publishers](https://docs.npmjs.com/trusted-publishers)). Hem `skills` hem `shadcn` SLSA kanıtı taşırken Impeccable taşımaz; bu, 30 Ekim 2026'da gözlemlenen bir fark olarak `gestalt-skill` için kolay bir güven üstünlüğüdür ([skills](https://registry.npmjs.org/skills); [impeccable](https://registry.npmjs.org/impeccable)). `gestalt` adı alınmıştır ve `gestalt-skill` aynı tarihte 404 vermiştir, ama npm'in benzerlik kuralları yayımda test edilmedi ([gestalt](https://registry.npmjs.org/gestalt); [gestalt-skill](https://registry.npmjs.org/gestalt-skill)).

Yerel duman testinde (npm 11.19.1, Node 26.10.0, Claude Code 2.1.309) atılabilir bir paket `npm pack --dry-run` ile beş beklenen dosyayı listeledi, `npx --yes --package=./demo-gestalt-probe-0.0.1.tgz demo-gestalt-probe install` `.claude/skills/gestalt/` altına `SKILL.md` ve `reference/audit.md` yazdı, `claude plugin validate ./proto` uyarılarla geçti; uyarı metni kaydedilmedi. Blueprint canlı Codex veya Cursor oturumunda, `claude -p` altında, Windows'ta ve `skills-ref` ile sınanmadı. Yayım öncesi kontrol sırası bu boşlukları kapatmalıdır: `npm pack --dry-run`, boş dizinde tarball kurulumu, `claude plugin validate . --strict`, `skills-ref validate skills/gestalt`, `claude --plugin-dir .`, gerçek Codex ve Cursor oturumu, ardından güvenilir yayımlama ve `npm view gestalt-skill dist.attestations` **[MÜHENDİSLİK; komutlar kaynaklı]**.

Geliştirme sırası riske göre belirlenmelidir: axe sarmalayıcısı ve gözden geçirme kuyruğu, etiket-denetim yakınlığı, Tab yolu bindirmesi, azaltılmış hareket farkı, rol kapsamlı yakın kopyalar, hizalama ıskası, örtüşme ve görsel üstünde metin, algısal ağaç, en son LLM yargı paketleri **[MÜHENDİSLİK]**. Bu sıra, niyetin bilindiği ve yanlış pozitif riskinin düşük olduğu kurallardan başlar. Her kural etiketli bir veri kümesinde kesinliği yayımlanana kadar danışma düzeyinde kalmalıdır. Duyarlılık etiketli derlem olmadan bilinemez ve "bilinmiyor" olarak raporlanmalıdır.

## Bu raporun kaynak sınırları sonuçları doğrudan sınırlar

Görme bilimi tarafında birincil olarak yalnızca Wertheimer'ın 1938 çevirisi okundu. Wagemans ve arkadaşlarının I. bölümü yaklaşık 405 bin karakterin ilk 200 biniyle sınırlıdır; II. bölüm, Brooks 2015, Koffka 1935 ve Kubovy-van den Berg okunamadı. Bu yüzden Prägnanz'ın basitlik-olabilirlik tartışması ve holizm için yalnızca özet düzeyinde bilgi vardır. Palmer 1992, Palmer ve Rock 1994, Montoro 2017, Quinlan ve Wilton, dikkat, gelişim ve kültür çalışmaları özet veya atıf düzeyindedir. Villalba-García ve arkadaşlarının 2021 çalışması yalnızca arama sonucundan görüldü ve sayfa 403 verdi; bu rapor ona dayanmaz.

HCI tarafında Tullis, Parush, Hornof, Miniukovich ve Das sayıları tam metinle doğrulanmadan basılmamalıdır; hiçbir gruplama manipülasyonu için standart etki büyüklüğü görülmedi ve bu, erişim sınırı kadar literatür sınırı da olabilir. Bonsiepen, Grahame, Purchase ve Rosenholtz-Twarog gruplama modeli için doğrudan kanıt bulunamadı; aramalar erişilebilir kaynaklarla sınırlıdır. Grobelny 2005 sonucu Fitts ve ikon çalışmasıdır, Gestalt kanıtı değildir. Görevlendirmede geçen "UIST 2022 Xie" atfı yanlıştır, doğrusu ESEC/FSE 2022'dir; "Harrison, Chang ve Baudisch" adında bir makale bulunamadı. 2026 tarihli arXiv kayıtları hakem sürecinden geçmiş sayılmamalıdır.

Uygulama ve araç tarafında M3 sayısal aralık token listesi, Polaris'in güncel web bileşeni değerleri, Carbon etiket-girdi mesafesi, GOV.UK düğme grubu aralığı, `display: contents` güncel durumu ve çoğu Baseline bilgisi doğrulanmamıştır. `npx skills`, Claude Code ve Impeccable sürümleri 30 Ekim 2026 gözlemidir ve hızla değişir ([HARNESSES.md](https://github.com/pbakaus/impeccable/blob/main/docs/HARNESSES.md)). Tasarım sistemlerinden aktarılan sayılar sürüme göre değişir, kalıcı standart sayılmamalıdır.

## Sonuç

Bu araştırmanın değiştirdiği soru şudur: "Hangi Gestalt yasası ihlal edildi?" yerine "Bu iddiayı hangi kanıt sınıfı taşıyor ve neyle yanlışlanır?" Rekabet eden faktörler, zayıf insan uyumu ve UI dışı laboratuvar sayıları birlikte düşünüldüğünde bir Gestalt puanı yalnızca bilimsel olarak zayıf değil, ürün olarak da yanıltıcıdır. Skill'in farklılaştırıcı değeri daha çok kural sayısında değil, her bulgunun ölçümünü, eşiğinin kökenini, geçtiği koşulları ve yanlışlayıcısını göstermesinde olacaktır; DOM'un niyet verdiği küçük kural kümesi, geniş ama doğrulanmamış bir katalogdan daha değerlidir.

En büyük fırsat ise ürünü araştırma aracına dönüştürmektir. İnsan etiketli web algısal grup verisi, kural başına yayımlanmış kesinlik ve anlamsal/görsel grup uyumu ölçümleri bu alanda bulunamayan şeylerdir. Skill, kullanıcı onayıyla ve mahremiyet kurallarına uyarak kırpıntı etiketleri toplarsa veya en azından kendi kalibrasyon derlemini açık yayımlarsa, varsayılan eşikleri zamanla mühendislik sezgisinden ölçülmüş davranışa taşıyabilir. O zamana kadar en dürüst ürün iddiası şudur: "Neyi ölçtüğümüzü kesin, ihlal olup olmadığını koşullu söylüyoruz."
