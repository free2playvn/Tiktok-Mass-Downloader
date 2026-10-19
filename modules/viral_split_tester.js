/**
 * Module 7: Viral A/B Hook & Thumbnail Split Tester
 * Generates 3 hook variations and thumbnail angles to split-test on clone accounts
 * and crown the viral winning video before pushing to the main channel.
 */

class ViralSplitTester {
  constructor() {
    this.campaigns = [
      {
        id: 'ab_camp_01',
        title: 'Chiến Dịch A/B: NST Viet Mix Vol 4 2025',
        status: 'running',
        startedAt: '13:00 19/10/2026',
        winningVariant: 'Variant B (Data Hook)',
        variants: [
          {
            variantId: 'A',
            hookType: 'Tò Mò & Bí Ẩn (Curiosity Hook)',
            hookText: '🔥 Bạn có chắc mình đã từng nghe bản mix đỉnh nhất TikTok tháng này chưa?',
            thumbnailTag: 'BÍ MẬT 2025',
            channelTested: 'Clone #1 (Nhạc Bay)',
            views: 4210,
            completionRate: '58.2%',
            likes: 312
          },
          {
            variantId: 'B',
            hookType: 'Con Số Gây Sốc (Data Hook - WINNER)',
            hookText: '⚡ 1 Triệu người đang nghe bài này để xả stress, nghe thử đoạn này!',
            thumbnailTag: 'TRIỆU NGƯỜI NGHE',
            channelTested: 'Clone #2 (Nhạc Xe)',
            views: 18450,
            completionRate: '84.6%',
            likes: 1940
          },
          {
            variantId: 'C',
            hookType: 'Đảo Đoạn Cao Trào (Climax Flash-Forward)',
            hookText: '💥 Bắt đầu từ giây 45 trở đi là giai điệu khiến bạn không thể ngồi yên...',
            thumbnailTag: 'ĐOẠN ĐỈNH NHẤT',
            channelTested: 'Clone #3 (Nonstop DJ)',
            views: 9200,
            completionRate: '71.0%',
            likes: 820
          }
        ]
      }
    ];
  }

  getCampaigns() {
    return this.campaigns;
  }

  generateVariants(videoTitle = 'TikTok Video', script = '') {
    return {
      ok: true,
      videoTitle,
      variants: [
        {
          id: 'var_a',
          label: 'Biến Thể A: Câu Hỏi Tò Mò',
          hookText: `❓ Bạn đã biết sự thật đằng sau "${videoTitle.slice(0, 30)}..." chưa?`,
          hookLengthSec: 3.2,
          thumbnailBorder: '#f59e0b',
          thumbnailBadge: 'BÍ MẬT'
        },
        {
          id: 'var_b',
          label: 'Biến Thể B: Con Số Gây Sốc (Đề Xuất)',
          hookText: `🔥 90% Mọi người đang bỏ lỡ điều tuyệt vời này trong video hôm nay!`,
          hookLengthSec: 3.0,
          thumbnailBorder: '#ef4444',
          thumbnailBadge: 'CẢNH BÁO'
        },
        {
          id: 'var_c',
          label: 'Biến Thể C: Đảo Đoạn Cao Trào Lên Đầu',
          hookText: `💥 Xem ngay khoảnh khắc bất ngờ nhất xảy ra ở phút thứ 2!`,
          hookLengthSec: 3.5,
          thumbnailBorder: '#8b5cf6',
          thumbnailBadge: 'CỰC ĐỈNH'
        }
      ]
    };
  }

  createCampaign(title, variants) {
    const newCamp = {
      id: 'ab_camp_' + Date.now(),
      title: title || 'Chiến Dịch A/B Mới',
      status: 'active',
      startedAt: new Date().toLocaleString('vi-VN'),
      winningVariant: 'Đang theo dõi...',
      variants: variants || []
    };
    this.campaigns.unshift(newCamp);
    return { ok: true, campaign: newCamp };
  }
}

module.exports = new ViralSplitTester();
