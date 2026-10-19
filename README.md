# TikTok Mass Downloader (TMD)

Modern, fast, and lightweight Node.js tool to **mass download TikTok videos without watermark** in high definition.

---

## ✨ Features

- **100% Watermark-Free HD**: Downloads clean video streams without the TikTok watermark/logo.
- **Profile Mass Download**: Scrapes and downloads all or a specified number ($N$) of videos from any public TikTok profile.
- **Single Video Download**: Instantly downloads a single video when given a direct video URL.
- **Smart Auto-Scroll & Pop-up Handling**: Automatically bypasses login prompts and dialogs during profile scanning.
- **Live Stream Progress**: Real-time progress bar displaying speed, downloaded size, percentage, and estimated time remaining (ETA).
- **Duplicate Skipping**: Skips already downloaded videos when re-running for the same profile.
- **Metadata Archiving**: Automatically appends video titles and descriptions to `names.txt` in the creator's folder.

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

### 1. Mass Download from Profile

Download all available videos from a user's profile:
```bash
node TMD.js https://www.tiktok.com/@username
```

Or limit the download to $N$ videos (e.g. 5 videos):
```bash
node TMD.js https://www.tiktok.com/@username 5
```

You can also use shorthand username formats:
```bash
node TMD.js @username 10
node TMD.js username 3
```

---

### 2. Single Video Download

Download a specific video directly without watermark:
```bash
node TMD.js https://www.tiktok.com/@username/video/7675792462593428756
```

Shortened links (`vm.tiktok.com` or `vt.tiktok.com`) are also supported:
```bash
node TMD.js https://vm.tiktok.com/xxxxxx/
```

---

## 📁 Output Directory

All downloads are neatly organized in the root directory under the creator's handle:

```text
Tiktok-Mass-Downloader/
├── @username/
│   ├── 7675792462593428756.mp4
│   ├── 7696392556535418113.mp4
│   └── names.txt
├── TMD.js
├── package.json
└── README.md
```

- Each video is saved as `<videoId>.mp4`.
- `names.txt` stores each video ID and its caption/description.

---

## 📄 License

MIT License.
