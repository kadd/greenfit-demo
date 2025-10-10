const API_URL = process.env.NEXT_PUBLIC_API_URL+'/header'|| "http://localhost:5000/api/header";

import { HeaderData } from "../types/header";

export const fetchHeaderData = async () => {
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


export const updateHeaderData = async (newHeader: HeaderData) => {
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

export const deleteHeaderData = async () => {
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
export const resetHeaderData = async () => {
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

export function setGalleryInactiveIfEmpty() {
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