import { useState, useEffect, useCallback } from "react";

// frontend/src/hooks/useGenericEditor.tsx - Reusable Editor Logic

interface UseGenericEditorProps<T, S> {
  data: T;
  createSection: (heading: string, text: string) => Promise<S | null>;
  updateSection: (id: string, data: Partial<S>) => Promise<S | null>;
  deleteSection: (id: string) => Promise<boolean>;
  updateData: (data: Partial<T>) => Promise<T | null>;
  validateData: () => { valid: boolean; errors: string[] };
  searchSections: (query: string) => S[];
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

export function useGenericEditor<T extends { sections: S[] }, S extends { id: string; heading: string; text: string }>({
  data,
  createSection,
  updateSection,
  deleteSection,
  updateData,
  validateData,
  searchSections,
  onError,
  onSuccess
}: UseGenericEditorProps<T, S>) {
  
  const [editForm, setEditForm] = useState<T>(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragMode, setIsDragMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    setEditForm(data);
  }, [data]);

  // ✅ ZENTRALE HANDLER - Funktionieren für Privacy UND Terms:
  
  const handleTitleChange = useCallback((title: string) => {
    setEditForm(prev => ({ ...prev, title } as T));
  }, []);

  const handleDescriptionChange = useCallback((description: string) => {
    setEditForm(prev => ({ ...prev, description } as T));
  }, []);

  const handleSectionChange = useCallback((sectionId: string, field: keyof S, value: string) => {
    setEditForm(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  }, []);

  const handleAddSection = useCallback(async () => {
    try {
      const newSection = await createSection("Neue Überschrift", "Neuer Text");
      if (newSection) {
        onSuccess?.("Abschnitt erfolgreich hinzugefügt");
      }
    } catch (err: any) {
      onError?.("Fehler beim Hinzufügen des Abschnitts: " + err.message);
    }
  }, [createSection, onError, onSuccess]);

  const handleUpdateSection = useCallback(async (sectionId: string) => {
    const section = editForm.sections.find(s => s.id === sectionId);
    if (!section) return;

    try {
      const updatedSection = await updateSection(sectionId, {
        heading: section.heading,
        text: section.text
      });
      if (updatedSection) {
        onSuccess?.("Abschnitt erfolgreich aktualisiert");
      }
    } catch (err: any) {
      onError?.("Fehler beim Aktualisieren des Abschnitts: " + err.message);
    }
  }, [editForm.sections, updateSection, onError, onSuccess]);

  const handleDeleteSection = useCallback(async (sectionId: string) => {
    if (!confirm("Möchten Sie diesen Abschnitt wirklich löschen?")) return;

    try {
      const success = await deleteSection(sectionId);
      if (success) {
        onSuccess?.("Abschnitt erfolgreich gelöscht");
      }
    } catch (err: any) {
      onError?.("Fehler beim Löschen des Abschnitts: " + err.message);
    }
  }, [deleteSection, onError, onSuccess]);

  const handleSaveData = useCallback(async () => {
    // Validation
    const validation = validateData();
    if (!validation.valid) {
      onError?.("Validierungsfehler: " + validation.errors.join(", "));
      return;
    }

    try {
      const updatedData = await updateData(editForm);
      if (updatedData) {
        onSuccess?.("Daten erfolgreich gespeichert");
      }
    } catch (err: any) {
      onError?.("Fehler beim Speichern: " + err.message);
    }
  }, [editForm, updateData, validateData, onError, onSuccess]);

  const toggleSectionExpanded = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Search funktionalität
  const filteredSections = searchQuery 
    ? searchSections(searchQuery)
    : editForm.sections;

  return {
    // State
    editForm,
    searchQuery,
    isDragMode,
    expandedSections,
    filteredSections,
    
    // Setters
    setEditForm,
    setSearchQuery,
    setIsDragMode,
    setExpandedSections,
    
    // Handlers
    handleTitleChange,
    handleDescriptionChange,
    handleSectionChange,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    handleSaveData,
    toggleSectionExpanded,
  };
}