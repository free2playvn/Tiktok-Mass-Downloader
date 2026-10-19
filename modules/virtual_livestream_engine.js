/**
 * Module: Virtual Livestream Engine (Digital Human 24/7 Live Host)
 * 
 * Multi-Platform Broadcast Bridge:
 * - TikTok Live (RTMP: live-push.tiktokv.com)
 * - YouTube Live (RTMP: a.rtmp.youtube.com)
 * - Facebook Live (RTMPS: live-api-s.facebook.com)
 * 
 * Features:
 * - Simultaneous Master Push across all 3 platforms (Multi-stream relay).
 * - Unified Multi-Platform Chat Feed with channel badges.
 * - Platform-specific auto-ordering bots (Facebook phone parsing, TikTok shop pinning).
 * - Realtime aggregated metrics: Total viewers, likes, combined GMV.
 */

class VirtualLivestreamEngine {
  constructor() {
    this.session = {
      isLive: false,
      startTime: null,
      activeHostId: 'host_mai_phuong',
      activeProductId: 'prod_01',
      cameraMode: 'dynamic_pan',
      totalViewers: 2950,
      totalLikes: 37400,
      revenueGmv: 24800000 // VND
    };

    // 1. Triple-Platform Configuration (TikTok, YouTube, Facebook)
    this.platforms = {
      tiktok: {
        id: 'tiktok',
        name: 'TikTok Live',
        icon: '🎵',
        color: '#00f2fe',
        badgeClass: 'tiktok-badge',
        rtmpServer: 'rtmp://live-push.tiktokv.com/live/',
        streamKey: 'live_tk_vn_78491823901_sec',
        status: 'ready', // 'ready', 'streaming', 'reconnecting', 'offline'
        enabled: true,
        viewers: 1420,
        likes: 28400,
        bitrate: '4500 Kbps',
        fps: 60,
        resolution: '1080x1920 (9:16 Dọc)',
        latencyMs: 140,
        features: ['TikTok Shop', 'Ghim Giỏ Hàng', 'PK Trận Đấu', 'Filter AR'],
        lastPing: 'Optimal (12ms)'
      },
      youtube: {
        id: 'youtube',
        name: 'YouTube Live',
        icon: '▶️',
        color: '#ff0000',
        badgeClass: 'youtube-badge',
        rtmpServer: 'rtmp://a.rtmp.youtube.com/live2',
        streamKey: 'yt_live_vn_2026_a8f9c2d_hdr',
        status: 'ready',
        enabled: true,
        viewers: 890,
        likes: 5200,
        bitrate: '6000 Kbps',
        fps: 60,
        resolution: '1080x1920 Shorts Live / 1440p',
        latencyMs: 210,
        features: ['Super Chat', 'YouTube Shopping', 'Ultra Low Latency', 'Lưu Video 4K'],
        lastPing: 'Optimal (18ms)'
      },
      facebook: {
        id: 'facebook',
        name: 'Facebook Live',
        icon: '👥',
        color: '#1877f2',
        badgeClass: 'facebook-badge',
        rtmpServer: 'rtmps://live-api-s.facebook.com:443/rtmp/',
        streamKey: 'fb_live_sec_991823102_secure_token',
        status: 'ready',
        enabled: true,
        viewers: 640,
        likes: 3800,
        bitrate: '4000 Kbps',
        fps: 60,
        resolution: '1080x1920 HD',
        latencyMs: 280,
        features: ['Tự Chốt Đơn SĐT', 'Fanpage & Group Sync', 'Tự Bắn Tin Nhắn Messenger'],
        lastPing: 'Optimal (24ms)'
      }
    };

    this.hosts = [
      {
        id: 'host_mai_phuong',
        name: '💃 Mai Phương (MC Thời Trang & Phụ Kiện)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        tone: 'Ngọt ngào, duyên dáng, chốt sale nhanh nhẹn',
        voiceId: 'voice_viet_news_pro',
        specialty: 'Quần áo thời trang, túi xách, giày dép'
      },
      {
        id: 'host_hoang_long',
        name: '👨‍💻 Hoàng Long (MC Công Nghệ & Gia Dụng)',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        tone: 'Chuyên gia uy tín, rành thông số, dõng dạc',
        voiceId: 'voice_viet_tech_lead',
        specialty: 'Đồ điện tử, gia dụng thông minh, phụ kiện máy tính'
      },
      {
        id: 'host_anh_tuyet',
        name: '✨ Ánh Tuyết (MC Mỹ Phẩm & Skincare)',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
        tone: 'Nhẹ nhàng, chia sẻ kinh nghiệm chăm sóc da',
        voiceId: 'voice_viet_docu_soft',
        specialty: 'Mỹ phẩm, son môi, kem chống nắng'
      }
    ];

    this.catalog = [
      {
        id: 'prod_01',
        title: 'Áo Thun Cotton 100% Unisex Form Rộng Phố Đêm',
        originalPrice: '250.000 ₫',
        flashSalePrice: '99.000 ₫',
        discountPercent: '-60%',
        remainingStock: 18,
        isPinned: true,
        img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'prod_02',
        title: 'Tai Nghe Bluetooth TWS Chống Ồn Chủ Động ANC',
        originalPrice: '590.000 ₫',
        flashSalePrice: '289.000 ₫',
        discountPercent: '-51%',
        remainingStock: 7,
        isPinned: false,
        img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=60'
      },
      {
        id: 'prod_03',
        title: 'Serum Vitamin C Sáng Da Mờ Thâm 30ml Chính Hãng',
        originalPrice: '380.000 ₫',
        flashSalePrice: '195.000 ₫',
        discountPercent: '-48%',
        remainingStock: 12,
        isPinned: false,
        img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=60'
      }
    ];

    // Unified Multi-Platform Chat Feed
    this.liveCommentsFeed = [
      {
        id: 'lc_1',
        platform: 'tiktok',
        user: '@thuylinh_hn',
        text: 'Áo thun có size L cho bạn 65kg không shop?',
        reply: 'Chào bạn Thùy Linh nha! Mẫu áo cotton bên mình size L cho bạn 65kg mặc bao chuẩn form rộng rụng tim luôn ạ. Bạn bấm vào giỏ hàng góc trái TikTok Shop đặt ngay kẻo hết mã giảm 50k nhé! ❤️',
        time: '18:20:10'
      },
      {
        id: 'lc_2',
        platform: 'youtube',
        user: '@minhtri_review',
        text: 'Mẫu tai nghe ANC pin dùng liên tục được bao nhiêu tiếng vậy shop?',
        reply: 'Chào anh Minh Trí trên YouTube nhé! Tai nghe ANC nghe liên tục 8 tiếng, hộp sạc hỗ trợ thêm 32 tiếng nữa, có bảo hành 12 tháng 1 đổi 1 ạ! 🎧',
        time: '18:21:05'
      },
      {
        id: 'lc_3',
        platform: 'facebook',
        user: 'Lan Hương Nguyễn',
        text: 'Chốt 2 áo thun màu đen size M sđt 0912345678',
        reply: 'Dạ shop đã tự động nhận đơn của chị Lan Hương trên Facebook Live qua SĐT 0912345678 rồi ạ! Nhân viên sẽ nhắn Messenger xác nhận giao hàng ngay trong tối nay nhé! ✨',
        time: '18:22:15'
      }
    ];
  }

