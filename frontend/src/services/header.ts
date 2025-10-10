const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

import { HeaderData } from "../types/header";

export const fetchHeaderData = async () => {
  try {
    const response = await fetch(`${API_URL}/header`);
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
    const response = await fetch(`${API_URL}/header`, {
      method: "POST",
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
