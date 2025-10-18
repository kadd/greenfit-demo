

import { Terms, TermsSection, TermsStatistics } from "@/types/terms";
import { text } from "stream/consumers";

const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return `${base}/terms`;
  }
  return "http://localhost:5001/api/terms";
};

const API_URL = getApiUrl();

export async function fetchTermsService() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Fehler beim Laden der AGB");
    return await res.json(); // AGB
  } catch (err) {
    throw new Error("Fehler beim Laden der AGB");
  }
}   

//create empty terms
export async function createTermsService(token: string) {
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
export async function updateTermsService(token: string, termsData: Partial<Terms>) {
  try {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(termsData)
    });
    if (!res.ok) throw new Error("Fehler beim Speichern der AGB");
    return await res.json(); // aktualisierte AGB
  } catch (err) {
    throw new Error("Fehler beim Speichern der AGB");
  }
}   

//delete entire terms
export async function deleteTermsService(token: string) {
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
export async function createTermsSectionService(token: string, sectionData: {heading: string; text: string}) {
  try {
   const response = await fetch(`${API_URL}/section`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(sectionData)
    });
    if (!response.ok) throw new Error("Fehler beim Erstellen des AGB-Abschnitts");
    return response.json(); // neu erstellter AGB-Abschnitt
  } catch (err) {
    throw new Error("Fehler beim Erstellen des AGB-Abschnitts");
  }
}

//fetch single terms section by ID
export async function fetchTermsSectionByIdService(sectionId: string) {
  try {
    const res = await fetch(`${API_URL}/sections/${sectionId}`);
    if (!res.ok) throw new Error("Fehler beim Laden des AGB-Abschnitts");
    return await res.json(); // einzelner AGB-Abschnitt
  } catch (err) {
    throw new Error("Fehler beim Laden des AGB-Abschnitts");
  }
}


