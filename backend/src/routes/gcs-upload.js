
const multer = require("multer");
const path = require("path");
const express = require("express");
const fs = require("fs");
const router = express.Router();


const {  bucket } = require("../services/storage");


// Datei-Upload und -Verwaltung zu Google Cloud Storage (GCS)
// https://cloud.google.com/storage/docs/reference/libraries#client-libraries-install-nodejs
// https://cloud.google.com/storage/docs/uploading-objects#storage-upload-object-nodejs

// Multer Speicher im RAM (für direkten Upload zu GCS)
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", (req, res) => {
  res.send("GCS Upload Service");
});

router.get('list', (req, res) => {
  bucket.getFiles((err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Fehler beim Lesen des Buckets" });
    }
    const fileList = files.map(file => ({
      name: file.name,
      url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
    }));
    res.json({ success: true, files: fileList });
  });
});

// Verfügbare Upload-Bereiche und deren Dateien auflisten
router.get("/public_gallery", (req, res) => {
  bucket.getFiles((err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Fehler beim Lesen des Buckets" });
    }

    // Nur Dateien im "gallery/" Ordner zurückgeben
    // wenn der Ordner leer ist, wird ein leeres Array zurückgegeben 

    const publicFiles = files
      .filter(file => file.name.startsWith("gallery/") && file.name !== "gallery/")
      .map(file => ({
        name: file.name.replace("gallery/", ""),
        url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
      }));

    // Leere Galerie zurückgeben, wenn keine Dateien vorhanden sind
    if (publicFiles.length === 0) {
      return res.json({ success: true, files: [] });
    }

    console.log("Public Gallery Files:", publicFiles);
    res.json({ success: true, files: publicFiles });
  });
});

router.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "Öffentlicher Upload-Service ist aktiv.",
  });
});

router.get("/areas", (req, res) => {
  const areas = [
    { key: "team", label: "Team-Fotos", files: [] },
    { key: "gallery", label: "Galerie", files: [] },
    { key: "header", label: "Header-Bild", files: [] },
    { key: "other", label: "Sonstige Dateien", files: [] },
  ];

  // Dateien aus GCS auflisten
  bucket.getFiles((err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Fehler beim Lesen des Buckets" });
    }
    for (let area of areas) {

      // live url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
      // wenn der Ordner leer ist, wird ein leeres Array zurückgegeben
      area.files = files
        .filter(file => file.name.startsWith(area.key + "/") && file.name !== area.key + "/")
        .map(file => ({
          name: path.basename(file.name),
          url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
        }));
    }
    res.json({ success: true, areas });
  });
});


router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Keine Datei hochgeladen." });
  }

  // Dateiname generieren
  const gcsFileName = `other/${Date.now()}-${req.file.originalname}`;
  const blob = bucket.file(gcsFileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: req.file.mimetype,
    //public: true,
  });

  blobStream.on("error", err => res.status(500).json({ error: err.message }));
  blobStream.on("finish", () => {
    // Öffentliche URL generieren
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.json({ success: true, url: publicUrl });
  });

  blobStream.end(req.file.buffer);
});

router.post("/upload-to/:area", upload.single("file"), (req, res) => {
  const area = req.params.area;
  const validAreas = ["team", "gallery", "header", "other"];
  if (!validAreas.includes(area)) {
    return res.status(400).json({ success: false, message: "Ungültiger Upload-Bereich." });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Keine Datei hochgeladen." });
  }

  // Dateiname generieren
  const gcsFileName = `${area}/${Date.now()}-${req.file.originalname}`;
  const blob = bucket.file(gcsFileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: req.file.mimetype,
    //public: true,
  });

  blobStream.on("error", err => res.status(500).json({ error: err.message }));
  blobStream.on("finish", () => {
    // Öffentliche URL generieren
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.json({ success: true, url: publicUrl });
  });

  blobStream.end(req.file.buffer);
});

module.exports = router;