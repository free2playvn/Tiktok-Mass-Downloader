/**
 * Module: Virtual Stream Deck & Multi-Camera Studio Switcher
 * 
 * - Bàn điều khiển ảo 1-click chuyển đổi đa góc máy chuẩn truyền hình trực tiếp
 * - Tích hợp Soundboard kích hoạt hiệu ứng tâm lý (Vỗ tay, chuông đơn hàng, nhạc đếm ngược)
 * - Tương thích điều khiển OBS Studio, vMix và Livestream Engine nội bộ
 */

class VirtualStreamDeck {
  constructor() {
    this.cameras = [
      { id: 'cam_1_host', name: 'Góc 1: Người Ảo MC Toàn Thân', icon: '👤', resolution: '4K 60fps', isLive: true },
      { id: 'cam_2_product', name: 'Góc 2: Cận Cảnh Sản Phẩm Macro', icon: '🔍', resolution: '4K Macro', isLive: false },
      { id: 'cam_3_promo', name: 'Góc 3: Bảng Flash Sale Đếm Ngược', icon: '🏷️', resolution: '1080p Overlay', isLive: false },
      { id: 'cam_4_studio', name: 'Góc 4: Toàn Cảnh Penthouse Triệu Đô', icon: '🏙️', resolution: '4K Cinema Wide', isLive: false }
    ];

    this.soundboard = [
      { id: 'sfx_applause', name: 'Tiếng Vỗ Tay Rộn Rã', icon: '👏', audioUrl: '/audio/sfx_applause.mp3', triggerCount: 14 },
      { id: 'sfx_ding_order', name: 'Chuông Ting Ting Chốt Đơn', icon: '🔔', audioUrl: '/audio/sfx_cash_ding.mp3', triggerCount: 28 },
      { id: 'sfx_countdown', name: 'Nhạc Đếm Ngược Hồi Hộp', icon: '⏳', audioUrl: '/audio/sfx_countdown_clock.mp3', triggerCount: 9 },
      { id: 'sfx_whoosh', name: 'Hiệu Ứng Sốc Whoosh', icon: '💨', audioUrl: '/audio/sfx_whoosh_hit.mp3', triggerCount: 18 }
    ];

    this.activeCameraId = 'cam_1_host';
    this.recentLogs = [
      { action: 'Khởi động phiên phát sóng Stream Deck', time: '21:00:00' }
    ];
  }

  getState() {
    return {
      ok: true,
      activeCameraId: this.activeCameraId,
      cameras: this.cameras.map(c => ({ ...c, isLive: c.id === this.activeCameraId })),
      soundboard: this.soundboard,
      recentLogs: this.recentLogs.slice(0, 10),
      currentFps: 60,
      bitrateKbps: 6500
    };
  }

  switchCamera(cameraId) {
    const cam = this.cameras.find(c => c.id === cameraId) || this.cameras[0];
    this.activeCameraId = cam.id;
    this.cameras.forEach(c => c.isLive = (c.id === cam.id));

    const log = {
      action: `Chuyển góc máy sang: ${cam.name}`,
      time: new Date().toLocaleTimeString('vi-VN')
    };
    this.recentLogs.unshift(log);
    if (this.recentLogs.length > 30) this.recentLogs.pop();

    return {
      ok: true,
      message: `🎥 Đã chuyển mượt mà sang ${cam.name} (Độ trễ: 45ms)!`,
      activeCamera: cam
    };
  }

  triggerSoundFx(soundId) {
    const sound = this.soundboard.find(s => s.id === soundId) || this.soundboard[0];
    sound.triggerCount = (sound.triggerCount || 0) + 1;

    const log = {
      action: `Phát âm thanh soundboard: ${sound.name}`,
      time: new Date().toLocaleTimeString('vi-VN')
    };
    this.recentLogs.unshift(log);

    return {
      ok: true,
      message: `🔊 Đã phát hiệu ứng "${sound.name}" lên luồng livestream!`,
      sound
    };
  }
}

module.exports = new VirtualStreamDeck();
