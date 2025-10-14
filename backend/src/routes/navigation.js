const express = require('express');
const router = express.Router();

const { loadNavigation, saveNavigation } = require("../utils/navigation");
const { backupData } = require("../utils/data");

// Routen für Navigation

router.get('/', (req, res) => {
    try {
        const navigationData = loadNavigation();
        res.json(navigationData); // Direkt das Navigation-Objekt senden
    } catch (error) {
        console.error("Error loading navigation:", error);
        res.status(500).json({ success: false, message: "Fehler beim Laden der Navigation" });
    }
});

router.put('/', (req, res) => {
    try {
        const newNavigation = req.body;
        
        if (!newNavigation || typeof newNavigation !== 'object') {
            return res.status(400).json({ success: false, message: "Ungültige Navigationsdaten" });
        }

        // Backup der aktuellen Daten vor dem Speichern
        backupData().then((backupPath) => {
            console.log("Backup erstellt unter:", backupPath);
        }).catch((err) => {
            console.error("Fehler beim Erstellen des Backups:", err);
        });

        // Neue Navigationsdaten speichern (Fix hier!)
        saveNavigation(newNavigation);

        res.json(newNavigation); // Direkt das Navigation-Objekt senden
    } catch (error) {
        console.error("Error saving navigation:", error);
        res.status(500).json({ success: false, message: "Fehler beim Speichern der Navigation" });
    }
});

module.exports = router;