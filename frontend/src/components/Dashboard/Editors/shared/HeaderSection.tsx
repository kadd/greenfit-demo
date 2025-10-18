// frontend/src/components/Dashboard/Editors/shared/HeaderSection.tsx

interface HeaderSectionProps {
  title: string;
  description?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
}

export function HeaderSection({ 
  title, 
  description, 
  onTitleChange, 
  onDescriptionChange,
  titlePlaceholder = "Titel eingeben...",
  descriptionPlaceholder = "Beschreibung eingeben..."
}: HeaderSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Grundeinstellungen</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titel
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={titlePlaceholder}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        {description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beschreibung
            </label>
            <input
              type="text"
              value={description || ""}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder={descriptionPlaceholder}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}