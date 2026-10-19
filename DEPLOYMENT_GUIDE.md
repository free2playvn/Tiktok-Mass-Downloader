# 🚀 Hướng Dẫn Triển Khai TMD Studio Pro Lên VPS / Cloud Server 24/7

Tài liệu này hướng dẫn chi tiết cách triển khai hệ thống **TMD Studio Pro v3.2 AI** lên máy chủ đám mây (Cloud VPS Ubuntu 22.04 / 24.04 LTS) để phục vụ livestream bán hàng, render video AI và tự động hóa xuất bản đa kênh 24/7 cho Agency và Doanh nghiệp.

---

## 1. Yêu Cầu Cấu Hình Máy Chủ Khuyến Nghị

* **Hệ điều hành**: Ubuntu 22.04 LTS / Ubuntu 24.04 LTS
* **CPU**: 4 Core trở lên (khuyến nghị 8 Core nếu render nhiều luồng video cùng lúc)
* **RAM**: 8GB – 16GB
* **Ổ cứng**: SSD / NVMe 80GB trở lên
* **Băng thông mạng**: Tối thiểu 100 Mbps (đáp ứng livestream đa luồng 1080p 60fps)

---

## 2. Các Bước Cài Đặt Tự Động Với Docker (Khuyên Dùng)

### Bước 1: Cập nhật hệ thống và cài đặt Docker & Docker Compose
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo apt install docker-compose-plugin -y
```

### Bước 2: Tải mã nguồn lên máy chủ
```bash
# Clone hoặc tải thư mục dự án lên VPS
git clone <URL_REPOSITORY_CUA_BAN> tmd-studio-pro
cd tmd-studio-pro
```

### Bước 3: Khởi động hệ thống với Docker Compose
```bash
docker compose up -d --build
```

Kiểm tra trạng thái container:
```bash
docker ps
```
Hệ thống sẽ chạy ngầm và tự động khởi động lại nếu máy chủ reboot (`restart: always`).

---

## 3. Cấu Hình Tên Miền & HTTPS Miễn Phí Với Nginx & Let's Encrypt

### Bước 1: Cài đặt Nginx và Certbot
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Bước 2: Tạo cấu hình Reverse Proxy cho tên miền (VD: `studio.yourdomain.com`)
```bash
sudo nano /etc/nginx/sites-available/tmd-studio.conf
```

Dán nội dung cấu hình sau:
```nginx
server {
    server_name studio.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

Kích hoạt cấu hình:
```bash
sudo ln -s /etc/nginx/sites-available/tmd-studio.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Bước 3: Kích hoạt chứng chỉ bảo mật SSL / HTTPS
```bash
sudo certbot --nginx -d studio.yourdomain.com
```

Giờ đây bạn có thể truy cập Studio từ bất kỳ đâu qua địa chỉ an toàn: `https://studio.yourdomain.com/studio/index.html`!

---

## 4. Quản Lý & Bảo Trì Hệ Thống

* **Xem log thời gian thực**:
  ```bash
  docker logs -f tmd_studio_pro_app
  ```
* **Khởi động lại server**:
  ```bash
  docker compose restart
  ```
* **Cập nhật phiên bản mới**:
  ```bash
  git pull
  docker compose up -d --build
  ```

---
*Chúc mừng bạn đã sở hữu một hệ sinh thái Studio AI Điện Ảnh & Livestream 24/7 tự vận hành trên nền tảng đám mây!*
