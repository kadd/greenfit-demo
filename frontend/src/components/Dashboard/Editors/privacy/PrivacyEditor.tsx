// frontend/src/components/Dashboard/Editors/privacy/PrivacyEditor.tsx

import React from "react";
import { PrivacySection, Privacy } from "@/types/privacy";
import { useGenericEditor } from "@/hooks/useGenericEditor1.0";
import { 
  HeaderSection, 
  ControlsSection, 
  SectionsList, 
  SaveSection,
  LoadingSpinner,
  ErrorDisplay 
} from "../shared";

interface PrivacyEditorProps {
  privacy: Privacy;
  loading: boolean;
  saving: boolean;
  error: string | null;
  // Simplified Props - nur was wir brauchen
  updatePrivacy: (privacyData: Partial<Privacy>) => Promise<Privacy | null>;
  createSection: (heading: string, text: string) => Promise<PrivacySection | null>;
  updateSection: (sectionId: string, sectionData: Partial<PrivacySection>) => Promise<PrivacySection | null>;
  deleteSection: (sectionId: string) => Promise<boolean>;
  reorderSections: (sectionIds: string[]) => Promise<Privacy | null>;
  validatePrivacy: () => { valid: boolean; errors: string[] };
  searchSections: (searchTerm: string) => PrivacySection[];
  // Callbacks
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
}


export default function PrivacyEditor({ 
  privacy,
  loading,
  saving,
  error,
  updatePrivacy,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
  validatePrivacy,
  searchSections,
  onError,
  onSuccess
}: PrivacyEditorProps) {

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
    data: privacy,
    createSection,
    updateSection,
    deleteSection,
    updateData: updatePrivacy,
    validateData: validatePrivacy,
    searchSections,
    onError,
    onSuccess
  });

  // ✅ Loading State mit professionellem Spinner
  if (loading) {
    return (
      <LoadingSpinner 
        message="Datenschutzbestimmungen werden geladen..."
        size="lg"
      />
    );
  }

  // ✅ Error State mit Action Button
  if (error) {
    return (
      <ErrorDisplay 
        error={error}
        title="Fehler beim Laden der Datenschutzbestimmungen"
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
        titlePlaceholder="z.B. Datenschutzerklärung"
        descriptionPlaceholder="z.B. Unsere Datenschutzbestimmungen"
      />

      <ControlsSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDragMode={isDragMode}
        onDragModeToggle={() => setIsDragMode(!isDragMode)}
        onAddSection={handleAddSection}
        sectionsCount={editForm.sections.length}
        saving={saving}
        sectionLabel="Datenschutz-Abschnitte"
        searchPlaceholder="Abschnitte durchsuchen..."
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
      />

      <SaveSection
        onSave={handleSaveData}
        saving={saving}
        saveButtonText="Datenschutz speichern"
      />
    </div>
  );
}