const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');


// Impressum-Daten abrufen
router.get('/', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  console.log("Loading Impressum from:", impressumPath);
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      res.json(impressum);
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});

// Impressum löschen
router.delete('/', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  fs.unlink(impressumPath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht gelöscht werden.' });
    }
    res.json({ message: 'Impressum gelöscht.' });
  });
});

// Neues Impressum erstellen
router.post('/', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  const newImpressum = req.body;
  if (!newImpressum || typeof newImpressum !== 'object') {
    return res.status(400).json({ error: 'Ungültige Impressum-Daten.' });
  }

  // Füge eine ID und ein Erstellungsdatum hinzu
  newImpressum.id = newImpressum.id || 'impressum';
  newImpressum.createdAt = new Date().toISOString();
  newImpressum.updatedAt = newImpressum.updatedAt || newImpressum.createdAt;

  // Überprüfe, ob die Datei bereits existiert
  if (fs.existsSync(impressumPath)) {
    return res.status(400).json({ error: 'Impressum existiert bereits. Bitte aktualisieren Sie es stattdessen.' });
  }

  // Speichere das neue Impressum
  fs.writeFile(impressumPath, JSON.stringify(newImpressum, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht erstellt werden.' });
    }
    res.status(201).json(newImpressum);
  });
});

// Impressum-Daten aktualisieren
router.put('/', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  const updatedImpressum = req.body;
  if (!updatedImpressum || typeof updatedImpressum !== 'object') {
    return res.status(400).json({ error: 'Ungültige Impressum-Daten.' });
  }

  // Füge ein Aktualisierungsdatum hinzu
  updatedImpressum.updatedAt = new Date().toISOString();  
  updatedImpressum.id = updatedImpressum.id || 'impressum';
  fs.writeFile(impressumPath, JSON.stringify(updatedImpressum, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht gespeichert werden.' });
    }
    res.json(updatedImpressum);
  });
}); 

// Spezielle Teile des Impressums abrufen
router.get('/contact', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  console.log("Loading Impressum for contact from:", impressumPath);
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      const contactInfo = {
        email: impressum.email,
        phone: impressum.phone,
        address: impressum.address
      };
      res.json(contactInfo);
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});

router.get('/company-info', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  console.log("Loading Impressum for company info from:", impressumPath);
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      const companyInfo = {
        company: impressum.company,
        address: impressum.address
      };
      res.json(companyInfo);
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});

router.get('/umsatzsteuer', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  console.log("Loading Impressum for Umsatzsteuer from:", impressumPath);
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      const umsatzsteuerSection = (impressum.sections || []).find(sec => sec.id === 'section-3');
      if (!umsatzsteuerSection) {
        return res.status(404).json({ error: 'Umsatzsteuer-Informationen nicht gefunden.' });
      }
      res.json(umsatzsteuerSection);
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});

router.get('/legal-notice', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  console.log("Loading Impressum for legal notice from:", impressumPath);
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      const legalSections = (impressum.sections || []).filter(sec =>
        sec.id === 'section-1' || sec.id === 'section-3' || sec.id === 'section-4'
      );
      res.json(legalSections);
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});


router.get('/content-responsible', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  console.log("Loading Impressum for content responsible from:", impressumPath);
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      const contentResponsibleSection = (impressum.sections || []).find(sec => sec.id === 'section-4');
      if (!contentResponsibleSection) {
        return res.status(404).json({ error: 'Informationen zum Inhaltlich Verantwortlichen nicht gefunden.' });
      }
      res.json(contentResponsibleSection);
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});

// Alle Abschnitte des Impressums abrufen
router.get('/sections', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  console.log("Loading Impressum sections from:", impressumPath);
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      const sections = impressum.sections || [];
      res.json(sections);
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});

// Einzelnen Abschnitt des Impressums abrufen

router.get('/section/:id', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  const sectionId = req.params.id;
  console.log(`Loading Impressum section ${sectionId} from:`, impressumPath);
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      const section = (impressum.sections || []).find(sec => sec.id === sectionId);
      if (!section) {
        return res.status(404).json({ error: 'Abschnitt nicht gefunden.' });
      }
      res.json(section);
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});


// Spezielle Teile des Impressums abrufen
router.get('/sections/:key', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  const sectionKey = req.params.key;
  console.log(`Loading Impressum section with key ${sectionKey} from:`, impressumPath);
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      const section = (impressum.sections || []).find(sec => sec.key === sectionKey);
      if (!section) {
        return res.status(404).json({ error: 'Abschnitt nicht gefunden.' });
      }
      res.json(section);
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});






// Neuem Abschnitt hinzufügen
router.post('/section', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  const newSection = req.body;
  if (!newSection || !newSection.id || !newSection.heading || !newSection.text) {
    return res.status(400).json({ error: 'Ungültige Abschnitt-Daten.' });
  }
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      impressum.sections = impressum.sections || [];
      if (impressum.sections.find(sec => sec.id === newSection.id)) {
        return res.status(400).json({ error: 'Abschnitt mit dieser ID existiert bereits.' });
      }
      impressum.sections.push(newSection);

      // Aktualisiere das Impressum-Datum
      impressum.updatedAt = new Date().toISOString();

      fs.writeFile(impressumPath, JSON.stringify(impressum, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Abschnitt konnten nicht hinzugefügt werden.' });
        }
        res.status(201).json(newSection);
      });
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});

// Abschnitt aktualisieren
router.put('/section/:id', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  const sectionId = req.params.id;
  const updatedSection = req.body;
  if (!updatedSection || !updatedSection.heading || !updatedSection.text) {
    return res.status(400).json({ error: 'Ungültige Abschnitt-Daten.' });
  }
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data);
      impressum.sections = impressum.sections || [];
      const idx = impressum.sections.findIndex(sec => sec.id === sectionId);
      if (idx === -1) {
        return res.status(404).json({ error: 'Abschnitt nicht gefunden.' });
      }
      updatedSection.id = sectionId; // ID beibehalten
      impressum.sections[idx] = updatedSection;

      // Aktualisiere das Impressum-Datum
      impressum.updatedAt = new Date().toISOString();

      fs.writeFile(impressumPath, JSON.stringify(impressum, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Abschnitt konnten nicht aktualisiert werden.' });
        }
        res.json(updatedSection);
      });
    } catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});

// Abschnitt löschen
router.delete('/section/:id', (req, res) => {
  const impressumPath = path.join(__dirname, '../data/impressum.json');
  const sectionId = req.params.id;
  fs.readFile(impressumPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impressum konnten nicht geladen werden.' });
    }
    try {
      const impressum = JSON.parse(data); 
      impressum.sections = impressum.sections || [];
      const idx = impressum.sections.findIndex(sec => sec.id === sectionId);
      if (idx === -1) {
        return res.status(404).json({ error: 'Abschnitt nicht gefunden.' });
      } 
      impressum.sections.splice(idx, 1);

      // Aktualisiere das Impressum-Datum
      impressum.updatedAt = new Date().toISOString();
      
      fs.writeFile(impressumPath, JSON.stringify(impressum, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Abschnitt konnten nicht gelöscht werden.' });
        }
        res.json({ message: 'Abschnitt gelöscht.' });
      });
    } 
    catch (parseErr) {
      res.status(500).json({ error: 'Impressum-Daten sind ungültig.' });
    }
  });
});


module.exports = router;