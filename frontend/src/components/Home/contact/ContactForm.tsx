import React, { useState }  from "react";

import FormSection from "../Sections/FormSection";

import { useContactRequests } from "@/hooks/useContactRequests";

export default function ContactForm({info_message}: {info_message?: string}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { contactRequestSentStatus, sendContactRequest, loading } = useContactRequests();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendContactRequest({ name, email, message });
    setName("");
    setEmail("");
    setMessage("");
    };
  return (
    <>
        <FormSection title="Kontaktformular" message={info_message} onSubmit={handleSubmit}>
        <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ihr Name"
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ihre E-Mail"
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ihre Nachricht"
            required
            className="border border-gray-300 rounded px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
            <button 
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition disabled:opacity-50"
          >
            Senden
          </button>
         
        </FormSection>  

        {contactRequestSentStatus && (
          <p className="text-center text-green-700 mt-4">
            {contactRequestSentStatus === "Gesendet!"
              ? "✅ Ihre Nachricht wurde gesendet!"
              : "❌ Fehler beim Senden. Bitte versuchen Sie es später erneut."}
          </p>
        )}
        {message && (
          <p className="text-center text-red-600 mt-4">{message}</p>
        )}
        {loading && (
          <p className="text-center text-gray-600 mt-4">Senden...</p>
        )}
        </>
  );
}

