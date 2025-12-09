const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

// ✅ Add a new game (Admin functionality)
router.post("/add", async (req, res) => {
  try {
    const { name, imageUrl } = req.body;

    // Check if game already exists
    const existingGame = await Game.findOne({ name });
    if (existingGame) {
      return res.status(400).json({ message: "Game already exists" });
    }

    // Create new game
    const newGame = new Game({ name, imageUrl });
    await newGame.save();

    res.status(201).json({
      message: "Game added successfully",
      game: newGame,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get all games (for homepage)
router.get("/", async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
