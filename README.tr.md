# gestalt-skill

Web arayüzlerini Gestalt algısına göre denetleyen, üreten ve onaran bir ajan skill'i ile tarayıcı dedektörü. Her bulgu, kanıtının ne kadar güçlü olduğuyla etiketlenir.

> **Durum: ilk taslak.** Kurallar çalışıyor ve test fikstürlerini geçiyor, ancak gerçek sayfalardaki isabet oranları henüz ölçülmedi. Sezgisel eşikler kalibre edilmedi.

## Yaklaşım

- **Puan yok.** Doğrulanmış bir Gestalt puanı yok. Bulgular `normative_failure`, `measured`, `candidate` ve `judged` olarak ayrılır.
- **Uydurma sayı yok.** "1,5x boşluk" nokta kafeslerinden gelir, arayüzlerden değil. Sezgisel eşikler öyle etiketlenir ve ayarlanabilir.
- **Grup yalnızca ekranda kalmamalı.** Görsel gruplar sekme sırası, anlamsal yapı, dar genişlik ve azaltılmış hareketle karşılaştırılır.

Kaynaklar [skills/gestalt/REFERENCES.md](skills/gestalt/REFERENCES.md) dosyasında, tam araştırma [docs/research](docs/research) klasöründe.

## Kurulum

Node 22+ gerekir. Dedektör için Chrome, Edge veya Chromium da kurulu olmalı.

```bash
npx gestalt-skill install
```

## Ajan komutları

| Komut | Ne yapar |
|---|---|
| `/gestalt audit [hedef]` | Sayfayı ölçer, her adayı karara bağlar, etiketli yargılar ekler |
| `/gestalt generate [brief]` | Gruplama planı yazar, ondan üretir, doğrular |
| `/gestalt fix [hedef]` | Ortak nedene göre en zayıf yeterli işaretle onarır, başlangıç raporuyla yeniden ölçer |
| `/gestalt explain [konu]` | Bir ilkeyi, kanıtını ve sınırlarını açıklar |

## Terminal komutları

```bash
npx gestalt-skill detect ./site --json --out once.json
```

```bash
npx gestalt-skill detect ./site --baseline once.json
```

```bash
npx gestalt-skill rules
```

Çıkış kodu: 0 bulgu yok, 2 bulgu var, 1 tarama başarısız. Ayrıntılar için [İngilizce README](README.md).

## Lisans

MIT
