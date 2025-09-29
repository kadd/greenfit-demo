const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/contact'
  : "http://localhost:5001/api/contact";
  
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

export async function getContactFormStatus() {
  const res = await fetch(`${API_URL}/status`);
  return res.json();
}

export async function fetchContacts() {
  const res = await fetch(`${API_URL}/contacts`);
  return res.json();
}

export async function fetchContactsGroupedByEmail() {
  const res = await fetch(`${API_URL}/contacts/groupedByEmail`);
  return res.json();
}

export async function deleteContact(date: string) {
  const res = await fetch(`${API_URL}/contacts`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date }),
  });
  return res.json();
}