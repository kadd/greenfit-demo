import { useState } from "react";

import { sendContactForm as sendContactFormService} from "../services/contact";

const API_URL = "http://localhost:5001/api/contact";

export function useContact() {
  const [contactSentStatus, setContactSentStatus] = useState<string>("");

  async function sendContact(data: { name: string; email: string; message: string }) {
    try {
      const result = await sendContactFormService(data);
      setContactSentStatus(result.msg || "Gesendet!");
    } catch (err) {
      setContactSentStatus("Fehler beim Senden 😢");
    }
  }

  return { contactSentStatus, sendContact };
}