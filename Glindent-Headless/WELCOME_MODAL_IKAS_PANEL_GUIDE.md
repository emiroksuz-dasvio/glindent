# Welcome Modal - ikas Panel Integration Rehberi

## 📱 ikas Panel'de Welcome Modal Nasıl Kullanılır?

ikas panel'inde Welcome Modal artık standart bir section/component olarak kullanılabilir.

---

## 🎯 Panel'de Video URL'si Nasıl Eklenir?

### Adım 1: ikas Panel'ini Aç
1. ikas admin paneline git: https://ikas.com (veya senin store'unun admin linki)
2. "Theme Editor" / "Tema Editörü" bölümüne git
3. İstediğin sayfada section ekle

### Adım 2: Welcome Modal Section'ı Ekle
1. **"+ Bölüm Ekle"** / **"+ Add Section"** butonuna tıkla
2. Seç: **"Welcome Modal"** (şimdi kullanılabilir olmalı)
3. Section eklenecek

### Adım 3: Video URL Ayarla
Panel'de şu alanlar göreceksin:

| Alan | Açıklama | Örnek |
|------|----------|--------|
| **Video URL** | Ana video dosyası (MP4 tercih) | `/videos/welcome.mp4` |
| **Video MP4 URL** | MP4 format video | `https://example.com/video.mp4` |
| **Video WebM URL** | WebM format video (opsiyonel) | `https://example.com/video.webm` |
| **Video Ogg URL** | Ogg format video (opsiyonel) | `https://example.com/video.ogv` |
| **Başlık** | Modal başlığı | `Welcome to Glindent` |
| **Alt Başlık** | Alt başlık metni | `Discover premium dental supplies` |
| **Autoplay Etkinle** | Videoyu otomatik oynat | true/false |
| **Sadece İlk Ziyarette Göster** | localStorage kullanarak | true/false |

### Adım 4: Değerleri Gir
```
Video URL:                 https://your-cdn.com/videos/welcome.mp4
Video MP4 URL:             https://your-cdn.com/videos/welcome.mp4
Video WebM URL:            https://your-cdn.com/videos/welcome.webm
Video Ogg URL:             https://your-cdn.com/videos/welcome.ogv
Başlık:                    Welcome to Glindent
Alt Başlık:                Discover premium dental supplies
Autoplay Etkinle:          ✓ (checked)
Sadece İlk Ziyarette Göster: ✓ (checked)
```

### Adım 5: Kaydet ve Yayınla
1. Panel'de **"Kaydet"** / **"Save"** butonuna tıkla
2. **"Yayınla"** / **"Publish"** butonuna tıkla
3. Siteyi yenile ve modal'ı gör

---

## 🎬 Video URL Örnekleri

### Lokal Video (Siteye Yüklü)
```
Video URL: /videos/welcome.mp4
```
Koşul: `public/videos/welcome.mp4` dosyasının olması gerekir

### Cloudinary (CDN)
```
Video URL: https://res.cloudinary.com/yourcloud/video/upload/v123456/welcome.mp4
```

### AWS S3
```
Video URL: https://your-bucket.s3.amazonaws.com/videos/welcome.mp4
```

### Vercel Blob / Upstash
```
Video URL: https://yourdomain.vercel.app/api/videos/welcome.mp4
```

---

## 🔧 Props Referansı

### TypeScript Interface
```typescript
type WelcomeModalProps = {
  videoUrl?: string;                // Ana video URL
  videoMp4Url?: string;             // MP4 format
  videoWebmUrl?: string;            // WebM format (opsiyonel)
  videoOgvUrl?: string;             // Ogg format (opsiyonel)
  title?: string;                   // Başlık metni
  subtitle?: string;                // Alt başlık metni
  enableAutoplay?: boolean;         // Otomatik oynatma
  showOnlyFirstVisit?: boolean;     // localStorage ile track
}
```

