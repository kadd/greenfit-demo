const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/faqs'
  : "http://localhost:5001/api/faqs";
  
export async function fetchFAQs() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Fehler beim Laden der FAQs");
    return await res.json(); // FAQ[]
  } catch (err) {
    throw new Error("Fehler beim Laden der FAQs");
  }
}   