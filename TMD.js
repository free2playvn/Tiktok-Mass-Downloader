const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

// Utility sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
 * Fetch video metadata and 100% watermark-free download URL via TikWM API (with HD support)
 */
async function getVideoDetails(videoUrl, retries = 3) {
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
        // Explicitly prioritize HD watermark-free or standard watermark-free stream.
        // We strictly DO NOT fallback to wmplay (watermarked).
        const noWatermarkPlayUrl = json.data.hdplay || json.data.play;

        if (!noWatermarkPlayUrl) {
          throw new Error('No watermark-free stream available in API response');
        }

        return {
          id: json.data.id || (videoUrl.match(/\/video\/(\d+)/) || [])[1] || `${Date.now()}`,
          title: json.data.title || 'Untitled',
          author: json.data.author?.unique_id || 'unknown_user',
          playUrl: noWatermarkPlayUrl,
          isHD: Boolean(json.data.hdplay),
          musicUrl: json.data.music || null,
          size: json.data.size || 0,
        };
      } else {
        throw new Error(json.msg || 'API returned non-zero status code');
      }
    } catch (err) {
      if (attempt === retries) {
        throw err;
      }
      await sleep(1500 * attempt);
    }
  }
}

/**
 * Stream download a video file with a real-time progress bar
 */
async function downloadFile(fileUrl, outputPath, expectedSize = 0) {
  const tempPath = `${outputPath}.tmp`;
  const res = await fetch(fileUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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
 * Scrape TikTok user profile video links with auto-scroll and modal popup auto-dismissal
 */
async function scrapeProfile(userProfileUrl, maxVideos = Infinity) {
  console.log(`[Puppeteer] Launching headless browser for: ${userProfileUrl}`);
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

    // Block image/media/font downloads to maximize scraping speed & minimize bandwidth
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'media', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log('[Puppeteer] Navigating to user profile...');
    await page.goto(userProfileUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });

    // Wait for video links or container
    try {
      await page.waitForSelector('a[href*="/video/"]', { timeout: 15000 });
    } catch {
      console.log('[Puppeteer] First selector wait reached, proceeding to auto-scroll...');
    }

    const collectedLinks = new Set();
    let noChangeCycles = 0;
    let lastCount = 0;

    console.log('[Puppeteer] Mass scanning profile feed...');
    while (collectedLinks.size < maxVideos && noChangeCycles < 6) {
      // 1. Dismiss any login modals, popups, or sticky overlays that block scrolling
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

        // Remove any dialog or modal container element and restore scroll
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

      // 2. Extract all video links from DOM
      const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href*="/video/"]'));
        return anchors.map((a) => a.href);
      });

      for (const link of links) {
        // Strip trailing query parameters for a clean canonical video URL
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
    return Array.from(collectedLinks).slice(0, maxVideos);
  } finally {
    await browser.close();
  }
}

/**
 * Main Controller
 */
async function main() {
  const args = process.argv.slice(2);
  if (!args[0]) {
    console.log('╔════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                   Tiktok Mass Downloader (Without Watermark)               ║');
    console.log('╠════════════════════════════════════════════════════════════════════════════╣');
    console.log('║ Usage:                                                                     ║');
    console.log('║                                                                            ║');
    console.log('║  • Mass Download User Profile (All videos or limit N):                     ║');
    console.log('║      node TMD.js https://www.tiktok.com/@username                          ║');
    console.log('║      node TMD.js https://www.tiktok.com/@username 10                       ║');
    console.log('║      node TMD.js @username 5                                               ║');
    console.log('║                                                                            ║');
    console.log('║  • Single Video Download (Watermark-Free HD):                              ║');
    console.log('║      node TMD.js https://www.tiktok.com/@user/video/7675792462593428756    ║');
    console.log('║                                                                            ║');
    console.log('║ Output:                                                                    ║');
    console.log('║  • Videos saved to @username/<videoId>.mp4 (Clean without watermark)       ║');
    console.log('║  • Video titles and metadata recorded in @username/names.txt               ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════╝');
    process.exit(1);
  }

  let rawInput = args[0].trim();

  if (/^\d+$/.test(rawInput)) {
    console.error('❌ Error: Input target cannot be a number. If using PowerShell, enclose "@username" in quotes: node TMD.js "@username"');
    process.exit(1);
  }

  const limitArg = args[1] ? parseInt(args[1], 10) : null;
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
  console.log(' 🚀 TikTok Mass Downloader (Watermark-Free)');
  console.log('════════════════════════════════════════════════════');
  console.log(` Target : ${rawInput}`);
  if (isSingleVideo) {
    console.log(' Mode   : Single Video Download (Direct No-Watermark HD)');
  } else {
    console.log(` Mode   : Profile Mass Download (${maxVideos === Infinity ? 'All Available' : maxVideos} videos)`);
  }
  console.log(' Watermark: REMOVED (Clean 100% Watermark-Free)\n');

  if (isSingleVideo) {
    await downloadSingleVideo(rawInput);
  } else {
    await downloadProfileMass(rawInput, maxVideos);
  }
}

