const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Hilfsfunktion zum Laden und Speichern von Team-Daten
const loadTeamData = () => {
  const filePath = path.join(__dirname, "../data/team.json");
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
  }
  return { members: [] };
};

const saveTeamData = (data) => {
  const filePath = path.join(__dirname, "../data/team.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Route zum Abrufen der Team-Daten
router.get("/", (req, res) => {
  const teamData = loadTeamData();
  res.json(teamData);
});

// Route zum Aktualisieren der Team-Daten
router.post("/", (req, res) => {
  const newTeamData = req.body;
  saveTeamData(newTeamData);
  res.json({ success: true, message: "Team-Daten aktualisiert." });
});

module.exports = router;

// Datei-Upload und -Verwaltung
const multer = require("multer");

// Speicherorte für verschiedene Bereiche
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Immer in den Team-Ordner speichern!
    cb(null, path.join(__dirname, "../../uploads/team"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Ergänzung in team.js
router.post("/photo/:member", multer({ storage }).single("file"), (req, res) => {
  const memberName = req.params.member;
  const teamData = loadTeamData();
  const member = teamData.members.find(m => m.name === memberName);
  if (member && req.file) {
    member.photoSrc = req.file.filename;
    saveTeamData(teamData);
    res.json({ success: true, filename: req.file.filename });
  } else {
    res.status(400).json({ success: false, message: "Mitglied oder Datei fehlt." });
  }
});

router.delete("/photo/:member", (req, res) => {
  const memberName = req.params.member;
  const teamData = loadTeamData();
  const member = teamData.members.find(m => m.name === memberName);
  if (member && member.photoSrc) {
    const filePath = path.join(__dirname, "../../uploads/team", member.photoSrc);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    member.photoSrc = "";
    saveTeamData(teamData);
    res.json({ success: true, message: "Foto gelöscht." });
  } else {
    res.status(400).json({ success: false, message: "Mitglied oder Foto fehlt." });
  }
});

// Exportiere den Router
module.exports = router;

