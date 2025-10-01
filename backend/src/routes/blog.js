const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  const blogPath = path.join(__dirname, '../data/blog.json');
  console.log("Loading Blog from:", blogPath);
  fs.readFile(blogPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Blog konnte nicht geladen werden.' });
    }
    try {
      const blogs = JSON.parse(data);
      res.json(blogs);
    } catch (parseErr) {
      res.status(500).json({ error: 'Blog-Daten sind ungültig.' });
    }
  });
});

module.exports = router;