const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

//get entire terms
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

// create empty terms
router.post('/create', (req, res) => {
  const termsPath = path.join(__dirname, '../data/terms.json');
  console.log(`Creating empty terms in:`, termsPath);
  const emptyTerms = { 
    title: "AGB", 
    isPage: true, 
    description: "Beschreibung der AGB", 
    updatedAt: new Date().toISOString(), 
    sections: [] 
  };
  fs.writeFile(termsPath, JSON.stringify(emptyTerms, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Terms konnten nicht erstellt werden.' });
    }
    res.status(201).json(emptyTerms);
  });
});

// Prevent concurrent writes
let isWriting = false;

// Update entire terms
router.put('/', (req, res) => {
  if (isWriting) {
    return res.status(429).json({ error: 'Bitte warte, die Terms werden gerade gespeichert.' });
  }
  isWriting = true;
  const terms = req.body;
  const termsPath = path.join(__dirname, '../data/terms.json');
  console.log(`Updating entire terms in:`, termsPath);

  // id zu sections hinzufügen
  terms.sections = terms.sections.map((section, index) => ({
    ...section,
    id: section.id || `section-${index + 1}`
  }));

  // Aktualisiere das updatedAt-Feld
  terms.updatedAt = new Date().toISOString();

  // Optional: Validierung
  if (!terms || typeof terms.title !== 'string' || !Array.isArray(terms.sections)) {
    isWriting = false;
    return res.status(400).json({ error: 'Ungültige Terms-Daten.' });
  }

  fs.writeFile(termsPath, JSON.stringify(terms, null, 2), (writeErr) => {
    isWriting = false;
    if (writeErr) {
      return res.status(500).json({ error: 'Terms konnten nicht aktualisiert werden.' });
    }
    res.status(200).json(terms);
  });
});

// Delete entire terms
router.delete('/', (req, res) => {
  const termsPath = path.join(__dirname, '../data/terms.json');
  console.log(`Deleting entire terms in:`, termsPath);
  fs.writeFile(termsPath, JSON.stringify({ title: "AGB", isPage: true, description: "Beschreibung der AGB", updatedAt: new Date().toISOString(), sections: [] }, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Terms konnten nicht gelöscht werden.' });
    }
    res.json({ message: 'Terms wurden gelöscht.' });
  });
});

// add new terms section
router.post('/add', (req, res) => {
  const newSection = req.body;
  if (!newSection || typeof newSection.heading !== 'string' || typeof newSection.text !== 'string') {
    return res.status(400).json({ error: 'Ungültige Abschnittsdaten.' });
  }

  const termsPath = path.join(__dirname, '../data/terms.json');
  fs.readFile(termsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Terms konnten nicht geladen werden.' });
    }
    let terms;
    try {
      terms = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Terms-Daten sind ungültig.' });
    }

    // Neuen Abschnitt mit ID hinzufügen
    const sectionWithId = { id: `section-${Date.now()}`, ...newSection };
    terms.sections.push(sectionWithId);

    // Aktualisiere das updatedAt-Feld
    terms.updatedAt = new Date().toISOString();

    // Speichere die aktualisierten Terms

    fs.writeFile(termsPath, JSON.stringify(terms, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'Neuer Abschnitt konnte nicht hinzugefügt werden.' });
      }
      res.status(201).json(sectionWithId);
    });
  });
});

// get single terms section by id
router.get('/:id', (req, res) => {
  const sectionId = req.params.id;
  const termsPath = path.join(__dirname, '../data/terms.json');
  fs.readFile(termsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Terms konnten nicht geladen werden.' });
    }
    let terms;
    try {
      terms = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Terms-Daten sind ungültig.' });
    }
    try {
      const section = terms.sections.find(sec => sec.id === sectionId);
      if (!section) {
        return res.status(404).json({ error: 'Abschnitt nicht gefunden.' });
      }
      res.json(section);
    } catch (parseErr) {
      res.status(500).json({ error: 'Fehler beim Laden des Abschnitts.' });
    }
  });
});

// update single terms section by id
router.put('/:id', (req, res) => {
  const sectionId = req.params.id;
  const updatedSection = req.body;
  if (!updatedSection || typeof updatedSection.heading !== 'string' || typeof updatedSection.text !== 'string') {
    return res.status(400).json({ error: 'Ungültige Abschnittsdaten.' });
  }

  const termsPath = path.join(__dirname, '../data/terms.json');
  fs.readFile(termsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Terms konnten nicht geladen werden.' });
    }
    let terms;
    try {
      terms = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Terms-Daten sind ungültig.' });
    }
    const sectionIndex = terms.sections.findIndex(sec => sec.id === sectionId);
    if (sectionIndex === -1) {
      return res.status(404).json({ error: 'Abschnitt nicht gefunden.' });
    }
    terms.sections[sectionIndex] = { id: sectionId, ...updatedSection };
    terms.updatedAt = new Date().toISOString();
    fs.writeFile(termsPath, JSON.stringify(terms, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'Abschnitt konnte nicht aktualisiert werden.' });
      }
      res.json(terms.sections[sectionIndex]);
    });
  });
});

// delete single terms section by id
router.delete('/:id', (req, res) => {
  const sectionId = req.params.id;
  const termsPath = path.join(__dirname, '../data/terms.json');
  fs.readFile(termsPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Terms konnten nicht geladen werden.' });
    }
    let terms;
    try {
      terms = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Terms-Daten sind ungültig.' });
    }
    const sectionIndex = terms.sections.findIndex(sec => sec.id === sectionId);
    if (sectionIndex === -1) {
      return res.status(404).json({ error: 'Abschnitt nicht gefunden.' });
    }
    terms.sections.splice(sectionIndex, 1);
    terms.updatedAt = new Date().toISOString();
    fs.writeFile(termsPath, JSON.stringify(terms, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'Abschnitt konnte nicht gelöscht werden.' });
      }
      res.json({ message: 'Abschnitt wurde gelöscht.' });
    });
  });
});

module.exports = router;