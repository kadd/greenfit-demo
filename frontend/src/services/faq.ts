import { FAQ, FAQItem, FAQStatistics } from "../types/faq";

const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return `${base}/faq`;
  }
  return "http://localhost:5001/api/faq";
};

const API_URL = getApiUrl();
  
export async function fetchFAQService() {
  try {
    const res = await fetch(`${API_URL}`);
    if (!res.ok) throw new Error("Fehler beim Laden der FAQ");
    return await res.json(); // FAQ
  } catch (err) {
    throw new Error("Fehler beim Laden der FAQ");
  }
}  

// create empty FAQ
export async function createFAQService(token: string) {
  try {
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
  } catch (err) {
    throw new Error("Fehler beim Erstellen der FAQ");
  }
}

// update entire FAQ
export async function updateFAQService(token: string, faqData: Partial<FAQ>) {
  try {
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
  } catch (err) {
    throw new Error("Fehler beim Aktualisieren der FAQ");
  }
}

// delete entire FAQ
export async function deleteFAQService(token: string) {
  try {
    const res = await fetch(`${API_URL}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Fehler beim Löschen der FAQ");
  return res.json();
  } catch (err) {
    throw new Error("Fehler beim Löschen der FAQ");
  }
}

// Weitere FAQ-bezogene Dienste können hier hinzugefügt werden
// z.B. fetchSingleFAQ, createFAQ, updateFAQ, deleteFAQ etc.
// Diese Funktionen sollten entsprechende API-Endpunkte auf dem Backend ansprechen
// und können Authentifizierungstoken als Parameter akzeptieren, wenn nötig.


// Create a new FAQ item
export async function createFAQItemService(token: string, itemData: any) {
  try {
    const res = await fetch(`${API_URL}/item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    body: JSON.stringify(itemData),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen des FAQ-Items");
  return res.json();
  } catch (err) {
    throw new Error("Fehler beim Erstellen des FAQ-Items");
  }
}

// Fetch a single FAQ item by Item ID
export async function fetchFAQItemByIdService(faqItemId: string) {
  try {
    const res = await fetch(`${API_URL}/items/${faqItemId}`);
    if (!res.ok) throw new Error("Fehler beim Laden des FAQ-Items");
    return await res.json(); // FAQItem
  } catch (err) {
    throw new Error("Fehler beim Laden des FAQ-Items");
  }
}


// delete a FAQ item by Item ID
export async function deleteFAQItemByIdService(token: string, itemId: string) {
  try {
    const res = await fetch(`${API_URL}/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Fehler beim Löschen des FAQ-Items");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Löschen des FAQ-Items");
  }
}


// update a FAQ item by Item ID
export async function updateFAQItemByIdService(token: string, itemId: string, itemData: any) {
  try {
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
  } catch (err) {
    throw new Error("Fehler beim Aktualisieren des FAQ-Items");
  }
}

// reset FAQ 
export async function resetFAQToDefaultService(token: string) {
  try {
    const res = await fetch(`${API_URL}/reset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Fehler beim Zurücksetzen der FAQ");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Zurücksetzen der FAQ");
  }
}

// reorder FAQ items
export async function reorderFAQItemsService(token: string, newOrder: string[]) {
  try {
    const res = await fetch(`${API_URL}/items/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order: newOrder }),
    });
    if (!res.ok) throw new Error("Fehler beim Neuordnen der FAQ-Items");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Neuordnen der FAQ-Items");
  }
}

// Buk Operations

export async function bulkDeleteFAQItemsService(token: string, itemIds: string[]) {
  try {
    const res = await fetch(`${API_URL}/items/bulk-delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemIds }),
    });
    if (!res.ok) throw new Error("Fehler beim Löschen der FAQ-Items");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Löschen der FAQ-Items");
  }
}

export async function bulkUpdateFAQItemsService(token: string, itemsData: { id: string; data: Partial<FAQItem> }[]) {
  try {
    const res = await fetch(`${API_URL}/items/bulk-update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: itemsData }),
    });
    if (!res.ok) throw new Error("Fehler beim Aktualisieren der FAQ-Items");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Aktualisieren der FAQ-Items");
  }
}

// export FAQ
export async function exportFAQDataService() {
  try {
    const res = await fetch(`${API_URL}/export`);
    if (!res.ok) throw new Error("Fehler beim Exportieren der FAQ");
    return res.blob(); // Return as Blob for file download
  } catch (err) {
    throw new Error("Fehler beim Exportieren der FAQ");
  }
}

// import FAQ
export async function importFAQDataFromFileService(token: string, file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) throw new Error("Fehler beim Importieren der FAQ");
    return res.json(); // Return imported FAQ data
  } catch (err) {
    throw new Error("Fehler beim Importieren der FAQ");
  }
}

// validate FAQ structure
export function validateFAQStructureService(faqData: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (typeof faqData.title !== "string" || faqData.title.trim() === "") {
    errors.push("Titel der FAQ ist ungültig.");
  }
  if (!Array.isArray(faqData.items)) {
    errors.push("Items müssen ein Array sein.");
  } else {
    faqData.items.forEach((item: any, index: number) => {
      if (typeof item.question !== "string" || item.question.trim() === "") {
        errors.push(`Frage im Item ${index + 1} ist ungültig.`);
      }
      if (typeof item.answer !== "string" || item.answer.trim() === "") {
        errors.push(`Antwort im Item ${index + 1} ist ungültig.`);
      }
    });
  }
  return { valid: errors.length === 0, errors };
}

//FAQ Search

export async function searchFAQItemsService(query: string): Promise<FAQ[]> {
  try {
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Fehler beim Suchen in der FAQ");
    return await res.json(); // Array of FAQ
  } catch (err) {
    throw new Error("Fehler beim Suchen in der FAQ");
  }
}

// Fetch FAQ statistics

export async function getFAQStatisticsService(faq: FAQ) : Promise<FAQStatistics> {
  const items = faq?.items || [];
  return Promise.resolve({
    totalItems: items.length,
    totalWords: items.reduce((acc, item) =>
      acc + item.question.split(' ').length + item.answer.split(' ').length, 0
    ),
    totalCharacters: items.reduce((acc, item) =>
      acc + item.question.length + item.answer.length, 0
    ),
    averageWordsPerItem: items.length > 0 ? Math.round(
      items.reduce((acc, item) =>
        acc + item.question.split(' ').length + item.answer.split(' ').length, 0
      ) / items.length
    ) : 0,
    isEmpty: items.length === 0,
    lastUpdated: faq.updatedAt ? new Date(faq.updatedAt) : null
  });
}
