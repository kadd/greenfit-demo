// frontend/src/components/Dashboard/Editors/privacy/PrivacyEditor.tsx
import React, { useState } from "react";
import { PrivacySection, Privacy } from "@/types/privacy";

// ✅ NEUE Props-Interface - viel sauberer!
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
  
  // ✅ LOCAL State für UI-only Änderungen
  const [editForm, setEditForm] = useState<Privacy>(privacy);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragMode, setIsDragMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // ✅ EFFEKT - Sync mit Props
  React.useEffect(() => {
    setEditForm(privacy);
  }, [privacy]);

  // ==================== SECTION OPERATIONS ====================
  
  const handleTitleChange = (title: string) => {
    setEditForm({ ...editForm, title });
  };

  const handleDescriptionChange = (description: string) => {
    setEditForm({ ...editForm, description });
  };

  const handleSectionChange = (sectionId: string, field: keyof PrivacySection, value: string) => {
    const updatedSections = editForm.sections.map(section =>
      section.id === sectionId ? { ...section, [field]: value } : section
    );
    setEditForm({ ...editForm, sections: updatedSections });
  };

  const handleAddSection = async () => {
    try {
      const newSection = await createSection("Neue Überschrift", "Neuer Text");
      if (newSection) {
        onSuccess?.("Abschnitt erfolgreich hinzugefügt");
        // State wird durch den Hook automatisch aktualisiert
      }
    } catch (err: any) {
      onError?.("Fehler beim Hinzufügen des Abschnitts: " + err.message);
    }
  };

  const handleUpdateSection = async (sectionId: string) => {
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
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Möchten Sie diesen Abschnitt wirklich löschen?")) return;

    try {
      const success = await deleteSection(sectionId);
      if (success) {
        onSuccess?.("Abschnitt erfolgreich gelöscht");
      }
    } catch (err: any) {
      onError?.("Fehler beim Löschen des Abschnitts: " + err.message);
    }
  };

  const handleSavePrivacy = async () => {
    // Validation
    const validation = validatePrivacy();
    if (!validation.valid) {
      onError?.("Validierungsfehler: " + validation.errors.join(", "));
      return;
    }

    try {
      const updatedPrivacy = await updatePrivacy(editForm);
      if (updatedPrivacy) {
        onSuccess?.("Datenschutzbestimmungen erfolgreich gespeichert");
      }
    } catch (err: any) {
      onError?.("Fehler beim Speichern: " + err.message);
    }
  };

  // ==================== DRAG & DROP ====================
  
  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    e.dataTransfer.setData("text/plain", sectionId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedSectionId = e.dataTransfer.getData("text/plain");
    
    const newOrderIds = [...editForm.sections];
    const draggedIndex = newOrderIds.findIndex(s => s.id === draggedSectionId);
    
    if (draggedIndex !== -1) {
      const [draggedSection] = newOrderIds.splice(draggedIndex, 1);
      newOrderIds.splice(targetIndex, 0, draggedSection);
      
      try {
        await reorderSections(newOrderIds.map(s => s.id));
        onSuccess?.("Abschnitte erfolgreich neu angeordnet");
      } catch (err: any) {
        onError?.("Fehler beim Neuordnen: " + err.message);
      }
    }
  };

  // ==================== SEARCH ====================
  
  const filteredSections = searchTerm 
    ? searchSections(searchTerm)
    : editForm.sections;

  const toggleSectionExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2">Datenschutz wird geladen...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Fehler beim Laden</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ✅ HEADER SECTION */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Grundeinstellungen</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titel
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="z.B. Datenschutzerklärung"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beschreibung
            </label>
            <input
              type="text"
              value={editForm.description || ""}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="z.B. Unsere Datenschutzbestimmungen"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* ✅ CONTROLS SECTION */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Abschnitte ({editForm.sections.length})</h3>
          
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Abschnitte durchsuchen..."
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Drag Mode Toggle */}
            <button
              onClick={() => setIsDragMode(!isDragMode)}
              className={`px-3 py-2 text-sm rounded-lg ${
                isDragMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isDragMode ? "Drag beenden" : "Neu ordnen"}
            </button>
            
            {/* Add Section */}
            <button
              onClick={handleAddSection}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Abschnitt
            </button>
          </div>
        </div>
      </div>

      {/* ✅ SECTIONS LIST */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">
              {searchTerm ? "Keine Abschnitte gefunden" : "Noch keine Abschnitte vorhanden"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddSection}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Ersten Abschnitt erstellen
              </button>
            )}
          </div>
        ) : (
          filteredSections.map((section, index) => (
            <div
              key={section.id}
              draggable={isDragMode}
              onDragStart={(e) => handleDragStart(e, section.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`bg-white border border-gray-200 rounded-lg p-6 transition-all ${
                isDragMode ? 'cursor-move hover:shadow-lg' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  {/* Section Header */}
                  <div className="flex items-center space-x-3">
                    {isDragMode && (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    )}
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) => handleSectionChange(section.id, "heading", e.target.value)}
                      placeholder="Überschrift eingeben..."
                      className="flex-1 text-lg font-semibold border-none bg-transparent focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
                    />
                    <button
                      onClick={() => toggleSectionExpanded(section.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedSections.has(section.id) ? "−" : "+"}
                    </button>
                  </div>

                  {/* Section Content */}
                  {(expandedSections.has(section.id) || !section.text) && (
                    <textarea
                      value={section.text}
                      onChange={(e) => handleSectionChange(section.id, "text", e.target.value)}
                      placeholder="Text des Abschnitts..."
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                    />
                  )}

                  {/* Preview when collapsed */}
                  {!expandedSections.has(section.id) && section.text && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {section.text.substring(0, 150)}
                      {section.text.length > 150 && "..."}
                    </p>
                  )}
                </div>

                {/* Section Actions */}
                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => handleUpdateSection(section.id)}
                    disabled={saving}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Speichern
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    disabled={saving}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ SAVE BUTTON */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {saving && "Änderungen werden gespeichert..."}
          </div>
          
          <button
            onClick={handleSavePrivacy}
            disabled={saving}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {saving ? "Speichert..." : "Alle Änderungen speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}