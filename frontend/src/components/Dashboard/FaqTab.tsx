import React from "react";
import FAQEditor from "../ui/faq/FAQEditor";

import { FAQ } from "@/types/faq";
import { FAQItem } from "@/types/faq";

import { useFAQ } from "@/hooks/useFAQ";

interface FaqTabProps {
  msg: string | null;
  router: any;
  // faq: FAQ; --- IGNORE ---
  // setFaq: (faq: FAQ) => void; --- IGNORE ---
  // handleSave: () => Promise<void>; --- IGNORE ---
}

export default function FaqTab({  router }) {
      const {faq, setFaq, 
        loading, error,
        updateExistingFAQ,
        createNewFAQItem, 
        updateExistingFAQItemById, 
        deleteExistingFAQItemById,
     } = useFAQ();
 
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (faq && faq.items && faq.items.length > 0) {
      setFaq(faq);
    }
  }, [faq]);

  if(loading) {
    return <p>FAQ wird geladen...</p>;
  }
  if(error) {
    return <p>Fehler beim Laden der FAQ: {error}</p>;
  }

  if (!faq || (faq.items && faq.items.length === 0)) {
    return <p>Keine FAQ-Daten verfügbar.</p>;
  }


  return (
    <div>
      <button
        type="button"
        onClick={() => router.back()}
        className="self-start mb-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-300 transition text-white hover:text-gray-800"
      >
        ← Zurück
      </button>
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Admin FAQ
      </h1>
      <FAQEditor 
        faq={faq} 
        setFaq={setFaq}
        loading={loading}
        error={error}
        updateExistingFAQ={updateExistingFAQ}
        createNewFAQItem={createNewFAQItem}
        updateExistingFAQItem={updateExistingFAQItemById}
        deleteExistingFAQItem={deleteExistingFAQItemById}
      />
      
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}