  /**
   * Recalculate combined stats
   */
  _recomputeAggregatedMetrics() {
    let viewers = 0;
    let likes = 0;
    Object.values(this.platforms).forEach(p => {
      if (p.enabled) {
        viewers += p.viewers;
        likes += p.likes;
      }
    });
    this.session.totalViewers = viewers;
    this.session.totalLikes = likes;
  }

  getLiveState() {
    this._recomputeAggregatedMetrics();
    return {
      ok: true,
      session: this.session,
      platforms: this.platforms,
      hosts: this.hosts,
      catalog: this.catalog,
      recentComments: this.liveCommentsFeed
    };
  }

  /**
   * Toggle multi-platform live stream
   */
  toggleLiveStream(start = true, targetPlatforms = ['tiktok', 'youtube', 'facebook']) {
    this.session.isLive = !!start;
    
    if (this.session.isLive) {
      this.session.startTime = new Date().toLocaleTimeString('vi-VN');
    }

    // Update statuses for selected platforms
    Object.keys(this.platforms).forEach(k => {
      if (targetPlatforms.includes(k) && this.platforms[k].enabled) {
        this.platforms[k].status = this.session.isLive ? 'streaming' : 'ready';
      } else if (!this.session.isLive) {
        this.platforms[k].status = 'ready';
      }
    });

    this._recomputeAggregatedMetrics();

    const activeList = Object.values(this.platforms)
      .filter(p => p.status === 'streaming')
      .map(p => `${p.icon} ${p.name}`)
      .join(', ');

    return {
      ok: true,
      isLive: this.session.isLive,
      statusText: this.session.isLive
        ? `🟢 ĐANG PHÁT SÓNG ĐỒNG THỜI: ${activeList || 'Không có kênh'}`
        : '⚪ ĐÃ DỪNG PHÁT SÓNG TRỰC TIẾP',
      session: this.session,
      platforms: this.platforms
    };
  }

