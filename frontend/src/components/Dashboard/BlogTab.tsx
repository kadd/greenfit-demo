import React from "react";
import BlogEditor from "../ui/blog/BlogEditor";

import { Blog } from "@/types/blog";
import { useBlog } from "@/hooks/useBlog";

export default function BlogTab({  router }) {
 
  const { blog,  setBlog ,  
    createNewPost, 
    updateExistingBlog,
    updateExistingPost, 
    deleteExistingPost } = useBlog();
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (blog) {
        setBlog(blog);
    }
    }, [blog]);


  // Beispiel für das Speichern:
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");  
    try {
      if (!token) {
        router.push("/admin/login");
        return;
      }
      const result = await updateExistingBlog(token, blog.id, blog);
      if (result) {
        setMsg("✅ Blog gespeichert!");
      } else {
        setMsg("❌ Fehler beim Speichern");
      } 
    } catch (error) {
      setMsg("⚠️ Server nicht erreichbar");
    }
  };

  if (!blog) {
    return <p>Keine Blog-Daten verfügbar.</p>;
  }


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
      <BlogEditor 
        blog={blog} 
        setBlog={setBlog} 
        updateExistingBlog={updateExistingBlog}
        createNewPost={createNewPost} 
        updateExistingPost={updateExistingPost} 
        deleteExistingPost={deleteExistingPost} 
      />
  
    </div>
  );
}