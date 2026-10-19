/**
 * TMD Studio Pro - Creative AI Agents Suite
 * Inspired by modern AI video editing workflows and vietnamese-humanizer:
 * 1. HookCraftAgent: Tạo câu mở đầu giật tít 3 giây đầu cho video TikTok/Reels.
 * 2. SmartHighlightAgent: Phân tích và gợi ý các mốc thời gian cắt video ngắn (15s, 30s, 60s).
 * 3. VoiceoverScriptAgent: Soạn kịch bản lồng tiếng tiếng Việt tự nhiên chuẩn văn phong nói.
 * 4. SeoTrendAgent: Tạo tiêu đề giật tít, caption và hashtag leo xu hướng #xuhuong.
 */

class CreativeAIAgents {
  constructor() {
    this.hookTemplates = [
      { style: 'Tò mò bí ẩn', template: (topic) => `Bạn có chắc mình đã biết sự thật về ${topic}? Xem ngay kẻo lỡ!` },
      { style: 'Cảnh báo / Sai lầm', template: (topic) => `Dừng lại ngay nếu bạn vẫn đang làm ${topic} theo cách cũ!` },
      { style: 'Bật mí mẹo đỉnh', template: (topic) => `Bí mật về ${topic} mà 99% người dùng TikTok không ai nói cho bạn biết.` },
      { style: 'Trải nghiệm cá nhân', template: (topic) => `Mình đã thử ${topic} trong suốt 7 ngày và đây là kết quả bất ngờ...` },
      { style: 'Gợi mở cảm xúc', template: (topic) => `Bản nhạc này sinh ra là dành riêng cho những ai đang ${topic}...` }
    ];

    this.musicVibes = [
      { name: 'EDM Viet Mix Sôi Động', bpm: 135, style: 'Bass căng, thích hợp video nhảy, xe độ, biến hình' },
      { name: 'Lofi Chill Buồn', bpm: 85, style: 'Êm dịu, thích hợp tâm trạng, đêm muộn, ngắm phố' },
      { name: 'Remix Hot Trend TikTok', bpm: 128, style: 'Giai điệu bắt tai, dễ kéo view' },
      { name: 'Acoustic Mộc Mạc', bpm: 90, style: 'Kể chuyện, chia sẻ kiến thức, vlog đời thường' }
    ];
  }

  /**
   * Agent 1: HookCraftAgent - Sinh 5 câu Hook 3 giây đầu tiên
   */
  generateHooks(topicOrTitle) {
    const cleanTopic = (topicOrTitle || 'video này').replace(/#\w+/g, '').replace(/\[\d+\]/g, '').trim();
    return this.hookTemplates.map((t, idx) => ({
      id: idx + 1,
      style: t.style,
      text: t.template(cleanTopic),
      duration: '00:00 - 00:03'
    }));
  }

  /**
   * Agent 2: SmartHighlightAgent - Phân tích video và đề xuất các mốc cắt Short/Reels
   */
  suggestHighlights(videoDuration = 60, title = '') {
    const dur = Math.max(15, Math.floor(videoDuration));
    const suggestions = [];

    // Clip 1: Mở màn & Hook (15s)
    suggestions.push({
      id: 1,
      type: '15s Teaser / Hook',
      start: 0,
      end: Math.min(15, dur),
      description: 'Đoạn mở đầu lôi cuốn nhất để thu hút người xem trong 3 giây đầu.',
      recommendedPlatform: 'TikTok Story / Facebook Story'
    });

    // Clip 2: Đoạn cao trào / Beat Drop (30s)
    const midPoint = Math.floor(dur * 0.35);
    const midEnd = Math.min(dur, midPoint + 30);
    suggestions.push({
      id: 2,
      type: '30s Highlight / Beat Drop',
      start: midPoint,
      end: midEnd,
      description: 'Đoạn năng lượng cao nhất, nhạc bùng nổ, giữ chân người xem lâu nhất.',
      recommendedPlatform: 'TikTok Feed / Instagram Reels'
    });

    // Clip 3: Bản tóm tắt đầy đủ (60s)
    if (dur >= 60) {
      const longStart = Math.floor(dur * 0.2);
      suggestions.push({
        id: 3,
        type: '60s Viral Cut',
        start: longStart,
        end: Math.min(dur, longStart + 60),
        description: 'Đầy đủ phần mở bài, cao trào và lời kêu gọi hành động (CTA).',
        recommendedPlatform: 'YouTube Shorts / TikTok Series'
      });
    }

    return suggestions;
  }

  /**
   * Agent 3: VoiceoverScriptAgent - Chuyển tiêu đề hoặc tóm tắt thành kịch bản lồng tiếng
   */
  generateVoiceoverScript(topic, tone = 'tiktok') {
    const raw = (topic || 'chủ đề hôm nay').trim();
    if (tone === 'tiktok') {
      return `Hê sờ lô các bạn! Hôm nay mình sẽ bật mí cho mọi người một điều cực kỳ thú vị về ${raw}. Đảm bảo xem xong các bạn sẽ mê luôn! Đừng quên thả tim và bấm follow kênh để không bỏ lỡ những video tiếp theo nha!`;
    } else if (tone === 'storytelling') {
      return `Có những khoảnh khắc trong cuộc sống, khi chúng ta lắng lòng lại và cảm nhận ${raw}. Hãy cùng tụi mình thả hồn vào giai điệu này để tìm lại sự bình yên sau một ngày dài mỏi mệt nhé.`;
    } else {
      return `Xin chào quý vị khán giả. Trong video ngày hôm nay, chúng tôi xin trân trọng giới thiệu đến quý vị nội dung đặc sắc về ${raw}. Kính mời quý vị cùng theo dõi chi tiết ngay sau đây.`;
    }
  }

  /**
   * Agent 4: SeoTrendAgent - Tạo Caption chuẩn SEO và bộ Hashtag xu hướng
   */
  generateSeoMetadata(title = '', author = 'creator') {
    const cleanTitle = title.replace(/#\w+/g, '').replace(/\[\d+\]/g, '').trim() || 'Video Cực Cuốn';
    const baseHashtags = ['#xuhuong', '#fyp', '#viral', '#tiktokvietnam', '#trending', '#nhachay'];
    const customTag = author ? `#${author.replace(/[@\s]/g, '').toLowerCase()}` : '#tmdstudio';

    return {
      caption: `${cleanTitle} 🔥 Anh em nghe thử xem có cuốn không nhé! Thả tim ủng hộ mình nha ❤️`,
      hashtags: [customTag, ...baseHashtags].join(' '),
      idealPostingTime: '11:30 - 13:00 (Trưa) hoặc 19:30 - 21:30 (Tối)'
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CreativeAIAgents;
} else if (typeof window !== 'undefined') {
  window.CreativeAIAgents = CreativeAIAgents;
}
