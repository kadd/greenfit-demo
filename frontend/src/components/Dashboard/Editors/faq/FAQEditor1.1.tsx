import React from "react";

import { FAQ, FAQItem } from "@/types/faq";

import { useFAQ } from "@/hooks/useFAQ";
import { useGenericEditor } from "@/hooks/useGenericEditor1.1";

import {
    HeaderSection,
    ControlsSection,
    ItemsList,
    SaveSection,
    LoadingSpinner,
    ErrorDisplay
} from "../shared";

interface FAQEditorProps {
  faq: FAQ;
  loading: boolean;
  saving: boolean;
  error: string | null;
  updateFAQ: (faqData: Partial<FAQ>) => Promise<FAQ | null>;
  createItem: (question: string, answer: string) => Promise<FAQItem | null>;
  updateItem: (id: string, itemData: Partial<FAQItem>) => Promise<FAQItem | null>;
  deleteItem: (id: string) => Promise<boolean>;
  reorderItems: (itemIds: string[]) => Promise<FAQ | null>;
  validateFAQ: () => { valid: boolean; errors: string[] };
  searchItems: (searchTerm: string) => FAQItem[];
  // Callbacks
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}

export default function FAQEditor({ 
  faq, 
  loading, 
  saving,
  error, 
  updateFAQ,
  createItem,
  updateItem,
  deleteItem,
  validateFAQ,
  searchItems,
  onError,
  onSuccess
  }: FAQEditorProps) {

    const {
      editForm,
      searchQuery,
      isDragMode,
      expandedItems,
      filteredItems,
      setSearchQuery,
      setIsDragMode,
      handleTitleChange,
      handleDescriptionChange,
      handleItemChange,
      handleAddItem,
      handleUpdateItem,
      handleDeleteItem,
      handleSaveData,
      toggleItemExpanded,
      handleDragStart,
      handleDragOver,
      handleDrop  
    } = useGenericEditor<FAQ, FAQItem>({
      data: faq,
      createItem: async (defaultData: Partial<FAQItem>) => {
        console.log('useGenericEditor calling createItem with:', defaultData);
        const question = defaultData.question || "Neue Frage";
        const answer = defaultData.answer || "Neue Antwort";
        
        // ✅ useFAQ erwartet separate Parameter
        return await createItem(question, answer);  // ← Separate Parameter!
      },
      updateItem,
      deleteItem,
      updateData: updateFAQ,
      validateData: validateFAQ,
      searchItems,
      itemKey: "items",
      itemFields: {
        primary: "question",
        secondary: "answer"
      },
      defaultItemValues: {
        question: "Neue Frage",
        answer: "Neue Antwort"
      },
      onError,
      onSuccess
    });

  

  if (loading) {
     return (
      <LoadingSpinner 
        message="FAQ wird geladen..."
        size="lg"
      />
    );
  }
  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        title="Fehler beim Laden der FAQ"
        actionLabel="Erneut laden"
        onAction={() => window.location.reload()}
        variant="card"
      />
    );
  }


  return (
    <div className="space-y-6">
      <HeaderSection
        title={editForm.title}
        description={editForm.description}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
        titlePlaceholder="z.B. Häufig gestellte Fragen"
        descriptionPlaceholder="z.B. Antworten auf die wichtigsten Fragen"
      />

      <ControlsSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDragMode={isDragMode}
        onDragModeToggle={() => setIsDragMode(!isDragMode)}
        onAddSection={handleAddItem}                // ← Gleiche Funktion, anderer Name
        sectionsCount={editForm.items?.length || 0}
        saving={saving}
        sectionLabel="FAQ-Einträge"
        searchPlaceholder="FAQ durchsuchen..."
      />

      {/* ✅ Neue ItemsList Component für FAQ */}
      <ItemsList
        items={filteredItems}
        expandedItems={expandedItems}
        isDragMode={isDragMode}
        onItemChange={handleItemChange}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onToggleExpanded={toggleItemExpanded}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        saving={saving}
        
        // ✅ FAQ-spezifische Labels:
        itemFields={{
          primary: 'question',
          secondary: 'answer'
        }}
        labels={{
          primaryLabel: "Frage",
          secondaryLabel: "Antwort",
          primaryPlaceholder: "Frage eingeben...",
          secondaryPlaceholder: "Antwort eingeben...",
          emptyMessage: "Noch keine FAQ-Einträge vorhanden",
          createButtonText: "Ersten FAQ-Eintrag erstellen"
        }}
      />

      <SaveSection
        onSave={handleSaveData}
        saving={saving}
        saveButtonText="FAQ speichern"
        savingText="FAQ wird gespeichert..."
      />
    </div>
  );
}