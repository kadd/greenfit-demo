import React from "react";

import { PrivacySection, Privacy } from "@/types/privacy";

import { useAuth } from "@/hooks/useAuth";
import { usePrivacy } from "@/hooks/usePrivacy";

type Props = {
  privacy: Privacy | null;
  setPrivacy: (privacy: Privacy | null) => void;
  loading: boolean;
  error: string | null;
  updateExistingPrivacy: (token: string, privacyData: Partial<Privacy>) => Promise<void>;
  createNewPrivacySection: (token: string, sectionData: PrivacySection) => Promise<void>;
  updateExistingPrivacySectionById: (token: string, sectionId: string, sectionData: Partial<PrivacySection>) => Promise<void>;
  deleteExistingPrivacySectionById: (token: string, sectionId: string) => Promise<void>;
};

export default function PrivacyEditor({ 
  privacy, 
  setPrivacy,
  loading,
  error,
  updateExistingPrivacy,
  createNewPrivacySection,
  updateExistingPrivacySectionById,
  deleteExistingPrivacySectionById,
 }: Props) {

  const { isAuthenticated } = useAuth();
  const [msg, setMsg] = React.useState<string | null>(null);

  if (!isAuthenticated) {
    return <p>Sie müssen angemeldet sein, um den Datenschutz zu bearbeiten.</p>;
  }

  if (!privacy) {
    return <p>Keine Datenschutz-Daten verfügbar.</p>;
  }

  const sections = privacy.sections || [];

  // Abschnitt bearbeiten
  const handleChange = (idx: number, field: keyof PrivacySection, value: string) => {
    const updated = sections.map((section, i) =>
      i === idx ? { ...section, [field]: value } : section
    );
    setPrivacy({ ...privacy, sections: updated });
  };

  const handleAdd = () => {
    setPrivacy({ ...privacy, sections: [...sections, { heading: "", text: "" }] });
  };

  const handleDelete = (idx: number) => {
    setPrivacy({ ...privacy, sections: sections.filter((_, i) => i !== idx) });
  };

  const handleSavePrivacy = async () => {
    if(!isAuthenticated) {
      alert("Sie müssen angemeldet sein, um die Änderungen zu speichern.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kein Authentifizierungs-Token gefunden. Bitte melden Sie sich erneut an.");
        return;
      }
      await updateExistingPrivacy(token, privacy);
      setMsg("Datenschutz erfolgreich aktualisiert.");
    } catch (err: any) {
      alert("Fehler beim Speichern des Datenschutzes: " + (err.message || "Unbekannter Fehler"));
    }
  };

  if (loading) {
    return <p>Datenschutz wird geladen...</p>;
  }

  if (error) {
    return <p>Fehler beim Laden des Datenschutzes: {error}</p>;
  }


  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Datenschutz-Abschnitte</h3>
      {privacy.sections.map((section, idx) => (
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
        onClick={handleSavePrivacy}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Änderungen speichern
      </button>
    </div>
  );
}