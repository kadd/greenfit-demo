import React from "react";

type Section = {
  heading: string;
  text: string;
};

type Props = {
  sections: Section[];
  setSections: (sections: Section[]) => void;
};

export default function TermsEditor({ sections, setSections }: Props) {
  const handleChange = (idx: number, field: keyof Section, value: string) => {
    const updated = sections.map((section, i) =>
      i === idx ? { ...section, [field]: value } : section
    );
    setSections(updated);
  };

  const handleAdd = () => {
    setSections([...sections, { heading: "", text: "" }]);
  };

  const handleDelete = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  if(!sections) {
    return <p className="text-center text-gray-500">Keine AGB-Abschnitte zum Bearbeiten vorhanden.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">AGB-Abschnitte</h3>
      {sections.map((section, idx) => (
        <div key={idx} className="mb-4 border p-3 rounded">
          <input
            type="text"
            value={section.heading}
            onChange={e => handleChange(idx, "heading", e.target.value)}
            placeholder="Überschrift"
            className="mb-2 w-full border rounded p-2 font-bold"
          />
          <textarea
            value={section.text}
            onChange={e => handleChange(idx, "text", e.target.value)}
            placeholder="Text"
            className="w-full border rounded p-2"
            rows={3}
          />
          <button
            type="button"
            onClick={() => handleDelete(idx)}
            className="mt-2 px-2 py-1 bg-red-600 text-white rounded"
          >
            Abschnitt löschen
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Neuen Abschnitt hinzufügen
      </button>
    </div>
  );
}