  /**
   * Update Stream Key / Server settings for platforms
   */
  updatePlatformSettings(platformId, settings = {}) {
    if (!this.platforms[platformId]) {
      return { ok: false, error: 'Không tìm thấy nền tảng: ' + platformId };
    }

    const p = this.platforms[platformId];
    if (settings.streamKey !== undefined) p.streamKey = settings.streamKey.trim();
    if (settings.rtmpServer !== undefined) p.rtmpServer = settings.rtmpServer.trim();
    if (settings.enabled !== undefined) p.enabled = !!settings.enabled;

    this._recomputeAggregatedMetrics();

    return {
      ok: true,
      message: `Đã cập nhật cấu hình phát sóng cho ${p.icon} ${p.name}!`,
      platform: p,
      session: this.session
    };
  }

  selectHost(hostId) {
    const found = this.hosts.find(h => h.id === hostId);
    if (found) this.session.activeHostId = hostId;
    return { ok: true, activeHost: found || this.hosts[0] };
  }

  pinProduct(prodId) {
    this.catalog.forEach(p => p.isPinned = (p.id === prodId));
    this.session.activeProductId = prodId;
    const pinned = this.catalog.find(p => p.id === prodId);
    return { ok: true, pinnedProduct: pinned };
  }

  /**
   * Handle incoming comment with platform awareness
   */
  handleIncomingViewerComment(user, text, platform = 'tiktok') {
    const pinned = this.catalog.find(p => p.id === this.session.activeProductId) || this.catalog[0];
    const platformMeta = this.platforms[platform] || this.platforms.tiktok;
    
    // Check if phone number is present (Facebook auto-order)
    const phoneMatch = text.match(/(0\d{9,10})/);
    const isPrice = text.toLowerCase().includes('giá') || text.toLowerCase().includes('bao nhiêu') || text.toLowerCase().includes('size') || text.toLowerCase().includes('chốt');

    let generatedSpeech = '';
    if (phoneMatch) {
      generatedSpeech = `Dạ shop đã chốt đơn thành công cho ${user} trên ${platformMeta.name} qua SĐT ${phoneMatch[1]} rồi ạ! Đơn sẽ được gửi đi ngay trong ngày mai nha! 📦`;
      this.session.revenueGmv += 198000;
      if (this.platforms[platform]) this.platforms[platform].likes += 50;
    } else if (isPrice) {
      if (platform === 'tiktok') {
        generatedSpeech = `Chào bạn ${user} trên TikTok! Mẫu ${pinned.title.substring(0, 30)} đang Flash Sale chỉ còn ${pinned.flashSalePrice}! Bạn bấm giỏ hàng góc trái màn hình TikTok chốt đơn liền tay nhé! 🔥`;
      } else if (platform === 'youtube') {
        generatedSpeech = `Chào anh/chị ${user} trên YouTube! Sản phẩm ${pinned.title.substring(0, 30)} giảm sốc ${pinned.flashSalePrice}, link mua hàng chính hãng đã được ghim trong phần mô tả và khung chat YouTube nhé! ✨`;
      } else {
        generatedSpeech = `Chào bạn ${user} trên Facebook Live! Mẫu này giá sale chỉ ${pinned.flashSalePrice}, bạn comment cú pháp "CHỐT ĐƠN + SĐT" để hệ thống tự động lên đơn ngay nhé! 💬`;
      }
      this.session.revenueGmv += 99000;
    } else {
      generatedSpeech = `Cảm ơn bạn ${user} từ ${platformMeta.name} đã theo dõi buổi livestream! Thả tim giúp shop để nhận mã Freeship toàn quốc nha! ❤️`;
      if (this.platforms[platform]) this.platforms[platform].likes += 100;
    }

    const cmt = {
      id: 'lc_' + Date.now(),
      platform: platform,
      user,
      text,
      reply: generatedSpeech,
      time: new Date().toLocaleTimeString('vi-VN')
    };

    this.liveCommentsFeed.unshift(cmt);
    if (this.liveCommentsFeed.length > 40) this.liveCommentsFeed.pop();
    this._recomputeAggregatedMetrics();

    return {
      ok: true,
      comment: cmt,
      spokenSpeech: generatedSpeech,
      liveSession: this.session,
      platforms: this.platforms
    };
  }
}

module.exports = new VirtualLivestreamEngine();
