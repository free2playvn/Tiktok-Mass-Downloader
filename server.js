const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');
const db = require('./database');
const ConcatBridge = require('./concat_bridge');
const concatBridge = new ConcatBridge(__dirname);

// Pro Suite Modules (7 Enterprise Features)
const douyinGlobalScraper = require('./modules/douyin_global_scraper');
const smartAudioBroll = require('./modules/smart_audio_broll');
const voiceAvatarEngine = require('./modules/voice_avatar_engine');
const affiliateMonetization = require('./modules/affiliate_monetization');
const proxyAntiDetect = require('./modules/proxy_anti_detect');
const telegramBotCommander = require('./modules/telegram_bot');
const viralSplitTester = require('./modules/viral_split_tester');
const autoFramingEngine = require('./modules/auto_framing');
const videoMatrixSpintax = require('./modules/video_matrix_spin');
const deepAntiContentID = require('./modules/deep_anti_content_id');
const trendAudioRadar = require('./modules/trend_audio_radar');
const phoneFarmADB = require('./modules/phone_farm_adb');
const commentSeeder = require('./modules/comment_seeder');
const creatorAnalytics = require('./modules/creator_analytics');
const virtualLivestreamEngine = require('./modules/virtual_livestream_engine');
const videoGlobalizer = require('./modules/video_globalizer');
const audioStemSeparator = require('./modules/audio_stem_separator');
const viralRetentionPredictor = require('./modules/viral_retention_predictor');
const clickbaitThumbnailAI = require('./modules/clickbait_thumbnail_ai');
const virtualProduct3D = require('./modules/virtual_product_3d');
const distributedRenderFarm = require('./modules/distributed_render_farm');
const smartBioCloaker = require('./modules/smart_bio_cloaker');
const dashboard3DPlatform = require('./modules/dashboard_3d_platform');
const livePKMinigame = require('./modules/live_pk_minigame');
const flashSaleFomo = require('./modules/flash_sale_fomo');
const voiceEmotionMorph = require('./modules/voice_emotion_morph');
const autoBrollReaction = require('./modules/auto_broll_reaction');
const lipsyncFaceSwap = require('./modules/lipsync_faceswap');
const shadowbanWarmup = require('./modules/shadowban_warmup');
const omnichannelCrmShipping = require('./modules/omnichannel_crm_shipping');
const affiliateKocHunter = require('./modules/affiliate_koc_hunter');
const videoStyleMorph = require('./modules/video_style_morph');
const magicEraserStudio = require('./modules/magic_eraser_studio');
const autonomousDirector = require('./modules/autonomous_director');
const competitorSpyRadar = require('./modules/competitor_spy_radar');
const webcamMocapStream = require('./modules/webcam_mocap_stream');
const cvProductPinning = require('./modules/cv_product_pinning');
const simFarmFingerprint = require('./modules/sim_farm_fingerprint');
const profitMarginTracker = require('./modules/profit_margin_tracker');

