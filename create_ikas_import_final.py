#!/usr/bin/env python3
"""
Glindent Excel -> ikas CSV Final Import Script
==============================================

Bu script Excel dosyasındaki TÜM ürün verilerini ikas import formatına dönüştürür.
Özellikler:
- ✅ Aynı ürünün varyantları için aynı Ürün Grup ID
- ✅ Varyant Tip ve Değer doğru doldurulur
- ✅ Görsel URL'leri (Cloudinary veya Vercel) eklenir
- ✅ SKU kodları Excel'den alınır

Kullanım:
1. pip install pandas openpyxl
2. (Opsiyonel) Cloudinary'ye görselleri yükleyin
3. python create_ikas_import_final.py
"""

import pandas as pd
import json
import os
import re
from pathlib import Path
from datetime import datetime

# Dosya yolları
BASE_DIR = Path(__file__).parent
EXCEL_FILE = BASE_DIR / "Glindent Web Page.xlsx"
OUTPUT_CSV = BASE_DIR / "ikas_import" / f"IKAS_FINAL_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
CLOUDINARY_URLS_FILE = BASE_DIR / "cloudinary_urls.json"

# ============================================
# GÖRSEL URL AYARLARI
# ============================================
# Siteniz deploy edildikten sonra bu URL'yi güncelleyin
# Örnek: https://glindent.vercel.app/products veya https://yourdomain.com/products
IMAGE_BASE_URL = "https://glindent.vercel.app/products"

# Cloudinary kullanılacaksa bu True yapın
USE_CLOUDINARY = True

# ============================================
# ÜRÜN - GÖRSEL EŞLEŞTİRME
# ============================================
PRODUCT_IMAGE_FOLDER = {
    "G-Ceram Zirconia Discs": "G-Ceram_Zirconia_Discs",
    "G-Ceram Glass Ceramic Blocks": "G-Ceram_Glass_Ceramic_Blocks",
    "G-Ceram MF Porcelain Powder": "G-Ceram_MF_Porcelain_Powder",
    "G-Ceram ZF Porcelain Powder": "G-Ceram_ZF_Porcelain_Powder",
    "Porcelain Teeth": "Porcelain_Teeth",
    "G-Plates LC": "G-Plates_LC",
    "G-Wax": "G-Wax",
    "G-Clean": "G-Clean",
    "G-Dent Liner": "G-Dent_Liner",
    "G-Dent Temp Fill": "G-Dent_Temp_Fill",
    "G-Dent Nano Hybrid Composite": "G-Dent_Nano_Hybrid_Composite",
    "G-Dent Nano Hybrid ZR Composite": "G-Dent_Nano_Hybrid_ZR_Composite",
    "G-ZNO": "G-ZNO",
    "G-Dent Dual Cem": "G-Dent_Dual_Cem",
    "G-Dent Retraction Cord": "G-Dent_Retraction_Cord",
    "G-Dent Gingiva Barrier": "G-Dent_Gingiva_Barrier",
    "G-Dent Prophylaxis Powder": "G-Dent_Prophylaxis_Powder",
    "G-Dent Prophy Paste": "G-Dent_Prophy_Paste",
    "GSMedex": "GSMedex",
}

# ============================================
# KATEGORİ YAPISI
# ============================================
CATEGORIES = {
    "G-Ceram Zirconia Discs": "Labside > CAD/CAM > Zirconia Discs",
    "G-Ceram Glass Ceramic Blocks": "Labside > CAD/CAM > Glass Ceramic",
    "G-Ceram MF Porcelain Powder": "Labside > Porcelain > Metal Framework",
    "G-Ceram ZF Porcelain Powder": "Labside > Porcelain > Zirconia Framework",
    "Porcelain Teeth": "Labside > Denture > Porcelain Teeth",
    "G-Plates LC": "Labside > Impression > Baseplates",
    "G-Wax": "Labside > Wax",
    "G-Clean": "Labside > Cleaning",
    "G-Dent Liner": "Chairside > Restorative > Liner",
    "G-Dent Temp Fill": "Chairside > Temporary",
    "G-Dent Nano Hybrid Composite": "Chairside > Restorative > Composite",
    "G-Dent Nano Hybrid ZR Composite": "Chairside > Restorative > Composite",
    "G-ZNO": "Chairside > Temporary > Cement",
    "G-Dent Dual Cem": "Chairside > Cementation",
    "G-Dent Retraction Cord": "Chairside > Impression > Retraction",
    "G-Dent Gingiva Barrier": "Chairside > Whitening",
    "G-Dent Prophylaxis Powder": "Chairside > Prophylaxis",
    "G-Dent Prophy Paste": "Chairside > Prophylaxis",
    "GSMedex": "Medical Devices",
}

