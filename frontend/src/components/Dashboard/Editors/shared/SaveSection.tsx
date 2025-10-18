// frontend/src/components/Dashboard/Editors/shared/SaveSection.tsx

interface SaveSectionProps {
  onSave: () => void;
  saving: boolean;
  saveButtonText?: string;
  savingText?: string;
}

export function SaveSection({
  onSave,
  saving,
  saveButtonText = "Alle Änderungen speichern",
  savingText = "Änderungen werden gespeichert..."
}: SaveSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {saving && savingText}
        </div>
        
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {saving ? "Speichert..." : saveButtonText}
        </button>
      </div>
    </div>
  );
}