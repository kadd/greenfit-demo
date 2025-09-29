import FAQEditor from "../ui/faq/FAQEditor";


export default function FaqTab({ faq, setFaq, handleSave, msg, router }) {
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
        Admin FAQ
      </h1>
      <FAQEditor faq={faq} setFaq={setFaq} />
      <button
        type="button"
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-300 transition text-white hover:text-blue-800"
      >
        Speichern
      </button>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}