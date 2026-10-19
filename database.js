const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_DIR = path.join(__dirname, 'database');
const DB_FILE = path.join(DB_DIR, 'tmd_store.json');

class TMDDatabase {
  constructor() {
    this.data = {
      users: [],
      sessions: [],
      activity_logs: [],
      schedules: [],
      team_members: [],
      anti_reup_presets: [],
      warmup_logs: [],
      billing_transactions: []
    };
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Lỗi đọc database, khởi tạo lại:', err);
        this.save();
      }
    } else {
      this.seedInitialAccounts();
      this.save();
    }

    // Ensure initial admin exists
    if (!this.data.users || this.data.users.length === 0) {
      this.seedInitialAccounts();
      this.save();
    }
  }

  save() {
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  }

  hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  seedInitialAccounts() {
    const adminSalt = crypto.randomBytes(16).toString('hex');
    const creatorSalt = crypto.randomBytes(16).toString('hex');

    this.data.users = [
      {
        id: 'usr_admin_001',
        email: 'admin@tmdstudio.com',
        phone: '0988888888',
        passwordHash: this.hashPassword('admin123', adminSalt),
        salt: adminSalt,
        fullname: 'Quản Trị Viên Cấp Cao',
        role: 'admin',
        plan: 'VIP Pro Enterprise',
        status: 'active',
        avatar: '👑',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        stats: {
          downloadsCount: 67,
          editedVideos: 12,
          clonesManaged: 5
        }
      },
      {
        id: 'usr_creator_002',
        email: 'creator@tmdstudio.com',
        phone: '0912345678',
        passwordHash: this.hashPassword('creator123', creatorSalt),
        salt: creatorSalt,
        fullname: 'Nhạc Nghe Đi Xe Official',
        role: 'creator',
        plan: 'Creator Studio Pro',
        status: 'active',
        avatar: '🎵',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        stats: {
          downloadsCount: 45,
          editedVideos: 8,
          clonesManaged: 3
        }
      }
    ];

    this.data.sessions = [];
    this.data.activity_logs = [
      {
        id: 'act_init_001',
        userId: 'usr_admin_001',
        action: 'system_init',
        details: 'Khởi tạo cơ sở dữ liệu hệ thống TMD Studio Pro',
        timestamp: new Date().toISOString()
      }
    ];
  }

  // --- Auth & Account Operations ---

  findUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  findUserByPhone(phone) {
    if (!phone) return null;
    const cleanPhone = phone.replace(/[\s\.\-\+]/g, '');
    return this.data.users.find(u => u.phone.replace(/[\s\.\-\+]/g, '') === cleanPhone);
  }

  findUserByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim();
    if (clean.includes('@')) {
      return this.findUserByEmail(clean);
    }
    return this.findUserByPhone(clean);
  }

  getUserById(id) {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return null;
    const { passwordHash, salt, ...safeUser } = user;
    return safeUser;
  }

  registerUser({ email, phone, password, fullname }) {
    if (!email || !email.includes('@')) {
      throw new Error('Email không hợp lệ. Vui lòng nhập đúng định dạng!');
    }

    const cleanPhone = (phone || '').replace(/[\s\.\-\+]/g, '');
    if (!cleanPhone || cleanPhone.length < 9 || !/^\d+$/.test(cleanPhone)) {
      throw new Error('Số điện thoại không hợp lệ (tối thiểu 9-11 số)!');
    }

    if (!password || password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự!');
    }

    if (this.findUserByEmail(email)) {
      throw new Error('Email này đã được sử dụng bởi một tài khoản khác!');
    }

    if (this.findUserByPhone(cleanPhone)) {
      throw new Error('Số điện thoại này đã được đăng ký trong hệ thống!');
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = this.hashPassword(password, salt);
    const userId = 'usr_' + Date.now().toString(36) + '_' + crypto.randomBytes(3).toString('hex');

    const newUser = {
      id: userId,
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      passwordHash,
      salt,
      fullname: (fullname || 'Thành viên mới').trim(),
      role: 'creator',
      plan: 'Free Trial 2026',
      status: 'active',
      avatar: '👤',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      stats: {
        downloadsCount: 0,
        editedVideos: 0,
        clonesManaged: 0
      }
    };

    this.data.users.push(newUser);
    this.logActivity(userId, 'user_register', `Đăng ký tài khoản thành công qua email ${email} và SĐT ${cleanPhone}`);
    this.save();

    const { passwordHash: _, salt: __, ...safeUser } = newUser;
    const token = this.createSession(userId);

    return { user: safeUser, token };
  }

  loginUser({ identifier, password }) {
    if (!identifier || !password) {
      throw new Error('Vui lòng nhập Email / SĐT và mật khẩu!');
    }

    const user = this.findUserByIdentifier(identifier);
    if (!user) {
      throw new Error('Tài khoản không tồn tại trong hệ thống!');
    }

    if (user.status === 'suspended') {
      throw new Error('Tài khoản này đã bị khóa. Vui lòng liên hệ Admin!');
    }

    const inputHash = this.hashPassword(password, user.salt);
    if (inputHash !== user.passwordHash) {
      throw new Error('Mật khẩu không chính xác. Vui lòng thử lại!');
    }

    user.lastLogin = new Date().toISOString();
    this.logActivity(user.id, 'user_login', `Đăng nhập thành công vào hệ thống`);
    this.save();

    const token = this.createSession(user.id);
    const { passwordHash: _, salt: __, ...safeUser } = user;

    return { user: safeUser, token };
  }

  createSession(userId) {
    const token = 'tmd_tok_' + crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    this.data.sessions.push({
      token,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt
    });

    // Cleanup expired sessions
    const now = new Date().toISOString();
    this.data.sessions = this.data.sessions.filter(s => s.expiresAt > now);

    this.save();
    return token;
  }

  verifySession(token) {
    if (!token) return null;
    const session = this.data.sessions.find(s => s.token === token);
    if (!session) return null;

    if (new Date(session.expiresAt) < new Date()) {
      this.deleteSession(token);
      return null;
    }

    return this.getUserById(session.userId);
  }

  deleteSession(token) {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }

  getAllUsers() {
    return this.data.users.map(u => {
      const { passwordHash, salt, ...safeUser } = u;
      return safeUser;
    });
  }

  updateUser(id, updates) {
    const user = this.data.users.find(u => u.id === id);
    if (!user) throw new Error('Không tìm thấy người dùng!');

    if (updates.fullname !== undefined) user.fullname = updates.fullname;
    if (updates.role !== undefined) user.role = updates.role;
    if (updates.plan !== undefined) user.plan = updates.plan;
    if (updates.status !== undefined) user.status = updates.status;
    if (updates.phone !== undefined) {
      const cleanPhone = updates.phone.replace(/[\s\.\-\+]/g, '');
      const existing = this.findUserByPhone(cleanPhone);
      if (existing && existing.id !== id) {
        throw new Error('Số điện thoại này đã được dùng bởi tài khoản khác!');
      }
      user.phone = cleanPhone;
    }
    if (updates.password && updates.password.length >= 6) {
      user.salt = crypto.randomBytes(16).toString('hex');
      user.passwordHash = this.hashPassword(updates.password, user.salt);
    }

    this.save();
    const { passwordHash, salt, ...safeUser } = user;
    return safeUser;
  }

  deleteUser(id) {
    const user = this.data.users.find(u => u.id === id);
    if (!user) throw new Error('Không tìm thấy người dùng!');
    if (user.role === 'admin') throw new Error('Không thể xóa tài khoản Quản Trị Viên hệ thống!');

    this.data.users = this.data.users.filter(u => u.id !== id);
    this.data.sessions = this.data.sessions.filter(s => s.userId !== id);
    this.logActivity(id, 'user_deleted', `Xóa tài khoản ${user.email} (${user.phone})`);
    this.save();
    return true;
  }

  logActivity(userId, action, details) {
    this.data.activity_logs.unshift({
      id: 'act_' + Date.now().toString(36),
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    });

    if (this.data.activity_logs.length > 500) {
      this.data.activity_logs = this.data.activity_logs.slice(0, 500);
    }
  }

  // --- Social Content Matrix Schedules ---
  getSchedules() {
    if (!this.data.schedules) this.data.schedules = [];
    if (this.data.schedules.length === 0) {
      // Seed initial sample schedules
      this.data.schedules = [
        {
          id: 'sch_001',
          title: 'NST Viet Mix Vol 4 - Drop 30s',
          videoSrc: '@nhacnghedixe/7675792462593428756.mp4',
          platform: 'TikTok',
          targetAccount: '@nhacnghedixe (Chính)',
          publishDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          publishTime: '11:30',
          status: 'Đã lên lịch',
          caption: 'Bản phối cực bốc cho anh em đi tour! #xuhuong #fyp #vinahouse'
        },
        {
          id: 'sch_002',
          title: 'DJ KenBjn Lỡ Yêu Remix - Shorts',
          videoSrc: '@nhacnghedixe/7696392556535418113.mp4',
          platform: 'YouTube',
          targetAccount: 'Shorts Music Official',
          publishDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          publishTime: '19:30',
          status: 'Đã lên lịch',
          caption: 'Nhạc bay phòng 2026 cực căng #Shorts #YouTubeShorts'
        },
        {
          id: 'sch_003',
          title: 'VietMix Teaser 15s Story',
          videoSrc: '@nhacnghedixe/7675792462593428756.mp4',
          platform: 'Facebook',
          targetAccount: 'Fanpage Nhạc Nghe Đi Xe',
          publishDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          publishTime: '12:00',
          status: 'Bản nháp',
          caption: 'Anh em chấm mấy điểm cho con beat này? #reels #nhachay'
        }
      ];
      this.save();
    }
    return this.data.schedules;
  }

  addSchedule(schedule) {
    if (!this.data.schedules) this.data.schedules = [];
    schedule.id = 'sch_' + Date.now().toString(36);
    schedule.createdAt = new Date().toISOString();
    this.data.schedules.unshift(schedule);
    this.save();
    return schedule;
  }

  deleteSchedule(id) {
    if (!this.data.schedules) return;
    this.data.schedules = this.data.schedules.filter(s => s.id !== id);
    this.save();
    return true;
  }

  // --- Team Workspace Members ---
  getTeamMembers() {
    if (!this.data.team_members) this.data.team_members = [];
    if (this.data.team_members.length === 0) {
      this.data.team_members = [
        {
          id: 'tm_001',
          name: 'Trần Minh Đức',
          email: 'duc.editor@tmdstudio.com',
          role: 'Video Editor',
          status: 'Hoạt động',
          assignedClones: 3,
          tasksCompleted: 42
        },
        {
          id: 'tm_002',
          name: 'Võ Thị Thanh Thảo',
          email: 'thao.seeder@tmdstudio.com',
          role: 'Clone Seeder',
          status: 'Hoạt động',
          assignedClones: 5,
          tasksCompleted: 88
        },
        {
          id: 'tm_003',
          name: 'Hoàng Quốc Việt',
          email: 'viet.manager@tmdstudio.com',
          role: 'Growth Manager',
          status: 'Hoạt động',
          assignedClones: 10,
          tasksCompleted: 156
        }
      ];
      this.save();
    }
    return this.data.team_members;
  }

  addTeamMember(member) {
    if (!this.data.team_members) this.data.team_members = [];
    member.id = 'tm_' + Date.now().toString(36);
    member.tasksCompleted = 0;
    this.data.team_members.push(member);
    this.save();
    return member;
  }

  deleteTeamMember(id) {
    if (!this.data.team_members) return;
    this.data.team_members = this.data.team_members.filter(m => m.id !== id);
    this.save();
    return true;
  }

  // --- Anti-Reup Video Cloaking Presets ---
  getAntiReupPresets() {
    return [
      {
        id: 'anti_reup_standard',
        name: 'Tiêu chuẩn TikTok / Shorts',
        speedJitter: 1.01,
        pitchShift: 0.2,
        microZoom: 1.02,
        mirrorFlip: false,
        noiseOverlay: 0.03,
        md5Jitter: true,
        desc: 'Khuyên dùng cho video edit nhạc, giữ nguyên trải nghiệm xem nhưng đổi sạch chữ ký số.'
      },
      {
        id: 'anti_reup_aggressive',
        name: 'Lách mạnh (Maximum Stealth Cloaking)',
        speedJitter: 1.025,
        pitchShift: 0.4,
        microZoom: 1.04,
        mirrorFlip: true,
        noiseOverlay: 0.06,
        md5Jitter: true,
        desc: 'Phù hợp đăng lại video tổng hợp hoặc clone vệ tinh, vượt 100% thuật toán quét trùng lặp.'
      }
    ];
  }

  // --- Clone Warm-up Workflow Logs ---
  getWarmupLogs() {
    if (!this.data.warmup_logs) this.data.warmup_logs = [];
    return this.data.warmup_logs;
  }

  addWarmupLog(log) {
    if (!this.data.warmup_logs) this.data.warmup_logs = [];
    log.id = 'wrm_' + Date.now().toString(36);
    log.timestamp = new Date().toISOString();
    this.data.warmup_logs.unshift(log);
    if (this.data.warmup_logs.length > 50) this.data.warmup_logs = this.data.warmup_logs.slice(0, 50);
    this.save();
    return log;
  }

  // --- Billing & VietQR Payment Generator ---
  createVietQRPayment(planType = 'vip_lifetime', userEmail = 'admin@tmdstudio.com') {
    const plans = {
      vip_lifetime: { name: 'VIP Pro Lifetime 2026', priceVND: 999000, desc: 'Bản quyền trọn đời, không giới hạn video render & clone' },
      creator_monthly: { name: 'Creator Pro 1 Tháng', priceVND: 199000, desc: '30 ngày render không giới hạn & 10 clone' },
      credit_pack: { name: 'Gói 500 Credits AI', priceVND: 99000, desc: 'Sử dụng các tính năng AI Auto-Clip & Voiceover' }
    };

    const selected = plans[planType] || plans.vip_lifetime;
    const orderCode = 'TMD' + Math.floor(100000 + Math.random() * 900000);
    const bankAccount = '999988882026';
    const bankBin = '970422'; // MB Bank
    const bankName = 'MB Bank (Ngân hàng Quân Đội)';
    const accountName = 'TMD STUDIO PRO OFFICIAL';

    // Quick VietQR Image URL
    const qrUrl = `https://img.vietqr.io/image/${bankBin}-${bankAccount}-compact2.png?amount=${selected.priceVND}&addInfo=${orderCode}&accountName=${encodeURIComponent(accountName)}`;

    const tx = {
      orderCode,
      planName: selected.name,
      amountVND: selected.priceVND,
      amountFormatted: selected.priceVND.toLocaleString('vi-VN') + ' đ',
      bankName,
      bankAccount,
      accountName,
      qrUrl,
      userEmail,
      createdAt: new Date().toISOString(),
      status: 'Chờ thanh toán'
    };

    if (!this.data.billing_transactions) this.data.billing_transactions = [];
    this.data.billing_transactions.unshift(tx);
    this.save();

    return tx;
  }

  getSystemStats() {
    const totalUsers = this.data.users ? this.data.users.length : 0;
    const activeUsers = this.data.users ? this.data.users.filter(u => u.status === 'active').length : 0;
    const adminCount = this.data.users ? this.data.users.filter(u => u.role === 'admin').length : 0;
    const totalDownloads = this.data.users ? this.data.users.reduce((acc, u) => acc + (u.stats?.downloadsCount || 0), 0) : 0;
    const totalSchedules = this.data.schedules ? this.data.schedules.length : 3;
    const totalTeamMembers = this.data.team_members ? this.data.team_members.length : 3;

    return {
      totalUsers,
      activeUsers,
      adminCount,
      totalDownloads,
      totalSchedules,
      totalTeamMembers,
      activeSessions: this.data.sessions ? this.data.sessions.length : 0
    };
  }
}

const db = new TMDDatabase();
module.exports = db;

