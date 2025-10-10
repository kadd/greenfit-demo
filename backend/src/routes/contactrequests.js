const express = require("express");
const router = express.Router();
const { submitContactRequest, getContactRequests, getContactRequestsGroupedByEmail,
    deleteContactRequestById, replyContactRequest, getAllContactRequests, clearContactRequests,
    addCommentToContactRequestById, exportContactRequestsToCSV, filterContactRequestsByEmail,
    updateContactRequestStatusById
 } = require("../controllers/contactRequestsController");


 // Kontaktformular einreichen
router.post("/", submitContactRequest);

// Kontaktanfragen abrufen
router.get("/", getContactRequests);

// Status des Kontaktformulars abrufen (aktiv/inaktiv) (Platzhalter)
router.get("/status", (req, res) => {
    // Hier könnte man den Status aus einer Datei oder Datenbank laden
    // Für dieses Beispiel nehmen wir an, dass es immer "aktiv" ist
  res.json({ status: "active" });
});

// Kontaktanfragen nach E-Mail gruppiert abrufen
router.get("/groupedByEmail", getContactRequestsGroupedByEmail);

// Kontaktanfrage löschen
router.delete("/:date", deleteContactRequestById);

// Kontaktanfrage beantworten (Platzhalter)
router.post("/:id/reply", replyContactRequest);

// Kommentar zu Kontaktanfrage hinzufügen
router.put("/:id/comment", addCommentToContactRequestById);

// Kontaktanfragen nach E-Mail filtern
router.get("/filterbyEmail", filterContactRequestsByEmail);

// Kontaktanfragen als CSV exportieren
router.get("/export/csv", exportContactRequestsToCSV);

// Kontaktrequeststatus aktualisieren
router.put("/status", updateContactRequestStatusById);

// Optional: Alle Kontaktanfragen abrufen (für Admin-Dashboard)
 router.get("/all", getAllContactRequests);

// Optional: Alle Kontaktanfragen löschen (für Admin-Dashboard)
router.delete("/clear", clearContactRequests);

// Exportiere den Router
module.exports = router;
