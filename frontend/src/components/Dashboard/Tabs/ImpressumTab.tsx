import ImpressumEditor from "@/components/Dashboard/Editors/impressum/ImpressumEditor";
import { useState } from "react";
import { useImpressum } from "@/hooks/useImpressum";

export default function ImpressumTab() {
  const {
    impressum,
    loading,
    error,
    updateImpressum,
    createImpressum,
    deleteImpressum,
    setImpressum,
  } = useImpressum();

  const [msg, setMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!impressum) {
      setMsg("Kein Impressum zum Speichern vorhanden.");
      return;
    }
    try {
      await updateImpressum(impressum);
      setMsg("Impressum erfolgreich gespeichert.");
    } catch (err) {
      setMsg("Fehler beim Speichern des Impressums.");
    }
  };

  if (loading) return <p>Lade Impressum...</p>;
  if (error) return <p className="text-red-600">Fehler: {error}</p>;
  if (!impressum) return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-4">Impressum verwalten</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        onClick={async () => {
          await createImpressum({
            isPage: true,
            title: "",
            description: "",
            company: "",
            address: "",
            email: "",
            phone: "",
            sections: [],
          });
          setMsg("Impressum erstellt.");
        }}
      >
        Neues Impressum erstellen
      </button>
      {msg && <p className="mt-4">{msg}</p>}
    </section>
  );

  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-4">Impressum verwalten</h2>
      <form onSubmit={handleSave}>
        <ImpressumEditor
          impressum={impressum}
          setImpressum={setImpressum}
        />
        <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">
          Impressum speichern
        </button>
        <button
          type="button"
          className="mt-4 ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
          onClick={async () => {
            await deleteImpressum();
            setMsg("Impressum gelöscht.");
          }}
        >
          Impressum löschen
        </button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </section>
  );
}