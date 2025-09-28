const express = require("express");
const router = express.Router();
const { submitContact, getContacts, getContactsGroupedByEmail,
    deleteContact
 } = require("../controllers/contactController");

router.post("/", submitContact);
router.get("/contacts", getContacts);
router.get("/contacts/groupedByEmail", getContactsGroupedByEmail);
router.delete("/contacts", deleteContact);


module.exports = router;
