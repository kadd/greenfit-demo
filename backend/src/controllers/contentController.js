const fs = require('fs');
const path = require('path');
const { updateCity } = require('../../../../../ux/packages/backend/src/services/CityService');

const { backupData } = require("../utils/data");

const contentPath = path.join(__dirname, '../data/content.json');

exports.getContent = (req, res) => {
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  console.log(content);
  res.json(content);
};

exports.updateContent = (req, res) => {
  console.log(req.body);
  const newContent = req.body;
  if (!newContent || typeof newContent !== 'object') {
    return res.status(400).json({ success: false, message: 'Ungültige Inhaltsdaten' });
  }

  // Backup der aktuellen Daten vor dem Speichern
  backupData().then((backupPath) => {
    console.log("Backup erstellt unter:", backupPath);
  }).catch((err) => {
    console.error("Fehler beim Erstellen des Backups:", err);
  });

  // Neue Inhaltsdaten speichern
  fs.writeFileSync(contentPath, JSON.stringify(newContent, null, 2), 'utf8');
  res.json({ success: true, message: 'Inhalte aktualisiert' });
};

exports.updateTerms = (req, res) => {
  const { terms } = req.body;

  if (!terms || typeof terms !== 'string') {
    return res.status(400).json({ success: false, message: 'Ungültige AGB-Daten' });
  }

  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  content.termsLong = terms;

  // Backup der aktuellen Daten vor dem Speichern
  backupData().then((backupPath) => {
    console.log("Backup erstellt unter:", backupPath);
  }).catch((err) => {
    console.error("Fehler beim Erstellen des Backups:", err);
  });
  
  // Neue AGB-Daten speichern
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

  if (!faq || typeof faq !== 'string') {
    return res.status(400).json({ success: false, message: 'Ungültige FAQ-Daten' });
  }

  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  content.faq = faq;

  // Backup der aktuellen Daten vor dem Speichern
  backupData().then((backupPath) => {
    console.log("Backup erstellt unter:", backupPath);
  }).catch((err) => {
    console.error("Fehler beim Erstellen des Backups:", err);
  });

  // Neue FAQ-Daten speichern
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
  res.json({ success: true, message: 'FAQ aktualisiert', faq: content.faq });
}
exports.updateBlog = (req, res) => {
  const { blog } = req.body;
  if (!blog || typeof blog !== 'object') {
    return res.status(400).json({ success: false, message: 'Ungültige Blog-Daten' });
  }

  // Backup der aktuellen Daten vor dem Speichern
  backupData().then((backupPath) => {
    console.log("Backup erstellt unter:", backupPath);
  }).catch((err) => {
    console.error("Fehler beim Erstellen des Backups:", err);
  });

  // Neue Blog-Daten speichern
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  content.blog = blog;

  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
  res.json({ success: true, message: 'Blog aktualisiert', blog: content.blog });
}

exports.updateImpressum = (req, res) => {
  const { impressum } = req.body;
  if (!impressum || typeof impressum !== 'string') {
    return res.status(400).json({ success: false, message: 'Ungültige Impressum-Daten' });
  }

  // Backup der aktuellen Daten vor dem Speichern
  backupData().then((backupPath) => {
    console.log("Backup erstellt unter:", backupPath);
  }).catch((err) => {
    console.error("Fehler beim Erstellen des Backups:", err);
  });

  // Neue Impressum-Daten speichern
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  content.impressumLong = impressum;
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');
  res.json({ success: true, message: 'Impressum aktualisiert', impressum: content.impressumLong });
}
