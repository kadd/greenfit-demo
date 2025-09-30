const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { getServices } = require("../controllers/servicesController");

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

router.post("/upload-image/:serviceKey", upload.single("image"), (req, res) => {
    const { serviceKey } = req.params;
    const image = req.file;
    if (!image) {
        return res.status(400).json({ message: "No image uploaded" });
    }
    // Handle image upload logic here
    // For example, save the image to a directory and update the service data
    const servicesData = loadServicesData();
    console.log("Loaded services data:", servicesData);
    if (!servicesData.content[serviceKey]) {
        return res.status(404).json({ message: "Service not found" });
    }
    const service = servicesData.content[serviceKey];
    service.image = image.filename;

    fs.writeFileSync(path.join(__dirname, "../data/services.json"), JSON.stringify(servicesData, null, 2));
    res.status(200).json({ message: "Image uploaded successfully", serviceKey, filename: image.filename });
});

module.exports = router;
