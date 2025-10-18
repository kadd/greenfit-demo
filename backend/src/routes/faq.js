const express = require('express');
const router = express.Router();
const path = require('path');

const fileOps = require('../services/fileOperations');

const FAQ_FILE = '../data/faq.json';

// backend/src/routes/faq.js - Debug-Middleware hinzufügen:



// ✅ DEBUG: Request Body für alle FAQ Routes loggen
router.use((req, res, next) => {
  console.log('=== FAQ REQUEST DEBUG ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Authorization:', req.headers.authorization ? 'Present' : 'Missing');
  console.log('Body Type:', typeof req.body);
  console.log('Body Keys:', req.body ? Object.keys(req.body) : 'No body');
  console.log('Raw Body Length:', req.body ? JSON.stringify(req.body).length : 0);
  console.log('Raw Body:', JSON.stringify(req.body));
  console.log('=== END FAQ DEBUG ===');
  next();
});

// ✅ Error Handler für JSON-Parsing
router.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('=== FAQ JSON PARSING ERROR ===');
    console.error('Error:', error.message);
    console.error('URL:', req.url);
    console.error('Method:', req.method);
    console.error('Headers:', req.headers);
    console.error('=== END FAQ JSON ERROR ===');
    
    return res.status(400).json({
      error: 'Invalid JSON format in FAQ request',
      details: error.message,
      url: req.url,
      method: req.method
    });
  }
  next(error);
});

// Ihre bestehenden Routes...

// Get entire FAQ
router.get('/', async (req, res) => {
  try {
    const faq = await fileOps.readJsonFile(FAQ_FILE);
    res.json(faq);
  } catch (error) {
    console.error('Error fetching faq:', error);
    res.status(500).json({ 
      error: 'Fehler beim Laden der FAQ',
      details: error.message 
    });
  }
});

// create empty FAQ
router.post('/create', async (req, res) => {
  try {
    const emptyFaq = { 
      title: "FAQ", 
      isPage: true, 
      description: "Beschreibung der FAQ", 
      items: [] 
    };

    const result = await fileOps.writeJsonFile(FAQ_FILE, emptyFaq, { 
      backup: true, 
      validate: false // Kein Validieren, da leer
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Erstellen der FAQ',
      details: error.message 
    });
  }
});

// Update entire FAQ
router.put('/', async (req, res) => {
  try {
    const faq = req.body;

    if (!faq?.title || !Array.isArray(faq.items)) {
      return res.status(400).json({ error: 'Title und Items sind erforderlich' });
    }
    
    // Items mit IDs versehen
    faq.items = faq.items.map((item, index) => ({
      ...item,
      id: item.id || `item-${index + 1}`,
      updatedAt: item.updatedAt || new Date().toISOString(),
      createdAt: item.createdAt || new Date().toISOString(),
    }));

    // Aktualisiere das FAQ-Datum
    faq.updatedAt = new Date().toISOString();

    const result = await fileOps.writeJsonFile(FAQ_FILE, faq, { backup: true });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Aktualisieren der FAQ',
      details: error.message 
    });
  }
});



// Delete entire FAQ
router.delete('/', async (req, res) => {
  try {
    const emptyFaq = { title: "FAQ", isPage: true, description: "Beschreibung der FAQ", items: [] };
    const result = await fileOps.writeJsonFile(FAQ_FILE, emptyFaq, { backup: true, validate: false });
    res.status(200).json({ message: 'FAQ wurde gelöscht.', data: result });
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Löschen der FAQ',
      details: error.message 
    });
  }
});

// reset FAQ to default
router.post('/reset', async (req, res) => {
  try {
    const defaultFaq = { 
      title: "FAQ", 
      isPage: true, 
      description: "Hier finden Sie Antworten auf häufig gestellte Fragen.",
      importedAt: new Date().toISOString(),
      effectiveDate: new Date().toISOString().split('T')[0], // nur Datumsteil
      items: [
        {
          id: "item-1",
          question: "Was ist dieses Projekt?",
          answer: "Dieses Projekt ist eine Demo-Anwendung für FAQ-Verwaltung.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "item-2",
          question: "Wie kann ich ein FAQ-Item hinzufügen?",
          answer: "Sie können ein FAQ-Item über die API oder das Admin-Interface hinzufügen.",  
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ] 
    };

    const result = await fileOps.writeJsonFile(FAQ_FILE, defaultFaq, { backup: true, validate: true });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Zurücksetzen der FAQ',
      details: error.message 
    });
  }
});

// =============================== INDIVIDUAL ITEMS MANAGEMENT =============================== //

