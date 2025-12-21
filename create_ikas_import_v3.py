#!/usr/bin/env python3
"""
Glindent Excel -> ikas CSV Dönüştürücü (v3)
==========================================

Bu script Excel dosyasındaki ürün verilerini ikas import formatına dönüştürür.
Özellikler:
- Aynı ürünün varyantları için aynı Ürün Grup ID
- Varyant Tip ve Değer doğru doldurulur
- Görsel URL'leri (Cloudinary veya local) eklenir

Kullanım:
1. Önce upload_to_cloudinary.py ile görselleri yükleyin
2. python create_ikas_import_v3.py
"""

import pandas as pd
import json
import os
import re
import uuid
from pathlib import Path
from datetime import datetime

# Dosya yolları
BASE_DIR = Path(__file__).parent
EXCEL_FILE = BASE_DIR / "Glindent Web Page.xlsx"
OUTPUT_CSV = BASE_DIR / "ikas_import" / "IKAS_FINAL_IMPORT_V3.csv"
CLOUDINARY_URLS_FILE = BASE_DIR / "cloudinary_urls.json"
PUBLIC_PRODUCTS_DIR = BASE_DIR / "public" / "products"

# Görsel URL base (GitHub raw veya Vercel deployment URL'i)
# Cloudinary kullanılacaksa bu geçersiz olur
GITHUB_RAW_BASE = "https://raw.githubusercontent.com/YOUR_USERNAME/glindent/main/public/products"
VERCEL_BASE = "https://glindent.vercel.app/products"  # Veya sitenizin URL'i

# ============================================
# ÜRÜN - GÖRSEL EŞLEŞTİRME HARİTASI
# ============================================
PRODUCT_IMAGE_MAP = {
    # Excel sheet adı: görsel klasör adı
    "G-Ceram Zirconia Discs": "G-Ceram_Zirconia_Discs",
    "G-Ceram Glass Ceramic Bloc": "G-Ceram_Glass_Ceramic_Blocks",
    "G-Ceram MF Porcelain Powde": "G-Ceram_MF_Porcelain_Powder",
    "G-Ceram ZF Porcelain Powde": "G-Ceram_ZF_Porcelain_Powder",
    "G-Dent Nano Hybrid Composi": "G-Dent_Nano_Hybrid_Composite",
    "G-Dent Nano Hybrid ZR Comp": "G-Dent_Nano_Hybrid_ZR_Composite",
    "G-Dent Dual Cem": "G-Dent_Dual_Cem",
    "G-Dent Liner": "G-Dent_Liner",
    "G-Dent Gingiva Barrier": "G-Dent_Gingiva_Barrier",
    "G-Dent Prophy Paste": "G-Dent_Prophy_Paste",
    "G-Dent Prophylaxis Powder": "G-Dent_Prophylaxis_Powder",
    "G-Dent Retraction Cord": "G-Dent_Retraction_Cord",
    "G-Dent Temp Fill": "G-Dent_Temp_Fill",
    "G-Wax": "G-Wax",
    "G-ZNO": "G-ZNO",
    "G-Clean": "G-Clean",
    "G-Plates LC": "G-Plates_LC",
    "Porcelain Teeth": "Porcelain_Teeth",
    "GSMedex": "GSMedex",
}

# ============================================
# ÜRÜN KATEGORİ YAPISI
# ============================================
CATEGORY_MAP = {
    "G-Ceram Zirconia Discs": "Labside > CAD/CAM > Zirconia",
    "G-Ceram Glass Ceramic Bloc": "Labside > CAD/CAM > Glass Ceramic",
    "G-Ceram MF Porcelain Powde": "Labside > Porcelain > Metal Framework",
    "G-Ceram ZF Porcelain Powde": "Labside > Porcelain > Zirconia Framework",
    "G-Dent Nano Hybrid Composi": "Chairside > Restorative > Composite",
    "G-Dent Nano Hybrid ZR Comp": "Chairside > Restorative > Composite",
    "G-Dent Dual Cem": "Chairside > Cementation",
    "G-Dent Liner": "Chairside > Restorative > Liner",
    "G-Dent Gingiva Barrier": "Chairside > Whitening",
    "G-Dent Prophy Paste": "Chairside > Prophylaxis",
    "G-Dent Prophylaxis Powder": "Chairside > Prophylaxis",
    "G-Dent Retraction Cord": "Chairside > Impression",
    "G-Dent Temp Fill": "Chairside > Temporary",
    "G-Wax": "Labside > Wax",
    "G-ZNO": "Chairside > Temporary",
    "G-Clean": "Labside > Cleaning",
    "G-Plates LC": "Labside > Plates",
    "Porcelain Teeth": "Labside > Denture",
    "GSMedex": "Medical Devices",
}

