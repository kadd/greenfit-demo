const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  const faqPath = path.join(__dirname, '../data/faq.json');
  console.log("Loading FAQ from:", faqPath);
  fs.readFile(faqPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'FAQ konnte nicht geladen werden.' });
    }
    try {
      const faqs = JSON.parse(data);
      res.json(faqs);
    } catch (parseErr) {
      res.status(500).json({ error: 'FAQ-Daten sind ungültig.' });
    }
  });
});

module.exports = router;