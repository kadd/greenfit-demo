const fs = require("fs");
const path = require("path");

const CONTACTS_FILE = path.join(__dirname, "../data/contacts.json");

exports.submitContact = (req, res) => {
  const { name, email, message } = req.body;

  // Neue Anfrage
  const newContact = {
    name,
    email,
    message,
    date: new Date().toISOString(),
  };

  // Bestehende Anfragen laden
  let contacts = [];
  if (fs.existsSync(CONTACTS_FILE)) {
    try {
      const fileContent = fs.readFileSync(CONTACTS_FILE, "utf8");
      contacts = fileContent.trim().length > 0 ? JSON.parse(fileContent) : [];
    } catch (err) {
      contacts = [];
    }
  }

  // Neue Anfrage hinzufügen
  contacts.push(newContact);

  // Datei speichern
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));

  console.log("📩 Neue Kontaktanfrage:", newContact);
  console.log("📩 Alle Kontaktanfragen:", contacts);


  res.json({ success: true, msg: "Nachricht erhalten! Vielen Dank 🙌" });
};

exports.getContacts = (req, res) => {
  const CONTACTS_FILE = path.join(__dirname, "../data/contacts.json");
  let contacts = [];
  if (fs.existsSync(CONTACTS_FILE)) {
    try {
      const fileContent = fs.readFileSync(CONTACTS_FILE, "utf8");
      contacts = fileContent.trim().length > 0 ? JSON.parse(fileContent) : [];
    } catch (err) {
      contacts = [];
    }
  }
  res.json(contacts);
};

exports.getContactsGroupedByEmail = (req, res) => {
  const CONTACTS_FILE = path.join(__dirname, "../data/contacts.json");
  let contacts = [];
  if (fs.existsSync(CONTACTS_FILE)) {
    try {
      const fileContent = fs.readFileSync(CONTACTS_FILE, "utf8");
      contacts = fileContent.trim().length > 0 ? JSON.parse(fileContent) : [];
    } catch (err) {
      contacts = [];
    }
  }

  // Gruppieren nach E-Mail
  const grouped = {};
  contacts.forEach(contact => {
    if (!grouped[contact.email]) {
      grouped[contact.email] = [];
    }
    grouped[contact.email].push(contact);
  });

  res.json(grouped);
};

exports.clearContacts = (req, res) => {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2));
  res.json({ success: true, msg: "Alle Kontaktanfragen wurden gelöscht." });
};

exports.deleteContact = (req, res) => {
  const { date } = req.body;
  const CONTACTS_FILE = path.join(__dirname, "../data/contacts.json");
  let contacts = [];
  if (fs.existsSync(CONTACTS_FILE)) {
    const fileContent = fs.readFileSync(CONTACTS_FILE, "utf8");
    contacts = fileContent.trim().length > 0 ? JSON.parse(fileContent) : [];
  }
  // Filtere die Nachricht heraus
  contacts = contacts.filter(msg => msg.date !== date);
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
  res.json({ success: true });
};

// Optional: Funktion zum Laden aller Kontakte (für Admin-Dashboard)
// exports.getAllContacts = (req, res) => {
//   if (!fs.existsSync(CONTACTS_FILE)) {
//     return res.json([]);
//   }
//   const contacts = JSON.parse(fs.readFileSync(CONTACTS_FILE, "utf8"));
//   res.json(contacts);
// };

// Optional: Funktion zum Löschen aller Kontakte (für Admin-Dashboard)