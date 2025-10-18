import React from "react";

// frontend/src/components/Dashboard/Editors/shared/ItemsList.tsx

interface ItemsListProps<T extends { id: string; [key: string]: any }> {
  items: T[];
  expandedItems: Set<string>;
  isDragMode: boolean;
  onItemChange: (itemId: string, field: keyof T, value: string) => void;
  onUpdateItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleExpanded: (itemId: string) => void;
  onDragStart: (e: React.DragEvent, itemId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetIndex: number) => void;
  saving: boolean;
  
  // ✅ Flexible Field Configuration:
  itemFields: {
    primary: keyof T;      // 'heading' | 'question'
    secondary: keyof T;    // 'text' | 'answer'
  };
  
  // ✅ Customizable Labels:
  labels: {
    primaryLabel: string;           // "Überschrift" | "Frage"
    secondaryLabel: string;         // "Text" | "Antwort"
    primaryPlaceholder: string;     // "Überschrift eingeben..." | "Frage eingeben..."
    secondaryPlaceholder: string;   // "Text eingeben..." | "Antwort eingeben..."
    emptyMessage: string;
    createButtonText: string;
  };
}

export function ItemsList<T extends { id: string; [key: string]: any }>({
  items,
  expandedItems,
  isDragMode,
  onItemChange,
  onUpdateItem,
  onDeleteItem,
  onToggleExpanded,
  onDragStart,
  onDragOver,
  onDrop,
  saving,
  itemFields,
  labels
}: ItemsListProps<T>) {
  
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500 mb-4">{labels.emptyMessage}</p>
        <button
          onClick={() => onUpdateItem("")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {labels.createButtonText}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable={isDragMode}
          onDragStart={(e) => onDragStart(e, item.id)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, index)}
          className={`bg-white border border-gray-200 rounded-lg p-6 transition-all ${
            isDragMode ? 'cursor-move hover:shadow-lg' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-4">
              {/* Primary Field (Question/Heading) */}
              <div className="flex items-center space-x-3">
                {isDragMode && (
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                )}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {labels.primaryLabel}
                  </label>
                  <input
                    type="text"
                    value={item[itemFields.primary] as string}
                    onChange={(e) => onItemChange(item.id, itemFields.primary, e.target.value)}
                    placeholder={labels.primaryPlaceholder}
                    className="w-full text-lg font-semibold border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => onToggleExpanded(item.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedItems.has(item.id) ? "−" : "+"}
                </button>
              </div>

              {/* Secondary Field (Answer/Text) */}
              {(expandedItems.has(item.id) || !item[itemFields.secondary]) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {labels.secondaryLabel}
                  </label>
                  <textarea
                    value={item[itemFields.secondary] as string}
                    onChange={(e) => onItemChange(item.id, itemFields.secondary, e.target.value)}
                    placeholder={labels.secondaryPlaceholder}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                  />
                </div>
              )}

              {/* Preview when collapsed */}
              {!expandedItems.has(item.id) && item[itemFields.secondary] && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {(item[itemFields.secondary] as string).substring(0, 150)}
                  {(item[itemFields.secondary] as string).length > 150 && "..."}
                </p>
              )}
            </div>

            {/* Item Actions */}
            <div className="flex flex-col space-y-2 ml-4">
              <button
                onClick={() => onUpdateItem(item.id)}
                disabled={saving}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Speichern
              </button>
              <button
                onClick={() => onDeleteItem(item.id)}
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