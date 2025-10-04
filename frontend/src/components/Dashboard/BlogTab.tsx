import React from "react";
import BlogEditor from "../ui/blog/BlogEditor";

import { Blog } from "@/types/blog";
import { useBlog } from "@/hooks/useBlog";

export default function BlogTab({  router }) {

  const { loading, error, blog,  setBlog ,
    createNewPost,
    updateExistingBlog,
    updateExistingPost, 
    deleteExistingPost } = useBlog();
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (blog ) {
        setBlog(blog);
    }
    }, [blog]);

  if (error) {
    return <p>Fehler beim Laden des Blogs: {error}</p>;
  }

  if (loading) {
    return <p>Blog wird geladen...</p>;
  }

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
        loading={loading}
        error={error}
        updateExistingBlog={updateExistingBlog}
        createNewPost={createNewPost} 
        updateExistingPost={updateExistingPost} 
        deleteExistingPost={deleteExistingPost} 
      />
  
    </div>
  );
}