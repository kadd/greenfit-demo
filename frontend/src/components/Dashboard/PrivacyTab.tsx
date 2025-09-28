import PrivacyEditor from "@/components/ui/privacy/PrivacyEditor";

export default function PrivacyTab({ content, setContent, handleSave, msg }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-4">Datenschutz verwalten</h2>
      <form onSubmit={handleSave}>
        <PrivacyEditor
            sections={content.privacyLong.sections}
            setSections={newSections => setContent(prev => ({
              ...prev,
              privacyLong: { ...prev.privacyLong, sections: newSections }
            }))} />
        <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">
          Datenschutz speichern
        </button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </section>
  );
}
