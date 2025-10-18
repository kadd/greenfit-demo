import { useState, useEffect } from "react";

import { Terms, TermsSection, TermsStatistics, BulkOperationResult } from "@/types/terms";

import { 
  fetchTermsService, 
  createTermsService, 
  updateTermsService,
  deleteTermsService, 
  createTermsSectionService, 
  fetchTermsSectionByIdService, 
  deleteTermsSectionByIdService,
  updateTermsSectionByIdService,
  reorderTermsSectionsService,
  resetTermsToDefaultService,
  bulkDeleteTermsSectionsService,
  bulkUpdateTermsSectionsService,
  exportTermsDataService,
  importTermsDataFromFileService,
  validateTermsDataService,
  searchTermsSectionsService,
  getTermsStatisticsService
 } from "@/services/terms";


export function useTerms() {
  const token = localStorage.getItem("token");

  const [terms, setTerms] = useState<Terms | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // ==================== FETCH INITIAL TERMS ====================
  useEffect(() => {
    fetchTerms();
  }, []);

  // ==================== CRUD OPERATIONS ====================
  // fetch Terms
  const fetchTerms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTermsService();
      setTerms(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Fehler beim Laden der AGB");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new Terms

  const createNewTerms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await createTermsService(token);
      setTerms(data); 
      return data;
    } catch (err: any) {
      setError(err.message || "Fehler beim Erstellen der AGB");
      return null;
    } finally {
      setLoading(false);
    }
  }

  const updateExistingTerms = async (termsData: Partial<Terms>) => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    setSaving(true);
    setError(null);
    try {
      const newTerms = await updateTermsService(token, termsData);
      setTerms(newTerms); // Aktualisiere die entsprechende AGB in der Liste
      setLastSaved(new Date());
      return newTerms;
    } catch (err: any) {
      setError(err.message || "Fehler beim Aktualisieren der AGB");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const deleteExistingTerms = async () => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return;
    }

    setLoading(true);
    setSaving(true);
    setError(null);
    try {
      await deleteTermsService(token);
      setTerms(null); // Entferne die AGB aus der Liste
      setLastSaved(new Date());
    } catch (err: any) {
      setError(err.message || "Fehler beim Löschen der AGB");
      return null;
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  // ========================== TERMS SECTION OPERATIONS =========================

  const createNewTermsSection = async (heading: string, text: string) => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    setSaving(true);
    setError(null);

    try {
      const newSection = await createTermsSectionService(token, { heading, text });

      if (terms) {
        setTerms({ ...terms, sections: [...terms.sections, newSection] });
      }

      setLastSaved(new Date());
      return newSection;
    } catch (err: any) {
      setError(err.message || "Fehler beim Erstellen der AGB-Sektion");
      return null;
    } finally {
      setSaving(false);
    }
  }

  const updateExistingTermsSectionById = async (sectionId: string, sectionData: Partial<TermsSection>) => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }
    setSaving(true);
    setLoading(true);
    setError(null);
    try {
      const updatedSection = await updateTermsSectionByIdService(token, sectionId, sectionData);
      if (terms) {
        const updatedSections = terms.sections.map(sec => 
          sec.id === sectionId ? updatedSection : sec
        );
        setTerms({ ...terms, sections: updatedSections });
      }
      setLastSaved(new Date());
      return updatedSection;
    } catch (err: any) {
      setError(err.message || "Fehler bei Erstellen der AGB-Sektion");
      await fetchTerms(); // Lade die AGB neu, um Inkonsistenzen zu vermeiden
      return null;
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const deleteExistingTermsSectionById = async (sectionId: string) => {
    setSaving(true);
    setLoading(true);
    setError(null);
    try {
      await deleteTermsSectionByIdService(token, sectionId);
      if (terms) {
          setTerms({ ...terms, sections: terms.sections.filter(sec => sec.id !== sectionId) });
        }
      setLastSaved(new Date());
    } catch (err: any) {
      setError(err.message || "Fehler beim Löschen der AGB-Sektion");
      await fetchTerms(); // Lade die AGB neu, um Inkonsistenzen zu vermeiden
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const fetchSingleTermsSectionById = async (sectionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const section = await fetchTermsSectionByIdService(sectionId);
      return section;
    } catch (err: any) {
      setError(err.message || "Fehler beim Laden der AGB-Sektion");
      return null;
    } finally {
      setLoading(false);
    } 
  };

  // ========================== REORDER OPERATION =========================
  const reorderTermsSections = async (newOrderIds: string[]) => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return;
    }

    const reorderedSections = newOrderIds
      .map(id => terms?.sections.find(section => section.id === id))
      .filter(Boolean) as TermsSection[];

    const optimisticTerms = terms ? { ...terms, sections: reorderedSections } : null;
    setTerms(optimisticTerms); // Optimistisches Update

    setSaving(true);
    setError(null);
    
    try {
      const updatedTerms = await reorderTermsSectionsService(token, newOrderIds);
      setTerms(updatedTerms);
      setLastSaved(new Date());
      return updatedTerms;
    } catch (err: any) {
      setError(err.message || "Fehler beim Neuordnen der AGB-Sektionen");
      await fetchTerms(); // Lade die AGB neu, um Inkonsistenzen zu vermeiden
    } finally {
      setSaving(false);
    }
  };

  // ==================== ADDITIONAL OPERATIONS ====================
  const resetTermsToDefault = async () => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return;
    }

    setLoading(true);
    setSaving(true);
    setError(null);
    try {
      const defaultTerms = await resetTermsToDefaultService(token);
      setTerms(defaultTerms);
      setLastSaved(new Date());
      return defaultTerms;
    } catch (err: any) {
      setError(err.message || "Fehler beim Zurücksetzen der AGB");
    } finally {
      setLoading(false);
      setSaving(false);
    }
  }

  // ==================== BULK OPERATIONS ====================
  const bulkDeleteSections = async (sectionIds: string[]): Promise<BulkOperationResult | null> => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    setSaving(true);
    setLoading(true);
    setError(null);
    try {
      const result = await bulkDeleteTermsSectionsService(token, sectionIds);
      // Entferne die gelöschten Sektionen aus dem lokalen State
      if (terms) {
        setTerms({ ...terms, sections: terms.sections.filter(sec => !sectionIds.includes(sec.id)) });
      }
      setLastSaved(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || "Fehler beim Löschen der AGB-Sektionen");
      return null;
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const bulkUpdateSections = async (updates: Array<{ id: string; data: Partial<TermsSection> }>): Promise<BulkOperationResult | null> => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    setSaving(true);
    setLoading(true);
    setError(null);
    try {
      const result = await bulkUpdateTermsSectionsService(token, updates);
      // Aktualisiere die geänderten Sektionen im lokalen State
      if (terms) {
        const updatedSections = terms.sections.map(sec => {
          const update = updates.find(u => u.id === sec.id);
          return update ? { ...sec, ...update } : sec;
        });
        setTerms({ ...terms, sections: updatedSections });
      }
      setLastSaved(new Date());
      return result;
    } catch (err: any) {
      setError(err.message || "Fehler beim Aktualisieren der AGB-Sektionen");
      return null;
    } finally {
      setLoading(false);
      setSaving(false);
    }   
  };

  // ==================== IMPORT/EXPORT OPERATIONS ====================
  const exportTerms = async (): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const fileUrl = await exportTermsDataService(token || "");
      return fileUrl;
    } catch (err: any) {
      setError(err.message || "Fehler beim Exportieren der AGB-Daten");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const importTerms = async (file: File): Promise<Terms | null> => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    setSaving(true);
    setLoading(true);
    setError(null);
    try {
      const importedTerms = await importTermsDataFromFileService(token, file);
      setTerms(importedTerms);
      setLastSaved(new Date());
      return importedTerms;
    } catch (err: any) {
      setError(err.message || "Fehler beim Importieren der AGB-Daten");
      return null;
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const validateTerms = () => {
    if(!terms) {
      return {valid: false, errors: ["Keine AGB-Daten zum Validieren vorhanden"]};
    }
    return validateTermsDataService(terms);
  };

  // ==================== STATISTICS ====================
  const getStatistics = (): TermsStatistics | null => {
    if (!terms) {
      return null;
    }
    return getTermsStatisticsService(terms);
  };

  // ==================== SEARCH ====================
  const searchSections = async (query: string): Promise<TermsSection[] | null> => {
    if (!terms) {
      return [];
    }
    return searchTermsSectionsService(terms, query);
  };

  const clearError = () => setError(null);

  // ==================== RETURN HOOK STATE & FUNCTIONS ====================

  return { 
    // State
    terms,
    loading,
    saving,
    error,
    lastSaved,
    // CRUD Terms
    fetchTerms,
    createTerms: createNewTerms,
    updateTerms: updateExistingTerms,
    deleteTerms: deleteExistingTerms,

    // Section Operations
    createSection: createNewTermsSection,
    updateSection: updateExistingTermsSectionById,
    deleteSection: deleteExistingTermsSectionById,
    fetchSection: fetchSingleTermsSectionById,

    // Reorder
    reorderSections: reorderTermsSections,

       // Bulk Operations
    bulkDeleteSections,
    bulkUpdateSections,

    // Utility
    resetTerms: resetTermsToDefault,
    getStatistics,
    exportTerms,
    importTerms,
    validateTerms,
    searchSections,

    // Management
    refetch: fetchTerms,
    clearError,

    // manual setTerms for external updates
    setTerms
  };
}