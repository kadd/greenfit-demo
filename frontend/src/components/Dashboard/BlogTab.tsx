import BlogEditor from "../ui/blog/BlogEditor";

export default function BlogTab({ blog, setBlog, handleSave, msg, router }) {
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
        Admin Blog
      </h1>
      <BlogEditor blog={blog} setBlog={setBlog} />
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