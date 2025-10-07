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

// create empty privacy
router.post('/create', (req, res) => {
  const privacyPath = path.join(__dirname, '../data/privacy.json');
  console.log(`Creating empty privacy in:`, privacyPath);
  const emptyPrivacy = { title: "Datenschutz", isPage: true, description: "Beschreibung der Datenschutzrichtlinie", updatedAt: new Date().toISOString(), sections: [] };
  
  // Füge eine ID und ein Erstellungsdatum hinzu
  emptyPrivacy.id = "privacy-" + Date.now();
  emptyPrivacy.createdAt = new Date().toISOString();
  emptyPrivacy.updatedAt = emptyPrivacy.createdAt;

  fs.writeFile(privacyPath, JSON.stringify(emptyPrivacy, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Privacy konnten nicht erstellt werden.' });
    }
    res.status(201).json(emptyPrivacy);
  });
});

// Prevent concurrent writes
let isWriting = false;

// Update entire privacy
router.put('/', (req, res) => {
  if (isWriting) {
    return res.status(429).json({ error: 'Bitte warte, die Privacy wird gerade gespeichert.' });
  }
  isWriting = true;
  const privacy = req.body;
  const privacyPath = path.join(__dirname, '../data/privacy.json');
  console.log(`Updating entire privacy in:`, privacyPath);

  // id zu sections hinzufügen
  privacy.sections = privacy.sections.map((section, index) => ({
    ...section,
    id: section.id || `section-${index + 1}`
  }));

  // Optional: Validierung
  if (!privacy || typeof privacy.title !== 'string' || !Array.isArray(privacy.sections)) {
    isWriting = false;
    return res.status(400).json({ error: 'Ungültige Privacy-Daten.' });
  }

  // Aktualisiere das updatedAt-Feld
  privacy.updatedAt = new Date().toISOString();

  // Speichere die Privacy
  fs.writeFile(privacyPath, JSON.stringify(privacy, null, 2), (writeErr) => {
    isWriting = false;
    if (writeErr) {
      return res.status(500).json({ error: 'Privacy konnten nicht gespeichert werden.' });
    }

    res.json(privacy);
  });
});

// Delete entire privacy
router.delete('/', (req, res) => {
  const privacyPath = path.join(__dirname, '../data/privacy.json');
  console.log(`Deleting entire privacy in:`, privacyPath);
  fs.writeFile(privacyPath, JSON.stringify({ title: "Datenschutz", isPage: true, description: "Beschreibung der Datenschutzrichtlinie", updatedAt: new Date().toISOString(), sections: [] }, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Privacy konnten nicht gelöscht werden.' });
    }
    res.json({ message: 'Privacy wurde gelöscht.' });
  });
}); 

// add new privacy section
router.post('/section', (req, res) => {
  const newSection = req.body;
  if (!newSection || typeof newSection.heading !== 'string' || typeof newSection.text !== 'string') {
    return res.status(400).json({ error: 'Ungültige Sektion-Daten.' });
  }

  const privacyPath = path.join(__dirname, '../data/privacy.json');
  console.log(`Adding new section to privacy in:`, privacyPath);
  fs.readFile(privacyPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Privacy konnten nicht geladen werden.' });
    }

    let privacy;
    try {
      privacy = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Privacy-Daten sind ungültig.' });
    }
    
    const sectionWithId = { ...newSection, id: `section-${privacy.sections.length + 1}` };
    privacy.sections.push(sectionWithId);

    // Aktualisiere das updatedAt-Feld
    privacy.updatedAt = new Date().toISOString();

    // Speichere die aktualisierten Privacy-Daten

    fs.writeFile(privacyPath, JSON.stringify(privacy, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'Privacy konnten nicht gespeichert werden.' });
      }
      res.status(201).json(sectionWithId);
    });
  });
});

// get single privacy section by id
router.get('/:id', (req, res) => {
  const sectionId = req.params.id;
  const privacyPath = path.join(__dirname, '../data/privacy.json');
  console.log(`Loading privacy section ${sectionId} from:`, privacyPath);
  fs.readFile(privacyPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Privacy konnten nicht geladen werden.' });
    }
    try {
      const privacy = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Privacy-Daten sind ungültig.' });
    }
    try {
      const privacy = JSON.parse(data);
      const section = privacy.sections.find(s => s.id === sectionId);
      if (!section) {
        return res.status(404).json({ error: 'Sektion nicht gefunden.' });
      }
      res.json(section);
    } catch (parseErr) {
      res.status(500).json({ error: 'Fehler beim Laden des Abschnitts.' });
    }
  });
});

// update single privacy section by id
router.put('/:id', (req, res) => {
  const sectionId = req.params.id;
  const updatedSection = req.body;
  if (!updatedSection || typeof updatedSection.heading !== 'string' || typeof updatedSection.text !== 'string') {
    return res.status(400).json({ error: 'Ungültige Abschnittsdaten.' });
  }

  const privacyPath = path.join(__dirname, '../data/privacy.json');
  fs.readFile(privacyPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Privacy konnten nicht geladen werden.' });
    }
    let privacy;
    try {
      privacy = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Privacy-Daten sind ungültig.' });
    }
    const sectionIndex = privacy.sections.findIndex(sec => sec.id === sectionId);
    if (sectionIndex === -1) {
      return res.status(404).json({ error: 'Sektion nicht gefunden.' });
    }
    privacy.sections[sectionIndex] = { id: sectionId, ...updatedSection };

    // Aktualisiere das updatedAt-Feld
    privacy.updatedAt = new Date().toISOString();

    // Speichere die aktualisierten Privacy-Daten
    fs.writeFile(privacyPath, JSON.stringify(privacy, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'Sektion konnte nicht aktualisiert werden.' });
      }
      res.json(privacy.sections[sectionIndex]);
    });
  });
});

// delete single privacy section by id
router.delete('/:id', (req, res) => {
  const sectionId = req.params.id;
  const privacyPath = path.join(__dirname, '../data/privacy.json');
  console.log(`Deleting privacy section ${sectionId} in:`, privacyPath);
  fs.readFile(privacyPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Privacy konnten nicht geladen werden.' });
    }
    let privacy;
    try {
      privacy = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Privacy-Daten sind ungültig.' });
    }
    const sectionIndex = privacy.sections.findIndex(sec => sec.id === sectionId);
    if (sectionIndex === -1) {
      return res.status(404).json({ error: 'Sektion nicht gefunden.' });
    }
    privacy.sections.splice(sectionIndex, 1);

    // Aktualisiere das updatedAt-Feld
    privacy.updatedAt = new Date().toISOString();

    // Speichere die aktualisierten Privacy-Daten
    fs.writeFile(privacyPath, JSON.stringify(privacy, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'Sektion konnte nicht gelöscht werden.' });
      }
      res.json({ message: 'Sektion wurde gelöscht.' });
    });
  });
});

module.exports = router;