import { useState, useEffect, useCallback, useMemo } from "react";

// frontend/src/hooks/useGenericEditor.tsx - Reusable Editor Logic

// Flexible Base Interfaces
// Example: PrivacySection, TermsSection, FAQItem, etc.
// All share id, heading/title, text/answer fields
// BaseData: Privacy | Terms | FAQ
// BaseItem: PrivacySection | TermsSection | FAQItem

interface BaseItem {
  id: string;
  [key: string]: any;
}

interface BaseData {
  title: string;
  description: string;
  items?: BaseItem[];
  sections?: BaseItem[];
  [key: string]: any;
}

interface UseGenericEditorProps<T extends BaseData, I extends BaseItem> {
  data: T;
  // ✅ Flexible createItem Signatur
   createItem: (primary: string, secondary: string) => Promise<I | null>;
  
  updateItem: (id: string, data: Partial<I>) => Promise<I | null>;
  deleteItem: (id: string) => Promise<boolean>;
  updateData: (data: Partial<T>) => Promise<T | null>;
  validateData: () => { valid: boolean; errors: string[] };
  searchItems: (query: string) => I[];
  itemKey: keyof T;
  itemFields: {
    primary: keyof I;
    secondary: keyof I;
  };
  defaultItemValues: Partial<I>;
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}


export function useGenericEditor<T extends BaseData, I extends BaseItem>({
  data,
  createItem,
  updateItem,
  deleteItem,
  updateData,
  validateData,
  searchItems,
  itemKey,
  itemFields,
  defaultItemValues,
  onError,
  onSuccess
}: UseGenericEditorProps<T, I>) {

  const [editForm, setEditForm] = useState<T>(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragMode, setIsDragMode] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    setEditForm(data);
  }, [data]);

  // Flexible Items-Array
  const items: I[] = itemKey && editForm[itemKey] ? (editForm[itemKey] as unknown as I[]) : [];

  // ✅ ZENTRALE HANDLER - Funktionieren für FAQ, Privacy UND Terms:
  
  const handleTitleChange = useCallback((title: string) => {
    setEditForm(prev => ({ ...prev, title } as T));
  }, []);

  const handleDescriptionChange = useCallback((description: string) => {
    setEditForm(prev => ({ ...prev, description } as T));
  }, []);

  // vorher zum Beispiel handleSectionChange
  // jetzt generisch handleItemChange
  const handleItemChange = useCallback((itemId: string, field: keyof I, value: string) => {
    setEditForm(prev => {
      const updatedItems = items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      );

      // itemKey ist z.B. "sections" oder "items" je nach T
      // wo kommt itemKey her? Aus den Props

      return itemKey 
        ? { ...prev, [itemKey]: updatedItems } as T 
        : prev;
    });
  }, [items, itemKey]);

  // Hinzufügen eines neuen Items (Section, FAQItem, etc.)
// Hinzufügen eines neuen Items (Section, FAQItem, etc.)
  const handleAddItem = useCallback(async () => {
  try {
    console.log('=== handleAddItem DEBUG ===');
    console.log('defaultItemValues:', defaultItemValues);
    console.log('itemFields:', itemFields);
    
    // ✅ FIX: Zurück zur ursprünglichen Logik
    const newItem = await createItem(
      defaultItemValues?.[itemFields.primary] || "Neue Überschrift",
      defaultItemValues?.[itemFields.secondary] || "Neuer Text"
    );
    
    console.log('Created item:', newItem);
    
    if (newItem) {
      onSuccess?.("Eintrag erfolgreich hinzugefügt");
    }
  } catch (err: any) {
    console.error('handleAddItem error:', err);
    onError?.("Fehler beim Hinzufügen des Eintrags: " + err.message);
  }
}, [createItem, defaultItemValues, itemFields, onError, onSuccess]);

  // Aktualisieren eines bestehenden Items (Section, FAQItem, etc.)

  const handleUpdateItem = useCallback(async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    try {
      const updatedItem = await updateItem(itemId, {
        [itemFields.primary]: item[itemFields.primary],
        [itemFields.secondary]: item[itemFields.secondary]
      } as Partial<I>);
      if (updatedItem) {
        onSuccess?.("Eintrag erfolgreich aktualisiert");
      }
    } catch (err: any) {
      onError?.("Fehler beim Aktualisieren des Eintrags: " + err.message);
    }
  }, [items, updateItem, itemFields, onError, onSuccess]);

  // Löschen eines Items (Section, FAQItem, etc.)
  const handleDeleteItem = useCallback(async (itemId: string) => {
    if (!confirm("Möchten Sie diesen Eintrag wirklich löschen?")) return;

    try {
      const success = await deleteItem(itemId);
      if (success) {
        onSuccess?.("Eintrag erfolgreich gelöscht");
      }
    } catch (err: any) {
      onError?.("Fehler beim Löschen des Eintrags: " + err.message);
    }
  }, [deleteItem, onError, onSuccess]);

  // Speichern der gesamten Daten (Titel, Beschreibung, Items)
  const handleSaveData = useCallback(async () => {
    const { valid, errors } = validateData();
    if (!valid) {
      onError?.("Validierungsfehler:\n" + errors.join("\n"));
      return;
    }

    try {
      const updatedData = await updateData(editForm);
      if (updatedData) {
        setEditForm(updatedData);
        onSuccess?.("Daten erfolgreich gespeichert");
      }
    } catch (err: any) {
      onError?.("Fehler beim Speichern der Daten: " + err.message);
    }
  }, [editForm, updateData, validateData, onError, onSuccess]);

  // Abschnitte erweitern/einklappen
  // vorher toggleSectionExpanded
  // jetzt toggleItemExpanded

  const toggleItemExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  // Search funktionalität
  const filteredItems = useMemo(() => {
    const list = (editForm as any)[itemKey] || [];
    console.log('Filtering items with searchQuery:', searchQuery);
    console.log('Current items list:', list);
    if (!searchQuery || !searchQuery.trim()) return list;
    try {
      return searchItems(searchQuery) || [];
    } catch {
      return list;
    }

  }, [editForm, itemKey, searchItems, searchQuery]);

  // Drag-and-Drop Funktionalität könnte hier noch hinzugefügt werden
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    if (!draggedItemId || draggedItemId === targetItemId) return;

    const draggedIndex = items.findIndex(i => i.id === draggedItemId);
    if (draggedIndex === -1) return;

    const targetIndex = items.findIndex(i => i.id === targetItemId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder the items array
    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(draggedIndex, 1);
    reorderedItems.splice(targetIndex, 0, movedItem);

    // Update the state with the new order
    if (itemKey) {
      setEditForm(prev => ({ ...prev, [itemKey]: reorderedItems } as T));
    }

    setDraggedItemId(null);
  }, [draggedItemId, items, itemKey]);

  const handleDragEnd = useCallback(() => {
    setDraggedItemId(null);
  }, []);

  return {
    // State
    editForm,
    searchQuery,
    isDragMode,
    expandedItems,
    filteredItems,
    items,
    
    // Setters
    setEditForm,
    setSearchQuery,
    setIsDragMode,
    setExpandedItems,
    
    // Handlers
    handleTitleChange,
    handleDescriptionChange,
    handleItemChange,
    handleAddItem,
    handleUpdateItem,
    handleDeleteItem,
    handleSaveData,
    toggleItemExpanded,

    // Drag-and-Drop
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}