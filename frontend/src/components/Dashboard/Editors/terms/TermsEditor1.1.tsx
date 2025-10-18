// frontend/src/components/Dashboard/Editors/terms/TermsEditor.tsx

import React from "react";
import { TermsSection, Terms } from "@/types/terms";
import { useGenericEditor } from "@/hooks/useGenericEditor1.1";
import { 
  HeaderSection, 
  ControlsSection, 
  ItemsList,
  SaveSection,
  LoadingSpinner,
  ErrorDisplay 
} from "../shared";

interface TermsEditorProps {
  terms: Terms;
  loading: boolean;
  saving: boolean;
  error: string | null;

  updateTerms: (termsData: Partial<Terms>) => Promise<Terms | null>;
  createSection: (heading: string, text: string) => Promise<TermsSection | null>;
  updateSection: (sectionId: string, data: Partial<TermsSection>) => Promise<TermsSection | null>;
  deleteSection: (sectionId: string) => Promise<boolean>;
  reorderSections: (newOrderIds: string[]) => Promise<Terms | null>;
  validateTerms: () => { valid: boolean; errors: string[] };
  searchSections: (query: string) => TermsSection[];
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export default function TermsEditor({ 
  terms,
  loading,
  saving,
  error,
  updateTerms,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
  validateTerms,
  searchSections,
  onError,
  onSuccess
}: TermsEditorProps) {

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
    handleDrop,
  } = useGenericEditor({
    data: terms,
    createItem: async (defaultData: Partial<TermsSection>) => {
      const heading = defaultData.heading || "Neuer Abschnitt";
      const text = defaultData.text || "Abschnittstext...";
      
      return await createSection(heading, text);
    },
    updateItem: async (itemId: string, data: Partial<TermsSection>) => {
      return await updateSection(itemId, data);
    },
    deleteItem: async (itemId: string) => {
      return await deleteSection(itemId);
    },
    updateData: updateTerms,
    validateData: validateTerms,
    searchItems: searchSections,
    itemKey: "sections",
    itemFields: {
      primary: "heading",
      secondary: "text"
    },
    defaultItemValues: {
      heading: "Neuer Abschnitt",
      text: "Abschnittstext..."
    },
    onError,
    onSuccess
  });

  // ✅ Loading State mit professionellem Spinner
  if (loading) {
    return (
      <LoadingSpinner 
        message="Nutzungsbedingungen werden geladen..."
        size="lg"
      />
    );
  }

  // ✅ Error State mit Action Button
  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        title="Fehler beim Laden der Nutzungsbedingungen"
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
        titlePlaceholder="z.B. Allgemeine Geschäftsbedingungen"
        descriptionPlaceholder="z.B. Unsere Nutzungsbedingungen für die Plattform"
      />

      <ControlsSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDragMode={isDragMode}
        onDragModeToggle={() => setIsDragMode(!isDragMode)}
        onAddSection={handleAddItem}
        sectionsCount={editForm.items?.length || 0}
        saving={saving}
        sectionLabel="AGB-Abschnitte"
        searchPlaceholder="AGB-Abschnitte durchsuchen..."
      />

      <ItemsList
        items={filteredItems || []}
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

        itemFields={{
            primary: 'heading',
            secondary: 'text'
        }}

        labels={{
            emptyMessage: "Noch keine AGB-Abschnitte vorhanden",
            createButtonText: "Ersten AGB-Abschnitt erstellen",
            primaryLabel: "Überschrift",
            secondaryLabel: "Text",
            primaryPlaceholder: "Überschrift eingeben...",
            secondaryPlaceholder: "Text eingeben..."
        }}
      />

      <SaveSection
        onSave={handleSaveData}
        saving={saving}
        saveButtonText="Nutzungsbedingungen speichern"
        savingText="Nutzungsbedingungen werden gespeichert..."
      />

    
    </div>
  );
}