import express from "express";
import cors from "cors";
import pool from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Needed in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "API is running successfully 🚀" });
});

// Lire les réservations (Pour la page Bonus à 2 points)
app.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Enregistrer une nouvelle réservation depuis le formulaire
app.post("/api/bookings", async (req, res) => {
  try {
    // On récupère les données envoyées par React
    const { fullName, email, bookingDate } = req.body;

    // On les insère dans la base de données
    const result = await pool.query(
      "INSERT INTO bookings (full_name, email, booking_date) VALUES ($1, $2, $3) RETURNING *",
      [fullName, email, bookingDate]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Insert failed:", error);
    res.status(500).json({ error: "Insert failed" });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});