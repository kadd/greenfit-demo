const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const area = req.body.area || req.params.area;
    console.log("Area in multer:", area); // Sollte z.B. 'team' sein
    let uploadPath = path.join(__dirname, "../../uploads");
    if (area === "team") uploadPath = path.join(uploadPath, "team");
    else if (area === "gallery") uploadPath = path.join(uploadPath, "gallery");
    else if (area === "header") uploadPath = path.join(uploadPath, "header");
    else uploadPath = path.join(uploadPath, "other");

    // Ordner anlegen, falls nicht vorhanden
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routen für Datei-Uploads und -Downloads

// zeige alle Dateien in einem Bereich an
router.get("/list/:area", (req, res) => {
  const { area } = req.params;
  let dirPath = path.join(__dirname, "../../uploads");
  if (area === "team") dirPath = path.join(dirPath, "team");
  else if (area === "gallery") dirPath = path.join(dirPath, "gallery");
  else if (area === "header") dirPath = path.join(dirPath, "header");
  else dirPath = path.join(dirPath, "other");

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Fehler beim Lesen des Verzeichnisses" });
    }
    res.json({ success: true, files });
  });
});

// zeige alle Upload-Bereiche an
router.get("/areas", (req, res) => {
  const areas = [
   // { key: "team", label: "Team-Fotos", files: [] },
    { key: "gallery", label: "Galerie", files: [] },
    { key: "header", label: "Header-Bild", files: [] },
    { key: "other", label: "Sonstige Dateien", files: [] },
  ];

  for (let area of areas) {
    let dirPath = path.join(__dirname, "../../uploads");
    if (area.key === "team") dirPath = path.join(dirPath, "team");
    else if (area.key === "gallery") dirPath = path.join(dirPath, "gallery");
    else if (area.key === "header") dirPath = path.join(dirPath, "header");
    else dirPath = path.join(dirPath, "other");

    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      area.files = files;
    } else {
      area.files = [];
    }

    // Für den "team"-Bereich: Beispielhafte Mitglieder-Daten
    // die members müssen aus content.json kommen
    const content = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/content.json"), "utf-8"));
    if (area.key === "team") {
      area.members = content.team.members.map((member, idx) => ({
        name: member.name,
        role: member.role,
        filename: area.files[idx] || null,
      }));
    }
  }
  res.json({ success: true, areas });
});

router.get("/public_gallery", (req, res) => {
  const area = "gallery";
  let dirPath = path.join(__dirname, "../../uploads", area);

  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    res.json({ success: true, files });
  } else {
    res.json({ success: true, files: [] });
  }
});

// Allgemeiner Datei-Upload mit Angabe des Bereichs im Body
router.post("/", upload.fields([{ name: "file" }, { name: "area" }]), (req, res) => {
    console.log(req.files, req.body);
    console.log("Area:", req.body.area); // Sollte z.B. 'team' sein
    res.json({ success: true, filename: req.files.file[0].filename, area: req.body.area || "other" });
});

// Allgemeiner Datei-Upload (mit Angabe des Bereichs im Body)
router.post("/:area", upload.single("file"), (req, res) => {
  const { area } = req.params;
  console.log("Area:", area); // Sollte z.B. 'team' sein
  // Hier
  res.json({ success: true, filename: req.file.filename, area });
});

// Datei-Download (je nach Bereich)
router.get("/:area/:filename", (req, res) => {
  const { area, filename } = req.params;
  let filePath = path.join(__dirname, "../../uploads", filename);
  if (area === "team") filePath = path.join(__dirname, "../../uploads/team", filename);
  else if (area === "gallery") filePath = path.join(__dirname, "../../uploads/gallery", filename);
  else if (area === "header") filePath = path.join(__dirname, "../../uploads/header", filename);

  res.sendFile(filePath);
});

// Datei-Löschung
router.delete("/:filename", (req, res) => {
  const { filename } = req.params;
  const areas = ["team", "gallery", "header", "other"];
  let fileDeleted = false;

  for (let area of areas) {
    let filePath = path.join(__dirname, "../../uploads");
    if (area === "team") filePath = path.join(filePath, "team", filename);
    else if (area === "gallery") filePath = path.join(filePath, "gallery", filename);
    else if (area === "header") filePath = path.join(filePath, "header", filename);
    else filePath = path.join(filePath, "other", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      fileDeleted = true;
      break;
    }
  }

  if (fileDeleted) {
    res.json({ success: true, message: "Datei gelöscht" });
  } else {
    res.status(404).json({ success: false, message: "Datei nicht gefunden" });
  }
});

module.exports = router;