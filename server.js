const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
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