# Cloudinary URL'leri (yüklendiyse)
cloudinary_urls = {}

def load_cloudinary_urls():
    """Cloudinary URL'lerini yükle"""
    global cloudinary_urls
    if USE_CLOUDINARY and CLOUDINARY_URLS_FILE.exists():
        with open(CLOUDINARY_URLS_FILE, 'r', encoding='utf-8') as f:
            cloudinary_urls = json.load(f)
            print(f"✅ Cloudinary URL'leri yüklendi: {len(cloudinary_urls)} ürün")

def get_image_urls(product_name: str) -> list:
    """Ürün için görsel URL'lerini al"""
    folder = PRODUCT_IMAGE_FOLDER.get(product_name, product_name.replace(" ", "_"))
    
    if USE_CLOUDINARY and folder in cloudinary_urls:
        return [img['url'] for img in cloudinary_urls[folder]]
    
    # Local/Vercel URL'leri
    local_folder = BASE_DIR / "public" / "products" / folder
    urls = []
    if local_folder.exists():
        for img in sorted(local_folder.iterdir()):
            if img.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
                urls.append(f"{IMAGE_BASE_URL}/{folder}/{img.name}")
    return urls

def create_row(group_id, variant_id, name, description, variants, sku, category, brand, images):
    """Tek bir CSV satırı oluştur"""
    row = {
        'Ürün Grup ID': group_id,
        'Varyant ID': variant_id,
        'Ürün Adı': name,
        'Ürün Açıklaması': description,
        'Varyant Tip 1': variants.get('type1', ''),
        'Varyant Değer 1': variants.get('value1', ''),
        'Varyant Tip 2': variants.get('type2', ''),
        'Varyant Değer 2': variants.get('value2', ''),
        'Varyant Tip 3': variants.get('type3', ''),
        'Varyant Değer 3': variants.get('value3', ''),
        'Fiyat': '',  # Sonra eklenecek
        'İndirimli Fiyat': '',
        'Stok': '999',
        'SKU': sku,
        'Barkod': '',
        'Kategori': category,
        'Marka': brand,
        'Resim URL 1': images[0] if len(images) > 0 else '',
        'Resim URL 2': images[1] if len(images) > 1 else '',
        'Resim URL 3': images[2] if len(images) > 2 else '',
        'Resim URL 4': images[3] if len(images) > 3 else '',
        'Resim URL 5': images[4] if len(images) > 4 else '',
        'Ağırlık (g)': '',
        'Durum': 'Aktif',
    }
    return row

def parse_zirconia_discs(xl) -> list:
    """G-Ceram Zirconia Discs"""
    rows = []
    df = pd.read_excel(xl, sheet_name='G-Ceram Zirconia Discs', header=None)
    
    product_name = "G-Ceram Zirconia Discs"
    group_id = "grp_zirconia_discs"
    images = get_image_urls(product_name)
    category = CATEGORIES[product_name]
    
    # Satır 3'ten itibaren veri var (0-indexed)
    for idx in range(3, len(df)):
        row = df.iloc[idx]
        if pd.isna(row.iloc[0]) or 'Technical' in str(row.iloc[0]):
            break
        
        size = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ''
        shade = str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else ''
        
        if not size or not shade:
            continue
        
        variant_id = f"zrc_{size.replace('mm','')}_{shade[:3].lower()}"
        sku = f"ZRC-{size}-{shade.split()[0]}"
        display_name = f"G-Ceram Zirconia Disc {size} {shade}"
        desc = f"G-Ceram Zirconia Disc - Size: {size}, Type: {shade}. High translucency zirconia disc for CAD/CAM milling."
        
        variants = {
            'type1': 'Boyut',
            'value1': size,
            'type2': 'Tip',
            'value2': shade,
        }
        
        rows.append(create_row(group_id, variant_id, display_name, desc, variants, sku, category, 'G-Ceram', images))
    
    return rows

