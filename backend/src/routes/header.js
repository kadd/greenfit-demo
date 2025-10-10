const express = require("express");
const router = express.Router();

const { loadHeader, saveHeader } = require("../utils/header");

router.get("/", (req, res) => {
  const headerData = loadHeader();
  res.json({ success: true, header: headerData });
});

router.post("/", (req, res) => {
  const newHeader = req.body;
  if (!newHeader || typeof newHeader !== "object") {
    return res.status(400).json({ success: false, message: "Ungültige Header-Daten" });
  }

  saveHeader(newHeader);
  res.json({ success: true, message: "Header-Daten aktualisiert", header: newHeader });
});

module.exports = router;