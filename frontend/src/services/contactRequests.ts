const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/contactrequests'
  : "http://localhost:5001/api/contactrequests";

  import {ContactRequest, GroupedContactRequests, ContactRequestStatus } from "@/types/contactRequests";


export async function submitContactRequest(data: { name: string; email: string; message: string } ) {
  try {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return await res.json(); // { msg: "Gesendet!" }
  } catch (err) {
    throw new Error("Fehler beim Senden des Kontaktformulars");
  }
}

// Status des Kontaktformulars abrufen (aktiv/inaktiv) ---IGNORE---
export async function getContactFormStatus() {
  const res = await fetch(`${API_URL}/status`);
  return res.json();
}

export async function fetchContactRequests() {
  const res = await fetch(`${API_URL}`);
  return res.json();
}

export async function fetchContactRequestsGroupedByEmail() {
  const res = await fetch(`${API_URL}/groupedByEmail`);
  return res.json();
}

export async function deleteContactRequestById(id: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

// Nachricht beantworten (Platzhalter)
export async function replyToContactRequest(data: { email: string; subject: string; message: string }) {
  const res = await fetch(`${API_URL}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Kommentar zu einer Kontaktanfrage hinzufügen
export async function addCommentToContactRequestById(data: { id: string; comment: string }) {
  const res = await fetch(`${API_URL}/${data.id}/comment`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Kontaktanfragen nach email filtern (für Admin-Dashboard)
export async function filterContactRequestsByEmail(email: string) {
  const res = await fetch(`${API_URL}/filterbyEmail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

// Exportiere Kontaktanfragen als CSV
export async function exportContactRequestsToCSV(requests: ContactRequest[]) {
  const res = await fetch(`${API_URL}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requests),
  });
  if (!res.ok) throw new Error("Fehler beim Exportieren der Kontaktanfragen");
  return res.text(); // CSV-Daten als Text zurückgeben
}

// Kontaktstatus aktualisieren
export async function updateContactRequestStatusById(data: { id: string; status: "open" | "closed" | "in progress" }) {
  const res = await fetch(`${API_URL}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Optional: Alle Kontaktanfragen abrufen (für Admin-Dashboard)
export async function getAllContactRequests() {
  const res = await fetch(`${API_URL}/all`);
  return res.json();
}

// Optional: Alle Kontaktanfragen löschen (für Admin-Dashboard)
export async function clearContactRequests() {
  const res = await fetch(`${API_URL}/clear`, {
    method: "DELETE",
  });
  return res.json();
}

