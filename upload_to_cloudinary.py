#!/usr/bin/env python3
"""
Glindent Ürün Görsellerini Cloudinary'ye Yükleme Script'i
=========================================================

Bu script extracted_product_images klasöründeki tüm görselleri
Cloudinary'ye yükler ve URL'leri bir JSON dosyasına kaydeder.

Kullanım:
1. Cloudinary hesabı oluşturun: https://cloudinary.com/users/register_free
2. Dashboard'dan credentials'ları alın
3. Aşağıdaki değişkenleri doldurun
4. pip install cloudinary
5. python upload_to_cloudinary.py
"""

import os
import json
from pathlib import Path

# ============================================
# CLOUDINARY CREDENTIALS
# ============================================
CLOUDINARY_CLOUD_NAME = "dwz5qehsf"
CLOUDINARY_API_KEY = "564159175872833"
CLOUDINARY_API_SECRET = "D0QvuYuOmDpoMfu0BJ7j0yHydxs"
# ============================================

# Klasör yolları
BASE_DIR = Path(__file__).parent
IMAGES_DIR = BASE_DIR / "public" / "products"
OUTPUT_FILE = BASE_DIR / "cloudinary_urls.json"

def check_credentials():
    """Credentials kontrolü"""
    if "YOUR_" in CLOUDINARY_CLOUD_NAME:
        print("=" * 60)
        print("⚠️  CLOUDINARY CREDENTIALS GEREKLİ!")
        print("=" * 60)
        print()
        print("1. https://cloudinary.com/users/register_free adresinden")
        print("   ücretsiz hesap oluşturun")
        print()
        print("2. Dashboard'a gidin ve şu bilgileri alın:")
        print("   - Cloud Name")
        print("   - API Key")
        print("   - API Secret")
        print()
        print("3. Bu dosyayı açın ve yukarıdaki değişkenleri doldurun:")
        print(f"   {__file__}")
        print()
        print("4. pip install cloudinary")
        print()
        print("5. Tekrar çalıştırın: python upload_to_cloudinary.py")
        print("=" * 60)
        return False
    return True

def upload_images():
    """Tüm görselleri Cloudinary'ye yükle"""
    try:
        import cloudinary
        import cloudinary.uploader
    except ImportError:
        print("❌ cloudinary modülü yüklü değil!")
        print("   Yüklemek için: pip install cloudinary")
        return False
    
    # Cloudinary yapılandırması
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True
    )
    
    # Sonuçları saklayacak dict
    image_urls = {}
    
    # Her ürün klasörünü tara
    if not IMAGES_DIR.exists():
        print(f"❌ Görsel klasörü bulunamadı: {IMAGES_DIR}")
        return False
    
    total_uploaded = 0
    total_failed = 0
    
    for product_folder in sorted(IMAGES_DIR.iterdir()):
        if not product_folder.is_dir():
            continue
            
        product_name = product_folder.name
        image_urls[product_name] = []
        
        print(f"\n📁 {product_name}")
        
        for image_file in sorted(product_folder.iterdir()):
            if image_file.suffix.lower() not in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                continue
            
            try:
                # Cloudinary'ye yükle
                # public_id = glindent/product_name/image_name (uzantısız)
                public_id = f"glindent/{product_name}/{image_file.stem}"
                
                result = cloudinary.uploader.upload(
                    str(image_file),
                    public_id=public_id,
                    overwrite=True,
                    resource_type="image",
                    folder=""  # public_id'de zaten belirttik
                )
                
                # Secure URL'yi kaydet
                url = result['secure_url']
                image_urls[product_name].append({
                    'filename': image_file.name,
                    'url': url,
                    'public_id': result['public_id']
                })
                
                print(f"   ✅ {image_file.name}")
                total_uploaded += 1
                
            except Exception as e:
                print(f"   ❌ {image_file.name}: {str(e)}")
                total_failed += 1
    
    # Sonuçları JSON'a kaydet
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(image_urls, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 60)
    print(f"✅ Yükleme tamamlandı!")
    print(f"   Başarılı: {total_uploaded}")
    print(f"   Başarısız: {total_failed}")
    print(f"   URL'ler kaydedildi: {OUTPUT_FILE}")
    print("=" * 60)
    
    return True

def main():
    print("🚀 Glindent Cloudinary Yükleme Script'i")
    print("=" * 60)
    
    if not check_credentials():
        return
    
    upload_images()

if __name__ == "__main__":
    main()
