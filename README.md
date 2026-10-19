# TikTok Mass Downloader (TMD)

Modern, fast, and robust Node.js tool to **collect profile info, list all video links, bypass profile download restrictions, and mass download clean watermark-free videos** in high definition.

---

## ✨ Features

- **100% Watermark-Free HD**: Fetches direct clean video streams without the TikTok watermark/logo.
- **Profile Info Card**: Collects and displays complete profile information (user ID, nickname, follower count, hearts, total published videos, bio, and verification status).
- **Video Links Collector**: Scans and displays numbered links for all profile videos, exporting them to `links.txt`.
- **Download Restriction Bypass**: Automatically bypasses creator-level "Allow video downloads: OFF" restrictions via deep browser session cookie and rehydration stream resolution.
- **Info-Only Mode (`--info`)**: Collects profile metadata and full video links without downloading the video files.
- **Smart Auto-Scroll & Pop-up Handling**: Automatically dismisses login prompts, app banners, and modal dialogs during scanning.
- **Real-Time Stream Progress**: Displays download speed, downloaded size, percentage, and ETA.
- **Duplicate Skipping**: Skips previously downloaded videos automatically when re-running a profile.
- **Atomic File Writing**: Downloads into `.tmp` files first to avoid saving incomplete/corrupted video files.

---

## 📋 Requirements

- **Node.js** v18+ (tested on Node.js v20 and v22)
- **npm**

---

## 🚀 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/free2playvn/Tiktok-Mass-Downloader.git
   cd Tiktok-Mass-Downloader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 💡 How to Use

### 1. Collect Profile Info & Links Only (Without Downloading Videos)

Use the `--info` flag to inspect a profile and export its full video list to `links.txt`:
```bash
node TMD.js "https://www.tiktok.com/@username" --info
```

---

### 2. Mass Download Profile (All or Limited $N$ Videos)

Download all videos from a profile without watermark:
```bash
node TMD.js "https://www.tiktok.com/@username"
```

Or limit the download to $N$ videos (e.g. 10 videos):
```bash
node TMD.js "https://www.tiktok.com/@username" 10
```

Shorthand username formats are also supported (enclose in quotes if using PowerShell):
```bash
node TMD.js "@username" 5
node TMD.js username 3
```

---

### 3. Single Video Direct Download (Watermark-Free HD)

Download a single video directly:
```bash
node TMD.js "https://www.tiktok.com/@username/video/7675792462593428756"
```

Shortened links (`vm.tiktok.com` or `vt.tiktok.com`) are also supported:
```bash
node TMD.js "https://vm.tiktok.com/xxxxxx/"
```

---

## 📁 Output Directory

All downloads and exported data are organized in the root directory under the creator's handle:

```text
Tiktok-Mass-Downloader/
├── @username/
│   ├── 7675792462593428756.mp4     # Watermark-free HD video file
│   ├── 7696392556535418113.mp4     # Watermark-free HD video file
│   ├── profile_info.json           # Complete profile metadata JSON
│   ├── links.txt                   # List of all extracted video links
│   └── names.txt                   # Captions and video IDs
├── TMD.js
├── package.json
└── README.md
```

---

## 📄 License

MIT License.
