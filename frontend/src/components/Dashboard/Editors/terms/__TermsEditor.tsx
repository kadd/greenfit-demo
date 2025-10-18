import React from "react";
import { Terms, TermsSection } from "@/types/terms";


interface TermsEditorProps {
  terms: Terms;
  loading: boolean;
  saving: boolean;
  error: string | null;

  updateTerms: (termsData: Partial<Terms>) => Promise<Terms | null>;
  createSection: (heading: string, text: string) => Promise<TermsSection | null>;
  updateSection: (sectionId: string, sectionData: Partial<TermsSection>) => Promise<TermsSection | null>;
  deleteSection: (sectionId: string) => Promise<boolean>;
  reorderSections: (newOrderIds: string[]) => Promise<TermsSection[] | null>;
  validateTerms: () => { valid: boolean; errors: string[] };
  searchSections: (query: string) => TermsSection[];
  // callbacks
  onError: (error: string) => void;
  onSuccess: (message: string) => void;

  // Alte Namen --- IGNORE ---
  updateExistingTerms: (termsData: Partial<Terms>) => Promise<Terms | null>;
  createNewTermsSection: (heading: string, text: string) => Promise<TermsSection | null>;
  updateExistingTermsSectionById: (sectionId: string, sectionData: Partial<TermsSection>) => Promise<TermsSection | null>;
  deleteExistingTermsSectionById: (id: string) => Promise<boolean>;
};

export default function TermsEditor({ 
  terms, 
  loading, 
  saving, 
  error, 
  updateExistingTerms,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
  validateTerms,
  searchSections,
  onError,
  onSuccess
 }: TermsEditorProps) {


  const [editForm, setEditForm] = React.useState<Terms>(terms);
  const [query, setQuery] = React.useState<string>("");
  const [isDragMode, setIsDragMode] = React.useState<boolean>(false);
  const [expandedSections, setExpandedSections] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    setEditForm(terms);
  }, [terms]);

  // ==================== SECTION OPERATIONS ====================

  const handleTitleChange = (title: string) => {
    setEditForm({ ...editForm, title });
  }

  const handleDescriptionChange = (description: string) => {
    setEditForm({ ...editForm, description });
  }

  const handleSectionChange = (sectionId: string, field: keyof TermsSection, value: string) => {
    const updatedSections = editForm.sections.map(section =>
      section.id === sectionId ? { ...section, [field]: value } : section
    );
    setEditForm({ ...editForm, sections: updatedSections });
  }

  const handleAddSection = async () => {
    try {
      const newSection = await createSection("Neue Überschrift", "Neuer Text");
      if (newSection) {
        onSuccess("✅ Neuer Abschnitt hinzugefügt!");
      }
    } catch (error) {
      onError("❌ Fehler beim Hinzufügen des Abschnitts.");
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