def parse_glass_ceramic(xl) -> list:
    """G-Ceram Glass Ceramic Blocks"""
    rows = []
    df = pd.read_excel(xl, sheet_name='G-Ceram Glass Ceramic Blocks', header=None)
    
    product_name = "G-Ceram Glass Ceramic Blocks"
    group_id = "grp_glass_ceramic_blocks"
    images = get_image_urls(product_name)
    category = CATEGORIES[product_name]
    
    # Satır 11'den itibaren veri var
    for idx in range(11, len(df)):
        row = df.iloc[idx]
        if pd.isna(row.iloc[0]) or 'Technical' in str(row.iloc[0]):
            break
        
        sku = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ''
        size = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ''
        shade = str(row.iloc[2]).strip() if pd.notna(row.iloc[2]) else ''
        
        if not sku or 'Product' in sku:
            continue
        
        variant_id = f"gcb_{sku.lower()}"
        display_name = f"G-Ceram Glass Ceramic Block {size} {shade}"
        desc = f"G-Ceram Glass Ceramic Block - Size: {size}, Shade: {shade}. Feldspathic glass ceramic for CAD/CAM."
        
        variants = {
            'type1': 'Boyut',
            'value1': size,
            'type2': 'Renk',
            'value2': shade,
        }
        
        rows.append(create_row(group_id, variant_id, display_name, desc, variants, sku, category, 'G-Ceram', images))
    
    return rows

def parse_porcelain_powder(xl, sheet_name: str, product_name: str, group_id: str) -> list:
    """MF ve ZF Porcelain Powder"""
    rows = []
    df = pd.read_excel(xl, sheet_name=sheet_name, header=None)
    
    images = get_image_urls(product_name)
    category = CATEGORIES[product_name]
    
    current_category = ""
    
    for idx in range(12, len(df)):
        row = df.iloc[idx]
        
        # İlk hücre header ise category olarak al
        first_cell = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ''
        
        if 'Powder' in first_cell or 'Dentine' in first_cell or 'Enamel' in first_cell or 'Glaze' in first_cell:
            current_category = first_cell
            
            # Shade ve SKU'lar var mı kontrol et
            shade = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ''
            sku_50 = str(row.iloc[2]).strip() if len(row) > 2 and pd.notna(row.iloc[2]) else ''
            
            if shade and sku_50 and 'Shade' not in shade:
                # Bu satırda veri var
                for gram_idx, gram in enumerate(['50g', '120g', '200g', '500g']):
                    sku = str(row.iloc[2 + gram_idx]).strip() if len(row) > 2 + gram_idx and pd.notna(row.iloc[2 + gram_idx]) else ''
                    if sku and 'SKU' not in sku:
                        variant_id = f"{group_id}_{sku.lower()}"
                        display_name = f"{product_name} - {current_category} {shade} {gram}"
                        desc = f"{product_name} - Type: {current_category}, Shade: {shade}, Weight: {gram}"
                        
                        variants = {
                            'type1': 'Tip',
                            'value1': current_category,
                            'type2': 'Renk',
                            'value2': shade,
                            'type3': 'Gramaj',
                            'value3': gram,
                        }
                        
                        rows.append(create_row(group_id, variant_id, display_name, desc, variants, sku, category, 'G-Ceram', images))
            continue
        
        if first_cell and 'Product' not in first_cell and 'Technical' not in first_cell and 'G-Ceram' not in first_cell:
            continue
        
        # Normal veri satırı
        if current_category:
            shade = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ''
            if not shade or 'Shade' in shade:
                continue
            
            # Her gramaj için ayrı varyant
            gram_cols = {2: '50g', 3: '120g', 4: '200g', 5: '500g'}
            for col_idx, gram in gram_cols.items():
                if len(row) > col_idx:
                    sku = str(row.iloc[col_idx]).strip() if pd.notna(row.iloc[col_idx]) else ''
                    if sku and 'SKU' not in sku and len(sku) > 3:
                        variant_id = f"{group_id}_{sku.lower()}"
                        display_name = f"{product_name} - {current_category} {shade} {gram}"
                        desc = f"{product_name} - Type: {current_category}, Shade: {shade}, Weight: {gram}"
                        
                        variants = {
                            'type1': 'Tip',
                            'value1': current_category,
                            'type2': 'Renk',
                            'value2': shade,
                            'type3': 'Gramaj',
                            'value3': gram,
                        }
                        
                        rows.append(create_row(group_id, variant_id, display_name, desc, variants, sku, category, 'G-Ceram', images))
    
    return rows

