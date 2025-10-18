// backend/src/routes/privacy.js - Refactored mit zentralem WriteManager
const express = require('express');
const router = express.Router();
const fileOps = require('../services/fileOperations');
const DefaultGenerator = require('../services/defaultGenerator');

const PRIVACY_FILE = '../data/privacy.json';

// Get entire privacy policy
router.get('/', async (req, res) => {
  try {
    const privacy = await fileOps.readJsonFile(PRIVACY_FILE);
    res.json(privacy);
  } catch (error) {
    console.error('Error fetching privacy:', error);
    res.status(500).json({ 
      error: 'Fehler beim Laden der Datenschutzbestimmungen',
      details: error.message 
    });
  }
});

// Create empty privacy policy
router.post('/create', async (req, res) => {
  try {
    const { title = "Datenschutzerklärung", description = "Datenschutzbestimmungen" } = req.body;
    
    const emptyPrivacy = { 
      title,
      isPage: true, 
      description,
      sections: [],
      createdAt: new Date().toISOString()
    };
    
    const result = await fileOps.writeJsonFile(PRIVACY_FILE, emptyPrivacy, {
      backup: true,
      validate: true
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating privacy:', error);
    res.status(500).json({ 
      error: 'Fehler beim Erstellen der Datenschutzbestimmungen',
      details: error.message 
    });
  }
});

// Update entire privacy policy
router.put('/', async (req, res) => {
  try {
    const privacy = req.body;
    
    // Input validation
    if (!privacy.title) {
      return res.status(400).json({ 
        error: 'Titel ist erforderlich' 
      });
    }

    if (!Array.isArray(privacy.sections)) {
      return res.status(400).json({ 
        error: 'Sections müssen ein Array sein' 
      });
    }
    
    // Sections mit IDs versehen falls nicht vorhanden
    
    privacy.sections = privacy.sections.map((section, index) => ({
      ...section,
      id: section.id || `section-${Date.now()}-${index}`,
      updatedAt: new Date().toISOString(),
      createdAt: section.createdAt || new Date().toISOString(),
      importedAt: section.importedAt || new Date().toISOString(),
    }));

    const result = await fileOps.writeJsonFile(PRIVACY_FILE, privacy, {
      backup: true,
      validate: true
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error updating privacy:', error);
    res.status(500).json({ 
      error: 'Fehler beim Aktualisieren der Datenschutzbestimmungen',
      details: error.message 
    });
  }
});

// Delete entire privacy policy
router.delete('/', async (req, res) => {
  try {
    const emptyPrivacy = { 
      title: "Datenschutzerklärung", 
      isPage: true, 
      description: "Datenschutzbestimmungen", 
      sections: [],
      deletedAt: new Date().toISOString()
    };
    
    await fileOps.writeJsonFile(PRIVACY_FILE, emptyPrivacy, {
      backup: true
    });
    
    res.json({ 
      message: 'Datenschutzbestimmungen wurden zurückgesetzt' 
    });
  } catch (error) {
    console.error('Error deleting privacy:', error);
    res.status(500).json({ 
      error: 'Fehler beim Löschen der Datenschutzbestimmungen',
      details: error.message 
    });
  }
});

// reset privacy to default
router.post('/reset', async (req, res) => {
  try {
    const defaultPrivacy = DefaultGenerator.generateDefaultPrivacy();
    
    const result = await fileOps.writeJsonFile(PRIVACY_FILE, defaultPrivacy, {
      backup: true,
      validate: true
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error resetting privacy:', error);
    res.status(500).json({ 
      error: 'Fehler beim Zurücksetzen der Datenschutzbestimmungen',
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
    const privacy = await fileOps.readJsonFile(PRIVACY_FILE);
    
    const section = privacy.sections.find(sec => sec.id === sectionId);
    if (!section) {
      return res.status(404).json({ 
        error: 'Datenschutzabschnitt nicht gefunden' 
      });
    }
    
    res.json(section);
  } catch (error) {
    console.error('Error fetching privacy section:', error);
    res.status(500).json({ 
      error: 'Fehler beim Laden des Datenschutzabschnitts',
      details: error.message 
    });
  }
});

// Create new section
// backend/src/routes/privacy.js - POST Route erweitern:

// Create new section
router.post('/section', async (req, res) => {
  try {
    console.log('=== CREATE SECTION DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Headers:', req.headers.authorization ? 'Auth present' : 'No auth');
    
    const { heading = "Neue Überschrift", text = "Neuer Text" } = req.body;
    
    if (!heading.trim() || !text.trim()) {
      return res.status(400).json({ 
        error: 'Heading und Text sind erforderlich und dürfen nicht leer sein' 
      });
    }

    console.log('Starting updateJsonFile...');
    
    const result = await fileOps.updateJsonFile(PRIVACY_FILE, (privacy) => {
      console.log('Inside updateJsonFile callback');
      console.log('Current sections:', privacy.sections.length);
      
      const newSection = { 
        id: `section-${Date.now()}`, 
        heading: heading.trim(),
        text: text.trim(),
        createdAt: new Date().toISOString()
      };
      
      console.log('Creating new section:', newSection.id);
      privacy.sections.push(newSection);
      console.log('New sections count:', privacy.sections.length);
      console.log('Returning updated privacy...');
      return privacy;
    }, {
      backup: true,
      validate: true
    });

    console.log('✅ updateJsonFile completed successfully!');
    console.log('Result sections count:', result.sections.length);

    // Neue Section zurückgeben
    const newSection = result.sections[result.sections.length - 1];
    console.log('Sending response with new section:', newSection.id);
    
    res.status(201).json(newSection);
    console.log('✅ Response sent successfully!');
    
  } catch (error) {
    console.error('❌ Error in CREATE SECTION:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Fehler beim Hinzufügen des Datenschutzabschnitts',
      details: error.message 
    });
  }
});

// Update single section
router.put('/sections/:id', async (req, res) => {
  try {
    const sectionId = req.params.id;
    const { heading, text } = req.body;

    if (!heading?.trim() || !text?.trim()) {
      return res.status(400).json({ 
        error: 'Heading und Text sind erforderlich und dürfen nicht leer sein' 
      });
    }

    const result = await fileOps.updateJsonFile(PRIVACY_FILE, (privacy) => {
      const sectionIndex = privacy.sections.findIndex(sec => sec.id === sectionId);
      if (sectionIndex === -1) {
        throw new Error('Datenschutzabschnitt nicht gefunden');
      }
      
      privacy.sections[sectionIndex] = { 
        ...privacy.sections[sectionIndex],
        heading: heading.trim(),
        text: text.trim(),
        updatedAt: new Date().toISOString()
      };
      
      return privacy;
    }, {
      backup: true,
      validate: true
    });

    const updatedSection = result.sections.find(sec => sec.id === sectionId);
    res.json(updatedSection);
  } catch (error) {
    console.error('Error updating privacy section:', error);
    
    if (error.message === 'Datenschutzabschnitt nicht gefunden') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ 
        error: 'Fehler beim Aktualisieren des Datenschutzabschnitts',
        details: error.message 
      });
    }
  }
});

// Delete section
router.delete('/sections/:id', async (req, res) => {
  try {
    const sectionId = req.params.id;
    console.log(`Request to delete privacy section ID: ${sectionId}`);

    const result = await fileOps.updateJsonFile(PRIVACY_FILE, (privacy) => {
      const sectionIndex = privacy.sections.findIndex(sec => sec.id === sectionId);
      if (sectionIndex === -1) {
        throw new Error('Datenschutzabschnitt nicht gefunden');
      }
      
      // Section mit Backup-Info vor dem Löschen
      const deletedSection = privacy.sections[sectionIndex];
      console.log(`Deleting privacy section: ${deletedSection.heading} (ID: ${sectionId})`);
      
      privacy.sections.splice(sectionIndex, 1);
      console.log(`Privacy section ID ${sectionId} deleted successfully.`);
      console.log('Remaining sections:', privacy.sections.map(sec => sec.id));
      return privacy;
    }, {
      backup: true // Wichtig: Backup vor Löschung
    });

    // ✅ FIX: 204 No Content statt 200 mit JSON Body
    res.status(204).send(); // ← Leere Antwort bei erfolgreichem DELETE

  } catch (error) {
    console.error('Error deleting privacy section:', error);
    
    if (error.message === 'Datenschutzabschnitt nicht gefunden') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ 
        error: 'Fehler beim Löschen des Datenschutzabschnitts',
        details: error.message 
      });
    }
  }
});

// Reorder sections
router.put('/sections/reorder', async (req, res) => {
  try {
    const { sectionIds } = req.body;
    
    if (!Array.isArray(sectionIds)) {
      return res.status(400).json({ 
        error: 'sectionIds muss ein Array sein' 
      });
    }

    const result = await fileOps.updateJsonFile(PRIVACY_FILE, (privacy) => {
      const reorderedSections = [];
      
      // Sections in der gewünschten Reihenfolge anordnen
      sectionIds.forEach(id => {
        const section = privacy.sections.find(sec => sec.id === id);
        if (section) {
          reorderedSections.push({
            ...section,
            updatedAt: new Date().toISOString()
          });
        }
      });
      
      // Prüfen ob alle Sections gefunden wurden
      if (reorderedSections.length !== privacy.sections.length) {
        throw new Error('Nicht alle Abschnitte konnten neu angeordnet werden');
      }
      
      privacy.sections = reorderedSections;
      return privacy;
    }, {
      backup: true
    });

    res.json({ 
      message: 'Abschnitte wurden neu angeordnet',
      sections: result.sections
    });
  } catch (error) {
    console.error('Error reordering privacy sections:', error);
    res.status(500).json({ 
      error: 'Fehler beim Neuanordnen der Datenschutzabschnitte',
      details: error.message 
    });
  }
});

module.exports = router;