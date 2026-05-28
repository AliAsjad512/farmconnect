const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// ─────────────────────────────────────────────────────
//  "db" below is NOT an IP address – it's the Docker
//  service name. Docker's internal DNS resolves "db"
//  to the farmconnect-db container's IP automatically.
// ─────────────────────────────────────────────────────
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Retry connection (DB may still be initialising)
async function waitForDB(retries = 10, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query("SELECT 1");
      console.log("✅  Connected to database 'db' via Docker DNS");
      return;
    } catch {
      console.log(`⏳  Waiting for DB… attempt ${i + 1}/${retries}`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error("Could not connect to database");
}

// ── Routes ────────────────────────────────────────────

// Health – also shows network info
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS time");
    res.json({
      status: "ok",
      db_hostname_used: "db",        // <── this is Docker DNS in action
      db_time: result.rows[0].time,
      message: "API → DB communication via Docker network DNS"
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

// List all farms
app.get("/farms", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM farms ORDER BY id");
  res.json(rows);
});

// Get a single farm
app.get("/farms/:id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM farms WHERE id = $1", [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Farm not found" });
  res.json(rows[0]);
});

// Add a farm
app.post("/farms", async (req, res) => {
  const { name, location, crop } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO farms (name, location, crop) VALUES ($1,$2,$3) RETURNING *",
    [name, location, crop]
  );
  res.status(201).json(rows[0]);
});

// Delete a farm
app.delete("/farms/:id", async (req, res) => {
  await pool.query("DELETE FROM farms WHERE id = $1", [req.params.id]);
  res.json({ deleted: true });
});

// ── Start ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
waitForDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀  FarmConnect API listening on port ${PORT}`)
  );
});
