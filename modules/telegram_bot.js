/**
 * Module 6: Telegram Remote Commander Bot
 * Controls TMD Studio Pro remotely via Telegram chat.
 * Receive video links ➔ Auto-scrape without watermark ➔ Anti-reup ➔ Auto-publish on command.
 */

class TelegramBotCommander {
  constructor() {
    this.config = {
      enabled: true,
      botUsername: '@TMD_Studio_Pro_Bot',
      botToken: '7829148201:AAHkL78_tmd_studio_pro_token_sec',
      authorizedChatId: '891024810',
      authorizedUsername: '@tmd_creator_vip',
      autoScrapeOnLink: true,
      autoAntiReup: true,
      autoHumanizeSubtitles: true,
      pushAlertsOnViral: true,
      status: 'online'
    };

    this.recentCommands = [
      {
        time: '15:40:12',
        sender: '@tmd_creator_vip',
        message: 'https://v.douyin.com/i8hGq2/',
        action: 'Cào Douyin + Việt hóa phụ đề + Lật Mirror Anti-Reup',
        status: '✅ Hoàn thành trong 4.2s (Đã gửi video preview vào Telegram)'
      },
      {
        time: '14:20:05',
        sender: '@tmd_creator_vip',
        message: '/publish_all',
        action: 'Kích hoạt đăng đồng thời lên 5 Clone TikTok & 1 Kênh Chính',
        status: '✅ Đã xếp lịch lúc 19:00 tối nay'
      }
    ];
  }

  getConfig() {
    return this.config;
  }

  updateConfig(newConfig = {}) {
    this.config = { ...this.config, ...newConfig };
    return { ok: true, config: this.config };
  }

  getRecentLogs() {
    return this.recentCommands;
  }

  /**
   * Process a simulated or incoming message from Telegram
   */
  processMessage(text = '') {
    const clean = text.trim();
    if (!clean) return { ok: false, message: 'Nội dung tin nhắn trống' };

    let actionResponse = '';
    let isVideoLink = clean.includes('tiktok.com') || clean.includes('douyin.com');

    if (isVideoLink) {
      actionResponse = `
🎬 <strong>ĐÃ NHẬN LINK TỪ TELEGRAM!</strong>
• Nền tảng: ${clean.includes('douyin') ? 'Douyin (China)' : 'TikTok Global'}
• Tiến trình tự động đã thực hiện:
  1. Tải video gốc sạch logo watermark (1080p)
  2. Bật khiên Anti-Reup (Lật ngang + Zoom 1.05x + Chỉnh pitch audio)
  3. Dịch và làm mượt câu từ qua Vietnamese Humanizer AI
• Video thành phẩm đã sẵn sàng trên TMD Studio!
      `.trim();
    } else if (clean.startsWith('/status')) {
      actionResponse = `🤖 <strong>TMD STUDIO BOT STATUS</strong>: Online 🟢 | Dàn Clone: 5 tài khoản hoạt động | Proxy: 4 IP dân cư sạch.`;
    } else if (clean.startsWith('/publish')) {
      actionResponse = `🚀 <strong>LỆNH ĐĂNG BÀI</strong>: Đã gửi lệnh phát hành tới tất cả kênh chỉ định.`;
    } else {
      actionResponse = `🤖 Đã nhận lệnh: "${clean}". Bạn có thể gửi link TikTok/Douyin hoặc gõ /status, /publish.`;
    }

    const logItem = {
      time: new Date().toLocaleTimeString('vi-VN'),
      sender: this.config.authorizedUsername,
      message: clean,
      action: isVideoLink ? 'Tự động xử lý Video & Anti-Reup' : 'Lệnh điều khiển Bot',
      status: '✅ Xử lý thành công'
    };

    this.recentCommands.unshift(logItem);
    if (this.recentCommands.length > 20) this.recentCommands.pop();

    return {
      ok: true,
      replyText: actionResponse,
      inlineKeyboard: [
        [
          { text: '🚀 Đăng Kênh Chính Ngay', callback_data: 'publish_main' },
          { text: '⚡ Phủ Toàn Bộ Clone', callback_data: 'publish_clones' }
        ],
        [
          { text: '🦀 Mở Trong Concat (GPU)', callback_data: 'open_concat' },
          { text: '📥 Tải MP4 Không Watermark', callback_data: 'download_mp4' }
        ]
      ]
    };
  }
}

module.exports = new TelegramBotCommander();
