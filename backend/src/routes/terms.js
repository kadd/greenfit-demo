const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const fileOps = require('../services/fileOperations');

const TERMS_FILE = 'terms.json';

// Get entire terms
router.get('/', async (req, res) => {
  try {
    const terms = await fileOps.readJsonFile(TERMS_FILE);
    res.json(terms);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    
    const result = await fileOps.writeJsonFile(TERMS_FILE, emptyTerms);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update entire terms
router.put('/', async (req, res) => {
  try {
    const terms = req.body;
    
    // Sections mit IDs versehen
    terms.sections = terms.sections.map((section, index) => ({
      ...section,
      id: section.id || `section-${index + 1}`
    }));

    const result = await fileOps.writeJsonFile(TERMS_FILE, terms, {
      backup: true,
      validate: true
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

// Add new section
router.post('/add', async (req, res) => {
  try {
    const newSection = req.body;
    
    if (!newSection?.heading || !newSection?.text) {
      return res.status(400).json({ error: 'Heading und Text sind erforderlich' });
    }

    const result = await fileOps.updateJsonFile(TERMS_FILE, (terms) => {
      const sectionWithId = { 
        id: `section-${Date.now()}`, 
        ...newSection 
      };
      terms.sections.push(sectionWithId);
      return terms;
    });

    // Neue Section zurückgeben
    const newSectionFromResult = result.sections[result.sections.length - 1];
    res.status(201).json(newSectionFromResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update single section
router.put('/:id', async (req, res) => {
  try {
    const sectionId = req.params.id;
    const updatedSection = req.body;

    const result = await fileOps.updateJsonFile(TERMS_FILE, (terms) => {
      const sectionIndex = terms.sections.findIndex(sec => sec.id === sectionId);
      if (sectionIndex === -1) {
        throw new Error('Abschnitt nicht gefunden');
      }
      
      terms.sections[sectionIndex] = { id: sectionId, ...updatedSection };
      return terms;
    });

    const updatedSectionFromResult = result.sections.find(sec => sec.id === sectionId);
    res.json(updatedSectionFromResult);
  } catch (error) {
    if (error.message === 'Abschnitt nicht gefunden') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete section
router.delete('/:id', async (req, res) => {
  try {
    const sectionId = req.params.id;

    await fileOps.updateJsonFile(TERMS_FILE, (terms) => {
      const sectionIndex = terms.sections.findIndex(sec => sec.id === sectionId);
      if (sectionIndex === -1) {
        throw new Error('Abschnitt nicht gefunden');
      }
      
      terms.sections.splice(sectionIndex, 1);
      return terms;
    });

    res.json({ message: 'Abschnitt wurde gelöscht' });
  } catch (error) {
    if (error.message === 'Abschnitt nicht gefunden') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;