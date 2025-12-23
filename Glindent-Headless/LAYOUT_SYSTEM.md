# Layout System - Glindent Headless

## 📋 Overview

Glindent ikas headless temasında **iki farklı layout** sistemi kullanılmaktadır:

1. **MainLayout** - Ana sayfa için horizontal scroll layout
2. **DefaultLayout** - Diğer tüm sayfalar için standart vertical scroll layout

## 🏗️ Architecture

### File Structure

```
src/
├── layouts/
│   ├── MainLayout.tsx          # Horizontal scroll (homepage only)
│   └── DefaultLayout.tsx       # Standard pages (cart, checkout, etc)
├── components/
│   ├── horizontal-layout/      # Horizontal scroll logic
│   ├── header/                 # Navigation header
│   ├── header-wrapper/         # Header positioning wrapper
│   └── ...
├── pages/
│   ├── _app.tsx                # Main app with layout routing
│   ├── index.tsx               # Homepage (uses MainLayout)
│   ├── cart.tsx                # Cart page (uses DefaultLayout)
│   └── checkout.tsx            # Checkout page (uses DefaultLayout)
└── styles/
    ├── global.css              # Base styles
    └── globals.css             # Component & layout styles
```

## 📄 Page Layouts

### Homepage (`/`)
```
_app.tsx
  └── MainLayout
        └── NavigationProvider (horizontal scroll context)
              └── HorizontalLayout Component
                    ├── Header (fixed, part of horizontal scroll)
                    ├── HeroBanner (Section 0)
                    ├── AboutSection (Section 1)
                    ├── ProductsSection (Section 2)
                    ├── FAQSection (Section 3)
                    └── ContactSection (Section 4)
```

**Features:**
- Horizontal scroll navigation
- 5 full-width sections
- Touch/wheel/keyboard navigation
- Fixed header within scroll context
- Hidden scrollbars
- `overflow: hidden` on html/body

### Other Pages (`/cart`, `/checkout`, etc.)
```
_app.tsx
  └── DefaultLayout
        └── Page Component
              ├── Header (fixed, standard positioning)
              ├── Page Content
              └── Footer (optional)
```

**Features:**
- Standard vertical scroll
- Fixed header with backdrop blur
- Proper content padding for header
- Visible styled scrollbars
- Normal overflow behavior

## 🔧 Implementation Details

### _app.tsx - Layout Routing

```tsx
const IkasThemeApp: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  const router = useRouter();
  
  const isHomePage = router.pathname === "/" || router.pathname === "/index";
  const isCheckoutPage = router.pathname.startsWith("/checkout");

  return (
    <>
      {/* Background Elements - Always visible */}
      <AnimatedBackground />
      <GrainOverlay />
      {!isCheckoutPage && <ToothParticles />}
      
      {/* Layout Selection */}
      {isHomePage ? (
        <MainLayout>
          <NavigationProvider>
            <Component {...pageProps} />
          </NavigationProvider>
        </MainLayout>
      ) : (
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      )}
    </>
  );
};
```

### MainLayout.tsx

Horizontal scroll için gerekli CSS'i inject eder:

```css
html, body {
  overflow: hidden !important;
  height: 100vh;
  width: 100vw;
}
```

### DefaultLayout.tsx

Standard scroll için gerekli CSS'i inject eder:

```css
html, body {
  overflow-x: hidden;
  overflow-y: auto;
  height: auto;
  min-height: 100vh;
}
```

## 🎨 CSS Organization

### Global Styles (`globals.css`)

**Base Styles** (Variables, resets, animations)
```css
:root { /* CSS variables */ }
* { /* Reset */ }
body { /* Base font, colors */ }
```

**Component Styles**
- `.animated-background` - Gradient orbs
- `.grain-overlay` - Texture overlay
- `.glass` - Glass morphism effect

**Layout-Specific Styles**
- `.default-layout` - Standard page wrapper
- `.cart-page`, `.checkout-page` - Page containers
- `.header-wrapper` - Header positioning

### Inline Styles (Components)

