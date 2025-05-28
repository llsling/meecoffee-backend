const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

// 資料庫連線
const pool = new Pool({
  host: "db.rgypfenexbzbgzctfgsg.supabase.co",
  user: "postgres",
  password: "yMCsV76xe2g@+wt",
  database: "meecoffee",
  port: 5432,
  ssl: { rejectUnauthorized: false },
  statement_timeout: 10000,
});

// 測試用
router.get("/", (req, res) => {
  res.json({ message: "Hello from API route!" });
});

// 商品 API
router.get("/products", async (req, res) => {
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
  const query = "SELECT id,name FROM kind";
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
