import { useState, useEffect } from "react";
import { Impressum, ImpressumSection } from "@/types/impressum";
import {
  fetchImpressumService,
  createImpressumService,
  updateImpressumService,
  deleteImpressumService,
} from "@/services/impressum";

export function useImpressum() {
  const [impressum, setImpressum] = useState<Impressum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImpressumFnc() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchImpressumService();
        setImpressum(data);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchImpressumFnc();
  }, []);

  // Impressum erstellen
  const createImpressum = async (newImpressum: Impressum) => {
    const createdImpressum = await createImpressumService(newImpressum);
    setImpressum(createdImpressum);
  };

  // Impressum aktualisieren
  const updateImpressum = async (updatedImpressum: Impressum) => {
    const data = await updateImpressumService(updatedImpressum);
    setImpressum(data);
  };

  // Impressum löschen
  const deleteImpressum = async () => {
    await deleteImpressumService();
    setImpressum(null);
  };

  // Section aktualisieren
  const updateSection = (key: string, updatedSection: Partial<ImpressumSection>) => {
    if (!impressum) return;
    const updatedSections = impressum.sections.map(section =>
      section.key === key ? { ...section, ...updatedSection } : section
    );
    setImpressum({ ...impressum, sections: updatedSections });
  };

  // Section erstellen
  const createSection = (newSection: ImpressumSection) => {
    if (!impressum) return;
    const updatedSections = [...impressum.sections, newSection];
    setImpressum({ ...impressum, sections: updatedSections });
  };

  // Section löschen
  const deleteSection = (key: string) => {
    if (!impressum) return;
    const updatedSections = impressum.sections.filter(section => section.key !== key);
    setImpressum({ ...impressum, sections: updatedSections });
  };

  return {
    impressum,
    loading,
    error,
    setImpressum,
    createImpressum,
    updateImpressum,
    deleteImpressum,
    updateSection,
    createSection,
    deleteSection,
  };
}