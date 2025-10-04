import { useState, useEffect } from "react";

import { Privacy, PrivacySection } from "@/types/privacy";

import { fetchPrivacy, createPrivacy, updatePrivacy,
  deletePrivacy,  createPrivacySection, fetchPrivacySectionById, deletePrivacySectionById, updatePrivacySectionById
 } from "@/services/privacy";


export function usePrivacy() {
  const [privacy, setPrivacy] = useState<Privacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrivacyFnc() {
      setLoading(true);
      setError(null);
      try {
        // Beispiel: Hole Datenschutzbestimmungen von einer API
        const data = await fetchPrivacy();
        setPrivacy(data);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchPrivacyFnc();
  }, []);

  const createNewPrivacy = async (token: string) => {
    try {
      const newPrivacy = await createPrivacy(token);
      setPrivacy(newPrivacy);
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    }
  };

  const updateExistingPrivacy = async (token: string, privacyData: Partial<Privacy>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updatePrivacy(token, privacyData);
      setPrivacy(data); // Aktualisiere die entsprechende Datenschutzbestimmung
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }
  const deleteExistingPrivacy = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      await deletePrivacy(token);
      setPrivacy(null); // Entferne die gelöschte Datenschutzbestimmung aus dem State
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  // create new privacy section
  const createNewPrivacySection = (token: string, sectionData: PrivacySection) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = createPrivacySection(privacy, sectionData.heading, sectionData.text);
      setPrivacy(privacy && privacy.sections
        ? { ...privacy, sections: [...privacy.sections, data] }
        : privacy
      ); // Füge die neue Sektion zur Liste hinzu
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    } 
  };

  const updateExistingPrivacySectionById = async (token: string, sectionId: string, sectionData: Partial<PrivacySection>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updatePrivacySectionById(token, sectionId, sectionData);
      setPrivacy(privacy.map(p => p.sections ? { 
        ...p, 
        sections: p.sections.map(s => s.id === sectionId ? data : s) 
      } : p)); // Aktualisiere die entsprechende Sektion in der Liste
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingPrivacySectionById = async (token: string, sectionId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deletePrivacySectionById(token, sectionId);
      setPrivacy(privacy.map(p => p.sections ? { 
        ...p, 
        sections: p.sections.filter(s => s.id !== sectionId) 
      } : p)); // Entferne die Sektion aus der Liste
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const fetchSinglePrivacySectionById = async (sectionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPrivacySectionById(sectionId);
      setPrivacy(privacy.map(p => p.sections ? { 
        ...p, 
        sections: p.sections.filter(s => s.id !== sectionId) 
      } : p)); // Entferne die Sektion aus der Liste
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  // fetch single privacy section by ID
  return { privacy, setPrivacy, loading, error, createNewPrivacy, updateExistingPrivacy, 
    deleteExistingPrivacy, createNewPrivacySection, updateExistingPrivacySectionById,
    deleteExistingPrivacySectionById, fetchSinglePrivacySectionById
  };
}