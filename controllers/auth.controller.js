const { supabase } = require("../supabase");
const { findUserByPhone, createUser } = require("../services/user.service");
const {
  hashPassword,
  verifyPassword,
  createSession,
} = require("../services/auth.service");
//註冊
async function register(req, res) {
  try {
    //檢查欄位有沒有填
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: "缺少必要欄位" });
    }
    //檢查重複
    const existingUser = await findUserByPhone(phone);
    if (existingUser) {
      return res.status(409).json({ message: "此手機已註冊" });
    }
    //加密
    const passwordHash = await hashPassword(password);
    //存進user
    const user = await createUser({ phone, passwordHash });
    const session = await createSession(user.id);
    res.status(201).json({
      user: { id: user.id, phone: user.phone },
      token: session.token,
      expiresAt: session.expiresAt,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "註冊失敗" });
  }
}
//登入
async function login(req, res) {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ message: "缺少必要欄位" });
    }
    const user = await findUserByPhone(phone);
    if (!user) {
      return res.status(401).json({ message: "帳號或密碼錯誤" });
    }
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "帳號或密碼錯誤" });
    }
    const session = await createSession(user.id);
    res.json({
      user: { id: user.id, phone: user.phone },
      token: session.token,
      expiresAt: session.expiresAt,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "登入失敗" });
  }
}
module.exports = { register, login };
