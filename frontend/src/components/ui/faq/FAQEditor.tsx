import React from "react";

import { FAQ, FAQItem } from "@/types/faq";

import { useFAQ } from "@/hooks/useFAQ";
import { useAuth } from "@/hooks/useAuth";



interface FAQEditorProps {
  faq: FAQ;
  setFaq: (faq: FAQ) => void;
  loading: boolean;
  error: string | null;
  createNewFAQItem: (token: string, itemData: FAQItem) => Promise<FAQItem | undefined>;
  updateExistingFAQ: (token: string, faqData: Partial<FAQ>) => Promise<FAQ | undefined>;
  updateExistingFAQItem: (token: string, itemId: string, itemData: Partial<FAQItem>) => Promise<FAQItem | undefined>;
  deleteExistingFAQItem: (token: string, itemId: string) => Promise<void>;
}

export default function FAQEditor({ 
  faq, 
  setFaq, 
  loading, 
  error, 
  createNewFAQItem, 
  updateExistingFAQ, 
  updateExistingFAQItem, 
  deleteExistingFAQItem }: FAQEditorProps) {

  const { isAuthenticated } = useAuth();
  const [msg, setMsg] = React.useState<string | null>(null);

  if (!faq.items) {
    setFaq({ ...faq, items: [] });
  }

  React.useEffect(() => {
    if (faq && faq.items && faq.items.length > 0) {
      setFaq(faq);
    }
  }, [faq, setFaq]);

  if (!isAuthenticated) {
    return <p>Sie müssen angemeldet sein, um die FAQ zu bearbeiten.</p>;
  }

  // Item bearbeiten
  const handleChange = (idx: number, field: keyof FAQItem, value: string) => {
    const updated = faq.items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setFaq({ ...faq, items: updated });
  }

  const handleAdd = () => {
    setFaq({ ...faq, items: [...faq.items, { question: "", answer: "" }] });
  };

  const handleDelete = (idx) => {
    setFaq({ ...faq, items: faq.items.filter((_, i) => i !== idx) });
  };

  const handleSaveFAQ = async () => {
    

    if(!isAuthenticated) {
      setMsg("Sie müssen angemeldet sein, um Änderungen zu speichern.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMsg("Kein Auth-Token gefunden! Bitte einloggen.");
        return;
      }

      if (!faq.id) {
        setMsg("Keine FAQ-ID vorhanden. Bitte neu laden.");
        return;
      }

      // FAQ speichern
      const updatedFAQ = await updateExistingFAQ(token, { id: faq.id, title: faq.title, items: faq.items, updatedAt: new Date(), isPage: faq.isPage } as Partial<FAQ>);
      if (updatedFAQ) {
        setFaq(updatedFAQ);
      }
      setMsg("✅ FAQ gespeichert!");
    } catch (error) {
      console.error("Fehler beim Speichern der FAQ:", error);
      setMsg("❌ Fehler beim Speichern der FAQ.");
    }
  }

  if (loading) {
    return <p>FAQ wird geladen...</p>;
  }
  if (error) {
    return <p>Fehler beim Laden der FAQ: {error}</p>;
  }

  if (!faq || (faq.items && faq.items.length === 0)) {
    return <p>Keine FAQ-Daten verfügbar.</p>;
  }

  return (
    <div>
      <input
        type="text"
        value={faq.title}
        onChange={e => setFaq({ ...faq, title: e.target.value })}
        placeholder="FAQ Titel"
        className="mb-2 w-full border rounded p-2"
      />
      {faq.items && faq.items.map((item, idx) => (
        <div key={idx} className="mb-4 border p-2 rounded">
          <input
            type="text"
            value={item.question}
            onChange={e => handleChange(idx, "question", e.target.value)}
            placeholder="Frage"
            className="mb-1 w-full border rounded p-2"
          />
          <textarea
            value={item.answer}
            onChange={e => handleChange(idx, "answer", e.target.value)}
            placeholder="Antwort"
            className="w-full border rounded p-2"
            rows={2}
          />
          <button
            type="button"
            onClick={() => handleDelete(idx)}
            className="mt-2 px-2 py-1 bg-red-600 text-white rounded"
          >
            Löschen
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Neue Frage hinzufügen
      </button>
      <button
        type="button"
        onClick={handleSaveFAQ}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        FAQ speichern
      </button>
    </div>
  );
}