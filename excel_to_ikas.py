"""
Excel to ikas Import Converter
Glindent Dental Supplies - Product Import Script
"""

import pandas as pd
import json
import csv
from pathlib import Path

# Excel file path
EXCEL_FILE = r'C:\Users\MONSTER\OneDrive\Belgeler\GitHub\glindent\Glindent Web Page.xlsx'
OUTPUT_DIR = Path(r'C:\Users\MONSTER\OneDrive\Belgeler\GitHub\glindent\ikas_import')

# Create output directory
OUTPUT_DIR.mkdir(exist_ok=True)

# Product categories mapping
CATEGORIES = {
    'labside': {
        'name': 'Labside',
        'subcategories': {
            'cad_cam': 'CAD/CAM Materials',
            'porcelain': 'Porcelain Powder',
            'denture': 'Denture & Labs'
        }
    },
    'chairside': {
        'name': 'Chairside',
        'subcategories': {
            'restorative': 'Restorative Materials',
            'hygiene': 'Hygiene & Prophylaxis',
            'accessories': 'Accessories'
        }
    }
}

def clean_text(text):
    """Clean and normalize text"""
    if pd.isna(text):
        return ""
    return str(text).strip()

def generate_sku(product_name, variant_info=""):
    """Generate SKU from product name and variant"""
    base = product_name.upper().replace(" ", "-").replace("G-CERAM", "GC").replace("G-DENT", "GD")[:20]
    if variant_info:
        variant = variant_info.upper().replace(" ", "").replace("(", "").replace(")", "")[:10]
        return f"{base}-{variant}"
    return base

def parse_zirconia_discs(df):
    """Parse G-Ceram Zirconia Discs sheet"""
    products = []
    
    # Product info
    product_name = "G-Ceram Blocks Zirconia Discs"
    description = """G-Ceram Zirconia Discs are premium quality zirconia blanks for CAD/CAM dental restorations. 
Available in White (HT), Pre-Shaded (ST), and Multilayer (SHT) options with various thicknesses.
Perfect for crowns, bridges, and other dental prosthetics."""
    
    # Parse variants (rows 2-22 have data)
    sizes = ['12mm', '14mm', '16mm', '18mm', '20mm', '22mm', '25mm']
    shades = ['White (HT)', 'Pre-Shaded (ST)', 'Multilayer (SHT)']
    
    for size in sizes:
        for shade in shades:
            sku = f"GCZD-{size.replace('mm','')}-{shade.split()[0][:2].upper()}"
            variant_name = f"{product_name} - {size} - {shade}"
            
            products.append({
                'sku': sku,
                'name': variant_name,
                'description': description,
                'category': 'Labside > CAD/CAM Materials',
                'subcategory': 'Zirconia Discs',
                'brand': 'G-Ceram',
                'size': size,
                'shade': shade,
                'price': '',  # Price to be added
                'stock': 100,
                'weight': '',
                'tags': 'zirconia,cad-cam,dental,disc'
            })
    
    return products

def parse_glass_ceramic_blocks(df):
    """Parse G-Ceram Glass Ceramic Blocks sheet"""
    products = []
    
    description = """G-Ceram Block are feldspathic monochromatic glass ceramic blanks used to produce inlays, onlays, crown and veneers with CAD/CAM systems.
G-Ceram Block Glass-ceramics are formed as a result of a controlled crystallization in the glass phase as a result of various thermal processes.
Compatible with universal and specific holder systems. Available in A1, A2, A3, A3.5, A4, B0, B1, B4, C1, C2 shades."""
    
    # Parse from row 10 onwards
    for i in range(10, 50):
        if i < len(df):
            row = df.iloc[i]
            sku = clean_text(row.iloc[0])
            size = clean_text(row.iloc[1])
            shade = clean_text(row.iloc[2])
            
            if sku and size and shade and sku != 'nan' and 'GB' in sku:
                products.append({
                    'sku': sku,
                    'name': f"G-Ceram Glass Ceramic Block - {size} - {shade}",
                    'description': description,
                    'category': 'Labside > CAD/CAM Materials',
                    'subcategory': 'Glass Ceramic Blocks',
                    'brand': 'G-Ceram',
                    'size': size,
                    'shade': shade,
                    'price': '',
                    'stock': 100,
                    'weight': '',
                    'tags': 'glass-ceramic,cad-cam,dental,block,feldspar'
                })
    
    return products

