"use client";
import { useContentContext } from "@/contexts/contentContext";

export default function Blog() {
  const content = useContentContext();
  if (!content || !content.blog) {
    return <div className="p-6 text-center text-gray-500">Blog wird geladen...</div>;
  }
  const { title, description, items } = content.blog;
  return (
    <section className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">{title}</h1>
      <p className="text-gray-700 mb-8 text-center">{description}</p>
      <ul className="space-y-6">
        {items.map((item, idx) => (
          <li key={idx} className="bg-white rounded shadow p-6">
            <h2 className="font-semibold text-lg mb-2 text-green-800">{item.title}</h2>
            <div className="text-gray-500 text-sm mb-2">{new Date(item.date).toLocaleDateString()}</div>
            <p className="text-gray-700">{item.excerpt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}