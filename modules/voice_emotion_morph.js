/**
 * Module: Voice Emotion Auto-Morphing Engine
 * 
 * Dynamically shifts TTS vocal tones and emotional inflections between
 * Excited, Whisper Secret, Authoritative Expert, Warm Grateful, and Urgent FOMO.
 */

class VoiceEmotionMorphEngine {
  constructor() {
    this.emotions = {
      excited: {
        id: 'excited',
        name: '🎉 Hào Hứng & Bùng Nổ',
        pitch: '+15%',
        rate: '+10%',
        volume: '+12%',
        styleWeight: 1.8,
        description: 'Dành cho lúc người xem bấm follow, tặng quà PK, hoặc số lượng người xem tăng vọt.',
        sampleText: 'Trời ơi cả nhà ơi cảm ơn mọi người đã đẩy mắt xem lên 3000 người nha! Vui quá đi mất!'
      },
      whisper_secret: {
        id: 'whisper_secret',
        name: '🤫 Thì Thầm Bí Mật (Xả Lỗ)',
        pitch: '-8%',
        rate: '-12%',
        volume: '-15%',
        styleWeight: 1.5,
        description: 'Dành cho lúc tung deal bí mật, tạo cảm giác sếp không cho nhưng em vẫn lén xả.',
        sampleText: 'Em nói nhỏ cả nhà nghe thôi nè... mã này sếp em chưa duyệt đâu, ai xem live mới thấy giá này thôi đó nha!'
      },
      expert_authoritative: {
        id: 'expert_authoritative',
        name: '👨‍💼 Chuyên Gia Uy Tín',
        pitch: '-4%',
        rate: '0%',
        volume: '+5%',
        styleWeight: 1.2,
        description: 'Dành cho lúc phân tích cấu tạo 3D, thông số kỹ thuật, bảo hành chính hãng.',
        sampleText: 'Đế giày công nghệ đàn hồi EVA phân tử bọt khí giúp hấp thụ tới 92% xung lực khi chạy bộ đường dài.'
      },
      urgent_fomo: {
        id: 'urgent_fomo',
        name: '⏱️ Hối Hả & Thúc Giục (FOMO)',
        pitch: '+8%',
        rate: '+22%',
        volume: '+10%',
        styleWeight: 2.0,
        description: 'Dành cho lúc đếm ngược 60 giây chốt đơn, kho còn đúng 2 cái cuối.',
        sampleText: 'Còn đúng 15 giây nữa thôi! Nhanh tay chạm giỏ hàng góc trái kẻo hệ thống tự trả về giá gốc nha!'
      },
      warm_grateful: {
        id: 'warm_grateful',
        name: '💖 Tri Ân Ấm Áp',
        pitch: '0%',
        rate: '-5%',
        volume: '0%',
        styleWeight: 1.0,
        description: 'Dành cho lúc tâm sự đầu phiên, chào đón người xem và cảm ơn khi hết live.',
        sampleText: 'Cảm ơn tất cả mọi người đã dành thời gian quý báu đồng hành cùng shop trong phiên live tối nay.'
      }
    };

    this.activeEmotion = 'excited';
  }

  getEmotionsState() {
    return {
      ok: true,
      activeEmotion: this.activeEmotion,
      emotions: this.emotions
    };
  }

  setEmotion(emotionId) {
    if (!this.emotions[emotionId]) {
      return { ok: false, error: 'Không tìm thấy cảm xúc yêu cầu' };
    }
    this.activeEmotion = emotionId;
    return {
      ok: true,
      message: `Đã đổi cảm xúc giọng MC sang: ${this.emotions[emotionId].name}`,
      activeEmotion: this.activeEmotion,
      preset: this.emotions[emotionId]
    };
  }

  synthesizeEmotionalSpeech(text, emotionId = null) {
    const emotion = this.emotions[emotionId] || this.emotions[this.activeEmotion];
    return {
      ok: true,
      text,
      emotion: emotion.id,
      emotionName: emotion.name,
      ssml: `<speak><prosody pitch="${emotion.pitch}" rate="${emotion.rate}" volume="${emotion.volume}">${text}</prosody></speak>`,
      audioDurationSec: Math.max(2.0, (text.split(' ').length / 3).toFixed(1)),
      audioWaveformUrl: '/audio/stream_tts_realtime.wav'
    };
  }
}

module.exports = new VoiceEmotionMorphEngine();
