const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const path = require("path");
const express = require("express");
const fs = require("fs");
const router = express.Router();

const { loadTeams, saveTeams } = require("../utils/teams");


// Datei-Upload und -Verwaltung zu Google Cloud Storage (GCS)
// https://cloud.google.com/storage/docs/reference/libraries#client-libraries-install-nodejs
// https://cloud.google.com/storage/docs/uploading-objects#storage-upload-object-nodejs

// GCS Schlüsseldatei (im .gitignore, nicht ins Repo!)
if (!fs.existsSync(path.join(__dirname, "../../gcs-key.json"))) {
  console.error("GCS Schlüsseldatei fehlt! Bitte gcs-key.json im backend-Ordner ablegen.");
  process.exit(1);
}

// GCS initialisieren
const storage = new Storage({
  keyFilename: path.join(__dirname, "../../gcs-key.json"),
  projectId: "greenfit-demo",
});
const bucket = storage.bucket("greenfit-demo-uploads");

// Multer Speicher im RAM (für direkten Upload zu GCS)
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", (req, res) => {
  res.send("GCS Upload Service");
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
      area.files = files
        .filter(file => file.name.startsWith(area.key + "/"))
        .map(file => ({
          name: path.basename(file.name),
          url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
        }));
    }
    res.json({ success: true, areas });
  });
});

router.post("/upload-photo/:teamId/:memberid", upload.single("file"), async (req, res) => {
  const memberId = req.params.memberid;
  const teamId = req.params.teamId;
  const teamData = loadTeams();
  const team = teamData.find(t => t.id === teamId);
  if (!team) return res.status(404).json({ error: "Team nicht gefunden." });
  const member = team.members.find(m => m.id === memberId);

  if (member && req.file) {
    // Dateiname generieren
    const gcsFileName = `team/${Date.now()}-${req.file.originalname}`;
    const blob = bucket.file(gcsFileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
      //public: true,
    });

    blobStream.on("error", err => res.status(500).json({ error: err.message }));
    blobStream.on("finish", async () => {
      // Öffentliche URL generieren
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      // Altes Foto ggf. löschen (optional, siehe GCS Doku)
      member.photoSrc = publicUrl;
      teamData.forEach(t => {
        if (t.id === teamId) {
          t.members = t.members.map(m => (m.id === memberId ? member : m));
        }
      });

      //altes Foto löschen
      
      if (member.photoSrc) {
        const oldFile = bucket.file(member.photoSrc);
        oldFile.delete().catch(err => console.error("Fehler beim Löschen des alten Fotos:", err));
      }
     

      // Team-Daten speichern
      saveTeams(teamData);
      res.json({ success: true, url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } else {
    res.status(400).json({ success: false, message: "Mitglied oder Datei fehlt." });
  }
});

router.delete("/deletephoto/:teamId/:memberid", async (req, res) => {
  const memberId = req.params.memberid;
  const teamId = req.params.teamId;
  const teamData = loadTeams();
  const team = teamData.find(t => t.id === teamId);
  if (!team) return res.status(404).json({ error: "Team nicht gefunden." });
  const member = team.members.find(m => m.id === memberId);
  if (member && member.photoSrc) {
    // Foto aus GCS löschen
    const filePath = member.photoSrc.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
    if (filePath) {
      const file = bucket.file(filePath);
      try {
        await file.delete();
      } catch (err) {
        console.error("Fehler beim Löschen des Fotos aus GCS:", err);
      }
    }
    // Foto-URL im Teammitglied zurücksetzen
    member.photoSrc = "";
    teamData.forEach(t => {
      if (t.id === teamId) {
        t.members = t.members.map(m => (m.id === memberId ? member : m));
      }
    });
    saveTeams(teamData);
    res.json({ success: true, message: "Foto gelöscht." });
  } else {
    res.status(400).json({ success: false, message: "Mitglied oder Foto fehlt." });
  }
});

module.exports = router;