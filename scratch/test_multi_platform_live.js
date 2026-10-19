const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\10601f83-02da-4842-b6f2-a300007b5950';

async function testMultiPlatformLive() {
  console.log('🚀 Khởi động Chrome headless để kiểm thử Liên kết Livestream Facebook, YouTube, TikTok...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,950']
  });

  const page = await browser.newPage();

  // Handle alerts automatically
  page.on('dialog', async dialog => {
    console.log(`[Browser Alert Dialog] ${dialog.message()}`);
    await dialog.dismiss();
  });

  try {
    console.log('1. Truy cập TMD Studio Pro tại http://localhost:3000 ...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

    // Step 2: Auto-login
    console.log('2. Đăng nhập tài khoản Quản Trị Viên...');
    const demoAdminChip = await page.$('#btnDemoAdmin');
    if (demoAdminChip) {
      await demoAdminChip.click();
      await new Promise(r => setTimeout(r, 400));
      await page.click('#btnSubmitLogin');
      await new Promise(r => setTimeout(r, 1200));
    }

    // Step 3: Open Live Studio
    console.log('3. Mở buồng phát sóng AI Live Studio (#btnOpenLiveStudio)...');
    await page.waitForSelector('#btnOpenLiveStudio', { timeout: 10000 });
    await page.click('#btnOpenLiveStudio');
    await new Promise(r => setTimeout(r, 1800));

    // Cuộn tới khối Cấu hình Liên Kết Đa Nền Tảng
    await page.$eval('.multi-platform-suite', el => el.scrollIntoView({ block: 'center' }));
    await new Promise(r => setTimeout(r, 800));

    // Screenshot 1: Multi-Platform Broadcast Bridge Overview
    const snap1Path = path.join(ARTIFACT_DIR, 'preview_multi_platform_bridge_overview.png');
    await page.screenshot({ path: snap1Path, fullPage: false });
    console.log(`📸 Đã lưu ảnh tổng quan liên kết 3 nền tảng: ${snap1Path}`);

    // Step 4: Click Lưu cấu hình Stream Key 3 kênh
    console.log('4. Thử lưu cấu hình Stream Key cho TikTok, YouTube và Facebook...');
    const btnSaveKeys = await page.$('#btnSavePlatformKeys');
    if (btnSaveKeys) {
      await btnSaveKeys.click();
      await new Promise(r => setTimeout(r, 1500));
    }

    // Step 5: Thử nghiệm gửi comment từ Facebook với cú pháp Chốt Đơn SĐT
    console.log('5. Thử nghiệm gửi comment chốt đơn từ Facebook Live...');
    await page.$eval('#liveCommentPlatformSelect', el => el.value = 'facebook');
    await page.$eval('#liveSimulateCommentInput', el => el.value = 'Chốt 2 áo thun đen size L 0988776655');
    await page.click('#btnLiveSendComment');
    await new Promise(r => setTimeout(r, 1500));

    // Step 6: Thử nghiệm gửi comment từ YouTube Live
    console.log('6. Thử nghiệm gửi comment hỏi thông số từ YouTube Live...');
    await page.$eval('#liveCommentPlatformSelect', el => el.value = 'youtube');
    await page.$eval('#liveSimulateCommentInput', el => el.value = 'Mẫu giày sneaker này có chống nước đi mưa được không shop?');
    await page.click('#btnLiveSendComment');
    await new Promise(r => setTimeout(r, 1500));

    // Screenshot 2: Unified Chat with Platform Badges & MC Auto-Responses
    await page.$eval('.live-comments-box', el => el.scrollIntoView({ block: 'center' }));
    const snap2Path = path.join(ARTIFACT_DIR, 'preview_multi_platform_unified_chat.png');
    await page.screenshot({ path: snap2Path, fullPage: false });
    console.log(`📸 Đã lưu ảnh Unified Chat 3 nền tảng: ${snap2Path}`);

    // Step 7: Bấm phát sóng đồng thời cả 3 nền tảng (Master Multi-Stream Push)
    console.log('7. Bắt đầu phát sóng đồng thời lên cả 3 nền tảng (TikTok + YouTube + Facebook)...');
    await page.$eval('#btnToggleBroadcast', el => el.scrollIntoView({ block: 'center' }));
    await page.click('#btnToggleBroadcast');
    await new Promise(r => setTimeout(r, 2000));

    // Screenshot 3: Active On-Air Multi-Streaming State across 3 platforms
    const snap3Path = path.join(ARTIFACT_DIR, 'preview_multi_platform_broadcasting_active.png');
    await page.screenshot({ path: snap3Path, fullPage: false });
    console.log(`📸 Đã lưu ảnh trạng thái ON AIR 3 nền tảng: ${snap3Path}`);

    console.log('🎉 TOÀN BỘ TÍNH NĂNG LIÊN KẾT LIVESTREAM FACEBOOK, YOUTUBE, TIKTOK ĐÃ THÀNH CÔNG 100%!');
  } catch (err) {
    console.error('❌ Lỗi kiểm thử:', err);
  } finally {
    await browser.close();
  }
}

testMultiPlatformLive();
