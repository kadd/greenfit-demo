const express = require("express");
const router = express.Router();

const { loadHeader, saveHeader } = require("../utils/header");
const { backupData } = require("../utils/data");

const { bucket, bucketName } = require("../services/storage");
const multer = require("multer");

// Multer Speicher im RAM (für direkten Upload zu GCS)
const upload = multer({ storage: multer.memoryStorage() });

// Routen für Header-Daten

router.get("/", (req, res) => {
  const headerData = loadHeader();
  res.json({ success: true, header: headerData });
});

// Unterschied put und post: put ist idempotent, post nicht
router.put("/", (req, res) => {
  const newHeader = req.body;
  if (!newHeader || typeof newHeader !== "object") {
    return res.status(400).json({ success: false, message: "Ungültige Header-Daten" });
  }
  console.log("Neue Header-Daten erhalten:", newHeader);
  
  // Backup der aktuellen Daten vor dem Speichern
  backupData().then((backupPath) => {
    console.log("Backup erstellt unter:", backupPath);
  }).catch((err) => {
    console.error("Fehler beim Erstellen des Backups:", err);
  });

  // Neue Header-Daten speichern
  saveHeader(newHeader);
  res.json({ success: true, message: "Header-Daten aktualisiert", header: newHeader });
});

router.post("/gallery/check", (req, res) => {

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

// Datei-Upload für Header-Bild
// backend/src/routes/header.js - Upload Route korrigieren:

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("=== UPLOAD DEBUG ===");
    console.log("Received file:", req.file ? "✅ SUCCESS" : "❌ MISSING");
    console.log("File size:", req.file?.size);
    console.log("File type:", req.file?.mimetype);
    console.log("==================");

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Keine Datei hochgeladen"
      });
    }

    const folder = req.body.folder || 'header';
    const fileName = `${folder}/${Date.now()}-${req.file.originalname}`;
    
    // Upload zu Google Cloud Storage
    const file = bucket.file(fileName);
    
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      // ❌ ENTFERNEN - das verursacht den 400 Error:
      // predefinedAcl: 'publicRead',
    });

    stream.on('error', (err) => {
      console.error('Upload stream error:', err);
      res.status(500).json({ 
        success: false, 
        message: "Fehler beim Upload zu Google Cloud Storage" 
      });
    });

    stream.on('finish', async () => {
      console.log('✅ Upload finished successfully');
      
      // Öffentliche URL erstellen
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      
      // Optional: File öffentlich machen (falls der Bucket nicht öffentlich ist)
      try {
        await file.makePublic();
        console.log('✅ File made public');
      } catch (publicError) {
        console.log('ℹ️ Could not make file public (uniform bucket access)');
        // Das ist OK - wenn der Bucket öffentlich ist, funktioniert es trotzdem
      }
      
      res.json({ 
        success: true, 
        url: publicUrl,
        fileName: fileName,
        message: "Upload erfolgreich"
      });
    });

    stream.end(req.file.buffer);

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server-Fehler beim Upload",
      error: error.message 
    });
  }
});

module.exports = router;