const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  const termsPath = path.join(__dirname, '../data/terms.json');
  console.log("Loading Terms from:", termsPath);
  fs.readFile(termsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Terms konnten nicht geladen werden.' });
    }
    try {
      const terms = JSON.parse(data);
      res.json(terms);
    } catch (parseErr) {
      res.status(500).json({ error: 'Terms-Daten sind ungültig.' });
    }
  });
});

module.exports = router;