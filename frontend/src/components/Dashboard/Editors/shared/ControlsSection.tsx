// frontend/src/components/Dashboard/Editors/shared/ControlsSection.tsx

interface ControlsSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDragMode: boolean;
  onDragModeToggle: () => void;
  onAddSection: () => void;
  sectionsCount: number;
  saving: boolean;
  sectionLabel?: string;
  searchPlaceholder?: string;
}

export function ControlsSection({
  searchQuery,
  onSearchChange,
  isDragMode,
  onDragModeToggle,
  onAddSection,
  sectionsCount,
  saving,
  sectionLabel = "Abschnitte",
  searchPlaceholder = "Durchsuchen..."
}: ControlsSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">
          {sectionLabel} ({sectionsCount})
        </h3>
        
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Drag Mode Toggle */}
          <button
            onClick={onDragModeToggle}
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
            onClick={onAddSection}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Abschnitt
          </button>
        </div>
      </div>
    </div>
  );
}