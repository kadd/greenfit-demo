import { use, useState, useEffect } from "react";

 import {ContactRequest, GroupedContactRequests, ContactRequestStatus } from "@/types/contactRequests";



import { submitContactRequest as submitContactRequestService,
  fetchContactRequests as fetchContactRequestsService,
  fetchContactRequestsGroupedByEmail as fetchContactRequestsGroupedByEmailService,
  deleteContactRequestById as deleteContactRequestByIdService,
  replyToContactRequest as replyToContactRequestService,
  addCommentToContactRequestById as addCommentToContactRequestByIdService,
  filterContactRequestsByEmail as filterContactRequestsByEmailService,
  exportContactRequestsToCSV as exportContactRequestsToCSVService,
  updateContactRequestStatusById as updateContactRequestStatusByIdService
} from "../services/contactRequests";


export function useContactRequests() {
  const [contactRequestSentStatus, setContactRequestSentStatus] = useState<string>("");
  const [contactRequests, setContactRequests] = useState<GroupedContactRequests>({});
  const [csvData, setCsvData] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function submitContactRequest(data: { name: string; email: string; message: string }) {
    try {
      setLoading(true);
      const result = await submitContactRequestService(data);
      setContactRequestSentStatus((result.success ? "Gesendet!" : "Fehler beim Senden"));
      setMessage(result.msg || "");
      setError(result.error || "");
    } finally {
      setLoading(false);
    }
  }

  async function fetchContactRequests() {
    try {
      setLoading(true);
      const result = await fetchContactRequestsService();
      // Gruppieren nach E-Mail
      const grouped: GroupedContactRequests = {};
      result.forEach((req) => {
        if (!grouped[req.email]) {
          grouped[req.email] = [];
        }
        grouped[req.email].push(req);
      });
      setContactRequests(grouped);
    } finally {
      setLoading(false);
    }
  }

  async function fetchContactRequestsGroupedByEmail() {
    try {
      setLoading(true);
      const result = await fetchContactRequestsGroupedByEmailService();
      setContactRequests(result);
    } finally {
      setLoading(false);
    }
  }

  async function deleteContactRequestById(id: string) {
    try {
      setLoading(true);
      const result = await deleteContactRequestByIdService(id);
      if (!result.success) {
        setError(result.error || "Fehler beim Löschen der Nachricht");
        throw new Error("Fehler beim Löschen der Nachricht");
      }
      setContactRequests((prev) => {
        const updated = { ...prev };
        // Finde die E-Mail, zu der die Nachricht gehört
        for (const email in updated) {
          updated[email] = updated[email].filter(msg => msg.id !== id);
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

  async function replyToContactRequest(data: { email: string; subject: string; message: string }) {
    try {
      setLoading(true);
      const result = await replyToContactRequestService(data);
      if (!result.success) {
        setError(result.error || "Fehler beim Beantworten der Nachricht");
        throw new Error("Fehler beim Beantworten der Nachricht");
      }
      setReplyMessage(result.replyMessage ? `Folgende Antwort an ${result.replyMessage.email} gesendet: ${result.replyMessage.message}` : "");
      setMessage(result.msg || "Nachricht gesendet");
      return result;
    } finally {
      setLoading(false);
    }
  }

  async function addCommentToContactRequestById(data: { id: string; comment: string }) {
    try {
      setLoading(true);
      const result = await addCommentToContactRequestByIdService(data);
      if (!result.success) {
        setError(result.error || "Fehler beim Hinzufügen des Kommentars");
        throw new Error("Fehler beim Hinzufügen des Kommentars");
      }
      // Kommentar im State aktualisieren
      setContactRequests((prev) => {
        const updated = { ...prev };
        for (const email in updated) {
          updated[email] = updated[email].map(msg =>
            msg.id === data.id ? { ...msg, comment: data.comment } : msg
          );
        }
        return updated;
      });
      setMessage(result.msg || "Kommentar hinzugefügt");
      return result;
    } finally {
      setLoading(false);
    }
  }

  async function filterContactRequestsByEmail(email: string) {
    try {
      setLoading(true);
      const allRequests = await fetchContactRequestsService();
      const filtered = allRequests.filter((req) => req.email === email);
      const grouped: GroupedContactRequests = {};
      if (filtered.length > 0) {
        grouped[email] = filtered;
      }
      setContactRequests(grouped);
    } finally {
      setLoading(false);
    }
  }

  async function exportContactRequestsToCSV(requests: ContactRequest[]) {
    try {
      setLoading(true);
      const result = await exportContactRequestsToCSVService(requests);
      setCsvData(result || "");
      return result;
    } finally {
      setLoading(false);
    }
  }

  async function updateContactRequestStatusById(data: { id: string; status: ContactRequestStatus }) {
    try {
      setLoading(true);
      const result = await updateContactRequestStatusByIdService(data);
      if (!result.success) {
        setError(result.error || "Fehler beim Aktualisieren des Status");
        throw new Error("Fehler beim Aktualisieren des Status");
      }
      // Status im State aktualisieren
      setContactRequests((prev) => {
        const updated = { ...prev };
        for (const email in updated) {
          updated[email] = updated[email].map(msg =>
            msg.id === data.id ? { ...msg, status: data.status } : msg
          );
        }
        return updated;
      });
      setMessage(result.msg || "Status aktualisiert");
      return result;
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllContactRequests() {
    try {
      setLoading(true);
      const result = await fetchContactRequestsService();
      setContactRequests(result);
    } finally {
      setLoading(false);
    }
  }

  async function clearAllContactRequests() {
    setContactRequests({});
  }

  // Initial load of contact requests
  useEffect(() => {
    fetchContactRequestsGroupedByEmailService();
  }, []);

  // Automatisches Zurücksetzen von Statusmeldungen nach 5 Sekunden

 useEffect(() => {
  if (contactRequestSentStatus) {
    const timer = setTimeout(() => {
      setContactRequestSentStatus("");
      setMessage("");
      setError("");
    }, 5000);
    return () => clearTimeout(timer);
  }
  fetchContactRequestsGroupedByEmailService().then(setContactRequests);
}, [contactRequestSentStatus]);
  return { 
    contactRequestSentStatus, 
    submitContactRequest, 
    deleteContactRequestById, 
    loading, 
    contactRequests, 
    setContactRequests, 
    csvData, 
    setCsvData, 
    fetchContactRequests, 
    clearAllContactRequests,
    fetchContactRequestsGroupedByEmail, 
    error, 
    message, 
    replyMessage, 
    replyToContactRequest, 
    addCommentToContactRequestById, 
    filterContactRequestsByEmail, 
    exportContactRequestsToCSV, 
    updateContactRequestStatusById 
  };
}
 