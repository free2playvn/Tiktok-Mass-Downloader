/**
 * Vietnamese Humanizer Engine
 * Based on the design principles and skill catalog of longhang2004/vietnamese-humanizer:
 * 1. humanizer-vi: Làm mượt văn phong, xóa sáo rỗng, cải thiện nhịp điệu câu.
 * 2. translationese-cleaner-vi: Làm sạch văn phong dịch thô, câu bị động, danh hóa, chủ ngữ giả.
 * 3. grammar-checker-vi: Chuẩn hóa chính tả, dấu thanh, dấu câu tiếng Việt.
 * 4. style-guide-vi: Đồng nhất đại từ, phong cách (TikTok Trendy, Kể chuyện, Review, Chuyên nghiệp).
 */

class VietnameseHumanizerEngine {
  constructor() {
    // 1. Translationese Catalog (Anh-Việt dịch thô & sáo rỗng)
    this.translationeseRules = [
      // Passive voice abuse ("được thực hiện bởi X" -> "X thực hiện")
      {
        regex: /được\s+(?:thực hiện|tạo ra|chia sẻ|phát triển|cung cấp)\s+bởi\s+([A-Za-z0-9_\sÀ-ỹ]+)/gi,
        replace: (match, actor) => `${actor.trim()} đã phát triển`,
        category: 'Bị động che chủ thể',
        explanation: 'Chuyển cấu trúc bị động sao chép tiếng Anh sang dạng chủ động tự nhiên.'
      },
      {
        regex: /bị\s+tác\s+động\s+bởi\s+([A-Za-z0-9_\sÀ-ỹ]+)/gi,
        replace: (match, actor) => `chịu ảnh hưởng từ ${actor.trim()}`,
        category: 'Bị động Anh-Việt',
        explanation: 'Dùng từ chỉ ảnh hưởng tự nhiên thay vì "bị tác động bởi".'
      },
      // Dummy subjects ("Nó là quan trọng để..." -> "Cần...")
      {
        regex: /nó\s+(?:là|thì)?\s*(?:rất\s+)?(?:quan trọng|cần thiết)\s+(?:để|khi)\s*/gi,
        replace: 'Cần lưu ý ',
        category: 'Chủ ngữ giả (Dummy Subject)',
        explanation: 'Bỏ chủ ngữ giả "nó là... để" vốn bắt chước cấu trúc "It is important to".'
      },
      {
        regex: /thật\s+là\s+(?:dễ dàng|khó khăn)\s+để\s*/gi,
        replace: 'Rất dễ để ',
        category: 'Chủ ngữ giả',
        explanation: 'Việt hóa cấu trúc "Thật là... để".'
      },
      // Nominalization / Chuỗi danh hóa ("việc thực hiện quá trình tối ưu hóa")
      {
        regex: /việc\s+thực\s+hiện\s+(?:công\s+tác\s+|quá\s+trình\s+)?tối\s+ưu\s+hóa/gi,
        replace: 'quá trình tối ưu',
        category: 'Danh từ hóa dày (Nominalization)',
        explanation: 'Rút gọn chuỗi danh từ hành chính hóa.'
      },
      {
        regex: /đưa\s+ra\s+sự\s+(?:hỗ\s+trợ|giúp\s+đỡ)/gi,
        replace: 'hỗ trợ',
        category: 'Động từ yếu (Weak Verb)',
        explanation: 'Dùng động từ trực tiếp thay vì "đưa ra sự hỗ trợ".'
      },
      {
        regex: /tiến\s+hành\s+(?:thực\s+hiện\s+)?kiểm\s+tra/gi,
        replace: 'kiểm tra',
        category: 'Động từ yếu',
        explanation: 'Dùng động từ "kiểm tra" trực tiếp.'
      },
      {
        regex: /đưa\s+ra\s+quyết\s+định/gi,
        replace: 'quyết định',
        category: 'Động từ yếu',
        explanation: 'Dùng "quyết định" gọn gàng hơn "đưa ra quyết định".'
      },
      // Business clichés dịch từng chữ (Literal Metaphors)
      {
        regex: /ở\s+cuối\s+(?:của\s+)?ngày(?:\s*,\s*)?/gi,
        replace: 'Sau cùng, ',
        category: 'Thành ngữ dịch máy (At the end of the day)',
        explanation: 'Dịch "at the end of the day" thành "sau cùng" hoặc "rốt cuộc".'
      },
      {
        regex: /mở\s+khóa\s+tiềm\s+năng/gi,
        replace: 'khai phá tiềm năng',
        category: 'Business Cliché (Unlock potential)',
        explanation: 'Thay "mở khóa tiềm năng" bằng "khai phá tiềm năng" chuẩn xác hơn.'
      },
      {
        regex: /thay\s+đổi\s+cuộc\s+chơi/gi,
        replace: 'tạo nên bước ngoặt lớn',
        category: 'Business Cliché (Game changer)',
        explanation: 'Dùng "tạo bước ngoặt" tự nhiên hơn "thay đổi cuộc chơi".'
      },
      {
        regex: /điều\s+hướng\s+sự\s+phức\s+tạp/gi,
        replace: 'xử lý vấn đề phức tạp',
        category: 'Business Cliché (Navigate complexity)',
        explanation: 'Dùng "xử lý vấn đề" thay vì dịch cứng "điều hướng sự phức tạp".'
      },
      {
        regex: /tác\s+động\s+có\s+ý\s+nghĩa/gi,
        replace: 'tác động rõ rệt',
        category: 'Business Cliché (Meaningful impact)',
        explanation: 'Thay "có ý nghĩa" mang tính dịch máy bằng "rõ rệt / đáng kể".'
      },
      {
        regex: /bức\s+tranh\s+lớn/gi,
        replace: 'cái nhìn tổng thể',
        category: 'Literal Metaphor (Big picture)',
        explanation: 'Thay "bức tranh lớn" bằng "cái nhìn tổng thể / góc nhìn toàn cảnh".'
      }
    ];

    // 2. Humanizer Rules (Văn phong khuôn mẫu & sáo rỗng AI)
    this.humanizerRules = [
      // Announcing Openers
      {
        regex: /trong\s+(?:bài\s+viết|video|nội\s+dung)\s+này\s*,\s*chúng\s+ta\s+sẽ\s+cùng\s+(?:nhau\s+)?(?:tìm\s+hiểu|khám\s+phá|điểm\s+qua)\s*/gi,
        replace: 'Hôm nay chúng ta cùng xem ',
        category: 'Lời mở đầu thông báo khuôn mẫu',
        explanation: 'Lược bỏ lối dẫn dắt cứng nhắc, vào thẳng nội dung hấp dẫn cho video.'
      },
      {
        regex: /như\s+chúng\s+ta\s+đã\s+biết\s*,\s*/gi,
        replace: '',
        category: 'Lời đệm ép đồng thuận',
        explanation: 'Bỏ "như chúng ta đã biết" vì làm loãng nhịp câu và ép giả định.'
      },
      {
        regex: /không\s+thể\s+phủ\s+nhận\s+(?:rằng\s*)?/gi,
        replace: 'Rõ ràng là ',
        category: 'Lời khẳng định sáo rỗng',
        explanation: 'Thay "không thể phủ nhận rằng" bằng cách nói ngắn gọn, gãy gọn.'
      },
      {
        regex: /đóng\s+vai\s+trò\s+(?:vô\s+cùng\s+)?quan\s+trọng\s+trong\s+việc\s*/gi,
        replace: 'giúp ích rất nhiều cho ',
        category: 'Cấu trúc khuôn mẫu',
        explanation: 'Thay cấu trúc "đóng vai trò quan trọng trong việc" bằng cụm từ chỉ tác dụng trực tiếp.'
      },
      {
        regex: /mang\s+tính\s+cách\s+mạng/gi,
        replace: 'đầy đột phá',
        category: 'Giọng phóng đại (Hype)',
        explanation: 'Hạ mức phóng đại về sắc thái khách quan, tự nhiên.'
      },
      {
        regex: /vô\s+cùng\s+tuyệt\s+vời/gi,
        replace: 'rất ấn tượng',
        category: 'Khen ngợi sáo rỗng',
        explanation: 'Dùng từ ngữ có sức gợi hơn cụm từ chung chung "vô cùng tuyệt vời".'
      },
      {
        regex: /tóm\s+lại\s*,\s*có\s+thể\s+thấy\s+rằng\s*/gi,
        replace: 'Nhìn chung, ',
        category: 'Kết bài văn mẫu',
        explanation: 'Rút gọn kết bài thành lời đúc kết tự nhiên.'
      }
    ];

    // 3. Grammar & Diacritics Rules
    this.grammarRules = [
      // Double spaces & spacing before punctuation
      { regex: /\s+([,.:;?!])/g, replace: '$1' },
      { regex: /([,.:;?!])(?=[^\s\d])/g, replace: '$1 ' },
      { regex: /\s{2,}/g, replace: ' ' },
      // Common misspellings & diacritics
      { regex: /\bgiãnh\b/gi, replace: 'rảnh' },
      { regex: /\bxắp\s+xếp\b/gi, replace: 'sắp xếp' },
      { regex: /\bchuẫn\b/gi, replace: 'chuẩn' },
      { regex: /\bchẵng\b/gi, replace: 'chẳng' },
      { regex: /\bnghĩ\s+ngơi\b/gi, replace: 'nghỉ ngơi' }
    ];

    // 4. Style Guide & Register Dictionary
    this.registers = {
      tiktok: {
        name: 'TikTok Trendy / Gen Z',
        pronounPairs: [
          { from: /\bchúng\s+tôi\b/gi, to: 'mình' },
          { from: /\bquý\s+vị\b/gi, to: 'các bạn' },
          { from: /\bngười\s+dùng\b/gi, to: 'mọi người' },
          { from: /\bkhách\s+hàng\b/gi, to: 'các bác' }
        ],
        sentenceTone: 'Ngắn gọn, lôi cuốn, ngắt nhịp nhanh, tối ưu cho phụ đề 9:16.'
      },
      storytelling: {
        name: 'Kể chuyện / Storytelling',
        pronounPairs: [
          { from: /\bchúng\s+tôi\b/gi, to: 'tụi mình' },
          { from: /\bquý\s+vị\b/gi, to: 'bạn' }
        ],
        sentenceTone: 'Giọng thủ thỉ, truyền cảm, nhịp câu thong thả, giàu hình ảnh.'
      },
      review: {
        name: 'Review / Trải nghiệm cá nhân',
        pronounPairs: [
          { from: /\bchúng\s+tôi\b/gi, to: 'mình' },
          { from: /\bquý\s+khách\b/gi, to: 'anh em' }
        ],
        sentenceTone: 'Khách quan, chân thật, nêu trải nghiệm thực tế, tránh tâng bốc.'
      },
      professional: {
        name: 'Chuyên nghiệp / Doanh nghiệp',
        pronounPairs: [
          { from: /\bmình\b/gi, to: 'chúng tôi' },
          { from: /\banh\s+em\b/gi, to: 'quý vị' },
          { from: /\bcác\s+bác\b/gi, to: 'quý khán giả' }
        ],
        sentenceTone: 'Trang trọng, chuẩn mực, từ ngữ hành chính - học thuật chuẩn hóa.'
      }
    };
  }

