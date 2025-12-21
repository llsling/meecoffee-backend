const { supabase } = require("../supabase");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "未登入" });
  }

  const token = authHeader.split(" ")[1];

  // 1️⃣ 查 session
  const { data: session, error: sessionError } = await supabase
    .from("user_sessions")
    .select("user_id, expires_at")
    .eq("token", token)
    .single();

  if (sessionError || !session) {
    return res.status(401).json({ message: "token 無效" });
  }

  // 2️⃣ 檢查過期
  if (new Date(session.expires_at) < new Date()) {
    return res.status(401).json({ message: "token 已過期" });
  }

  // 3️⃣ 查使用者
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, phone")
    .eq("id", session.user_id)
    .single();

  if (userError || !user) {
    return res.status(401).json({ message: "使用者不存在" });
  }

  // 4️⃣ 掛到 req
  req.user = user; // { id, phone }
  next();
}

module.exports = authMiddleware;
