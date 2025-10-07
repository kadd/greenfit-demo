import React from "react";

export default function ImpressumEditor({ impressum, setImpressum }) {
  // Handler für die Hauptfelder
  const handleChange = (field: string, value: string | boolean) => {
    setImpressum({ ...impressum, [field]: value });
  };

  // Handler für Section-Felder
  const handleSectionChange = (idx: number, field: string, value: string) => {
    const updatedSections = impressum.sections.map((section, i) =>
      i === idx ? { ...section, [field]: value } : section
    );
    setImpressum({ ...impressum, sections: updatedSections });
  };

  // Section hinzufügen
  const handleAddSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      key: "",
      heading: "",
      text: ""
    };
    setImpressum({
      ...impressum,
      sections: [...impressum.sections, newSection]
    });
  };

  // Section löschen
  const handleDeleteSection = (idx: number) => {
    setImpressum({
      ...impressum,
      sections: impressum.sections.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-green-100">
      <h3 className="text-xl font-bold text-green-700 mb-4">Impressum bearbeiten</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Titel</label>
          <input
            type="text"
            value={impressum.title}
            onChange={e => handleChange("title", e.target.value)}
            className="w-full border rounded px-2 py-1 mb-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Beschreibung</label>
          <input
            type="text"
            value={impressum.description}
            onChange={e => handleChange("description", e.target.value)}
            className="w-full border rounded px-2 py-1 mb-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Firma</label>
          <input
            type="text"
            value={impressum.company}
            onChange={e => handleChange("company", e.target.value)}
            className="w-full border rounded px-2 py-1 mb-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Adresse</label>
          <input
            type="text"
            value={impressum.address}
            onChange={e => handleChange("address", e.target.value)}
            className="w-full border rounded px-2 py-1 mb-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">E-Mail</label>
          <input
            type="email"
            value={impressum.email}
            onChange={e => handleChange("email", e.target.value)}
            className="w-full border rounded px-2 py-1 mb-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Telefon</label>
          <input
            type="text"
            value={impressum.phone}
            onChange={e => handleChange("phone", e.target.value)}
            className="w-full border rounded px-2 py-1 mb-2"
          />
        </div>
      </div>
      <hr className="my-6 border-green-200" />
      <h4 className="text-lg font-bold text-green-700 mb-2">Abschnitte</h4>
      {impressum.sections.map((section, idx) => (
        <div key={section.id} className="mb-6 p-4 rounded border border-gray-200 bg-gray-50">
          <div className="mb-2">
            <label className="block font-semibold mb-1" htmlFor={`section-key-${section.id}`}>Schlüssel</label>
            <input
              id={`section-key-${section.id}`}
              type="text"
              value={section.key}
              onChange={e => handleSectionChange(idx, "key", e.target.value)}
              placeholder="z.B. impressum, kontakt"
              className="border rounded px-2 py-1 w-full mb-2"
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold mb-1" htmlFor={`section-heading-${section.id}`}>Überschrift</label>
            <input
              id={`section-heading-${section.id}`}
              type="text"
              value={section.heading}
              onChange={e => handleSectionChange(idx, "heading", e.target.value)}
              placeholder="z.B. Angaben gemäß § 5 TMG"
              className="border rounded px-2 py-1 w-full mb-2"
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold mb-1" htmlFor={`section-text-${section.id}`}>Text</label>
            <textarea
              id={`section-text-${section.id}`}
              value={section.text}
              onChange={e => handleSectionChange(idx, "text", e.target.value)}
              placeholder="Abschnittstext hier eingeben"
              className="w-full border rounded px-2 py-1"
              rows={3}
            />
          </div>
          <button
            type="button"
            onClick={() => handleDeleteSection(idx)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 mt-2"
          >
            Abschnitt löschen
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddSection}
        className="bg-green-700 text-white px-4 py-2 rounded font-semibold hover:bg-green-800"
      >
        Neuen Abschnitt hinzufügen
      </button>
    </div>
  );
}