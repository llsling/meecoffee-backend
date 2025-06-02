const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres.rgypfenexbzbgzctfgsg:yMCsV76xe2g@+wt@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false },
  statement_timeout: 10000,
});
console.log("PostgreSQL pool created");

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
  const query = "SELECT id, name FROM kind";
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
