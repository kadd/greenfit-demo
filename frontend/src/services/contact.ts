const API_URL = "http://localhost:5001/api/contact";
 

export async function sendContactForm(data: { name: string; email: string; message: string }) {
  try {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return await res.json(); // { msg: "Gesendet!" }
  } catch (err) {
    throw new Error("Fehler beim Senden des Kontaktformulars");
  }
}