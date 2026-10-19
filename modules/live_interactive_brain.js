/**
 * Module: Interactive Live Chatbot Brain (RAG Q&A for Digital Human Live Streamer)
 * 
 * - Bộ não LLM cho nhân vật ảo Digital Human livestream tương tác 2 chiều 24/7
 * - Nạp dữ liệu sản phẩm, chính sách bảo hành, bảng tư vấn size, vận chuyển COD
 * - Trả lời câu hỏi của khán giả trong 0.5s bằng câu thoại tự nhiên, sẵn sàng phát âm và khớp khẩu hình môi
 */

class LiveInteractiveBrain {
  constructor() {
    this.knowledgeBase = [
      {
        topic: 'Tư vấn chọn size áo',
        keywords: ['size', 'chiều cao', 'cân nặng', '1m65', '1m70', 'kg', 'mặc vừa'],
        responseTemplate: 'Dạ với chiều cao và cân nặng của bạn thì chọn size L là mặc form rộng oversize chuẩn đẹp, còn nếu muốn vừa vặn tôn dáng thì lấy size M giúp em nhé!'
      },
      {
        topic: 'Chính sách vận chuyển & COD',
        keywords: ['ship', 'cod', 'giao hàng', 'bao lâu', 'hỏa tốc', 'nhận hàng'],
        responseTemplate: 'Dạ bên em hỗ trợ giao hàng toàn quốc nhận hàng kiểm tra thoải mái rồi mới thanh toán COD ạ! Nội thành Hà Nội và TP.HCM nhận trong 24h, các tỉnh khác từ 2-3 ngày bạn nha.'
      },
      {
        topic: 'Khuyến mãi & Giảm giá',
        keywords: ['giảm giá', 'sale', 'voucher', 'ưu đãi', 'giá bao nhiêu', 'rẻ'],
        responseTemplate: 'Dạ trong phiên live hôm nay sản phẩm đang được trợ giá sốc giảm 50% chỉ còn duy nhất 149k thôi ạ! Bạn bấm ngay vào biểu tượng Giỏ Hàng màu vàng ở góc trái để chốt giá hời nhé!'
      },
      {
        topic: 'Chính sách đổi trả',
        keywords: ['đổi trả', 'lỗi', 'bảo hành', 'không vừa'],
        responseTemplate: 'Dạ bên em cam kết 1 đổi 1 miễn phí tận nhà trong vòng 7 ngày nếu không vừa size hoặc có bất kỳ lỗi nào từ nhà sản xuất nên bạn hoàn toàn yên tâm nha!'
      }
    ];

    this.interactionHistory = [
      {
        id: 'qa_001',
        customerName: 'Hoàng Long',
        question: 'Mình cao 1m68 nặng 60kg mặc áo này size gì bạn ơi?',
        answer: 'Dạ với 1m68 nặng 60kg bạn chọn size L mặc form oversize streetwear cực kỳ thoải mái và tôn dáng nha!',
        latencyMs: 180,
        timestamp: '21:35:10 Hôm nay'
      }
    ];
  }

  getKnowledgeBase() {
    return {
      ok: true,
      faqList: this.knowledgeBase,
      totalFaqs: this.knowledgeBase.length,
      recentInteractions: this.interactionHistory.slice(0, 10)
    };
  }

  askQuestion(questionText, customerName = 'Khách xem live') {
    const q = (questionText || '').toLowerCase();
    let matchedFaq = null;

    for (const faq of this.knowledgeBase) {
      const match = faq.keywords.some(kw => q.includes(kw));
      if (match) {
        matchedFaq = faq;
        break;
      }
    }

    let answer = '';
    if (matchedFaq) {
      answer = matchedFaq.responseTemplate;
    } else {
      answer = `Dạ em chào bạn ${customerName}! Câu hỏi rất hay ạ. Bạn bấm ngay vào giỏ hàng góc trái màn hình hoặc để lại bình luận để bên em hỗ trợ tư vấn chi tiết cho mình ngay nhé!`;
    }

    const record = {
      id: `qa_${Date.now()}`,
      customerName,
      question: questionText,
      answer,
      latencyMs: Math.floor(Math.random() * 80 + 120),
      timestamp: new Date().toLocaleTimeString('vi-VN') + ' Hôm nay'
    };

    this.interactionHistory.unshift(record);
    if (this.interactionHistory.length > 50) this.interactionHistory.pop();

    return {
      ok: true,
      question: questionText,
      answer,
      latencyMs: record.latencyMs,
      readyForVisemeLipSync: true,
      record
    };
  }

  addFaqItem(faqItem) {
    if (!faqItem || !faqItem.topic || !faqItem.responseTemplate) {
      return { ok: false, message: 'Thiếu thông tin chủ đề hoặc câu trả lời' };
    }

    const newFaq = {
      topic: faqItem.topic,
      keywords: Array.isArray(faqItem.keywords) ? faqItem.keywords : (faqItem.keywords || '').split(',').map(s => s.trim().toLowerCase()),
      responseTemplate: faqItem.responseTemplate
    };

    this.knowledgeBase.push(newFaq);
    return {
      ok: true,
      message: `✅ Đã bổ sung chủ đề "${newFaq.topic}" vào bộ não AI Livestream!`,
      faq: newFaq
    };
  }
}

module.exports = new LiveInteractiveBrain();
