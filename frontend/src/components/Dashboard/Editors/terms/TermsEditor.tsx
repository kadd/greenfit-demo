import React from "react";

import { Terms, TermsSection } from "@/types/terms";
import { useAuth } from "@/hooks/useAuth";
import { setFlagsFromString } from "v8";

type Props = {
  terms: Terms;
  setTerms: (terms: Terms) => void;
  loading: boolean;
  error: string | null;
  updateExistingTerms: (token: string, termsData: Partial<Terms>) => Promise<Terms | undefined>;
  createNewTermsSection: (token: string, sectionData: TermsSection) => Promise<TermsSection | undefined>;
  updateExistingTermsSectionById: (token: string, id: string, sectionData: Partial<TermsSection>) => Promise<TermsSection | undefined>;
  deleteExistingTermsSectionById: (token: string, id: string) => Promise<boolean>;
};

export default function TermsEditor({ 
  terms, 
  setTerms, 
  loading, 
  error,
  updateExistingTerms,
  createNewTermsSection,
  updateExistingTermsSectionById,
  deleteExistingTermsSectionById,
 }: Props) {

  const { isAuthenticated } = useAuth();
  const [msg, setMsg] = React.useState<string | null>(null);

  if (!isAuthenticated) {
    return <p>Sie müssen angemeldet sein, um die AGB zu bearbeiten.</p>;
  }

  // Abschnitt bearbeiten
  const handleChange = (idx: number, field: keyof TermsSection, value: string) => {
    const updated = terms.sections.map((section, i) =>
      i === idx ? { ...section, [field]: value } : section
    );
    setTerms({ ...terms, sections: updated });
  };

  const handleAdd = () => {
    setTerms({ ...terms, sections: [...terms.sections, { heading: "", text: "" }] });
  };

  const handleDelete = (idx: number) => {
    setTerms({ ...terms, sections: terms.sections.filter((_, i) => i !== idx) });
  };

  const handleSaveTerms = async () => {
    if(!isAuthenticated) {
      alert("Sie müssen angemeldet sein, um die AGB zu speichern.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMsg("Kein Auth-Token gefunden! Bitte einloggen.");
        return;
      }
      
      if (!terms.id) {
        alert("Keine AGB-ID gefunden. Bitte erstellen Sie zuerst eine neue AGB.");
        return;
      }

      // AGB speichern
      const updated = await updateExistingTerms(token, { id: terms.id, sections: terms.sections, title: terms.title, isPage: terms.isPage, updatedAt: new Date() } as Partial<Terms>);
      if (updated) {
        setTerms(updated);
        setMsg("✅ AGB gespeichert!");
      } else {
        setMsg("❌ Fehler beim Speichern der AGB.");
      }
    } catch (error) {
      console.error("Fehler beim Speichern der AGB:", error);
      setMsg("❌ Fehler beim Speichern der AGB.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Lade AGB...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Fehler: {error}</p>;
  }

  if (!terms || !terms.sections) {
    return <p className="text-center text-gray-500">Keine AGB zum Bearbeiten gefunden.</p>;
  }

  return (
    <div>
      {msg && <div className="mb-4 text-center text-sm text-gray-700">{msg}</div>}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">AGB Titel</label>
        <input
          type="text"
          value={terms.title}
          onChange={e => setTerms({ ...terms, title: e.target.value })}
          placeholder="Titel der AGB"
          className="w-full border rounded p-2"
        />
      </div>
     
      <h3 className="text-lg font-semibold mb-2">AGB-Abschnitte</h3>
      {terms.sections.map((section, idx) => (
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
       <button
        type="button"
        onClick={handleSaveTerms}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        AGB speichern
      </button>
    </div>
  );
}