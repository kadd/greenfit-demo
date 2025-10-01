import { useState, useEffect } from "react";

import { Blog } from "@/types/blog";

import { fetchBlog } from "@/services/blog";


export function useBlog() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      setError(null);
      try {
        // Beispiel: Hole Blogs von einer API
        const data = await fetchBlog();
        setBlog(data);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return { blog, loading, error };
}