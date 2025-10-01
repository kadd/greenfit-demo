import React, { useEffect} from "react";

import { Blog, BlogItem } from "@/types/blog";
import { useBlog } from "@/hooks/useBlog";
import { useAuth } from "@/hooks/useAuth";

interface BlogEditorProps {
  blog: Blog;
  setBlog: (blog: Blog) => void;
  createNewPost: (post: BlogItem) => Promise<void>;
  updateExistingBlog: (blog: Blog) => Promise<void>;
  updateExistingPost: (id: string, post: Partial<BlogItem>) => Promise<void>;
  deleteExistingPost: (token: string, id: string) => Promise<void>;
  
}



export default function BlogEditor({ 
  blog, 
  setBlog, 
  createNewPost, 
  updateExistingBlog,
  updateExistingPost, 
  deleteExistingPost,
 
}: BlogEditorProps) {
  const { loading, error, 
      deleteExistingPostById, updateExistingPostById,
      addNewEmptyItemWithId, addNewEmptyItemWithoutId

   } = useBlog();

  const { isAuthenticated } = useAuth();
  const [msg, setMsg] = React.useState<string | null>(null);

  useEffect(() => {
    if (!blog.items) {
      setBlog({ ...blog, items: [] });
    }
  }, [blog, setBlog]);

  const handleAdd = () => {
    setBlog({
      ...blog,
      items: [
        ...(blog.items || []),
        { title: "", date: "", excerpt: "" } 
      ]
    });
  };

  // Item bearbeiten
  const handleChange = (idx: number, field: keyof BlogItem, value: string) => {
    const updated = blog.items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setBlog({ ...blog, items: updated });
  };

  // Item löschen (bestehende oder neue)
  const handleDelete = (idx: number) => {
    setBlog({ ...blog, items: blog.items.filter((_, i) => i !== idx) });
  };
  
  // Gesamten Blog speichern
  const handleSaveBlog = async () => {
    if (!isAuthenticated) {
      setMsg("Nicht authentifiziert. Bitte einloggen.");
      return;
    }
    try {
      await updateExistingBlog(blog);
      setMsg("✅ Blog gespeichert!");
    } catch (error) {
      setMsg("❌ Fehler beim Speichern");
    }
  };

  if (!blog || !blog.items) {
    return <div className="p-6 text-center text-gray-500">Keine Blogs gefunden</div>;
  }

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
          {item.id ? (
            <button
              type="button"
              onClick={() => handleDelete(idx)}
              className="mt-2 px-2 py-1 bg-red-600 text-white rounded"
            >
              Löschen
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleDelete(idx)}
              className="mt-2 px-2 py-1 bg-gray-300 text-gray-700 rounded"
              title="Feld entfernen"
            >
              &minus;
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Neuen Beitrag hinzufügen
      </button>
      <button
        type="button"
        onClick={handleSaveBlog}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Blog speichern
      </button>
      {msg && <div className="mt-4 text-center text-green-700">{msg}</div>}
    </div>
  );
}