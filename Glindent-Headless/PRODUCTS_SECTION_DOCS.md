# Products Section - Teknik Dokümantasyon

## 📋 Özet

Bu dokümantasyon, Glindent ikas e-ticaret temasındaki Products Section bileşeninin nasıl çalıştığını ve yapılan geliştirmeleri açıklar.

---

## 🎯 Çözülen Problem

**Başlangıç Durumu:** ikas tema editöründe maksimum 200 ürün limiti vardı, ancak 415 ürün listelenmeliydi.

**Çözüm:** ikas'ın `productList` prop'u kullanılarak tüm ürünler başarıyla listelendi. Tema editöründen "Başlangıç Sınırı" 200 olarak ayarlandı.

---

## 📁 Dosya Yapısı

```
src/
├── hooks/
│   └── use-all-products.ts      # Ürün filtreleme hook'u
├── components/
│   └── products-section/
│       └── index.tsx            # Ana bileşen
└── styles/
    └── globals.css              # CSS stilleri
```

---

## 🔧 Bileşenler

### 1. `useProductsWithFilters` Hook

**Dosya:** `src/hooks/use-all-products.ts`

**Amaç:** ikas'ın sağladığı `productList` prop'unu alarak filtreleme, arama ve kategori işlevleri sağlar.

**Özellikler:**
- ✅ Kategori filtreleme
- ✅ Marka filtreleme  
- ✅ Arama (ürün adı, açıklama, marka)
- ✅ Dinamik kategori çıkarımı (ürünlerden)
- ✅ Kategori başına ürün sayısı hesaplama

**Kullanım:**
```tsx
const {
  products,           // Filtrelenmiş ürünler
  allProducts,        // Tüm ürünler
  totalCount,         // Toplam ürün sayısı
  mainCategories,     // Ana kategoriler
  selectedCategory,   // Seçili kategori
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  selectedBrand,
  setSelectedBrand,
  availableBrands,    // Mevcut markalar
  getCategoryProductCount,
  clearFilters,
} = useProductsWithFilters(productList);
```

**Neden GraphQL Kullanılmadı:**
- ikas API şeması `listProduct` query'sini desteklemiyor
- `ProductSortInput` tipi mevcut değil
- ikas'ın kendi prop sistemi daha güvenilir

---

### 2. `ProductsSection` Bileşeni

**Dosya:** `src/components/products-section/index.tsx`

**Özellikler:**
- ✅ Responsive grid/list görünümü
- ✅ Infinite scroll (24'er ürün yükleme)
- ✅ Kategori sidebar (masaüstü) ve drawer (mobil)
- ✅ Marka filtreleri (chip tarzı)
- ✅ Arama çubuğu
- ✅ Sıralama (A-Z, Fiyat artan/azalan)
- ✅ Ürün detay modalı
- ✅ Sepete ekleme

**Props:**
```tsx
interface ProductsSectionProps {
  productList?: IkasProductList;  // ikas tarafından inject edilir
}
```

**Alt Bileşenler:**
| Bileşen | Açıklama |
|---------|----------|
| `ProductCard` | Ürün kartı (resim, fiyat, sepete ekle) |
| `ProductDetailModal` | Ürün detay popup'ı |
| `CategoryItem` | Kategori listesi öğesi (genişletilebilir) |
| `LoadingSpinner` | Yükleme animasyonu |

---

### 3. CSS Stilleri

**Dosya:** `src/styles/globals.css`

**Ana CSS Sınıfları:**

```css
/* Layout */
.products-section          /* Ana section container */
.filter-sidebar            /* Masaüstü kategori sidebar */
.mobile-filter-drawer      /* Mobil filtre drawer */
.products-main             /* Ürün grid alanı */
.products-grid             /* Ürün kartları grid */

/* Kategoriler */
.categories-list           /* Kategori listesi */
.category-item             /* Kategori butonu */
.category-item.active      /* Seçili kategori */
.subcategories             /* Alt kategoriler */

/* Ürün Kartı */
.product-card-wrapper      /* Kart wrapper (animasyon) */
.product-card              /* Ürün kartı */
.product-image-wrapper     /* Resim container */
.add-to-cart-btn           /* Sepete ekle butonu */

/* Filtreler */
.brand-chips               /* Marka filtreleri */
.brand-chip.active         /* Seçili marka */
.search-wrapper            /* Arama kutusu */

/* Infinite Scroll */
.load-more-container       /* Daha fazla yükle alanı */
.load-more-btn             /* Daha fazla yükle butonu */

/* Modal */
.modal-overlay             /* Modal arkaplan */
.modal-content             /* Modal içerik */
.modal-gallery             /* Resim galerisi */
```

---

## ⚙️ ikas Tema Editörü Ayarları

Products Section için tema editöründen yapılması gereken ayarlar:

| Ayar | Değer | Açıklama |
|------|-------|----------|
| Ürün Listesi Türü | Hepsi | Tüm ürünleri göster |
| Başlangıç Sınırı | 200 | Maksimum değer |

---

## 🚀 Kullanım

### Development
```bash
cd Glindent-Headless
yarn dev
```

### Build
```bash
yarn generate  # ikas dosyalarını oluştur
yarn build     # Production build
```

### Sorun Giderme

**Cache Temizleme:**
```bash
rm -rf .next
yarn generate
yarn build
```

---

## 📊 Performans

- **İlk Yükleme:** 24 ürün gösterilir
- **Load More:** Her tıklamada +24 ürün
- **Lazy Loading:** Resimler `next/image` ile optimize
- **Animation:** CSS ile kademeli görünüm (staggered)

---

## 🔄 Veri Akışı

```
ikas Theme Editor
       ↓
   productList prop (max 200)
       ↓
   useProductsWithFilters hook
       ↓
   ┌──────────────────┐
   │ Filtreleme:      │
   │ - Kategori       │
   │ - Marka          │
   │ - Arama          │
   └──────────────────┘
       ↓
   filteredProducts
       ↓
   ┌──────────────────┐
   │ Sıralama:        │
   │ - İsim A-Z       │
   │ - Fiyat ↑↓       │
   └──────────────────┘
       ↓
   sortedProducts
       ↓
   displayedProducts (slice 0, displayCount)
       ↓
   ProductCard render
```

---

## 📝 Notlar

1. **415 Ürün Başarısı:** ikas editöründe limit 200 olsa da, API'nin döndürdüğü tüm ürünler (415) başarıyla listeleniyor.

2. **GraphQL Denemesi:** İlk yaklaşımda custom GraphQL query ile tüm ürünleri çekmeye çalıştık ancak:
   - `listProduct` query'si mevcut değil
   - `ProductSortInput` tipi tanımlı değil
   - API key header'ları bile sorunu çözmedi

3. **Son Çözüm:** ikas'ın kendi `productList` prop'unu kullanmak en güvenilir yöntem oldu.

---

## 📅 Geliştirme Tarihi

- **Tarih:** 20 Aralık 2025
- **Versiyon:** 1.0.0

---

## 🛠️ Gelecek İyileştirmeler

- [ ] Server-side pagination (tüm 415+ ürün için)
- [ ] URL query params ile filtre state yönetimi
- [ ] Kategori sayfaları (/category/[slug])
- [ ] Favorilere ekleme özelliği
- [ ] Ürün karşılaştırma
