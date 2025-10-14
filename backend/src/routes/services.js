const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { getServices } = require("../controllers/servicesController");

const { backupData } = require("../utils/data");

// Hilfsfunktion zum Laden der aktuellen services.json

const loadServicesData = () => {
  const filePath = path.join(__dirname, "../data/services.json");
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
  }
  return { services: {} };
}

// Datei-Upload und -Verwaltung
const multer = require("multer");

// Speicherorte für verschiedene Bereiche
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Immer in den Services-Ordner speichern!
    cb(null, path.join(__dirname, "../../uploads/services"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", getServices);


// create empty services-object
router.post("/create", (req, res) => {
  const servicesPath = path.join(__dirname, "../data/services.json");
  console.log(`Creating empty services in:`, servicesPath);
  const emptyServices = {
    id: "services-1",
    label: "Unsere Leistungen",
    title: "Leistungen",
    description: "Wir bieten eine Vielzahl von Fitness- und Ernährungsdienstleistungen an.",
    isPage: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {}
  };
  fs.writeFile(servicesPath, JSON.stringify(emptyServices, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Services konnten nicht erstellt werden.' });
    }
    res.status(201).json(emptyServices);
  });
});

// Prevent concurrent writes
let isWriting = false;

// Update entire services object
router.put("/", (req, res) => {
  if (isWriting) {
    return res.status(429).json({ error: 'Bitte warte, die Services werden gerade gespeichert.' });
  }
  isWriting = true;
  const services = req.body;
  const servicesPath = path.join(__dirname, '../data/services.json');
  console.log(`Updating entire services in:`, servicesPath);

  // Optional: Validierung
  if (!services || typeof services !== 'object' || !services.content) {
    isWriting = false;
    return res.status(400).json({ error: 'Ungültige Services-Daten.' });
  }

  // id zu services hinzufügen
  services.id = services.id || `services-${Date.now()}`;
  services.updatedAt = new Date().toISOString();

  // Backup der aktuellen Daten vor dem Speichern
  backupData().then((backupPath) => {
    console.log("Backup erstellt unter:", backupPath);
  }).catch((err) => {
    console.error("Fehler beim Erstellen des Backups:", err);
  });

  // Speichere die Services
  fs.writeFile(servicesPath, JSON.stringify(services, null, 2), (writeErr) => {
    isWriting = false;
    if (writeErr) {
      return res.status(500).json({ error: 'Services konnten nicht gespeichert werden.' });
    }
    res.status(200).json(services);
  });
});

// Delete entire services object
router.delete("/", (req, res) => {
  const servicesPath = path.join(__dirname, "../data/services.json");
  console.log(`Deleting entire services in:`, servicesPath);
  fs.writeFile(servicesPath, JSON.stringify({
    id: "services-1",
    label: "Unsere Leistungen",
    title: "Leistungen",
    description: "Wir bieten eine Vielzahl von Fitness- und Ernährungsdienstleistungen an.",
    isPage: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {}
  }, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Services konnten nicht gelöscht werden.' });
    }
    res.json({ message: 'Services wurden gelöscht.' });
  });
});

// create specific content-item for existing service object
router.post("/create/:contentKey", (req, res) => {
  const { contentKey } = req.params;
  const serviceData = req.body;
  const servicesPath = path.join(__dirname, "../data/services.json");
  console.log(`Creating service ${contentKey} in:`, servicesPath);
  const servicesData = loadServicesData();
  if (servicesData.content[contentKey]) {
    return res.status(400).json({ error: 'Service mit diesem Schlüssel existiert bereits.' });
  }
  servicesData.content[contentKey] = {
    id: contentKey,
    title: serviceData.title || "Neuer Service",
    description: serviceData.description || "",
    image: serviceData.image || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };  
  // Aktualisiere das updatedAt-Feld
  servicesData.updatedAt = new Date().toISOString();

  fs.writeFile(servicesPath, JSON.stringify(servicesData, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Service konnte nicht erstellt werden.' });
    }
    res.status(201).json({ message: 'Service wurde erstellt.', serviceKey, service: servicesData.content[serviceKey] });
  });
});

// update specific content-item for existing service object
router.post("/:contentKey", (req, res) => {
  const { contentKey } = req.params;
  const updatedData = req.body;
  const servicesPath = path.join(__dirname, "../data/services.json");
  console.log(`Updating service ${contentKey} in:`, servicesPath);
  const servicesData = loadServicesData();
  if (!servicesData.content[contentKey]) {
    return res.status(404).json({ error: 'Service nicht gefunden.' });
  }
  const service = servicesData.content[contentKey];
  servicesData.content[contentKey] = {
    ...service,
    ...updatedData,
    updatedAt: new Date().toISOString()
  };

  // Aktualisiere das updatedAt-Feld
  servicesData.updatedAt = new Date().toISOString();

  // Backup der aktuellen Daten vor dem Speichern
  backupData().then((backupPath) => {
    console.log("Backup erstellt unter:", backupPath);
  }).catch((err) => {
    console.error("Fehler beim Erstellen des Backups:", err);
  });

  fs.writeFile(servicesPath, JSON.stringify(servicesData, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Service konnte nicht aktualisiert werden.' });
    }
    res.json({ message: 'Service wurde aktualisiert.', contentKey, service: servicesData.content[contentKey] });
  });
});

// delete specific content-item for existing service object
router.delete("/:contentKey", (req, res) => {
  const { contentKey } = req.params;
  const servicesPath = path.join(__dirname, "../data/services.json");
  console.log(`Deleting service ${contentKey} in:`, servicesPath);
  const servicesData = loadServicesData();
  if (!servicesData.content[contentKey]) {
    return res.status(404).json({ error: 'Service nicht gefunden.' });
  }
  delete servicesData.content[contentKey];

  // Aktualisiere das updatedAt-Feld
  servicesData.updatedAt = new Date().toISOString();

  fs.writeFile(servicesPath, JSON.stringify(servicesData, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Service konnte nicht gelöscht werden.' });
    }
    res.json({ message: 'Service wurde gelöscht.', contentKey });
  });
});

// Image upload for specific content-item of existing service object
router.post("/upload-image/:contentKey", upload.single("image"), (req, res) => {
    const { contentKey } = req.params;
    const image = req.file;
    if (!image) {
        return res.status(400).json({ message: "No image uploaded" });
    }
    // Handle image upload logic here
    // For example, save the image to a directory and update the service data
    const servicesData = loadServicesData();
    console.log("Loaded services data:", servicesData);
    if (!servicesData.content[contentKey]) {
        return res.status(404).json({ message: "Service not found" });
    }
    const service = servicesData.content[contentKey];
    service.image = image.filename;

    fs.writeFileSync(path.join(__dirname, "../data/services.json"), JSON.stringify(servicesData, null, 2));
    res.status(200).json({ message: "Image uploaded successfully", contentKey, filename: image.filename });
});


// Image delete for specific content-item of existing service object
router.delete("/delete-image/:contentKey", (req, res) => {
    const { contentKey } = req.params;
    const servicesData = loadServicesData();
    if (!servicesData.content[contentKey]) {
        return res.status(404).json({ message: "Service not found" });
    }
    const service = servicesData.content[contentKey];
    if (service.image) {
        const imagePath = path.join(__dirname, "../../uploads/services", service.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        service.image = "";
        fs.writeFileSync(path.join(__dirname, "../data/services.json"), JSON.stringify(servicesData, null, 2));
        return res.status(200).json({ message: "Image deleted successfully", contentKey  });
    } else {
        return res.status(400).json({ message: "No image to delete for this service" });
    }
});

module.exports = router;
