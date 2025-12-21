const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { supabase } = require("../supabase");
//把明文密碼變成一串亂碼（雜湊值）
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
//驗證
async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
//製作亂碼 ID
function generateToken() {
  //crypto.randomBytes(32)產生原始資料
  return crypto.randomBytes(32).toString("hex");
}
//發放並記錄通行證
async function createSession(userId) {
  const token = generateToken(); //生出通行證
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //設定期限(7天)
  //調用Supabase存入user_sessions表
  const { error } = await supabase.from("user_sessions").insert([
    {
      user_id: userId,
      token,
      expires_at: expiresAt,
    },
  ]);
  if (error) throw error;
  return { token, expiresAt }; //把token發給前端
}

module.exports = {
  hashPassword,
  verifyPassword,
  createSession,
};
