const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Turf = require("../models/Turf");
const User = require("../models/User");
const Game = require("../models/Game");

// ✅ Create Booking (after payment success)
router.post("/add", async (req, res) => {
  try {
    const { turf, user, game, date, slot, price } = req.body;

    // check existing booking for same turf, slot, and date by same user
    const alreadyBooked = await Booking.findOne({ turf, user, date, slot });
    if (alreadyBooked) {
      return res
        .status(400)
        .json({ message: "You already booked this slot for this turf." });
    }

    // validate foreign keys
    const turfExists = await Turf.findById(turf);
    const userExists = await User.findById(user);
    const gameExists = await Game.findById(game);
    if (!turfExists || !userExists || !gameExists)
      return res.status(404).json({ message: "Invalid booking data" });

    const booking = new Booking({
      turf,
      user,
      game,
      date,
      slot,
      price,
      paymentStatus: "paid",
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// // ✅ Get all bookings of a specific user
// router.get("/user/:userId", async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.params.userId })
//       .populate("turf", "name location")
//       .populate("game", "name");
//     res.status(200).json({ bookings });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// ✅ Get all bookings for a specific turf
router.get("/turf/:turfId", async (req, res) => {
  try {
    const bookings = await Booking.find({ turf: req.params.turfId });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// Get all bookings for a specific user
// routes/bookingRoutes.js

router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).lean();
    console.log("✅ Bookings fetched:", bookings.length);

    for (let booking of bookings) {
      console.log("🔍 Fetching turf for booking:", booking._id, "=>", booking.turf);

      const turf = await Turf.findById(booking.turf).select("name location imageUrl pricePerHour contact");
      console.log("🏟️ Turf found:", turf);

      booking.turf = turf;
    }

    console.log("✅ Final bookings ready:", bookings.length);
    res.json({ bookings });
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    res.status(500).json({ message: "Failed to fetch user bookings", error });
  }
});



// Delete a booking
router.delete("/:bookingId", async (req, res) => {
  await Booking.findByIdAndDelete(req.params.bookingId);
  res.json({ message: "Booking canceled successfully" });
});


module.exports = router;
