const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema({
  // Turf name
  name: {
    type: String,
    required: true,
    trim: true,
  },

  // Turf location
  location: {
    type: String,
    required: true,
  },

  // Cloudinary image URL
  imageUrl: {
    type: String,
    required: true,
  },

  // Price per hour for booking
  pricePerHour: {
    type: Number,
    required: true,
    min: 0,
  },

  // Contact number for inquiries
  contact: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // simple validation for 10-digit phone numbers
  },

  // Short description about the turf
  description: {
    type: String,
    default: "",
  },

  // Dynamic slots — added by owner when they create the turf
  slots: {
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "At least one time slot must be provided",
    },
  },

  // Bookings stored as a map (date => booked slots)
  bookings: {
    type: Map,
    of: [String], // example: { "2025-11-07": ["9am-10am", "10am-11am"] }
    default: {},
  },

  // Owner who added the turf
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // The game this turf belongs to
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },

  // Auto timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Turf", turfSchema);
