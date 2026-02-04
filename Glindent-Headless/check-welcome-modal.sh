#!/bin/bash
# Welcome Modal Feature - Kurulum & Test Script
# Bu script feature'ın başarıyla kurulu olup olmadığını kontrol eder

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  🎬 Welcome Modal Feature - Kurulum & Test Kontrolü           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
TOTAL=0
PASSED=0
FAILED=0

# Test fonksiyonu
test_file() {
    local file=$1
    local description=$2
    
    ((TOTAL++))
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description"
        echo "  Dosya: $file"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $description"
        echo "  Dosya bulunamadı: $file"
        ((FAILED++))
    fi
    echo ""
}

test_dir() {
    local dir=$1
    local description=$2
    
    ((TOTAL++))
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $description"
        echo "  Klasör: $dir"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $description"
        echo "  Klasör bulunamadı: $dir"
        ((FAILED++))
    fi
    echo ""
}

test_grep() {
    local file=$1
    local pattern=$2
    local description=$3
    
    ((TOTAL++))
    
    if grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✓${NC} $description"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $description"
        ((FAILED++))
    fi
    echo ""
}

# === TESTS ===

echo "📦 DOSYA & KLASÖR KONTROLLERI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Bileşen dosyaları
test_file "src/components/welcome-modal/index.tsx" "Welcome Modal bileşeni"
test_file "src/components/welcome-modal/welcome-modal.module.css" "Welcome Modal CSS"
test_file "src/hooks/use-first-visit.ts" "useFirstVisit hook'u"
test_file "src/utils/welcome-modal-test.ts" "Test utilities"

# Klasörler
test_dir "public/videos" "Video klasörü"

# Documentation
test_file "WELCOME_MODAL_DOCS.md" "Detaylı dokumentasyon"
test_file "WELCOME_MODAL_INTEGRATION.md" "Entegrasyon checklist'i"

echo ""
echo "🔗 ENTEGRASYON KONTROLLERI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# _app.tsx kontrol
test_grep "src/pages/_app.tsx" "WelcomeModal" "_app.tsx'de WelcomeModal import'u"
test_grep "src/pages/_app.tsx" "useFirstVisit" "_app.tsx'de useFirstVisit import'u"
test_grep "src/pages/_app.tsx" "isFirstVisit" "_app.tsx'de isFirstVisit state'i"

# package.json kontrol
test_grep "package.json" "create-welcome-video" "package.json'da npm script'i"

echo ""
echo "🎬 VIDEO DOSYALARI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Video dosyaları kontrol
if [ -d "public/videos" ]; then
    echo "Video klasörü bulundu:"
    ls -lh public/videos/ 2>/dev/null || echo "  (Henüz video yok - create-welcome-video.py çalıştır)"
else
    echo -e "${YELLOW}⚠${NC}  Video klasörü bulunamadı"
fi
echo ""

echo ""
echo "═════════════════════════════════════════════════════════════════"
echo "📊 TEST ÖZETI"
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo -e "Toplam Test: $TOTAL"
echo -e "Başarılı:   ${GREEN}$PASSED${NC}"
echo -e "Başarısız:  ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Tüm kontroller başarılı!${NC}"
    echo ""
    echo "📝 Sonraki Adımlar:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Video oluştur:"
    echo "   $ python create-welcome-video.py"
    echo ""
    echo "2. Dev server'ı başlat:"
    echo "   $ yarn dev"
    echo ""
    echo "3. Siteyi ziyaret et:"
    echo "   $ open http://localhost:3333"
    echo ""
    echo "4. Welcome modal gösterilmeli (ilk ziyarette otomatik)"
    echo ""
    echo "📚 Daha fazla bilgi için:"
    echo "   $ cat WELCOME_MODAL_DOCS.md"
    echo ""
else
    echo -e "${RED}❌ Bazı dosyalar eksik!${NC}"
    echo ""
    echo "Lütfen şunları kontrol et:"
    echo "1. Dosyaları oluşturduğumu doğrula"
    echo "2. Dosya yollarını kontrol et"
    echo "3. _app.tsx'deki entegrasyonu kontrol et"
    echo ""
fi

echo ""
echo "═════════════════════════════════════════════════════════════════"
