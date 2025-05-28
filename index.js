// backend/index.js
const cors = require("cors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
