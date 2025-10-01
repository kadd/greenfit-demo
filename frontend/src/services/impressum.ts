const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

import { Impressum } from "@/types/impressum";

export async function fetchImpressum(): Promise<Impressum> {
  const response = await fetch(`${API_URL}/impressum`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden des Impressums");
  }
  return response.json();
}