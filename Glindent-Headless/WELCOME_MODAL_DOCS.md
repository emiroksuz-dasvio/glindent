# Welcome Modal Feature - Dokumentasyon

## 🎥 Genel Bakış

Kullanıcılar ilk kez Glindent sitesine girdiğinde otomatik olarak ses ile video oynatılan bir modal gösterilir. Bu feature tasarıma uygun, responsive ve tüm modern tarayıcıları destekler.

---

## 📋 Bileşenler

### 1. **WelcomeModal** (`src/components/welcome-modal/index.tsx`)
Ana modal bileşeni

**Özellikler:**
- ✅ Otomatik video oynatma (ses aktif)
- ✅ ESC tuşu ile kapatma
- ✅ Click overlay ile kapatma
- ✅ Fallback play button (autoplay başarısız olursa)
- ✅ Responsive tasarım
- ✅ Smooth Framer Motion animasyonları
- ✅ Portal render (body'ye direkt)

**Props:**
```tsx
interface WelcomeModalProps {
  isOpen: boolean;        // Modal görünür olup olmadığı
  onClose: () => void;    // Kapatma callback'i
}
```

### 2. **useFirstVisit** Hook (`src/hooks/use-first-visit.ts`)
İlk ziyaret deteksiyonu

**Özellikler:**
- ✅ localStorage kullanarak ziyaret kontrolü
- ✅ Client-side only (SSR uyumlu)
- ✅ Error handling (localStorage yoksa)
- ✅ TypeScript typed

**Return:**
```tsx
{
  isFirstVisit: boolean;  // İlk ziyaret mi?
  hasChecked: boolean;    // Check tamamlandı mı?
}
```

### 3. **Styling** (`src/components/welcome-modal/welcome-modal.module.css`)

**Responsive breakpoints:**
- Desktop (> 768px)
- Tablet (768px - 480px)
- Mobile (< 480px)

**Özellikler:**
- Glindent tema renkleri (#00A89A, #3ACCFF)
- Glass morphism efekt
- Glow shadow'lar
- Smooth transitions

---

## 🎬 Video Dosyaları

### Gerekli Format
Modalda üç format video kullanılır (maximum compatibility):

```
/public/videos/
├── welcome.mp4      (H.264 codec - en yaygın)
├── welcome.webm     (VP9 codec - daha küçük boyut)
└── welcome.ogv      (Theora codec - eski tarayıcılar)
```

### Video Oluşturma

**FFmpeg ile (en kolay):**
```bash
# Basit bir test video oluştur
ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=10 -f lavfi -i sine=f=1000:d=10 -c:v libx264 -c:a aac -pix_fmt yuv420p welcome.mp4
```

**Python Script ile (otomatik):**
```bash
cd Glindent-Headless
python create-welcome-video.py
```

Bu script:
- PIL ile frame'ler oluşturur
- FFmpeg ile video'ya dönüştürür
- 3 farklı format'ta kaydeder
- Temp dosyaları temizler

**Manuel Video Hazırlama:**
Kendi videoyu kullanmak istiyorsan:
```bash
# Videoyu MP4'e dönüştür
ffmpeg -i your-video.mov -c:v libx264 -c:a aac -pix_fmt yuv420p welcome.mp4

# WebM'e dönüştür
ffmpeg -i welcome.mp4 -c:v libvpx-vp9 -b:v 1M welcome.webm

# Ogg'a dönüştür
ffmpeg -i welcome.mp4 -c:v libtheora -q:v 7 welcome.ogv
```

---

## 🔧 Kurulum ve Kullanım

### 1. Bileşenleri Ekle ✅ (Yapılmış)
```
src/components/welcome-modal/
├── index.tsx
└── welcome-modal.module.css

src/hooks/
└── use-first-visit.ts
```

### 2. App'e Entegre Et ✅ (Yapılmış)
`src/pages/_app.tsx`'de:
```tsx
import { WelcomeModal } from "src/components/welcome-modal";
import { useFirstVisit } from "src/hooks/use-first-visit";

// Bileşende:
const { isFirstVisit, hasChecked } = useFirstVisit();

// JSX'de:
{hasChecked && <WelcomeModal isOpen={isFirstVisit && isHomePage} onClose={() => {}} />}
```

### 3. Video Dosyalarını Ekle
Video dosyaları oluştur ve `/public/videos/` klasörüne koy:
```bash
python create-welcome-video.py
# veya manuel olarak video ekle
```

---

## 🎨 Tasarım & Özelleştirme

### Renkleri Değiştir
`welcome-modal.module.css` dosyasında:
```css
.modalContent {
  box-shadow: 0 0 120px rgba(0, 168, 154, 0.4),  /* Primary color */
              0 0 60px rgba(58, 204, 255, 0.2);    /* Secondary color */
  border: 1px solid rgba(0, 168, 154, 0.3);
}
```

### Metin Değiştir
`src/components/welcome-modal/index.tsx` dosyasında:
```tsx
<div className={styles.brandText}>
  <h1>Welcome to Glindent</h1>          {/* Burası */}
  <p>Discover premium dental supplies</p> {/* Burası */}
</div>
```

### Animasyonları Değiştir
Framer Motion variants'ları düzenle:
```tsx
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.9, opacity: 0 }}
transition={{ duration: 0.3 }}
```

---

## 🔄 Tarayıcı Desteği

| Tarayıcı | MP4 | WebM | Ogg | Status |
|----------|-----|------|-----|--------|
| Chrome | ✅ | ✅ | ❌ | Full |
| Firefox | ✅ | ✅ | ✅ | Full |
| Safari | ✅ | ❌ | ❌ | Fallback |
| Edge | ✅ | ✅ | ❌ | Full |
| Opera | ✅ | ✅ | ✅ | Full |
| Mobile Safari | ✅ | ❌ | ❌ | Fallback |

**Not:** CSS media queries mobil cihazlarda video responsive boyuttadır.

---

## ⚡ Performans

**Optimizasyon Teknikleri:**
- ✅ CSS Module (no global pollution)
- ✅ Lazy loaded component (portal render)
- ✅ Efficient re-renders (controlled state)
- ✅ Video formats compression (WebM < MP4)
- ✅ localStorage caching (sadece 1 kez yüklenir)

**File Sizes (Tipik):**
- welcome.mp4: ~2-3 MB
- welcome.webm: ~1-1.5 MB (daha kompakt)
- welcome.ogv: ~2-2.5 MB

---

## 🐛 Sorun Giderme

### Problem: Video Oynatılmıyor
**Çözüm:**
1. Video dosyasının `/public/videos/`'de olduğunu kontrol et
2. Video codec'lerinin doğru olduğunu kontrol et (`ffmpeg -i video.mp4`)
3. Browser console'da hata kontrol et

### Problem: Autoplay Çalışmıyor
**Neden:** Tarayıcı müteşebbis sesli video autoplay'ını engeller
**Çözüm:** Fallback play button otomatik gösterilir

### Problem: Modal İlk Ziyarette Görünmüyor
**Kontrol et:**
1. Browser localStorage'u açık mı?
2. Private/Incognito modda mısın? (localStorage devre dışı)
3. console'da `localStorage.getItem('glindent_first_visit')` kontrol et

### Problem: Modal Mobilde Kapalı Görünüyor
**Çözüm:** CSS'de aspect-ratio fallback var, gereken tarayıcı desteği kontrolü yapıldı

---

## 🔑 Önemli Notlar

### localStorage Kullanım
- Key: `glindent_first_visit`
- Value: `'true'`
- Persistent: Yes (localStorage kaldırılana kadar)

**Kullanıcı localStorage'u temizlerse:**
Modal bir sonraki ziyarette tekrar gösterilir (intended behavior)

### Ses Desteği
- Video html'de `autoplay` false (user gesture gerekli)
- 300ms delay sonra otomatik oynatılmaya çalışılır
- Fallback: Manual play button

### Keyboard Navigation
- ESC: Modal kapat
- Focus management: closeButton ve playButton'a Tab ile erişilebilir

---

## 📚 Dosya Referansları

- **Main Component:** [welcome-modal/index.tsx](./src/components/welcome-modal/index.tsx)
- **Styles:** [welcome-modal.module.css](./src/components/welcome-modal/welcome-modal.module.css)
- **Hook:** [use-first-visit.ts](./src/hooks/use-first-visit.ts)
- **App Integration:** [_app.tsx](./src/pages/_app.tsx)
- **Video Generator:** [create-welcome-video.py](./create-welcome-video.py)

---

## ✨ Gelecek Geliştirmeler

Mümkün iyileştirmeler:
- [ ] Video volüm kontrolü
- [ ] Skip option (X saniye sonra)
- [ ] Lokalize metin (TR/EN)
- [ ] Pixel-perfect responsive (current iyi ama daha optimize edilebilir)
- [ ] Analytics (user ne zaman kapatıyor)
- [ ] Admin panelde metin/video değiştirme

---

**Hazırlayan:** Glindent Development Team  
**Tarih:** 2026-02-02  
**Versiyon:** 1.0
