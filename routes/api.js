const express = require("express");
const router = express.Router();
const dns = require("dns").promises;
const { Pool } = require("pg");

let pool;
// 資料庫連線
(async () => {
  try {
    const resolved = await dns.lookup("db.rgypfenexbzbgzctfgsg.supabase.co", {
      family: 4,
    });
    pool = new Pool({
      connectionString:
        "postgresql://postgres.rgypfenexbzbgzctfgsg:yMCsV76xe2g@+wt@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
      ssl: { rejectUnauthorized: false },
      statement_timeout: 10000,
    });

    // pool = new Pool({
    //   host: resolved.address,
    //   port: 5432,
    //   user: "postgres",
    //   password: "yMCsV76xe2g@+wt",
    //   database: "postgre",
    //   ssl: { rejectUnauthorized: false },
    //   statement_timeout: 10000,
    // });
    console.log("PostgreSQL pool created");
  } catch (err) {
    console.error("Failed to resolve Supabase host:", err);
  }
})();

// 測試用
router.get("/", (req, res) => {
  res.json({ message: "Hello from API route!" });
});

// 商品 API
router.get("/products", async (req, res) => {
  if (!pool) return res.status(500).json({ error: "Database not connected" });
  const query = `
    SELECT 
      p.id, p.name, p.price, p.description, p.image_url AS img, p.country,p.kind_id,
      k.name AS kind,
      pr.name AS process,
      r.name AS roast
    FROM products p
    LEFT JOIN kind k ON p.kind_id = k.id
    LEFT JOIN process pr ON p.process_id = pr.id
    LEFT JOIN roast r ON p.roast_id = r.id
  `;

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//商品分類
router.get("/kinds", async (req, res) => {
  if (!pool) return res.status(500).json({ error: "Database not connected" });
  const query = "SELECT id,name FROM kind";
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