  /**
   * Run the full Humanizer analysis on an input text
   * @param {string} text Input Vietnamese / Translated text
   * @param {Object} options Configuration options
   * @returns {Object} Result containing clean_rewrite, comments, decision points, and stats
   */
  process(text, options = {}) {
    if (!text || typeof text !== 'string') {
      return {
        original: '',
        cleanRewrite: '',
        comments: [],
        decisions: [],
        stats: { patternsFound: 0, changesCount: 0 }
      };
    }

    const {
      skills = ['humanizer-vi', 'translationese-cleaner-vi', 'grammar-checker-vi', 'style-guide-vi'],
      register = 'tiktok',
      maxWordsPerSubtitle = 7
    } = options;

    let processed = text;
    const comments = [];
    const decisions = [];
    let patternsFound = 0;

    // Step 1: Translationese Cleaner
    if (skills.includes('translationese-cleaner-vi')) {
      for (const rule of this.translationeseRules) {
        if (rule.regex.test(processed)) {
          patternsFound++;
          const matchInstances = processed.match(rule.regex) || [];
          comments.push({
            skill: 'translationese-cleaner-vi',
            category: rule.category,
            matched: matchInstances[0],
            explanation: rule.explanation
          });
          processed = processed.replace(rule.regex, rule.replace);
        }
      }
    }

    // Step 2: Humanizer Pro (Clichés & Rhythm)
    if (skills.includes('humanizer-vi')) {
      for (const rule of this.humanizerRules) {
        if (rule.regex.test(processed)) {
          patternsFound++;
          const matchInstances = processed.match(rule.regex) || [];
          comments.push({
            skill: 'humanizer-vi',
            category: rule.category,
            matched: matchInstances[0],
            explanation: rule.explanation
          });
          processed = processed.replace(rule.regex, rule.replace);
        }
      }
    }

    // Step 3: Style Guide & Pronoun Harmonizer
    if (skills.includes('style-guide-vi') && this.registers[register]) {
      const reg = this.registers[register];
      for (const pair of reg.pronounPairs) {
        if (pair.from.test(processed)) {
          processed = processed.replace(pair.from, pair.to);
        }
      }
    }

    // Step 4: Grammar & Punctuation Cleanup
    if (skills.includes('grammar-checker-vi')) {
      for (const rule of this.grammarRules) {
        processed = processed.replace(rule.regex, rule.replace);
      }
    }

    // Clean up capital letters after periods
    processed = processed.replace(/(?:^|[.!?]\s+)([a-zà-ỹ])/g, (m, c) => m.toUpperCase()).trim();

    // Ambiguity / Decisions check (Needs Author Decision)
    if (processed.includes('bước ngoặt') || processed.includes('khai phá')) {
      decisions.push({
        phrase: 'bước ngoặt lớn / khai phá',
        options: ['Giữ nguyên sắc thái đột phá', 'Dùng từ trung tính hơn ("thay đổi đáng kể")'],
        suggestion: 'Khuyên dùng sắc thái đột phá cho video ngắn TikTok để tạo sự chú ý.'
      });
    }

    // Generate Subtitle Cues automatically (segmented for video duration)
    const subtitleCues = this.generateSubtitleCues(processed, maxWordsPerSubtitle);

    return {
      original: text,
      cleanRewrite: processed,
      comments,
      decisions,
      subtitleCues,
      stats: {
        patternsFound,
        changesCount: comments.length,
        originalLength: text.length,
        cleanLength: processed.length,
        register: this.registers[register]?.name || register
      }
    };
  }

