import React from "react";

export default function BlogEditor({ blog, setBlog }) {
  const handleChange = (idx, field, value) => {
    const updated = blog.items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setBlog({ ...blog, items: updated });
  };

  const handleAdd = () => {
    setBlog({
      ...blog,
      items: [
        ...blog.items,
        { title: "", date: "", excerpt: "" }
      ]
    });
  };

  const handleDelete = (idx) => {
    setBlog({ ...blog, items: blog.items.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <input
        type="text"
        value={blog.title}
        onChange={e => setBlog({ ...blog, title: e.target.value })}
        placeholder="Blog Titel"
        className="mb-2 w-full border rounded p-2"
      />
      <textarea
        value={blog.description}
        onChange={e => setBlog({ ...blog, description: e.target.value })}
        placeholder="Blog Beschreibung"
        className="mb-4 w-full border rounded p-2"
        rows={2}
      />
      {blog.items.map((item, idx) => (
        <div key={idx} className="mb-4 border p-2 rounded">
          <input
            type="text"
            value={item.title}
            onChange={e => handleChange(idx, "title", e.target.value)}
            placeholder="Beitragstitel"
            className="mb-1 w-full border rounded p-2"
          />
          <input
            type="date"
            value={item.date}
            onChange={e => handleChange(idx, "date", e.target.value)}
            className="mb-1 w-full border rounded p-2"
          />
          <textarea
            value={item.excerpt}
            onChange={e => handleChange(idx, "excerpt", e.target.value)}
            placeholder="Kurztext"
            className="w-full border rounded p-2"
            rows={2}
          />
          <button
            type="button"
            onClick={() => handleDelete(idx)}
            className="mt-2 px-2 py-1 bg-red-600 text-white rounded"
          >
            Löschen
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Neuen Beitrag hinzufügen
      </button>
    </div>
  );
}