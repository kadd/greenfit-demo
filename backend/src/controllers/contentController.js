const fs = require('fs');
const path = require('path');

const contentPath = path.join(__dirname, '../data/content.json');

exports.getContent = (req, res) => {
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  console.log(content);
  res.json(content);
};

exports.updateContent = (req, res) => {
  const newContent = req.body;
  fs.writeFileSync(contentPath, JSON.stringify(newContent, null, 2), 'utf8');
  res.json({ success: true, message: 'Inhalte aktualisiert' });
};
