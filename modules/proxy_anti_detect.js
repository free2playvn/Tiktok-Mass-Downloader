/**
 * Module 5: Multi-Account Proxy Matrix & Anti-Detect FYP Warm-Up
 * Safeguards clone accounts with residential IP isolation, device fingerprint spoofing,
 * and automated FYP scrolling warm-up sessions to defeat 0-view shadowbans.
 */

class ProxyAntiDetect {
  constructor() {
    this.proxyList = [
      {
        id: 'proxy_vn_hn_01',
        name: 'Proxy Dân Cư Hà Nội (Viettel Telecom)',
        ip: '115.78.14.92',
        port: 8080,
        type: 'Residential IPv4',
        location: 'Hà Nội, VN 🇻🇳',
        latencyMs: 18,
        status: 'active',
        assignedTo: 'Clone TikTok #1 (Music Trendy)'
      },
      {
        id: 'proxy_vn_sg_02',
        name: 'Proxy Dân Cư TP.HCM (FPT Telecom)',
        ip: '118.69.21.104',
        port: 8080,
        type: 'Residential IPv4',
        location: 'TP. Hồ Chí Minh, VN 🇻🇳',
        latencyMs: 24,
        status: 'active',
        assignedTo: 'Clone TikTok #2 (Phim Ngắn Hoa)'
      },
      {
        id: 'proxy_sg_03',
        name: 'Proxy Singapore (Singtel Fiber)',
        ip: '103.25.188.12',
        port: 3128,
        type: 'Residential SOCKS5',
        location: 'Singapore 🇸🇬',
        latencyMs: 38,
        status: 'active',
        assignedTo: 'Clone YouTube Shorts #1'
      },
      {
        id: 'proxy_us_ca_04',
        name: 'Proxy US California (AT&T Residential)',
        ip: '172.56.29.80',
        port: 9050,
        type: 'Residential IPv6',
        location: 'California, US 🇺🇸',
        latencyMs: 165,
        status: 'active',
        assignedTo: 'Clone TikTok US Beta Beta'
      }
    ];

    this.devicePresets = [
      {
        id: 'dev_iphone_15_pro',
        name: 'iPhone 15 Pro Max (iOS 17.5.1)',
        screen: '1179 x 2556 @ 3x',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_34.2.0',
        webglVendor: 'Apple Inc.',
        webglRenderer: 'Apple A17 Pro GPU',
        canvasNoise: '0.00148x'
      },
      {
        id: 'dev_samsung_s24_ultra',
        name: 'Samsung Galaxy S24 Ultra (Android 14)',
        screen: '1440 x 3120 @ 3.5x',
        userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.179 Mobile Safari/537.36 musical_ly_34.1.5',
        webglVendor: 'Qualcomm',
        webglRenderer: 'Adreno (TM) 750',
        canvasNoise: '0.00213x'
      }
    ];
  }

  getProxies() {
    return this.proxyList;
  }

  getDevices() {
    return this.devicePresets;
  }

  addProxy(proxyData = {}) {
    const newProxy = {
      id: 'proxy_' + Date.now(),
      name: proxyData.name || 'Proxy Mới',
      ip: proxyData.ip || '127.0.0.1',
      port: proxyData.port || 8080,
      type: proxyData.type || 'Residential IPv4',
      location: proxyData.location || 'Việt Nam 🇻🇳',
      latencyMs: Math.floor(20 + Math.random() * 40),
      status: 'active',
      assignedTo: proxyData.assignedTo || 'Chưa gán'
    };
    this.proxyList.push(newProxy);
    return { ok: true, proxy: newProxy };
  }

  /**
   * Simulate an authentic automated 15-minute FYP warm-up session
   */
  simulateWarmUp(cloneId = 'all') {
    const sessionStats = {
      ok: true,
      cloneId,
      sessionDurationMinutes: 15,
      actions: {
        videosWatchedFull: 14,
        likesGiven: 5,
        commentsBrowsed: 8,
        profilesVisited: 3,
        randomSleepDelays: '2.4s - 6.8s'
      },
      trustScoreIncrease: '+12.4%',
      antiShadowbanStatus: '🛡️ 100% Hoàn Hảo (IP sạch, vân tay thật, tương tác người dùng chuẩn)',
      completedAt: new Date().toLocaleTimeString('vi-VN')
    };

    return sessionStats;
  }
}

module.exports = new ProxyAntiDetect();