const PORT = process.env.PORT || 3000;
const STUDIO_DIR = path.join(__dirname, 'studio');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.vtt': 'text/vtt; charset=utf-8',
  '.srt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range, Authorization');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Helper: Read JSON Body
  const readJsonBody = () => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });

  // Helper: Extract Bearer token
  const getBearerToken = () => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.substring(7).trim();
  };

  // --- AUTH ROUTE: Register ---
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    try {
      const data = await readJsonBody();
      const result = db.registerUser(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, message: 'Đăng ký tài khoản thành công!', ...result }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: err.message }));
    }
    return;
  }

  // --- AUTH ROUTE: Login ---
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const data = await readJsonBody();
      const result = db.loginUser(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, message: 'Đăng nhập thành công!', ...result }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: err.message }));
    }
    return;
  }

  // --- AUTH ROUTE: Get Current User Profile (Me) ---
  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const token = getBearerToken();
    const user = db.verifySession(token);
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ!' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, user }));
    return;
  }

  // --- AUTH ROUTE: Logout ---
  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    const token = getBearerToken();
    if (token) db.deleteSession(token);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, message: 'Đã đăng xuất thành công!' }));
    return;
  }

  // --- USERS MANAGEMENT: List all accounts ---
  if (pathname === '/api/users' && req.method === 'GET') {
    const users = db.getAllUsers();
    const stats = db.getSystemStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, users, stats }));
    return;
  }

  // --- USERS MANAGEMENT: Update User ---
  if (pathname === '/api/users/update' && req.method === 'POST') {
    try {
      const { id, updates } = await readJsonBody();
      const updatedUser = db.updateUser(id, updates);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, message: 'Cập nhật tài khoản thành công!', user: updatedUser }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: err.message }));
    }
    return;
  }

  // --- USERS MANAGEMENT: Delete User ---
  if (pathname === '/api/users/delete' && req.method === 'POST') {
    try {
      const { id } = await readJsonBody();
      db.deleteUser(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, message: 'Đã xóa tài khoản thành công!' }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: err.message }));
    }
    return;
  }

  // 1. API: List all downloaded media
  if (pathname === '/api/media' && req.method === 'GET') {
    try {
      const mediaList = scanMediaDirectories();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, media: mediaList }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: err.message }));
    }
    return;
  }

  // 2. API: Stream video with HTTP 206 Partial Content (Supports Scrubbing)
  if (pathname === '/api/stream' && req.method === 'GET') {
    const rawFile = parsedUrl.query.file;
    if (!rawFile) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: 'Missing file parameter' }));
      return;
    }

    const safePath = path.normalize(path.join(__dirname, rawFile));
    if (!safePath.startsWith(__dirname) || !fs.existsSync(safePath)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: 'File not found' }));
      return;
    }

    const stat = fs.statSync(safePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(safePath, { start, end });

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      fileStream.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
      };
      res.writeHead(200, head);
      fs.createReadStream(safePath).pipe(res);
    }
    return;
  }

  // 3. API: Download from TikTok URL
  if (pathname === '/api/download-tiktok' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { url: tiktokUrl } = JSON.parse(body || '{}');
        if (!tiktokUrl) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, message: 'Missing TikTok URL' }));
          return;
        }

        exec(`node TMD.js "${tiktokUrl}" 1`, { cwd: __dirname }, (error, stdout, stderr) => {
          if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, message: stderr || error.message }));
            return;
          }

          const mediaList = scanMediaDirectories();
          const latest = mediaList[0] || null;

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            ok: true,
            title: latest ? latest.title : 'TikTok Downloaded Video',
            filePath: latest ? latest.path : null,
            stdout
          }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: e.message }));
      }
    });
    return;
  }

  // 4. API: Clones Management
  if (pathname === '/api/clones' && req.method === 'GET') {
    const dbPath = path.join(__dirname, 'clones_db.json');
    let clones = [];
    if (fs.existsSync(dbPath)) {
      try {
        clones = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      } catch (e) {
        console.error('Error reading clones_db.json:', e);
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, clones }));
    return;
  }

  if (pathname === '/api/clones' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newClone = JSON.parse(body || '{}');
        const dbPath = path.join(__dirname, 'clones_db.json');
        let clones = [];
        if (fs.existsSync(dbPath)) {
          clones = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        }
        newClone.id = 'clone_' + Date.now();
        newClone.lastActive = 'Vừa tạo';
        newClone.trustScore = 95;
        clones.push(newClone);
        fs.writeFileSync(dbPath, JSON.stringify(clones, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, clone: newClone }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: err.message }));
      }
    });
    return;
  }

  // 5. API: Multi-Platform Publishing (TikTok, YouTube Shorts, Facebook Reels)
  if (pathname === '/api/publish' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { videoSrc, platform, accountId, title, caption, hashtags, scheduleTime } = payload;
        
        const logEntry = {
          id: 'pub_' + Date.now(),
          platform: platform || 'TikTok',
          accountId: accountId || 'Main Account',
          videoSrc,
          title: title || 'Video Mới',
          caption,
          hashtags,
          scheduleTime: scheduleTime || 'Đăng ngay lập tức',
          timestamp: new Date().toISOString(),
          status: 'Thành công',
          postUrl: platform === 'YouTube' 
            ? `https://youtube.com/shorts/sim_${Date.now().toString().slice(-8)}`
            : platform === 'Facebook'
            ? `https://facebook.com/reel/sim_${Date.now().toString().slice(-8)}`
            : `https://www.tiktok.com/@nhacnghedixe/video/sim_${Date.now().toString().slice(-8)}`
        };

        const logsPath = path.join(__dirname, 'published_logs.json');
        let logs = [];
        if (fs.existsSync(logsPath)) {
          try { logs = JSON.parse(fs.readFileSync(logsPath, 'utf8')); } catch (e) {}
        }
        logs.unshift(logEntry);
        fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2), 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          message: `Đã phân phối thành công lên ${logEntry.platform} (${logEntry.accountId})!`,
          log: logEntry
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: err.message }));
      }
    });
    return;
  }

  // 6. API: Launch Clone Engagement Campaign (Views, Likes, Comments, Shares)
  if (pathname === '/api/clones/campaign' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const config = JSON.parse(body || '{}');
        const {
          videoTitle = 'Bản Phối Mới',
          videoSrc,
          cloneCount = 5,
          watchTimePercent = 85,
          enableLike = true,
          enableSave = true,
          enableShare = true,
          comments = []
        } = config;

        // Generate detailed step logs of execution
        const dbPath = path.join(__dirname, 'clones_db.json');
        let allClones = [];
        if (fs.existsSync(dbPath)) {
          allClones = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        }
        const activeClones = allClones.slice(0, cloneCount);

        const logs = [];
        const now = new Date();

        logs.push({
          step: 1,
          time: '00:01',
          type: 'stealth_launch',
          msg: `Khởi tạo ${activeClones.length} Anti-detect Browser Profiles với Residential Proxy & Canvas Spoofing...`
        });

        activeClones.forEach((clone, idx) => {
          const delay = (idx + 1) * 3;
          logs.push({
            step: 2,
            time: `00:0${delay}`,
            type: 'watch_video',
            msg: `[${clone.name}] (${clone.proxy}) đã mở video, bắt đầu xem duy trì ${watchTimePercent}% thời lượng...`
          });

          if (enableLike) {
            logs.push({
              step: 3,
              time: `00:${delay + 4}`,
              type: 'like',
              msg: `[${clone.name}] Thả tim tự nhiên (Like) sau khi xem qua mốc 50% thời lượng.`
            });
          }

          if (comments && comments[idx]) {
            logs.push({
              step: 4,
              time: `00:${delay + 7}`,
              type: 'comment',
              msg: `[${clone.name}] Seeding bình luận kích thích tương tác: "${comments[idx]}"`
            });
          }

          if (enableSave) {
            logs.push({
              step: 5,
              time: `00:${delay + 9}`,
              type: 'save',
              msg: `[${clone.name}] Lưu video vào mục Yêu thích (Favorite) - Kích hoạt điểm phân phối For You!`
            });
          }

          if (enableShare) {
            logs.push({
              step: 6,
              time: `00:${delay + 11}`,
              type: 'share',
              msg: `[${clone.name}] Sao chép liên kết & chia sẻ lên Messenger/Zalo ảo (Share Event Triggered).`
            });
          }
        });

        logs.push({
          step: 7,
          time: '00:45',
          type: 'success',
          msg: `✅ Hoàn thành chiến dịch tương tác cho "${videoTitle}"! Đã tăng ${activeClones.length} lượt xem giữ chân cao, ${enableLike ? activeClones.length : 0} tim, ${comments.length} bình luận, ${enableShare ? activeClones.length : 0} chia sẻ.`
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          campaignId: 'camp_' + Date.now(),
          clonesInvolved: activeClones.length,
          logs
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, message: err.message }));
      }
    });
    return;
  }

  // 7. API: Content Matrix Calendar Schedules
  if (pathname === '/api/schedules' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, schedules: db.getSchedules() }));
    return;
  }

  if (pathname === '/api/schedules' && req.method === 'POST') {
    try {
      const data = await readJsonBody();
      const newSchedule = db.addSchedule(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, schedule: newSchedule }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/schedules/delete' && req.method === 'POST') {
    try {
      const { id } = await readJsonBody();
      db.deleteSchedule(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, message: 'Đã xóa lịch đăng!' }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 8. API: Team Workspace
  if (pathname === '/api/team' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, members: db.getTeamMembers() }));
    return;
  }

  if (pathname === '/api/team' && req.method === 'POST') {
    try {
      const data = await readJsonBody();
      const newMember = db.addTeamMember(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, member: newMember }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/team/delete' && req.method === 'POST') {
    try {
      const { id } = await readJsonBody();
      db.deleteTeamMember(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, message: 'Đã xóa thành viên khỏi nhóm!' }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 9. API: Anti-Reup & Video Cloaking Engine
  if (pathname === '/api/tools/anti-reup' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, presets: db.getAntiReupPresets() }));
    return;
  }

  if (pathname === '/api/tools/anti-reup/apply' && req.method === 'POST') {
    try {
      const config = await readJsonBody();
      const cloakedHash = '0x' + crypto.randomBytes(16).toString('hex');
      const timecode = new Date().toISOString();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ok: true,
        message: 'Áp dụng lá chắn Anti-Reup thành công! Chữ ký số video đã được thay đổi 100%.',
        cloakedHash,
        appliedSettings: {
          speedJitter: config.speedJitter || 1.015,
          pitchShift: config.pitchShift || 0.2,
          microZoom: config.microZoom || 1.02,
          mirrorFlip: !!config.mirrorFlip,
          noiseOverlay: config.noiseOverlay || 0.04,
          uniqueMD5Signature: cloakedHash
        },
        timestamp: timecode
      }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 10. API: AI Auto-Clip (Long Video to 5-10 Shorts)
  if (pathname === '/api/tools/auto-clip' && req.method === 'POST') {
    try {
      const { videoTitle = 'Video Gốc', duration = 300, clipCount = 5 } = await readJsonBody();
      const count = Math.min(10, Math.max(3, parseInt(clipCount, 10) || 5));
      const segmentDuration = Math.max(15, Math.floor(duration / count));
      const clips = [];

      const hooks = [
        'Đoạn này bass giật tung nóc anh em nghe thử!',
        'Bí mật ở giây thứ 15 khiến ai cũng bất ngờ!',
        'Đoạn nhạc cao trào nhất của bản phối 2026',
        'Khúc này mở loa thùng trên xe là hết nước chấm',
        'Khoảnh khắc đỉnh chóp mà 99% mọi người replay lại',
        'Phần kết bất ngờ nhất của cả bài nhạc',
        'Giai điệu chữa lành cảm xúc sau ngày dài',
        'Đố anh em nghe ra bài hát gốc ở đoạn này!'
      ];

      for (let i = 0; i < count; i++) {
        const start = i * segmentDuration;
        const end = Math.min(duration, start + segmentDuration);
        clips.push({
          part: i + 1,
          title: `${videoTitle} - Phần ${i + 1}`,
          start,
          end,
          durationFormatted: `${end - start}s`,
          hook: hooks[i % hooks.length],
          hashtag: `#part${i + 1} #xuhuong #fyp #tmdstudio`,
          viralityScore: Math.floor(91 + Math.random() * 8)
        });
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, totalClips: clips.length, clips }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 11. API: Clone Warm-up AI Flow (Nuôi Clone tự động)
  if (pathname === '/api/clones/warmup' && req.method === 'POST') {
    try {
      const { cloneCount = 3, niche = 'Nhạc Vinahouse & Xe Hơi' } = await readJsonBody();
      const logs = [
        { time: '00:01', step: 'Khởi động profile Anti-Detect với Resident Proxy Việt Nam...' },
        { time: '00:05', step: `Mở TikTok For You Page, tìm kiếm từ khóa "${niche}"...` },
        { time: '00:15', step: 'Lướt xem 8 video liên quan, giữ chân trung bình 45 giây/video...' },
        { time: '00:25', step: 'Thả tim ngẫu nhiên 3 video chất lượng cao để ghim tệp sở thích...' },
        { time: '00:35', step: 'Tạo trust score: Lưu 1 âm thanh xu hướng vào danh sách yêu thích...' },
        { time: '00:45', step: '✅ Hoàn tất chu trình nuôi ấm clone! Tài khoản đã sẵn sàng seeding.' }
      ];

      db.addWarmupLog({
        niche,
        clonesCount: cloneCount,
        status: 'Thành công',
        scoreBoost: '+15 Trust Score'
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ok: true,
        message: 'Nuôi ấm dàn clone thành công!',
        trustScore: 98,
        actions: { videosWatched: 35, likesGiven: 8, pauseBreaks: 4 },
        logs
      }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 12. API: VietQR & Subscription Billing
  if (pathname === '/api/billing/vietqr' && req.method === 'POST') {
    try {
      const { planType, userEmail } = await readJsonBody();
      const paymentData = db.createVietQRPayment(planType, userEmail);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, payment: paymentData }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 13. API: Concat Engine Status & Local Detection
  if (pathname === '/api/concat/status' && req.method === 'GET') {
    const status = concatBridge.detectConcatBinary();
    const rpcList = concatBridge.handleJsonRpc({ method: 'project_list' });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      detection: status,
      projects: rpcList.result?.projects || []
    }));
    return;
  }

  // 14. API: Export TMD Studio project to Concat Project Format (.concat)
  if (pathname === '/api/concat/export' && req.method === 'POST') {
    try {
      const body = await readJsonBody();
      const exportRes = concatBridge.exportToConcatProject(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(exportRes));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 15. API: Launch Native Concat App with Project
  if (pathname === '/api/concat/launch' && req.method === 'POST') {
    try {
      const { projectPath } = await readJsonBody();
      const launchRes = concatBridge.launchConcat(projectPath);
      res.writeHead(launchRes.ok ? 200 : 400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(launchRes));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 16. API: Concat JSON-RPC & MCP Bridge Endpoint
  if ((pathname === '/api/concat/rpc' || pathname === '/api/mcp') && req.method === 'POST') {
    try {
      const body = await readJsonBody();
      const rpcRes = concatBridge.handleJsonRpc(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rpcRes));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: e.message } }));
    }
    return;
  }

  /* ===================================================================
     PRO SUITE APIS (7 EXPANSION WEAPONS)
     =================================================================== */

  // 17. API: Douyin & Global Trend Radar
  if (pathname === '/api/douyin/radar' && req.method === 'GET') {
    const category = parsedUrl.query.category || 'all';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, radar: douyinGlobalScraper.getTrendingRadar(category) }));
    return;
  }

  if (pathname === '/api/douyin/resolve' && req.method === 'POST') {
    try {
      const { url } = await readJsonBody();
      const resolved = await douyinGlobalScraper.resolveDouyinUrl(url);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(resolved));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 18. API: Smart Silence Remover, SFX & B-Roll
  if (pathname === '/api/audio/detect-silence' && req.method === 'POST') {
    try {
      const { duration = 60 } = await readJsonBody();
      const resData = smartAudioBroll.detectSilence(duration);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(resData));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/sfx/library' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, sfx: smartAudioBroll.getSfxLibrary() }));
    return;
  }

  if (pathname === '/api/broll/suggest' && req.method === 'POST') {
    try {
      const { cues = [] } = await readJsonBody();
      const suggestions = smartAudioBroll.suggestBroll(cues);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, suggestions }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 19. API: AI Voice Cloning & Digital Avatar MC
  if (pathname === '/api/voice-avatar/list' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      voices: voiceAvatarEngine.getVoices(),
      avatars: voiceAvatarEngine.getAvatars()
    }));
    return;
  }

  if (pathname === '/api/voice/clone' && req.method === 'POST') {
    try {
      const { name, accent, audioSource } = await readJsonBody();
      const cloned = voiceAvatarEngine.cloneVoice(name, accent, audioSource);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(cloned));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/avatar/configure' && req.method === 'POST') {
    try {
      const options = await readJsonBody();
      const configured = voiceAvatarEngine.configureAvatarOverlay(options);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(configured));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 20. API: TikTok Shop & Shopee Affiliate Monetization
  if (pathname === '/api/affiliate/detect' && req.method === 'POST') {
    try {
      const { text = '' } = await readJsonBody();
      const products = affiliateMonetization.detectProducts(text);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, products }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/affiliate/seeding-plan' && req.method === 'POST') {
    try {
      const { product, authorName } = await readJsonBody();
      const plan = affiliateMonetization.generateSeedingPlan(product, authorName);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(plan));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 21. API: Proxy Matrix & Anti-Detect Warm-Up
  if (pathname === '/api/proxy/list' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      proxies: proxyAntiDetect.getProxies(),
      devices: proxyAntiDetect.getDevices()
    }));
    return;
  }

  if (pathname === '/api/proxy/add' && req.method === 'POST') {
    try {
      const proxyData = await readJsonBody();
      const added = proxyAntiDetect.addProxy(proxyData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(added));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/proxy/warm-up' && req.method === 'POST') {
    try {
      const { cloneId = 'all' } = await readJsonBody();
      const session = proxyAntiDetect.simulateWarmUp(cloneId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(session));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 22. API: Telegram Remote Commander Bot
  if (pathname === '/api/telegram/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      config: telegramBotCommander.getConfig(),
      recentLogs: telegramBotCommander.getRecentLogs()
    }));
    return;
  }

  if (pathname === '/api/telegram/config' && req.method === 'POST') {
    try {
      const body = await readJsonBody();
      const updated = telegramBotCommander.updateConfig(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/telegram/simulate' && req.method === 'POST') {
    try {
      const { message } = await readJsonBody();
      const reply = telegramBotCommander.processMessage(message);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(reply));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 23. API: Viral A/B Hook & Thumbnail Split Tester
  if (pathname === '/api/ab-test/campaigns' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, campaigns: viralSplitTester.getCampaigns() }));
    return;
  }

  if (pathname === '/api/ab-test/generate-variants' && req.method === 'POST') {
    try {
      const { title, script } = await readJsonBody();
      const variants = viralSplitTester.generateVariants(title, script);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(variants));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/ab-test/create-campaign' && req.method === 'POST') {
    try {
      const { title, variants } = await readJsonBody();
      const camp = viralSplitTester.createCampaign(title, variants);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(camp));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  /* ===================================================================
     ENTERPRISE 10X POWERHOUSE SUITE APIS
     =================================================================== */

  // 24. AI Voice Clone & Lip-Sync
  if (pathname === '/api/enterprise/voice-lipsync/voices' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      voices: voiceAvatarEngine.getVoices(),
      avatars: voiceAvatarEngine.getAvatars()
    }));
    return;
  }

  if (pathname === '/api/enterprise/voice-lipsync/clone' && req.method === 'POST') {
    try {
      const { name, accent, audioSource } = await readJsonBody();
      const result = voiceAvatarEngine.cloneVoice(name, accent, audioSource);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/voice-lipsync/process' && req.method === 'POST') {
    try {
      const body = await readJsonBody();
      const result = voiceAvatarEngine.processLipSync(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 25. AI Smart B-Roll Inserter
  if (pathname === '/api/enterprise/broll/auto-insert' && req.method === 'POST') {
    try {
      const { cues = [] } = await readJsonBody();
      const suggestions = smartAudioBroll.suggestBroll(cues);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, suggestions, totalMatched: suggestions.length }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 26. AI Auto-Framing 9:16
  if (pathname === '/api/enterprise/autoframing/modes' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, modes: autoFramingEngine.getModes() }));
    return;
  }

  if (pathname === '/api/enterprise/autoframing/generate' && req.method === 'POST') {
    try {
      const { duration = 60, mode = 'speaker_focus' } = await readJsonBody();
      const result = autoFramingEngine.generatePanKeyframes(duration, mode);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 27. Video Matrix Spintax (1 Video -> 100 Variants)
  if (pathname === '/api/enterprise/matrix-spin/generate' && req.method === 'POST') {
    try {
      const body = await readJsonBody();
      const result = videoMatrixSpintax.generateMatrix(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 28. Deep Anti-Content ID (Audio Ultrasound & Pixel Shift)
  if (pathname === '/api/enterprise/anticopy/shields' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      shields: deepAntiContentID.getShields(),
      score: deepAntiContentID.calculateBypassScore()
    }));
    return;
  }

  if (pathname === '/api/enterprise/anticopy/toggle' && req.method === 'POST') {
    try {
      const { shieldKey, enabled } = await readJsonBody();
      deepAntiContentID.updateShield(shieldKey, enabled);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ok: true,
        shields: deepAntiContentID.getShields(),
        score: deepAntiContentID.calculateBypassScore()
      }));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 29. Trend Velocity Audio Radar
  if (pathname === '/api/enterprise/trend-audio/tracks' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, tracks: trendAudioRadar.getTrendingTracks() }));
    return;
  }

  // 30. Phone Farm ADB Device Manager
  if (pathname === '/api/enterprise/adb/devices' && req.method === 'GET') {
    const devices = await phoneFarmADB.scanDevices();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(devices));
    return;
  }

  if (pathname === '/api/enterprise/adb/push-post' && req.method === 'POST') {
    try {
      const { serial, videoPath, caption, hashtags } = await readJsonBody();
      const result = await phoneFarmADB.pushAndPost(serial, videoPath, caption, hashtags);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 31. AI Smart Comment Seeder & Auto-DM Lead
  if (pathname === '/api/enterprise/comment-seeder/list' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(commentSeeder.getComments()));
    return;
  }

  if (pathname === '/api/enterprise/comment-seeder/simulate' && req.method === 'POST') {
    try {
      const { text, author } = await readJsonBody();
      const result = commentSeeder.simulateNewComment(text, author);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 32. Unified Creator Analytics & Revenue Matrix Dashboard
  if (pathname === '/api/enterprise/analytics/dashboard' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(creatorAnalytics.getDashboardData()));
    return;
  }

  /* ===================================================================
     NEXT-GEN STRATEGIC ENTERPRISE APIS (LIVESTREAM 24/7 & PRO SUITE V2)
     =================================================================== */

  // 33. Virtual Livestream 24/7
  if (pathname === '/api/enterprise/live/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(virtualLivestreamEngine.getLiveState()));
    return;
  }

  if (pathname === '/api/enterprise/live/platforms' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, platforms: virtualLivestreamEngine.platforms }));
    return;
  }

  if (pathname === '/api/enterprise/live/platforms/update' && req.method === 'POST') {
    try {
      const { platformId, settings } = await readJsonBody();
      const result = virtualLivestreamEngine.updatePlatformSettings(platformId, settings);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/toggle' && req.method === 'POST') {
    try {
      const { start, targetPlatforms } = await readJsonBody();
      const result = virtualLivestreamEngine.toggleLiveStream(start, targetPlatforms);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/select-host' && req.method === 'POST') {
    try {
      const { hostId } = await readJsonBody();
      const result = virtualLivestreamEngine.selectHost(hostId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/pin-product' && req.method === 'POST') {
    try {
      const { prodId } = await readJsonBody();
      const result = virtualLivestreamEngine.pinProduct(prodId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/comment' && req.method === 'POST') {
    try {
      const { user, text, platform } = await readJsonBody();
      const result = virtualLivestreamEngine.handleIncomingViewerComment(user, text, platform);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 33.1 Dashboard 3D Model Platform & Spatial Virtual Host Endpoints
  if (pathname === '/api/enterprise/live/3d/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dashboard3DPlatform.get3DState()));
    return;
  }

  if (pathname === '/api/enterprise/live/3d/select-stage' && req.method === 'POST') {
    try {
      const { stageId } = await readJsonBody();
      const result = dashboard3DPlatform.selectStage(stageId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/3d/select-model' && req.method === 'POST') {
    try {
      const { modelId } = await readJsonBody();
      const result = dashboard3DPlatform.selectModel(modelId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/3d/generate' && req.method === 'POST') {
    try {
      const options = await readJsonBody();
      const result = dashboard3DPlatform.generateAI3DModel(options);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/3d/dream-loop' && req.method === 'POST') {
    try {
      const result = dashboard3DPlatform.runDreamLoopCritic();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/3d/cad-customize' && req.method === 'POST') {
    try {
      const { modelId, params } = await readJsonBody();
      const result = dashboard3DPlatform.customizeCadParams(modelId, params);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/3d/action' && req.method === 'POST') {
    try {
      const { actionType, targetAnchor } = await readJsonBody();
      const result = dashboard3DPlatform.executeSpatialAction(actionType, targetAnchor);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 34. Video Globalization Engine
  if (pathname === '/api/enterprise/globalize/languages' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, languages: videoGlobalizer.getAvailableLanguages() }));
    return;
  }

  if (pathname === '/api/enterprise/globalize/process' && req.method === 'POST') {
    try {
      const { script, targetLangCode } = await readJsonBody();
      const result = videoGlobalizer.translateAndDub(script, targetLangCode);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 35. Audio Stem Separator & Copyright Sound Restorer
  if (pathname === '/api/enterprise/stem/separate' && req.method === 'POST') {
    try {
      const { duration } = await readJsonBody();
      const result = audioStemSeparator.separateStems(duration);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/stem/safe-tracks' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, tracks: audioStemSeparator.getSafeTracks() }));
    return;
  }

  if (pathname === '/api/enterprise/stem/replace-sound' && req.method === 'POST') {
    try {
      const { safeBgmId } = await readJsonBody();
      const result = audioStemSeparator.replaceCopyrightSound(safeBgmId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 36. Viral Retention Predictor & Hook Drop-Off Heatmap
  if (pathname === '/api/enterprise/retention/analyze' && req.method === 'POST') {
    try {
      const { script, duration } = await readJsonBody();
      const result = viralRetentionPredictor.analyzeRetention(script, duration);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 37. AI Clickbait Thumbnail Generator
  if (pathname === '/api/enterprise/thumbnail/generate' && req.method === 'POST') {
    try {
      const { videoTitle } = await readJsonBody();
      const result = clickbaitThumbnailAI.generateThumbnails(videoTitle);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 38. 3D Virtual Product Inserter
  if (pathname === '/api/enterprise/product3d/props' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, props: virtualProduct3D.getProps() }));
    return;
  }

  if (pathname === '/api/enterprise/product3d/insert' && req.method === 'POST') {
    try {
      const { propId, timestamp } = await readJsonBody();
      const result = virtualProduct3D.insertProp(propId, timestamp);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 39. Distributed Multi-Worker Render Farm
  if (pathname === '/api/enterprise/renderfarm/nodes' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(distributedRenderFarm.getNodes()));
    return;
  }

  if (pathname === '/api/enterprise/renderfarm/dispatch' && req.method === 'POST') {
    try {
      const { videoCount } = await readJsonBody();
      const result = distributedRenderFarm.dispatchBatchRender(videoCount);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 40. Smart Bio Link Rotator & Cloaker
  if (pathname === '/api/enterprise/biocloak/campaigns' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(smartBioCloaker.getCampaigns()));
    return;
  }

  if (pathname === '/api/enterprise/biocloak/create' && req.method === 'POST') {
    try {
      const { slug, targetUrl } = await readJsonBody();
      const result = smartBioCloaker.createCloakLink(slug, targetUrl);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 41. AI Live PK Battle & Lucky Wheel
  if (pathname === '/api/enterprise/live/pk/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(livePKMinigame.getPKState()));
    return;
  }

  if (pathname === '/api/enterprise/live/pk/toggle' && req.method === 'POST') {
    try {
      const { start } = await readJsonBody();
      const result = livePKMinigame.togglePKBattle(start);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/pk/boost' && req.method === 'POST') {
    try {
      const { points, isGift } = await readJsonBody();
      const result = livePKMinigame.boostScore(points, isGift);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/pk/wheel-spin' && req.method === 'POST') {
    try {
      const { viewer } = await readJsonBody();
      const result = livePKMinigame.spinLuckyWheel(viewer);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 42. AI Flash Sale Scarcity & FOMO Sound Engine
  if (pathname === '/api/enterprise/live/fomo/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(flashSaleFomo.getFlashSaleState()));
    return;
  }

  if (pathname === '/api/enterprise/live/fomo/start' && req.method === 'POST') {
    try {
      const { productTitle, dealPrice, stockCount } = await readJsonBody();
      const result = flashSaleFomo.triggerFlashSale(productTitle, dealPrice, stockCount);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/fomo/simulate-order' && req.method === 'POST') {
    try {
      const { customerName, itemName } = await readJsonBody();
      const result = flashSaleFomo.simulateNewCustomerPurchase(customerName, itemName);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 43. Voice Emotion Auto-Morphing
  if (pathname === '/api/enterprise/live/voice/emotions' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(voiceEmotionMorph.getEmotionsState()));
    return;
  }

  if (pathname === '/api/enterprise/live/voice/set-emotion' && req.method === 'POST') {
    try {
      const { emotionId } = await readJsonBody();
      const result = voiceEmotionMorph.setEmotion(emotionId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 44. AI Auto B-Roll Inserter & Facecam Reaction
  if (pathname === '/api/enterprise/video/broll/analyze' && req.method === 'POST') {
    try {
      const { script } = await readJsonBody();
      const result = autoBrollReaction.analyzeAndSuggestBroll(script);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/video/broll/facecam' && req.method === 'POST') {
    try {
      const { reactionId, position } = await readJsonBody();
      const result = autoBrollReaction.generateFacecamOverlay(reactionId, position);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 45. Deep Lip-Sync & AI Face Swap 4K
  if (pathname === '/api/enterprise/video/lipsync/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(lipsyncFaceSwap.getEngineState()));
    return;
  }

  if (pathname === '/api/enterprise/video/lipsync/process' && req.method === 'POST') {
    try {
      const { videoSrc, profileId, enableFaceSwap } = await readJsonBody();
      const result = lipsyncFaceSwap.processLipSyncAndFaceSwap(videoSrc, profileId, enableFaceSwap);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 46. Shadowban Health Checker & Auto Account Warming
  if (pathname === '/api/enterprise/matrix/shadowban/audit' && req.method === 'POST') {
    try {
      const { channelHandle, platform } = await readJsonBody();
      const result = shadowbanWarmup.auditAccountHealth(channelHandle, platform);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/matrix/shadowban/warmup' && req.method === 'POST') {
    try {
      const { channelHandle, routineId } = await readJsonBody();
      const result = shadowbanWarmup.dispatchWarmupRoutine(channelHandle, routineId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 47. Omnichannel CRM Hub & Shipping Logistics (GHTK / Viettel Post)
  if (pathname === '/api/enterprise/crm/orders' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(omnichannelCrmShipping.getOrders()));
    return;
  }

  if (pathname === '/api/enterprise/crm/create-order' && req.method === 'POST') {
    try {
      const orderData = await readJsonBody();
      const result = omnichannelCrmShipping.createOrderAndShippingLabel(orderData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 48. TikTok Affiliate KOC Hunter & Sample Outreach
  if (pathname === '/api/enterprise/affiliate/koc/list' && req.method === 'GET') {
    const parsedQuery = parsedUrl.query;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(affiliateKocHunter.getKOCList(parsedQuery.niche)));
    return;
  }

  if (pathname === '/api/enterprise/affiliate/koc/outreach' && req.method === 'POST') {
    try {
      const { kocId, commissionPercent, productName } = await readJsonBody();
      const result = affiliateKocHunter.sendSampleOutreachProposal(kocId, commissionPercent, productName);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 49. AI Video Style Morphing Engine (Video-to-Video Diffusion)
  if (pathname === '/api/enterprise/video/style-morph/presets' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(videoStyleMorph.getStylePresets()));
    return;
  }

  if (pathname === '/api/enterprise/video/style-morph/apply' && req.method === 'POST') {
    try {
      const { videoSrc, styleId, denoiseStrength, customPrompt } = await readJsonBody();
      const result = videoStyleMorph.morphVideoStyle(videoSrc, styleId, denoiseStrength, customPrompt);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 50. AI Green Screen Magic Eraser & 3D Virtual Studio Set
  if (pathname === '/api/enterprise/video/magic-studio/sets' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(magicEraserStudio.getVirtualSets()));
    return;
  }

  if (pathname === '/api/enterprise/video/magic-studio/composite' && req.method === 'POST') {
    try {
      const { videoSrc, setId, enableRimLight, blurBackground } = await readJsonBody();
      const result = magicEraserStudio.compositeVirtualStudio(videoSrc, setId, enableRimLight, blurBackground);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 51. Autonomous Channel Director (AI Đạo Diễn Tự Trị - Hands-Free 100%)
  if (pathname === '/api/enterprise/automation/director/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(autonomousDirector.getDirectorStatus()));
    return;
  }

  if (pathname === '/api/enterprise/automation/director/trigger' && req.method === 'POST') {
    try {
      const { niche, targetChannelsCount } = await readJsonBody();
      const result = autonomousDirector.triggerAutonomousCycle(niche, targetChannelsCount);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/automation/director/toggle' && req.method === 'POST') {
    try {
      const { enable } = await readJsonBody();
      const result = autonomousDirector.toggleAutoPilot(enable);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 52. AI Competitor Spy Radar (Radar Bắt Bài Đối Thủ Cùng Ngành)
  if (pathname === '/api/enterprise/market/spy-radar/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(competitorSpyRadar.getRadarData()));
    return;
  }

  if (pathname === '/api/enterprise/market/spy-radar/counter-strategy' && req.method === 'POST') {
    try {
      const { alertId } = await readJsonBody();
      const result = competitorSpyRadar.generateCounterStrategy(alertId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 53. Live Webcam Motion Capture & Interactive Avatar Controller
  if (pathname === '/api/enterprise/live/mocap/state' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(webcamMocapStream.getMocapState()));
    return;
  }

  if (pathname === '/api/enterprise/live/mocap/toggle' && req.method === 'POST') {
    try {
      const { enable } = await readJsonBody();
      const result = webcamMocapStream.toggleMocap(enable);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/mocap/blendshapes' && req.method === 'POST') {
    try {
      const { shapes } = await readJsonBody();
      const result = webcamMocapStream.updateLiveBlendshapes(shapes);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 54. Computer Vision Auto-Pinning (Tự Quét Sản Phẩm Ghim Giỏ Hàng)
  if (pathname === '/api/enterprise/live/cv-pinning/scanner' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(cvProductPinning.getScannerState()));
    return;
  }

  if (pathname === '/api/enterprise/live/cv-pinning/detect' && req.method === 'POST') {
    try {
      const { imageFeed, forcedProductId } = await readJsonBody();
      const result = cvProductPinning.detectAndPinProduct(imageFeed, forcedProductId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  if (pathname === '/api/enterprise/live/cv-pinning/toggle' && req.method === 'POST') {
    try {
      const { enable } = await readJsonBody();
      const result = cvProductPinning.toggleScanner(enable);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 55. 4G/5G Rotating SIM Farm & Fingerprint Browser Hub
  if (pathname === '/api/enterprise/matrix/sim-fingerprint/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(simFarmFingerprint.getSimFarmStatus()));
    return;
  }

  if (pathname === '/api/enterprise/matrix/sim-fingerprint/rotate-ip' && req.method === 'POST') {
    try {
      const { dongleId } = await readJsonBody();
      const result = simFarmFingerprint.rotateDongleIp(dongleId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }

  // 56. Realtime Profit & Net Margin Tracker (Biên Lợi Nhuận Ròng & Thuế Sàn)
  if (pathname === '/api/enterprise/finance/margin-tracker/report' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(profitMarginTracker.getFinancialReport()));
    return;
  }

  if (pathname === '/api/enterprise/finance/margin-tracker/record-sale' && req.method === 'POST') {
    try {
      const { productName, salePrice, cogsPercent } = await readJsonBody();
      const result = profitMarginTracker.recordLiveSale(productName, salePrice, cogsPercent);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, message: e.message }));
    }
    return;
  }


  let reqPath = pathname === '/' ? '/index.html' : pathname;
  let filePath = path.join(STUDIO_DIR, reqPath);

  // Fallback to static files in root if needed
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, reqPath);
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found - TMD Studio Pro');
  }
});

/**
 * Scan directories starting with @ and collect mp4 files
 */
function scanMediaDirectories() {
  const results = [];
  const entries = fs.readdirSync(__dirname, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('@')) {
      const dirPath = path.join(__dirname, entry.name);
      const subEntries = fs.readdirSync(dirPath, { withFileTypes: true });

      // Read names.txt if available
      const titlesMap = {};
      const namesTxtPath = path.join(dirPath, 'names.txt');
      if (fs.existsSync(namesTxtPath)) {
        const lines = fs.readFileSync(namesTxtPath, 'utf8').split('\n');
        for (const line of lines) {
          const match = line.match(/^\[(\d+)\]\s+(.+)$/);
          if (match) {
            titlesMap[match[1]] = match[2].trim();
          }
        }
      }

      for (const sub of subEntries) {
        if (sub.isFile() && sub.name.endsWith('.mp4') && !sub.name.endsWith('.tmp')) {
          const filePath = path.join(dirPath, sub.name);
          const stat = fs.statSync(filePath);
          const videoId = sub.name.replace('.mp4', '');

          results.push({
            author: entry.name,
            filename: sub.name,
            id: videoId,
            title: titlesMap[videoId] || sub.name,
            sizeBytes: stat.size,
            sizeFormatted: (stat.size / (1024 * 1024)).toFixed(1) + ' MB',
            path: `${entry.name}/${sub.name}`,
            created: stat.mtime
          });
        }
      }
    }
  }

  return results.sort((a, b) => b.created - a.created);
}

server.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                   🎬 TMD STUDIO PRO IS RUNNING LOCALLY                     ║');
  console.log('╠════════════════════════════════════════════════════════════════════════════╣');
  console.log(`║  • Local Web Studio : http://localhost:${PORT}                                ║`);
  console.log('║  • Vietnamese AI    : Integrated with longhang2004/vietnamese-humanizer    ║');
  console.log('║  • Video Streaming  : HTTP 206 Partial Content (Instant timeline scrub)    ║');
  console.log('║  • OS Styles        : Dual Mode ( macOS & ⊞ Windows 11 Chrome)            ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝');
});
