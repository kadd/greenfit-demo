const fs = require('fs');
const path = require('path');
const { updateCity } = require('../../../../../ux/packages/backend/src/services/CityService');

const contentPath = path.join(__dirname, '../data/content.json');

exports.getContent = (req, res) => {
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  console.log(content);
  res.json(content);
};

exports.updateContent = (req, res) => {
  console.log(req.body);
  const newContent = req.body;
  fs.writeFileSync(contentPath, JSON.stringify(newContent, null, 2), 'utf8');
  res.json({ success: true, message: 'Inhalte aktualisiert' });
};

exports.updateTerms = (req, res) => {
  const { terms } = req.body;
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  content.termsLong = terms;
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
  res.json({ success: true, message: 'AGB aktualisiert', terms: content.termsLong });
}

exports.updatePrivacy = (req, res) => {
  const { privacy } = req.body;
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  content.privacyLong = privacy;
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
  res.json({ success: true, message: 'Datenschutz aktualisiert', privacy: content.privacyLong });
}

exports.updateFaq = (req, res) => {
  const { faq } = req.body;
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  content.faq = faq;
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
  res.json({ success: true, message: 'FAQ aktualisiert', faq: content.faq });
}
exports.updateBlog = (req, res) => {
  const { blog } = req.body;
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  content.blog = blog;
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
  res.json({ success: true, message: 'Blog aktualisiert', blog: content.blog });
}

exports.updateImpressum = (req, res) => {
  const { impressum } = req.body;
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  content.impressumLong = impressum;
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
  res.json({ success: true, message: 'Impressum aktualisiert', impressum: content.impressumLong });
}
