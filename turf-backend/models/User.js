const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["user", "owner", "admin"], 
    default: "user" 
  },

  // Bookings for players/users
  bookings: [
    {
      type: String, // later can be changed to ObjectId if you build a Booking model
    },
  ],

  // Turfs owned by an owner
  ownedTurfs: [
    {
      type: String, // later can be ObjectId referencing Turf model
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
