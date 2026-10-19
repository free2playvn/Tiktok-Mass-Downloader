/**
 * Module: Virtual Livestream Engine (Digital Human 24/7 Live Host)
 * Realtime RTMP broadcasting, live comment processing, auto product pinning, and virtual host speech synthesis.
 */

class VirtualLivestreamEngine {
  constructor() {
    this.session = {
      isLive: false,
      startTime: null,
      streamKey: 'live_tk_vn_78491823901_sec',
      rtmpServer: 'rtmp://live-push.tiktokv.com/live/',
      platform: 'tiktok_live', // 'tiktok_live', 'shopee_live', 'facebook_live'
      viewerCount: 1420,
      likesCount: 28400,
      revenueGmv: 18500000, // VND
      activeHostId: 'host_mai_phuong',
      activeProductId: 'prod_01',
      cameraMode: 'dynamic_pan'
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

    this.liveCommentsFeed = [
      {
        id: 'lc_1',
        user: '@thuylinh_hn',
        text: 'Áo thun có size L cho bạn 65kg không shop?',
        reply: 'Chào bạn Thùy Linh nha! Mẫu áo cotton bên mình size L cho bạn 65kg mặc bao chuẩn form rộng rụng tim luôn ạ. Bạn bấm vào giỏ hàng góc trái đặt ngay kẻo hết mã giảm 50k nhé! ❤️',
        time: '18:01:10'
      },
      {
        id: 'lc_2',
        user: '@tuan_anh_9x',
        text: 'Chất vải có bị xù lông khi giặt máy không bạn ơi?',
        reply: 'Dạ cam kết 100% cotton sợi bông cao cấp giặt máy thoải mái không bai nhão không xù lông bạn Tuấn Anh yên tâm nhé! 🔥',
        time: '18:01:25'
      }
    ];
  }

  getLiveState() {
    return {
      ok: true,
      session: this.session,
      hosts: this.hosts,
      catalog: this.catalog,
      recentComments: this.liveCommentsFeed
    };
  }

  toggleLiveStream(start = true, platform = 'tiktok_live') {
    this.session.isLive = !!start;
    this.session.platform = platform;
    if (this.session.isLive) {
      this.session.startTime = new Date().toLocaleTimeString('vi-VN');
    }
    return {
      ok: true,
      isLive: this.session.isLive,
      statusText: this.session.isLive ? '🟢 ĐANG PHÁT SÓNG TRỰC TIẾP' : '⚪ ĐÃ DỪNG PHÁT SÓNG',
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

  handleIncomingViewerComment(user, text) {
    const isPrice = text.toLowerCase().includes('giá') || text.toLowerCase().includes('bao nhiêu') || text.toLowerCase().includes('size') || text.toLowerCase().includes('mua');
    const pinned = this.catalog.find(p => p.id === this.session.activeProductId) || this.catalog[0];
    
    let generatedSpeech = '';
    if (isPrice) {
      generatedSpeech = `Dạ chào ${user}! Mẫu ${pinned.title.substring(0, 30)} đang Flash Sale giảm sâu chỉ còn ${pinned.flashSalePrice} thôi nè! Chỉ còn đúng ${pinned.remainingStock} suất, bạn chạm ngay vào giỏ hàng ghim số 1 góc dưới để chốt đơn ngay nha!`;
      this.session.revenueGmv += 99000;
    } else {
      generatedSpeech = `Cảm ơn bạn ${user} đã ghé phiên livestream của shop nha! Mọi người thả tim giúp em lên 50k tim để nhận mã Freeship toàn quốc nhé! ✨`;
      this.session.likesCount += 150;
    }

    const cmt = {
      id: 'lc_' + Date.now(),
      user,
      text,
      reply: generatedSpeech,
      time: new Date().toLocaleTimeString('vi-VN')
    };

    this.liveCommentsFeed.unshift(cmt);
    if (this.liveCommentsFeed.length > 30) this.liveCommentsFeed.pop();

    return {
      ok: true,
      comment: cmt,
      spokenSpeech: generatedSpeech,
      liveSession: this.session
    };
  }
}

module.exports = new VirtualLivestreamEngine();
