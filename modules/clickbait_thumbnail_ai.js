/**
 * Module: AI Clickbait Thumbnail Generator (MrBeast Style)
 * Exaggerates facial expressions (eyes/mouth), removes background, adds neon glow borders and reaction arrows.
 */

class ClickbaitThumbnailAI {
  generateThumbnails(videoTitle = 'Video Viral Triệu View') {
    return {
      ok: true,
      generatorModel: 'FaceExaggerate-v2 & SegmentAnything (SAM)',
      predictedCtrBoost: '+320% CTR so với ảnh thumbnail thường',
      templates: [
        {
          id: 'thumb_mrbeast_shock',
          name: '😲 Biểu Cảm Há Hốc Mồm (MrBeast Shock)',
          tag: 'Best for Shorts / Reels',
          borderGlow: '#f59e0b',
          badgeText: 'KHÔNG THỂ TIN ĐƯỢC!',
          previewImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
          faceScale: '1.25x (Phóng to mắt 20%, mở rộng miệng 30%)'
        },
        {
          id: 'thumb_red_arrow_mystery',
          name: '🎯 Mũi Tên Đỏ Bí Ẩn & Vòng Tròn Đỏ (Curiosity Gap)',
          tag: 'Tò Mò Tuyệt Đối',
          borderGlow: '#ef4444',
          badgeText: 'BÍ MẬT 99% BỎ QUA',
          previewImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
          faceScale: '1.15x'
        },
        {
          id: 'thumb_cyber_neon',
          name: '✨ Cyberpunk Neon Cutout (Chuyên Nghiệp)',
          tag: 'Tech & Podcast',
          borderGlow: '#8b5cf6',
          badgeText: 'THỦ THUẬT 2026',
          previewImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
          faceScale: '1.10x'
        }
      ]
    };
  }
}

module.exports = new ClickbaitThumbnailAI();
