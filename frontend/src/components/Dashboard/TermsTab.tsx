import TermsEditor from "@/components/ui/terms/TermsEditor";

export default function TermsTab({ content, setContent, handleSave, msg }) {

  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-4">AGB verwalten</h2>
      <form onSubmit={handleSave}>
        <TermsEditor
          sections={content.termsLong.sections}
          setSections={newSections =>
            setContent(prev => ({
              ...prev,
              termsLong: { ...prev.termsLong, sections: newSections }
            }))
          }
        />
        <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">
          AGB speichern
        </button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </section>
  );
}