const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authMiddleware = require("./middleware/authMiddleware");
const DefaultGenerator = require("./src/services/defaultGenerator");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

async function initializeDefaults() {
  const dataDir = path.join(__dirname, 'data');
   try {
    await DefaultGenerator.generateAllDefaults(dataDir); // pass { force: true } to overwrite
    console.log('✅ Default content generated successfully.');
  } catch (error) {
    console.error('❌ Error generating default content:', error);
    throw error;
  }
}

async function startServer() {
  await initializeDefaults();
  app.listen(5001, '0.0.0.0', () => console.log("Server läuft auf Port 5001"));
}

app.use(cors());

// ✅ CORS Fix für alle Routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight OPTIONS request handled:', req.originalUrl);
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Import Routes
const contactRequestsRoute = require("./src/routes/contactrequests");
const servicesRoute = require("./src/routes/services");
const authRoutes = require("./src/routes/auth");
const adminRoute = require("./src/routes/admin");
const contentRoute = require("./src/routes/content");
const uploadRoute = require("./src/routes/upload");
const teamRoute = require("./src/routes/teams");
const faqRoute = require("./src/routes/faq");
const blogRoute = require("./src/routes/blog");
const termsRoute = require("./src/routes/terms");
const privacyRoute = require("./src/routes/privacy");
const impressumRoute = require("./src/routes/impressum");
const gcsUploadRoutes = require("./src/routes/gcs-upload");
const headerRoutes = require("./src/routes/header");
const navigationRoutes = require("./src/routes/navigation");

// Upload Route (ohne Prefix, da spezifische Pfade)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use Routes
app.use("/api/services", servicesRoute);
app.use("/api/contactrequests", contactRequestsRoute);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/content", contentRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/teams", teamRoute);
app.use("/api/faq", faqRoute);
app.use("/api/blog", blogRoute);
app.use("/api/terms", termsRoute);
app.use("/api/privacy", privacyRoute);
app.use("/api/impressum", impressumRoute);
app.use("/api/gcs-upload", gcsUploadRoutes);
app.use("/api/header", headerRoutes);
app.use("/api/navigation", navigationRoutes);

// Root-Route
app.get("/", (req, res) => {
  res.json({ message: "Backend läuft 🚀" });
});

// Geschützte Route (nur mit gültigem Token erreichbar)
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ success: true, message: "Du hast Zugriff auf geschützte Daten 🚀", user: req.user });
});

startServer();
// --- IGNORE ---
