// frontend/src/components/Dashboard/Editors/terms/TermsEditor.tsx

import React from "react";
import { TermsSection, Terms } from "@/types/terms";
import { useGenericEditor } from "@/hooks/useGenericEditor1.0";
import { 
  HeaderSection, 
  ControlsSection, 
  SectionsList, 
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
    expandedSections,
    filteredSections,
    setSearchQuery,
    setIsDragMode,
    handleTitleChange,
    handleDescriptionChange,
    handleSectionChange,
    handleAddSection,
    handleUpdateSection,
    handleDeleteSection,
    handleSaveData,
    toggleSectionExpanded,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = useGenericEditor({
    data: terms,
    createSection,
    updateSection,
    deleteSection,
    updateData: updateTerms,
    validateData: validateTerms,
    searchSections,
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
        onAddSection={handleAddSection}
        sectionsCount={editForm.sections.length}
        saving={saving}
        sectionLabel="AGB-Abschnitte"
        searchPlaceholder="AGB-Abschnitte durchsuchen..."
      />

      <SectionsList
        sections={filteredSections}
        expandedSections={expandedSections}
        isDragMode={isDragMode}
        onSectionChange={handleSectionChange}
        onUpdateSection={handleUpdateSection}
        onDeleteSection={handleDeleteSection}
        onToggleExpanded={toggleSectionExpanded}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        saving={saving}
        emptyMessage="Noch keine AGB-Abschnitte vorhanden"
        createButtonText="Ersten AGB-Abschnitt erstellen"
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