// delete single terms section by ID
export async function deleteTermsSectionByIdService(token: string, sectionId: string) {
  try {
    const res = await fetch(`${API_URL}/sections/${sectionId}`, {
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
export async function updateTermsSectionByIdService(token: string, sectionId: string, updatedSection: Partial<TermsSection>) {
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

// reset terms to default
export async function resetTermsToDefaultService(token: string) {
  try {
    const res = await fetch(`${API_URL}/reset`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Fehler beim Zurücksetzen der AGB");
    return await res.json(); // zurückgesetzte AGB
  } catch (err) {
    throw new Error("Fehler beim Zurücksetzen der AGB");
  }
} 

// reorder terms sections
export async function reorderTermsSectionsService(token: string, newOrder: string[]) {
  try {
    const res = await fetch(`${API_URL}/sections/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ order: newOrder })
    });
    if (!res.ok) throw new Error("Fehler beim Neuordnen der AGB-Abschnitte");
    return await res.json(); // neu geordnete AGB
  } catch (err) {
    throw new Error("Fehler beim Neuordnen der AGB-Abschnitte");
  }
}

// frontend/src/services/terms.ts - Zusätzliche Enterprise-Features:

// ✅ Bulk Operations
export async function bulkDeleteTermsSectionsService(token: string, sectionIds: string[]) {
  try {
    const deletePromises = sectionIds.map(id => 
      deleteTermsSectionByIdService(token, id)
    );
    const results = await Promise.allSettled(deletePromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    if (failed > 0) {
      throw new Error(`${failed} von ${sectionIds.length} AGB-Abschnitten konnten nicht gelöscht werden.`);
    }
    return {
       message: `${successful} AGB-Abschnitte erfolgreich gelöscht.`,
       successful,
       failed,
       total: sectionIds.length,
       results
    };
  } catch (err) {
    throw new Error("Fehler beim Massenlöschen der AGB-Abschnitte");
  }
}

// ✅ Bulk Update
export async function bulkUpdateTermsSectionsService(
  token: string, 
  updates: Array<{ id: string; data: Partial<TermsSection> }>
) {
  try {
    const updatePromises = updates.map(({ id, data }) =>
      updateTermsSectionByIdService(token, id, data)
    );
    const results = await Promise.allSettled(updatePromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    if (failed > 0) {
      throw new Error(`${failed} von ${updates.length} AGB-Abschnitten konnten nicht aktualisiert werden.`);
    }
    return {
       message: `${successful} AGB-Abschnitte erfolgreich aktualisiert.`,
       successful,
       failed,
       total: updates.length,
       results
    };  
  } catch (err) {
    throw new Error("Fehler beim Massenaktualisieren der AGB-Abschnitte");
  }
}

// ✅ Terms Export
export async function exportTermsDataService(token: string) {
  try {
    const res = await fetchTermsService();
    if (!res) throw new Error("Keine AGB zum Exportieren gefunden");
    // Metadaten hinzufügen
    const exportData = {
      ...res,
      exportedAt: new Date().toISOString(),
      exportedBy: token ? "Authenticated User" : "Guest",
      version: "1.0"
    };

    // Download als JSON-Datei
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terms_export_${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return exportData; // exportierte AGB mit Metadaten
  } catch (err) {
    throw new Error("Fehler beim Exportieren der AGB");
  }
}

// ✅ Terms Import
export async function importTermsDataFromFileService(token: string, file: File): Promise<Terms> {
  try {
    const text = await file.text();
    const importedData = JSON.parse(text);

    if (!importedData || !importedData.sections || !Array.isArray(importedData.sections) || importedData.sections.length === 0) {
      throw new Error("Importierte AGB sind leer oder ungültig");
    }
    // Optional: Validierung der importierten Daten
    if (!importedData.title) {
      importedData.title = "Importierte AGB";
    }

    // Sections mit neuen IDs versehen (Konflikt-Vermeidung)
    const processesData = {
      ...importedData,
      sections: importedData.sections.map((section: any, index: number) => ({
        ...section,
        id: `ìmported-section-${Date.now()}-${index}`,
        importedAt: new Date().toISOString()
      })),
      importedAt: new Date().toISOString()
    };
    // Importierte AGB speichern (überschreiben)
    return await updateTermsService(token, importedData);
  } catch (error) {
    if(error instanceof SyntaxError) {
      throw new Error("Ungültiges JSON-Format in der Importdatei");
    }
    throw new Error(error instanceof Error ? error.message : "Fehler beim Importieren der AGBs")
  }
}

// Terms Validation
export function validateTermsDataService(terms: Partial<Terms>): { valid: boolean, errors: string[] } {
  const errors: string[] =[];

  if(!terms.title?.trim()) {
    errors.push("Titel ist erforderlich");
  }

  if(!Array.isArray(terms.sections)) {
    errors.push("Sections müssen ein Array sein");
  } else {
    terms.sections.foreach((section, index) => {
      if(!section.heading?.trim())  {
        errors.push(`Section ${index +1}: Überschrift ist erforderlich`)
      }
      if(!section.text?.trim())  {
        errors.push(`Section ${index +1}: Text ist erforderlich`)
      }
      if(!section.id){
        errors.push(`Section ${index +1}: ID ist erforderlich`)
      }
    });
  }

  return { valid: errors.length === 0, errors }

}

// Terms Search
export function searchTermsSectionsService(terms: Terms, query: string): TermsSection[] {
  if(!query.trim()) return terms.sections;

  const lowerQuery = query.toLowerCase();
  return terms.sections.filter(section => 
    section.heading.toLowerCase().includes(lowerQuery) ||
    section.text.toLowerCase().includes(lowerQuery)
  );
}

// Terms Statistics
export function getTermsStatisticsService(terms: Terms | null): TermsStatistics {
  const sections = terms?.sections || [];
  const totalSections = sections.length;
  const totalWords = sections.reduce((sum, sec) => sum + (sec.text ? sec.text.split(/\s+/).length : 0), 0);
  const totalCharacters = sections.reduce((sum, sec) => sum + (sec.text ? sec.text.length : 0), 0);
  const averageWordsPerSection = totalSections > 0 ? Math.round(totalWords / totalSections) : 0;
  const lastUpdated = terms?.updatedAt || null;
  const isEmpty = totalSections === 0;

  return {
    totalSections,
    totalWords,
    totalCharacters,
    averageWordsPerSection,
    lastUpdated,
    isEmpty
  };
}

  
