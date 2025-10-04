"use client";
import { useBlog } from "@/hooks/useBlog";

import { BlogItem } from "@/types/blog";

export default function Blog() {
  const { blog, loading, error } = useBlog();
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Blog wird geladen...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">Fehler beim Laden des Blogs</div>;
  }
  if (!blog || blog.length === 0) {
    return <div className="p-6 text-center text-gray-500">Keine Blogs gefunden</div>;
  }
  const { title, description, items } = blog;
  return (
    <section className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">{title}</h1>
      <p className="text-gray-700 mb-8 text-center">{description}</p>
      <ul className="space-y-6">
        { items && items.length > 0 ? (
          items.filter(item => item.date || item.id).map((item, idx) => (
            <li key={idx} className="bg-white rounded shadow p-6">
              <h2 className="font-semibold text-lg mb-2 text-green-800">{item.title}</h2>
              <div className="text-gray-500 text-sm mb-2">{new Date(item.date).toLocaleDateString()}</div>
              <p className="text-gray-700">{item.excerpt}</p>
            </li>
          ))
        ) : (
          <li className="bg-white rounded shadow p-6">
            <p className="text-gray-500">Keine Blog-Artikel gefunden.</p>
          </li>
        )}
      </ul>
    </section>
  );
}