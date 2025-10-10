const express = require("express");
const router = express.Router();

const { loadHeader, saveHeader } = require("../utils/header");

router.get("/", (req, res) => {
  const headerData = loadHeader();
  res.json({ success: true, header: headerData });
});

router.post("/", (req, res) => {
  const newHeader = req.body;
  if (!newHeader || typeof newHeader !== "object") {
    return res.status(400).json({ success: false, message: "Ungültige Header-Daten" });
  }

  saveHeader(newHeader);
  res.json({ success: true, message: "Header-Daten aktualisiert", header: newHeader });
});

router.post("/gallery/check", (req, res) => {
  const { Storage } = require("@google-cloud/storage");
  const path = require("path");

  const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEYFILE_PATH,
  });

  console.log("GCP_PROJECT_ID:", process.env.GCP_PROJECT_ID);
  console.log("GCP_KEYFILE_PATH:", process.env.GCP_KEYFILE_PATH);

  // Bucket-Name aus Umgebungsvariablen

  const bucketName = process.env.GCP_BUCKET_NAME;
  const bucket = storage.bucket(bucketName);

  // Dateien aus dem Bucket auflisten
  bucket.getFiles((err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Fehler beim Lesen des Buckets" });
    }

    // Prüfen, ob Dateien im "gallery/" Ordner vorhanden sind
    const galleryFiles = files.filter(file => file.name.startsWith("gallery/") && file.name !== "gallery/");

    if (galleryFiles.length === 0) {
        // Galerie ist leer
        const headerData = loadHeader();
        headerData.navigation.gallery.isActive = false;
        saveHeader(headerData);
      return res.json({ success: true, isEmpty: true });
    } else {
        // Galerie ist nicht leer
        const headerData = loadHeader();
        headerData.navigation.gallery.isActive = true;
        saveHeader(headerData);
      return res.json({ success: true, isEmpty: false });
    }
  });
});

module.exports = router;