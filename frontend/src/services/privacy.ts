/****************************************************************
 * privacy.ts - Service functions for managing privacy policies
 * 
 * This module provides functions to interact with the backend API
 * for creating, reading, updating, and deleting privacy policies
 * and their sections. It also includes advanced features such as
 * bulk operations, import/export, validation, search, and statistics.
 ****************************************************************/
import { Privacy, PrivacySection, PrivacyStatistics } from "../types/privacy";

const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return `${base}/privacy`;
  }
  return "http://localhost:5001/api/privacy";
};

const API_URL = getApiUrl();

export async function fetchPrivacyService() {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
      throw new Error("Fehler beim Laden der Datenschutzbestimmungen");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Laden der Datenschutzbestimmungen");
  }
}

export async function createPrivacyService(token: string) {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: "Neue Datenschutzerklärung", isPage: true, sections: [] }),
    });
    if (!response.ok) {
      throw new Error("Fehler beim Erstellen der Datenschutzbestimmungen");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Erstellen der Datenschutzbestimmungen");
  }
}

export async function updatePrivacyService(token: string, privacyData: Partial<Privacy>) {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(privacyData),
    });
    if (!response.ok) {
      throw new Error("Fehler beim Aktualisieren der Datenschutzbestimmungen");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Aktualisieren der Datenschutzbestimmungen");
  }
}

export async function deletePrivacyService(token: string) {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Fehler beim Löschen der Datenschutzbestimmungen");
    }
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Löschen der Datenschutzbestimmungen");
  }
}

// create new privacy section
// ✅ NEUE VERSION (echte API-Call Funktion):
export async function createPrivacySectionService(token: string, sectionData: { heading: string; text: string }) {
  try {
    const response = await fetch(`${API_URL}/section`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sectionData),
    });
    
    if (!response.ok) {
      throw new Error("Fehler beim Erstellen des Datenschutzabschnitts");
    }
    
    return response.json();
  } catch (error) {
    console.error('Create privacy section error:', error);
    throw new Error("Fehler beim Erstellen des Datenschutzabschnitts");
  }
}

// add new privacy section
// export async function addPrivacySectionService(token: string, newSection: Partial<PrivacySection>) {
//   try {
//     const response = await fetch(`${API_URL}/sections`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(newSection),
//     });
//     if (!response.ok) {
//       throw new Error("Fehler beim Hinzufügen des Datenschutzabschnitts");
//     }
//     return response.json();
//   } catch (error) {
//     console.error(error);
//     throw new Error("Fehler beim Hinzufügen des Datenschutzabschnitts");
//   }
// }

//fetch single privacy section by ID
export async function fetchPrivacySectionByIdService(sectionId: string) {
  try {
    const response = await fetch(`${API_URL}/sections/${sectionId}`);
    if (!response.ok) {
      throw new Error("Fehler beim Laden des Datenschutzabschnitts");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Laden des Datenschutzabschnitts");
  }
}

//delete single privacy section by ID
// frontend/src/services/privacy.ts - Vereinfachter DELETE Request:

export async function deletePrivacySectionByIdService(token: string, sectionId: string) {
  try {
    console.log("=== DELETE DEBUG START ===");
    console.log("URL:", `${API_URL}/sections/${sectionId}`);
    
    // ✅ Vereinfachter Request - weniger Headers
    const response = await fetch(`${API_URL}/sections/${sectionId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        // ✅ Content-Type entfernt (nicht nötig bei DELETE ohne Body)
      },
    });
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response:", errorText);
      throw new Error(`Delete failed: ${response.status} - ${errorText}`);
    }
    
    console.log("=== DELETE SUCCESS ===");
    return true;
    
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

//update single privacy section by ID
export async function updatePrivacySectionByIdService(token: string, sectionId: string, updatedSection: Partial<PrivacySection>) {
  try {
    const response = await fetch(`${API_URL}/sections/${sectionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedSection),
    });
    if (!response.ok) {
      throw new Error("Fehler beim Aktualisieren des Datenschutzabschnitts");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Aktualisieren des Datenschutzabschnitts");
  }
}

// Funktion zum Zurücksetzen der Datenschutzbestimmungen auf Standardwerte
export async function resetPrivacyService(token: string) {
  try {
    const response = await fetch(`${API_URL}/reset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Fehler beim Zurücksetzen der Datenschutzbestimmungen");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Zurücksetzen der Datenschutzbestimmungen");
  }
}

// reorder privacy sections
export async function reorderPrivacySectionsService(token: string, sectionIds: string[]) {
  try {
    const response = await fetch(`${API_URL}/sections/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sectionIds }), // ✅ Korrekt: Backend erwartet "sectionIds"
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Fehler beim Neuordnen der Datenschutzabschnitte");
    }
    
    return response.json();
  } catch (error) {
    console.error('Reorder privacy sections error:', error);
    throw new Error(error instanceof Error ? error.message : "Fehler beim Neuordnen der Datenschutzabschnitte");
  }
}

