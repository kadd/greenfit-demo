const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  console.log("Loading Impressum from:", impressumPath);
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      res.json(impressum);
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});

module.exports = router;