ikas bileşenlerinde **CSS Modules kullanılamaz**, sadece inline styles:

```tsx
const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    padding: "24px",
    // ...
  }
};

return <div style={styles.container}>...</div>;
```

## 🐛 Fixed Issues

### Problem 1: Layout Conflicts
**Önceki Durum:** Homepage'in horizontal scroll CSS'i diğer sayfalarda da aktifti, scroll çalışmıyordu.

**Çözüm:** Ayrı layout componentleri oluşturuldu. Her layout kendi CSS'ini inject ediyor.

### Problem 2: Header Positioning
**Önceki Durum:** Header farklı sayfalarda farklı davranıyordu, cart/checkout'ta üstte kalmıyordu.

**Çözüm:** `HeaderWrapper` component ile sayfa tipine göre positioning yapılıyor.

### Problem 3: Content Overlap
**Önceki Durum:** Checkout sayfasında content header'ın altında kalıyordu.

**Çözüm:** `DefaultLayout` content padding-top ekliyor, z-index düzenlemeleri yapıldı.

### Problem 4: Footer Positioning
**Önceki Durum:** Footer sayfanın ortasında kalabiliyordu.

**Çözüm:** `DefaultLayout` flex layout kullanıyor, content `flex: 1` ile genişliyor.

## 📝 Usage Guidelines

### Adding a New Page

1. **Homepage benzeri sayfa** (horizontal scroll):
```tsx
// _app.tsx içinde
const isSpecialPage = router.pathname === "/special";

{isHomePage || isSpecialPage ? (
  <MainLayout>...</MainLayout>
) : (
  <DefaultLayout>...</DefaultLayout>
)}
```

2. **Standard sayfa** (vertical scroll):
Otomatik olarak `DefaultLayout` kullanılır, ek kod gerekmez.

### Creating Components

**ikas Components (inline styles):**
```tsx
import { observer } from "mobx-react-lite";
import { useStore } from "@ikas/storefront";
import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  // Styles here
};

const MyComponent = observer(() => {
  const store = useStore();
  return <div style={styles.container}>...</div>;
});

export default MyComponent;
```

**Regular Components (CSS allowed):**
Standard React componentlerde CSS Modules veya styled-jsx kullanılabilir.

## 🔍 Debugging Tips

### Layout not working?
1. Check `_app.tsx` - doğru layout seçiliyor mu?
2. Browser console'da CSS çakışması var mı?
3. `html` ve `body` overflow değerlerini kontrol et

### Header position issues?
1. `HeaderWrapper` kullanılıyor mu?
2. `.header-homepage` vs `.header-standard` class'ları doğru mu?
3. z-index çakışması var mı?

### Content not visible?
1. z-index değerlerini kontrol et (background: 0-50, content: 10+, header: 100)
2. Padding top var mı? (`DefaultLayout` otomatik ekler)
3. `position: relative` eksik olabilir

## 🚀 Performance

- **Code Splitting:** Layout components lazy-load edilmiyor (küçük dosyalar)
- **CSS Injection:** Her layout sadece kendi CSS'ini inject eder
- **Background Elements:** Tüm sayfalarda paylaşımlı (optimize)

## 📚 Related Files

- `/src/layouts/MainLayout.tsx` - Horizontal scroll layout
- `/src/layouts/DefaultLayout.tsx` - Standard layout
- `/src/pages/_app.tsx` - Layout routing
- `/src/components/horizontal-layout/` - Horizontal scroll logic
- `/src/components/header-wrapper/` - Header positioning
- `/src/styles/globals.css` - Global CSS with layout fixes

## 🔄 Migration Notes

Eski sistemden yeni sisteme geçiş:

1. ✅ `NavigationProvider` sadece homepage'de kullanılıyor
2. ✅ Layout-specific CSS componentlere taşındı
3. ✅ Header her iki layout için uyumlu
4. ✅ Cart/checkout sayfaları düzeltildi
5. ✅ Footer positioning düzeltildi

---

**Last Updated:** December 23, 2025
**Author:** USER
**Status:** ✅ Production Ready