### Default Değerler
```
videoUrl:            '/videos/welcome.mp4'
videoMp4Url:         '/videos/welcome.mp4'
videoWebmUrl:        '/videos/welcome.webm'
videoOgvUrl:         '/videos/welcome.ogv'
title:               'Welcome to Glindent'
subtitle:            'Discover premium dental supplies'
enableAutoplay:      true
showOnlyFirstVisit:  true
```

---

## 🎯 Use Cases

### Use Case 1: Seasonal Welcome Video
**Senaryo:** Yılbaşında özel video göstermek istiyorsun

**Panel Ayarları:**
```
Video URL: https://cdn.example.com/newyear-video.mp4
Başlık: Happy New Year! 🎉
Alt Başlık: Special offers inside
Sadece İlk Ziyarette Göster: false (her ziyarette göster)
```

### Use Case 2: Silent Product Demo
**Senaryo:** Sesiz ürün demo videosu

**Panel Ayarları:**
```
Video URL: https://cdn.example.com/product-demo.mp4
Başlık: See Our Products in Action
Alt Başlık: Watch how Glindent works
Autoplay Etkinle: true
Sadece İlk Ziyarette Göster: true
```

### Use Case 3: Brand Story
**Senaryo:** Marka hikayesi videosu (uzun, seçmeli)

**Panel Ayarları:**
```
Video URL: https://cdn.example.com/brand-story.mp4
Başlık: Glindent's Story
Alt Başlık: Trusted by dental professionals
Autoplay Etkinle: false (kullanıcı manuel oynatır)
Sadece İlk Ziyarette Göster: true
```

---

## 📊 Video Format Seçimi

### MP4 (Recommendation)
- ✅ Tüm tarayıcılarda desteklenir
- ✅ Dosya boyutu orta
- ❌ Daha az kompresyon

**Kullan:** `videoUrl` ve `videoMp4Url` alanlarında

### WebM (Best Compression)
- ✅ Küçük dosya boyutu (~40% daha az)
- ✅ Modern tarayıcılarda çalışır
- ❌ Safari'de desteklenmez

**Kullan:** `videoWebmUrl` alanında

### Ogg (Legacy Support)
- ✅ Eski Firefox ve Opera'da
- ❌ Çoğu yerde desteklenmez
- ❌ Büyük dosya boyutu

**Kullan:** `videoOgvUrl` alanında (fallback)

### Tavsiye Yapısı
```
1. Ana: MP4 (videoUrl)         ← Çoğu kişi bunu kullanır
2. Backup: WebM (videoWebmUrl) ← Modern tarayıcılar bunu tercih eder
3. Legacy: Ogg (videoOgvUrl)   ← Çok eski tarayıcılar
```

---

## 🚀 Panel'den Video Yükleme

### Seçenek 1: CDN/Cloudinary'ye Yükle ve Link Yapıştır
1. Videoyu Cloudinary'ye yükle
2. URL'yi kopyala
3. Panel'de `videoUrl` alanına yapıştır

**Komut:**
```bash
# Cloudinary CLI ile
cloudinary uploader upload_large video.mp4 \
  -resource_type video \
  -public_id "welcome"
```

### Seçenek 2: AWS S3'e Yükle
```bash
aws s3 cp welcome.mp4 s3://your-bucket/videos/
```

Panel'de:
```
videoUrl: https://your-bucket.s3.amazonaws.com/videos/welcome.mp4
```

### Seçenek 3: Lokal Sunucuya Yükle
1. `public/videos/` klasörüne `welcome.mp4` dosyasını koy
2. Panel'de:
```
videoUrl: /videos/welcome.mp4
```

---

## ✨ İpuçları & Best Practices

### 1. Video Boyutunu Optimize Et
```bash
# FFmpeg ile sıkıştır
ffmpeg -i welcome.mp4 \
  -c:v libx264 -preset fast -crf 28 \
  -c:a aac -b:a 128k \
  welcome-optimized.mp4
```

**Sonuç:** 50% daha küçük dosya

