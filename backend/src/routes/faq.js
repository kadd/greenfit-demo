const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');


//get entire FAQ
router.get('/', (req, res) => {
  const faqPath = path.join(__dirname, '../data/faq.json');
  console.log("Loading FAQ from:", faqPath);
  fs.readFile(faqPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'FAQ konnte nicht geladen werden.' });
    }
    try {
      const faqs = JSON.parse(data);
      res.json(faqs);
    } catch (parseErr) {
      res.status(500).json({ error: 'FAQ-Daten sind ungültig.' });
    }
  });
});

// create empty FAQ
router.post('/create', (req, res) => {
  const faqs = req.body;
  const faqPath = path.join(__dirname, '../data/faq.json');
  console.log(`Saving FAQ to:`, faqPath);

  // Optional: Validierung
  if (!Array.isArray(faqs)) {
    console.log("Invalid FAQ data:", faqs);
    return res.status(400).json({ error: 'Ungültige FAQ-Daten.' });
  }

  // id zu items hinzufügen
  if (Array.isArray(faqs)) {
    faqs.forEach(item => {
      item.id = item.id || Date.now().toString(); // einfache ID, wenn nicht vorhanden
      item.createdAt = new Date().toISOString();
      item.updatedAt = item.updatedAt || item.createdAt;
    });
  }

  // Neues Impressum erstellen
  faqs.createdAt = new Date().toISOString();
  faqs.updatedAt = faqs.updatedAt || faqs.createdAt;

  // Speichere die FAQ

  fs.writeFile(faqPath, JSON.stringify(faqs, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'FAQ konnte nicht gespeichert werden.' });
    }
    res.status(200).json(faqs);
  });
});

let isWriting = false;
//update entire FAQ
router.put('/', (req, res) => {
  if (isWriting) {
    return res.status(429).json({ error: 'Bitte warte, die FAQ wird gerade gespeichert.' });
  }
  isWriting = true;
  const faq = req.body;
  const faqPath = path.join(__dirname, '../data/faq.json');
  console.log(`Updating entire FAQ in:`, faqPath);

  // id zu items hinzufügen
  if (Array.isArray(faq.items)) {
    faq.items = faq.items.map(item => ({
      id: item.id || Date.now().toString(), // einfache ID, wenn nicht vorhanden
      question: item.question,
      answer: item.answer,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  // Optional: Validierung
  if (!Array.isArray(faq.items)) {
    console.log("Invalid FAQ data:", faq);
    return res.status(400).json({ error: 'Ungültige FAQ-Daten.' });
  }

  // Aktualisiere das FAQ-Datum
  faq.updatedAt = new Date().toISOString();

  // Speichere die FAQ

  fs.writeFile(faqPath, JSON.stringify(faq, null, 2), (writeErr) => {
    isWriting = false;
    if (writeErr) {
      return res.status(500).json({ error: 'FAQ konnte nicht aktualisiert werden.' });
    }
    res.status(200).json(faq);
  });
});

// Delete entire FAQ
router.delete('/', (req, res) => {
  const faqPath = path.join(__dirname, '../data/faq.json');
  console.log(`Deleting entire FAQ in:`, faqPath);
  fs.writeFile(faqPath, JSON.stringify([], null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'FAQ konnte nicht gelöscht werden.' });
    }
    res.json({ message: 'FAQ wurde gelöscht.' });
  });
});

// add new FAQ item
router.post('/add', (req, res) => {
  const newFaqItem = req.body;
  if (!newFaqItem || !newFaqItem.question || !newFaqItem.answer) {
    return res.status(400).json({ error: 'Ungültige FAQ-Daten.' });
  }
  const faqPath = path.join(__dirname, '../data/faq.json');
  console.log(`Adding new FAQ item to:`, faqPath);
  fs.readFile(faqPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'FAQ konnte nicht geladen werden.' });
    }
    let faqs;
    try {
      faqs = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'FAQ-Daten sind ungültig.' });
    }
    newFaqItem.id = Date.now().toString(); // einfache ID
    newFaqItem.createdAt = new Date().toISOString();
    newFaqItem.updatedAt = new Date().toISOString();
    faqs.push(newFaqItem);

    // Aktualisiere das FAQ-Datum
    faqs.updatedAt = new Date().toISOString();

    fs.writeFile(faqPath, JSON.stringify(faqs, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'FAQ konnte nicht gespeichert werden.' });
      }
      res.status(201).json(newFaqItem);
    });
  });
});

//get single FAQ item by ID
router.get('/items/:id', (req, res) => {
  const faqItemId = req.params.id;
  const faqPath = path.join(__dirname, '../data/faq.json');
  console.log(`Loading FAQ item ${faqItemId} from:`, faqPath);
  fs.readFile(faqPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'FAQ konnte nicht geladen werden.' });
    }
    try {
      const faqs = JSON.parse(data);
      const faqItem = faqs.find(faq => faq.id === faqItemId);
      if (!faqItem) {
        return res.status(404).json({ error: 'FAQ-Item nicht gefunden.' });
      }
      res.json(faqItem);
    } catch (parseErr) {
      res.status(500).json({ error: 'FAQ-Daten sind ungültig.' });
    }
  });
});

//update single FAQ item by ID
router.put('/items/:id', (req, res) => {
  const faqItemId = req.params.id;
  const updatedFaq = req.body;
  if (!updatedFaq || !updatedFaq.question || !updatedFaq.answer) {
    return res.status(400).json({ error: 'Ungültige FAQ-Daten.' });
  }
  const faqPath = path.join(__dirname, '../data/faq.json');
  console.log(`Updating FAQ item ${faqItemId} in:`, faqPath);
  fs.readFile(faqPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'FAQ konnte nicht geladen werden.' });
    }
    let faqs;
    try {
      faqs = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'FAQ-Daten sind ungültig.' });
    }
    const faqIndex = faqs.findIndex(faq => faq.id === faqItemId);
    if (faqIndex === -1) {
      return res.status(404).json({ error: 'FAQ-Item nicht gefunden.' });
    }
    updatedFaq.id = faqItemId; // ID beibehalten
    faqs[faqIndex] = updatedFaq;
    updatedFaq.updatedAt = new Date().toISOString();

    // Aktualisiere das FAQ-Datum
    faqs.updatedAt = new Date().toISOString();

    fs.writeFile(faqPath, JSON.stringify(faqs, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'FAQ konnte nicht aktualisiert werden.' });
      }
      res.status(200).json(updatedFaq);
    });
  });
});

//delete single FAQ item by ID
router.delete('/:id', (req, res) => {
  const faqItemId = req.params.id;
  const faqPath = path.join(__dirname, '../data/faq.json');
  console.log(`Deleting FAQ item ${faqItemId} in:`, faqPath);
  fs.readFile(faqPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'FAQ konnte nicht geladen werden.' });
    }
    let faqs; 
    try {
      faqs = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'FAQ-Daten sind ungültig.' });
    }
    const faqIndex = faqs.findIndex(faq => faq.id === faqItemId);
    if (faqIndex === -1) {
      return res.status(404).json({ error: 'FAQ-Item nicht gefunden.' });
    }
    faqs.splice(faqIndex, 1);   

    // Aktualisiere das FAQ-Datum
    faqs.updatedAt = new Date().toISOString();
    
    fs.writeFile(faqPath, JSON.stringify(faqs, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: 'FAQ konnte nicht gelöscht werden.' });
      }
      res.json({ message: 'FAQ-Item wurde gelöscht.' });
    });
  });
});

module.exports = router;