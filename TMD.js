const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

// Utility sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Format numbers with commas (e.g. 197300 -> 197,300)
function formatNumber(num) {
  if (num == null || isNaN(num)) return '0';
  return Number(num).toLocaleString();
}

// Compact number formatting (e.g. 197300 -> 197.3K, 2005718 -> 2.0M)
function formatCompact(num) {
  if (num == null || isNaN(num)) return '0';
  const n = Number(num);
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
}

// Format bytes into human-readable string (B, KB, MB, GB)
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format seconds into MM:SS
function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Sanitize filename for Windows, macOS, and Linux
function sanitizeFilename(name) {
  return (name || '').replace(/[\\/:*?"<>|]/g, '').trim();
}

/**
 * Fetch video metadata and 100% watermark-free download URL via TikWM API (Method 1)
 */
async function getVideoDetailsViaApi(videoUrl, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const endpoint = `https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}&hd=1`;
      const res = await fetch(endpoint, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      if (json.code === 0 && json.data) {
        // Strictly prioritize HD or standard watermark-free stream
        const noWatermarkPlayUrl = json.data.hdplay || json.data.play;
        if (!noWatermarkPlayUrl) {
          throw new Error('No watermark-free stream in API response');
        }

        return {
          id: json.data.id || (videoUrl.match(/\/video\/(\d+)/) || [])[1] || `${Date.now()}`,
          title: json.data.title || 'Untitled',
          author: json.data.author?.unique_id || 'unknown_user',
          playUrl: noWatermarkPlayUrl,
          isHD: Boolean(json.data.hdplay),
          size: json.data.size || 0,
          headers: {},
        };
      } else {
        throw new Error(json.msg || 'API returned non-zero status code');
      }
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      await sleep(1000 * attempt);
    }
  }
}

/**
 * Ultimate Fallback: Bypass restricted / download-prevented videos using Puppeteer session cookies & rehydration (Method 2)
 */
async function getVideoDetailsViaBrowserBypass(videoUrl) {
  console.log(` [Bypass Resolver] Activating browser session bypass for restricted video...`);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.goto(videoUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await sleep(2500);

    const cookies = await page.cookies();
    const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');

    const videoData = await page.evaluate(() => {
      try {
        const script = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__');
        if (script) {
          const full = JSON.parse(script.textContent);
          const item = full['__DEFAULT_SCOPE__']?.['webapp.video-detail']?.itemInfo?.itemStruct;
          if (item) {
            return {
              title: item.desc || 'Untitled',
              author: item.author?.uniqueId || 'unknown_user',
              playAddr: item.video?.playAddr || item.video?.downloadAddr || null,
              id: item.id || null,
            };
          }
        }
      } catch (_) {}
      return null;
    });

    if (videoData && videoData.playAddr) {
      return {
        id: videoData.id || (videoUrl.match(/\/video\/(\d+)/) || [])[1] || `${Date.now()}`,
        title: videoData.title,
        author: videoData.author,
        playUrl: videoData.playAddr,
        isHD: false,
        size: 0,
        headers: {
          Referer: 'https://www.tiktok.com/',
          Cookie: cookieHeader,
        },
      };
    }

    throw new Error('Could not resolve video playAddr from page rehydration');
  } finally {
    await browser.close();
  }
}

/**
 * Combined Video Details Resolver with Automatic Bypass
 */
async function resolveVideo(videoUrl) {
  try {
    return await getVideoDetailsViaApi(videoUrl);
  } catch (apiErr) {
    console.log(` ⚠️ API lookup failed (${apiErr.message}). Initiating deep bypass...`);
    return await getVideoDetailsViaBrowserBypass(videoUrl);
  }
}

/**
 * Stream download a video file with a real-time progress bar and atomic temporary file handling
 */
async function downloadFile(fileUrl, outputPath, expectedSize = 0, customHeaders = {}) {
  const tempPath = `${outputPath}.tmp`;
  const res = await fetch(fileUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ...customHeaders,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to download: HTTP ${res.status} ${res.statusText}`);
  }

  const contentLength = parseInt(res.headers.get('content-length') || '0', 10) || expectedSize;
  const fileStream = fs.createWriteStream(tempPath);

  let downloadedBytes = 0;
  const startTime = Date.now();
  let lastUpdate = 0;

  const reader = res.body.getReader();

  const nodeReadable = new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
          if (contentLength > 0) {
            const elapsed = (Date.now() - startTime) / 1000;
            const avgSpeed = downloadedBytes / (elapsed || 1);
            process.stdout.write(
              `\r[====================] 100% (${formatBytes(downloadedBytes)} / ${formatBytes(
                contentLength
              )}) | ${formatBytes(avgSpeed)}/s | Complete!        \n`
            );
          }
          return;
        }

        downloadedBytes += value.length;
        this.push(Buffer.from(value));

        const now = Date.now();
        if (now - lastUpdate > 250 || downloadedBytes === contentLength) {
          lastUpdate = now;
          const elapsed = (now - startTime) / 1000;
          const speed = downloadedBytes / (elapsed || 1);
          let percentStr = '---%';
          let bar = '--------------------';
          let etaStr = '--:--';

          if (contentLength > 0) {
            const ratio = Math.min(downloadedBytes / contentLength, 1);
            const percent = Math.floor(ratio * 100);
            percentStr = `${percent}%`;
            const filledLength = Math.round(20 * ratio);
            bar =
              '='.repeat(filledLength) +
              (filledLength < 20 ? '>' : '') +
              ' '.repeat(Math.max(0, 19 - filledLength));
            const remainingBytes = contentLength - downloadedBytes;
            const etaSeconds = speed > 0 ? remainingBytes / speed : 0;
            etaStr = formatTime(etaSeconds);
          }

          process.stdout.write(
            `\r[${bar}] ${percentStr.padStart(4)} (${formatBytes(downloadedBytes)} / ${
              contentLength > 0 ? formatBytes(contentLength) : 'Unknown'
            }) | ${formatBytes(speed)}/s | ETA: ${etaStr}   `
          );
        }
      } catch (err) {
        this.destroy(err);
      }
    },
  });

  try {
    nodeReadable.pipe(fileStream);
    await finished(fileStream);
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
    fs.renameSync(tempPath, outputPath);
  } catch (err) {
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch (_) {}
    }
    throw err;
  }
}

/**
 * Scrape TikTok profile: Extract profile info, scan videos, and collect clean links
 */
async function scrapeProfile(userProfileUrl, maxVideos = Infinity) {
  console.log(`\n[Puppeteer] Connecting to profile: ${userProfileUrl}`);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setViewport({ width: 1280, height: 900 });

    // Block images, fonts, and media during scanning to maximize speed
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'media', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(userProfileUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(2000);

    // 1. Extract Profile Info from SSR Rehydration or DOM
    const profileInfo = await page.evaluate(() => {
      try {
        const script = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__');
        if (script) {
          const full = JSON.parse(script.textContent);
          const scope = full['__DEFAULT_SCOPE__'];
          const userDetail = scope?.['webapp.user-detail']?.userInfo;
          if (userDetail) {
            const u = userDetail.user || {};
            const s = userDetail.stats || {};
            return {
              id: u.id || '',
              username: u.uniqueId || '',
              nickname: u.nickname || '',
              bio: u.signature || '',
              avatar: u.avatarLarger || u.avatarMedium || '',
              verified: Boolean(u.verified),
              privateAccount: Boolean(u.privateAccount),
              downloadSetting: u.downloadSetting, // 0 = allowed, 3 = prevented/disabled by creator
              followers: s.followerCount || 0,
              following: s.followingCount || 0,
              hearts: s.heartCount || s.heart || 0,
              videoCount: s.videoCount || 0,
            };
          }
        }
      } catch (_) {}

      // Fallback: Extract from DOM
      return {
        id: '',
        username: (window.location.pathname.match(/@([^/?]+)/) || [])[1] || '',
        nickname: document.querySelector('[data-e2e="user-title"]')?.innerText || '',
        bio: document.querySelector('[data-e2e="user-bio"]')?.innerText || '',
        avatar: '',
        verified: Boolean(document.querySelector('[data-e2e="user-verified-badge"]')),
        privateAccount: false,
        downloadSetting: 0,
        followers: document.querySelector('[data-e2e="followers-count"]')?.innerText || 0,
        following: document.querySelector('[data-e2e="following-count"]')?.innerText || 0,
        hearts: document.querySelector('[data-e2e="likes-count"]')?.innerText || 0,
        videoCount: 0,
      };
    });

    // 2. Display Formatted Profile Information
    displayProfileCard(profileInfo, userProfileUrl);

    // 3. Scan & Collect Video Links
    console.log('[Puppeteer] Scanning profile feed and collecting video links...');
    const collectedLinks = new Set();
    let noChangeCycles = 0;
    let lastCount = 0;

    while (collectedLinks.size < maxVideos && noChangeCycles < 6) {
      // Auto-dismiss any login or guest popups that block scrolling
      await page.evaluate(() => {
        const closeSelectors = [
          '[data-e2e="modal-close-inner-button"]',
          '[aria-label="Close"]',
          'button[class*="close"]',
          'div[class*="DivCloseWrapper"]',
        ];
        closeSelectors.forEach((sel) => {
          document.querySelectorAll(sel).forEach((el) => {
            try {
              el.click();
            } catch (_) {}
          });
        });

        document
          .querySelectorAll('div[role="dialog"], [data-e2e="auth-modal"], div[class*="DivModalContainer"]')
          .forEach((el) => {
            try {
              el.remove();
            } catch (_) {}
          });
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
      });

      // Extract all video anchors from the page
      const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href*="/video/"]'));
        return anchors.map((a) => a.href);
      });

      for (const link of links) {
        const cleanLink = link.split('?')[0];
        collectedLinks.add(cleanLink);
        if (collectedLinks.size >= maxVideos) break;
      }

      process.stdout.write(`\r[Puppeteer] Scanned and collected: ${collectedLinks.size} video link(s)...`);

      if (collectedLinks.size === lastCount) {
        noChangeCycles++;
      } else {
        noChangeCycles = 0;
        lastCount = collectedLinks.size;
      }

      if (collectedLinks.size >= maxVideos) break;

      // Scroll down by 2000px
      await page.evaluate(() => window.scrollBy(0, 2000));
      await sleep(1400);
    }

    process.stdout.write('\n');
    const finalLinks = Array.from(collectedLinks).slice(0, maxVideos);

    return {
      profileInfo,
      videoLinks: finalLinks,
    };
  } finally {
    await browser.close();
  }
}

/**
 * Print a stylish terminal card for TikTok Profile Details
 */
function displayProfileCard(info, url) {
  const isBypassed = info.downloadSetting !== 0;
  const downloadStatusText = isBypassed
    ? '🔒 Disabled by creator [BYPASS ACTIVE -> 100% Downloadable]'
    : '🔓 Allowed by creator [BYPASS READY]';

  console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                            TIKTOK PROFILE INFO                             ║');
  console.log('╠════════════════════════════════════════════════════════════════════════════╣');
  console.log(`║  • Username       : @${info.username} ${info.id ? `(ID: ${info.id})` : ''}`);
  console.log(`║  • Nickname       : ${info.nickname}${info.verified ? ' [VERIFIED ✓]' : ''}`);
  console.log(`║  • Followers      : ${formatNumber(info.followers)} (${formatCompact(info.followers)})`);
  console.log(`║  • Following      : ${formatNumber(info.following)}`);
  console.log(`║  • Total Hearts   : ${formatNumber(info.hearts)} (${formatCompact(info.hearts)})`);
  console.log(`║  • Total Videos   : ${info.videoCount > 0 ? formatNumber(info.videoCount) : 'Dynamic Feed'}`);
  console.log(`║  • Profile Link   : ${url}`);
  console.log(`║  • Download Status: ${downloadStatusText}`);
  if (info.bio) {
    const cleanBio = info.bio.replace(/\r?\n/g, '  |  ');
    console.log(`║  • Bio / Signature: ${cleanBio.slice(0, 80)}${cleanBio.length > 80 ? '...' : ''}`);
  }
  console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');
}

/**
 * Main Controller
 */
async function main() {
  const args = process.argv.slice(2);
  if (!args[0]) {
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║               Tiktok Mass Downloader (With Profile Info & Bypass)          ║');
    console.log('╠════════════════════════════════════════════════════════════════════════════╣');
    console.log('║ Usage:                                                                     ║');
    console.log('║                                                                            ║');
    console.log('║  • Mass Download Profile (Collects Info, Displays Links, Downloads):       ║');
    console.log('║      node TMD.js "https://www.tiktok.com/@username"                        ║');
    console.log('║      node TMD.js "https://www.tiktok.com/@username" 10                     ║');
    console.log('║      node TMD.js "@username" 5                                             ║');
    console.log('║                                                                            ║');
    console.log('║  • Collect Info & Links Only (Without Downloading Videos):                 ║');
    console.log('║      node TMD.js "https://www.tiktok.com/@username" --info                 ║');
    console.log('║                                                                            ║');
    console.log('║  • Single Video Download (Watermark-Free HD + Bypass):                     ║');
    console.log('║      node TMD.js "https://www.tiktok.com/@user/video/7675792462593428756"  ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝');
    process.exit(1);
  }

  let rawInput = args[0].trim();

  if (/^\d+$/.test(rawInput)) {
    console.error('❌ Error: Input target cannot be a number. If using PowerShell, enclose "@username" in quotes: node TMD.js "@username"');
    process.exit(1);
  }

  const isInfoOnly = args.includes('--info') || args.includes('--info-only') || args.includes('--links-only');
  const limitArg = args[1] && !args[1].startsWith('--') ? parseInt(args[1], 10) : null;
  const maxVideos = limitArg && !isNaN(limitArg) && limitArg > 0 ? limitArg : Infinity;

  // Auto-detect & normalize username format
  if (!rawInput.startsWith('http://') && !rawInput.startsWith('https://')) {
    if (!rawInput.startsWith('@')) {
      rawInput = `@${rawInput}`;
    }
    rawInput = `https://www.tiktok.com/${rawInput}`;
  }

  const isSingleVideo =
    rawInput.includes('/video/') ||
    rawInput.includes('vm.tiktok.com') ||
    rawInput.includes('vt.tiktok.com');

  console.log('════════════════════════════════════════════════════');
  console.log(' 🚀 TikTok Mass Downloader (Watermark-Free + Bypass)');
  console.log('════════════════════════════════════════════════════');
  console.log(` Target : ${rawInput}`);
  if (isSingleVideo) {
    console.log(' Mode   : Single Video Download (Direct No-Watermark HD)');
  } else {
    console.log(` Mode   : Profile Processing (${maxVideos === Infinity ? 'All Available' : maxVideos} videos)${isInfoOnly ? ' [INFO & LINKS ONLY]' : ''}`);
  }
  console.log(' Bypass : Profile "Download Prevented" Bypassed (100% Watermark-Free)\n');

  if (isSingleVideo) {
    await downloadSingleVideo(rawInput);
  } else {
    await processProfile(rawInput, maxVideos, isInfoOnly);
  }
}

/**
 * Handle single video download
 */
async function downloadSingleVideo(videoUrl) {
  try {
    console.log('[1/2] Resolving clean video stream with bypass support...');
    const details = await resolveVideo(videoUrl);

    console.log(` 📌 Title   : ${details.title}`);
    console.log(` 👤 Author  : @${details.author}`);
    console.log(` 🆔 Video ID: ${details.id}`);
    console.log(` 🎬 Quality : ${details.isHD ? 'HD (No Watermark)' : 'Clean Stream (No Watermark)'}`);

    const outputDir = path.join(process.cwd(), `@${sanitizeFilename(details.author)}`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const videoFilename = `${details.id}.mp4`;
    const outputPath = path.join(outputDir, videoFilename);

    console.log(`\n[2/2] Downloading watermark-free video:`);
    await downloadFile(details.playUrl, outputPath, details.size, details.headers);

    // Save description to names.txt
    const descLine = `[${details.id}] ${details.title}\n`;
    fs.appendFileSync(path.join(outputDir, 'names.txt'), descLine, 'utf8');

    console.log(`\n✨ Successfully downloaded clean video!`);
    console.log(`   📁 File: ${outputPath}`);
    console.log(`   📝 Description recorded in ${path.join(outputDir, 'names.txt')}\n`);
  } catch (err) {
    console.error(`\n❌ Error downloading video: ${err.message}\n`);
  }
}

/**
 * Process profile: Display profile info, display video links, save metadata, and download
 */
async function processProfile(profileUrl, maxVideos, isInfoOnly = false) {
  let scrapeResult;
  try {
    scrapeResult = await scrapeProfile(profileUrl, maxVideos);
  } catch (err) {
    console.error(`❌ Failed to scan profile: ${err.message}`);
    return;
  }

  const { profileInfo, videoLinks } = scrapeResult;
  const username = profileInfo.username || (profileUrl.match(/@([^/?]+)/) || [])[1] || 'tiktok_user';
  const outputDir = path.join(process.cwd(), `@${sanitizeFilename(username)}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save profile info JSON
  fs.writeFileSync(path.join(outputDir, 'profile_info.json'), JSON.stringify(profileInfo, null, 2), 'utf8');

  if (videoLinks.length === 0) {
    console.log('⚠️ No videos found. Check if the profile is public or if the username is correct.');
    return;
  }

  // Save collected links to links.txt
  fs.writeFileSync(path.join(outputDir, 'links.txt'), videoLinks.join('\n') + '\n', 'utf8');

  // Display Collected Video Links in terminal
  console.log('────────────────────────────────────────────────────────────────────────────');
  console.log(` 📋 Collected Video Links (${videoLinks.length} items found):`);
  console.log('────────────────────────────────────────────────────────────────────────────');
  videoLinks.forEach((link, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    console.log(` [${num}] ${link}`);
  });
  console.log('────────────────────────────────────────────────────────────────────────────');
  console.log(` 💾 Saved profile info -> @${username}/profile_info.json`);
  console.log(` 💾 Saved all links   -> @${username}/links.txt`);
  console.log('────────────────────────────────────────────────────────────────────────────\n');

  if (isInfoOnly) {
    console.log('✨ [Info Only Mode] Profile information and links collected successfully. Exiting without downloading videos.\n');
    return;
  }

  console.log(`📦 Starting watermark-free mass download for ${videoLinks.length} video(s) (Bypass Active)...\n`);

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < videoLinks.length; i++) {
    const vUrl = videoLinks[i];
    console.log(`\n[${i + 1}/${videoLinks.length}] Processing: ${vUrl}`);

    try {
      const details = await resolveVideo(vUrl);
      console.log(` 📌 Title: ${details.title.slice(0, 65)}${details.title.length > 65 ? '...' : ''}`);

      const videoFilename = `${details.id}.mp4`;
      const outputPath = path.join(outputDir, videoFilename);

      if (fs.existsSync(outputPath)) {
        console.log(` ⏩ Already exists: ${videoFilename}. Skipping.`);
        skippedCount++;
        continue;
      }

      console.log(` ⬇ Downloading (${details.isHD ? 'HD No-Watermark' : 'No-Watermark Stream'})...`);
      await downloadFile(details.playUrl, outputPath, details.size, details.headers);

      // Save description to names.txt
      const descLine = `[${details.id}] ${details.title}\n`;
      fs.appendFileSync(path.join(outputDir, 'names.txt'), descLine, 'utf8');

      successCount++;
      console.log(` ✔ Saved: @${details.author}/${videoFilename}`);

      // Small jitter between downloads to prevent IP throttling
      if (i < videoLinks.length - 1) {
        await sleep(1000);
      }
    } catch (err) {
      console.error(` ❌ Failed ${vUrl}: ${err.message}`);
      failCount++;
    }
  }

  console.log('\n====================================================');
  console.log(' 🏁 Mass Download Summary');
  console.log(`  • Profile:         @${username}`);
  console.log(`  • Total Videos:    ${videoLinks.length}`);
  console.log(`  • Downloaded:      ${successCount}`);
  console.log(`  • Already Existed: ${skippedCount}`);
  console.log(`  • Failed:          ${failCount}`);
  console.log(`  • Profile Info:    @${username}/profile_info.json`);
  console.log(`  • Links File:      @${username}/links.txt`);
  console.log('====================================================\n');
}

main();