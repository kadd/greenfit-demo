import { useState, useEffect } from "react";

import { Terms, TermsSection } from "@/types/terms";

import { fetchTerms, createTerms, updateTerms,
  deleteTerms, createTermsSection, fetchTermsSectionById, deleteTermsSectionById,
 } from "@/services/terms";


export function useTerms() {
  const [terms, setTerms] = useState<Terms | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTermsFnc() {
      setLoading(true);
      setError(null);
      try {
        // Beispiel: Hole AGB von einer API
        const data = await fetchTerms();
        setTerms(data);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchTermsFnc();
  }, []);

  const createNewTerms = async (token: string, termsData: Terms) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createTerms(token, termsData);
      setTerms([...terms, data]); // Füge die neue AGB zur Liste hinzu
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  const updateExistingTerms = async (token: string, termsData: Partial<Terms>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateTerms(token, termsData);
      setTerms(data); // Aktualisiere die entsprechende AGB in der Liste
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingTerms = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTerms(token);
      setTerms(null); // Entferne die AGB aus der Liste
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const createNewTermsSection = async (token: string, sectionData: TermsSection) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createTermsSection(token, sectionData);
      setTerms(terms.map(t => t.sections ? { 
        ...t, 
        sections: [...t.sections, data] 
      } : t)); // Füge die neue Sektion zur Liste hinzu
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  const updateExistingTermsSectionById = async (token: string, sectionId: string, sectionData: Partial<TermsSection>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateTermsSectionById(token, sectionId, sectionData);
      setTerms(terms.map(t => t.sections ? { 
        ...t, 
        sections: t.sections.map(s => s.id === sectionId ? data : s) 
      } : t)); // Aktualisiere die entsprechende Sektion in der Liste
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingTermsSectionById = async (token: string, sectionId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTermsSectionById(token, sectionId);
      setTerms(terms.map(t => t.sections ? { 
        ...t, 
        sections: t.sections.filter(s => s.id !== sectionId) 
      } : t)); // Entferne die Sektion aus der Liste
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleTermsSectionById = async (sectionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTermsSectionById(sectionId);
      setTerms(terms.map(t => t.sections ? { 
        ...t, 
        sections: t.sections.filter(s => s.id !== sectionId) 
      } : t)); // Entferne die Sektion aus der Liste
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  return { terms, setTerms, loading, error, createNewTerms, updateExistingTerms, 
    deleteExistingTerms, createNewTermsSection, updateExistingTermsSectionById, 
    deleteExistingTermsSectionById, fetchSingleTermsSectionById };
}