def parse_composite(xl, sheet_name: str, product_name: str, group_id: str) -> list:
    """Nano Hybrid Composite"""
    rows = []
    df = pd.read_excel(xl, sheet_name=sheet_name, header=None)
    
    images = get_image_urls(product_name)
    category = CATEGORIES[product_name]
    
    # Ürün listesini bul (Product Name - SKU yapısında)
    for idx in range(len(df)):
        row = df.iloc[idx]
        first_cell = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ''
        
        # "G-Dent Nano Hybrid Composite A1" gibi satırları bul
        if product_name.split()[0] in first_cell and len(first_cell) > len(product_name):
            # Bu bir varyant satırı
            sku = str(row.iloc[1]).strip() if pd.notna(row.iloc[1]) else ''
            
            # Shade'i ürün adından çıkar
            shade = first_cell.replace(product_name, '').strip()
            if not shade:
                # Son kelimeyi shade olarak al
                parts = first_cell.split()
                shade = parts[-1] if parts else ''
            
            if not shade:
                continue
            
            variant_id = f"{group_id}_{shade.lower().replace(' ', '_').replace(',', '').replace('.', '')}"
            if not sku:
                sku = f"COMP-{shade.replace(' ', '-').replace(',', '-')}"
            
            display_name = first_cell
            desc = f"{product_name} 4g syringe - Shade: {shade}. Light-curing nano-hybrid composite for aesthetic restorations."
            
            variants = {
                'type1': 'Renk',
                'value1': shade,
            }
            
            rows.append(create_row(group_id, variant_id, display_name, desc, variants, sku, category, 'G-Dent', images))
    
    return rows

def parse_simple_product(xl, sheet_name: str, product_name: str, group_id: str, has_variants: bool = False) -> list:
    """Basit ürünler (tek varyant veya varyantsız)"""
    rows = []
    df = pd.read_excel(xl, sheet_name=sheet_name, header=None)
    
    images = get_image_urls(product_name)
    category = CATEGORIES.get(product_name, "")
    brand = 'G-Dent' if 'G-Dent' in product_name else 'G-Ceram' if 'G-Ceram' in product_name else 'Glindent'
    
    # Ürün açıklamasını al
    description = ""
    for idx in range(len(df)):
        row = df.iloc[idx]
        first_cell = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ''
        if 'Product Description' in first_cell:
            # Sonraki hücrelerden açıklamayı topla
            desc_parts = []
            for col in range(1, len(row)):
                if pd.notna(row.iloc[col]):
                    desc_parts.append(str(row.iloc[col]).strip())
            # Sonraki satırlardan da al
            for next_idx in range(idx + 1, min(idx + 10, len(df))):
                next_row = df.iloc[next_idx]
                if pd.isna(next_row.iloc[0]) or str(next_row.iloc[0]).strip() == '':
                    for col in range(1, len(next_row)):
                        if pd.notna(next_row.iloc[col]):
                            desc_parts.append(str(next_row.iloc[col]).strip())
                else:
                    break
            description = ' '.join(desc_parts)[:500]
            break
    
    if not has_variants:
        # Tek ürün, varyant yok
        variant_id = group_id.replace('grp_', 'var_')
        sku = product_name.upper().replace(' ', '-').replace('G-', 'G')[:20]
        
        rows.append(create_row(group_id, variant_id, product_name, description, {}, sku, category, brand, images))
    
    return rows

