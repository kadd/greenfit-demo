import { useState, useEffect } from "react";

import { FAQ } from "@/types/faq";
import { FAQItem } from "@/types/faq";

import { fetchFAQs } from "@/services/faq";


export function useFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFaqs() {
      setLoading(true);
      setError(null);
      try {
        // Beispiel: Hole FAQs von einer API
        const data = await fetchFAQs();
        setFaqs(data);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchFaqs();
  }, []);

  return { faqs, loading, error };
}