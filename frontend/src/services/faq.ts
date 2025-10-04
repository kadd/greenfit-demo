import { FAQ, FAQItem } from "../types/faq";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/faq'
  : "http://localhost:5001/api/faq";
  
export async function fetchFAQ() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Fehler beim Laden der FAQ");
    return await res.json(); // FAQ
  } catch (err) {
    throw new Error("Fehler beim Laden der FAQ");
  }
}   

// create empty FAQ
export async function createFAQ(token: string) {
  const res = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: "Neue FAQ", items: [] }), // Beispielstruktur
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen der FAQ");
  return res.json();
}

// update entire FAQ
export async function updateFAQ(token: string, faqData: Partial<FAQ>) {
  const res = await fetch(`${API_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(faqData),
  });
  if (!res.ok) throw new Error("Fehler beim Aktualisieren der FAQ");
  return res.json();
}

// delete entire FAQ
export async function deleteFAQ(token: string) {
  const res = await fetch(`${API_URL}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Fehler beim Löschen der FAQ");
  return res.json();
}

// Weitere FAQ-bezogene Dienste können hier hinzugefügt werden
// z.B. fetchSingleFAQ, createFAQ, updateFAQ, deleteFAQ etc.
// Diese Funktionen sollten entsprechende API-Endpunkte auf dem Backend ansprechen
// und können Authentifizierungstoken als Parameter akzeptieren, wenn nötig.


// Create a new FAQ item
export async function createFAQItem(token: string, itemData: any) {
  const res = await fetch(`${API_URL}/items/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen des FAQ-Items");
  return res.json();
}

// Fetch a single FAQ item by Item ID
export async function fetchFAQItemById(faqItemId: string) {
  try {
    const res = await fetch(`${API_URL}/items/${faqItemId}`);
    if (!res.ok) throw new Error("Fehler beim Laden des FAQ-Items");
    return await res.json(); // FAQItem
  } catch (err) {
    throw new Error("Fehler beim Laden des FAQ-Items");
  }
}


// delete a FAQ item by Item ID
export async function deleteFAQItemById(token: string, itemId: string) {
  const res = await fetch(`${API_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Fehler beim Löschen des FAQ-Items");
  return res.json();
}


// update a FAQ item by Item ID
export async function updateFAQItemById(token: string, itemId: string, itemData: any) {
  const res = await fetch(`${API_URL}/items/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });
  if (!res.ok) throw new Error("Fehler beim Aktualisieren des FAQ-Items");
  return res.json();
}