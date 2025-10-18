const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const fileOps = require('../services/fileOperations');
const DefaultGenerator = require('../services/defaultGenerator');

const TERMS_FILE = '../data/terms.json';

// Get entire terms
router.get('/', async (req, res) => {
  try {
    const terms = await fileOps.readJsonFile(TERMS_FILE);
    res.json(terms);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Abrufen der AGB',
      details: error.message 
    });
  }
});

// Create empty terms
router.post('/create', async (req, res) => {
  try {
    const emptyTerms = { 
      title: "AGB", 
      isPage: true, 
      description: "Beschreibung der AGB", 
      sections: [] 
    };

    const result = await fileOps.writeJsonFile(TERMS_FILE, emptyTerms, { 
      backup: true, 
      validate: false // Kein Validieren, da leer
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Erstellen der AGB',
      details: error.message 
    });
  }
});

// Update entire terms
router.put('/', async (req, res) => {
  try {
    const terms = req.body;

    if (!terms?.title || !terms?.description || !Array.isArray(terms.sections)) {
      return res.status(400).json({ error: 'Title, Description und Sections sind erforderlich' });
    }
    
    // Sections mit IDs versehen
    terms.sections = terms.sections.map((section, index) => ({
      ...section,
      id: section.id || `section-${index + 1}`,
      updatedAt: section.updatedAt || new Date().toISOString(),
      createdAt: section.createdAt || new Date().toISOString(),
      importedAt: section.importedAt || new Date().toISOString(),
    }));

    const result = await fileOps.writeJsonFile(TERMS_FILE, terms, {
      backup: true,
      validate: true
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Aktualisieren der AGB: ',
      details: error.message
    });
  }
});

// Delete entire terms
router.delete('/', async (req, res) => {
  try {
    const emptyTerms = { 
      title: "AGB", 
      description: "Beschreibung der AGB", 
      sections: [] 
    };

    const result = await fileOps.writeJsonFile(TERMS_FILE, emptyTerms, { 
      backup: true, validate: false // Kein Validieren, da leer
    });

    res.json({ message: 'AGB wurden gelöscht.', details: result });
  } catch (error) {
    res.status(500).json({ 
      error: 'Fehler beim Löschen der AGB',
      details: error.message 
    });
  }
});

// reset AGB to default template
router.post('/reset', async (req, res) => {
  try {
    const defaultTerms = DefaultGenerator.generateDefaultTerms();

    const result = await fileOps.writeJsonFile(TERMS_FILE, defaultTerms, {
      backup: true,
      validate: true
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Zurücksetzen der AGB',
      details: error.message
    });
  }
});

// ==================== INDIVIDUAL SECTION MANAGEMENT ====================
// Refactored mit zentralem WriteManager in fileOperations.js

// backend/src/services/fileOperations.js - Zentraler WriteManager
// ==================== INDIVIDUAL SECTION MANAGEMENT ====================

// ==================== SECTIONS MANAGEMENT ====================

// Get single section by ID
router.get('/sections/:id', async (req, res) => {
  try {
    const sectionId = req.params.id;
    const terms = await fileOps.readJsonFile(TERMS_FILE);

    const section = terms.sections.find(sec => sec.id === sectionId);
    if (!section) {
      return res.status(404).json({ error: 'Abschnitt nicht gefunden' });
    }

    res.json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new section
router.post('/section', async (req, res) => {
  try {
    const newSection = req.body;
    
    if (!newSection?.heading || !newSection?.text) {
      return res.status(400).json({ error: 'Heading und Text sind erforderlich' });
    }

    const result = await fileOps.updateJsonFile(TERMS_FILE, (terms) => {
      const sectionWithId = { 
        id: `section-${Date.now()}`, 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...newSection 
      };
      terms.sections.push(sectionWithId);
      terms.updatedAt = new Date().toISOString();
      return terms;
    });

    // Neue Section zurückgeben
    const newSectionFromResult = result.sections[result.sections.length - 1];
    res.status(201).json(newSectionFromResult);
  } catch (error) {
    res.status(500).json({ 
      error: 'Fehler beim Hinzufügen des Abschnitts', 
      details: error.message 
    });
  }
});

// Update single section
router.put('/sections/:id', async (req, res) => {
  try {
    const sectionId = req.params.id;
    const updatedSection = req.body;

    if (!updatedSection?.heading || !updatedSection?.text) {
      return res.status(400).json({ error: 'Heading und Text sind erforderlich' });
    }

    const result = await fileOps.updateJsonFile(TERMS_FILE, (terms) => {
      const sectionIndex = terms.sections.findIndex(sec => sec.id === sectionId);
      if (sectionIndex === -1) {
        throw new Error('Abschnitt nicht gefunden');
      }
      
      terms.sections[sectionIndex] = { 
        id: sectionId, 
        ...updatedSection,
        updatedAt: new Date().toISOString()
      };
      terms.updatedAt = new Date().toISOString();
      return terms;
    },
    { validate: true,
      backup: true
     });

    const updatedSectionFromResult = result.sections.find(sec => sec.id === sectionId);
    res.json(updatedSectionFromResult);
  } catch (error) {
    if (error.message === 'Abschnitt nicht gefunden') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ 
        error: 'Fehler beim Aktualisieren des Abschnitts',
        details: error.message
      });
    }
  }
});

// Delete section
router.delete('/sections/:id', async (req, res) => {
  try {
    const sectionId = req.params.id;

    const result = await fileOps.updateJsonFile(TERMS_FILE, (terms) => {
      const sectionIndex = terms.sections.findIndex(sec => sec.id === sectionId);
      if (sectionIndex === -1) {
        throw new Error('Abschnitt nicht gefunden');
      }
      
      terms.sections.splice(sectionIndex, 1);
      terms.updatedAt = new Date().toISOString();
      return terms;
    },
    { validate: true,
      backup: true
    });

    res.json({ message: 'Abschnitt wurde gelöscht', data: result });
  } catch (error) {
    if (error.message === 'Abschnitt nicht gefunden') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({
        error: 'Fehler beim Löschen des Abschnitts',
        details: error.message
      });
    }
  }
});

router.post('/sections/reorder', async (req, res) => {
  try {
    const { newOrder } = req.body; // Erwartet ein Array von Section IDs in neuer Reihenfolge

    if (!Array.isArray(newOrder)) {
      return res.status(400).json({ error: 'newOrder muss ein Array von Section IDs sein' });
    }

    const result = await fileOps.updateJsonFile(TERMS_FILE, (terms) => {
      const idToSectionMap = {};
      terms.sections.forEach(sec => {
        idToSectionMap[sec.id] = sec;
      });

      const reorderedSections = [];
      newOrder.forEach(id => {
        if (idToSectionMap[id]) {
          reorderedSections.push(idToSectionMap[id]);
        }
      });

      // Optional: Fehlende Sections anhängen, die nicht in newOrder waren
      terms.sections.forEach(sec => {
        if (!newOrder.includes(sec.id)) {
          reorderedSections.push(sec);
        }
      });

      terms.sections = reorderedSections;
      terms.updatedAt = new Date().toISOString();
      return terms;
    },
    { validate: true,
      backup: true
    });

    res.json(result.sections);
  } catch (error) {
    res.status(500).json({
      error: 'Fehler beim Neuordnen der Abschnitte',
      details: error.message
    });
  }
});

module.exports = router;