def parse_mf_porcelain(df):
    """Parse G-Ceram MF Metal Ceramic Porcelain Powder sheet"""
    products = []
    
    description = """G-CERAM MF Metal-Ceramic is a natural feldspathic porcelain powder, which is used to make metal sub-structured porcelain crowns and bridges, porcelain veneer and dental inlays-onlays.
Thanks to its modelling ease of use, G-CERAM MF is a reliable ceramic powder for veneering, especially recommended for laboratories whose priority is rapidity and accuracy."""
    
    current_category = ""
    
    for i in range(len(df)):
        row = df.iloc[i]
        col0 = clean_text(row.iloc[0])
        col1 = clean_text(row.iloc[1])
        
        # Detect category headers
        if 'Opaque Powder' in col0 or 'Dentine Powder' in col0 or 'Opaque Dentine' in col0 or 'Chroma Dentine' in col0:
            current_category = col0
        
        # Parse SKU rows (columns 2-5 have SKUs for different sizes)
        if current_category and col1 and col1 not in ['Shade', '---', 'nan', '']:
            shade = col1
            
            # Get SKUs for different sizes
            skus = {
                '50g': clean_text(row.iloc[2]) if len(row) > 2 else '',
                '120g': clean_text(row.iloc[3]) if len(row) > 3 else '',
                '200g': clean_text(row.iloc[4]) if len(row) > 4 else '',
                '500g': clean_text(row.iloc[5]) if len(row) > 5 else '',
            }
            
            for size, sku in skus.items():
                if sku and sku != 'nan' and 'PT' in sku:
                    products.append({
                        'sku': sku,
                        'name': f"G-Ceram MF {current_category} - {shade} - {size}",
                        'description': description,
                        'category': 'Labside > Porcelain Powder',
                        'subcategory': f'MF {current_category}',
                        'brand': 'G-Ceram',
                        'size': size,
                        'shade': shade,
                        'price': '',
                        'stock': 100,
                        'weight': size,
                        'tags': 'porcelain,powder,metal-ceramic,dental'
                    })
    
    return products

def parse_zf_porcelain(df):
    """Parse G-Ceram ZF Zirconia Ceramic Porcelain Powder sheet"""
    products = []
    
    description = """G-Ceram ZF Zirconia-Ceramic powder is a natural feldspathic porcelain powder, which is used to make zirconium oxide (ZrO2) and both lithium disilicate (LS2) sub-structured porcelain crowns and bridges, porcelain veneer.
Thanks to its modelling ease of use, G-Ceram ZF Zirconia-Ceramic powder is a reliable ceramic powder for veneering."""
    
    current_category = ""
    
    for i in range(len(df)):
        row = df.iloc[i]
        col0 = clean_text(row.iloc[0])
        col1 = clean_text(row.iloc[1])
        
        # Detect category headers
        if 'Dentine' in col0 or 'Incisal' in col0 or 'Shoulder' in col0 or 'Effect' in col0:
            current_category = col0
        
        # Parse SKU rows
        if current_category and col1 and col1 not in ['Shade', '---', 'nan', '', 'NaN']:
            shade = col1
            
            # Get SKUs for different sizes
            skus = {
                '20g': clean_text(row.iloc[2]) if len(row) > 2 else '',
                '50g': clean_text(row.iloc[3]) if len(row) > 3 else '',
            }
            
            for size, sku in skus.items():
                if sku and sku != 'nan' and 'PTZ' in sku:
                    products.append({
                        'sku': sku,
                        'name': f"G-Ceram ZF {current_category} - {shade} - {size}",
                        'description': description,
                        'category': 'Labside > Porcelain Powder',
                        'subcategory': f'ZF {current_category}',
                        'brand': 'G-Ceram',
                        'size': size,
                        'shade': shade,
                        'price': '',
                        'stock': 100,
                        'weight': size,
                        'tags': 'porcelain,powder,zirconia-ceramic,dental'
                    })
    
    return products

