const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// 資料庫連線
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "861127",
  database: "coffeepj",
});

// 測試用
router.get("/", (req, res) => {
  res.json({ message: "Hello from API route!" });
});

// 商品 API
router.get("/products", (req, res) => {
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

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

//商品分類
router.get("/kinds", (req, res) => {
  const query = "SELECT id,name FROM kind";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;
