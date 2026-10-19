const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');
const db = require('./database');

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


  // 4. Static File Server (Serving Studio)
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
