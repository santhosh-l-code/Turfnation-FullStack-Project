const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  // The sport name (e.g., Cricket, Football)
  name: {
    type: String,
    required: true,
    unique: true, // prevent duplicates like "Cricket" twice
    trim: true,
  },

  // Image URL from Cloudinary (we only store the URL, not the file)
  imageUrl: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Game", gameSchema);
