// frontend/src/hooks/usePrivacy.tsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Privacy, 
  PrivacySection, 
  PrivacyStatistics, 
  BulkOperationResult } from "@/types/privacy";

import { 
  fetchPrivacyService, 
  createPrivacyService,      // ✅ Umbenannt
  updatePrivacyService,      // ✅ Umbenannt  
  deletePrivacyService,      // ✅ Umbenannt
  createPrivacySectionService, 
  fetchPrivacySectionByIdService, 
  deletePrivacySectionByIdService, 
  updatePrivacySectionByIdService, 
  reorderPrivacySectionsService,
  resetPrivacyService,
  bulkDeletePrivacySectionsService,
  bulkUpdatePrivacySectionsService,
  exportPrivacyDataService,
  importPrivacyDataService,
  validatePrivacyDataService,
  searchPrivacySectionsService,
  getPrivacyStatisticsService
} from "@/services/privacy";

export function usePrivacy() {
  const { token } = useAuth();
  
  // States
  const [privacy, setPrivacy] = useState<Privacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  console.log("usePrivacy initialized with token:", token);

  // ==================== FETCH INITIAL DATA ====================
  const fetchPrivacyData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPrivacyService();
      setPrivacy(data);
    } catch (err: any) {
      console.error('Fetch privacy error:', err);
      setError(err.message || "Fehler beim Laden der Datenschutzbestimmungen");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrivacyData();
  }, [fetchPrivacyData]);

  // ==================== PRIVACY OPERATIONS ====================
  const createNewPrivacy = async (privacyData?: Partial<Privacy>) => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    setSaving(true);
    setError(null);
    try {
      const newPrivacy = await createPrivacyService(token, privacyData);
      setPrivacy(newPrivacy);
      setLastSaved(new Date());
      return newPrivacy;
    } catch (err: any) {
      console.error('Create privacy error:', err);
      setError(err.message || "Fehler beim Erstellen der Datenschutzbestimmungen");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateExistingPrivacy = async (privacyData: Partial<Privacy>) => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    setSaving(true);
    setError(null);
    try {
      const updatedPrivacy = await updatePrivacyService(token, privacyData);
      setPrivacy(updatedPrivacy);
      setLastSaved(new Date());
      return updatedPrivacy;
    } catch (err: any) {
      console.error('Update privacy error:', err);
      setError(err.message || "Fehler beim Aktualisieren der Datenschutzbestimmungen");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const deleteExistingPrivacy = async () => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return false;
    }

    setSaving(true);
    setError(null);
    try {
      await deletePrivacyService(token);
      setPrivacy(null);
      setLastSaved(new Date());
      return true;
    } catch (err: any) {
      console.error('Delete privacy error:', err);
      setError(err.message || "Fehler beim Löschen der Datenschutzbestimmungen");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ==================== SECTION OPERATIONS ====================
const createNewPrivacySection = async (heading: string, text: string) => {
  if (!token) {
    setError("Authentifizierung erforderlich");
    return null;
  }

  setSaving(true);
  setError(null);
  try {
    const newSection = await createPrivacySectionService(token, { heading, text });
    
    if (privacy) {
      const updatedPrivacy = {
        ...privacy,
        sections: [...privacy.sections, newSection]
      };
      setPrivacy(updatedPrivacy);
    }
    
    setLastSaved(new Date());
    return newSection;
  } catch (err: any) {
    console.error('Create privacy section error:', err);
    setError(err.message || "Fehler beim Erstellen des Datenschutzabschnitts");
    await fetchPrivacyData();
    return null;
  } finally {
    setSaving(false);
  }
};

const updateExistingPrivacySectionById = async (sectionId: string, sectionData: Partial<PrivacySection>) => {
  if (!token) {
    setError("Authentifizierung erforderlich");
    return null;
  }

  setSaving(true);
  setError(null);
  try {
    const updatedSection = await updatePrivacySectionByIdService(token, sectionId, sectionData);
    
    if (privacy) {
      const updatedPrivacy = {
        ...privacy,
        sections: privacy.sections.map(section => 
          section.id === sectionId ? updatedSection : section
        )
      };
      setPrivacy(updatedPrivacy);
    }
    
    setLastSaved(new Date());
    return updatedSection;
  } catch (err: any) {
    console.error('Update privacy section error:', err);
    setError(err.message || "Fehler beim Aktualisieren des Datenschutzabschnitts");
    await fetchPrivacyData();
    return null;
  } finally {
    setSaving(false);
  }
};

const deleteExistingPrivacySectionById = async (sectionId: string) => {
  if (!token) {
    setError("Authentifizierung erforderlich");
    return false;
  }

  setSaving(true);
  setError(null);
  try {
    await deletePrivacySectionByIdService(token, sectionId);
    
    if (privacy) {
      const updatedPrivacy = {
        ...privacy,
        sections: privacy.sections.filter(section => section.id !== sectionId)
      };
      setPrivacy(updatedPrivacy);
    }
    
    setLastSaved(new Date());
    return true;
  } catch (err: any) {
    console.error('Delete privacy section error:', err);
    setError(err.message || "Fehler beim Löschen des Datenschutzabschnitts");
    await fetchPrivacyData();
    return false;
  } finally {
    setSaving(false);
  }
};

const fetchSinglePrivacySectionById = async (sectionId: string) => {
  setError(null);
  try {
    const section = await fetchPrivacySectionByIdService(sectionId);
    return section;
  } catch (err: any) {
    console.error('Fetch privacy section error:', err);
    setError(err.message || "Fehler beim Laden des Datenschutzabschnitts");
    return null;
  }
};

  // ==================== REORDER OPERATIONS ====================
  const reorderPrivacySectionsInState = async (newOrderIds: string[]) => {
    if (!token || !privacy) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    // Optimistische UI Update
    const reorderedSections = newOrderIds
      .map(id => privacy.sections.find(section => section.id === id))
      .filter(Boolean) as PrivacySection[];

    const optimisticPrivacy = {
      ...privacy,
      sections: reorderedSections
    };
    setPrivacy(optimisticPrivacy);

    setSaving(true);
    setError(null);
    try {
      await reorderPrivacySectionsService(token, newOrderIds);
      setLastSaved(new Date());
      return optimisticPrivacy;
    } catch (err: any) {
      console.error('Reorder privacy sections error:', err);
      setError(err.message || "Fehler beim Neuordnen der Datenschutzabschnitte");
      // Bei Fehler: Ursprünglichen State wiederherstellen
      setPrivacy(privacy);
      return null;
    } finally {
      setSaving(false);
    }
  };

  // ==================== BULK OPERATIONS ====================
  const bulkDeleteSections = async (sectionIds: string[]): Promise<BulkOperationResult | null> => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    setSaving(true);
    setError(null);
    try {
      const result = await bulkDeletePrivacySectionsService(token, sectionIds);
      
      // State aktualisieren
      if (privacy) {
        const updatedPrivacy = {
          ...privacy,
          sections: privacy.sections.filter(section => !sectionIds.includes(section.id))
        };
        setPrivacy(updatedPrivacy);
      }
      
      setLastSaved(new Date());
      return result;
    } catch (err: any) {
      console.error('Bulk delete privacy sections error:', err);
      setError(err.message || "Fehler beim Löschen mehrerer Datenschutzabschnitte");
      await fetchPrivacyData(); // Reload bei Fehler
      return null;
    } finally {
      setSaving(false);
    }
  };

  const bulkUpdateSections = async (updates: Array<{ id: string; data: Partial<PrivacySection> }>): Promise<BulkOperationResult | null> => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    setSaving(true);
    setError(null);
    try {
      const result = await bulkUpdatePrivacySectionsService(token, updates);
      
      // State aktualisieren
      if (privacy) {
        const updatedSections = privacy.sections.map(section => {
          const update = updates.find(u => u.id === section.id);
          return update ? { ...section, ...update.data } : section;
        });
        
        const updatedPrivacy = {
          ...privacy,
          sections: updatedSections
        };
        setPrivacy(updatedPrivacy);
      }
      
      setLastSaved(new Date());
      return result;
    } catch (err: any) {
      console.error('Bulk update privacy sections error:', err);
      setError(err.message || "Fehler beim Aktualisieren mehrerer Datenschutzabschnitte");
      await fetchPrivacyData(); // Reload bei Fehler
      return null;
    } finally {
      setSaving(false);
    }
  };

  // ==================== UTILITY OPERATIONS ====================
  const exportPrivacy = async () => {
    setError(null);
    try {
      const exportedData = await exportPrivacyDataService();
      return exportedData;
    } catch (err: any) {
      console.error('Export privacy error:', err);
      setError(err.message || "Fehler beim Exportieren der Datenschutzbestimmungen");
      return null;
    }
  };

  const importPrivacy = async (file: File) => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    setSaving(true);
    setError(null);
    try {
      const importedPrivacy = await importPrivacyDataService(token, file);
      setPrivacy(importedPrivacy);
      setLastSaved(new Date());
      return importedPrivacy;
    } catch (err: any) {
      console.error('Import privacy error:', err);
      setError(err.message || "Fehler beim Importieren der Datenschutzbestimmungen");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const validatePrivacy = () => {
    if (!privacy) return { valid: false, errors: ["Keine Datenschutzbestimmungen geladen"] };
    return validatePrivacyDataService(privacy);
  };

  const searchSections = (searchTerm: string): PrivacySection[] => {
    if (!privacy) return [];
    return searchPrivacySectionsService(privacy, searchTerm);
  };

  const getStatistics = (): PrivacyStatistics | null => {
    if (!privacy) return null;
    return getPrivacyStatisticsService(privacy);
  };

  const resetPrivacyToInitialState = () => {
    const initialPrivacy = resetPrivacyService(token);
    setPrivacy(initialPrivacy);
    setLastSaved(new Date());
    return initialPrivacy;
  };

  // ==================== CLEAR ERROR ====================
  const clearError = () => setError(null);

  // ==================== RETURN OBJECT ====================
  return {
    // State
    privacy,
    loading,
    saving,
    error,
    lastSaved,
    
    // Privacy Operations
    createPrivacy: createNewPrivacy,
    updatePrivacy: updateExistingPrivacy,
    deletePrivacy: deleteExistingPrivacy,
    
    // Section Operations
    createSection: createNewPrivacySection,
    updateSection: updateExistingPrivacySectionById,
    deleteSection: deleteExistingPrivacySectionById,
    fetchSection: fetchSinglePrivacySectionById,
    
    // Reorder
    reorderSections: reorderPrivacySectionsInState,
    
    // Bulk Operations
    bulkDeleteSections,
    bulkUpdateSections,
    
    // Utility
    exportPrivacy,
    importPrivacy,
    validatePrivacy,
    searchSections,
    getStatistics,
    resetPrivacy: resetPrivacyToInitialState,
    
    // Management
    refetch: fetchPrivacyData,
    clearError,
    
    // Manual State Setters (für spezielle Fälle)
    setPrivacy,
  };
}