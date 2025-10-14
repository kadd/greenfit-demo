const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const teamsPath = path.join(__dirname, "../data/teams.json");

const { bucket, bucketName } = require("../services/storage");
const { loadTeams, saveTeams } = require("../utils/teams");
const { backupData } = require("../utils/data");

// Alle Teams abrufen
router.get("/", (req, res) => {
  const teams = loadTeams();
  console.log("Loaded teams:", teams);
  res.json(teams);
});

// Einzelnes Team abrufen
router.get("/:id", (req, res) => {
  const teams = loadTeams();
  const team = teams.find(t => t.id === req.params.id);
  if (!team) return res.status(404).json({ error: "Team nicht gefunden." });
  res.json(team);
});

// Neues Team erstellen
router.post("/", (req, res) => {
  const newTeam = req.body;
  if (!newTeam || !newTeam.label) {
    return res.status(400).json({ error: "Ungültige Team-Daten." });
  }
  newTeam.id = newTeam.id || `team-${Date.now()}`;
  newTeam.members = newTeam.members || [];
  const teams = loadTeams();
  teams.push(newTeam);
  saveTeams(teams);
  res.status(201).json(newTeam);
});

// Team aktualisieren
router.put("/:id", (req, res) => {
  const teamId = req.params.id;
  const updatedTeam = req.body;
  const teams = loadTeams();
  const idx = teams.findIndex(t => t.id === teamId);
  if (idx === -1) return res.status(404).json({ error: "Team nicht gefunden." });
  updatedTeam.id = teamId; // ID beibehalten
  teams[idx] = updatedTeam;

  // Backup der aktuellen Daten vor dem Speichern
  backupData().then((backupPath) => {
    console.log("Backup erstellt unter:", backupPath);
  }).catch((err) => {
    console.error("Fehler beim Erstellen des Backups:", err);
  });

  saveTeams(teams);
  res.json(updatedTeam);
});

// Team löschen
router.delete("/:id", (req, res) => {
  const teamId = req.params.id;
  let teams = loadTeams();
  const idx = teams.findIndex(t => t.id === teamId);
  if (idx === -1) return res.status(404).json({ error: "Team nicht gefunden." });
  teams.splice(idx, 1);

  // Backup der aktuellen Daten vor dem Speichern
  backupData().then((backupPath) => {
    console.log("Backup erstellt unter:", backupPath);
  }).catch((err) => {
    console.error("Fehler beim Erstellen des Backups:", err);
  });

  saveTeams(teams);
  res.json({ message: "Team gelöscht." });
});

// Mitglied zu Team hinzufügen
router.post("/:id/members", (req, res) => {
  const teamId = req.params.id;
  const newMember = req.body;
  if (!newMember || !newMember.name || !newMember.role) {
    return res.status(400).json({ error: "Ungültige Mitgliedsdaten." });
  }
  newMember.id = newMember.id || `member-${Date.now()}`;
  const teams = loadTeams();
  const team = teams.find(t => t.id === teamId);
  if (!team) return res.status(404).json({ error: "Team nicht gefunden." });
  team.members.push(newMember);
  saveTeams(teams);
  res.status(201).json(newMember);
});

// Mitglied eines Teams bearbeiten
router.put("/:teamId/members/:memberId", (req, res) => {
  const { teamId, memberId } = req.params;
  const updatedMember = req.body;
  const teams = loadTeams();
  const team = teams.find(t => t.id === teamId);
  if (!team) return res.status(404).json({ error: "Team nicht gefunden." });
  const idx = team.members.findIndex(m => m.id === memberId);
  if (idx === -1) return res.status(404).json({ error: "Mitglied nicht gefunden." });
  updatedMember.id = memberId;
  team.members[idx] = updatedMember;
  saveTeams(teams);
  res.json(updatedMember);
});

// Mitglied eines Teams löschen
router.delete("/:teamId/members/:memberId", (req, res) => {
  const { teamId, memberId } = req.params;
  const teams = loadTeams();
  const team = teams.find(t => t.id === teamId);
  if (!team) return res.status(404).json({ error: "Team nicht gefunden." });
  const idx = team.members.findIndex(m => m.id === memberId);
  if (idx === -1) return res.status(404).json({ error: "Mitglied nicht gefunden." });
  team.members.splice(idx, 1);
  saveTeams(teams);
  res.json({ message: "Mitglied gelöscht." });
});

// Datei-Upload und -Verwaltung
const multer = require("multer");

// Multer Speicher im RAM (für direkten Upload zu GCS)
const upload = multer({ storage: multer.memoryStorage() });

// Speicherorte für verschiedene Bereiche
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Immer in den Team-Ordner speichern!
//     cb(null, path.join(__dirname, "../../uploads/team"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// Ergänzung in team.js
// router.post("/upload-photo/:teamId/:memberid", multer({ storage }).single("file"), (req, res) => {
//   const memberId = req.params.memberid;
//   const teamId = req.params.teamId;
//   const teamData = loadTeams();
//   const team = teamData.find(t => t.id === teamId);
//   if (!team) return res.status(404).json({ error: "Team nicht gefunden." });
//   const member = team.members.find(m => m.id === memberId);
//   if (member && req.file) {
//     // Löschen des alten Fotos, falls vorhanden
//     if (member.photoSrc) {
//       const oldFilePath = path.join(__dirname, "../../uploads/team", member.photoSrc);
//       if (fs.existsSync(oldFilePath)) {
//         fs.unlinkSync(oldFilePath);
//       }
//     }
//     // Neues Foto zuweisen
//     member.photoSrc = req.file.filename;
//     teamData.forEach(t => {
//       if (t.id === teamId) {
//         t.members = t.members.map(m => (m.id === memberId ? member : m));
//       }
//     });
//     saveTeams(teamData);

   
//     res.json({ success: true, filename: req.file.filename });
//   } else {
//     res.status(400).json({ success: false, message: "Mitglied oder Datei fehlt." });
//   }
// });

// router.delete("/deletephoto/:teamId/:memberid", (req, res) => {
//   const memberId = req.params.memberid;
//   const teamId = req.params.teamId;
//   const teamData = loadTeams();
//   const team = teamData.find(t => t.id === teamId);
//   if (!team) return res.status(404).json({ error: "Team nicht gefunden." });
//   const member = team.members.find(m => m.id === memberId);
//   if (member && member.photoSrc) {
//     const filePath = path.join(__dirname, "../../uploads/team", member.photoSrc);
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }
//     member.photoSrc = "";
//     teamData.forEach(t => {
//       if (t.id === teamId) {
//         t.members = t.members.map(m => (m.id === memberId ? member : m));
//       }
//     });
//     saveTeams(teamData);
//     res.json({ success: true, message: "Foto gelöscht." });
//   } else {
//     res.status(400).json({ success: false, message: "Mitglied oder Foto fehlt." });
//   }
// });

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