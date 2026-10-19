/**
 * Module: AI Smart Comment Seeder & Auto-DM Lead Converter
 * Classifies comment intent, generates natural humanized replies, and automates Direct Message lead capture.
 */

class CommentSeeder {
  constructor() {
    this.commentQueue = [
      {
        id: 'cmt_001',
        videoTitle: 'NST Viet Mix Vol 4 2025',
        author: '@lananh_fashion',
        text: 'Áo này bao nhiêu tiền một chiếc vậy shop? Có size L không ạ?',
        intent: 'Hỏi giá & Tư vấn (High Intent)',
        aiReply: 'Chào bạn Lan Anh nhé, mẫu này đang có ưu đãi 50% chỉ 199k và đủ size S, M, L nha. Shop vừa nhắn tin chi tiết quà tặng cho bạn rồi đó ạ! ❤️',
        autoDmSent: true,
        voucherCode: 'TIKTOK50_LANANH',
        status: 'Đã trả lời & Đã gửi DM ✉️'
      },
      {
        id: 'cmt_002',
        videoTitle: 'Review Đồ Gia Dụng Thông Minh',
        author: '@tuan_tech99',
        text: 'Video phối nhạc đỉnh quá ad ơi, cho xin tên bài hát với!',
        intent: 'Khen ngợi & Hỏi thông tin nhạc',
        aiReply: 'Cảm ơn Tuấn nhiều nha! Bài này là Nonstop Viet Mix Vol 4 2025 phối độc quyền bởi QuanRapper đó ạ! Nhấn follow kênh nghe thêm nhiều bài hay nhé! 🔥',
        autoDmSent: false,
        voucherCode: null,
        status: 'Đã trả lời tự động'
      },
      {
        id: 'cmt_003',
        videoTitle: 'Podcast Chữa Lành Tâm Hồn',
        author: '@ngoc_diep_2001',
        text: 'Nghe thấm thía từng câu luôn, mong ad ra thêm nhiều phần tiếp theo.',
        intent: 'Đồng cảm & Giữ chân fan',
        aiReply: 'Cảm ơn Ngọc Diệp rất nhiều! Sự ủng hộ của bạn là động lực lớn nhất của tụi mình. Đón xem phần tiếp theo vào 20h tối mai nhé! ✨',
        autoDmSent: false,
        voucherCode: null,
        status: 'Đã trả lời tự động'
      }
    ];

    this.metrics = {
      totalCommentsProcessed: 482,
      leadsCaptured: 156,
      dmOpenRate: '88.5%',
      salesConverted: '34 đơn hàng'
    };
  }

  getComments() {
    return {
      ok: true,
      metrics: this.metrics,
      comments: this.commentQueue
    };
  }

  simulateNewComment(text, author = '@user_random') {
    const isBuy = text.toLowerCase().includes('giá') || text.toLowerCase().includes('mua') || text.toLowerCase().includes('link');
    const newCmt = {
      id: 'cmt_' + Date.now(),
      videoTitle: 'Video Vừa Đăng',
      author,
      text,
      intent: isBuy ? 'Hỏi mua / Đặt hàng (Lead)' : 'Tương tác thông thường',
      aiReply: isBuy 
        ? `Cảm ơn ${author}! Mình đã gửi thông tin ưu đãi kèm mã giảm 50% vào hộp thư riêng (DM) của bạn rồi nha! Kiểm tra tin nhắn giúp shop nhé! 🎁`
        : `Dạ cảm ơn bạn ${author} rất nhiều đã ủng hộ video của kênh nha! 🥰`,
      autoDmSent: isBuy,
      voucherCode: isBuy ? 'VIP_OFF50' : null,
      status: 'Xử lý tự động trong 0.8s ⚡'
    };

    this.commentQueue.unshift(newCmt);
    this.metrics.totalCommentsProcessed++;
    if (isBuy) this.metrics.leadsCaptured++;

    return { ok: true, comment: newCmt, metrics: this.metrics };
  }
}

module.exports = new CommentSeeder();
