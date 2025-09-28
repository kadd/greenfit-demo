import { use, useState, useEffect } from "react";

import { GroupedContacts } from "@/types/contact";


import { sendContactForm as sendContactFormService,
  fetchContacts as fetchContactsService,
  fetchContactsGroupedByEmail as fetchContactsGroupedByEmailService,
  deleteContact as deleteContactService
} from "../services/contact";

const API_URL = "http://localhost:5001/api/contact";

export function useContact() {
  const [contactSentStatus, setContactSentStatus] = useState<string>("");
  const [contacts, setContacts] = useState<GroupedContacts>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  async function sendContact(data: { name: string; email: string; message: string }) {
    try {
      setLoading(true);
      const result = await sendContactFormService(data);
      setContactSentStatus( (result.success ? "Gesendet!" : "Fehler beim Senden"));
      setMessage(result.msg || "");
      setErrorMessage(result.error || "");
    } finally {
      setLoading(false);
    }

  }

  async function fetchContactsGroupedByEmail() {
    try {
      setLoading(true);
      const result = await fetchContactsGroupedByEmailService();
      setContacts(result);
    } finally {
      setLoading(false);
    }
  }

  async function deleteContact(date: string) {
    try {
      setLoading(true);
      const result = await deleteContactService(date);
      if (!result.success) {
        throw new Error("Fehler beim Löschen der Nachricht");
      }
     setContacts((prev) => {
      const updated = { ...prev };
      // Finde die E-Mail, zu der die Nachricht gehört
      for (const email in updated) {
        updated[email] = updated[email].filter(msg => msg.date !== date);
        // Optional: Wenn Array leer, E-Mail-Key entfernen
        if (updated[email].length === 0) {
          delete updated[email];
        }
      }
      return updated;
    });
    } finally {
      setLoading(false);
    }
  }

 useEffect(() => {
  if (contactSentStatus) {
    const timer = setTimeout(() => {
      setContactSentStatus("");
      setMessage("");
      setErrorMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }
  fetchContactsGroupedByEmailService().then(setContacts);
}, [contactSentStatus]);
  return { contactSentStatus, sendContact, deleteContact, loading, contacts, fetchContactsGroupedByEmail, errorMessage, message };
}
 