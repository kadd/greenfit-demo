import { TermsSection } from "@/types/terms";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/terms'
  : "http://localhost:5001/api/terms";

export async function fetchTerms() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Fehler beim Laden der AGB");
    return await res.json(); // AGB
  } catch (err) {
    throw new Error("Fehler beim Laden der AGB");
  }
}   

//create empty terms
export async function createTerms(token: string) {
  try {
    const res = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Fehler beim Erstellen der AGB");
    return await res.json(); // leere AGB
  } catch (err) {
    throw new Error("Fehler beim Erstellen der AGB");
  }
}   

//update entire terms
export async function updateTerms(token: string, terms: Partial<Terms>) {
  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(terms)
    });
    if (!res.ok) throw new Error("Fehler beim Speichern der AGB");
    return await res.json(); // aktualisierte AGB
  } catch (err) {
    throw new Error("Fehler beim Speichern der AGB");
  }
}   

//delete entire terms
export async function deleteTerms(token: string) {
  try {
    const res = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Fehler beim Löschen der AGB");
    return await res.json(); // Erfolgsmeldung
  } catch (err) {
    throw new Error("Fehler beim Löschen der AGB");
  }
} 

// create new terms section
export function createTermsSection(terms: Partial<Terms>, heading = "Neue Überschrift", text = "Neuer Text") {
  const newSection = {
    id: `section-${terms.sections.length + 1}`,
    heading,
    text
  };
  return { ...terms, sections: [...terms.sections, newSection] };
}

// fetch single terms section by ID
export async function fetchTermsSectionById(sectionId: string) {
  try {
    const res = await fetch(`${API_URL}/${sectionId}`);
    if (!res.ok) throw new Error("Fehler beim Laden des AGB-Abschnitts");
    return await res.json(); // einzelner AGB-Abschnitt
  } catch (err) {
    throw new Error("Fehler beim Laden des AGB-Abschnitts");
  }
}

// delete single terms section by ID
export async function deleteTermsSectionById(token: string, sectionId: string) {
  try {
    const res = await fetch(`${API_URL}/${sectionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Fehler beim Löschen des AGB-Abschnitts");
    return await res.json(); // Erfolgsmeldung
  } catch (err) {
    throw new Error("Fehler beim Löschen des AGB-Abschnitts");
  }
}  

// update single terms section by ID
export async function updateTermsSectionById(token: string, sectionId: string, updatedSection: Partial<TermsSection>) {
  try {
    const res = await fetch(`${API_URL}/${sectionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedSection)
    });
    if (!res.ok) throw new Error("Fehler beim Aktualisieren des AGB-Abschnitts");
    return await res.json(); // aktualisierter AGB-Abschnitt
  } catch (err) {
    throw new Error("Fehler beim Aktualisieren des AGB-Abschnitts");
  }
}
