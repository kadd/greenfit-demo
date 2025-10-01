const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchPrivacy() {
  const response = await fetch(`${API_URL}/privacy`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Datenschutzbestimmungen");
  }
  return response.json();
}