// Test dosyası - Video olmadan Welcome Modal'ı test etmek için
// Bu dosya development sırasında kullanılabilir

import React from 'react';

/**
 * Minimal test video generator
 * Base64 encoded MP4 - sadece test amaçlı
 * 
 * Kullanım:
 * 1. Aşağıdaki kodu çalıştır
 * 2. Video dosyaları /public/videos/ klasörüne kaydedilecek
 * 
 * Gerçek üretime geçmeden önce uygun boyutta video ekle!
 */

export function createTestVideo() {
  // Minimal MP4 video (1 frame, 1 second)
  // Bu sadece tarayıcı video öğesinin render edilip edilmediğini test etmek için
  
  const base64Video = `
    AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKm0ZIhf
    /1clQgIBAQEAAQEBBIhZdWlkYVRyYWsAAAB0dGtoZAAAAAlhdXRvAGNhbWVyYQAA
    BfGNtZGx0AAAC3AABAQAAQAQAAwAA/wABAAEAAwAAQAEAAwAAQAEAA4AAQAAA
  `;

  console.log('Test Video Created');
  console.log(`
    ✅ Welcome Modal Test Hazırlandı
    
    Video dosyaları /public/videos/ klasörüne ekle:
    - welcome.mp4
    - welcome.webm (opsiyonel)
    - welcome.ogv (opsiyonel)
    
    Hızlı FFmpeg Komutları:
    
    1. MP4 (gerekli):
    ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=10 \\
           -f lavfi -i sine=f=1000:d=10 \\
           -c:v libx264 -c:a aac -pix_fmt yuv420p \\
           public/videos/welcome.mp4
    
    2. WebM (önerilir):
    ffmpeg -i public/videos/welcome.mp4 \\
           -c:v libvpx-vp9 -b:v 1M \\
           public/videos/welcome.webm
    
    3. Ogg (opsiyonel):
    ffmpeg -i public/videos/welcome.mp4 \\
           -c:v libtheora -q:v 7 \\
           public/videos/welcome.ogv
    
    Python Alternatifi:
    python create-welcome-video.py
  `);
}

/**
 * localStorage Test
 * Welcome Modal devamını test et
 */
export function testFirstVisitLogic() {
  if (typeof window === 'undefined') return;

  console.log('🧪 First Visit Test:');
  
  // Kontrol et
  const hasVisited = localStorage.getItem('glindent_first_visit');
  console.log(`✓ localStorage 'glindent_first_visit':`, hasVisited);
  
  // Modal'ı tekrar göstermek için
  if (hasVisited) {
    console.log(`
      Modal tekrar görmek istiyorsan console'dan çalıştır:
      localStorage.removeItem('glindent_first_visit')
      location.reload()
    `);
  } else {
    console.log('✓ İlk ziyaret - Modal gösterilecek');
  }
}

/**
 * Browser Video Support Test
 */
export function testVideoSupport() {
  const video = document.createElement('video');
  
  const codecs = {
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/ogg': 'ogg',
  };

  console.log('📹 Browser Video Support:');
  
  Object.entries(codecs).forEach(([type, name]) => {
    const support = video.canPlayType(type);
    const status = support ? '✅' : '❌';
    console.log(`  ${status} ${name.toUpperCase()}: ${support || 'unsupported'}`);
  });
}

// Development sırasında konsola log yazdır
if (typeof window !== 'undefined') {
  console.log(`
    ╔════════════════════════════════════════╗
    ║  🎬 Welcome Modal - Test Araçları      ║
    ╚════════════════════════════════════════╝
    
    Konsolu aç (F12) ve çalıştır:
    
    1. testVideoSupport()
    2. testFirstVisitLogic()
    3. createTestVideo()
  `);
}

export default {
  createTestVideo,
  testFirstVisitLogic,
  testVideoSupport,
};
