const fs = require("fs");
const path = require("path");
const md5 = require("md5");

const CONTACTREQUESTS_FILE = path.join(__dirname, "../data/contactrequests.json");

exports.submitContactRequest = (req, res) => {
  const { name, email, message } = req.body;

  // Neue Anfrage
  const newContactRequest = {
    id: md5(Date.now().toString()),
    name,
    email,
    message,
    date: new Date().toISOString(),
  };

  // Bestehende Anfragen laden
  let contactrequests = [];
  if (fs.existsSync(CONTACTREQUESTS_FILE)) {
    try {
      const fileContent = fs.readFileSync(CONTACTREQUESTS_FILE, "utf8");
      contactrequests = fileContent.trim().length > 0 ? JSON.parse(fileContent) : [];
    } catch (err) {
      contactrequests = [];
    }
  }

  // Neue Anfrage hinzufügen
  contactrequests.push(newContactRequest);

  // Datei speichern
  fs.writeFileSync(CONTACTREQUESTS_FILE, JSON.stringify(contactrequests, null, 2));

  console.log("📩 Neue Kontaktanfrage:", newContactRequest);
  console.log("📩 Alle Kontaktanfragen:", contactrequests);


  res.json({ success: true, msg: "Nachricht erhalten! Vielen Dank 🙌" });
};

// Lade alle Kontaktanfragen
exports.getContactRequests = (req, res) => {
  let contactrequests = [];
  if (fs.existsSync(CONTACTREQUESTS_FILE)) {
    try {
      const fileContent = fs.readFileSync(CONTACTREQUESTS_FILE, "utf8");
      contactrequests = fileContent.trim().length > 0 ? JSON.parse(fileContent) : [];
    } catch (err) {
      contactrequests = [];
    }
  }
  res.json(contactrequests);
};


// Lade alle Kontaktanfragen gruppiert nach E-Mail
exports.getContactRequestsGroupedByEmail = (req, res) => {
  let contactrequests = [];
  if (fs.existsSync(CONTACTREQUESTS_FILE)) {
    try {
      const fileContent = fs.readFileSync(CONTACTREQUESTS_FILE, "utf8");
      contactrequests = fileContent.trim().length > 0 ? JSON.parse(fileContent) : [];
    } catch (err) {
      contactrequests = [];
    }
  }

  // Gruppieren nach E-Mail
  const grouped = {};
  contactrequests.forEach(contactrequest => {
    if (!grouped[contactrequest.email]) {
      grouped[contactrequest.email] = [];
    }
    grouped[contactrequest.email].push(contactrequest);
  });
  console.log("📬 Gruppierte Kontaktanfragen:", grouped);
  res.json(grouped);
};


// Lösche alle Kontaktanfragen (für Admin-Dashboard)
exports.clearContactRequests = (req, res) => {
  fs.writeFileSync(CONTACTREQUESTS_FILE, JSON.stringify([], null, 2));
  res.json({ success: true, msg: "Alle Kontaktanfragen wurden gelöscht." });
};

// Lösche Kontaktanfrage nach ID
exports.deleteContactRequestById = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID ist erforderlich.' });
  }
  if (!fs.existsSync(CONTACTREQUESTS_FILE)) {
    return res.status(404).json({ error: 'Keine Kontaktanfragen gefunden.' });
  }
  let contactrequests = [];
  if (fs.existsSync(CONTACTREQUESTS_FILE)) {
    const fileContent = fs.readFileSync(CONTACTREQUESTS_FILE, "utf8");
    contactrequests = fileContent.trim().length > 0 ? JSON.parse(fileContent) : [];
  }
  // Filtere die Nachricht heraus
  contactrequests = contactrequests.filter(msg => msg.id !== id);
  fs.writeFileSync(CONTACTREQUESTS_FILE, JSON.stringify(contactrequests, null, 2));
  res.json({ success: true });
};

// Nachricht beantworten (Platzhalter)
exports.replyContactRequest = (req, res) => {
  const { email, subject, message } = req.body;
  // Hier könnte man E-Mail-Versandlogik hinzufügen
  console.log(`Antwort an ${email}: Betreff: ${subject}, Nachricht: ${message}`);
  res.json({ success: true, msg: "Antwort gesendet!", replyMessage: { email, subject, message } });
};

