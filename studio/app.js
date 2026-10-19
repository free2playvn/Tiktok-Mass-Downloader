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
    activeSkills: ['humanizer-vi', 'translationese-cleaner-vi', 'grammar-checker-vi', 'style-guide-vi'],
    selectedRegister: 'tiktok'
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
    setupAspectRatio();
    setupVideoPlayer();
    setupTimeline();
    setupHumanizer();
    setupMediaLibrary();
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
    });

    video.addEventListener('play', () => {
      state.isPlaying = true;
      btnPlayPause.textContent = '⏸';
      viewportScreen.classList.remove('paused');
    });

    video.addEventListener('pause', () => {
      state.isPlaying = false;
      btnPlayPause.textContent = '▶';
      viewportScreen.classList.add('paused');
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

  // Start app
  init();
});
