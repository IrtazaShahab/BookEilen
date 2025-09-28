const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// GET books by query
router.get("/", async (req, res) => {
  const { q, startIndex = 0, maxResults = 10 } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    const url = `${process.env.GOOGLE_API_URL}?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=${maxResults}&key=${process.env.GOOGLE_API_KEY}`;
    const response = await fetch(url); // Built-in fetch, no import needed

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Error fetching books" });
  }
});

// GET books by category
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const { startIndex = 0, maxResults = 10 } = req.query;

  try {
    const url = `${process.env.GOOGLE_API_URL}?q=subject:${encodeURIComponent(category)}&startIndex=${startIndex}&maxResults=${maxResults}&key=${process.env.GOOGLE_API_KEY}`;
    const response = await fetch(url); // Built-in fetch

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching category books:", error);
    res.status(500).json({ error: "Error fetching category books" });
  }
});

module.exports = router;