// get single FAQ item by ID
router.get('/items/:id', async (req, res) => {
  const faqItemId = req.params.id;
  try {
    const faq = await fileOps.readJsonFile(FAQ_FILE);
    const faqItem = faq.items.find(item => item.id === faqItemId);
    if (!faqItem) {
      return res.status(404).json({ error: 'FAQ-Item nicht gefunden.' });
    }
    res.json(faqItem);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Laden des FAQ-Items',
      details: error.message 
    });
  }
});

// create new item
router.post('/item', async (req, res) => {
  try {
    const newFaqItem = req.body;
    if (!newFaqItem || !newFaqItem.question || !newFaqItem.answer) {
      return res.status(400).json({ error: 'Ungültige FAQ-Daten.' });
    }
    newFaqItem.id = `item-${Date.now()}`;
    newFaqItem.createdAt = new Date().toISOString();
    newFaqItem.updatedAt = new Date().toISOString();

    const result = await fileOps.updateJsonFile(FAQ_FILE, (faq) => {
      faq.items.push(newFaqItem);
      // Aktualisiere das FAQ-Datum
      faq.updatedAt = new Date().toISOString();
      return faq;
    }, { backup: true });

    res.status(201).json(newFaqItem);
  } catch (error) {
    res.status(500).json({ 
      message: 'Fehler beim Erstellen des FAQ-Items',
      details: error.message 
    });
  }
});

//update single FAQ item by ID
router.put('/items/:id', async (req, res) => {
  const faqItemId = req.params.id;
  const updatedData = req.body;

  if (!updatedData || !updatedData.question || !updatedData.answer) {
    return res.status(400).json({ error: 'Ungültige FAQ-Daten.' });
  }

  try {
    const result = await fileOps.updateJsonFile(FAQ_FILE, (faq) => {
      const itemIndex = faq.items.findIndex(item => item.id === faqItemId);
      if (itemIndex === -1) {
        throw new Error('FAQ-Item nicht gefunden.');
      }
      faq.items[itemIndex] = {
        ...faq.items[itemIndex],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      // Aktualisiere das FAQ-Datum
      faq.updatedAt = new Date().toISOString();
      return faq;
    }, { backup: true });

    res.json(result);
  } catch (error) {
    if (error.message === 'FAQ-Item nicht gefunden.') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ 
      message: 'Fehler beim Aktualisieren des FAQ-Items',
      details: error.message 
    });
  }
});

//delete single FAQ item by ID
router.delete('/items/:id', async (req, res) => {
  const faqItemId = req.params.id;
  try {
    const result = await fileOps.updateJsonFile(FAQ_FILE, (faq) => {
      const itemIndex = faq.items.findIndex(item => item.id === faqItemId);
      if (itemIndex === -1) {
        throw new Error('FAQ-Item nicht gefunden.');
      }
      faq.items.splice(itemIndex, 1);
      // Aktualisiere das FAQ-Datum
      faq.updatedAt = new Date().toISOString();
      return faq;
    }, { backup: true });

    res.json({ message: 'FAQ-Item wurde gelöscht.', data: result });
  } catch (error) {
    if (error.message === 'FAQ-Item nicht gefunden.') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ 
      message: 'Fehler beim Löschen des FAQ-Items',
      details: error.message 
    });
  }
});

// reorder FAQ items
router.post('/items/reorder', async (req, res) => {
  const { newOrder } = req.body; // Erwartet ein Array von FAQ-Item-IDs in der neuen Reihenfolge
  if (!Array.isArray(newOrder)) {
    return res.status(400).json({ error: 'Ungültige Daten. Ein Array von FAQ-Item-IDs wird erwartet.' });
  }

  try {
    const result = await fileOps.updateJsonFile(FAQ_FILE, (faq) => {
      const reorderedItems = [];
      newOrder.forEach(id => {
        const item = faq.items.find(i => i.id === id);
        if (item) {
          reorderedItems.push(item);
        }
      });
      if (reorderedItems.length !== faq.items.length) {
        throw new Error('Die neue Reihenfolge enthält ungültige oder unvollständige FAQ-Item-IDs.');
      }
      faq.items = reorderedItems;
      // Aktualisiere das FAQ-Datum
      faq.updatedAt = new Date().toISOString();
      return faq;
    }, { backup: true });

    res.json(result);
  } catch (error) {
    if (error.message.includes('ungültige oder unvollständige FAQ-Item-IDs')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ 
      message: 'Fehler beim Neuordnen der FAQ-Items',
      details: error.message 
    });
  }
});

module.exports = router;