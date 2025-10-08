import ContentForm from "../../ui/content/ContentForm";

export default function ContentTab({ content, setContent, handleSave, msg, router }) {
  return (
    <div>
      <button
        type="button"
        onClick={() => router.back()}
        className="self-start mb-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-300 transition text-white hover:text-gray-800"
      >
        ← Zurück
      </button>
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Admin Content
      </h1>
      <ContentForm content={content} setContent={setContent} onSubmit={handleSave} />
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}