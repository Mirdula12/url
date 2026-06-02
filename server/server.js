const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const urlRoutes = require("./routes/urlRoutes");

const Url = require("./models/Url");

dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/url", urlRoutes);

// 👇 ADD HERE (IMPORTANT)
app.get("/:shortId", async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId });

  if (url) {
    url.clicks++;
    await url.save();

    return res.redirect(url.originalUrl);
  }

  res.status(404).send("Not found");
});

// Home route
app.get("/", (req, res) => {
  res.send("URL Shortener API Running 🚀");
});


// 🔥 REDIRECT ROUTE (SHORT URL -> ORIGINAL URL)
app.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    console.log("👉 Incoming shortId:", shortId);

    const urlData = await Url.findOne({ shortId });

    console.log("👉 DB Result:", urlData);

    if (!urlData) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    // increase click count
    urlData.clicks += 1;

urlData.visits.push({
  timestamp: new Date(),
});

await urlData.save();

    return res.redirect(urlData.originalUrl);
  } catch (err) {
    console.log("Redirect error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});