def generate_group_id(product_name: str) -> str:
    """Ürün için benzersiz grup ID oluştur"""
    # Aynı ürün adı için her zaman aynı ID
    return f"grp_{product_name.lower().replace(' ', '_').replace('-', '_')[:30]}"

def generate_variant_id(product_name: str, variant_values: list) -> str:
    """Varyant için benzersiz ID oluştur"""
    variant_str = "_".join([str(v).replace(" ", "").replace("/", "")[:10] for v in variant_values])
    return f"var_{product_name[:15]}_{variant_str}"[:50]

def load_cloudinary_urls() -> dict:
    """Cloudinary URL'lerini yükle"""
    if CLOUDINARY_URLS_FILE.exists():
        with open(CLOUDINARY_URLS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def get_image_urls(product_name: str, cloudinary_urls: dict) -> list:
    """Ürün için görsel URL'lerini al"""
    # Önce eşleştirme haritasından klasör adını bul
    folder_name = None
    for sheet_name, folder in PRODUCT_IMAGE_MAP.items():
        if sheet_name in product_name or product_name in sheet_name:
            folder_name = folder
            break
    
    if not folder_name:
        # Direkt eşleştir
        folder_name = product_name.replace(" ", "_").replace("-", "_")
    
    urls = []
    
    # Cloudinary URL'leri varsa onları kullan
    if folder_name in cloudinary_urls:
        for img in cloudinary_urls[folder_name]:
            urls.append(img['url'])
    else:
        # Local dosyaları kontrol et, Vercel URL'si oluştur
        local_folder = PUBLIC_PRODUCTS_DIR / folder_name
        if local_folder.exists():
            for img_file in sorted(local_folder.iterdir()):
                if img_file.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                    url = f"{VERCEL_BASE}/{folder_name}/{img_file.name}"
                    urls.append(url)
    
    return urls

def parse_zirconia_discs(df: pd.DataFrame, group_id: str, image_urls: list) -> list:
    """Zirconia Discs verilerini parse et"""
    rows = []
    
    for idx, row in df.iterrows():
        if pd.isna(row.iloc[0]) or str(row.iloc[0]).strip() == "":
            continue
            
        # Sütunlar: Size, HT, SCHT, LT, A1-D4 renkleri
        size = str(row.iloc[0]).strip()
        if size.lower() in ['size', 'boyut', '']:
            continue
            
        # Her translucency tipi için
        translucencies = ['HT', 'SCHT', 'LT']
        for t_idx, trans in enumerate(translucencies):
            if len(row) > t_idx + 1:
                value = row.iloc[t_idx + 1]
                if pd.notna(value) and str(value).strip() != "":
                    # Her renk için
                    colors = ['A1', 'A2', 'A3', 'A3.5', 'B1', 'B2', 'B3', 'C1', 'C2', 'D2', 'D3', 'Bleach', 'White']
                    for color in colors:
                        variant_id = generate_variant_id("Zirconia", [size, trans, color])
                        rows.append({
                            'Ürün Grup ID': group_id,
                            'Varyant ID': variant_id,
                            'Ürün Adı': f"G-Ceram Zirconia Disc - {size} {trans} {color}",
                            'Ürün Açıklaması': f"G-Ceram Zirconia Disc, Size: {size}, Translucency: {trans}, Color: {color}",
                            'Varyant Tip 1': 'Boyut',
                            'Varyant Değer 1': size,
                            'Varyant Tip 2': 'Translucency',
                            'Varyant Değer 2': trans,
                            'Varyant Tip 3': 'Renk',
                            'Varyant Değer 3': color,
                            'Fiyat': '',  # Sonra eklenecek
                            'İndirimli Fiyat': '',
                            'Stok': '100',
                            'SKU': f"ZRC-{size}-{trans}-{color}",
                            'Barkod': '',
                            'Kategori': CATEGORY_MAP.get("G-Ceram Zirconia Discs", ""),
                            'Marka': 'G-Ceram',
                            'Resim URL 1': image_urls[0] if len(image_urls) > 0 else '',
                            'Resim URL 2': image_urls[1] if len(image_urls) > 1 else '',
                            'Resim URL 3': image_urls[2] if len(image_urls) > 2 else '',
                            'Ağırlık (g)': '',
                            'Durum': 'Aktif',
                        })
    
    return rows

def parse_simple_product(df: pd.DataFrame, product_name: str, group_id: str, image_urls: list, 
                         variant_type: str = None, category: str = "") -> list:
    """Basit ürünleri (tek varyant tipi) parse et"""
    rows = []
    
    for idx, row in df.iterrows():
        if pd.isna(row.iloc[0]) or str(row.iloc[0]).strip() == "":
            continue
            
        variant_value = str(row.iloc[0]).strip()
        if variant_value.lower() in ['variant', 'type', 'tip', 'boyut', '']:
            continue
        
        # Açıklama varsa al
        description = ""
        if len(row) > 1 and pd.notna(row.iloc[1]):
            description = str(row.iloc[1]).strip()
        
        variant_id = generate_variant_id(product_name, [variant_value])
        sku = f"{product_name[:10].upper().replace(' ', '-')}-{variant_value[:10].replace(' ', '-')}"
        
        rows.append({
            'Ürün Grup ID': group_id,
            'Varyant ID': variant_id,
            'Ürün Adı': f"{product_name} - {variant_value}",
            'Ürün Açıklaması': description or f"{product_name} {variant_value}",
            'Varyant Tip 1': variant_type or 'Tip',
            'Varyant Değer 1': variant_value,
            'Varyant Tip 2': '',
            'Varyant Değer 2': '',
            'Varyant Tip 3': '',
            'Varyant Değer 3': '',
            'Fiyat': '',
            'İndirimli Fiyat': '',
            'Stok': '100',
            'SKU': sku,
            'Barkod': '',
            'Kategori': category,
            'Marka': 'G-Dent' if 'G-Dent' in product_name else 'G-Ceram',
            'Resim URL 1': image_urls[0] if len(image_urls) > 0 else '',
            'Resim URL 2': image_urls[1] if len(image_urls) > 1 else '',
            'Resim URL 3': image_urls[2] if len(image_urls) > 2 else '',
            'Ağırlık (g)': '',
            'Durum': 'Aktif',
        })
    
    return rows

def parse_porcelain_powder(df: pd.DataFrame, product_name: str, group_id: str, image_urls: list, category: str) -> list:
    """Porselen tozu ürünlerini parse et (MF ve ZF)"""
    rows = []
    
    # İlk satır header olabilir
    for idx, row in df.iterrows():
        if idx == 0:
            continue  # Header'ı atla
            
        if pd.isna(row.iloc[0]) or str(row.iloc[0]).strip() == "":
            continue
        
        powder_type = str(row.iloc[0]).strip()
        
        # Renk/shade varsa
        shade = ""
        if len(row) > 1 and pd.notna(row.iloc[1]):
            shade = str(row.iloc[1]).strip()
        
        # Gramaj varsa
        weight = ""
        if len(row) > 2 and pd.notna(row.iloc[2]):
            weight = str(row.iloc[2]).strip()
        
        variant_values = [powder_type]
        if shade:
            variant_values.append(shade)
        if weight:
            variant_values.append(weight)
        
        variant_id = generate_variant_id(product_name, variant_values)
        display_name = f"{product_name} - {' '.join(variant_values)}"
        
        rows.append({
            'Ürün Grup ID': group_id,
            'Varyant ID': variant_id,
            'Ürün Adı': display_name,
            'Ürün Açıklaması': f"{product_name} - Type: {powder_type}" + (f", Shade: {shade}" if shade else "") + (f", Weight: {weight}" if weight else ""),
            'Varyant Tip 1': 'Tip',
            'Varyant Değer 1': powder_type,
            'Varyant Tip 2': 'Renk' if shade else '',
            'Varyant Değer 2': shade,
            'Varyant Tip 3': 'Gramaj' if weight else '',
            'Varyant Değer 3': weight,
            'Fiyat': '',
            'İndirimli Fiyat': '',
            'Stok': '100',
            'SKU': f"PRC-{powder_type[:5]}-{shade[:5] if shade else 'X'}-{weight[:5] if weight else 'X'}",
            'Barkod': '',
            'Kategori': category,
            'Marka': 'G-Ceram',
            'Resim URL 1': image_urls[0] if len(image_urls) > 0 else '',
            'Resim URL 2': image_urls[1] if len(image_urls) > 1 else '',
            'Resim URL 3': image_urls[2] if len(image_urls) > 2 else '',
            'Ağırlık (g)': '',
            'Durum': 'Aktif',
        })
    
    return rows

def parse_composite(df: pd.DataFrame, product_name: str, group_id: str, image_urls: list) -> list:
    """Kompozit ürünlerini parse et (renk varyantları)"""
    rows = []
    
    for idx, row in df.iterrows():
        if pd.isna(row.iloc[0]) or str(row.iloc[0]).strip() == "":
            continue
        
        shade = str(row.iloc[0]).strip()
        if shade.lower() in ['shade', 'renk', 'color', '']:
            continue
        
        variant_id = generate_variant_id(product_name, [shade])
        
        rows.append({
            'Ürün Grup ID': group_id,
            'Varyant ID': variant_id,
            'Ürün Adı': f"{product_name} - {shade}",
            'Ürün Açıklaması': f"{product_name} Nano Hybrid Composite, Shade: {shade}",
            'Varyant Tip 1': 'Renk',
            'Varyant Değer 1': shade,
            'Varyant Tip 2': '',
            'Varyant Değer 2': '',
            'Varyant Tip 3': '',
            'Varyant Değer 3': '',
            'Fiyat': '',
            'İndirimli Fiyat': '',
            'Stok': '100',
            'SKU': f"CMP-{shade.replace(' ', '-')}",
            'Barkod': '',
            'Kategori': CATEGORY_MAP.get("G-Dent Nano Hybrid Composi", ""),
            'Marka': 'G-Dent',
            'Resim URL 1': image_urls[0] if len(image_urls) > 0 else '',
            'Resim URL 2': image_urls[1] if len(image_urls) > 1 else '',
            'Resim URL 3': image_urls[2] if len(image_urls) > 2 else '',
            'Ağırlık (g)': '',
            'Durum': 'Aktif',
        })
    
    return rows

def main():
    print("🚀 Glindent Excel -> ikas CSV Dönüştürücü v3")
    print("=" * 60)
    
    # Cloudinary URL'lerini yükle
    cloudinary_urls = load_cloudinary_urls()
    if cloudinary_urls:
        print(f"✅ Cloudinary URL'leri yüklendi: {len(cloudinary_urls)} ürün")
    else:
        print("⚠️  Cloudinary URL'leri bulunamadı, local URL'ler kullanılacak")
    
    # Excel dosyasını oku
    if not EXCEL_FILE.exists():
        print(f"❌ Excel dosyası bulunamadı: {EXCEL_FILE}")
        return
    
    xl = pd.ExcelFile(EXCEL_FILE)
    print(f"✅ Excel yüklendi: {len(xl.sheet_names)} sayfa")
    
    all_rows = []
    
    # Her sayfa için işle
    for sheet_name in xl.sheet_names:
        if sheet_name.lower() in ['structure', 'yapı', 'index', 'summary']:
            continue
        
        print(f"\n📄 İşleniyor: {sheet_name}")
        df = pd.read_excel(xl, sheet_name=sheet_name, header=None)
        
        group_id = generate_group_id(sheet_name)
        image_urls = get_image_urls(sheet_name, cloudinary_urls)
        category = CATEGORY_MAP.get(sheet_name[:25], "")
        
        print(f"   Grup ID: {group_id}")
        print(f"   Görseller: {len(image_urls)}")
        
        # Ürün tipine göre parse et
        if "Zirconia Disc" in sheet_name:
            rows = parse_zirconia_discs(df, group_id, image_urls)
        elif "Glass Ceramic" in sheet_name:
            rows = parse_simple_product(df, sheet_name, group_id, image_urls, "Boyut", category)
        elif "Porcelain Powder" in sheet_name or "MF" in sheet_name or "ZF" in sheet_name:
            rows = parse_porcelain_powder(df, sheet_name, group_id, image_urls, category)
        elif "Composite" in sheet_name:
            rows = parse_composite(df, sheet_name, group_id, image_urls)
        else:
            rows = parse_simple_product(df, sheet_name, group_id, image_urls, "Tip", category)
        
        print(f"   Varyant sayısı: {len(rows)}")
        all_rows.extend(rows)
    
    # CSV oluştur
    if all_rows:
        output_df = pd.DataFrame(all_rows)
        
        # ikas sütun sırası
        ikas_columns = [
            'Ürün Grup ID', 'Varyant ID', 'Ürün Adı', 'Ürün Açıklaması',
            'Varyant Tip 1', 'Varyant Değer 1', 'Varyant Tip 2', 'Varyant Değer 2',
            'Varyant Tip 3', 'Varyant Değer 3', 'Fiyat', 'İndirimli Fiyat',
            'Stok', 'SKU', 'Barkod', 'Kategori', 'Marka',
            'Resim URL 1', 'Resim URL 2', 'Resim URL 3', 'Ağırlık (g)', 'Durum'
        ]
        
        # Eksik sütunları ekle
        for col in ikas_columns:
            if col not in output_df.columns:
                output_df[col] = ''
        
        output_df = output_df[ikas_columns]
        
        # Klasörü oluştur
        OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
        
        # CSV kaydet
        output_df.to_csv(OUTPUT_CSV, index=False, encoding='utf-8-sig')
        
        print("\n" + "=" * 60)
        print(f"✅ CSV oluşturuldu: {OUTPUT_CSV}")
        print(f"   Toplam ürün: {output_df['Ürün Grup ID'].nunique()}")
        print(f"   Toplam varyant: {len(output_df)}")
        print("=" * 60)
    else:
        print("\n❌ Hiç ürün verisi oluşturulamadı!")

if __name__ == "__main__":
    main()
