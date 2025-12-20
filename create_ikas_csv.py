# -*- coding: utf-8 -*-
"""
ikas Import CSV Generator - v2
Glindent Dental Supplies
"""

import pandas as pd

# Mevcut CSV'yi oku
df = pd.read_csv(r'C:\Users\MONSTER\OneDrive\Belgeler\GitHub\glindent\ikas_import\ikas_products_import.csv')

# Sorunlu isimleri duzelt
def fix_name(row):
    name = row['name']
    if name.startswith('SKU -'):
        sku = row['sku']
        shade = row['shade']
        if 'NHZR' in sku:
            return f"G-Dent Nano Hybrid ZR Composite 4g - {shade}"
        elif 'NHC' in sku:
            return f"G-Dent Nano Hybrid Composite 4g - {shade}"
    return name

df['name'] = df.apply(fix_name, axis=1)

# ikas'in bekledigi tam format (resimdeki siraya gore)
ikas_df = pd.DataFrame()

# ZORUNLU ALANLAR
ikas_df['Ad'] = df['name']
ikas_df['Sku'] = df['sku']

# ONEMLI ALANLAR
ikas_df['Aciklama'] = df['description'].fillna('')
ikas_df['Kategoriler'] = df['category']
ikas_df['Marka'] = df['brand']
ikas_df['Etiketler'] = df['tags'].fillna('')

# FIYAT ALANLARI (bos - sonra eklenecek)
ikas_df['Satis Fiyati'] = ''
ikas_df['Alis Fiyati'] = ''
ikas_df['Indirimli Fiyat'] = ''

# STOK
ikas_df['Stok'] = df['stock'].fillna(100)

# DESI
ikas_df['Desi'] = ''

# GORSEL
ikas_df['Gorsel URL'] = ''

# SEO
ikas_df['Metadata Baslik'] = df['name']
ikas_df['Metadata Aciklamasi'] = df['description'].str[:160].fillna('')
ikas_df['Slug'] = df['sku'].str.lower().str.replace(' ', '-')

# TIP
ikas_df['Tip'] = 'simple'

# DIGER
ikas_df['Barkod Listesi'] = df['sku']
ikas_df['Varyant Aktiflik'] = 'true'
ikas_df['Stogu tukenince satmaya devam et'] = 'false'

# Kaydet
output = r'C:\Users\MONSTER\OneDrive\Belgeler\GitHub\glindent\ikas_import\ikas_urunler_v2.csv'
ikas_df.to_csv(output, index=False, encoding='utf-8-sig')

print("=" * 60)
print("IKAS ICE AKTARMA CSV - v2")
print("=" * 60)
print(f"\nDosya: {output}")
print(f"Toplam urun: {len(ikas_df)}")
print(f"\nSutunlar ({len(ikas_df.columns)} adet):")
for col in ikas_df.columns:
    print(f"  - {col}")

print("\n" + "=" * 60)
print("ORNEK SATIRLAR")
print("=" * 60)
print(ikas_df[['Ad', 'Sku', 'Kategoriler', 'Marka', 'Stok']].head(10).to_string())

print("\n" + "=" * 60)
print("KATEGORI LISTESI (ikas'ta olusturulmali)")
print("=" * 60)
categories = df['category'].unique()
for cat in sorted(categories):
    print(f"  {cat}")
    
print("\n" + "=" * 60)
print("MARKA LISTESI (ikas'ta olusturulmali)")
print("=" * 60)
brands = df['brand'].unique()
for brand in sorted(brands):
    count = len(df[df['brand'] == brand])
    print(f"  {brand} ({count} urun)")
