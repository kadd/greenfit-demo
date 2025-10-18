import { useState, useEffect } from "react";

import { FAQ, FAQItem, FAQStatistics, BulkOperationResult } from "@/types/faq";

import { 
  fetchFAQService, 
  createFAQService, 
  updateFAQService,
  deleteFAQService, 
  createFAQItemService, 
  fetchFAQItemByIdService, 
  deleteFAQItemByIdService,
  updateFAQItemByIdService,
  reorderFAQItemsService,
  bulkDeleteFAQItemsService,
  bulkUpdateFAQItemsService,
  exportFAQDataService,
  importFAQDataFromFileService,
  validateFAQStructureService,
  searchFAQItemsService,
  getFAQStatisticsService,
  resetFAQToDefaultService
} from "@/services/faq";
import { bulkUpdateTermsSectionsService } from "@/services/terms";
import { TermsSection, TermsStatistics } from "@/types/terms";


export function useFAQ() {
  const token = localStorage.getItem("token") || "";

  const [faq, setFaq] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);


  // ====================== FETCH FAQ ======================
  useEffect(() => {
    fetchFAQ();
  }, []);

  // ====================== FAQ OPERATIONS ======================

  //Fetch FAQ
  const fetchFAQ = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFAQService();
      setFaq(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Fehler beim Laden der FAQ");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createNewFAQ = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await createFAQService(token);
      setFaq(data); 
      return data;
    } catch (err: any) {
      setError(err.message || "Fehler beim Erstellen der FAQ");
      return null;
    } finally {
      setLoading(false);
    }
  }

  const updateExistingFAQ = async (faqData: Partial<FAQ>) => {
    if(!token) {
      setError("Authentifizierung erforderlich!");
    }

    setSaving(true);
    setError(null);

    try {
      const data = await updateFAQService(token,faqData);
      setFaq(data); // Aktualisiere die entsprechende FAQ in der Liste
      setLastSaved(new Date());      
      return data;
    } catch (err: any) {
      setError(err.message || "Fehler beim Aktualisieren der AGB");
      return null;
    } finally {
      setSaving(false);
    }
  }

  const deleteExistingFAQ = async () => {
    if(!token) {
      setError("Authentifizierung erforderlich!");
      return;
    }
    setLoading(true);
    setSaving(true);
    setError(null);
    try {
      await deleteFAQService(token);
      setFaq(null); // FAQ gelöscht, leere Liste setzen
      setLastSaved(new Date());
    } catch (err: any) {
      setError(err.message || "Fehler beim Löschen der AGB");
      return null;
    } finally {
      setLoading(false);
      setSaving(false);
    }
  }

  // ============================ FAQ ITEM OPERATIONS ===========================

  const createNewFAQItem = async (question: string, answer: string) => {
    if(!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    setSaving(true);
    setError(null);

    try {
      const newItem = await createFAQItemService(token, { question, answer });

      if(faq){
        setFaq({...faq, items: [...faq.items, newItem]})
      }
      setLastSaved(new Date());
      return newItem;
    } catch (err: any) {
      setError(err.message || "Fehler beim Erstellen des FAQ Items");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateExistingFAQItemById = async (itemId: string, itemData: Partial<FAQItem>) => {
    if(!token) {
      setError("Authentifizierung erforderlich")
      return null;
    }
    setLoading(true);
    setSaving(true);
    setError(null);
    try {
      const data = await updateFAQItemByIdService(token, itemId, itemData);
      if(faq){
        setFaq(faq.map(f => f.items ? { 
          ...f, 
          items: f.items.map(i => i.id === itemId ? data : i) 
        } : f));
      }
      setLastSaved(new Date());
      return data;
    } catch (err: any) {
      setError(err.message || "Fehler beim Aktualisieren des FAQ Items");
      return null;
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const deleteExistingFAQItemById = async (itemId: string) => {
    setSaving(true);
    setLoading(true);
    setError(null);
    try {
      await deleteFAQItemByIdService(token, itemId);
      if(faq)
        setFaq(faq.map(f => f.items ? { 
          ...f, 
          items: f.items.filter(i => i.id !== itemId) 
        } : f));
      setLastSaved(new Date());
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
      await fetchFAQ();
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };
  
  const fetchSingleFAQItemById = async (itemId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFAQItemByIdService(itemId);
      if(faq)
        setFaq(faq.map(f => f.items ? { 
          ...f, 
          items: f.items.filter(i => i.id !== itemId) 
        } : f));
      return data;
    } catch (err: any) {
      setError(err.message || "Fehler beim Laden des AGB Items");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ============================ REORDER FAQ ITEM ===========================
  const reorderFAQItems = async (newOrderIds: string[]) => {
    if (!token) {
      setError("Authentifizierung erforderlich");
      return null;
    }

    const reorderedItems = newOrderIds
    .map(id => faq?.items.find(item => item.id === id))
    .filter(Boolean) as FAQItem[];

    const optimisticFAQ = faq ? { ...faq, items: reorderedItems } : null;
    setFaq(optimisticFAQ);

    setSaving(true);
    setError(null);
  
    try {
      const reorderedItems = await reorderFAQItemsService(token, newOrderIds);
      if(faq){
        setFaq({...faq, items: reorderedItems});
      }
      setLastSaved(new Date());
      return reorderedItems;
    } catch (err: any) {
      setError(err.message || "Fehler beim Neuordnen der FAQ Items");
      return null;
    } finally {
      setSaving(false);
    }
  }

  // ============================ ADDITIONAL FAQ OPERATIONS ===========================
  const resetFAQToDefault = async () => {
    if(!token) {
      setError("Authentifizierung erforderlich");
      return null;
    } 
    
    setLoading(true);
    setError(null);

    try {
      const defaultFAQ = await resetFAQToDefaultService(token);
      setFaq(defaultFAQ);
      setLastSaved(new Date());
      return defaultFAQ;
    } catch(err:any){
      setError(err.message || "Fehler beim Zurücksetzen der FAQ");
    } finally {
      setLoading(false);
    }
  }

  // ==================== BULK OPERATIONS ====================
    const bulkDeleteItems = async (sectionIds: string[]): Promise<BulkOperationResult | null> => {
      if (!token) {
        setError("Authentifizierung erforderlich");
        return null;
      }
  
      setSaving(true);
      setLoading(true);
      setError(null);
      try {
        const result = await bulkDeleteFAQItemsService(token, sectionIds);
        // Entferne die gelöschten Sektionen aus dem lokalen State
        if (faq) {
          setFaq({ ...faq, items: faq.items.filter(item => !sectionIds.includes(item.id)) });
        }
        setLastSaved(new Date());
        return result;
      } catch (err: any) {
        setError(err.message || "Fehler beim Löschen der FAQ-Items");
        return null;
      } finally {
        setLoading(false);
        setSaving(false);
      }
    };

    const bulkUpdateItems = async (updates: Array<{ id: string; data: Partial<FAQItem> }>): Promise<BulkOperationResult | null> => {
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
        if (faq) {
          const updatedItems = faq.items.map(item => {
            const update = updates.find(u => u.id === item.id);
            return update ? { ...item, ...update } : item;
          });
          setFaq({ ...faq, items: updatedItems });
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
    const exportFAQ = async (): Promise<string | null> => {
      setLoading(true);
      setError(null);
      try {
        const fileUrl = await exportFAQDataService(token || "");
        return fileUrl;
      } catch (err: any) {
        setError(err.message || "Fehler beim Exportieren der Faq Daten");
        return null;
      } finally {
        setLoading(false);
      }
    };
  
    const importFAQ = async (file: File): Promise<FAQ | null> => {
      if (!token) {
        setError("Authentifizierung erforderlich");
        return null;
      }
  
      setSaving(true);
      setLoading(true);
      setError(null);
      try {
        const importedTerms = await importFAQDataFromFileService(token, file);
        setFaq(importedTerms);
        setLastSaved(new Date());
        return importedTerms;
      } catch (err: any) {
        setError(err.message || "Fehler beim Importieren der FAQ-Daten");
        return null;
      } finally {
        setLoading(false);
        setSaving(false);
      }
    };

    const validateFAQ = () => {
      if(!faq) {
        return {valid: false, errors: ["Keine FAQ-Daten zum Validieren vorhanden"]};
      }
      return validateFAQStructureService(faq);
    };
  
    // ==================== STATISTICS ====================
    const getStatistics = (): FAQStatistics | null => {
      if (!faq) {
        return null;
      }
      return getFAQStatisticsService(faq);
    };
  
    // ==================== SEARCH ====================
    const searchItems = async (query: string): Promise<FAQItem[] | null> => {
      if (!faq) {
        return [];
      }
      return searchFAQItemsService(faq, query);
    };
  
    const clearError = () => setError(null);
  
    // ==================== RETURN HOOK STATE & FUNCTIONS ====================
  
    return { 
      // State
      faq,
      loading,
      saving,
      error,
      lastSaved,
      // CRUD Terms
      fetchFAQ,
      createFAQ: createNewFAQ,
      updateFAQ: updateExistingFAQ,
      deleteFAQ: deleteExistingFAQ,
  
      // Item Operations
      createItem: createNewFAQItem,
      updateItem: updateExistingFAQItemById,
      deleteItem: deleteExistingFAQItemById,
      fetchItem: fetchSingleFAQItemById,
  
      // Reorder
      reorderItems: reorderFAQItems,
  
         // Bulk Operations
      bulkDeleteItems,
      bulkUpdateItems,
  
      // Utility
      resetFAQ: resetFAQToDefault,
      getStatistics,
      exportFAQ,
      importFAQ,
      validateFAQ,
      searchItems,
  
      // Management
      refetch: fetchFAQ,
      clearError,
  
      // manual setTerms for external updates
      setFaq
    };
}