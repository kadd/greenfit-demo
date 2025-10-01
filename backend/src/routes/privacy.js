const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  const privacyPath = path.join(__dirname, '../data/privacy.json');
  console.log("Loading Privacy from:", privacyPath);
  fs.readFile(privacyPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Privacy konnten nicht geladen werden.' });
    }
    try {
      const privacy = JSON.parse(data);
      res.json(privacy);
    } catch (parseErr) {
      res.status(500).json({ error: 'Privacy-Daten sind ungültig.' });
    }
  });
});

module.exports = router;