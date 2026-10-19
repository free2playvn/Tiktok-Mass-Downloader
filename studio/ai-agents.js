/**
 * TMD Studio Pro - Creative AI Agents Suite
 * 1. HookCraftAgent: Tạo 5 câu mở đầu giật tít 3 giây đầu giữ chân người xem.
 * 2. SmartHighlightAgent: Phân tích và gợi ý các mốc thời gian cắt video ngắn (15s, 30s, 60s).
 * 3. VoiceoverScriptAgent: Soạn kịch bản lồng tiếng tiếng Việt tự nhiên chuẩn văn phong nói.
 * 4. SeoTrendAgent: Tạo tiêu đề giật tít, caption và hashtag leo xu hướng #xuhuong.
 * 5. MultiPlatformPublisherAgent: Quản lý đa kênh (TikTok, YouTube Shorts, Facebook Reels) & clone distribution.
 * 6. OrganicEngagementAgent: Tăng tương tác thật tự nhiên, comment ghim kích thích tranh luận, kịch bản kéo view.
 * 7. TextToSpeechAgent: Bộ phát âm lồng tiếng AI tiếng Việt thời gian thực (Web Speech API).
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

    // Multi-Account & Multi-Platform Profiles Preset
    this.channelProfiles = [
      { id: 'tt-main', platform: 'TikTok', name: 'Kênh Chính @nhacnghedixe', type: 'Main Channel', status: 'Sẵn sàng' },
      { id: 'tt-clone1', platform: 'TikTok', name: 'Kênh Vệ Tinh 1 @vinahouse_club', type: 'Clone / Satellite', status: 'Sẵn sàng' },
      { id: 'tt-clone2', platform: 'TikTok', name: 'Kênh Vệ Tinh 2 @nhacbay_phong', type: 'Clone / Satellite', status: 'Sẵn sàng' },
      { id: 'yt-shorts', platform: 'YouTube', name: 'Kênh YouTube Shorts Official', type: 'Shorts Channel', status: 'Sẵn sàng' },
      { id: 'fb-reels', platform: 'Facebook', name: 'Fanpage Nhạc Nghe Đi Xe Reels', type: 'Page Reels', status: 'Sẵn sàng' }
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

  /**
   * Agent 5: MultiPlatformPublisherAgent - Tối ưu hóa phân phối cho từng nền tảng
   */
  formatPlatformPayload(platform, title, caption, hashtags) {
    const cleanTitle = (title || 'Video Mới').replace(/\[\d+\]/g, '').trim();
    
    if (platform === 'TikTok') {
      return {
        platform: 'TikTok',
        text: `${cleanTitle} 🔥 ${hashtags}`,
        maxChars: 2200,
        features: ['Sound Sync', 'Duet Allowed', 'Stitch Allowed'],
        recommendedAspect: '9:16'
      };
    } else if (platform === 'YouTube') {
      return {
        platform: 'YouTube Shorts',
        title: `${cleanTitle.slice(0, 90)} #Shorts`,
        description: `${cleanTitle}\n\nĐăng ký kênh để thưởng thức thêm nhiều bản nhạc chất lượng cao!\n\n${hashtags}\n#Shorts #YouTubeShorts`,
        maxChars: 5000,
        features: ['Chapters Supported', 'High Bitrate 1080p60'],
        recommendedAspect: '9:16 hoặc 16:9'
      };
    } else {
      // Facebook Reels
      return {
        platform: 'Facebook Reels',
        text: `${cleanTitle}\n\nBấm chia sẻ về trang cá nhân để nghe lại lúc rảnh nhé cả nhà! ❤️\n\n${hashtags}`,
        maxChars: 2000,
        features: ['Feed & Reels Cross-Post', 'Page Distribution'],
        recommendedAspect: '9:16 hoặc 4:5'
      };
    }
  }

  /**
   * Agent 6: OrganicEngagementAgent - Kịch bản tương tác thật, tăng reach tự nhiên
   */
  generateEngagementBoosters(title) {
    const clean = (title || 'bản nhạc này').replace(/#\w+/g, '').replace(/\[\d+\]/g, '').trim();
    return {
      pinnedComments: [
        `📌 Câu hỏi thảo luận: Anh em chấm ${clean} này được mấy điểm trên thang điểm 10? Comment thật lòng bên dưới nhé! 👇`,
        `📌 Đố anh em nhận ra bài hát gốc ở giây thứ 15 là bài gì? Ai trả lời đúng đầu tiên mình ghim comment luôn! 🏆`,
        `📌 Ai nghe xong bài này mà thấy người lâng lâng thì để lại 1 cánh tay điểm danh nào! 🙋‍♂️`
      ],
      replyTemplates: [
        'Cảm ơn bạn nhiều nha! Chúc bạn một ngày tràn đầy năng lượng ❤️',
        'Quá chuẩn luôn bạn ơi! Bài này mở trên xe là hết nước chấm!',
        'Nghe với tai nghe hoặc loa sub bao phê luôn bác ơi! 🎧'
      ],
      viralAdvice: 'Thuật toán TikTok và Reels đánh giá cao thời lượng xem hết (Completion Rate) và số lượt Chia sẻ (Shares). Hãy luôn đặt câu hỏi mở ở 3 giây cuối video để kích thích bình luận.'
    };
  }

  /**
   * Agent 7: TextToSpeechAgent - Lồng tiếng AI tiếng Việt bằng Web Speech API
   */
  speakVietnamese(text, options = {}) {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ Speech Synthesis API.');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;

    // Find Vietnamese voice if available in system
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VN'));
    if (viVoice) utterance.voice = viVoice;

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CreativeAIAgents;
} else if (typeof window !== 'undefined') {
  window.CreativeAIAgents = CreativeAIAgents;
}
