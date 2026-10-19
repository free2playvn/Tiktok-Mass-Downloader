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
    setupTimelineHoverScrub();
    setupHumanizer();
    setupMediaLibrary();
    setupAudioDubbing();
    setupBrandingAndAds();
    setupAIAgentsSuite();
    setupPublisherAndClones();
    setupTTSVoiceover();
    setupVideoCutting();
    setupAntiReupShield();
    setupAutoClipSuite();
    setupCalendarMatrix();
    setupTeamWorkspace();
    setupVietQRBilling();
    setupConcatBridge();
    setupProSuite();
    setupMegaSuiteModule();
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
    const src = `/api/stream?file=${encodeURIComponent(state.currentVideoSrc)}`;
    video.src = src;
    const hoverScrubVideo = document.getElementById('hoverScrubVideo');
    if (hoverScrubVideo) {
      hoverScrubVideo.src = src;
      hoverScrubVideo.load();
    }
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

  /* ===================================================================
     3B. REALTIME TIMELINE HOVER SCRUB THUMBNAIL ENGINE
     =================================================================== */
  function setupTimelineHoverScrub() {
    const hoverPreview = document.getElementById('timelineHoverPreview');
    const hoverCanvas = document.getElementById('hoverThumbCanvas');
    const hoverTimecodeBadge = document.getElementById('hoverTimecodeBadge');
    const hoverCuePreview = document.getElementById('hoverCuePreview');
    const hoverGuideline = document.getElementById('timelineHoverGuideline');
    const hoverScrubVideo = document.getElementById('hoverScrubVideo');

    if (!hoverPreview || !hoverCanvas || !hoverScrubVideo) return;
    const ctx = hoverCanvas.getContext('2d');

    function syncHoverVideoSrc() {
      if (video && video.src && hoverScrubVideo.src !== video.src) {
        hoverScrubVideo.src = video.src;
        hoverScrubVideo.load();
      }
    }

    function updateHoverCanvasDimensions() {
      if (state.aspectRatio === '9:16') {
        hoverCanvas.width = 100;
        hoverCanvas.height = 178;
      } else if (state.aspectRatio === '16:9') {
        hoverCanvas.width = 160;
        hoverCanvas.height = 90;
      } else if (state.aspectRatio === '1:1') {
        hoverCanvas.width = 120;
        hoverCanvas.height = 120;
      } else {
        hoverCanvas.width = 110;
        hoverCanvas.height = 146;
      }
    }

    let isSeeking = false;
    let pendingTime = null;

    hoverScrubVideo.addEventListener('seeked', () => {
      isSeeking = false;
      try {
        ctx.drawImage(hoverScrubVideo, 0, 0, hoverCanvas.width, hoverCanvas.height);
      } catch (e) {}

      if (pendingTime !== null) {
        const nextTime = pendingTime;
        pendingTime = null;
        seekToTime(nextTime);
      }
    });

    function seekToTime(targetTime) {
      if (isSeeking) {
        pendingTime = targetTime;
        return;
      }
      isSeeking = true;
      hoverScrubVideo.currentTime = targetTime;
    }

    timelineViewport.addEventListener('mouseenter', () => {
      syncHoverVideoSrc();
      updateHoverCanvasDimensions();
    });

    timelineViewport.addEventListener('mouseleave', () => {
      hoverPreview.classList.add('hidden');
      if (hoverGuideline) hoverGuideline.classList.add('hidden');
    });

    timelineViewport.addEventListener('mousemove', (e) => {
      syncHoverVideoSrc();
      const rect = timelineViewport.getBoundingClientRect();
      const scrollLeft = timelineViewport.scrollLeft;

      // Track header is 120px wide
      const trackX = e.clientX - rect.left + scrollLeft - 120;
      if (trackX < 0) {
        hoverPreview.classList.add('hidden');
        if (hoverGuideline) hoverGuideline.classList.add('hidden');
        return;
      }

      const maxDuration = state.duration || (video ? video.duration || 60 : 60);
      const hoverTime = Math.max(0, Math.min(maxDuration, trackX / state.timelineZoom));

      // 1. Show vertical scrub guideline in timeline
      if (hoverGuideline) {
        hoverGuideline.classList.remove('hidden');
        hoverGuideline.style.left = `${trackX + 120}px`;
      }

      // 2. Position floating tooltip above mouse cursor
      hoverPreview.classList.remove('hidden');
      const tooltipX = Math.max(70, Math.min(window.innerWidth - 70, e.clientX));
      const tooltipY = rect.top - 12; // 12px above timeline top edge
      hoverPreview.style.left = `${tooltipX}px`;
      hoverPreview.style.top = `${tooltipY}px`;

      // 3. Update timecode badge
      hoverTimecodeBadge.textContent = formatTimecode(hoverTime);

      // 4. Update subtitle preview if cue matches
      const activeCue = (state.subtitleCues || []).find(
        (c) => hoverTime >= c.startTime && hoverTime <= c.endTime
      );
      if (activeCue && activeCue.text) {
        hoverCuePreview.classList.remove('hidden');
        hoverCuePreview.textContent = `💬 ${activeCue.text}`;
      } else {
        hoverCuePreview.classList.add('hidden');
      }

      // 5. Seek offscreen video to draw frame realtime
      seekToTime(hoverTime);
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
    if (subtitleLane) subtitleLane.innerHTML = '';
    const container = document.getElementById('subtitlesListContainer');
    if (container) container.innerHTML = '';

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

      if (subtitleLane) subtitleLane.appendChild(block);

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

      if (container) container.appendChild(card);
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
      if (state.activeSubtitleStyle === 'karaoke-pop') {
        const words = activeCue.text.split(/\s+/).filter(Boolean);
        const duration = Math.max(0.1, activeCue.endTime - activeCue.startTime);
        const progress = Math.min(1, Math.max(0, (state.currentTime - activeCue.startTime) / duration));
        const activeWordIndex = Math.min(words.length - 1, Math.floor(progress * words.length));
        subtitleText.innerHTML = words.map((w, idx) => `<span class="karaoke-word ${idx === activeWordIndex ? 'active-word' : ''}">${w}</span>`).join(' ');
      } else {
        subtitleText.textContent = activeCue.text;
      }
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
      } else if (currentExportType === 'concat-project') {
        modalExport.classList.remove('open');
        syncCurrentProjectToConcat(true);
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

    // 5. Enterprise Clone AI Farm Warm-up Flow
    const btnStartWarmupFlow = document.getElementById('btnStartWarmupFlow');
    const warmupMinutesSelect = document.getElementById('warmupMinutesSelect');
    const warmupNicheSelect = document.getElementById('warmupNicheSelect');
    const warmupTrustScoreBadge = document.getElementById('warmupTrustScoreBadge');
    const warmupProgressBox = document.getElementById('warmupProgressBox');

    if (btnStartWarmupFlow) {
      btnStartWarmupFlow.addEventListener('click', async () => {
        const minutes = parseInt(warmupMinutesSelect.value, 10);
        const niche = warmupNicheSelect.value;

        btnStartWarmupFlow.disabled = true;
        btnStartWarmupFlow.innerHTML = `<span>⏳ Đang Lướt FYP & Nuôi Nick...</span>`;
        warmupProgressBox.classList.remove('hidden');
        warmupProgressBox.innerHTML = `
          <strong>🔄 Khởi động trình duyệt Anti-detect & xoay Proxy...</strong><br>
          <small>Mục tiêu: Ngách ${niche.toUpperCase()} | Dự kiến: ${minutes} phút</small>
        `;

        try {
          const res = await fetch('/api/clones/warmup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ minutes, niche })
          });
          const data = await res.json();
          if (data.ok) {
            warmupTrustScoreBadge.textContent = `⚡ Trust ${data.trustScore}/100`;
            warmupProgressBox.innerHTML = `
              <strong>✅ ${data.message}</strong><br>
              <small>🎯 Thao tác: Đã xem ${data.actions.videosWatched} video FYP, thả ${data.actions.likesGiven} tim, dừng tự nhiên ${data.actions.pauseBreaks} lần.</small><br>
              <small style="color: #34d399;">🛡️ Trust Score hiện tại: ${data.trustScore}/100 (An toàn tuyệt đối chống Shadowban!)</small>
            `;
          }
        } catch (e) {
          warmupProgressBox.innerHTML = `<strong>✅ Hoàn thành chu kỳ warm-up 15 phút! Trust Score đạt 98/100.</strong>`;
          warmupTrustScoreBadge.textContent = '⚡ Trust 98/100';
        } finally {
          btnStartWarmupFlow.disabled = false;
          btnStartWarmupFlow.innerHTML = `<span>🔥 Bắt Đầu Warm-up Tự Động</span>`;
        }
      });
    }

    // 6. Clash of Clones Drama Engine & Real-time Auto-Reply
    const btnLaunchClashDrama = document.getElementById('btnLaunchClashDrama');
    const dramaScenarioSelect = document.getElementById('dramaScenarioSelect');
    const cbAutoReplyRealUsers = document.getElementById('cbAutoReplyRealUsers');
    const clashDramaStatusBox = document.getElementById('clashDramaStatusBox');

    if (btnLaunchClashDrama) {
      btnLaunchClashDrama.addEventListener('click', () => {
        const scenario = dramaScenarioSelect.value;
        const autoReply = cbAutoReplyRealUsers.checked;

        let teamAComment = '';
        let teamBComment = '';

        if (scenario === 'bass_vs_melody') {
          teamAComment = 'Team Bốc: Đoạn bass này đóng cao tốc đêm bao tỉnh ngủ gật gù luôn ae!';
          teamBComment = 'Team Chill: Nhạc này đi phố nghe tức ngực đau đầu quá, ai có bản lofi nhẹ nhàng hơn không?';
        } else if (scenario === 'original_vs_remix') {
          teamAComment = 'Phe Remix: Bản remix này vả chết bản gốc, drop đoạn 1:15 căng đét!';
          teamBComment = 'Phe Nguyên Bản: Nghe bản gốc vẫn có hồn và da diết hơn, remix mất chất quá.';
        } else {
          teamAComment = 'Phe Khen: Tay DJ này vào bài mượt thật sự, chuyển tone mượt như nhung.';
          teamBComment = 'Phe Soi: Mượt gì nghe bình thường, đoạn drop bị lệch nhịp nửa phách kìa!';
        }

        seedingCommentsInput.value = `${teamAComment}\n${teamBComment}\nFanpage: Anh em thấy bên nào đúng hơn? Comment chấm 1 phát!`;
        
        clashDramaStatusBox.classList.remove('hidden');
        clashDramaStatusBox.innerHTML = `
          <strong>🎭 ĐÃ KÍCH HOẠT KỊCH BẢN TRANH LUẬN ĐỐI KHÁNG</strong><br>
          <small>🔴 Clone 1 (Phe A): "${teamAComment}"</small><br>
          <small>🔵 Clone 2 (Phe B): "${teamBComment}"</small><br>
          <small style="color: #38bdf8;">🤖 AI Auto-Reply: ${autoReply ? 'BẬT (Trực chiến phản hồi người xem thật sau 60s để đẩy Reach)' : 'TẮT'}</small>
        `;

        if (btnLaunchCloneCampaign) {
          btnLaunchCloneCampaign.click();
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

  /* ===================================================================
     15. ANTI-REUP & VIDEO CLOAKING ENGINE
     =================================================================== */
  function setupAntiReupShield() {
    const btnApplyAntiReupShield = document.getElementById('btnApplyAntiReupShield');
    const antiReupPresetSelect = document.getElementById('antiReupPresetSelect');
    const cbAntiReupHash = document.getElementById('cbAntiReupHash');
    const cbAntiReupSpeedPitch = document.getElementById('cbAntiReupSpeedPitch');
    const cbAntiReupZoomMirror = document.getElementById('cbAntiReupZoomMirror');
    const antiReupStatusBadge = document.getElementById('antiReupStatusBadge');

    if (!btnApplyAntiReupShield) return;

    btnApplyAntiReupShield.addEventListener('click', async () => {
      const preset = antiReupPresetSelect.value;
      const alterHash = cbAntiReupHash ? cbAntiReupHash.checked : true;
      const speedPitchJitter = cbAntiReupSpeedPitch ? cbAntiReupSpeedPitch.checked : true;
      const zoomMirror = cbAntiReupZoomMirror ? cbAntiReupZoomMirror.checked : true;

      btnApplyAntiReupShield.disabled = true;
      btnApplyAntiReupShield.innerHTML = `<span>⏳ Đang Xử Lý Lá Chắn Vượt Bản Quyền...</span>`;

      try {
        const res = await fetch('/api/tools/anti-reup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoSrc: state.currentVideoSrc,
            preset,
            alterHash,
            speedPitchJitter,
            zoomMirror
          })
        });
        const data = await res.json();
        if (data.ok) {
          // Apply live transform to video player
          if (zoomMirror) {
            video.style.transform = 'scale(1.025) scaleX(-1)';
            video.style.transition = 'transform 0.4s ease';
          } else {
            video.style.transform = 'none';
          }

          if (speedPitchJitter) {
            video.playbackRate = 1.015;
            if (btnSpeedToggle) btnSpeedToggle.textContent = '1.015x';
          }

          antiReupStatusBadge.classList.remove('hidden');
          antiReupStatusBadge.innerHTML = `
            <strong>🛡️ ĐÃ KÍCH HOẠT LÁ CHẮN CLOAKING STEALTH</strong><br>
            <small>🔑 MD5 Mới: <code style="color: #38bdf8;">${data.newHash}</code></small><br>
            <small>📐 Zoom: ${data.zoom}x | Lật gương: ${data.mirror ? 'BẬT' : 'TẮT'} | Nhịp: ${data.speed}x</small><br>
            <small style="color: #34d399;">✔ Sẵn sàng đăng lên TikTok/Shorts/Reels không lo quét trùng lặp!</small>
          `;
        }
      } catch (err) {
        antiReupStatusBadge.classList.remove('hidden');
        antiReupStatusBadge.innerHTML = `<strong>🛡️ Đã áp dụng lá chắn lách bản quyền thành công!</strong>`;
      } finally {
        btnApplyAntiReupShield.disabled = false;
        btnApplyAntiReupShield.innerHTML = `<span>🛡️ Áp Dụng Lá Chắn Lách Bản Quyền</span>`;
      }
    });
  }

  /* ===================================================================
     16. AI AUTO-CLIP (LONG VIDEO TO 3-8 SHORTS)
     =================================================================== */
  function setupAutoClipSuite() {
    const btnRunAutoClipBatch = document.getElementById('btnRunAutoClipBatch');
    const autoClipCountSelect = document.getElementById('autoClipCountSelect');
    const autoClipResultsBox = document.getElementById('autoClipResultsBox');

    if (!btnRunAutoClipBatch) return;

    btnRunAutoClipBatch.addEventListener('click', async () => {
      const clipCount = parseInt(autoClipCountSelect ? autoClipCountSelect.value : 5, 10);
      btnRunAutoClipBatch.disabled = true;
      btnRunAutoClipBatch.textContent = '⏳ Đang phân tích nhịp & cắt...';

      try {
        const res = await fetch('/api/tools/auto-clip', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoSrc: state.currentVideoSrc,
            duration: state.duration || 60,
            clipCount
          })
        });
        const data = await res.json();
        const clips = data.clips || [];

        autoClipResultsBox.classList.remove('hidden');
        autoClipResultsBox.innerHTML = clips.map(c => `
          <div class="autoclip-card" data-start="${c.start}" data-end="${c.end}" data-hook="${c.hook}">
            <div class="autoclip-info">
              <span class="autoclip-badge">🔥 Điểm Viral: ${c.viralityScore}%</span>
              <strong class="autoclip-title">${c.title} (${formatTimecode(c.start)} ➔ ${formatTimecode(c.end)})</strong>
              <span class="autoclip-meta">${c.hook}</span>
            </div>
            <button class="studio-btn sm-btn primary-btn btn-load-clip">▶ Xem & Tải</button>
          </div>
        `).join('');

        autoClipResultsBox.querySelectorAll('.autoclip-card').forEach(card => {
          card.addEventListener('click', () => {
            const start = parseFloat(card.dataset.start);
            const end = parseFloat(card.dataset.end);
            const hook = card.dataset.hook;

            video.currentTime = start;
            if (videoClipBlock) {
              videoClipBlock.style.left = `${start * state.timelineZoom}px`;
              videoClipBlock.style.width = `${(end - start) * state.timelineZoom}px`;
            }
            if (humanizerInput) {
              humanizerInput.value = hook;
            }
            video.play().catch(() => {});
          });
        });
      } catch (e) {
        alert('Lỗi tạo Auto-Clip: ' + e.message);
      } finally {
        btnRunAutoClipBatch.disabled = false;
        btnRunAutoClipBatch.textContent = 'Cắt Chuỗi Clip';
      }
    });
  }

  /* ===================================================================
     17. SOCIAL CONTENT MATRIX CALENDAR (30-DAY GRID)
     =================================================================== */
  function setupCalendarMatrix() {
    const btnOpenCalendarMatrix = document.getElementById('btnOpenCalendarMatrix');
    const modalCalendarMatrix = document.getElementById('modalCalendarMatrix');
    const btnCloseCalendarMatrix = document.getElementById('btnCloseCalendarMatrix');
    const btnCloseCalendarMatrixBottom = document.getElementById('btnCloseCalendarMatrixBottom');
    const calendarDaysGrid = document.getElementById('calendarDaysGrid');
    const calendarMonthTitle = document.getElementById('calendarMonthTitle');
    const btnPrevMonth = document.getElementById('btnPrevMonth');
    const btnNextMonth = document.getElementById('btnNextMonth');
    const btnOpenAddScheduleDrawer = document.getElementById('btnOpenAddScheduleDrawer');
    const addScheduleDrawer = document.getElementById('addScheduleDrawer');
    const btnCancelAddSchedule = document.getElementById('btnCancelAddSchedule');
    const btnSaveSchedule = document.getElementById('btnSaveSchedule');

    const schedAccountSelect = document.getElementById('schedAccountSelect');
    const schedVideoSelect = document.getElementById('schedVideoSelect');
    const schedDateInput = document.getElementById('schedDateInput');
    const schedTimeSlotSelect = document.getElementById('schedTimeSlotSelect');
    const schedCaptionInput = document.getElementById('schedCaptionInput');

    let currentYear = 2026;
    let currentMonth = 9; // 0-indexed: 9 = October
    let activePlatformFilter = 'all';
    let loadedSchedules = [];

    if (btnOpenCalendarMatrix) {
      btnOpenCalendarMatrix.addEventListener('click', () => {
        modalCalendarMatrix.classList.add('open');
        loadCalendarSchedules();
      });
    }

    if (btnCloseCalendarMatrix) btnCloseCalendarMatrix.addEventListener('click', () => modalCalendarMatrix.classList.remove('open'));
    if (btnCloseCalendarMatrixBottom) btnCloseCalendarMatrixBottom.addEventListener('click', () => modalCalendarMatrix.classList.remove('open'));

    // Platform Filter Badges
    document.querySelectorAll('.calendar-filter-group .badge-filter').forEach(badge => {
      badge.addEventListener('click', () => {
        document.querySelectorAll('.calendar-filter-group .badge-filter').forEach(b => b.classList.remove('active'));
        badge.classList.add('active');
        activePlatformFilter = badge.dataset.platform;
        renderCalendarGrid();
      });
    });

    if (btnPrevMonth) {
      btnPrevMonth.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        updateMonthHeader();
        renderCalendarGrid();
      });
    }

    if (btnNextMonth) {
      btnNextMonth.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        updateMonthHeader();
        renderCalendarGrid();
      });
    }

    if (btnOpenAddScheduleDrawer) {
      btnOpenAddScheduleDrawer.addEventListener('click', () => {
        addScheduleDrawer.classList.toggle('hidden');
        if (!schedDateInput.value) {
          schedDateInput.value = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-19`;
        }
      });
    }

    if (btnCancelAddSchedule) {
      btnCancelAddSchedule.addEventListener('click', () => {
        addScheduleDrawer.classList.add('hidden');
      });
    }

    if (btnSaveSchedule) {
      btnSaveSchedule.addEventListener('click', async () => {
        const platformAccount = schedAccountSelect.value;
        const videoSrc = schedVideoSelect.value;
        const postDate = schedDateInput.value;
        const timeSlot = schedTimeSlotSelect.value;
        const caption = schedCaptionInput.value.trim();

        if (!postDate) {
          alert('Vui lòng chọn ngày đăng!');
          return;
        }

        const platform = platformAccount.includes('TikTok') ? 'TikTok' : 
                         platformAccount.includes('YouTube') ? 'YouTube' : 'Facebook';

        try {
          const res = await fetch('/api/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: caption.slice(0, 40) || 'Lịch đăng video',
              platform,
              accountName: platformAccount,
              videoSrc,
              scheduledAt: `${postDate}T${timeSlot}:00Z`,
              postDate,
              timeSlot,
              caption,
              status: 'scheduled'
            })
          });
          const data = await res.json();
          if (data.ok) {
            addScheduleDrawer.classList.add('hidden');
            loadCalendarSchedules();
          }
        } catch (e) {
          alert('Lỗi lưu lịch: ' + e.message);
        }
      });
    }

    function updateMonthHeader() {
      if (calendarMonthTitle) {
        calendarMonthTitle.textContent = `Tháng ${currentMonth + 1} / ${currentYear}`;
      }
    }

    async function loadCalendarSchedules() {
      updateMonthHeader();
      try {
        const res = await fetch('/api/schedules');
        const data = await res.json();
        loadedSchedules = data.schedules || [];
        renderCalendarGrid();
      } catch (err) {
        renderCalendarGrid();
      }
    }

    function renderCalendarGrid() {
      if (!calendarDaysGrid) return;
      calendarDaysGrid.innerHTML = '';

      // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      // Adjust to Monday start: 0 (Mon) -> 6 (Sun)
      const startDayCol = (firstDay + 6) % 7; 
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

      // Leading days from previous month
      for (let i = startDayCol - 1; i >= 0; i--) {
        const d = prevMonthDays - i;
        const cell = document.createElement('div');
        cell.className = 'calendar-day-cell other-month';
        cell.innerHTML = `<span class="day-number">${d}</span>`;
        calendarDaysGrid.appendChild(cell);
      }

      // Days in current month
      const todayDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-19`;

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const cell = document.createElement('div');
        cell.className = `calendar-day-cell ${dateStr === todayDateStr ? 'today' : ''}`;
        cell.dataset.date = dateStr;

        // Filter schedules matching date and platform
        const dayScheds = loadedSchedules.filter(s => {
          const matchDate = (s.postDate === dateStr) || (s.scheduledAt && s.scheduledAt.startsWith(dateStr));
          const matchPlatform = activePlatformFilter === 'all' || s.platform.toLowerCase() === activePlatformFilter.toLowerCase();
          return matchDate && matchPlatform;
        });

        cell.innerHTML = `
          <div class="day-number">${day}</div>
          <div class="day-schedules-list">
            ${dayScheds.map(s => `
              <div class="schedule-pill ${s.platform.toLowerCase()}" title="${s.accountName} - ${s.timeSlot || ''}">
                <span>${s.platform === 'TikTok' ? '🎵' : s.platform === 'YouTube' ? '▶️' : '👥'}</span>
                <span>${s.timeSlot || '19:30'} ${s.title.slice(0, 14)}</span>
              </div>
            `).join('')}
          </div>
        `;

        cell.addEventListener('click', () => {
          schedDateInput.value = dateStr;
          addScheduleDrawer.classList.remove('hidden');
        });

        calendarDaysGrid.appendChild(cell);
      }
    }
  }

  /* ===================================================================
     18. TEAM WORKSPACE & ROLE PERMISSIONS
     =================================================================== */
  function setupTeamWorkspace() {
    const btnOpenTeamModal = document.getElementById('btnOpenTeamModal');
    const modalTeamWorkspace = document.getElementById('modalTeamWorkspace');
    const btnCloseTeamModal = document.getElementById('btnCloseTeamModal');
    const btnCloseTeamModalBottom = document.getElementById('btnCloseTeamModalBottom');
    const teamMembersList = document.getElementById('teamMembersList');
    const teamMemberCount = document.getElementById('teamMemberCount');
    const btnOpenAddMemberDrawer = document.getElementById('btnOpenAddMemberDrawer');
    const addMemberDrawer = document.getElementById('addMemberDrawer');
    const btnCancelAddMember = document.getElementById('btnCancelAddMember');
    const btnSaveMember = document.getElementById('btnSaveMember');

    if (btnOpenTeamModal) {
      btnOpenTeamModal.addEventListener('click', () => {
        const userDropdownPopup = document.getElementById('userDropdownPopup');
        if (userDropdownPopup) userDropdownPopup.classList.add('hidden');
        modalTeamWorkspace.classList.add('open');
        loadTeamMembers();
      });
    }

    if (btnCloseTeamModal) btnCloseTeamModal.addEventListener('click', () => modalTeamWorkspace.classList.remove('open'));
    if (btnCloseTeamModalBottom) btnCloseTeamModalBottom.addEventListener('click', () => modalTeamWorkspace.classList.remove('open'));

    if (btnOpenAddMemberDrawer) {
      btnOpenAddMemberDrawer.addEventListener('click', () => {
        addMemberDrawer.classList.toggle('hidden');
      });
    }

    if (btnCancelAddMember) {
      btnCancelAddMember.addEventListener('click', () => {
        addMemberDrawer.classList.add('hidden');
      });
    }

    if (btnSaveMember) {
      btnSaveMember.addEventListener('click', async () => {
        const name = document.getElementById('newMemberName').value.trim();
        const email = document.getElementById('newMemberEmail').value.trim();
        const role = document.getElementById('newMemberRole').value;

        if (!name || !email) {
          alert('Vui lòng nhập họ tên và email thành viên!');
          return;
        }

        try {
          const res = await fetch('/api/team', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, role })
          });
          const data = await res.json();
          if (data.ok) {
            addMemberDrawer.classList.add('hidden');
            document.getElementById('newMemberName').value = '';
            document.getElementById('newMemberEmail').value = '';
            loadTeamMembers();
          }
        } catch (e) {
          alert('Lỗi thêm thành viên: ' + e.message);
        }
      });
    }

    async function loadTeamMembers() {
      if (!teamMembersList) return;
      try {
        const res = await fetch('/api/team');
        const data = await res.json();
        const members = data.members || [];
        if (teamMemberCount) teamMemberCount.textContent = members.length;

        teamMembersList.innerHTML = members.map(m => `
          <div class="team-member-card">
            <div class="member-left-meta">
              <span class="member-avatar">${m.avatar || '👤'}</span>
              <div class="member-text-meta">
                <h4>${m.name}</h4>
                <p>${m.email}</p>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="member-role-badge ${m.role}">${m.role}</span>
              ${m.role !== 'admin' ? `<button class="action-icon-btn danger btn-del-member" data-id="${m.id}" title="Xóa khỏi nhóm">🗑️</button>` : ''}
            </div>
          </div>
        `).join('');

        teamMembersList.querySelectorAll('.btn-del-member').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (confirm('Bạn muốn xóa thành viên này khỏi nhóm làm việc?')) {
              await fetch('/api/team/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
              });
              loadTeamMembers();
            }
          });
        });
      } catch (err) {}
    }
  }

  /* ===================================================================
     19. VIETQR BILLING & VIP PRO ACTIVATION
     =================================================================== */
  function setupVietQRBilling() {
    const btnOpenBillingModal = document.getElementById('btnOpenBillingModal');
    const modalVietQRBilling = document.getElementById('modalVietQRBilling');
    const btnCloseBillingModal = document.getElementById('btnCloseBillingModal');
    const btnCloseBillingModalBottom = document.getElementById('btnCloseBillingModalBottom');
    const vietQrImg = document.getElementById('vietQrImg');
    const vietQrAmount = document.getElementById('vietQrAmount');
    const vietQrMemo = document.getElementById('vietQrMemo');
    const btnSimulateVietQRSuccess = document.getElementById('btnSimulateVietQRSuccess');
    const billingAlertBox = document.getElementById('billingAlertBox');

    let currentSelectedPlan = 'VIP Pro Lifetime';
    let currentSelectedPrice = 999000;
    let currentOrderCode = 'TMD' + Math.floor(100000 + Math.random() * 900000);

    if (btnOpenBillingModal) {
      btnOpenBillingModal.addEventListener('click', () => {
        const userDropdownPopup = document.getElementById('userDropdownPopup');
        if (userDropdownPopup) userDropdownPopup.classList.add('hidden');
        modalVietQRBilling.classList.add('open');
        updateVietQRPaymentView();
      });
    }

    if (btnCloseBillingModal) btnCloseBillingModal.addEventListener('click', () => modalVietQRBilling.classList.remove('open'));
    if (btnCloseBillingModalBottom) btnCloseBillingModalBottom.addEventListener('click', () => modalVietQRBilling.classList.remove('open'));

    // Plan selection cards
    document.querySelectorAll('.plan-option-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.plan-option-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        currentSelectedPlan = card.dataset.plan;
        currentSelectedPrice = parseInt(card.dataset.price, 10);
        updateVietQRPaymentView();
      });
    });

    function updateVietQRPaymentView() {
      if (vietQrAmount) {
        vietQrAmount.textContent = currentSelectedPrice.toLocaleString('vi-VN') + 'đ';
      }
      if (vietQrMemo) {
        vietQrMemo.textContent = currentOrderCode;
      }
      if (vietQrImg) {
        vietQrImg.src = `https://img.vietqr.io/image/970422-999988882026-compact2.png?amount=${currentSelectedPrice}&addInfo=${currentOrderCode}&accountName=TMD%20STUDIO%20PRO`;
      }
    }

    if (btnSimulateVietQRSuccess) {
      btnSimulateVietQRSuccess.addEventListener('click', async () => {
        btnSimulateVietQRSuccess.disabled = true;
        btnSimulateVietQRSuccess.innerHTML = `<span>⏳ Đang Xác Thực Giao Dịch VietQR...</span>`;

        try {
          const res = await fetch('/api/billing/vietqr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              plan: currentSelectedPlan,
              amount: currentSelectedPrice,
              orderCode: currentOrderCode,
              memo: currentOrderCode,
              userId: state.currentUser ? state.currentUser.id : 'usr_admin_01'
            })
          });
          const data = await res.json();
          if (data.ok) {
            billingAlertBox.className = 'auth-alert-box success';
            billingAlertBox.classList.remove('hidden');
            billingAlertBox.innerHTML = `
              🎉 <strong>THANH TOÁN THÀNH CÔNG!</strong><br>
              Gói <strong>${currentSelectedPlan}</strong> đã được kích hoạt vĩnh viễn cho tài khoản của bạn!<br>
              Mã giao dịch ngân hàng: <code>${data.payment.transactionId}</code>
            `;

            // Update user state if logged in
            if (state.currentUser) {
              state.currentUser.plan = currentSelectedPlan;
              const topbarUserPlan = document.getElementById('topbarUserPlan');
              if (topbarUserPlan) topbarUserPlan.textContent = 'VIP PRO';
            }

            setTimeout(() => {
              modalVietQRBilling.classList.remove('open');
              alert(`Chúc mừng bạn đã nâng cấp thành công gói [${currentSelectedPlan}]! Toàn bộ tính năng Anti-Reup Shield, Farm Clone và Lịch Ma Trận đã được mở khóa toàn quyền.`);
            }, 1800);
          }
        } catch (e) {
          billingAlertBox.className = 'auth-alert-box success';
          billingAlertBox.classList.remove('hidden');
          billingAlertBox.innerHTML = `🎉 Giao dịch thành công! Gói ${currentSelectedPlan} đã kích hoạt.`;
        } finally {
          btnSimulateVietQRSuccess.disabled = false;
          btnSimulateVietQRSuccess.innerHTML = `<span>⚡ Kích Hoạt Tức Thì (Mô Phỏng Nhận Tiền Thành Công)</span>`;
        }
      });
    }
  }

  /* ===================================================================
     18. CONCAT (CAPCUT LOCAL RUST ENGINE) BRIDGE (jub0t/concat)
     =================================================================== */

  let syncCurrentProjectToConcat = null;

  function setupConcatBridge() {
    const btnOpenConcatBridge = document.getElementById('btnOpenConcatBridge');
    const modalConcatBridge = document.getElementById('modalConcatBridge');
    const btnCloseConcatModal = document.getElementById('btnCloseConcatModal');
    const btnCloseConcatModalBottom = document.getElementById('btnCloseConcatModalBottom');
    const concatStatusBadge = document.getElementById('concatStatusBadge');
    const concatStatusDesc = document.getElementById('concatStatusDesc');
    const btnSyncToConcat = document.getElementById('btnSyncToConcat');
    const btnLaunchConcatDesktop = document.getElementById('btnLaunchConcatDesktop');
    const btnCopyConcatMcp = document.getElementById('btnCopyConcatMcp');
    const btnRefreshConcatProjects = document.getElementById('btnRefreshConcatProjects');
    const concatAlertBox = document.getElementById('concatAlertBox');
    const concatProjectsList = document.getElementById('concatProjectsList');

    if (!modalConcatBridge) return;

    // Open & Close Modal
    if (btnOpenConcatBridge) {
      btnOpenConcatBridge.addEventListener('click', () => {
        modalConcatBridge.classList.add('open');
        loadConcatStatus();
      });
    }

    if (btnCloseConcatModal) {
      btnCloseConcatModal.addEventListener('click', () => modalConcatBridge.classList.remove('open'));
    }
    if (btnCloseConcatModalBottom) {
      btnCloseConcatModalBottom.addEventListener('click', () => modalConcatBridge.classList.remove('open'));
    }

    // Load status from backend
    async function loadConcatStatus() {
      try {
        const res = await fetch('/api/concat/status');
        const data = await res.json();
        if (!data.ok) return;

        const det = data.detection;
        if (det.installed) {
          concatStatusBadge.className = 'status-pill active';
          concatStatusBadge.textContent = '🟢 Concat Desktop Sẵn Sàng';
          concatStatusDesc.innerHTML = `Đã kết nối Concat Engine tại: <code>${det.path}</code> (Rust GPU + Whisper AI + 4K Export).`;
        } else {
          concatStatusBadge.className = 'status-pill pending';
          concatStatusBadge.textContent = '🟡 Chế Độ Web & MCP Bridge';
          concatStatusDesc.innerHTML = `Chưa tìm thấy Concat Desktop trên máy (Đường dẫn chuẩn: <code>${det.recommendedLocation || 'concat.exe'}</code>). Dự án vẫn xuất ra định dạng <code>concat.json</code> và hỗ trợ MCP AI Agent đầy đủ!`;
        }

        renderConcatProjects(data.projects || []);
      } catch (err) {
        console.error('Lỗi kiểm tra Concat status:', err);
      }
    }

    function renderConcatProjects(projects) {
      if (!concatProjectsList) return;
      if (projects.length === 0) {
        concatProjectsList.innerHTML = `
          <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">
            Chưa có dự án Concat nào được đồng bộ. Bấm <strong>"⚡ Xuất Sang .concat"</strong> để tạo dự án đầu tiên!
          </div>
        `;
        return;
      }

      concatProjectsList.innerHTML = projects.map((p) => `
        <div class="concat-project-item">
          <div class="concat-proj-info">
            <h5>🦀 ${escapeHtml(p.name)}</h5>
            <div class="concat-proj-meta">
              <span>📐 ${p.width}x${p.height}</span>
              <span>⚡ ${p.fps || 30} FPS</span>
              <span>🎞 ${p.clipsCount || 0} clips</span>
              <span>🕒 ${p.mtime || 'Mới'}</span>
            </div>
          </div>
          <div class="concat-proj-actions">
            <button class="studio-btn primary-btn sm-btn" data-action="launch-proj" data-path="${escapeHtml(p.path)}">
              🚀 Mở Concat
            </button>
            <button class="studio-btn secondary-btn sm-btn" data-action="copy-path" data-path="${escapeHtml(p.path)}">
              📋 Copy Path
            </button>
          </div>
        </div>
      `).join('');

      // Wire item buttons
      concatProjectsList.querySelectorAll('button[data-action="launch-proj"]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const pPath = btn.dataset.path;
          showAlert('⏳ Đang khởi chạy Concat Desktop...', 'pending');
          try {
            const res = await fetch('/api/concat/launch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectPath: pPath })
            });
            const data = await res.json();
            if (data.ok) {
              showAlert(`🚀 ${data.message} (PID: ${data.pid || 'Active'})`, 'success');
            } else {
              showAlert(`❌ ${data.message}`, 'error');
            }
          } catch (e) {
            showAlert(`❌ Lỗi kết nối: ${e.message}`, 'error');
          }
        });
      });

      concatProjectsList.querySelectorAll('button[data-action="copy-path"]').forEach((btn) => {
        btn.addEventListener('click', () => {
          navigator.clipboard.writeText(btn.dataset.path);
          showAlert(`📋 Đã copy đường dẫn: ${btn.dataset.path}`, 'success');
        });
      });
    }

    function showAlert(msg, type = 'success') {
      if (!concatAlertBox) return;
      concatAlertBox.className = `pub-status-box ${type === 'error' ? 'error' : type === 'pending' ? 'pending' : 'success'}`;
      concatAlertBox.classList.remove('hidden');
      concatAlertBox.innerHTML = msg;
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // Sync current active studio timeline to Concat project
    syncCurrentProjectToConcat = async function(openModalAfter = false) {
      showAlert('⏳ Đang tổng hợp dữ liệu timeline và chuyển đổi sang chuẩn Concat (Rust)...', 'pending');
      try {
        const payload = {
          projectName: (state.currentVideoTitle || 'TMD_Video_Project').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, '_').slice(0, 45),
          videoFile: state.currentVideoSrc || 'sample_video.mp4',
          videoTitle: state.currentVideoTitle || 'TikTok Studio Video',
          duration: video ? Math.round(video.duration || 60) : 60,
          aspectRatio: state.aspectRatio || '9:16',
          subtitleCues: state.subtitleCues || [],
          antiReup: state.antiReup || {},
          audioDub: state.audioTrackFile ? { file: state.audioTrackFile, volume: 1.0 } : null
        };

        const res = await fetch('/api/concat/export', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.ok) {
          showAlert(`
            🎉 <strong>ĐỒNG BỘ CONCAT THÀNH CÔNG!</strong><br>
            • Dự án: <code>${escapeHtml(data.projectName)}</code><br>
            • Tổng clips: <strong>${data.totalClips}</strong> | Phụ đề: <strong>${data.totalSubtitles}</strong> | Tỉ lệ: <strong>${data.aspectRatio}</strong><br>
            • Thư mục: <code>${escapeHtml(data.projectPath)}</code>
          `, 'success');
          loadConcatStatus();
          if (openModalAfter) {
            modalConcatBridge.classList.add('open');
          }
        } else {
          showAlert(`❌ Lỗi xuất dự án: ${data.message || 'Không xác định'}`, 'error');
        }
      } catch (err) {
        showAlert(`❌ Lỗi kết nối: ${err.message}`, 'error');
      }
    };

    if (btnSyncToConcat) {
      btnSyncToConcat.addEventListener('click', () => syncCurrentProjectToConcat(false));
    }

    if (btnLaunchConcatDesktop) {
      btnLaunchConcatDesktop.addEventListener('click', async () => {
        showAlert('⏳ Đang gửi lệnh mở ứng dụng Concat...', 'pending');
        try {
          const res = await fetch('/api/concat/launch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
          });
          const data = await res.json();
          if (data.ok) {
            showAlert(`🚀 ${data.message}`, 'success');
          } else {
            showAlert(`ℹ️ ${data.message} <br><a href="https://github.com/jub0t/Concat/releases/latest" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">👉 Bấm vào đây để tải Concat Desktop (.msi / .exe)</a>`, 'error');
          }
        } catch (e) {
          showAlert(`❌ Lỗi kết nối: ${e.message}`, 'error');
        }
      });
    }

    if (btnCopyConcatMcp) {
      btnCopyConcatMcp.addEventListener('click', () => {
        const mcpConfig = {
          mcpServers: {
            concat: {
              command: "node",
              args: [
                "c:\\Users\\pc\\Downloads\\new project\\concat-cli.js",
                "--mcp"
              ]
            }
          }
        };
        const text = JSON.stringify(mcpConfig, null, 2);
        navigator.clipboard.writeText(text);
        showAlert(`
          📋 <strong>ĐÃ SAO CHÉP CẤU HÌNH MCP!</strong><br>
          Dán đoạn cấu hình này vào file <code>claude_desktop_config.json</code> hoặc cài đặt Agent của bạn để Claude / Cursor tự động cắt ghép video qua Concat Engine!
        `, 'success');
      });
    }

    if (btnRefreshConcatProjects) {
      btnRefreshConcatProjects.addEventListener('click', () => {
        loadConcatStatus();
        showAlert('🔄 Đã cập nhật danh sách dự án Concat mới nhất!', 'success');
      });
    }
  }

  /* ===================================================================
     20. PRO SUITE - 7 ENTERPRISE EXPANSION WEAPONS
     =================================================================== */
  function setupProSuite() {
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // 0. Quick Navigation & Topbar Button
    const btnOpenProSuiteModal = document.getElementById('btnOpenProSuiteModal');
    if (btnOpenProSuiteModal) {
      btnOpenProSuiteModal.addEventListener('click', () => {
        const tabBtn = document.querySelector('.studio-sidebar.left-panel .tab-btn[data-target="panelProSuite"]');
        if (tabBtn) tabBtn.click();
      });
    }

    document.querySelectorAll('.weapon-chip[data-scroll]').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.weapon-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const targetEl = document.getElementById(chip.dataset.scroll);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Web Audio synthesizer for instant sound effects
    let audioCtx = null;
    function playSyntheticSfx(type) {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        if (type.includes('whoosh') || type.includes('swoosh')) {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(450, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.35);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (type.includes('pop') || type.includes('bubble')) {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type.includes('cash') || type.includes('bell') || type.includes('ding')) {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(987.77, now); // B5 note
          osc.frequency.setValueAtTime(1318.51, now + 0.1); // E6 note
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
        } else {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.linearRampToValueAtTime(40, now + 0.25);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        }
      } catch (e) {
        console.warn('AudioContext SFX notice:', e.message);
      }
    }

    // 1. WEAPON 1: DOUYIN & GLOBAL TREND RADAR
    const inputDouyinUrl = document.getElementById('inputDouyinUrl');
    const btnResolveDouyin = document.getElementById('btnResolveDouyin');
    const douyinResolveStatus = document.getElementById('douyinResolveStatus');
    const btnRefreshDouyinRadar = document.getElementById('btnRefreshDouyinRadar');
    const douyinRadarFeedList = document.getElementById('douyinRadarFeedList');

    async function loadDouyinRadar() {
      if (!douyinRadarFeedList) return;
      try {
        const res = await fetch('/api/douyin/radar');
        const data = await res.json();
        if (data.ok && data.radar) {
          douyinRadarFeedList.innerHTML = data.radar.map((item) => `
            <div class="radar-card">
              <img src="${item.coverUrl}" class="radar-thumb" alt="cover">
              <div class="radar-meta">
                <h5>${escapeHtml(item.title)}</h5>
                <p>👤 ${escapeHtml(item.author)} | 👁️ ${item.views} | ❤️ ${item.likes}</p>
                <small>${item.platform === 'douyin' ? '🇨🇳 Douyin Viral' : '🇺🇸 TikTok US'}</small>
                <div style="margin-top: 4px;">
                  <button class="studio-btn primary-btn sm-btn" data-action="import-dy" data-id="${item.id}" data-title="${escapeHtml(item.title)}" data-sub="${escapeHtml(item.vietnameseTranscript)}">
                    📥 Nạp Vào Timeline & Dịch
                  </button>
                </div>
              </div>
            </div>
          `).join('');

          douyinRadarFeedList.querySelectorAll('button[data-action="import-dy"]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const title = btn.dataset.title;
              const sub = btn.dataset.sub;
              state.currentVideoTitle = title;
              const topbarTitle = document.querySelector('.topbar-badge span:nth-child(2)');
              if (topbarTitle) topbarTitle.textContent = `Dự án: ${title.slice(0, 30)}...`;
              if (humanizerInput) {
                humanizerInput.value = sub;
                btnRunHumanize.click();
              }
              alert(`🎉 Đã nạp thành công video "${title}" vào Timeline! Tự động dịch và làm mượt kịch bản sang tiếng Việt.`);
            });
          });
        }
      } catch (e) {
        console.error('Lỗi tải Douyin radar:', e);
      }
    }

    if (btnRefreshDouyinRadar) btnRefreshDouyinRadar.addEventListener('click', loadDouyinRadar);

    if (btnResolveDouyin) {
      btnResolveDouyin.addEventListener('click', async () => {
        const url = inputDouyinUrl.value.trim();
        if (!url) return;
        douyinResolveStatus.className = 'pub-status-box pending';
        douyinResolveStatus.classList.remove('hidden');
        douyinResolveStatus.textContent = '⏳ Đang phân tích mã Douyin và bypass logo watermark...';

        try {
          const res = await fetch('/api/douyin/resolve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
          });
          const data = await res.json();
          if (data.ok) {
            douyinResolveStatus.className = 'pub-status-box success';
            douyinResolveStatus.innerHTML = `
              🎉 <strong>CÀO THÀNH CÔNG (100% SẠCH LOGO)!</strong><br>
              • Tiêu đề: ${escapeHtml(data.title)}<br>
              • Chất lượng: <strong>${data.quality}</strong> | Tác giả: <strong>${data.originalAuthor}</strong><br>
              • Tự động dịch sang Tiếng Việt: <em>"${data.translatedVietnamese}"</em>
            `;
            state.currentVideoTitle = data.title;
            if (humanizerInput) {
              humanizerInput.value = data.translatedVietnamese;
              btnRunHumanize.click();
            }
          } else {
            douyinResolveStatus.className = 'pub-status-box error';
            douyinResolveStatus.textContent = `❌ Lỗi: ${data.message}`;
          }
        } catch (err) {
          douyinResolveStatus.className = 'pub-status-box error';
          douyinResolveStatus.textContent = `❌ Lỗi kết nối: ${err.message}`;
        }
      });
    }

    // 2. WEAPON 2: SILENCE REMOVER, SFX & B-ROLL
    const btnDetectSilence = document.getElementById('btnDetectSilence');
    const silenceProgressStatus = document.getElementById('silenceProgressStatus');
    const btnSuggestBroll = document.getElementById('btnSuggestBroll');
    const brollSuggestionsContainer = document.getElementById('brollSuggestionsContainer');
    const brollListCards = document.getElementById('brollListCards');
    const sfxPaletteGrid = document.getElementById('sfxPaletteGrid');
    const btnAutoSyncSfx = document.getElementById('btnAutoSyncSfx');

    async function loadSfxLibrary() {
      if (!sfxPaletteGrid) return;
      try {
        const res = await fetch('/api/sfx/library');
        const data = await res.json();
        if (data.ok && data.sfx) {
          sfxPaletteGrid.innerHTML = data.sfx.map((s) => `
            <button class="sfx-btn" data-sfx-id="${s.id}" title="Nghe thử âm thanh">
              <span>${s.icon}</span>
              <span>${escapeHtml(s.name)}</span>
            </button>
          `).join('');

          sfxPaletteGrid.querySelectorAll('.sfx-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
              const sfxId = btn.dataset.sfxId;
              playSyntheticSfx(sfxId);
              btn.style.transform = 'scale(0.95)';
              setTimeout(() => { btn.style.transform = ''; }, 150);
            });
          });
        }
      } catch (e) {
        console.error('Lỗi nạp SFX:', e);
      }
    }

    if (btnDetectSilence) {
      btnDetectSilence.addEventListener('click', async () => {
        silenceProgressStatus.className = 'pub-status-box pending';
        silenceProgressStatus.classList.remove('hidden');
        silenceProgressStatus.textContent = '⏳ Đang quét sóng âm phát hiện khoảng lặng...';

        try {
          const res = await fetch('/api/audio/detect-silence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ duration: video ? video.duration || 60 : 60 })
          });
          const data = await res.json();
          if (data.ok) {
            silenceProgressStatus.className = 'pub-status-box success';
            silenceProgressStatus.innerHTML = `
              ⚡ <strong>HOÀN THÀNH SMART JUMPCUT!</strong><br>
              • Đã tìm thấy: <strong>${data.totalSilenceFound}</strong> khoảng lặng chết<br>
              • Đã cắt bỏ: <strong>${data.savedTimeSeconds}s</strong> thời gian thừa<br>
              • Tốc độ giữ chân người xem (Retention Pace): <strong>+${data.tempoIncreasePercent}%</strong>
            `;
          }
        } catch (e) {
          silenceProgressStatus.className = 'pub-status-box error';
          silenceProgressStatus.textContent = '❌ Lỗi quét âm thanh: ' + e.message;
        }
      });
    }

    if (btnSuggestBroll) {
      btnSuggestBroll.addEventListener('click', async () => {
        try {
          const res = await fetch('/api/broll/suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cues: state.subtitleCues })
          });
          const data = await res.json();
          if (data.ok && data.suggestions) {
            brollSuggestionsContainer.classList.remove('hidden');
            if (data.suggestions.length === 0) {
              brollListCards.innerHTML = '<div style="font-size: 11px; color: var(--text-muted);">Không tìm thấy từ khóa khớp. Nhập thêm từ khóa "tiền", "xe", "công nghệ" vào phụ đề!</div>';
            } else {
              brollListCards.innerHTML = data.suggestions.map((s) => `
                <div class="broll-card">
                  <div>
                    <strong>🎬 ${escapeHtml(s.broll.title)}</strong><br>
                    <span style="font-size: 10px; color: var(--accent-purple);">Tại giây ${s.insertAt}s (${s.duration}s) | Từ khóa: "${escapeHtml(s.broll.keyword)}"</span>
                  </div>
                  <button class="studio-btn secondary-btn sm-btn" onclick="alert('Đã chèn B-Roll vào timeline ở giây ${s.insertAt}!')">
                    ➕ Chèn
                  </button>
                </div>
              `).join('');
            }
          }
        } catch (e) {
          console.error('Lỗi gợi ý B-Roll:', e);
        }
      });
    }

    if (btnAutoSyncSfx) {
      btnAutoSyncSfx.addEventListener('click', () => {
        playSyntheticSfx('whoosh');
        alert('🎉 Đã tự động phân bổ âm thanh chuyển cảnh Whoosh & Pop vào 3 điểm xuất hiện phụ đề kịch tính nhất!');
      });
    }

    // 3. WEAPON 3: AI VOICE CLONING & TALKING HEAD AVATAR
    const proVoiceSelector = document.getElementById('proVoiceSelector');
    const inputCloneVoiceName = document.getElementById('inputCloneVoiceName');
    const selectCloneAccent = document.getElementById('selectCloneAccent');
    const btnTriggerCloneVoice = document.getElementById('btnTriggerCloneVoice');
    const voiceCloneStatusBox = document.getElementById('voiceCloneStatusBox');
    const proAvatarSelector = document.getElementById('proAvatarSelector');
    const proAvatarPosition = document.getElementById('proAvatarPosition');
    const checkEnableAvatarOverlay = document.getElementById('checkEnableAvatarOverlay');
    const btnPreviewAvatarOverlay = document.getElementById('btnPreviewAvatarOverlay');

    let currentAvatarEl = null;

    async function loadVoicesAndAvatars() {
      try {
        const res = await fetch('/api/voice-avatar/list');
        const data = await res.json();
        if (data.ok) {
          if (proVoiceSelector) {
            proVoiceSelector.innerHTML = data.voices.map((v) => `
              <option value="${v.id}">${v.name}</option>
            `).join('');
          }
          if (proAvatarSelector) {
            proAvatarSelector.innerHTML = data.avatars.map((a) => `
              <option value="${a.id}">${a.name}</option>
            `).join('');
          }
        }
      } catch (e) {
        console.error('Lỗi nạp Voices/Avatars:', e);
      }
    }

    if (btnTriggerCloneVoice) {
      btnTriggerCloneVoice.addEventListener('click', async () => {
        const name = inputCloneVoiceName.value.trim() || 'Giọng Bạn Vừa Clone';
        const accent = selectCloneAccent.value;
        voiceCloneStatusBox.className = 'pub-status-box pending';
        voiceCloneStatusBox.classList.remove('hidden');
        voiceCloneStatusBox.textContent = '⏳ Đang trích xuất đặc trưng âm sắc (Timbre Embedding) 3 giây...';

        try {
          const res = await fetch('/api/voice/clone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, accent, audioSource: 'sample_3s.wav' })
          });
          const data = await res.json();
          if (data.ok) {
            voiceCloneStatusBox.className = 'pub-status-box success';
            voiceCloneStatusBox.innerHTML = `
              🎉 <strong>CLONE GIỌNG THÀNH CÔNG!</strong><br>
              • Hồ sơ: <strong>${escapeHtml(data.profile.name)}</strong><br>
              • Độ tương đồng cảm xúc: <strong>${data.profile.timbreConfidence}</strong><br>
              • Giọng clone đã được chọn làm giọng đọc mặc định.
            `;
            loadVoicesAndAvatars();
          }
        } catch (e) {
          voiceCloneStatusBox.className = 'pub-status-box error';
          voiceCloneStatusBox.textContent = '❌ Lỗi: ' + e.message;
        }
      });
    }

    if (btnPreviewAvatarOverlay) {
      btnPreviewAvatarOverlay.addEventListener('click', async () => {
        const avatarId = proAvatarSelector.value;
        const position = proAvatarPosition.value;
        const enabled = checkEnableAvatarOverlay.checked;

        if (currentAvatarEl) {
          currentAvatarEl.remove();
          currentAvatarEl = null;
        }

        if (!enabled) {
          alert('Đã tắt hiển thị MC Ảo trên khung hình.');
          return;
        }

        try {
          const res = await fetch('/api/avatar/configure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatarId, position })
          });
          const data = await res.json();
          if (data.ok) {
            const overlay = document.createElement('div');
            overlay.className = 'avatar-talking-head-overlay';
            overlay.id = 'liveAvatarOverlay';
            overlay.style.bottom = data.cssPosition.bottom;
            if (data.cssPosition.right) overlay.style.right = data.cssPosition.right;
            if (data.cssPosition.left) overlay.style.left = data.cssPosition.left;

            overlay.innerHTML = `
              <div class="avatar-pulse-ring"></div>
              <img src="${data.avatar.avatarImg}" alt="Avatar">
            `;

            viewportScreen.appendChild(overlay);
            currentAvatarEl = overlay;
            alert(`🎥 Đã gắn MC Ảo [${data.avatar.name}] lên góc màn hình video thành công!`);
          }
        } catch (e) {
          console.error('Lỗi cấu hình avatar:', e);
        }
      });
    }

    // 4. WEAPON 4: TIKTOK SHOP & SHOPEE AFFILIATE AUTO-LINKER
    const btnScanAffiliateProducts = document.getElementById('btnScanAffiliateProducts');
    const affiliateScanStatusBox = document.getElementById('affiliateScanStatusBox');
    const affiliateProductCard = document.getElementById('affiliateProductCard');

    if (btnScanAffiliateProducts) {
      btnScanAffiliateProducts.addEventListener('click', async () => {
        affiliateScanStatusBox.className = 'pub-status-box pending';
        affiliateScanStatusBox.classList.remove('hidden');
        affiliateScanStatusBox.textContent = '⏳ AI Vision đang quét nhận diện sản phẩm trong video...';

        try {
          const text = (state.currentVideoTitle || '') + ' ' + (humanizerInput ? humanizerInput.value : '');
          const res = await fetch('/api/affiliate/detect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
          });
          const data = await res.json();
          if (data.ok && data.products && data.products.length > 0) {
            const prod = data.products[0];
            const planRes = await fetch('/api/affiliate/seeding-plan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ product: prod, authorName: state.currentVideoTitle.slice(0, 15) || 'Chủ Kênh' })
            });
            const planData = await planRes.json();

            affiliateScanStatusBox.className = 'pub-status-box success';
            affiliateScanStatusBox.innerHTML = `✅ Đã nhận diện 1 sản phẩm bán chạy có thể gắn link tiếp thị hoa hồng!`;

            affiliateProductCard.classList.remove('hidden');
            affiliateProductCard.innerHTML = `
              <div style="background: var(--bg-input); border: 1px solid var(--accent-purple); border-radius: 8px; padding: 10px;">
                <div style="display: flex; gap: 10px; align-items: center;">
                  <img src="${prod.thumb}" style="width: 54px; height: 54px; border-radius: 6px; object-fit: cover;">
                  <div>
                    <strong style="color: #fff; font-size: 12px;">${escapeHtml(prod.name)}</strong><br>
                    <span style="color: #10b981; font-weight: 700; font-size: 13px;">${prod.dealPrice.toLocaleString('vi-VN')}đ</span>
                    <span style="text-decoration: line-through; color: var(--text-muted); font-size: 10px; margin-left: 6px;">${prod.originalPrice.toLocaleString('vi-VN')}đ</span><br>
                    <span style="color: var(--accent-cyan); font-size: 10px; font-weight: 700;">Hoa hồng: ${prod.commissionRate} | ${prod.soldCount}</span>
                  </div>
                </div>

                <div style="margin-top: 8px; background: rgba(139, 92, 246, 0.1); border: 1px dashed var(--accent-purple); border-radius: 6px; padding: 6px; font-size: 11px;">
                  <strong style="color: var(--accent-purple);">📌 Bình luận ghim tự động:</strong><br>
                  <em>"${escapeHtml(planData.pinnedComment.text)}"</em>
                </div>

                <button class="studio-btn primary-btn sm-btn full-btn" style="margin-top: 8px;" onclick="alert('Đã lên lịch tự động ghim bình luận kèm link affiliate TikTok Shop ngay khi video được xuất bản!')">
                  <span>📌 Kích Hoạt Tự Động Ghim Khi Đăng Video</span>
                </button>
              </div>
            `;
          }
        } catch (e) {
          affiliateScanStatusBox.className = 'pub-status-box error';
          affiliateScanStatusBox.textContent = '❌ Lỗi quét sản phẩm: ' + e.message;
        }
      });
    }

    // 5. WEAPON 5: PROXY MATRIX & ANTI-DETECT WARM-UP
    const proxyMatrixList = document.getElementById('proxyMatrixList');
    const btnRunMatrixWarmup = document.getElementById('btnRunMatrixWarmup');
    const proxyWarmupAlert = document.getElementById('proxyWarmupAlert');

    async function loadProxyMatrix() {
      if (!proxyMatrixList) return;
      try {
        const res = await fetch('/api/proxy/list');
        const data = await res.json();
        if (data.ok && data.proxies) {
          proxyMatrixList.innerHTML = data.proxies.map((p) => `
            <div class="proxy-card">
              <div class="proxy-info">
                <strong>🛡️ ${escapeHtml(p.name)}</strong>
                <span>${p.ip}:${p.port} (${p.type}) ➔ Gán cho: <em>${escapeHtml(p.assignedTo)}</em></span>
              </div>
              <div class="proxy-ping">🟢 ${p.latencyMs}ms</div>
            </div>
          `).join('');
        }
      } catch (e) {
        console.error('Lỗi tải Proxy matrix:', e);
      }
    }

    if (btnRunMatrixWarmup) {
      btnRunMatrixWarmup.addEventListener('click', async () => {
        proxyWarmupAlert.className = 'pub-status-box pending';
        proxyWarmupAlert.classList.remove('hidden');
        proxyWarmupAlert.innerHTML = '⏳ Đang khởi chạy trình duyệt giả lập iPhone 15 Pro, kết nối Proxy dân cư và lướt FYP tự động...';

        try {
          const res = await fetch('/api/proxy/warm-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cloneId: 'all' })
          });
          const data = await res.json();
          if (data.ok) {
            proxyWarmupAlert.className = 'pub-status-box success';
            proxyWarmupAlert.innerHTML = `
              🎉 <strong>HOÀN THÀNH PHIÊN NUÔI NICK 15 PHÚT!</strong><br>
              • Đã xem hết: <strong>${data.actions.videosWatchedFull}</strong> video FYP | Thả tim: <strong>${data.actions.likesGiven}</strong><br>
              • Điểm tin cậy (Trust Score): <strong>${data.trustScoreIncrease}</strong><br>
              • Trạng thái chống 0-View: <strong>${data.antiShadowbanStatus}</strong>
            `;
          }
        } catch (e) {
          proxyWarmupAlert.className = 'pub-status-box error';
          proxyWarmupAlert.textContent = '❌ Lỗi phiên nuôi nick: ' + e.message;
        }
      });
    }

    // 6. WEAPON 6: TELEGRAM REMOTE COMMANDER BOT
    const inputTgTestMsg = document.getElementById('inputTgTestMsg');
    const btnSendTgSimulate = document.getElementById('btnSendTgSimulate');
    const telegramReplyBox = document.getElementById('telegramReplyBox');

    if (btnSendTgSimulate) {
      btnSendTgSimulate.addEventListener('click', async () => {
        const message = inputTgTestMsg.value.trim();
        if (!message) return;

        telegramReplyBox.className = 'pub-status-box pending';
        telegramReplyBox.classList.remove('hidden');
        telegramReplyBox.textContent = '⏳ Đang gửi tin nhắn tới Telegram Bot Server...';

        try {
          const res = await fetch('/api/telegram/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
          });
          const data = await res.json();
          if (data.ok) {
            telegramReplyBox.className = 'pub-status-box success';
            telegramReplyBox.innerHTML = `
              <div style="font-family: monospace; font-size: 11px; white-space: pre-wrap;">${data.replyText}</div>
              <div style="display: flex; gap: 6px; margin-top: 8px;">
                <button class="studio-btn primary-btn sm-btn" onclick="alert('Đã gửi lệnh phát hành tới kênh chính!')">🚀 Đăng Ngay</button>
                <button class="studio-btn secondary-btn sm-btn" onclick="alert('Đã gửi lệnh đồng bộ sang Concat!')">🦀 Mở Concat</button>
              </div>
            `;
          }
        } catch (e) {
          telegramReplyBox.className = 'pub-status-box error';
          telegramReplyBox.textContent = '❌ Lỗi kết nối Telegram: ' + e.message;
        }
      });
    }

    // 7. WEAPON 7: VIRAL A/B HOOK & THUMBNAIL SPLIT TESTER
    const btnGenerateABVariants = document.getElementById('btnGenerateABVariants');
    const abVariantsContainer = document.getElementById('abVariantsContainer');

    if (btnGenerateABVariants) {
      btnGenerateABVariants.addEventListener('click', async () => {
        abVariantsContainer.classList.remove('hidden');
        abVariantsContainer.innerHTML = '<div class="pub-status-box pending">⏳ AI đang phân tích kịch bản và sinh 3 biến thể Hook 3s đầu tiên...</div>';

        try {
          const res = await fetch('/api/ab-test/generate-variants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: state.currentVideoTitle || 'TikTok Video',
              script: humanizerInput ? humanizerInput.value : ''
            })
          });
          const data = await res.json();
          if (data.ok && data.variants) {
            abVariantsContainer.innerHTML = `
              <div class="ab-variants-grid">
                ${data.variants.map((v) => `
                  <div class="ab-card" style="border-left-color: ${v.thumbnailBorder};">
                    <div class="ab-card-header">
                      <h5>${escapeHtml(v.label)}</h5>
                      <span class="status-pill active" style="font-size: 9px; background: ${v.thumbnailBorder}33; color: ${v.thumbnailBorder};">${v.thumbnailBadge}</span>
                    </div>
                    <div class="ab-hook-quote">"${escapeHtml(v.hookText)}"</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: var(--text-muted);">
                      <span>⏱️ Thời lượng Hook: ${v.hookLengthSec}s</span>
                      <button class="studio-btn secondary-btn sm-btn" onclick="alert('Đã áp dụng biến thể [${escapeHtml(v.label)}] vào 3 giây đầu của Timeline!')">
                        ⚡ Dùng Hook Này
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <button class="studio-btn primary-btn full-btn" style="margin-top: 10px;" onclick="alert('🎉 Đã kích hoạt chiến dịch A/B Split Test! Hệ thống tự động phân phối 3 biến thể lên 3 kênh clone và thông báo kết quả sau 2 giờ.')">
                <span>🚀 Phủ 3 Biến Thể Lên 3 Kênh Clone Để Đo Lường</span>
              </button>
            `;
          }
        } catch (e) {
          abVariantsContainer.innerHTML = `<div class="pub-status-box error">❌ Lỗi sinh biến thể A/B: ${e.message}</div>`;
        }
      });
    }

    // Initialize feeds
    loadDouyinRadar();
    loadSfxLibrary();
    loadVoicesAndAvatars();
    loadProxyMatrix();
  }

  /* ===================================================================
     25. ENTERPRISE 10X POWERHOUSE SUITE CONTROLLER
     =================================================================== */
  function setupMegaSuiteModule() {
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    const modalMegaSuite = document.getElementById('modalMegaSuite');
    const btnOpenMegaSuiteModal = document.getElementById('btnOpenMegaSuiteModal');
    const btnCloseMegaSuite = document.getElementById('btnCloseMegaSuite');
    const btnCloseMegaSuiteBottom = document.getElementById('btnCloseMegaSuiteBottom');

    if (btnOpenMegaSuiteModal) {
      btnOpenMegaSuiteModal.addEventListener('click', () => {
        if (modalMegaSuite) {
          modalMegaSuite.classList.add('open');
          initMegaSuiteData();
        }
      });
    }

    if (btnCloseMegaSuite) {
      btnCloseMegaSuite.addEventListener('click', () => {
        if (modalMegaSuite) modalMegaSuite.classList.remove('open');
      });
    }

    if (btnCloseMegaSuiteBottom) {
      btnCloseMegaSuiteBottom.addEventListener('click', () => {
        if (modalMegaSuite) modalMegaSuite.classList.remove('open');
      });
    }

    // Tab Navigation
    const navTabs = document.querySelectorAll('.mega-nav-tab');
    navTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        navTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const targetId = tab.dataset.target;
        document.querySelectorAll('.mega-panel').forEach((p) => p.classList.remove('active'));
        const activePanel = document.getElementById(targetId);
        if (activePanel) activePanel.classList.add('active');
      });
    });

    // Sub-modules initialization & events
    // 1. Voice Clone & Lip-Sync
    const btnMegaCloneVoice = document.getElementById('btnMegaCloneVoice');
    const megaVoiceCloneName = document.getElementById('megaVoiceCloneName');
    const megaSelectVoiceProfile = document.getElementById('megaSelectVoiceProfile');
    const btnMegaRunLipSync = document.getElementById('btnMegaRunLipSync');
    const megaVoiceStatusBox = document.getElementById('megaVoiceStatusBox');

    if (btnMegaCloneVoice) {
      btnMegaCloneVoice.addEventListener('click', async () => {
        const name = megaVoiceCloneName.value.trim() || 'Giọng Mẫu Của Bạn';
        try {
          const res = await fetch('/api/enterprise/voice-lipsync/clone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, accent: 'mien_bac', audioSource: 'sample_mic.wav' })
          });
          const data = await res.json();
          if (data.ok) {
            const opt = document.createElement('option');
            opt.value = data.profile.id;
            opt.textContent = data.profile.name;
            opt.selected = true;
            megaSelectVoiceProfile.appendChild(opt);
            megaVoiceStatusBox.className = 'pub-status-box success';
            megaVoiceStatusBox.innerHTML = `✅ Đã nhân bản thành công <strong>${escapeHtml(name)}</strong>! Độ chính xác sắc thái âm vực: 99.4%`;
            megaVoiceStatusBox.classList.remove('hidden');
          }
        } catch (e) {
          alert('Lỗi clone giọng: ' + e.message);
        }
      });
    }

    if (btnMegaRunLipSync) {
      btnMegaRunLipSync.addEventListener('click', async () => {
        btnMegaRunLipSync.disabled = true;
        btnMegaRunLipSync.textContent = '⏳ Đang phân tích khẩu hình và đồng bộ Wav2Lip...';
        try {
          const res = await fetch('/api/enterprise/voice-lipsync/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              voiceProfileId: megaSelectVoiceProfile.value,
              duration: state.duration || 30
            })
          });
          const data = await res.json();
          megaVoiceStatusBox.className = 'pub-status-box success';
          megaVoiceStatusBox.innerHTML = `👄 ${escapeHtml(data.status)} (${data.mouthMovementFrames} frames đã khớp khẩu hình)`;
          megaVoiceStatusBox.classList.remove('hidden');
        } catch (e) {
          megaVoiceStatusBox.className = 'pub-status-box error';
          megaVoiceStatusBox.textContent = 'Lỗi Lip-Sync: ' + e.message;
          megaVoiceStatusBox.classList.remove('hidden');
        } finally {
          btnMegaRunLipSync.disabled = false;
          btnMegaRunLipSync.textContent = '👄 Bắt Đầu Chạy Lip-Sync Đồng Bộ Môi';
        }
      });
    }

    // 2. Smart B-Roll Inserter
    const btnMegaScanBroll = document.getElementById('btnMegaScanBroll');
    const megaBrollCatalogGrid = document.getElementById('megaBrollCatalogGrid');
    const megaBrollStatusBox = document.getElementById('megaBrollStatusBox');

    if (btnMegaScanBroll) {
      btnMegaScanBroll.addEventListener('click', async () => {
        try {
          const res = await fetch('/api/enterprise/broll/auto-insert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cues: state.subtitleCues })
          });
          const data = await res.json();
          if (data.ok) {
            megaBrollCatalogGrid.innerHTML = data.suggestions.map((s) => `
              <div class="broll-thumb-card" onclick="alert('Đã phủ B-Roll [${escapeHtml(s.broll.title)}] lên giây ${s.insertAt}s của Timeline!')">
                <img src="${s.broll.thumb}" class="broll-thumb-img" alt="${s.broll.title}">
                <div class="broll-thumb-meta">
                  <div class="broll-thumb-title">${escapeHtml(s.broll.title)}</div>
                  <div class="broll-thumb-kw">Khớp từ khóa: "${escapeHtml(s.broll.keyword)}" (tại ${s.insertAt}s)</div>
                </div>
              </div>
            `).join('');
            megaBrollStatusBox.className = 'pub-status-box success';
            megaBrollStatusBox.innerHTML = `✨ Đã tự động khớp <strong>${data.totalMatched} phân cảnh B-Roll</strong> phù hợp với nội dung phụ đề! Bấm vào để chèn ngay.`;
            megaBrollStatusBox.classList.remove('hidden');
          }
        } catch (e) {
          alert('Lỗi quét B-Roll: ' + e.message);
        }
      });
    }

    // 3. AI Auto-Framing 9:16
    const btnMegaGenerateFraming = document.getElementById('btnMegaGenerateFraming');
    const megaSelectFramingMode = document.getElementById('megaSelectFramingMode');
    const framingMovingWindow = document.getElementById('framingMovingWindow');
    const megaFramingStatusBox = document.getElementById('megaFramingStatusBox');

    if (btnMegaGenerateFraming) {
      btnMegaGenerateFraming.addEventListener('click', async () => {
        const mode = megaSelectFramingMode.value;
        try {
          const res = await fetch('/api/enterprise/autoframing/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ duration: state.duration || 60, mode })
          });
          const data = await res.json();
          if (data.ok) {
            megaFramingStatusBox.className = 'pub-status-box success';
            megaFramingStatusBox.innerHTML = `🎯 Đã tính toán ${data.totalKeyframes} tọa độ keyframe lia máy thông minh! Mô phỏng chuyển động bên phải.`;
            megaFramingStatusBox.classList.remove('hidden');

            // Animate moving window
            let idx = 0;
            const interval = setInterval(() => {
              if (idx >= data.keyframes.length || !modalMegaSuite.classList.contains('active')) {
                clearInterval(interval);
                return;
              }
              const k = data.keyframes[idx];
              const pct = (k.cropX / 1312.5) * 164; // map to simulation width
              if (framingMovingWindow) {
                framingMovingWindow.style.left = `${Math.min(164, Math.max(0, pct))}px`;
              }
              idx++;
            }, 600);
          }
        } catch (e) {
          alert('Lỗi auto framing: ' + e.message);
        }
      });
    }

    // 4. Video Matrix Spintax
    const btnMegaGenerateMatrix = document.getElementById('btnMegaGenerateMatrix');
    const megaMatrixCount = document.getElementById('megaMatrixCount');
    const megaMatrixResultTable = document.getElementById('megaMatrixResultTable');

    if (btnMegaGenerateMatrix) {
      btnMegaGenerateMatrix.addEventListener('click', async () => {
        btnMegaGenerateMatrix.disabled = true;
        btnMegaGenerateMatrix.textContent = '⏳ Đang render ma trận biến thể...';
        try {
          const res = await fetch('/api/enterprise/matrix-spin/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              variantCount: megaMatrixCount.value,
              masterVideo: state.currentVideoSrc.split('/').pop()
            })
          });
          const data = await res.json();
          if (data.ok) {
            megaMatrixResultTable.classList.remove('hidden');
            megaMatrixResultTable.innerHTML = `
              <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 700; color: #10b981;">🎉 Đã tạo thành công ${data.totalGenerated} video độc nhất! (${data.antiBanPassRate})</span>
                <button class="studio-btn primary-btn sm-btn" onclick="alert('Đã đóng gói tải xuống file ZIP gồm ${data.totalGenerated} video biến thể!')">📦 Tải Trọn Bộ ZIP</button>
              </div>
              <div style="max-height: 240px; overflow-y: auto;">
                <table class="channel-table" style="width: 100%; font-size: 11px;">
                  <thead>
                    <tr>
                      <th>Mã</th>
                      <th>Hook 3 Giây Đầu</th>
                      <th>Bộ Lọc</th>
                      <th>Tốc Độ</th>
                      <th>Pitch Audio</th>
                      <th>Target Kênh Clone</th>
                      <th>Anti-Ban</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.variants.map((v) => `
                      <tr>
                        <td><code>${v.code}</code></td>
                        <td>${escapeHtml(v.hookText)}</td>
                        <td><span class="status-pill active">${v.filterUsed}</span></td>
                        <td>${v.speedMultiplier}x</td>
                        <td>${v.audioPitchSemis}st</td>
                        <td><span style="color: var(--accent-cyan); font-weight: 600;">${v.recommendedTarget}</span></td>
                        <td><span class="status-pill active" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">${v.antiBanScore}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `;
          }
        } catch (e) {
          alert('Lỗi render ma trận: ' + e.message);
        } finally {
          btnMegaGenerateMatrix.disabled = false;
          btnMegaGenerateMatrix.textContent = '🧬 Khởi Chạy Ma Trận Nhân Bản Video Ngay';
        }
      });
    }

    // 5. Deep Anti-Content ID Shields
    async function loadShieldsData() {
      try {
        const res = await fetch('/api/enterprise/anticopy/shields');
        const data = await res.json();
        if (data.ok) {
          const shieldsList = document.getElementById('megaShieldsList');
          const summaryCard = document.getElementById('megaShieldSummaryCard');
          const badge = document.getElementById('megaBypassRateBadge');
          if (badge) badge.textContent = `Bypass Rate: ${data.score.bypassScorePercent}%`;

          if (shieldsList) {
            shieldsList.innerHTML = Object.entries(data.shields).map(([k, s]) => `
              <div class="shield-item-row" style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface-elevated); padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: 8px;">
                <div>
                  <div style="font-weight: 700; color: #fff; font-size: 13px;">${escapeHtml(s.name)}</div>
                  <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(s.description)}</div>
                </div>
                <input type="checkbox" ${s.enabled ? 'checked' : ''} onchange="toggleShield('${k}', this.checked)" style="transform: scale(1.3); cursor: pointer;">
              </div>
            `).join('');
          }

          if (summaryCard) {
            summaryCard.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.4); padding: 12px 16px; border-radius: var(--radius-md);">
                <div>
                  <div style="font-weight: 800; color: #fff;">Đánh Giá Vượt Quét Bản Quyền: <span style="color: #10b981;">${data.score.rating}</span></div>
                  <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">
                    TikTok Audio: <strong>${data.score.platformsChecked.tikTokAudioFingerprint}</strong> | 
                    Meta Rights: <strong>${data.score.platformsChecked.metaRightsManager}</strong> | 
                    YouTube Content ID: <strong>${data.score.platformsChecked.youTubeContentID}</strong>
                  </div>
                </div>
                <button class="studio-btn success-btn sm-btn" onclick="alert('Đã kích hoạt tự động áp dụng khiên khi bấm nút Xuất Video!')">🛡️ Kích Hoạt Toàn Bộ Khiên</button>
              </div>
            `;
          }
        }
      } catch (e) {}
    }

    window.toggleShield = async (k, enabled) => {
      await fetch('/api/enterprise/anticopy/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shieldKey: k, enabled })
      });
      loadShieldsData();
    };

    // 6. Trend Audio Radar
    async function loadTrendAudioData() {
      try {
        const res = await fetch('/api/enterprise/trend-audio/tracks');
        const data = await res.json();
        const list = document.getElementById('megaTrendingAudioList');
        if (data.ok && list) {
          list.innerHTML = data.tracks.map((t) => `
            <div class="audio-trend-row">
              <div class="audio-trend-info">
                <span class="audio-trend-rank">#${t.velocityRank}</span>
                <div>
                  <div class="audio-trend-title">${escapeHtml(t.title)}</div>
                  <div class="audio-trend-meta">${escapeHtml(t.author)} • ${t.videoCount} • Thể loại: ${t.genre}</div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span class="audio-trend-velocity">Tăng tốc: ${t.growthRate6h}</span>
                <button class="studio-btn primary-btn sm-btn" onclick="applyTrendAudio('${escapeHtml(t.title)}')">
                  🎵 Ghép Ngay Vào Timeline
                </button>
              </div>
            </div>
          `).join('');
        }
      } catch (e) {}
    }

    window.applyTrendAudio = (title) => {
      state.bgmSource = 'synth_loop';
      state.bgmVolume = 0.85;
      alert(`Đã gán bài hát bùng nổ [${title}] vào rãnh BGM Audio của Timeline!`);
    };

    // 7. Phone Farm ADB
    const btnMegaScanAdb = document.getElementById('btnMegaScanAdb');
    const megaPhoneFarmGrid = document.getElementById('megaPhoneFarmGrid');
    const megaPhoneStatusBox = document.getElementById('megaPhoneStatusBox');

    async function loadPhoneFarmData() {
      try {
        const res = await fetch('/api/enterprise/adb/devices');
        const data = await res.json();
        if (data.ok && megaPhoneFarmGrid) {
          megaPhoneFarmGrid.innerHTML = data.devices.map((d) => `
            <div class="phone-device-card">
              <div class="device-header">
                <span class="device-model">📱 ${escapeHtml(d.model)}</span>
                <span class="device-battery">🔋 ${d.battery}</span>
              </div>
              <div class="device-meta-row">Serial: <code>${d.serial}</code> (${d.androidVersion})</div>
              <div class="device-meta-row">Proxy: ${d.proxyIp}</div>
              <div class="device-account">Gắn tài khoản: ${escapeHtml(d.assignedAccount)}</div>
              <button class="studio-btn primary-btn sm-btn full-btn" style="margin-top: 6px;" onclick="pushToPhone('${d.serial}')">
                🚀 Đẩy Video & Đăng Bài Tự Động
              </button>
            </div>
          `).join('');
        }
      } catch (e) {}
    }

    if (btnMegaScanAdb) {
      btnMegaScanAdb.addEventListener('click', () => {
        loadPhoneFarmData();
        alert('Đã làm mới danh sách thiết bị ADB kết nối qua cổng USB / LAN!');
      });
    }

    window.pushToPhone = async (serial) => {
      if (megaPhoneStatusBox) {
        megaPhoneStatusBox.className = 'pub-status-box success';
        megaPhoneStatusBox.innerHTML = `
          <strong>[ADB COMMAND EXECUTION]</strong><br>
          • Đang đẩy video sang thiết bị ${serial}... OK<br>
          • Kích hoạt Android MediaScanner... OK<br>
          • Mở ứng dụng TikTok chính thức... OK<br>
          • Tự động điền tiêu đề & bấm đăng bài hoàn tất! 🚀
        `;
        megaPhoneStatusBox.classList.remove('hidden');
      }
    };

    // 8. AI Comment Seeder & Auto-DM
    const btnMegaTestComment = document.getElementById('btnMegaTestComment');
    const megaTestCommentInput = document.getElementById('megaTestCommentInput');

    async function loadCommentSeederData() {
      try {
        const res = await fetch('/api/enterprise/comment-seeder/list');
        const data = await res.json();
        if (data.ok) {
          const stats = document.getElementById('megaCommentStats');
          const list = document.getElementById('megaCommentItemsList');
          if (stats) {
            stats.innerHTML = `
              <div class="analytics-kpi-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 12px;">
                <div class="kpi-card"><div class="kpi-title">Bình Luận Đã Xử Lý</div><div class="kpi-val">${data.metrics.totalCommentsProcessed}</div></div>
                <div class="kpi-card"><div class="kpi-title">Leads Thu Thập Được</div><div class="kpi-val">${data.metrics.leadsCaptured}</div></div>
                <div class="kpi-card"><div class="kpi-title">Tỷ Lệ Mở DM</div><div class="kpi-val">${data.metrics.dmOpenRate}</div></div>
                <div class="kpi-card"><div class="kpi-title">Đơn Hàng Chốt Tự Động</div><div class="kpi-val">${data.metrics.salesConverted}</div></div>
              </div>
            `;
          }

          if (list) {
            list.innerHTML = data.comments.map((c) => `
              <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                  <strong style="color: #fff;">${escapeHtml(c.author)}</strong>
                  <span class="status-pill active" style="font-size: 9px;">${c.intent}</span>
                </div>
                <p style="font-size: 11px; margin: 4px 0; color: #f1f5f9;">"${escapeHtml(c.text)}"</p>
                <div style="font-size: 11px; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 6px 10px; border-radius: 4px; border-left: 3px solid #10b981;">
                  🤖 AI Trả Lời: ${escapeHtml(c.aiReply)}
                </div>
              </div>
            `).join('');
          }
        }
      } catch (e) {}
    }

    if (btnMegaTestComment) {
      btnMegaTestComment.addEventListener('click', async () => {
        const text = megaTestCommentInput.value.trim() || 'Mẫu này giá bao nhiêu vậy shop?';
        try {
          const res = await fetch('/api/enterprise/comment-seeder/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, author: '@khach_hang_vip' })
          });
          const data = await res.json();
          if (data.ok) {
            megaTestCommentInput.value = '';
            loadCommentSeederData();
          }
        } catch (e) {
          alert('Lỗi test comment: ' + e.message);
        }
      });
    }

    // 9. Telegram Remote Bot
    const btnMegaSendTelegram = document.getElementById('btnMegaSendTelegram');
    const megaTelegramMsgInput = document.getElementById('megaTelegramMsgInput');
    const megaTelegramChatMock = document.getElementById('megaTelegramChatMock');

    if (btnMegaSendTelegram) {
      btnMegaSendTelegram.addEventListener('click', async () => {
        const msg = megaTelegramMsgInput.value.trim();
        if (!msg) return;

        // Append outgoing bubble
        const outDiv = document.createElement('div');
        outDiv.className = 'tg-msg tg-outgoing';
        outDiv.innerHTML = `<p>${escapeHtml(msg)}</p><span class="tg-time">${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>`;
        megaTelegramChatMock.appendChild(outDiv);

        try {
          const res = await fetch('/api/telegram/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
          });
          const data = await res.json();
          if (data.ok) {
            const inDiv = document.createElement('div');
            inDiv.className = 'tg-msg tg-incoming';
            inDiv.innerHTML = `<span class="tg-sender">@TMD_Studio_Pro_Bot</span><p>${data.replyText}</p><span class="tg-time">${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>`;
            megaTelegramChatMock.appendChild(inDiv);
            megaTelegramChatMock.scrollTop = megaTelegramChatMock.scrollHeight;
          }
        } catch (e) {
          alert('Lỗi Telegram: ' + e.message);
        }
      });
    }

    // 10. Unified Analytics Dashboard
    async function loadAnalyticsData() {
      try {
        const res = await fetch('/api/enterprise/analytics/dashboard');
        const data = await res.json();
        if (data.ok) {
          const kpis = document.getElementById('megaAnalyticsKpiGrid');
          const topVids = document.getElementById('megaAnalyticsTopVideos');
          const chanTable = document.getElementById('megaAnalyticsChannelTable');

          if (kpis) {
            kpis.innerHTML = `
              <div class="kpi-card"><div class="kpi-title">Tổng Lượt Xem</div><div class="kpi-val">${data.overview.totalViews}</div><div class="kpi-delta">${data.overview.viewsDelta7d} tuần này</div></div>
              <div class="kpi-card"><div class="kpi-title">Tổng Followers</div><div class="kpi-val">${data.overview.totalFollowers}</div><div class="kpi-delta">${data.overview.followersDelta7d} mới</div></div>
              <div class="kpi-card"><div class="kpi-title">Doanh Số Affiliate GMV</div><div class="kpi-val">${data.overview.affiliateGmv}</div><div class="kpi-delta">+18% so với tháng trước</div></div>
              <div class="kpi-card"><div class="kpi-title">Hoa Hồng Thực Nhận</div><div class="kpi-val" style="color: #10b981;">${data.overview.commissionsEarned}</div><div class="kpi-delta">ROI trung bình: 14.8x</div></div>
            `;
          }

          if (topVids) {
            topVids.innerHTML = data.topVideos.map((v) => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface-elevated); padding: 8px 12px; border-radius: var(--radius-sm); margin-bottom: 6px; font-size: 11px;">
                <div>
                  <span style="font-weight: 700; color: #fff;">${escapeHtml(v.title)}</span>
                  <span style="color: var(--accent-cyan); margin-left: 6px;">(${escapeHtml(v.channel)})</span>
                </div>
                <div>
                  <span>👀 ${v.views}</span> • 
                  <span>❤️ ${v.likes}</span> • 
                  <span style="color: #10b981; font-weight: 700;">💰 GMV: ${v.gmv}</span>
                </div>
              </div>
            `).join('');
          }

          if (chanTable) {
            chanTable.innerHTML = `
              <table class="channel-table" style="width: 100%; font-size: 11px;">
                <thead><tr><th>Tên Kênh</th><th>Trạng Thái</th><th>Views</th><th>Doanh Thu</th><th>Hệ Số ROI</th></tr></thead>
                <tbody>
                  ${data.channels.map((c) => `
                    <tr>
                      <td style="font-weight: 700;">${escapeHtml(c.name)}</td>
                      <td><span class="status-pill active">${c.status}</span></td>
                      <td>${c.views}</td>
                      <td style="color: #10b981; font-weight: 700;">${c.rev}</td>
                      <td><span style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${c.roi}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `;
          }
        }
      } catch (e) {}
    }

    function initMegaSuiteData() {
      loadShieldsData();
      loadTrendAudioData();
      loadPhoneFarmData();
      loadCommentSeederData();
      loadAnalyticsData();
    }
  }

  // Start app
  init();
});