def parse_simple_product(sheet_name, df, category, subcategory, brand, tags):
    """Parse simple products with single SKU"""
    products = []
    
    product_name = ""
    description = ""
    sku = ""
    
    for i in range(len(df)):
        row = df.iloc[i]
        col0 = clean_text(row.iloc[0])
        col1 = clean_text(row.iloc[1])
        
        if 'Product Name' in col0:
            product_name = col1
        elif 'Product Description' in col0:
            description = col1
        elif col0 == '' and description and col1:
            description += " " + col1
        elif 'Product SKU' in col0 or 'SKU' in col0:
            sku = col1
    
    if product_name:
        if not sku:
            sku = generate_sku(product_name)
        
        products.append({
            'sku': sku,
            'name': product_name,
            'description': description,
            'category': category,
            'subcategory': subcategory,
            'brand': brand,
            'size': '',
            'shade': '',
            'price': '',
            'stock': 100,
            'weight': '',
            'tags': tags
        })
    
    return products

def parse_composite_products(df, product_type):
    """Parse composite products with shade variants"""
    products = []
    
    product_name = ""
    description = ""
    
    for i in range(len(df)):
        row = df.iloc[i]
        col0 = clean_text(row.iloc[0])
        col1 = clean_text(row.iloc[1])
        
        if 'Product Name' in col0:
            product_name = col1
        elif 'Product Description' in col0:
            description = col1
        elif col0 == '' and description and col1 and 'NaN' not in col1:
            description += " " + col1
    
    # Common Vita shades for composites
    shades = ['A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'C1', 'C2', 'D2', 'D3']
    
    for shade in shades:
        sku = f"GD-{product_type}-{shade}"
        products.append({
            'sku': sku,
            'name': f"{product_name} - {shade}",
            'description': description,
            'category': 'Chairside > Restorative Materials',
            'subcategory': 'Composites',
            'brand': 'G-Dent',
            'size': '4g syringe',
            'shade': shade,
            'price': '',
            'stock': 100,
            'weight': '4g',
            'tags': 'composite,nano-hybrid,restorative,dental'
        })
    
    return products

def parse_retraction_cord(df):
    """Parse G-Dent Retraction Cord with size variants"""
    products = []
    
    description = """G-Dent Retraction Cord is a non-sterile, 100% cotton cord, knitted into thousands of tiny loops to form long interlocking chains.
Its unique design ensures rapid tissue displacement while preventing entanglement in diamond burs.
Available in four sizes (#1, #0, #00, #000), each marked according to its thickness."""
    
    sizes = [
        ('#000', 'For lower anteriors; subgingival veneer luting; Class III, IV and V restorations'),
        ('#00', 'For veneer preparation and cementation; restorative procedures'),
        ('#0', 'For anterior teeth; as an upper cord in the two-cord technique'),
        ('#1', 'For anterior tooth preparations')
    ]
    
    for size, use in sizes:
        sku = f"GDRC{size.replace('#', '')}"
        products.append({
            'sku': sku,
            'name': f"G-Dent Retraction Cord - Size {size}",
            'description': f"{description}\n\nSize {size}: {use}",
            'category': 'Chairside > Accessories',
            'subcategory': 'Retraction Cords',
            'brand': 'G-Dent',
            'size': size,
            'shade': '',
            'price': '',
            'stock': 100,
            'weight': '',
            'tags': 'retraction-cord,cotton,dental,tissue-management'
        })
    
    return products

def main():
    """Main function to process all sheets and generate ikas import files"""
    
    all_products = []
    xl = pd.ExcelFile(EXCEL_FILE)
    
    print("=" * 60)
    print("GLINDENT EXCEL TO IKAS CONVERTER")
    print("=" * 60)
    
    for sheet_name in xl.sheet_names:
        if sheet_name == 'Structure' or sheet_name == 'Porcelain Teeth':
            continue
            
        print(f"\n📦 Processing: {sheet_name}")
        df = pd.read_excel(EXCEL_FILE, sheet_name=sheet_name)
        
        try:
            if 'Zirconia Discs' in sheet_name:
                products = parse_zirconia_discs(df)
            elif 'Glass Ceramic' in sheet_name:
                products = parse_glass_ceramic_blocks(df)
            elif 'MF Porcelain' in sheet_name:
                products = parse_mf_porcelain(df)
            elif 'ZF Porcelain' in sheet_name:
                products = parse_zf_porcelain(df)
            elif 'Nano Hybrid Composite' in sheet_name and 'ZR' not in sheet_name:
                products = parse_composite_products(df, 'NHC')
            elif 'Nano Hybrid ZR' in sheet_name:
                products = parse_composite_products(df, 'NHZR')
            elif 'Retraction Cord' in sheet_name:
                products = parse_retraction_cord(df)
            elif 'G-Plates' in sheet_name:
                products = parse_simple_product(sheet_name, df, 'Labside > Denture & Labs', 'Baseplates', 'G-Plates', 'baseplate,light-curing,denture')
            elif 'G-Wax' in sheet_name:
                products = parse_simple_product(sheet_name, df, 'Labside > Denture & Labs', 'Modelling Wax', 'G-Wax', 'wax,modelling,denture')
            elif 'G-Clean' in sheet_name:
                products = parse_simple_product(sheet_name, df, 'Labside > Denture & Labs', 'Cleaners', 'G-Clean', 'cleaner,tray,alginate')
            elif 'Liner' in sheet_name:
                products = parse_simple_product(sheet_name, df, 'Chairside > Restorative Materials', 'Liners', 'G-Dent', 'liner,compomer,light-curing')
            elif 'Temp Fill' in sheet_name:
                products = parse_simple_product(sheet_name, df, 'Chairside > Restorative Materials', 'Temporary Fillings', 'G-Dent', 'temporary-filling,zinc-oxide')
            elif 'G-ZNO' in sheet_name:
                products = parse_simple_product(sheet_name, df, 'Chairside > Restorative Materials', 'Cements', 'G-ZNO', 'zinc-oxide,eugenol,cement')
            elif 'Dual Cem' in sheet_name:
                products = parse_simple_product(sheet_name, df, 'Chairside > Restorative Materials', 'Cements', 'G-Dent', 'resin-cement,dual-cure')
            elif 'Gingiva Barrier' in sheet_name:
                products = parse_simple_product(sheet_name, df, 'Chairside > Accessories', 'Gingiva Protection', 'G-Dent', 'gingiva-barrier,light-curing,whitening')
            elif 'Prophylaxis Powder' in sheet_name:
                products = parse_simple_product(sheet_name, df, 'Chairside > Hygiene & Prophylaxis', 'Prophylaxis', 'G-Dent', 'prophylaxis,powder,cleaning')
            elif 'Prophy Paste' in sheet_name:
                products = parse_simple_product(sheet_name, df, 'Chairside > Hygiene & Prophylaxis', 'Prophylaxis', 'G-Dent', 'prophy-paste,polishing,cleaning')
            elif 'GSMedex' in sheet_name:
                products = parse_simple_product(sheet_name, df, 'Chairside > Diagnostics', 'X-Ray Films', 'GSMedex', 'x-ray,film,dental-imaging')
            else:
                products = []
                print(f"  ⚠️  No parser for this sheet, skipping...")
            
            if products:
                all_products.extend(products)
                print(f"  ✅ {len(products)} products extracted")
                
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    # Generate CSV for ikas import
    print("\n" + "=" * 60)
    print("GENERATING IKAS IMPORT FILES")
    print("=" * 60)
    
    # Main CSV file
    csv_file = OUTPUT_DIR / 'ikas_products_import.csv'
    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        if all_products:
            writer = csv.DictWriter(f, fieldnames=all_products[0].keys())
            writer.writeheader()
            writer.writerows(all_products)
    
    print(f"\n✅ CSV file created: {csv_file}")
    print(f"   Total products: {len(all_products)}")
    
    # JSON file for reference
    json_file = OUTPUT_DIR / 'ikas_products_import.json'
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2, ensure_ascii=False)
    
    print(f"✅ JSON file created: {json_file}")
    
    # Summary by category
    print("\n📊 PRODUCTS BY CATEGORY:")
    categories = {}
    for p in all_products:
        cat = p['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    for cat, count in sorted(categories.items()):
        print(f"   {cat}: {count}")
    
    print("\n" + "=" * 60)
    print("DONE! Files are ready for ikas import.")
    print("=" * 60)
    
    return all_products

if __name__ == "__main__":
    main()
