const express = require("express");
const router = express.Router();
const Turf = require("../models/Turf");
const Game = require("../models/Game");
const User = require("../models/User");
// ✅ Add a new turf (Owner adds)
router.post("/add", async (req, res) => {
  console.log("POST /api/turf/add — body:", req.body);

  try {
    const {
      name,
      location,
      imageUrl,
      pricePerHour,
      contact,
      description,
      slots,
      owner, // ✅ matches frontend
      game,  // ✅ matches frontend
    } = req.body;

    // ✅ Check if the game exists
    const gameExists = await Game.findById(game);
    if (!gameExists) return res.status(404).json({ message: "Game not found" });

    // ✅ Check if the owner exists
    const ownerExists = await User.findById(owner);
    if (!ownerExists)
      return res.status(404).json({ message: "Owner not found" });

    // ✅ Create the turf
    const newTurf = new Turf({
      name,
      location,
      imageUrl,
      pricePerHour,
      contact,
      description,
      slots,
      owner,
      game,
    });

    await newTurf.save();

    res
      .status(201)
      .json({ message: "Turf added successfully", turf: newTurf });
  } catch (error) {
    console.error("Error adding turf:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ✅ Get all turfs (for debugging or admin)
router.get("/", async (req, res) => {
  try {
    const turfs = await Turf.find().populate("game", "name").populate("owner", "name email");
    res.status(200).json({ turfs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get turfs by Game ID (for frontend display)
// ✅ Get turfs by Game ID (for frontend display)
router.get("/game/:gameId", async (req, res) => {
  try {
    const turfs = await Turf.find({ game: req.params.gameId })
  .populate("game", "name")
  .populate("owner", "name email"); // ✅ Add this line

    res.status(200).json({ turfs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// ✅ Get single turf by ID
router.get("/:turfId", async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.turfId)
      .populate("game", "name")
      .populate("owner", "name email");

    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    res.status(200).json({ turf });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});



// ✅ Get turfs by Owner ID (for Owner Dashboard)
router.get("/owner/:ownerId", async (req, res) => {
  try {
    const turfs = await Turf.find({ owner: req.params.ownerId }).populate("game", "name");
    res.status(200).json({ turfs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete turf by ID (owner only)
router.delete("/:turfId", async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.turfId);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    // Delete the turf
    await turf.deleteOne();

    res.status(200).json({ message: "Turf deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Update turf
// routes/turfRoutes.js
router.put("/:id", async (req, res) => {
  try {
    const { name, location, pricePerHour, description, slots } = req.body;

    const turf = await Turf.findByIdAndUpdate(
      req.params.id,
      { name, location, pricePerHour, description, slots },
      { new: true }
    );

    if (!turf) return res.status(404).json({ message: "Turf not found" });

    res.json({ message: "Turf updated successfully", turf });
  } catch (error) {
    res.status(500).json({ message: "Failed to update turf", error });
  }
});





module.exports = router;
