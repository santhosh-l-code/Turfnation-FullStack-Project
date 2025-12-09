const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Allow React app to talk to backend
app.use(
  cors({
    origin: "*", // your frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// Routes (we’ll add later)
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const gameRoutes = require("./routes/game");
app.use("/api/game", gameRoutes);

const turfRoutes = require("./routes/turf");
app.use("/api/turf", turfRoutes);

app.use("/api/booking", require("./routes/booking"));


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
