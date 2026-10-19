#!/usr/bin/env node
/**
 * Concat CLI & MCP Bridge for TMD Studio Pro
 * Connects AI Assistants (Claude Desktop, Antigravity, Cursor) and terminal users
 * with the jub0t/concat editing engine and TMD Studio Pro.
 *
 * Usage:
 *   node concat-cli.js status             # Check local Concat binary detection
 *   node concat-cli.js list               # List exported Concat projects
 *   node concat-cli.js launch [path]      # Launch Concat desktop app with project
 *   node concat-cli.js --mcp              # Run as Model Context Protocol (MCP) stdio server
 */

const readline = require('readline');
const path = require('path');
const { ConcatBridge } = require('./concat_bridge');

const bridge = new ConcatBridge(__dirname);
const args = process.argv.slice(2);

async function main() {
  if (args.includes('--mcp')) {
    runMcpStdio();
    return;
  }

  const cmd = args[0] || 'help';

  switch (cmd) {
    case 'status': {
      const status = bridge.detectConcatBinary();
      console.log('=== Concat Engine Status (jub0t/concat) ===');
      console.log(`Platform : ${status.platform}`);
      console.log(`Installed: ${status.installed ? 'YES (Ready)' : 'NO (Not Found)'}`);
      if (status.path) {
        console.log(`Binary   : ${status.path}`);
      } else {
        console.log(`Download : ${status.downloadUrl}`);
        console.log(`Default  : ${status.recommendedLocation}`);
      }
      break;
    }

    case 'list': {
      const projects = bridge.listProjects();
      console.log(`=== Exported Concat Projects (${projects.length}) ===`);
      projects.forEach((p, idx) => {
        console.log(`[${idx + 1}] ${p.name}`);
        console.log(`    Clips: ${p.clipsCount} | Updated: ${p.mtime}`);
        console.log(`    Path : ${p.path}`);
      });
      break;
    }

    case 'launch': {
      const target = args[1] || null;
      console.log(`Launching Concat with project: ${target || 'default'}...`);
      const res = bridge.launchConcat(target);
      console.log(res);
      break;
    }

    case 'export-demo': {
      const demo = {
        projectName: 'Demo_TikTok_Concat',
        videoFile: 'sample_video.mp4',
        videoTitle: 'TikTok Demo with Vietnamese Subtitles',
        duration: 35,
        aspectRatio: '9:16',
        subtitleCues: [
          { startTime: 0, endTime: 3.5, text: 'Chào mừng bạn đến với TMD Studio Pro!' },
          { startTime: 3.6, endTime: 7.2, text: 'Tích hợp bộ dựng Concat siêu tốc bằng Rust.' }
        ],
        antiReup: { mirror: true, zoom: 1.05, speed: 1.02 }
      };
      const res = bridge.exportToConcatProject(demo);
      console.log('Project exported successfully:');
      console.log(res);
      break;
    }

    case 'help':
    default: {
      console.log(`
TMD Studio Pro - Concat Bridge CLI (jub0t/concat)
Commands:
  node concat-cli.js status        Kiểm tra file thực thi Concat trên máy
  node concat-cli.js list          Hiển thị danh sách project .concat đã xuất
  node concat-cli.js launch <dir>  Khởi chạy Concat GUI với thư mục project
  node concat-cli.js export-demo   Tạo một project .concat mẫu kiểm tra
  node concat-cli.js --mcp         Chạy MCP stdio server cho Claude / Cursor
      `);
      break;
    }
  }
}

/**
 * Standard MCP / JSON-RPC stdio server for Claude Desktop / Cursor
 */
function runMcpStdio() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', async (line) => {
    if (!line.trim()) return;
    try {
      const json = JSON.parse(line);
      const response = await bridge.handleJsonRpc(json);
      process.stdout.write(JSON.stringify(response) + '\n');
    } catch (err) {
      const errResp = {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error: ' + err.message }
      };
      process.stdout.write(JSON.stringify(errResp) + '\n');
    }
  });
}

main();