// frontend/src/services/privacy.ts - Zusätzliche Enterprise-Features:

// ✅ Bulk Operations
export async function bulkDeletePrivacySectionsService(token: string, sectionIds: string[]) {
  try {

    const res = await fetch(`${API_URL}/sections/bulk-delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sectionIds }),
    });
    if (!res.ok) throw new Error("Fehler beim Löschen der Datenschutzabschnitte");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Löschen der Datenschutzabschnitte");
  }
}

// ✅ Bulk Update
export async function bulkUpdatePrivacySectionsService(
  token: string, 
  updates: Array<{ id: string; data: Partial<PrivacySection> }>
) {
  try {
    const res = await fetch(`${API_URL}/sections/bulk-update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ updates }),
    });
    if (!res.ok) throw new Error("Fehler beim Aktualisieren der Datenschutzabschnitte");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Aktualisieren der Datenschutzabschnitte");
  }
}

// ✅ Privacy Export
export async function exportPrivacyDataService(token: string) {
  try {
    const res = await fetch(`${API_URL}/export`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Fehler beim Exportieren der Datenschutzbestimmungen");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Exportieren der Datenschutzbestimmungen");
  } 
}

// ✅ Privacy Import aus Datei
// Format: JSON
export async function importPrivacyDataFromFileService(token: string, file: File): Promise<Privacy> {
  try {
    const text = await file.text();
    const importedData = JSON.parse(text);

    // Validierung der importierten Daten
    if (!importedData ||  !Array.isArray(importedData.sections)) {
      throw new Error("Ungültiges Datenschutz-Dateiformat");
    }

    if(!importedData.title)
      importedData.title = "Importierte Datenschutzerklärung";
    
    // Sections mit neuen IDs versehen (Konflikt-Vermeidung)
    const processedData = {
      ...importedData,
      sections: importedData.sections.map((section: any, index: number) => ({
        ...section,
        id: `imported-section-${Date.now()}-${index}`,
        importedAt: new Date().toISOString()
      })),
      importedAt: new Date().toISOString()
    };
    
    return await updatePrivacyService(token, processedData);
  } catch (error) {
    console.error('Privacy import error:', error);
    if (error instanceof SyntaxError) {
      throw new Error("Ungültiges JSON-Format in der Importdatei");
    }
    throw new Error(error instanceof Error ? error.message : "Fehler beim Importieren der Datenschutzbestimmungen");
  }
}

// ✅ Privacy Validation
export function validatePrivacyDataService(privacy: Partial<Privacy>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!privacy.title?.trim()) {
    errors.push("Titel ist erforderlich");
  }

  if (!Array.isArray(privacy.sections)) {
    errors.push("Sections müssen ein Array sein");
  } else {
    privacy.sections.forEach((section, index) => {
      if (!section.heading?.trim()) {
        errors.push(`Section ${index + 1}: Überschrift ist erforderlich`);
      }
      if (!section.text?.trim()) {
        errors.push(`Section ${index + 1}: Text ist erforderlich`);
      }
      if (!section.id) {
        errors.push(`Section ${index + 1}: ID ist erforderlich`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// ✅ Privacy Search
export function searchPrivacySectionsService(privacy: Privacy, searchTerm: string): PrivacySection[] {
  if (!searchTerm.trim()) {
    return privacy.sections;
  }
  
  const term = searchTerm.toLowerCase();
  
  return privacy.sections.filter(section => 
    section.heading.toLowerCase().includes(term) ||
    section.text.toLowerCase().includes(term)
  );
}

// ✅ Privacy Statistics
export function getPrivacyStatisticsService(privacy: Privacy) : Promise<PrivacyStatistics> {
  const sections = privacy?.sections || [];
  
  return Promise.resolve({
    totalSections: sections.length,
    totalWords: sections.reduce((acc, section) => 
      acc + section.heading.split(' ').length + section.text.split(' ').length, 0
    ),
    totalCharacters: sections.reduce((acc, section) => 
      acc + section.heading.length + section.text.length, 0
    ),
    averageWordsPerSection: sections.length > 0 
      ? Math.round(sections.reduce((acc, section) => 
          acc + section.heading.split(' ').length + section.text.split(' ').length, 0
        ) / sections.length)
      : 0,
    lastUpdated: privacy.updatedAt || null,
    isEmpty: sections.length === 0
  });
}