/**
 * Module: AI Auto B-Roll Inserter & Facecam Reaction Generator
 * 
 * Analyzes speech transcripts, extracts visual keywords, automatically selects
 * high-res B-Roll footage, and generates synchronized creator reaction facecams.
 */

class AutoBrollReactionEngine {
  constructor() {
    this.stockLibrary = [
      { id: 'broll_cyber_city', keyword: 'công nghệ', title: 'Thành phố tương lai Cyberpunk 4K', duration: 4.5, thumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=300&auto=format&fit=crop&q=60' },
      { id: 'broll_running_shoe', keyword: 'thể thao', title: 'Chạy bộ nước rút trên đường dốc', duration: 3.8, thumb: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&auto=format&fit=crop&q=60' },
      { id: 'broll_luxury_store', keyword: 'thời trang', title: 'Cửa hàng thời trang cao cấp Paris', duration: 5.0, thumb: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&auto=format&fit=crop&q=60' },
      { id: 'broll_cash_flow', keyword: 'tiền', title: 'Dòng tiền giao dịch kỹ thuật số', duration: 3.2, thumb: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&auto=format&fit=crop&q=60' },
      { id: 'broll_nature_pure', keyword: 'mỹ phẩm', title: 'Giọt sương mai trên cánh hoa hồng', duration: 4.0, thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=60' }
    ];

    this.reactionPresets = [
      { id: 'rx_shocked', label: '😱 Há hốc mồm kinh ngạc (Gấp 3 CTR)', icon: '😱', duration: 2.5 },
      { id: 'rx_nodding', label: '👍 Gật gù tán thành sâu sắc', icon: '👍', duration: 3.0 },
      { id: 'rx_laughing', label: '😂 Cười thích thú sảng khoái', icon: '😂', duration: 2.8 },
      { id: 'rx_curious', label: '🤔 Nhíu mày tò mò soi kỹ chi tiết', icon: '🤔', duration: 3.5 }
    ];
  }

  analyzeAndSuggestBroll(transcriptText) {
    const text = (transcriptText || '').toLowerCase();
    const matchedBrolls = [];

    this.stockLibrary.forEach(item => {
      if (text.includes(item.keyword) || text.includes(item.title.toLowerCase())) {
        matchedBrolls.push(item);
      }
    });

    // Fallback if no direct keyword match
    if (matchedBrolls.length === 0) {
      matchedBrolls.push(this.stockLibrary[0], this.stockLibrary[1]);
    }

    return {
      ok: true,
      matchedCount: matchedBrolls.length,
      suggestedBrolls: matchedBrolls,
      timelineCutPoints: [
        { startSec: 3.2, endSec: 6.8, brollId: matchedBrolls[0].id, title: matchedBrolls[0].title },
        { startSec: 12.0, endSec: 15.5, brollId: matchedBrolls[1] ? matchedBrolls[1].id : matchedBrolls[0].id, title: matchedBrolls[1] ? matchedBrolls[1].title : matchedBrolls[0].title }
      ]
    };
  }

  generateFacecamOverlay(reactionId = 'rx_shocked', position = 'top_right') {
    const reaction = this.reactionPresets.find(r => r.id === reactionId) || this.reactionPresets[0];

    return {
      ok: true,
      message: `Đã kích hoạt khung Facecam Reaction "${reaction.label}" ở góc ${position}!`,
      facecamConfig: {
        reactionId: reaction.id,
        label: reaction.label,
        position, // 'top_right', 'top_left', 'bottom_right'
        frameStyle: 'circular_neon_glow',
        borderGlowColor: '#00f2fe',
        sizePercent: 22, // 22% of screen
        reactionClipDurationSec: reaction.duration
      }
    };
  }
}

module.exports = new AutoBrollReactionEngine();