// erstelle Kommentar zu Kontaktanfrage
exports.addCommentToContactRequest = (req, res) => {
  const { id, comment } = req.body;
  if (!id || !comment) {
    return res.status(400).json({ error: 'ID und Kommentar sind erforderlich.' });
  }
  let contactrequests = [];
  if (fs.existsSync(CONTACTREQUESTS_FILE)) {
    const fileContent = fs.readFileSync(CONTACTREQUESTS_FILE, "utf8");
    contactrequests = fileContent.trim().length > 0 ? JSON.parse(fileContent) : [];
  }
  const contactIndex = contactrequests.findIndex(msg => msg.id === id);
  if (contactIndex === -1) {
    return res.status(404).json({ error: 'Kontaktanfrage nicht gefunden.' });
  }
  contactrequests[contactIndex].comment = comment;
  fs.writeFileSync(CONTACTREQUESTS_FILE, JSON.stringify(contactrequests, null, 2));
  res.json({ success: true, msg: "Kommentar hinzugefügt!" });
  console.log(`Kommentar zu Kontaktanfrage am ${date}: ${comment}`);
  return res.json({ success: true, msg: "Kommentar hinzugefügt!" });
};

// exportiere alle Kontaktanfragen in csv (für Admin-Dashboard)
  exports.exportContactRequestsToCSV = (req, res) => {
    const contactrequests = req.body;

    if (!Array.isArray(contactrequests) || contactrequests.length === 0) {
      return res.status(404).json({ error: 'Keine Daten erhalten.' });
    }

    // CSV-Header
    const headers = Object.keys(contactrequests[0]).join(",") + "\n";
    const rows = contactrequests.map(contactrequest => {
      return Object.values(contactrequest).map(value => {
        // Escape-Kommas und Anführungszeichen
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(",");
    }).join("\n");

    const csvContent = headers + rows;

    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csvContent);
  };

// filtere Kontaktanfragen nach E-Mail (für Admin-Dashboard)
 exports.filterContactRequestsByEmail = (req, res) => {
   const { email } = req.body;
   if (!email) {
     return res.status(400).json({ error: 'E-Mail ist erforderlich.' });
   }
   if (!fs.existsSync(CONTACTREQUESTS_FILE)) {
     return res.json([]);
   }
   let contactrequests = JSON.parse(fs.readFileSync(CONTACTREQUESTS_FILE, "utf8"));
   contactrequests = contactrequests.filter(contactrequest => contactrequest.email === email);
   res.json(contactrequests);
 };

 // markiere Kontaktanfrage mit Status (für Admin-Dashboard)
 exports.updateContactRequestStatus = (req, res) => {
   const { date, status } = req.body;
   if (!date || !status) {
     return res.status(400).json({ error: 'Datum und Status sind erforderlich.' });
   }
   let contactrequests = [];
   if (fs.existsSync(CONTACTREQUESTS_FILE)) {
     const fileContent = fs.readFileSync(CONTACTREQUESTS_FILE, "utf8");
     contactrequests = fileContent.trim().length > 0 ? JSON.parse(fileContent) : [];
   }
   const contactIndex = contactrequests.findIndex(msg => msg.date === date);
   if (contactIndex === -1) {
     return res.status(404).json({ error: 'Kontaktanfrage nicht gefunden.' });
   }
   contactrequests[contactIndex].status = status;
   fs.writeFileSync(CONTACTREQUESTS_FILE, JSON.stringify(contactrequests, null, 2));
   res.json({ success: true, msg: "Status aktualisiert!" });
 };

// Optional: Funktion zum Laden aller Kontaktanfragen (für Admin-Dashboard)
 exports.getAllContactRequests = (req, res) => {
   if (!fs.existsSync(CONTACTREQUESTS_FILE)) {
     return res.json([]);
   }
   const contactrequests = JSON.parse(fs.readFileSync(CONTACTREQUESTS_FILE, "utf8"));
   res.json(contactrequests);
};

// Optional: Funktion zum Löschen aller Kontaktanfragen (für Admin-Dashboard)
  exports.clearContactRequests = (req, res) => {
    fs.writeFileSync(CONTACTREQUESTS_FILE, JSON.stringify([], null, 2));
    res.json({ success: true, msg: "Alle Kontaktanfragen wurden gelöscht." });
  };