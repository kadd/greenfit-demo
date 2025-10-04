import { useState, useEffect } from "react";

import { FAQ, FAQItem } from "@/types/faq";

import { fetchFAQ, createFAQ, updateFAQ,
  deleteFAQ, createFAQItem, fetchFAQItemById, deleteFAQItemById,
  updateFAQItemById
  } from "@/services/faq";


export function useFAQ() {
  const [faq, setFaq] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFaqFnc() {
      setLoading(true);
      setError(null);
      try {
        // Beispiel: Hole FAQs von einer API
        const data = await fetchFAQ();
        setFaq(data);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchFaqFnc();
  }, []);

  const createNewFAQ = async (token: string, faqData: FAQ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createFAQ(token, faqData);
      setFaq([...faq, data]); // Füge die neue FAQ zur Liste hinzu
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  const updateExistingFAQ = async (token: string, faqData: Partial<FAQ>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateFAQ(token, faqData);
      setFaq(data); // Aktualisiere die entsprechende FAQ in der Liste
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  const deleteExistingFAQ = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteFAQ(token);
      setFaq(null); // FAQ gelöscht, leere Liste setzen
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  const createNewFAQItem = async (token: string, itemData: FAQItem) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createFAQItem(token, itemData);
      setFaq(faq.map(f => f.items ? { 
        ...f, 
        items: [...f.items, data] 
      } : f));
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const updateExistingFAQItemById = async (token: string, itemId: string, itemData: Partial<FAQItem>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateFAQItemById(token, itemId, itemData);
      setFaq(faq.map(f => f.items ? { 
        ...f, 
        items: f.items.map(i => i.id === itemId ? data : i) 
      } : f));
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingFAQItemById = async (token: string, itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteFAQItemById(token, itemId);
      setFaq(faq.map(f => f.items ? { 
        ...f, 
        items: f.items.filter(i => i.id !== itemId) 
      } : f));
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSingleFAQItemById = async (itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFAQItemById(itemId);
      setFaq(faq.map(f => f.items ? { 
        ...f, 
        items: f.items.filter(i => i.id !== itemId) 
      } : f));
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };



  return { faq, setFaq, loading, error,
    createNewFAQ, updateExistingFAQ, deleteExistingFAQ,
    createNewFAQItem, updateExistingFAQItemById, deleteExistingFAQItemById, fetchSingleFAQItemById
  };
}