### 2. Multiple Format Sağla
- MP4: Ana format
- WebM: Modern tarayıcılar (daha küçük)
- Ogg: Fallback

### 3. Uygun Başlık Yaz
- Kısa (< 30 karakter)
- İlgi çekici
- Actionable

Kötü: `Video`  
İyi: `Discover Our Premium Products`

### 4. İlk Ziyareti Akıllıca Kullan
- `showOnlyFirstVisit: true` = Sadece ilk ziyarette
- `showOnlyFirstVisit: false` = Her ziyarette (kampanya için)

### 5. Autoplay Kontrol Et
- `enableAutoplay: true` = Otomatik oynat (çoğu durumda)
- `enableAutoplay: false` = Manuel oynat (uzun videolar)

---

## 🐛 Sorun Giderme

### Problem: Video Oynatılmıyor
**Panel'de kontrol et:**
1. `videoUrl` boş mu?
2. URL geçerli mi? (https:// ile başla)
3. Video dosyası var mı?

```
Doğru:    https://cdn.example.com/video.mp4
Yanlış:   cdn.example.com/video.mp4
Yanlış:   /video.mp4 (lokal değilse)
```

### Problem: Modal Açılmıyor
**Check:**
1. `showOnlyFirstVisit: true` ise localStorage silinecek
2. Console'da hata var mı? (F12 → Console)
3. Mobile'da testa yap (farklı cihazlar)

### Problem: Ses Oynatılmıyor
**Tarayıcı politikası:**
- Chrome/Firefox: "Muted autoplay" sadece izin verilir
- Safari: İnsan etkileşimi gerekli

**Çözüm:** Play button gösterilir, kullanıcı oynat düğmesine tıklar

---

## 📱 Mobile Optimize Etme

### Video Dosya Boyutu
```
Desktop (1920x1080):  2-3 MB (MP4)
Mobile (1280x720):    1-1.5 MB (MP4)
```

Panel'de farklı URL'ler kullan:
```
videoMp4Url: https://cdn.example.com/welcome-1080p.mp4
(Mobil otomatik olarak daha küçük boyut seçer)
```

### Responsive Breakpoints
- Desktop: 100% genişlik, max 900px
- Tablet: 90% genişlik
- Mobile: 100% genişlik, otomatik yükseklik

(CSS'de ayarlanmış, panel'de değiştirilmez)

---

## 📊 Analytics & Tracking

Panel'de video engagement izlenebilir:
```javascript
// Bonus: Custom event tracking (gelecek)
gtag('event', 'welcome_modal_view');
gtag('event', 'welcome_video_play');
gtag('event', 'welcome_modal_close');
```

---

## 🎬 Örnek Panel Konfigürasyonu

### Production Setup
```
Video URL:              https://your-cdn.com/videos/welcome.mp4
Video MP4 URL:          https://your-cdn.com/videos/welcome.mp4
Video WebM URL:         https://your-cdn.com/videos/welcome.webm
Video Ogg URL:          https://your-cdn.com/videos/welcome.ogv
Başlık:                 Premium Dental Supplies
Alt Başlık:             Trusted by Professionals
Autoplay Etkinle:       ✓
Sadece İlk Ziyarette:   ✓
```

### Testing Setup
```
Video URL:              http://localhost:3333/videos/welcome.mp4
Video MP4 URL:          http://localhost:3333/videos/welcome.mp4
Video WebM URL:         (boş)
Video Ogg URL:          (boş)
Başlık:                 TEST - Welcome Modal
Alt Başlık:             Testing...
Autoplay Etkinle:       ✓
Sadece İlk Ziyarette:   ✗ (Her ziyarette görmek için)
```

---

## 📚 Referanslar

- [WelcomeModal Component](./index.tsx)
- [ikas Panel Documentation](https://ikas.dev/docs)
- [Video Format Guide](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [localStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Son Güncelleme:** 2026-02-02  
**Versiyon:** 1.0  
**Durum:** ✅ Production Ready
