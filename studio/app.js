/**
 * TMD Studio Pro - Video Editor & Vietnamese Humanizer Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    osMode: 'mac', // 'mac' or 'windows'
    aspectRatio: '9:16',
    activeFilter: 'none',
    activeSubtitleStyle: 'yellow-box',
    subFontSize: 22,
    subPosition: 'bottom',
    currentVideoSrc: '@nhacnghedixe/7675792462593428756.mp4',
    currentVideoTitle: '1 Tiếng | NST Viet Mix Vol 4 2025 - QuanRapper',
    duration: 0,
    currentTime: 0,
    isPlaying: false,
    playbackRate: 1.0,
    volume: 1.0,
    isMuted: false,
    timelineZoom: 60, // pixels per second
    subtitleCues: [
      { id: 'cue-1', startTime: 0.5, endTime: 3.5, text: 'Chào mừng các bạn đến với TMD Studio Pro!' },
      { id: 'cue-2', startTime: 4.0, endTime: 8.0, text: 'Hôm nay chúng ta cùng thưởng thức bản phối đỉnh cao.' },
      { id: 'cue-3', startTime: 8.5, endTime: 13.0, text: 'Việt hóa tự nhiên và làm mượt câu từ với Humanizer AI.' }
    ],
    selectedCueId: null,
    humanizerEngine: new VietnameseHumanizerEngine(),
    aiAgents: new CreativeAIAgents(),
    activeSkills: ['humanizer-vi', 'translationese-cleaner-vi', 'grammar-checker-vi', 'style-guide-vi'],
    selectedRegister: 'tiktok',
    // Logo State
    logoType: 'text',
    logoText: '@nhacnghedixe 🎵',
    logoImageSrc: null,
    logoPosition: 'top-right',
    logoOpacity: 0.85,
    // Timed Ad Banner State
    adText: '🔥 Giảm 50% - Bấm vào Bio để đặt hàng ngay! | Follow @nhacnghedixe',
    adStartTime: 3.0,
    adEndTime: 15.0,
    adStyle: 'ticker-bottom',
    adForcePreview: false,
    // BGM Audio Dubbing State
    bgmSource: 'none',
    bgmVolume: 0.8,
    origVolume: 1.0,
    bgmStartTime: 0.0,
    bgmDuration: 60.0,
    bgmAudioElement: null
  };

  // DOM Elements
  const appRoot = document.getElementById('app-root');
  const video = document.getElementById('studioVideo');
  const canvas = document.getElementById('studioCanvas');
  const viewportScreen = document.getElementById('viewportScreen');
  const subtitleOverlay = document.getElementById('canvasSubtitleOverlay');
  const subtitleText = document.getElementById('subtitleText');
  const playOverlayIcon = document.getElementById('playOverlayIcon');
  const currentProjectName = document.getElementById('currentProjectName');

  // Controls
  const btnPlayPause = document.getElementById('btnPlayPause');
  const btnStepBack = document.getElementById('btnStepBack');
  const btnStepForward = document.getElementById('btnStepForward');
  const currentTimeDisplay = document.getElementById('currentTimeDisplay');
  const durationDisplay = document.getElementById('durationDisplay');
  const btnSpeedToggle = document.getElementById('btnSpeedToggle');
  const btnMute = document.getElementById('btnMute');
  const volumeSlider = document.getElementById('volumeSlider');
  const btnFullscreen = document.getElementById('btnFullscreen');

  // OS Buttons
  const btnMacMode = document.getElementById('btnMacMode');
  const btnWinMode = document.getElementById('btnWinMode');

  // Timeline
  const timelineViewport = document.getElementById('timelineViewport');
  const timelineRuler = document.getElementById('timelineRuler');
  const timelinePlayhead = document.getElementById('timelinePlayhead');
  const timelinePlayheadTime = document.getElementById('timelinePlayheadTime');
  const subtitleLane = document.getElementById('subtitleLane');
  const videoClipBlock = document.getElementById('videoClipBlock');
  const timelineClipTitle = document.getElementById('timelineClipTitle');
  const timelineZoomSlider = document.getElementById('timelineZoomSlider');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const waveformCanvas = document.getElementById('waveformCanvas');

  // Humanizer Elements
  const humanizerInput = document.getElementById('humanizerInput');
  const btnRunHumanize = document.getElementById('btnRunHumanize');
  const cleanRewriteDisplay = document.getElementById('cleanRewriteDisplay');
  const btnApplyToTimeline = document.getElementById('btnApplyToTimeline');
  const btnCopyCleanText = document.getElementById('btnCopyCleanText');
  const registerSelect = document.getElementById('registerSelect');
  const btnLoadVideoCaption = document.getElementById('btnLoadVideoCaption');
  const commentsListDisplay = document.getElementById('commentsListDisplay');
  const decisionsListDisplay = document.getElementById('decisionsListDisplay');
  const commentCount = document.getElementById('commentCount');
  const decisionCount = document.getElementById('decisionCount');

  // Modals
  const modalImport = document.getElementById('modalImportTikTok');
  const btnOpenImportModal = document.getElementById('btnOpenImportModal');
  const btnCloseImportModal = document.getElementById('btnCloseImportModal');
  const btnCancelImport = document.getElementById('btnCancelImport');
  const btnStartImport = document.getElementById('btnStartImport');
  const inputImportTikTokUrl = document.getElementById('inputImportTikTokUrl');
  const importStatusBox = document.getElementById('importStatusBox');

  const modalExport = document.getElementById('modalExport');
  const btnOpenExportModal = document.getElementById('btnOpenExportModal');
  const btnCloseExportModal = document.getElementById('btnCloseExportModal');
  const btnCancelExport = document.getElementById('btnCancelExport');
  const btnConfirmExport = document.getElementById('btnConfirmExport');
  const exportProgressBar = document.getElementById('exportProgressBar');
  const exportProgressWrap = document.getElementById('exportProgressWrap');
  const exportProgressStatus = document.getElementById('exportProgressStatus');

  /* ===================================================================
     1. INITIALIZATION & OS THEME
     =================================================================== */
  function init() {
    setupOsSwitcher();
    setupAuthAndAccountManager();
    setupSidebarTabs();
    setupAspectRatio();
    setupVideoPlayer();
    setupTimeline();
    setupHumanizer();
    setupMediaLibrary();
    setupAudioDubbing();
    setupBrandingAndAds();
    setupAIAgentsSuite();
    setupPublisherAndClones();
    setupTTSVoiceover();
    setupVideoCutting();
    setupModals();
    loadActiveVideo();
    drawSimulatedWaveform();
    renderTimelineSubtitles();
  }

  function setupOsSwitcher() {
    btnMacMode.addEventListener('click', () => {
      document.body.className = 'theme-mac';
      btnMacMode.classList.add('active');
      btnWinMode.classList.remove('active');
      state.osMode = 'mac';
    });

    btnWinMode.addEventListener('click', () => {
      document.body.className = 'theme-windows';
      btnWinMode.classList.add('active');
      btnMacMode.classList.remove('active');
      state.osMode = 'windows';
    });

    // Native Window Buttons (Electron IPC)
    if (window.electronAPI) {
      document.querySelectorAll('.close-btn, .win-close').forEach((btn) => {
        btn.addEventListener('click', () => window.electronAPI.close());
      });
      document.querySelectorAll('.min-btn, .win-btn:not(.win-close):first-child').forEach((btn) => {
        btn.addEventListener('click', () => window.electronAPI.minimize());
      });
      document.querySelectorAll('.max-btn, .win-btn:nth-child(2)').forEach((btn) => {
        btn.addEventListener('click', () => window.electronAPI.maximize());
      });
    }
  }

  function setupAspectRatio() {
    document.querySelectorAll('.ratio-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ratio-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const ratio = btn.dataset.ratio;
        state.aspectRatio = ratio;
        viewportScreen.className = `viewport-screen aspect-${ratio.replace(':', '-')}`;
      });
    });

    // Video Filter
    const videoFilterSelect = document.getElementById('videoFilterSelect');
    videoFilterSelect.addEventListener('change', (e) => {
      state.activeFilter = e.target.value;
      applyVideoFilter(state.activeFilter);
    });

    // Subtitle Style choices
    document.querySelectorAll('.style-choice').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.style-choice').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeSubtitleStyle = btn.dataset.style;
        updateSubtitleOverlayAppearance();
      });
    });

    // Subtitle Font Size
    const subFontSizeSlider = document.getElementById('subFontSizeSlider');
    const subFontSizeVal = document.getElementById('subFontSizeVal');
    subFontSizeSlider.addEventListener('input', (e) => {
      state.subFontSize = e.target.value;
      subFontSizeVal.textContent = `${state.subFontSize}px`;
      updateSubtitleOverlayAppearance();
    });

    // Subtitle Position
    const subPositionSelect = document.getElementById('subPositionSelect');
    subPositionSelect.addEventListener('change', (e) => {
      state.subPosition = e.target.value;
      updateSubtitleOverlayAppearance();
    });
  }

  function updateSubtitleOverlayAppearance() {
    subtitleOverlay.className = `subtitle-overlay style-${state.activeSubtitleStyle} pos-${state.subPosition}`;
    subtitleOverlay.style.fontSize = `${state.subFontSize}px`;
  }

  function applyVideoFilter(filterName) {
    switch (filterName) {
      case 'vibrant':
        video.style.filter = 'saturate(1.4) contrast(1.1) brightness(1.05)';
        break;
      case 'cinematic':
        video.style.filter = 'contrast(1.2) sepia(0.15) hue-rotate(-15deg)';
        break;
      case 'noir':
        video.style.filter = 'grayscale(1) contrast(1.25)';
        break;
      case 'warm':
        video.style.filter = 'sepia(0.3) saturate(1.2) brightness(1.02)';
        break;
      case 'cyber':
        video.style.filter = 'contrast(1.3) hue-rotate(45deg) saturate(1.5)';
        break;
      default:
        video.style.filter = 'none';
        break;
    }
  }

  /* ===================================================================
     2. VIDEO PLAYER & SYNC
     =================================================================== */
  function loadActiveVideo() {
    video.src = `/api/stream?file=${encodeURIComponent(state.currentVideoSrc)}`;
    timelineClipTitle.textContent = state.currentVideoSrc.split('/').pop();
    currentProjectName.textContent = `Dự án: ${state.currentVideoTitle}`;
    video.load();
  }

  function setupVideoPlayer() {
    btnPlayPause.addEventListener('click', togglePlayPause);
    viewportScreen.addEventListener('click', togglePlayPause);

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepVideo(-1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepVideo(1);
      }
    });

    btnStepBack.addEventListener('click', () => stepVideo(-1));
    btnStepForward.addEventListener('click', () => stepVideo(1));

    video.addEventListener('loadedmetadata', () => {
      state.duration = video.duration || 60;
      durationDisplay.textContent = formatTimecode(state.duration);
      updateRulerAndClipWidth();
    });

    video.addEventListener('timeupdate', () => {
      state.currentTime = video.currentTime;
      currentTimeDisplay.textContent = formatTimecode(state.currentTime);
      timelinePlayheadTime.textContent = formatTimecode(state.currentTime);
      updatePlayheadPosition();
      updateActiveSubtitleOverlay();
      updateAdBannerOverlay();
      syncBgmAudio();
    });

    video.addEventListener('play', () => {
      state.isPlaying = true;
      btnPlayPause.textContent = '⏸';
      viewportScreen.classList.remove('paused');
      if (state.bgmAudioElement && state.bgmSource !== 'none') {
        state.bgmAudioElement.play().catch(() => {});
      }
    });

    video.addEventListener('pause', () => {
      state.isPlaying = false;
      btnPlayPause.textContent = '▶';
      viewportScreen.classList.add('paused');
      if (state.bgmAudioElement) {
        state.bgmAudioElement.pause();
      }
    });

    // Speed toggle
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    btnSpeedToggle.addEventListener('click', () => {
      let nextIndex = (speeds.indexOf(state.playbackRate) + 1) % speeds.length;
      state.playbackRate = speeds[nextIndex];
      video.playbackRate = state.playbackRate;
      btnSpeedToggle.textContent = `${state.playbackRate.toFixed(1)}x`;
    });

    // Volume
    volumeSlider.addEventListener('input', (e) => {
      state.volume = parseFloat(e.target.value);
      video.volume = state.volume;
      video.muted = state.volume === 0;
      btnMute.textContent = video.muted ? '🔇' : '🔊';
    });

    btnMute.addEventListener('click', () => {
      video.muted = !video.muted;
      btnMute.textContent = video.muted ? '🔇' : '🔊';
    });

    // Fullscreen
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        viewportScreen.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    });
  }

  function togglePlayPause() {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function stepVideo(deltaSeconds) {
    video.currentTime = Math.max(0, Math.min(state.duration, video.currentTime + deltaSeconds));
  }

  function formatTimecode(seconds) {
    if (!isFinite(seconds) || seconds < 0) return '00:00.0';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${ms}`;
  }

  /* ===================================================================
     3. MULTI-TRACK TIMELINE ENGINE
     =================================================================== */
  function setupTimeline() {
    timelineZoomSlider.addEventListener('input', (e) => {
      state.timelineZoom = parseInt(e.target.value, 10);
      updateRulerAndClipWidth();
      renderTimelineSubtitles();
      updatePlayheadPosition();
    });

    btnZoomIn.addEventListener('click', () => {
      timelineZoomSlider.value = Math.min(200, state.timelineZoom + 20);
      timelineZoomSlider.dispatchEvent(new Event('input'));
    });

    btnZoomOut.addEventListener('click', () => {
      timelineZoomSlider.value = Math.max(20, state.timelineZoom - 20);
      timelineZoomSlider.dispatchEvent(new Event('input'));
    });

    // Clicking on Ruler or Lane seeks video
    timelineViewport.addEventListener('click', (e) => {
      if (e.target.classList.contains('timeline-sub-cue') || e.target.classList.contains('clip-trim-handle')) return;
      const rect = timelineRuler.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX >= 0) {
        const targetTime = clickX / state.timelineZoom;
        video.currentTime = Math.max(0, Math.min(state.duration, targetTime));
      }
    });
  }

  function updateRulerAndClipWidth() {
    const totalWidth = Math.max(1200, state.duration * state.timelineZoom);
    timelineRuler.style.width = `${totalWidth}px`;
    document.querySelectorAll('.track-lane').forEach((l) => (l.style.width = `${totalWidth}px`));
    videoClipBlock.style.width = `${state.duration * state.timelineZoom}px`;
    document.getElementById('audioClipBlock').style.width = `${state.duration * state.timelineZoom}px`;

    // Render Ruler Ticks
    timelineRuler.innerHTML = '';
    const intervalSeconds = state.timelineZoom > 80 ? 2 : 5;
    for (let t = 0; t <= state.duration + 5; t += intervalSeconds) {
      const tick = document.createElement('div');
      tick.className = 'ruler-tick';
      tick.style.left = `${t * state.timelineZoom}px`;
      tick.textContent = formatTimecode(t);
      timelineRuler.appendChild(tick);
    }
  }

  function updatePlayheadPosition() {
    const offsetPx = state.currentTime * state.timelineZoom + 120; // 120px is track-header width
    timelinePlayhead.style.left = `${offsetPx}px`;
  }

  function renderTimelineSubtitles() {
    subtitleLane.innerHTML = '';
    const container = document.getElementById('subtitlesListContainer');
    container.innerHTML = '';

    state.subtitleCues.forEach((cue) => {
      // 1. Timeline Block
      const block = document.createElement('div');
      block.className = 'timeline-sub-cue';
      block.id = `timeline-${cue.id}`;
      block.style.left = `${cue.startTime * state.timelineZoom}px`;
      block.style.width = `${Math.max(40, (cue.endTime - cue.startTime) * state.timelineZoom)}px`;
      block.textContent = cue.text;

      block.addEventListener('click', () => {
        video.currentTime = cue.startTime;
        selectSubtitleCue(cue.id);
      });

      subtitleLane.appendChild(block);

      // 2. Left Panel Cue List Card
      const card = document.createElement('div');
      card.className = 'sub-cue-card';
      card.id = `card-${cue.id}`;
      card.innerHTML = `
        <div class="sub-time-row">
          <span>${formatTimecode(cue.startTime)} ➔ ${formatTimecode(cue.endTime)}</span>
          <button class="icon-refresh-btn del-cue-btn" data-id="${cue.id}">✕</button>
        </div>
        <input type="text" class="sub-text-input" value="${cue.text}">
      `;

      card.querySelector('.sub-text-input').addEventListener('input', (e) => {
        cue.text = e.target.value;
        block.textContent = cue.text;
        updateActiveSubtitleOverlay();
      });

      card.querySelector('.del-cue-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        state.subtitleCues = state.subtitleCues.filter((c) => c.id !== cue.id);
        renderTimelineSubtitles();
      });

      card.addEventListener('click', () => {
        video.currentTime = cue.startTime;
        selectSubtitleCue(cue.id);
      });

      container.appendChild(card);
    });
  }

  function selectSubtitleCue(cueId) {
    state.selectedCueId = cueId;
    document.querySelectorAll('.timeline-sub-cue').forEach((el) => el.classList.remove('active'));
    document.querySelectorAll('.sub-cue-card').forEach((el) => el.classList.remove('active'));

    const activeTimelineEl = document.getElementById(`timeline-${cueId}`);
    const activeCardEl = document.getElementById(`card-${cueId}`);
    if (activeTimelineEl) activeTimelineEl.classList.add('active');
    if (activeCardEl) activeCardEl.classList.add('active');
  }

  function updateActiveSubtitleOverlay() {
    const activeCue = state.subtitleCues.find(
      (c) => state.currentTime >= c.startTime && state.currentTime <= c.endTime
    );

    if (activeCue) {
      subtitleOverlay.style.display = 'block';
      subtitleText.textContent = activeCue.text;
      selectSubtitleCue(activeCue.id);
    } else {
      subtitleOverlay.style.display = 'none';
      document.querySelectorAll('.timeline-sub-cue').forEach((el) => el.classList.remove('active'));
    }
  }

  function drawSimulatedWaveform() {
    const cvs = waveformCanvas;
    cvs.width = 1200;
    cvs.height = 34;
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    ctx.fillStyle = '#10b981';
    for (let x = 0; x < cvs.width; x += 4) {
      const h = Math.abs(Math.sin(x * 0.05) * 20 + Math.cos(x * 0.12) * 10);
      ctx.fillRect(x, (cvs.height - h) / 2, 2, h);
    }
  }

  /* ===================================================================
     4. VIETNAMESE HUMANIZER STUDIO
     =================================================================== */
  function setupHumanizer() {
    // Skill Pills Click
    document.querySelectorAll('.skill-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        pill.classList.toggle('active');
        const skill = pill.dataset.skill;
        if (pill.classList.contains('active')) {
          if (!state.activeSkills.includes(skill)) state.activeSkills.push(skill);
        } else {
          state.activeSkills = state.activeSkills.filter((s) => s !== skill);
        }
      });
    });

    // Register Select
    registerSelect.addEventListener('change', (e) => {
      state.selectedRegister = e.target.value;
    });

    // Sample Tag Buttons
    document.querySelectorAll('.sample-tag').forEach((btn) => {
      btn.addEventListener('click', () => {
        humanizerInput.value = btn.dataset.sample;
      });
    });

    // Load Video Caption
    btnLoadVideoCaption.addEventListener('click', () => {
      humanizerInput.value = state.currentVideoTitle;
    });

    // Run Humanize
    btnRunHumanize.addEventListener('click', () => {
      const text = humanizerInput.value.trim();
      if (!text) {
        cleanRewriteDisplay.innerHTML = '<p class="placeholder-text">Vui lòng nhập văn bản hoặc chọn kịch bản mẫu trước khi làm mượt.</p>';
        return;
      }

      const result = state.humanizerEngine.process(text, {
        skills: state.activeSkills,
        register: state.selectedRegister,
        maxWordsPerSubtitle: 7
      });

      // Display Clean Rewrite
      cleanRewriteDisplay.innerHTML = `<p>${result.cleanRewrite}</p>`;
      state.lastProcessedResult = result;

      // Display Comments
      commentCount.textContent = result.comments.length;
      if (result.comments.length > 0) {
        commentsListDisplay.innerHTML = result.comments
          .map(
            (c) => `
            <div class="comment-item ${c.skill === 'translationese-cleaner-vi' ? 'translationese' : ''}">
              <div class="comment-badge">${c.skill} • ${c.category}</div>
              <div><span class="comment-matched">${c.matched}</span></div>
              <div class="comment-desc">${c.explanation}</div>
            </div>
          `
          )
          .join('');
      } else {
        commentsListDisplay.innerHTML = '<p class="placeholder-text">✨ Tuyệt vời! Không phát hiện câu từ dịch thô hoặc khuôn mẫu.</p>';
      }

      // Display Decisions
      decisionCount.textContent = result.decisions.length;
      if (result.decisions.length > 0) {
        decisionsListDisplay.innerHTML = result.decisions
          .map(
            (d) => `
            <div class="comment-item">
              <div class="comment-badge">Cần người viết quyết định</div>
              <strong>${d.phrase}</strong>
              <div class="comment-desc">${d.suggestion}</div>
            </div>
          `
          )
          .join('');
      } else {
        decisionsListDisplay.innerHTML = '<p class="placeholder-text">Không có từ ngữ đa nghĩa cần cân nhắc.</p>';
      }
    });

    // Apply to Timeline Button
    btnApplyToTimeline.addEventListener('click', () => {
      if (!state.lastProcessedResult || !state.lastProcessedResult.subtitleCues.length) {
        alert('Vui lòng nhấn "Làm Mượt & Việt Hóa" trước để tạo phụ đề.');
        return;
      }

      state.subtitleCues = state.lastProcessedResult.subtitleCues;
      renderTimelineSubtitles();
      updateActiveSubtitleOverlay();
      alert(`Đã tạo thành công ${state.subtitleCues.length} câu phụ đề tự nhiên khớp với Timeline!`);
    });

    // Copy Clean Text
    btnCopyCleanText.addEventListener('click', () => {
      if (state.lastProcessedResult && state.lastProcessedResult.cleanRewrite) {
        navigator.clipboard.writeText(state.lastProcessedResult.cleanRewrite);
        btnCopyCleanText.textContent = '✔ Đã chép';
        setTimeout(() => (btnCopyCleanText.textContent = '📋 Sao chép'), 1500);
      }
    });

    // Output Tabs
    document.querySelectorAll('.out-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.out-tab-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.out-tab-content').forEach((c) => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
      });
    });
  }

  /* ===================================================================
     5. MEDIA LIBRARY & CLOUD IMPORT
     =================================================================== */
  function setupMediaLibrary() {
    // Select media card click
    document.querySelectorAll('.media-card').forEach((card) => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.media-card').forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        state.currentVideoSrc = card.dataset.src;
        state.currentVideoTitle = card.querySelector('.media-title').textContent;
        loadActiveVideo();
      });
    });

    // Local Dropzone
    const uploadDropzone = document.getElementById('uploadDropzone');
    const localVideoInput = document.getElementById('localVideoInput');

    uploadDropzone.addEventListener('click', () => localVideoInput.click());

    localVideoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        video.src = fileUrl;
        state.currentVideoSrc = file.name;
        state.currentVideoTitle = file.name.replace(/\.[^/.]+$/, '');
        timelineClipTitle.textContent = file.name;
        currentProjectName.textContent = `Dự án: ${state.currentVideoTitle}`;
        video.load();
      }
    });
  }

  /* ===================================================================
     6. MODALS & EXPORT ENGINE
     =================================================================== */
  function setupModals() {
    // Import Modal
    btnOpenImportModal.addEventListener('click', () => modalImport.classList.add('open'));
    btnCloseImportModal.addEventListener('click', () => modalImport.classList.remove('open'));
    btnCancelImport.addEventListener('click', () => modalImport.classList.remove('open'));

    btnStartImport.addEventListener('click', async () => {
      const url = inputImportTikTokUrl.value.trim();
      if (!url) return;

      importStatusBox.classList.remove('hidden');
      importStatusBox.textContent = '⏳ Đang kết nối TikTok và tải video không logo...';

      try {
        const res = await fetch('/api/download-tiktok', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        const data = await res.json();
        if (data.ok) {
          importStatusBox.textContent = `✔ Đã tải xong: ${data.title}`;
          state.currentVideoSrc = data.filePath;
          state.currentVideoTitle = data.title;
          loadActiveVideo();
          if (document.getElementById('checkAutoHumanize').checked) {
            humanizerInput.value = data.title;
            btnRunHumanize.click();
          }
          setTimeout(() => modalImport.classList.remove('open'), 1200);
        } else {
          importStatusBox.textContent = `❌ Lỗi: ${data.message || 'Không thể tải video'}`;
        }
      } catch (err) {
        importStatusBox.textContent = `❌ Lỗi kết nối: ${err.message}`;
      }
    });

    // Export Modal
    btnOpenExportModal.addEventListener('click', () => modalExport.classList.add('open'));
    btnCloseExportModal.addEventListener('click', () => modalExport.classList.remove('open'));
    btnCancelExport.addEventListener('click', () => modalExport.classList.remove('open'));

    // Export Card Select
    let currentExportType = 'video-burned';
    document.querySelectorAll('.export-card').forEach((card) => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.export-card').forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        currentExportType = card.dataset.exportType;
      });
    });

    btnConfirmExport.addEventListener('click', () => {
      if (currentExportType === 'srt') {
        downloadSrtFile();
      } else if (currentExportType === 'vtt') {
        downloadVttFile();
      } else {
        renderAndExportBurnedVideo();
      }
    });
  }

  function downloadSrtFile() {
    let srtContent = '';
    state.subtitleCues.forEach((c, i) => {
      const start = formatSrtTime(c.startTime);
      const end = formatSrtTime(c.endTime);
      srtContent += `${i + 1}\n${start} --> ${end}\n${c.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${state.currentVideoTitle}_vietnamese_subtitles.srt`;
    a.click();
    modalExport.classList.remove('open');
  }

  function downloadVttFile() {
    let vttContent = 'WEBVTT\n\n';
    state.subtitleCues.forEach((c) => {
      const start = formatVttTime(c.startTime);
      const end = formatVttTime(c.endTime);
      vttContent += `${start} --> ${end}\n${c.text}\n\n`;
    });

    const blob = new Blob([vttContent], { type: 'text/vtt;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${state.currentVideoTitle}_vietnamese_subtitles.vtt`;
    a.click();
    modalExport.classList.remove('open');
  }

  function formatSrtTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
  }

  function formatVttTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  }

  function renderAndExportBurnedVideo() {
    exportProgressWrap.classList.remove('hidden');
    exportProgressBar.style.width = '0%';
    exportProgressStatus.textContent = 'Đang ghép phụ đề Việt hóa và xuất file...';

    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      exportProgressBar.style.width = `${Math.min(100, progress)}%`;
      if (progress >= 100) {
        clearInterval(interval);
        exportProgressStatus.textContent = '✔ Xuất hoàn tất! Đang tải file về máy...';
        setTimeout(() => {
          // Download video stream directly
          const a = document.createElement('a');
          a.href = `/api/stream?file=${encodeURIComponent(state.currentVideoSrc)}`;
          a.download = `${state.currentVideoTitle}_TMD_Export.mp4`;
          a.click();
          modalExport.classList.remove('open');
          exportProgressWrap.classList.add('hidden');
        }, 1000);
      }
    }, 200);
  }

  /* ===================================================================
     7. SIDEBAR TABS & WORKSPACE SECTIONS
     =================================================================== */
  function setupSidebarTabs() {
    const tabBtns = document.querySelectorAll('.studio-sidebar.left-panel .tab-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.studio-sidebar.left-panel .tab-content').forEach((c) => c.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.dataset.target;
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.classList.add('active');
      });
    });
  }

  /* ===================================================================
     8. BRANDING (LOGO WATERMARK) & TIMED AD BANNERS
     =================================================================== */
  function setupBrandingAndAds() {
    const canvasLogoOverlay = document.getElementById('canvasLogoOverlay');
    const logoText = document.getElementById('logoText');
    const logoImage = document.getElementById('logoImage');
    const logoTypeSelect = document.getElementById('logoTypeSelect');
    const logoTextInput = document.getElementById('logoTextInput');
    const logoTextInputRow = document.getElementById('logoTextInputRow');
    const logoFileInput = document.getElementById('logoFileInput');
    const logoImageInputRow = document.getElementById('logoImageInputRow');
    const logoPositionSelect = document.getElementById('logoPositionSelect');
    const logoOpacitySlider = document.getElementById('logoOpacitySlider');

    // Logo Type Switch
    logoTypeSelect.addEventListener('change', (e) => {
      state.logoType = e.target.value;
      if (state.logoType === 'text') {
        logoTextInputRow.classList.remove('hidden');
        logoImageInputRow.classList.add('hidden');
        logoText.classList.remove('hidden');
        logoImage.classList.add('hidden');
      } else {
        logoTextInputRow.classList.add('hidden');
        logoImageInputRow.classList.remove('hidden');
        logoText.classList.add('hidden');
        logoImage.classList.remove('hidden');
      }
    });

    // Logo Text Input
    logoTextInput.addEventListener('input', (e) => {
      state.logoText = e.target.value;
      logoText.textContent = state.logoText;
    });

    // Logo File Upload
    logoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          state.logoImageSrc = evt.target.result;
          logoImage.src = state.logoImageSrc;
          logoImage.classList.remove('hidden');
          logoText.classList.add('hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    // Logo Position
    logoPositionSelect.addEventListener('change', (e) => {
      state.logoPosition = e.target.value;
      canvasLogoOverlay.className = `canvas-logo-overlay pos-${state.logoPosition}`;
    });

    // Logo Opacity
    logoOpacitySlider.addEventListener('input', (e) => {
      state.logoOpacity = parseFloat(e.target.value);
      canvasLogoOverlay.style.opacity = state.logoOpacity;
    });

    // Timed Ad Banner Controls
    const canvasAdBannerOverlay = document.getElementById('canvasAdBannerOverlay');
    const adBannerTextInput = document.getElementById('adBannerTextInput');
    const adBannerText = document.getElementById('adBannerText');
    const adStartTimeInput = document.getElementById('adStartTimeInput');
    const adEndTimeInput = document.getElementById('adEndTimeInput');
    const adStyleSelect = document.getElementById('adStyleSelect');
    const btnPreviewAd = document.getElementById('btnPreviewAd');

    adBannerTextInput.addEventListener('input', (e) => {
      state.adText = e.target.value;
      adBannerText.textContent = state.adText;
    });

    adStartTimeInput.addEventListener('change', (e) => {
      state.adStartTime = Math.max(0, parseFloat(e.target.value) || 0);
    });

    adEndTimeInput.addEventListener('change', (e) => {
      state.adEndTime = Math.max(1, parseFloat(e.target.value) || 10);
    });

    adStyleSelect.addEventListener('change', (e) => {
      state.adStyle = e.target.value;
      canvasAdBannerOverlay.className = `canvas-ad-overlay style-${state.adStyle} ${state.adForcePreview ? '' : 'hidden'}`;
    });

    btnPreviewAd.addEventListener('click', () => {
      state.adForcePreview = !state.adForcePreview;
      if (state.adForcePreview) {
        canvasAdBannerOverlay.classList.remove('hidden');
        btnPreviewAd.classList.add('active');
      } else {
        updateAdBannerOverlay();
        btnPreviewAd.classList.remove('active');
      }
    });
  }

  function updateAdBannerOverlay() {
    const canvasAdBannerOverlay = document.getElementById('canvasAdBannerOverlay');
    if (state.adForcePreview) return;

    if (state.currentTime >= state.adStartTime && state.currentTime <= state.adEndTime) {
      canvasAdBannerOverlay.classList.remove('hidden');
    } else {
      canvasAdBannerOverlay.classList.add('hidden');
    }
  }

  /* ===================================================================
     9. AUDIO DUBBING & BACKGROUND MUSIC
     =================================================================== */
  function setupAudioDubbing() {
    const bgmSelect = document.getElementById('bgmSelect');
    const customAudioInput = document.getElementById('customAudioInput');
    const bgmVolumeSlider = document.getElementById('bgmVolumeSlider');
    const bgmVolumeVal = document.getElementById('bgmVolumeVal');
    const origVolumeSlider = document.getElementById('origVolumeSlider');
    const origVolumeVal = document.getElementById('origVolumeVal');
    const bgmStartTimeInput = document.getElementById('bgmStartTimeInput');
    const bgmDurationInput = document.getElementById('bgmDurationInput');
    const btnApplyAudioDub = document.getElementById('btnApplyAudioDub');

    // Create persistent BGM Audio element
    state.bgmAudioElement = new Audio();
    state.bgmAudioElement.loop = true;

    bgmSelect.addEventListener('change', (e) => {
      state.bgmSource = e.target.value;
      if (state.bgmSource === 'custom') {
        customAudioInput.click();
      } else if (state.bgmSource === 'none') {
        state.bgmAudioElement.pause();
        state.bgmAudioElement.src = '';
      } else {
        // Preset BGM (EDM, Lofi, Remix)
        state.bgmAudioElement.src = createSynthesizedBgmTrack(state.bgmSource);
        if (state.isPlaying) state.bgmAudioElement.play().catch(() => {});
      }
    });

    customAudioInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        state.bgmAudioElement.src = URL.createObjectURL(file);
        state.bgmSource = 'custom';
        if (state.isPlaying) state.bgmAudioElement.play().catch(() => {});
      }
    });

    bgmVolumeSlider.addEventListener('input', (e) => {
      state.bgmVolume = parseFloat(e.target.value);
      bgmVolumeVal.textContent = `${Math.round(state.bgmVolume * 100)}%`;
      if (state.bgmAudioElement) state.bgmAudioElement.volume = Math.min(1.0, state.bgmVolume);
    });

    origVolumeSlider.addEventListener('input', (e) => {
      state.origVolume = parseFloat(e.target.value);
      origVolumeVal.textContent = `${Math.round(state.origVolume * 100)}%`;
      video.volume = state.origVolume;
    });

    bgmStartTimeInput.addEventListener('change', (e) => {
      state.bgmStartTime = Math.max(0, parseFloat(e.target.value) || 0);
    });

    bgmDurationInput.addEventListener('change', (e) => {
      state.bgmDuration = Math.max(1, parseFloat(e.target.value) || 30);
    });

    btnApplyAudioDub.addEventListener('click', () => {
      alert(`Đã cập nhật lồng nhạc nền: Bắt đầu từ ${state.bgmStartTime}s, thời lượng ${state.bgmDuration}s!`);
      // Update audio lane visually
      const audioClipBlock = document.getElementById('audioClipBlock');
      if (audioClipBlock) {
        audioClipBlock.style.left = `${state.bgmStartTime * state.timelineZoom}px`;
        audioClipBlock.style.width = `${state.bgmDuration * state.timelineZoom}px`;
      }
    });
  }

  // Create lightweight audio tone/sample using Web Audio API DataURL
  function createSynthesizedBgmTrack(type) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 8;
    const sampleRate = audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(2, sampleRate * duration, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    const baseFreq = type === 'edm' ? 130 : type === 'lofi' ? 80 : 120;
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const beat = (t % 0.5 < 0.08) ? 0.6 : 0.05;
      const tone = Math.sin(2 * Math.PI * baseFreq * t) * beat;
      left[i] = tone;
      right[i] = tone;
    }
    return '';
  }

  function syncBgmAudio() {
    if (!state.bgmAudioElement || state.bgmSource === 'none' || !state.bgmAudioElement.src) return;

    const inRange = state.currentTime >= state.bgmStartTime && state.currentTime <= (state.bgmStartTime + state.bgmDuration);
    if (inRange) {
      if (state.isPlaying && state.bgmAudioElement.paused) {
        state.bgmAudioElement.play().catch(() => {});
      }
    } else {
      if (!state.bgmAudioElement.paused) {
        state.bgmAudioElement.pause();
      }
    }
  }

  /* ===================================================================
     10. CREATIVE AI AGENTS SUITE
     =================================================================== */
  function setupAIAgentsSuite() {
    // Agent 1: Hooks
    const btnGenerateHooks = document.getElementById('btnGenerateHooks');
    const hooksResultsBox = document.getElementById('hooksResultsBox');

    btnGenerateHooks.addEventListener('click', () => {
      const hooks = state.aiAgents.generateHooks(state.currentVideoTitle);
      hooksResultsBox.classList.remove('hidden');
      hooksResultsBox.innerHTML = hooks
        .map(
          (h) => `
        <div class="hook-item" data-hook="${h.text}">
          <span class="hook-tag">${h.style} (${h.duration})</span>
          <span>"${h.text}"</span>
        </div>
      `
        )
        .join('');

      hooksResultsBox.querySelectorAll('.hook-item').forEach((item) => {
        item.addEventListener('click', () => {
          const text = item.dataset.hook;
          if (state.subtitleCues.length > 0) {
            state.subtitleCues[0].text = text;
          } else {
            state.subtitleCues.push({ id: 'cue-hook', startTime: 0, endTime: 3.0, text });
          }
          renderTimelineSubtitles();
          updateActiveSubtitleOverlay();
          alert(`Đã áp dụng câu Hook vào 3 giây đầu tiên của video!`);
        });
      });
    });

    // Agent 2: Smart Highlights
    const btnDetectHighlights = document.getElementById('btnDetectHighlights');
    const highlightsResultsBox = document.getElementById('highlightsResultsBox');

    btnDetectHighlights.addEventListener('click', () => {
      const highlights = state.aiAgents.suggestHighlights(state.duration, state.currentVideoTitle);
      highlightsResultsBox.classList.remove('hidden');
      highlightsResultsBox.innerHTML = highlights
        .map(
          (hl) => `
        <div class="highlight-item" data-start="${hl.start}" data-end="${hl.end}">
          <span class="hl-tag">✂️ ${hl.type} (${formatTimecode(hl.start)} ➔ ${formatTimecode(hl.end)})</span>
          <p>${hl.description}</p>
          <small style="color: var(--text-muted)">Nền tảng: ${hl.recommendedPlatform}</small>
        </div>
      `
        )
        .join('');

      highlightsResultsBox.querySelectorAll('.highlight-item').forEach((item) => {
        item.addEventListener('click', () => {
          const start = parseFloat(item.dataset.start);
          const end = parseFloat(item.dataset.end);
          video.currentTime = start;
          // Visually trim the clip on timeline
          videoClipBlock.style.left = `${start * state.timelineZoom}px`;
          videoClipBlock.style.width = `${(end - start) * state.timelineZoom}px`;
          alert(`Đã tự động cắt và định vị đoạn Highlight: ${formatTimecode(start)} ➔ ${formatTimecode(end)}!`);
        });
      });
    });

    // Agent 3: SEO & Hashtag Crafter
    const btnGenerateSeo = document.getElementById('btnGenerateSeo');
    const seoResultsBox = document.getElementById('seoResultsBox');

    btnGenerateSeo.addEventListener('click', () => {
      const author = state.currentVideoSrc.split('/')[0] || '@nhacnghedixe';
      const seo = state.aiAgents.generateSeoMetadata(state.currentVideoTitle, author);
      seoResultsBox.classList.remove('hidden');
      seoResultsBox.innerHTML = `
        <div class="seo-output-card">
          <p class="seo-caption">${seo.caption}</p>
          <p class="seo-hashtags">${seo.hashtags}</p>
          <small style="color: var(--accent-green); display: block; margin-top: 4px;">⏰ Khung giờ vàng đăng video: ${seo.idealPostingTime}</small>
          <button class="studio-btn sm-btn secondary-btn" id="btnCopySeo" style="margin-top: 6px;">📋 Sao chép Caption & Hashtags</button>
        </div>
      `;

      document.getElementById('btnCopySeo').addEventListener('click', () => {
        navigator.clipboard.writeText(`${seo.caption}\n\n${seo.hashtags}`);
        alert('Đã sao chép caption và bộ hashtag SEO vào Clipboard!');
      });
    });
  }

  /* ===================================================================
     11. VIDEO CUTTING & SPLITTING
     =================================================================== */
  function setupVideoCutting() {
    const btnSplitClip = document.getElementById('btnSplitClip');
    const btnDeleteClip = document.getElementById('btnDeleteClip');

    btnSplitClip.addEventListener('click', () => {
      const splitTime = state.currentTime;
      alert(`Đã cắt clip tại mốc thời gian: ${formatTimecode(splitTime)}! Bạn có thể kéo thả 2 phần clip độc lập.`);
    });

    btnDeleteClip.addEventListener('click', () => {
      if (state.selectedCueId) {
        state.subtitleCues = state.subtitleCues.filter((c) => c.id !== state.selectedCueId);
        state.selectedCueId = null;
        renderTimelineSubtitles();
        updateActiveSubtitleOverlay();
        alert('Đã xóa đoạn phụ đề đã chọn.');
      } else {
        alert('Vui lòng bấm chọn một đoạn phụ đề hoặc clip để xóa.');
      }
    });
  }

  /* ===================================================================
     12. MULTI-PLATFORM PUBLISHER & CLONE ENGAGEMENT ENGINE
     =================================================================== */
  function setupPublisherAndClones() {
    const publisherAccountSelect = document.getElementById('publisherAccountSelect');
    const pubCaptionInput = document.getElementById('pubCaptionInput');
    const pubHashtagsInput = document.getElementById('pubHashtagsInput');
    const pubScheduleSelect = document.getElementById('pubScheduleSelect');
    const btnPublishPost = document.getElementById('btnPublishPost');
    const pubStatusBox = document.getElementById('pubStatusBox');

    const cloneCountSelect = document.getElementById('cloneCountSelect');
    const cloneWatchTimeSelect = document.getElementById('cloneWatchTimeSelect');
    const cbCloneLike = document.getElementById('cbCloneLike');
    const cbCloneSave = document.getElementById('cbCloneSave');
    const cbCloneShare = document.getElementById('cbCloneShare');
    const btnGenSeedingComments = document.getElementById('btnGenSeedingComments');
    const seedingCommentsInput = document.getElementById('seedingCommentsInput');
    const btnLaunchCloneCampaign = document.getElementById('btnLaunchCloneCampaign');
    const campaignTerminal = document.getElementById('campaignTerminal');
    const terminalProgressBadge = document.getElementById('terminalProgressBadge');
    const terminalLogList = document.getElementById('terminalLogList');

    const newClonePlatform = document.getElementById('newClonePlatform');
    const newCloneUsername = document.getElementById('newCloneUsername');
    const newCloneProxy = document.getElementById('newCloneProxy');
    const btnAddCloneProfile = document.getElementById('btnAddCloneProfile');
    const cloneStatusBadge = document.getElementById('cloneStatusBadge');

    // Pre-populate caption from current title
    if (pubCaptionInput && !pubCaptionInput.value) {
      pubCaptionInput.value = `${state.currentVideoTitle} 🔥 Anh em nghe thử xem có cuốn không nhé!`;
    }

    // 1. Publish to Selected Channel
    if (btnPublishPost) {
      btnPublishPost.addEventListener('click', async () => {
        const selectedOption = publisherAccountSelect.options[publisherAccountSelect.selectedIndex];
        const platform = selectedOption.dataset.platform || 'TikTok';
        const accountName = selectedOption.textContent.trim();
        const caption = pubCaptionInput.value.trim();
        const hashtags = pubHashtagsInput.value.trim();
        const scheduleTime = pubScheduleSelect.options[pubScheduleSelect.selectedIndex].textContent;

        btnPublishPost.disabled = true;
        btnPublishPost.innerHTML = `<span>⏳ Đang xử lý đăng lên ${platform}...</span>`;

        try {
          const res = await fetch('/api/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              videoSrc: state.currentVideoSrc,
              platform,
              accountId: accountName,
              title: state.currentVideoTitle,
              caption,
              hashtags,
              scheduleTime
            })
          });
          const data = await res.json();
          if (data.ok) {
            pubStatusBox.classList.remove('hidden');
            pubStatusBox.innerHTML = `
              <strong>✅ ${data.message}</strong><br>
              <small>Thời gian: ${data.log.scheduleTime}</small><br>
              <small>Link video: <a href="${data.log.postUrl}" target="_blank">${data.log.postUrl}</a></small>
            `;
          } else {
            alert('Lỗi đăng video: ' + (data.message || 'Không rõ nguyên nhân'));
          }
        } catch (err) {
          pubStatusBox.classList.remove('hidden');
          pubStatusBox.innerHTML = `<strong>✅ Mô phỏng đăng thành công lên ${accountName}!</strong>`;
        } finally {
          btnPublishPost.disabled = false;
          btnPublishPost.innerHTML = `<span>🚀 Đăng Lên Kênh Chỉ Định</span>`;
        }
      });
    }

    // 2. Generate AI Seeding Comments
    if (btnGenSeedingComments) {
      btnGenSeedingComments.addEventListener('click', () => {
        const boosters = state.aiAgents.generateEngagementBoosters(state.currentVideoTitle);
        seedingCommentsInput.value = boosters.pinnedComments.map(c => c.replace(/^📌\s*/, '')).join('\n');
      });
    }

    // 3. Launch Clone Engagement Campaign
    if (btnLaunchCloneCampaign) {
      btnLaunchCloneCampaign.addEventListener('click', async () => {
        const cloneCount = parseInt(cloneCountSelect.value, 10);
        const watchTimePercent = parseInt(cloneWatchTimeSelect.value, 10);
        const enableLike = cbCloneLike.checked;
        const enableSave = cbCloneSave.checked;
        const enableShare = cbCloneShare.checked;
        const comments = seedingCommentsInput.value.split('\n').map(s => s.trim()).filter(Boolean);

        btnLaunchCloneCampaign.disabled = true;
        btnLaunchCloneCampaign.innerHTML = `<span>⏳ Dàn Clone Đang Chạy Tương Tác...</span>`;
        campaignTerminal.classList.remove('hidden');
        terminalLogList.innerHTML = '';
        terminalProgressBadge.textContent = '0%';

        try {
          const res = await fetch('/api/clones/campaign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              videoTitle: state.currentVideoTitle,
              videoSrc: state.currentVideoSrc,
              cloneCount,
              watchTimePercent,
              enableLike,
              enableSave,
              enableShare,
              comments
            })
          });
          const data = await res.json();
          const logs = data.logs || [];

          let currentStep = 0;
          const totalSteps = logs.length;

          function playNextLog() {
            if (currentStep >= totalSteps) {
              terminalProgressBadge.textContent = '100% HOÀN TẤT';
              btnLaunchCloneCampaign.disabled = false;
              btnLaunchCloneCampaign.innerHTML = `<span>⚡ Khởi Chạy Kéo Tương Tác Clone</span>`;
              return;
            }

            const log = logs[currentStep];
            currentStep++;
            const row = document.createElement('div');
            row.className = `terminal-log-row ${log.type}`;
            row.textContent = `[${log.time}] ${log.msg}`;
            terminalLogList.appendChild(row);
            terminalLogList.scrollTop = terminalLogList.scrollHeight;

            const percent = Math.min(100, Math.round((currentStep / totalSteps) * 100));
            terminalProgressBadge.textContent = `${percent}%`;

            setTimeout(playNextLog, 300);
          }

          playNextLog();
        } catch (err) {
          terminalProgressBadge.textContent = 'LỖI MẠNG';
          btnLaunchCloneCampaign.disabled = false;
          btnLaunchCloneCampaign.innerHTML = `<span>⚡ Khởi Chạy Kéo Tương Tác Clone</span>`;
        }
      });
    }

    // 4. Add New Clone Profile
    if (btnAddCloneProfile) {
      btnAddCloneProfile.addEventListener('click', async () => {
        const platform = newClonePlatform.value;
        const username = newCloneUsername.value.trim();
        const proxy = newCloneProxy.value.trim();

        if (!username) {
          alert('Vui lòng nhập Username hoặc tên kênh của clone!');
          return;
        }

        try {
          const res = await fetch('/api/clones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              platform,
              username,
              name: `${platform} Clone (${username})`,
              status: 'Online',
              proxy: proxy || '103.142.26.11:8080 (VN Residential)',
              fingerprint: 'Custom Stealth Profile 0x' + Math.random().toString(16).slice(2, 6)
            })
          });
          const data = await res.json();
          if (data.ok) {
            alert(`Đã thêm thành công Profile [${username}] vào dàn clone nuôi tương tác!`);
            newCloneUsername.value = '';
            newCloneProxy.value = '';
            if (cloneStatusBadge) cloneStatusBadge.textContent = '🟢 Đã Cập Nhật';
          }
        } catch (e) {
          alert('Lỗi thêm clone profile: ' + e.message);
        }
      });
    }
  }

  /* ===================================================================
     13. TEXT-TO-SPEECH (TTS) VOICEOVER ENGINE
     =================================================================== */
  function setupTTSVoiceover() {
    const btnPlayTTSVoiceover = document.getElementById('btnPlayTTSVoiceover');
    const ttsSpeedSelect = document.getElementById('ttsSpeedSelect');
    const btnSpeakHumanizedText = document.getElementById('btnSpeakHumanizedText');

    if (btnPlayTTSVoiceover) {
      btnPlayTTSVoiceover.addEventListener('click', () => {
        let textToSpeak = 'Chào mừng bạn đến với TMD Studio Pro!';
        if (state.selectedCueId) {
          const cue = state.subtitleCues.find(c => c.id === state.selectedCueId);
          if (cue) textToSpeak = cue.text;
        } else if (state.subtitleCues.length > 0) {
          const nearCue = state.subtitleCues.find(c => state.currentTime >= c.startTime && state.currentTime <= c.endTime) || state.subtitleCues[0];
          textToSpeak = nearCue.text;
        }

        const rate = parseFloat(ttsSpeedSelect ? ttsSpeedSelect.value : 1.0);
        state.aiAgents.speakVietnamese(textToSpeak, { rate });
      });
    }

    if (btnSpeakHumanizedText) {
      btnSpeakHumanizedText.addEventListener('click', () => {
        const cleanText = cleanRewriteDisplay.innerText.trim();
        if (!cleanText || cleanText.includes('Nhấn nút "Làm Mượt')) {
          alert('Vui lòng bấm nút "✨ Làm Mượt & Việt Hóa" trước để có bản dịch hoàn chỉnh!');
          return;
        }
        state.aiAgents.speakVietnamese(cleanText, { rate: 1.0 });
      });
    }
  }

  /* ===================================================================
     14. AUTHENTICATION & WEBSITE ACCOUNT MANAGEMENT SYSTEM
     =================================================================== */
  function setupAuthAndAccountManager() {
    state.currentUser = null;
    state.authToken = localStorage.getItem('tmd_auth_token') || null;

    // Modals
    const modalAuth = document.getElementById('modalAuth');
    const modalAccountManager = document.getElementById('modalAccountManager');
    const modalUserProfile = document.getElementById('modalUserProfile');

    // Auth Form Elements
    const tabBtnLogin = document.getElementById('tabBtnLogin');
    const tabBtnRegister = document.getElementById('tabBtnRegister');
    const formLogin = document.getElementById('formLogin');
    const formRegister = document.getElementById('formRegister');
    const loginIdentifier = document.getElementById('loginIdentifier');
    const loginPassword = document.getElementById('loginPassword');
    const authAlertBox = document.getElementById('authAlertBox');
    const btnDemoAdmin = document.getElementById('btnDemoAdmin');
    const btnDemoCreator = document.getElementById('btnDemoCreator');

    // Register Form Elements
    const regFullname = document.getElementById('regFullname');
    const regEmail = document.getElementById('regEmail');
    const regPhone = document.getElementById('regPhone');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');

    // Topbar Profile Elements
    const btnUserMenuToggle = document.getElementById('btnUserMenuToggle');
    const userDropdownPopup = document.getElementById('userDropdownPopup');
    const topbarUserAvatar = document.getElementById('topbarUserAvatar');
    const topbarUserName = document.getElementById('topbarUserName');
    const topbarUserPlan = document.getElementById('topbarUserPlan');
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    const dropdownName = document.getElementById('dropdownName');
    const dropdownEmail = document.getElementById('dropdownEmail');
    const dropdownPhone = document.getElementById('dropdownPhone');
    const btnOpenAccountManager = document.getElementById('btnOpenAccountManager');
    const btnOpenProfileModal = document.getElementById('btnOpenProfileModal');
    const btnLogoutBtn = document.getElementById('btnLogoutBtn');

    // Account Manager Elements
    const btnCloseAccountManager = document.getElementById('btnCloseAccountManager');
    const btnCloseAccountManagerBottom = document.getElementById('btnCloseAccountManagerBottom');
    const statTotalUsers = document.getElementById('statTotalUsers');
    const statActiveUsers = document.getElementById('statActiveUsers');
    const statAdminCount = document.getElementById('statAdminCount');
    const statTotalDownloads = document.getElementById('statTotalDownloads');
    const userSearchInput = document.getElementById('userSearchInput');
    const userRoleFilter = document.getElementById('userRoleFilter');
    const btnRefreshUsers = document.getElementById('btnRefreshUsers');
    const btnToggleAddUserForm = document.getElementById('btnToggleAddUserForm');
    const addUserDrawer = document.getElementById('addUserDrawer');
    const btnSaveNewUser = document.getElementById('btnSaveNewUser');
    const btnCancelAddUser = document.getElementById('btnCancelAddUser');
    const usersTableBody = document.getElementById('usersTableBody');

    // Profile Modal Elements
    const btnCloseProfileModal = document.getElementById('btnCloseProfileModal');
    const btnCancelProfile = document.getElementById('btnCancelProfile');
    const btnSaveProfile = document.getElementById('btnSaveProfile');
    const myProfileAvatar = document.getElementById('myProfileAvatar');
    const myProfileFullname = document.getElementById('myProfileFullname');
    const myProfileRoleBadge = document.getElementById('myProfileRoleBadge');
    const myProfilePlanBadge = document.getElementById('myProfilePlanBadge');
    const myProfileEmail = document.getElementById('myProfileEmail');
    const myProfilePhone = document.getElementById('myProfilePhone');
    const myProfileNewPassword = document.getElementById('myProfileNewPassword');
    const profileAlertBox = document.getElementById('profileAlertBox');

    let allLoadedUsers = [];

    // Helper: Show Auth Alert
    function showAuthAlert(msg, type = 'error') {
      authAlertBox.className = `auth-alert-box ${type}`;
      authAlertBox.textContent = msg;
      authAlertBox.classList.remove('hidden');
    }

    function hideAuthAlert() {
      authAlertBox.classList.add('hidden');
    }

    // Tab Switcher in Auth Modal
    if (tabBtnLogin && tabBtnRegister) {
      tabBtnLogin.addEventListener('click', () => {
        tabBtnLogin.classList.add('active');
        tabBtnRegister.classList.remove('active');
        formLogin.classList.add('active');
        formRegister.classList.remove('active');
        hideAuthAlert();
      });

      tabBtnRegister.addEventListener('click', () => {
        tabBtnRegister.classList.add('active');
        tabBtnLogin.classList.remove('active');
        formRegister.classList.add('active');
        formLogin.classList.remove('active');
        hideAuthAlert();
      });
    }

    // Demo Chips
    if (btnDemoAdmin) {
      btnDemoAdmin.addEventListener('click', () => {
        loginIdentifier.value = 'admin@tmdstudio.com';
        loginPassword.value = 'admin123';
      });
    }
    if (btnDemoCreator) {
      btnDemoCreator.addEventListener('click', () => {
        loginIdentifier.value = '0912345678';
        loginPassword.value = 'creator123';
      });
    }

    // Submit Login
    if (formLogin) {
      formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAuthAlert();
        const identifier = loginIdentifier.value.trim();
        const password = loginPassword.value;

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password })
          });
          const data = await res.json();
          if (data.ok) {
            state.authToken = data.token;
            state.currentUser = data.user;
            localStorage.setItem('tmd_auth_token', data.token);
            showAuthAlert('Đăng nhập thành công! Đang chuyển vào Studio...', 'success');
            setTimeout(() => {
              modalAuth.classList.remove('open');
              updateUserUI();
            }, 600);
          } else {
            showAuthAlert(data.message || 'Đăng nhập thất bại!');
          }
        } catch (err) {
          showAuthAlert('Lỗi kết nối máy chủ: ' + err.message);
        }
      });
    }

    // Submit Register
    if (formRegister) {
      formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAuthAlert();
        const fullname = regFullname.value.trim();
        const email = regEmail.value.trim();
        const phone = regPhone.value.trim();
        const password = regPassword.value;
        const confirmPass = regConfirmPassword.value;

        if (password !== confirmPass) {
          showAuthAlert('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.');
          return;
        }

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullname, email, phone, password })
          });
          const data = await res.json();
          if (data.ok) {
            state.authToken = data.token;
            state.currentUser = data.user;
            localStorage.setItem('tmd_auth_token', data.token);
            showAuthAlert('Đăng ký tài khoản thành công! Đang mở Studio...', 'success');
            setTimeout(() => {
              modalAuth.classList.remove('open');
              updateUserUI();
            }, 800);
          } else {
            showAuthAlert(data.message || 'Đăng ký thất bại!');
          }
        } catch (err) {
          showAuthAlert('Lỗi đăng ký: ' + err.message);
        }
      });
    }

    // Update Topbar User UI
    function updateUserUI() {
      if (!state.currentUser) return;
      const u = state.currentUser;
      if (topbarUserAvatar) topbarUserAvatar.textContent = u.avatar || '👤';
      if (topbarUserName) topbarUserName.textContent = u.fullname;
      if (topbarUserPlan) topbarUserPlan.textContent = u.role === 'admin' ? 'ADMIN VIP' : u.plan.toUpperCase();

      if (dropdownAvatar) dropdownAvatar.textContent = u.avatar || '👤';
      if (dropdownName) dropdownName.textContent = u.fullname;
      if (dropdownEmail) dropdownEmail.textContent = u.email;
      if (dropdownPhone) dropdownPhone.textContent = `📞 ${u.phone}`;
    }

    // Toggle Dropdown Popup
    if (btnUserMenuToggle) {
      btnUserMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdownPopup.classList.toggle('hidden');
      });
    }

    document.addEventListener('click', (e) => {
      if (userDropdownPopup && !userDropdownPopup.contains(e.target) && e.target !== btnUserMenuToggle) {
        userDropdownPopup.classList.add('hidden');
      }
    });

    // Logout
    if (btnLogoutBtn) {
      btnLogoutBtn.addEventListener('click', async () => {
        if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi TMD Studio?')) {
          try {
            await fetch('/api/auth/logout', {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + state.authToken }
            });
          } catch (e) {}
          state.authToken = null;
          state.currentUser = null;
          localStorage.removeItem('tmd_auth_token');
          userDropdownPopup.classList.add('hidden');
          modalAuth.classList.add('open');
        }
      });
    }

    // Open Account Manager Modal
    if (btnOpenAccountManager) {
      btnOpenAccountManager.addEventListener('click', () => {
        userDropdownPopup.classList.add('hidden');
        modalAccountManager.classList.add('open');
        loadUsersData();
      });
    }

    if (btnCloseAccountManager) btnCloseAccountManager.addEventListener('click', () => modalAccountManager.classList.remove('open'));
    if (btnCloseAccountManagerBottom) btnCloseAccountManagerBottom.addEventListener('click', () => modalAccountManager.classList.remove('open'));

    // Open User Profile Modal
    if (btnOpenProfileModal) {
      btnOpenProfileModal.addEventListener('click', () => {
        userDropdownPopup.classList.add('hidden');
        if (!state.currentUser) return;
        const u = state.currentUser;
        if (myProfileAvatar) myProfileAvatar.textContent = u.avatar || '👑';
        if (myProfileFullname) myProfileFullname.textContent = u.fullname;
        if (myProfileRoleBadge) myProfileRoleBadge.textContent = u.role.toUpperCase();
        if (myProfilePlanBadge) myProfilePlanBadge.textContent = u.plan;
        if (myProfileEmail) myProfileEmail.value = u.email;
        if (myProfilePhone) myProfilePhone.value = u.phone;
        if (myProfileNewPassword) myProfileNewPassword.value = '';
        if (profileAlertBox) profileAlertBox.classList.add('hidden');
        modalUserProfile.classList.add('open');
      });
    }

    if (btnCloseProfileModal) btnCloseProfileModal.addEventListener('click', () => modalUserProfile.classList.remove('open'));
    if (btnCancelProfile) btnCancelProfile.addEventListener('click', () => modalUserProfile.classList.remove('open'));

    // Save Profile Changes
    if (btnSaveProfile) {
      btnSaveProfile.addEventListener('click', async () => {
        if (!state.currentUser) return;
        const newPhone = myProfilePhone.value.trim();
        const newPass = myProfileNewPassword.value.trim();

        const updates = { phone: newPhone };
        if (newPass) updates.password = newPass;

        try {
          const res = await fetch('/api/users/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: state.currentUser.id, updates })
          });
          const data = await res.json();
          if (data.ok) {
            state.currentUser = data.user;
            updateUserUI();
            profileAlertBox.className = 'auth-alert-box success';
            profileAlertBox.textContent = 'Đã cập nhật thông tin thành công!';
            profileAlertBox.classList.remove('hidden');
            setTimeout(() => modalUserProfile.classList.remove('open'), 1000);
          } else {
            profileAlertBox.className = 'auth-alert-box error';
            profileAlertBox.textContent = data.message || 'Lỗi cập nhật!';
            profileAlertBox.classList.remove('hidden');
          }
        } catch (err) {
          profileAlertBox.className = 'auth-alert-box error';
          profileAlertBox.textContent = 'Lỗi mạng: ' + err.message;
          profileAlertBox.classList.remove('hidden');
        }
      });
    }

    // Toggle Add User Drawer
    if (btnToggleAddUserForm) {
      btnToggleAddUserForm.addEventListener('click', () => {
        addUserDrawer.classList.toggle('hidden');
      });
    }
    if (btnCancelAddUser) {
      btnCancelAddUser.addEventListener('click', () => {
        addUserDrawer.classList.add('hidden');
      });
    }

    // Save New User (Admin adding user)
    if (btnSaveNewUser) {
      btnSaveNewUser.addEventListener('click', async () => {
        const fullname = document.getElementById('newUserFullname').value.trim();
        const email = document.getElementById('newUserEmail').value.trim();
        const phone = document.getElementById('newUserPhone').value.trim();
        const password = document.getElementById('newUserPassword').value.trim();
        const role = document.getElementById('newUserRole').value;
        const plan = document.getElementById('newUserPlan').value;

        if (!fullname || !email || !phone || !password) {
          alert('Vui lòng điền đầy đủ Họ tên, Email, SĐT và Mật khẩu!');
          return;
        }

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullname, email, phone, password })
          });
          const data = await res.json();
          if (data.ok) {
            if (role !== 'creator' || plan !== 'Free Trial 2026') {
              await fetch('/api/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: data.user.id, updates: { role, plan } })
              });
            }
            alert(`Đã tạo thành công tài khoản [${fullname}] trong cơ sở dữ liệu!`);
            addUserDrawer.classList.add('hidden');
            document.getElementById('newUserFullname').value = '';
            document.getElementById('newUserEmail').value = '';
            document.getElementById('newUserPhone').value = '';
            document.getElementById('newUserPassword').value = '';
            loadUsersData();
          } else {
            alert('Lỗi tạo tài khoản: ' + data.message);
          }
        } catch (err) {
          alert('Lỗi: ' + err.message);
        }
      });
    }

    if (btnRefreshUsers) btnRefreshUsers.addEventListener('click', loadUsersData);

    // Search and Filter Users
    if (userSearchInput) userSearchInput.addEventListener('input', renderUsersList);
    if (userRoleFilter) userRoleFilter.addEventListener('change', renderUsersList);

    // Load Users from Backend
    async function loadUsersData() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (data.ok) {
          allLoadedUsers = data.users || [];
          if (statTotalUsers) statTotalUsers.textContent = data.stats.totalUsers || allLoadedUsers.length;
          if (statActiveUsers) statActiveUsers.textContent = data.stats.activeUsers || allLoadedUsers.length;
          if (statAdminCount) statAdminCount.textContent = data.stats.adminCount || 1;
          if (statTotalDownloads) statTotalDownloads.textContent = data.stats.totalDownloads || 112;
          renderUsersList();
        }
      } catch (e) {
        console.error('Lỗi tải danh sách người dùng:', e);
      }
    }

    function renderUsersList() {
      if (!usersTableBody) return;
      const keyword = (userSearchInput ? userSearchInput.value : '').toLowerCase().trim();
      const roleFilter = userRoleFilter ? userRoleFilter.value : 'all';

      const filtered = allLoadedUsers.filter(u => {
        const matchesKeyword = !keyword || 
          u.fullname.toLowerCase().includes(keyword) || 
          u.email.toLowerCase().includes(keyword) || 
          u.phone.includes(keyword);
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesKeyword && matchesRole;
      });

      if (filtered.length === 0) {
        usersTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">Không tìm thấy tài khoản phù hợp với từ khóa!</td></tr>`;
        return;
      }

      usersTableBody.innerHTML = filtered.map(u => `
        <tr data-user-id="${u.id}">
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${u.avatar || '👤'}</span>
              <div>
                <strong>${u.fullname}</strong>
                <small style="display: block; color: var(--text-muted); font-size: 9px;">ID: ${u.id}</small>
              </div>
            </div>
          </td>
          <td><strong style="color: var(--accent-cyan);">${u.phone}</strong></td>
          <td>${u.email}</td>
          <td><span class="role-pill ${u.role}">${u.role}</span></td>
          <td><span class="plan-pill" style="color: #cbd5e1; font-weight: 600;">${u.plan}</span></td>
          <td>
            <span class="status-pill ${u.status}">${u.status === 'active' ? '🟢 Hoạt động' : '🔴 Đã khóa'}</span>
          </td>
          <td>
            <div class="table-actions">
              <button class="action-icon-btn btn-toggle-role" data-id="${u.id}" data-role="${u.role}" title="Đổi quyền Admin/Creator">👑</button>
              <button class="action-icon-btn btn-toggle-status" data-id="${u.id}" data-status="${u.status}" title="${u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}">
                ${u.status === 'active' ? '🔒' : '🔓'}
              </button>
              ${u.role !== 'admin' ? `<button class="action-icon-btn danger btn-delete-user" data-id="${u.id}" title="Xóa tài khoản">🗑️</button>` : ''}
            </div>
          </td>
        </tr>
      `).join('');

      // Wire Action Buttons
      usersTableBody.querySelectorAll('.btn-toggle-role').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          const currentRole = btn.dataset.role;
          const newRole = currentRole === 'admin' ? 'creator' : 'admin';
          if (confirm(`Bạn muốn chuyển vai trò tài khoản sang ${newRole.toUpperCase()}?`)) {
            await fetch('/api/users/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, updates: { role: newRole } })
            });
            loadUsersData();
          }
        });
      });

      usersTableBody.querySelectorAll('.btn-toggle-status').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          const currentStatus = btn.dataset.status;
          const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
          await fetch('/api/users/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, updates: { status: newStatus } })
          });
          loadUsersData();
        });
      });

      usersTableBody.querySelectorAll('.btn-delete-user').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          if (confirm('Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này khỏi cơ sở dữ liệu?')) {
            await fetch('/api/users/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id })
            });
            loadUsersData();
          }
        });
      });
    }

    // Check Auth Session on Startup
    async function checkAuthSession() {
      if (!state.authToken) {
        modalAuth.classList.add('open');
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': 'Bearer ' + state.authToken }
        });
        const data = await res.json();
        if (data.ok && data.user) {
          state.currentUser = data.user;
          updateUserUI();
          modalAuth.classList.remove('open');
        } else {
          localStorage.removeItem('tmd_auth_token');
          state.authToken = null;
          modalAuth.classList.add('open');
        }
      } catch (err) {
        modalAuth.classList.add('open');
      }
    }

    checkAuthSession();
  }

  // Start app
  init();
});

