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
      activity_logs: []
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

  getSystemStats() {
    const totalUsers = this.data.users.length;
    const activeUsers = this.data.users.filter(u => u.status === 'active').length;
    const adminCount = this.data.users.filter(u => u.role === 'admin').length;
    const totalDownloads = this.data.users.reduce((acc, u) => acc + (u.stats?.downloadsCount || 0), 0);

    return {
      totalUsers,
      activeUsers,
      adminCount,
      totalDownloads,
      activeSessions: this.data.sessions.length
    };
  }
}

const db = new TMDDatabase();
module.exports = db;
