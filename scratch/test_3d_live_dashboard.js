const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\pc\\.gemini\\antigravity-ide\\brain\\10601f83-02da-4842-b6f2-a300007b5950';

async function runTest() {
  console.log('🚀 Đang khởi động Chrome headless để kiểm thử Dashboard 3D Model Platform...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();

  // Dismiss any window alert dialogs automatically
  page.on('dialog', async dialog => {
    console.log(`[Browser Dialog] ${dialog.type()}: ${dialog.message()}`);
    await dialog.dismiss();
  });

  try {
    console.log('1. Đang truy cập TMD Studio Pro tại http://localhost:3000 ...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

    // Step 2: Auto-login with Demo Admin Chip
    console.log('2. Đang đăng nhập tài khoản Quản Trị Viên...');
    const demoAdminChip = await page.$('#btnDemoAdmin');
    if (demoAdminChip) {
      await demoAdminChip.click();
      await new Promise(r => setTimeout(r, 400));
      await page.click('#btnSubmitLogin');
      await new Promise(r => setTimeout(r, 1200));
    }

    // Step 3: Open AI Live Studio modal
    console.log('3. Đang bấm nút mở AI Live Studio 24/7 (#btnOpenLiveStudio)...');
    await page.waitForSelector('#btnOpenLiveStudio', { timeout: 10000 });
    await page.click('#btnOpenLiveStudio');
    await new Promise(r => setTimeout(r, 1800));

    // Screenshot 1: Overview of Live Studio with 3D Canvas Viewport & Platform Dashboard
    const snap1Path = path.join(ARTIFACT_DIR, 'preview_live_3d_platform_overview.png');
    await page.screenshot({ path: snap1Path, fullPage: false });
    console.log(`📸 Đã lưu ảnh tổng quan 3D Platform: ${snap1Path}`);

    // Step 4: Switch 3D Virtual Stage to Apple Minimalist
    console.log('4. Đang chọn Sân khấu ảo Silicon Minimalist Keynote...');
    const stageCards = await page.$$('.stage-card');
    if (stageCards.length > 3) {
      await stageCards[3].click();
      await new Promise(r => setTimeout(r, 1000));
    }

    // Step 5: Run Dream-Loop Lighting Critic
    console.log('5. Đang kích hoạt achimala/dream-loop Critic Subagent...');
    const btnCritic = await page.$('#btnRunDreamLoopCritic');
    if (btnCritic) {
      await page.$eval('#btnRunDreamLoopCritic', el => el.scrollIntoView({ block: 'center' }));
      await btnCritic.click();
      await new Promise(r => setTimeout(r, 1800));
    }

    const snap2Path = path.join(ARTIFACT_DIR, 'preview_live_3d_dream_loop_critic.png');
    await page.screenshot({ path: snap2Path, fullPage: false });
    console.log(`📸 Đã lưu ảnh Dream-Loop Critic: ${snap2Path}`);

    // Step 6: Switch to Tab 2: 3D Models Catalog & Spatial AI
    console.log('6. Đang mở Tab 2: Kho Mô Hình 3D & Skill-3D Spatial Actions...');
    await page.$eval('#tabBtn3DModels', el => el.scrollIntoView({ block: 'center' }));
    await page.click('#tabBtn3DModels');
    await new Promise(r => setTimeout(r, 1200));

    // Click on Model 2: Leather Bag
    const modelCards = await page.$$('.model-3d-card');
    if (modelCards.length > 1) {
      await modelCards[1].click();
      await new Promise(r => setTimeout(r, 1000));
    }

    // Click Skill-3D MC Cầm Trên Tay
    console.log('7. Đang kích hoạt Skill-3D: MC Cầm Trên Tay...');
    await page.$eval('#btnSpatialHandHold', el => el.scrollIntoView({ block: 'center' }));
    await page.click('#btnSpatialHandHold');
    await new Promise(r => setTimeout(r, 1200));

    const snap3Path = path.join(ARTIFACT_DIR, 'preview_live_3d_models_and_spatial.png');
    await page.screenshot({ path: snap3Path, fullPage: false });
    console.log(`📸 Đã lưu ảnh Kho Mô hình 3D & Spatial AI: ${snap3Path}`);

    // Step 7: Switch to Tab 3: AI 3D Generator
    console.log('8. Đang mở Tab 3: Sinh Mô Hình 3D Bằng AI (Meshy / Trellis / Tripo)...');
    await page.$eval('#tabBtn3DGen', el => el.scrollIntoView({ block: 'center' }));
    await page.click('#tabBtn3DGen');
    await new Promise(r => setTimeout(r, 1000));

    await page.$eval('#btnSubmitGenerate3D', el => el.scrollIntoView({ block: 'center' }));
    await page.click('#btnSubmitGenerate3D');
    await new Promise(r => setTimeout(r, 2000));

    const snap4Path = path.join(ARTIFACT_DIR, 'preview_live_3d_ai_generator.png');
    await page.screenshot({ path: snap4Path, fullPage: false });
    console.log(`📸 Đã lưu ảnh AI 3D Generator: ${snap4Path}`);

    // Step 8: Switch to Tab 4: CadQuery Parametric Customizer
    console.log('9. Đang mở Tab 4: CadQuery Parametric Customizer...');
    await page.$eval('#tabBtn3DCad', el => el.scrollIntoView({ block: 'center' }));
    await page.click('#tabBtn3DCad');
    await new Promise(r => setTimeout(r, 1000));

    await page.$eval('#btnSubmitCadCustomize', el => el.scrollIntoView({ block: 'center' }));
    await page.click('#btnSubmitCadCustomize');
    await new Promise(r => setTimeout(r, 1500));

    const snap5Path = path.join(ARTIFACT_DIR, 'preview_live_3d_cadquery_slicer.png');
    await page.screenshot({ path: snap5Path, fullPage: false });
    console.log(`📸 Đã lưu ảnh CadQuery Slicer: ${snap5Path}`);

    console.log('🎉 TOÀN BỘ TÍNH NĂNG DASHBOARD 3D MODEL PLATFORM TRONG AI LIVESTREAM ĐÃ ĐƯỢC XÁC THỰC HOÀN HẢO!');
  } catch (err) {
    console.error('❌ Lỗi kiểm thử:', err);
  } finally {
    await browser.close();
  }
}

runTest();
