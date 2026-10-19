/**
 * Module: AI Competitor Spy Radar (Radar Bắt Bài Đối Thủ Cùng Ngành)
 * 
 * Tracks competitor TikTok/Reels accounts, detects breakout viral videos (>50k view/6h),
 * analyzes psychological hook triggers, and drafts counter-strategy video scripts.
 */

class CompetitorSpyRadarEngine {
  constructor() {
    this.monitoredCompetitors = [
      {
        id: 'comp_top_sneaker',
        handle: '@sneaker_king_vn',
        channelName: 'Sneaker King Việt Nam',
        niche: 'Thời trang & Giày dép',
        followers: '850K',
        breakoutVideosDetected: 3,
        lastActive: '30 phút trước'
      },
      {
        id: 'comp_tech_unbox',
        handle: '@review_do_cong_nghe',
        channelName: 'Thế Giới Phụ Kiện GenZ',
        niche: 'Đồ điện tử & Công nghệ',
        followers: '1.2M',
        breakoutVideosDetected: 5,
        lastActive: '15 phút trước'
      },
      {
        id: 'comp_beauty_care',
        handle: '@goc_lam_dep_thao',
        channelName: 'Góc Skincare Chuẩn Y Khoa',
        niche: 'Mỹ phẩm & Skincare',
        followers: '620K',
        breakoutVideosDetected: 2,
        lastActive: '1 giờ trước'
      }
    ];

    this.breakoutAlerts = [
      {
        alertId: 'alt_breakout_991',
        channelHandle: '@sneaker_king_vn',
        videoTitle: 'Đừng mua đôi giày này nếu bạn chưa biết sự thật sau 1 tháng sử dụng!',
        viewsIn6h: '185,000 views',
        velocity: '+32,000 view/h',
        hookPattern: 'Negative Curiosity Hook (Cảnh báo tò mò ngược)',
        hookAnalysis: 'Kích thích tâm lý sợ mua hớ trong 2.5 giây đầu bằng cách chê sản phẩm nhưng thực chất là khen độ bền.',
        counterStrategySuggestion: 'Tạo video đối trọng: "3 chi tiết chỉ người đi giày lâu năm mới nhận ra ở bản nâng cấp 2026!"',
        detectedTime: '18:15 Hôm nay'
      }
    ];
  }

  getRadarData() {
    return {
      ok: true,
      competitors: this.monitoredCompetitors,
      alerts: this.breakoutAlerts,
      radarStatus: 'SCANNING_ACTIVE_30_MIN_INTERVAL'
    };
  }

  generateCounterStrategy(alertId) {
    const alert = this.breakoutAlerts.find(a => a.alertId === alertId) || this.breakoutAlerts[0];

    return {
      ok: true,
      message: `Đã bóc mánh kịch bản và tạo chiến lược phản đòn cho video của ${alert.channelHandle}!`,
      counterPlan: {
        targetAlert: alert,
        suggestedHook: 'Dừng lại 3 giây! Video triệu view kia nói đúng 50%, nhưng đây mới là sự thật bạn cần biết...',
        scriptOutline: [
          '0-3s: Đập vào mắt bằng góc quay cận cảnh đế đệm phát sáng.',
          '3-15s: Phản biện luận điểm của đối thủ bằng thử nghiệm thực tế (uốn cong, kháng nước).',
          '15-35s: So sánh chất liệu cao cấp và giải thích vì sao giá chỉ bằng 1/3.',
          '35-45s: Kêu gọi chốt deal flash sale độc quyền trên live.'
        ],
        recommendedAudioTrack: 'Trend Phonk Beat Remix 2026',
        targetPublishWindow: 'Trong vòng 4 giờ tới (Đón đầu xu hướng tìm kiếm)'
      }
    };
  }
}

module.exports = new CompetitorSpyRadarEngine();
