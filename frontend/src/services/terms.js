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