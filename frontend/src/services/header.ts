const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return `${base}/header`;
  }
  return "http://localhost:5001/api/header";
};

const API_URL = getApiUrl();
import { HeaderData } from "../types/header";

export const fetchHeaderDataService = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
      throw new Error("Fehler beim Laden der Header-Daten");
    }
    const data = await response.json();
    return data.header;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const updateHeaderDataService = async (newHeader: HeaderData) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHeader),
    });
    if (!response.ok) {
      throw new Error("Fehler beim Aktualisieren der Header-Daten");
    }
    const data = await response.json();
    return data.header;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteHeaderDataSerice = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Fehler beim Löschen der Header-Daten");
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Funktion zum Zurücksetzen der Header-Daten auf Standardwerte
export const resetHeaderDataService = async () => {
  try {
    const response = await fetch(`${API_URL}/reset`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Fehler beim Zurücksetzen der Header-Daten");
    }
    const data = await response.json();
    return data.header;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export function setGalleryInactiveIfEmptyService() {
  return fetch(`${API_URL}/gallery/check`, {
    method: "POST",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Fehler beim Überprüfen der Galerie");
      }
      return response.json();
    })
    .then((data) => data);
}

// frontend/src/services/header.ts - Erweiterte Debug-Version:
// frontend/src/services/header.ts
export function uploadHeaderImageService(file: File): Promise<{ url: string }> {
  console.log("=== SERVICE DEBUG ===");
  console.log("Input type:", typeof file);
  console.log("Input constructor:", file.constructor.name);
  console.log("Is File?", file instanceof File);
  console.log("File details:", file);
  
  if (!(file instanceof File)) {
    console.error("ERROR: Not a File object!");
    throw new Error("Input is not a File object");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append('folder', 'header');
  
  console.log("FormData created successfully");
  
  // Debug FormData
  for (let [key, value] of formData.entries()) {
    console.log(`FormData[${key}]:`, typeof value, value);
  }
  
  console.log("Making request to:", `${API_URL}/upload`);
  console.log("====================");

  return fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  }).then(async response => {
    console.log("Response status:", response.status);
    const responseText = await response.text();
    console.log("Response text:", responseText);
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} - ${responseText}`);
    }
    
    return JSON.parse(responseText);
  });
}