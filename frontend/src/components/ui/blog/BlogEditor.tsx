import React, { useEffect} from "react";

import { Blog, BlogItem } from "@/types/blog";
import { useBlog } from "@/hooks/useBlog";
import { useAuth } from "@/hooks/useAuth";

interface BlogEditorProps {
  blog: Blog;
  setBlog: (blog: Blog) => void;
  loading: boolean;
  error: string | null;
  createNewPost: (token: string, post: BlogItem) => Promise<BlogItem | undefined>;
  updateExistingBlog: (token: string, blog: Blog) => Promise<Blog | undefined>;
  updateExistingPost: (token: string, id: string, post: Partial<BlogItem>) => Promise<BlogItem | undefined>;
  deleteExistingPost: (token: string, id: string) => Promise<void>;
  
}

export default function BlogEditor({ 
  blog, 
  setBlog, 
  loading, 
  error,
  createNewPost, 
  updateExistingBlog,
  updateExistingPost, 
  deleteExistingPost,
 
}: BlogEditorProps) {

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
      
 
      const token = localStorage.getItem("token");
      if (!token) {
        setMsg("Kein Auth-Token gefunden. Bitte einloggen.");
        return;
      }
      if (!blog.id) {
        setMsg("Blog ID fehlt.");
        return;
      }

      // Gesamten Blog aktualisieren
      await updateExistingBlog(token, { id: blog.id, title: blog.title, description: blog.description, items: blog.items } as Partial<Blog>);
    
      setMsg("✅ Blog gespeichert!");
    } catch (error) {
      setMsg("❌ Fehler beim Speichern");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Blog wird geladen...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">Fehler beim Laden des Blogs</div>;
  }

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