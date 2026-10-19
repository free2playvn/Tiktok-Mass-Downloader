/**
 * Module: AI Live PK Battle & Minigame Engine
 * 
 * Manages live PK battles against rival AI/human streamers and interactive Lucky Wheel on livestream screen.
 */

class LivePKMinigameEngine {
  constructor() {
    this.pkSession = {
      isActive: false,
      opponent: {
        id: 'opp_luna_live',
        name: '💃 Luna Sexy (Shop Mỹ Phẩm Hàn Quốc)',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        score: 1420
      },
      ourScore: 1890,
      remainingSeconds: 180,
      pkStatus: 'leading', // 'leading', 'trailing', 'tied'
      penaltyDare: 'Hít đất 20 cái hoặc hát 1 bài nhạc chế'
    };

    this.luckyWheel = {
      isSpinning: false,
      prizes: [
        { id: 'p1', label: 'Voucher 100k', color: '#ef4444', prob: 0.15 },
        { id: 'p2', label: 'Freeship 0đ', color: '#3b82f6', prob: 0.25 },
        { id: 'p3', label: 'Áo Thun 0đ', color: '#10b981', prob: 0.05 },
        { id: 'p4', label: 'Giảm 50k', color: '#f59e0b', prob: 0.30 },
        { id: 'p5', label: 'Quà Bí Mật', color: '#8b5cf6', prob: 0.10 },
        { id: 'p6', label: 'Chúc May Mắn', color: '#6b7280', prob: 0.15 }
      ],
      recentWinners: [
        { user: '@thuylinh_hn', prize: 'Voucher 100k', time: '18:25' },
        { user: '@tuananh_9x', prize: 'Freeship 0đ', time: '18:27' }
      ]
    };
  }

  getPKState() {
    return {
      ok: true,
      pkSession: this.pkSession,
      luckyWheel: this.luckyWheel
    };
  }

  togglePKBattle(start = true) {
    this.pkSession.isActive = !!start;
    if (this.pkSession.isActive) {
      this.pkSession.remainingSeconds = 180;
      this.pkSession.ourScore = Math.floor(1500 + Math.random() * 800);
      this.pkSession.opponent.score = Math.floor(1400 + Math.random() * 800);
      this.pkSession.pkStatus = this.pkSession.ourScore >= this.pkSession.opponent.score ? 'leading' : 'trailing';
    }
    return {
      ok: true,
      message: this.pkSession.isActive ? '⚔️ Đã kết nối thách đấu PK Trận Đấu 3 Phút!' : '⏹ Đã kết thúc trận đấu PK',
      pkSession: this.pkSession
    };
  }

  boostScore(points = 100, isGift = false) {
    if (!this.pkSession.isActive) return { ok: false, error: 'Chưa có trận PK nào đang diễn ra' };

    this.pkSession.ourScore += points;
    // Opponent also gets random points to keep it tight
    this.pkSession.opponent.score += Math.floor(Math.random() * (points * 0.9));
    this.pkSession.pkStatus = this.pkSession.ourScore >= this.pkSession.opponent.score ? 'leading' : 'trailing';

    let speech = isGift 
      ? `Cảm ơn đại gia đã tặng siêu xe/hoa hồng! Điểm PK của đội mình vọt lên ${this.pkSession.ourScore} rồi cả nhà ơi, giữ vững phong độ nhé!` 
      : `Bấm tim dồn dập cứu MC khỏi hình phạt hít đất nào mọi người ơi!`;

    return {
      ok: true,
      pkSession: this.pkSession,
      shoutout: speech
    };
  }

  spinLuckyWheel(viewer = '@khach_xem_live') {
    const r = Math.random();
    let accumulated = 0;
    let selectedPrize = this.luckyWheel.prizes[0];

    for (const p of this.luckyWheel.prizes) {
      accumulated += p.prob;
      if (r <= accumulated) {
        selectedPrize = p;
        break;
      }
    }

    const winnerEntry = {
      user: viewer,
      prize: selectedPrize.label,
      time: new Date().toLocaleTimeString('vi-VN')
    };

    this.luckyWheel.recentWinners.unshift(winnerEntry);
    if (this.luckyWheel.recentWinners.length > 10) this.luckyWheel.recentWinners.pop();

    return {
      ok: true,
      prize: selectedPrize,
      winner: winnerEntry,
      congratsSpeech: `Chúc mừng bạn ${viewer} đã trúng "${selectedPrize.label}" trên Vòng Quay May Mắn! Chạm ngay vào giỏ hàng hoặc inbox shop để nhận quà nha! 🎉`
    };
  }
}

module.exports = new LivePKMinigameEngine();
