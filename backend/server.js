const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authMiddleware = require("./middleware/authMiddleware");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import Routes
const contactRoute = require("./src/routes/contact");
const servicesRoute = require("./src/routes/services");
const authRoutes = require("./src/routes/auth");
const adminRoute = require("./src/routes/admin");
const contentRoute = require("./src/routes/content");
const uploadRoute = require("./src/routes/upload");

// Upload Route (ohne Prefix, da spezifische Pfade)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use Routes
app.use("/api/services", servicesRoute);
app.use("/api/contact", contactRoute);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/content", contentRoute);
app.use("/api/upload", uploadRoute);

// Root-Route
app.get("/", (req, res) => {
  res.json({ message: "Backend läuft 🚀" });
});

// Geschützte Route (nur mit gültigem Token erreichbar)
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ success: true, message: "Du hast Zugriff auf geschützte Daten 🚀", user: req.user });
});

app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