/**
 * Handle single video download
 */
async function downloadSingleVideo(videoUrl) {
  try {
    console.log('[1/2] Resolving clean video stream...');
    const details = await getVideoDetails(videoUrl);

    console.log(` 📌 Title   : ${details.title}`);
    console.log(` 👤 Author  : @${details.author}`);
    console.log(` 🆔 Video ID: ${details.id}`);
    console.log(` 🎬 Quality : ${details.isHD ? 'HD (No Watermark)' : 'Standard (No Watermark)'}`);

    const outputDir = path.join(process.cwd(), `@${sanitizeFilename(details.author)}`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const videoFilename = `${details.id}.mp4`;
    const outputPath = path.join(outputDir, videoFilename);

    console.log(`\n[2/2] Downloading watermark-free video:`);
    await downloadFile(details.playUrl, outputPath, details.size);

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
 * Handle mass profile download
 */
async function downloadProfileMass(profileUrl, maxVideos) {
  let videoUrls = [];
  try {
    videoUrls = await scrapeProfile(profileUrl, maxVideos);
  } catch (err) {
    console.error(`❌ Failed to scan profile: ${err.message}`);
    return;
  }

  if (videoUrls.length === 0) {
    console.log('⚠️ No videos found. Check if the profile is public or if the username is correct.');
    return;
  }

  console.log(`\n📦 Ready to mass download ${videoUrls.length} video(s) without watermark.\n`);

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < videoUrls.length; i++) {
    const vUrl = videoUrls[i];
    console.log(`\n[${i + 1}/${videoUrls.length}] Processing: ${vUrl}`);

    try {
      const details = await getVideoDetails(vUrl);
      console.log(` 📌 Title: ${details.title.slice(0, 65)}${details.title.length > 65 ? '...' : ''}`);

      const outputDir = path.join(process.cwd(), `@${sanitizeFilename(details.author)}`);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const videoFilename = `${details.id}.mp4`;
      const outputPath = path.join(outputDir, videoFilename);

      if (fs.existsSync(outputPath)) {
        console.log(` ⏩ Already exists: ${videoFilename}. Skipping.`);
        skippedCount++;
        continue;
      }

      console.log(` ⬇ Downloading (${details.isHD ? 'HD No-Watermark' : 'No-Watermark'})...`);
      await downloadFile(details.playUrl, outputPath, details.size);

      // Save description
      const descLine = `[${details.id}] ${details.title}\n`;
      fs.appendFileSync(path.join(outputDir, 'names.txt'), descLine, 'utf8');

      successCount++;
      console.log(` ✔ Saved: @${details.author}/${videoFilename}`);

      // Small jitter between downloads to prevent IP throttling
      if (i < videoUrls.length - 1) {
        await sleep(1000);
      }
    } catch (err) {
      console.error(` ❌ Failed ${vUrl}: ${err.message}`);
      failCount++;
    }
  }

  console.log('\n====================================================');
  console.log(' 🏁 Mass Download Summary');
  console.log(`  • Total Videos:    ${videoUrls.length}`);
  console.log(`  • Downloaded:      ${successCount}`);
  console.log(`  • Already Existed: ${skippedCount}`);
  console.log(`  • Failed:          ${failCount}`);
  console.log('====================================================\n');
}

main();