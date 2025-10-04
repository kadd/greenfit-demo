import { useState, useEffect, use } from "react";

import { Blog, BlogItem } from "@/types/blog";

import { fetchBlog, createBlog, deleteBlog, 
  updateBlog, createPost, fetchSinglePostById, 
  deletePostById, updatePostById, uploadPostImage, deletePostImage
 } from "@/services/blog";


export function useBlog() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
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

  
  // Funktionen für Blog-Operationen

  // Funktion zum Erstellen eines neuen Blogposts
  // Funktion zum Aktualisieren eines bestehenden Blogposts
  // Funktion zum Löschen eines bestehenden Blogposts
  // Funktion zum Aktualisieren des gesamten Blogs
  // Funktion zum Hinzufügen eines neuen leeren Items mit ID
  // Funktion zum Hinzufügen eines neuen leeren Items ohne ID
  // Funktion zum Löschen eines bestehenden Posts anhand der ID
  // Funktion zum Aktualisieren eines bestehenden Posts anhand der ID

  const createNewBlog = async (token: string, blogData: Blog) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createBlog(token, blogData);
      setBlog(data); // Setze das gesamte Blog-Objekt
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

   const updateExistingBlog = async (token: string, blog: Partial<Blog>) => {
    setLoading(true);
    setError(null);
    try {
        const data = await updateBlog(token, blog);
        setBlog(data); // <--- Einfach das neue Blog-Objekt setzen!
        setLoading(false);
        return data;
    } catch (err: any) {
        setError(err.message || "Unbekannter Fehler");
    } finally {
        setLoading(false);
    }
  };

  const deleteExistingBlog = async (token: string, blogId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteBlog(token, blogId);
      setBlog(null); // Blog wurde gelöscht
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const createNewPost = async (token: string, post: BlogItem) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createPost(token, post);
      setBlog(prev => prev ? { ...prev, items: [...prev.items, data] } : { isPage: true, title: '', description: '', items: [data] });
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const updateExistingPost = async (token: string, id: string, post: Partial<Blog>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updatePostById(token, id, post);
      setBlog(prev => prev ? { ...prev, items: prev.items.map(p => p.id === id ? data : p) } : null);
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingPost = async (token: string, id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deletePostById(token, id); // Erfolgreich gelöscht
      setBlog(prev => prev ? { ...prev, items: prev.items.filter(p => p.id !== id) } : null);
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

 

    const deleteExistingPostById = async (token: string, postId: string) => {
        if (!blog) return;
        try {
            const updatedBlog = await deletePostById(token, blog, postId);
            setBlog(updatedBlog);
        } catch (err: any) {
            setError(err.message || "Unbekannter Fehler");
        }
    };

    const updateExistingPostById = async (postId: string, postData: Partial<Blog>) => {
        if (!blog) return;
        try {
            const updatedBlog = await updatePostById(blog, postId, postData);
            setBlog(updatedBlog);
        } catch (err: any) {
            setError(err.message || "Unbekannter Fehler");
        }
    };

  return { 
    blog, 
    setBlog,
    loading, 
    error, 
    createNewBlog, 
    deleteExistingBlog,
    createNewPost, 
    updateExistingPost, 
    deleteExistingPost, 
    updateExistingBlog, 
    deleteExistingPostById, 
    updateExistingPostById };
  };
