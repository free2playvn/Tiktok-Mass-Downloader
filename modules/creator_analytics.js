/**
 * Module: Unified Creator Analytics & Revenue Matrix Dashboard
 * Aggregates multi-channel metrics, view velocity, audience retention curve, and affiliate commissions.
 */

class CreatorAnalytics {
  constructor() {
    this.overview = {
      totalViews: '2,845,920',
      viewsDelta7d: '+34.8%',
      totalFollowers: '184,200',
      followersDelta7d: '+12,450',
      affiliateGmv: '148,650,000 ₫',
      commissionsEarned: '22,297,500 ₫',
      avgRetentionRate: '68.4%',
      activeClones: 12
    };

    this.topVideos = [
      {
        id: 'vid_01',
        title: 'NST Viet Mix Vol 4 2025 - QuanRapper',
        channel: '@nhacnghedixe (Main)',
        views: '1,420,500',
        likes: '128,400',
        shares: '18,200',
        gmv: '45,200,000 ₫',
        retention: '74%'
      },
      {
        id: 'vid_02',
        title: 'Bí Mật Nấu Phở Bò Gia Truyền 30 Năm',
        channel: '@amthuc_viet_clone3',
        views: '680,200',
        likes: '54,300',
        shares: '9,400',
        gmv: '32,100,000 ₫',
        retention: '69%'
      },
      {
        id: 'vid_03',
        title: 'Review Đèn Bàn Học Chống Cận 99k',
        channel: '@giadung_thongminh_vn',
        views: '412,000',
        likes: '39,100',
        shares: '6,100',
        gmv: '71,350,000 ₫',
        retention: '65%'
      }
    ];

    this.channelPerformance = [
      { name: 'TikTok Main (@nhacnghedixe)', status: 'VIP 🟢', views: '1.4M', rev: '9.4M ₫', roi: '18.4x' },
      { name: 'TikTok Clone 01 (Vlog Phượt)', status: 'Active 🟢', views: '380K', rev: '3.1M ₫', roi: '8.2x' },
      { name: 'TikTok Clone 02 (Gia Dụng)', status: 'Active 🟢', views: '412K', rev: '12.8M ₫', roi: '24.1x' },
      { name: 'YouTube Shorts (TMD Studio)', status: 'Active 🟢', views: '480K', rev: '4.2M ₫', roi: '6.5x' },
      { name: 'Facebook Reels Farm (3 Page)', status: 'Active 🟢', views: '173K', rev: '1.8M ₫', roi: '4.1x' }
    ];
  }

  getDashboardData() {
    return {
      ok: true,
      updatedAt: new Date().toLocaleTimeString('vi-VN'),
      overview: this.overview,
      topVideos: this.topVideos,
      channels: this.channelPerformance
    };
  }
}

module.exports = new CreatorAnalytics();