def main():
    print("🚀 Glindent Excel -> ikas CSV Final Import")
    print("=" * 60)
    
    # Cloudinary URL'lerini yükle
    load_cloudinary_urls()
    
    # Excel dosyasını oku
    if not EXCEL_FILE.exists():
        print(f"❌ Excel dosyası bulunamadı: {EXCEL_FILE}")
        return
    
    xl = pd.ExcelFile(EXCEL_FILE)
    print(f"✅ Excel yüklendi: {len(xl.sheet_names)} sayfa")
    
    all_rows = []
    
    # 1. Zirconia Discs
    print("\n📄 G-Ceram Zirconia Discs...")
    rows = parse_zirconia_discs(xl)
    print(f"   {len(rows)} varyant")
    all_rows.extend(rows)
    
    # 2. Glass Ceramic Blocks
    print("\n📄 G-Ceram Glass Ceramic Blocks...")
    rows = parse_glass_ceramic(xl)
    print(f"   {len(rows)} varyant")
    all_rows.extend(rows)
    
    # 3. MF Porcelain Powder
    print("\n📄 G-Ceram MF Porcelain Powder...")
    rows = parse_porcelain_powder(xl, 'G-Ceram MF Porcelain Powder', 'G-Ceram MF Porcelain Powder', 'grp_mf_porcelain')
    print(f"   {len(rows)} varyant")
    all_rows.extend(rows)
    
    # 4. ZF Porcelain Powder
    print("\n📄 G-Ceram ZF Porcelain Powder...")
    rows = parse_porcelain_powder(xl, 'G-Ceram ZF Porcelain Powder', 'G-Ceram ZF Porcelain Powder', 'grp_zf_porcelain')
    print(f"   {len(rows)} varyant")
    all_rows.extend(rows)
    
    # 5. Nano Hybrid Composite
    print("\n📄 G-Dent Nano Hybrid Composite...")
    rows = parse_composite(xl, 'G-Dent Nano Hybrid Composite', 'G-Dent Nano Hybrid Composite', 'grp_nano_composite')
    print(f"   {len(rows)} varyant")
    all_rows.extend(rows)
    
    # 6. Nano Hybrid ZR Composite
    print("\n📄 G-Dent Nano Hybrid ZR Composite...")
    rows = parse_composite(xl, 'G-Dent Nano Hybrid ZR Composite', 'G-Dent Nano Hybrid ZR Composite', 'grp_nano_zr_composite')
    print(f"   {len(rows)} varyant")
    all_rows.extend(rows)
    
    # 7-19. Basit ürünler
    simple_products = [
        ('Porcelain Teeth', 'grp_porcelain_teeth'),
        ('G-Plates LC', 'grp_plates_lc'),
        ('G-Wax', 'grp_wax'),
        ('G-Clean', 'grp_clean'),
        ('G-Dent Liner', 'grp_liner'),
        ('G-Dent Temp Fill', 'grp_temp_fill'),
        ('G-ZNO', 'grp_zno'),
        ('G-Dent Dual Cem', 'grp_dual_cem'),
        ('G-Dent Retraction Cord', 'grp_retraction_cord'),
        ('G-Dent Gingiva Barrier', 'grp_gingiva_barrier'),
        ('G-Dent Prophylaxis Powder', 'grp_prophylaxis_powder'),
        ('G-Dent Prophy Paste', 'grp_prophy_paste'),
        ('GSMedex', 'grp_gsmedex'),
    ]
    
    for product_name, group_id in simple_products:
        print(f"\n📄 {product_name}...")
        rows = parse_simple_product(xl, product_name, product_name, group_id, has_variants=False)
        print(f"   {len(rows)} ürün")
        all_rows.extend(rows)
    
    # CSV oluştur
    if all_rows:
        output_df = pd.DataFrame(all_rows)
        
        # Klasörü oluştur
        OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
        
        # CSV kaydet
        output_df.to_csv(OUTPUT_CSV, index=False, encoding='utf-8-sig')
        
        print("\n" + "=" * 60)
        print(f"✅ CSV oluşturuldu: {OUTPUT_CSV}")
        print(f"   Toplam ürün grubu: {output_df['Ürün Grup ID'].nunique()}")
        print(f"   Toplam varyant/ürün: {len(output_df)}")
        print("=" * 60)
        
        # Özet tablo
        print("\n📊 Ürün Grubu Dağılımı:")
        print("-" * 40)
        for grp in output_df['Ürün Grup ID'].unique():
            count = len(output_df[output_df['Ürün Grup ID'] == grp])
            print(f"   {grp}: {count} varyant")
    else:
        print("\n❌ Hiç ürün verisi oluşturulamadı!")

if __name__ == "__main__":
    main()
