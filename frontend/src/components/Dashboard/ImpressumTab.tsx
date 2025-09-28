import ImpressumEditor from "@/components/ui/impressum/ImpressumEditor";

export default function ImpressumTab({ content, setContent, handleSave, msg }) {
  const sections = content.impressumLong?.sections ?? [];

  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-4">Impressum verwalten</h2>
      <form onSubmit={handleSave}>
        <ImpressumEditor
          sections={sections}
          setSections={newSections => setContent(prev => ({
            ...prev,
            impressumLong: { ...prev.impressumLong, sections: newSections }
          }))}
        />
        <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">
          Impressum speichern
        </button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </section>
  );
}