  /**
   * Split processed text into timed subtitle cues (cards) ideal for 9:16 video reading speed
   * @param {string} text Cleaned text
   * @param {number} maxWordsPerCue Target words per subtitle line (default 5-8)
   */
  generateSubtitleCues(text, maxWordsPerCue = 7) {
    if (!text) return [];

    // Split by sentence terminators or comma clauses
    const rawClauses = text.split(/(?<=[.!?,\n])\s+/);
    const phrases = [];

    for (const clause of rawClauses) {
      const words = clause.trim().split(/\s+/);
      if (words.length <= maxWordsPerCue) {
        if (clause.trim()) phrases.push(clause.trim());
      } else {
        // Chunk into smaller segments
        for (let i = 0; i < words.length; i += maxWordsPerCue) {
          const chunk = words.slice(i, i + maxWordsPerCue).join(' ');
          if (chunk) phrases.push(chunk);
        }
      }
    }

    // Calculate timestamps (approx 0.35s per word + 0.4s base pause)
    let currentTime = 0.5;
    const cues = [];

    phrases.forEach((phrase, index) => {
      const wordCount = phrase.split(/\s+/).length;
      const duration = Math.max(1.4, Math.min(4.5, wordCount * 0.38 + 0.5));
      const startTime = currentTime;
      const endTime = currentTime + duration;
      currentTime = endTime + 0.15; // small gap between subtitles

      cues.push({
        id: `cue-${index + 1}`,
        startTime: parseFloat(startTime.toFixed(2)),
        endTime: parseFloat(endTime.toFixed(2)),
        text: phrase
      });
    });

    return cues;
  }
}

// Export for Node.js or Browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VietnameseHumanizerEngine;
} else if (typeof window !== 'undefined') {
  window.VietnameseHumanizerEngine = VietnameseHumanizerEngine;
}
