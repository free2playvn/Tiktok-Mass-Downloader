/**
 * TMD Studio Pro - Concat Integration Bridge
 * Connects TMD Studio Pro with jub0t/concat (The open-source CapCut alternative)
 * Provides:
 * 1. Project exporter to Concat format (concat.json)
 * 2. Binary detector for native Concat on Windows/macOS/Linux
 * 3. JSON-RPC & MCP protocol compatibility layer for AI Agents
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

class ConcatBridge {
  constructor(workspaceDir = __dirname) {
    this.workspaceDir = workspaceDir;
    this.projectsDir = path.join(this.workspaceDir, 'concat_projects');
    if (!fs.existsSync(this.projectsDir)) {
      fs.mkdirSync(this.projectsDir, { recursive: true });
    }
  }

  /**
   * Detect if Concat desktop app is installed locally on the system
   */
  detectConcatBinary() {
    const candidates = [];

    if (process.platform === 'win32') {
      const localAppData = process.env.LOCALAPPDATA || '';
      const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
      const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

      candidates.push(
        path.join(localAppData, 'Programs', 'Concat', 'concat.exe'),
        path.join(programFiles, 'Concat', 'concat.exe'),
        path.join(programFilesX86, 'Concat', 'concat.exe'),
        path.join(this.workspaceDir, 'concat.exe'),
        path.join(this.workspaceDir, 'src', 'target', 'release', 'concat.exe'),
        path.join(this.workspaceDir, 'src', 'target', 'quick', 'concat.exe')
      );
    } else if (process.platform === 'darwin') {
      candidates.push(
        '/Applications/Concat.app/Contents/MacOS/concat',
        path.join(process.env.HOME || '', 'Applications/Concat.app/Contents/MacOS/concat')
      );
    } else {
      candidates.push(
        '/usr/bin/concat',
        '/usr/local/bin/concat',
        path.join(this.workspaceDir, 'Concat.AppImage')
      );
    }

    for (const binPath of candidates) {
      if (fs.existsSync(binPath)) {
        return {
          installed: true,
          path: binPath,
          platform: process.platform
        };
      }
    }

    // Check if in PATH
    try {
      const whichCmd = process.platform === 'win32' ? 'where concat' : 'which concat';
      const found = execSync(whichCmd, { stdio: 'pipe' }).toString().trim().split('\n')[0];
      if (found && fs.existsSync(found)) {
        return { installed: true, path: found, platform: process.platform };
      }
    } catch (e) {}

    return {
      installed: false,
      path: null,
      platform: process.platform,
      downloadUrl: 'https://github.com/jub0t/Concat/releases/latest',
      recommendedLocation: process.platform === 'win32' 
        ? path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Concat', 'concat.exe')
        : '/Applications/Concat.app'
    };
  }

  /**
   * Export a TMD Studio project into standard jub0t/concat project folder
   * @param {Object} tmdProject
   * @returns {Object} { ok, projectPath, concatJsonPath }
   */
  exportToConcatProject(tmdProject = {}) {
    const {
      projectName = 'TMD_Video_Project',
      videoFile = '',
      videoTitle = 'TikTok Video',
      duration = 60,
      aspectRatio = '9:16',
      subtitleCues = [],
      audioDub = null,
      antiReup = null
    } = tmdProject;

    const safeName = projectName.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_').slice(0, 50);
    const projDir = path.join(this.projectsDir, safeName);
    if (!fs.existsSync(projDir)) {
      fs.mkdirSync(projDir, { recursive: true });
    }

    // Determine dimensions
    let width = 1080;
    let height = 1920;
    if (aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    } else if (aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    } else if (aspectRatio === '4:5') {
      width = 1080;
      height = 1350;
    }

    // Find absolute path of video file
    let absVideoPath = videoFile;
    if (!path.isAbsolute(absVideoPath)) {
      absVideoPath = path.join(this.workspaceDir, videoFile);
    }

    const mediaList = [];
    let mediaIdVideo = 'M_VIDEO_01';
    let mediaIdAudio = null;

    if (fs.existsSync(absVideoPath)) {
      mediaList.push({
        id: mediaIdVideo,
        name: path.basename(absVideoPath),
        path: absVideoPath,
        duration: duration,
        kind: 'video',
        width,
        height,
        frame_rate: 30.0,
        frame_rate_fraction: '30/1',
        video_codec: 'h264',
        audio_codec: 'aac',
        has_audio: true
      });
    }

    // Main tracks
    const tracks = [
      { id: 'T_VIDEO', kind: 'video', name: 'Video Chính' },
      { id: 'T_SUBTITLES', kind: 'text', name: 'Phụ Đề Tiếng Việt (Humanized)' },
      { id: 'T_AUDIO_BGM', kind: 'audio', name: 'Nhạc Nền Dubbing' }
    ];

    const clips = [];

    // Main Video Clip
    clips.push({
      id: 'C_MAIN_VIDEO',
      trackId: 'T_VIDEO',
      mediaId: mediaIdVideo,
      start: 0.0,
      duration: duration,
      kind: 'video',
      volume: audioDub ? (audioDub.origVolume ?? 1.0) : 1.0,
      opacity: 1.0,
      flipH: antiReup ? antiReup.mirror : false,
      flipV: false,
      speed: antiReup ? antiReup.speed : 1.0,
      crop: antiReup && antiReup.zoom ? { left: 0.02, right: 0.02, top: 0.02, bottom: 0.02 } : null
    });

    // Subtitle Clips
    if (Array.isArray(subtitleCues) && subtitleCues.length > 0) {
      subtitleCues.forEach((cue, idx) => {
        const subDuration = Math.max(0.2, (cue.endTime || (cue.startTime + 2.5)) - cue.startTime);
        clips.push({
          id: `C_SUB_${idx + 1}`,
          trackId: 'T_SUBTITLES',
          start: cue.startTime || 0.0,
          duration: subDuration,
          kind: 'text',
          text: {
            content: cue.text || '',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: 48,
            color: '#FACC15',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            strokeWidth: 2,
            strokeColor: '#000000',
            alignment: 'center',
            positionY: 0.82
          }
        });
      });
    }

    // Background Audio Dubbing Clip
    if (audioDub && audioDub.bgmSrc) {
      mediaIdAudio = 'M_AUDIO_01';
      let absAudioPath = audioDub.bgmSrc;
      if (!path.isAbsolute(absAudioPath)) {
        absAudioPath = path.join(this.workspaceDir, audioDub.bgmSrc);
      }

      mediaList.push({
        id: mediaIdAudio,
        name: path.basename(absAudioPath),
        path: absAudioPath,
        duration: audioDub.duration || duration,
        kind: 'audio',
        audio_codec: 'mp3',
        has_audio: true
      });

      clips.push({
        id: 'C_BGM_AUDIO',
        trackId: 'T_AUDIO_BGM',
        mediaId: mediaIdAudio,
        start: audioDub.startTime || 0.0,
        duration: audioDub.duration || duration,
        kind: 'audio',
        volume: audioDub.bgmVolume ?? 0.8,
        fadeIn: audioDub.fadeInOut ? 1.0 : 0.0,
        fadeOut: audioDub.fadeInOut ? 1.0 : 0.0
      });
    }

    // Build standard Concat document (concat.json)
    const concatDoc = {
      version: 1,
      generator: 'TMD Studio Pro v3.2 AI - Concat Bridge',
      name: videoTitle,
      created: new Date().toISOString(),
      media: mediaList,
      video: {
        width,
        height,
        rate_num: 30,
        rate_den: 1
      },
      timelines: [
        {
          id: 'TL_MAIN',
          name: 'Main Timeline',
          video: {
            width,
            height,
            rate_num: 30,
            rate_den: 1
          },
          tracks,
          clips
        }
      ],
      activeTimelineId: 'TL_MAIN',
      // Backward compatibility flat mirror
      tracks,
      clips
    };

    const concatJsonPath = path.join(projDir, 'concat.json');
    fs.writeFileSync(concatJsonPath, JSON.stringify(concatDoc, null, 2), 'utf8');

    return {
      ok: true,
      projectName: safeName,
      projectPath: projDir,
      concatJsonPath,
      totalClips: clips.length,
      totalSubtitles: subtitleCues.length,
      aspectRatio
    };
  }

  /**
   * Launch Concat desktop with the exported project
   */
  launchConcat(projectDir) {
    const detection = this.detectConcatBinary();
    if (!detection.installed) {
      return {
        ok: false,
        message: 'Chưa cài đặt Concat Desktop. Vui lòng tải Concat từ github.com/jub0t/concat/releases',
        downloadUrl: detection.downloadUrl
      };
    }

    try {
      const child = spawn(detection.path, [projectDir], {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();

      return {
        ok: true,
        message: `Đã khởi chạy Concat Desktop mở dự án tại: ${projectDir}`,
        pid: child.pid
      };
    } catch (err) {
      return {
        ok: false,
        message: 'Lỗi khởi chạy Concat: ' + err.message
      };
    }
  }

  /**
   * List all projects in concat_projects directory
   */
  listProjects() {
    const projects = [];
    if (fs.existsSync(this.projectsDir)) {
      const dirs = fs.readdirSync(this.projectsDir);
      for (const d of dirs) {
        const pPath = path.join(this.projectsDir, d);
        const jPath = path.join(pPath, 'concat.json');
        if (fs.existsSync(jPath)) {
          try {
            const stat = fs.statSync(jPath);
            const doc = JSON.parse(fs.readFileSync(jPath, 'utf8'));
            projects.push({
              name: doc.name || d,
              path: pPath,
              width: doc.video?.width || 1080,
              height: doc.video?.height || 1920,
              fps: (doc.video?.rate_num || 30) / (doc.video?.rate_den || 1),
              clipsCount: doc.clips?.length || 0,
              mtime: stat.mtime.toLocaleString('vi-VN')
            });
          } catch (e) {}
        }
      }
    }
    return projects;
  }

  /**
   * Execute Concat JSON-RPC command
   */
  handleJsonRpc(payload) {
    const { id = 1, method, params = {} } = payload || {};

    switch (method) {
      case 'concat_version':
      case 'version':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            app: 'Concat',
            version: '0.2.8-tmd-bridge',
            edition: '2024',
            engine: 'Rust GPU Compositor + FFmpeg 7',
            mcp: { mode: 'bridge', active: true },
            capabilities: [
              'auto-captions',
              'whisper-local',
              'vietnamese-humanizer',
              'anti-reup-cloaking',
              'directml-cutout',
              '4k-gpu-export'
            ]
          }
        };

      case 'project_list':
      case 'project.list':
        return { jsonrpc: '2.0', id, result: { projects: this.listProjects() } };

      case 'project_create':
      case 'project.create':
        const res = this.exportToConcatProject({
          projectName: params.name || 'New_Concat_Project',
          videoFile: params.videoFile || '',
          videoTitle: params.title || 'Untitled',
          duration: params.duration || 60
        });
        return { jsonrpc: '2.0', id, result: res };

      case 'timeline_read':
      case 'project.get':
        const projPath = params.path;
        if (!projPath || !fs.existsSync(path.join(projPath, 'concat.json'))) {
          return { jsonrpc: '2.0', id, error: { code: -32602, message: 'Invalid project path' } };
        }
        const projectData = JSON.parse(fs.readFileSync(path.join(projPath, 'concat.json'), 'utf8'));
        return { jsonrpc: '2.0', id, result: projectData };

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method '${method}' not implemented or bridged` }
        };
    }
  }
}

module.exports = ConcatBridge;
module.exports.ConcatBridge = ConcatBridge;

