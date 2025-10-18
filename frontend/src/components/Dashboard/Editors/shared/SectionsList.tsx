// frontend/src/components/Dashboard/Editors/shared/SectionsList.tsx

interface SectionsListProps<T extends { id: string; heading: string; text: string }> {
  sections: T[];
  expandedSections: Set<string>;
  isDragMode: boolean;
  onSectionChange: (sectionId: string, field: keyof T, value: string) => void;
  onUpdateSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onToggleExpanded: (sectionId: string) => void;
  onDragStart: (e: React.DragEvent, sectionId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetIndex: number) => void;
  saving: boolean;
  emptyMessage?: string;
  createButtonText?: string;
}

export function SectionsList<T extends { id: string; heading: string; text: string }>({
  sections,
  expandedSections,
  isDragMode,
  onSectionChange,
  onUpdateSection,
  onDeleteSection,
  onToggleExpanded,
  onDragStart,
  onDragOver,
  onDrop,
  saving,
  emptyMessage = "Noch keine Abschnitte vorhanden",
  createButtonText = "Ersten Abschnitt erstellen"
}: SectionsListProps<T>) {
  
  if (sections.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500 mb-4">{emptyMessage}</p>
        <button
          onClick={() => onUpdateSection("")} // Trigger add function
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {createButtonText}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div
          key={section.id}
          draggable={isDragMode}
          onDragStart={(e) => onDragStart(e, section.id)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, index)}
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
                  onChange={(e) => onSectionChange(section.id, "heading" as keyof T, e.target.value)}
                  placeholder="Überschrift eingeben..."
                  className="flex-1 text-lg font-semibold border-none bg-transparent focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
                />
                <button
                  onClick={() => onToggleExpanded(section.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedSections.has(section.id) ? "−" : "+"}
                </button>
              </div>

              {/* Section Content */}
              {(expandedSections.has(section.id) || !section.text) && (
                <textarea
                  value={section.text}
                  onChange={(e) => onSectionChange(section.id, "text" as keyof T, e.target.value)}
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
                onClick={() => onUpdateSection(section.id)}
                disabled={saving}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Speichern
              </button>
              <button
                onClick={() => onDeleteSection(section.id)}
                disabled={saving}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}