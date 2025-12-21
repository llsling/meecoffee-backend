//承接之前的封裝
const { supabase } = require("../supabase");
//查詢users
async function findUserByPhone(phone) {
  const { data } = await supabase
    //鏈式調用
    .from("users")
    .select("*")
    .eq("phone", phone) //過濾器
    .single(); //LIMIT 1
  return data;
}
//新增users
async function createUser({ phone, passwordHash }) {
  const { data, error } = await supabase
    .from("users")
    .insert([{ phone, password_hash: passwordHash }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

module.exports = {
  findUserByPhone,
  createUser,
};
