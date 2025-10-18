import { useState, useEffect, use } from "react";

import { Blog, BlogPost } from "@/types/blog";

import {
  fetchBlogService,
  createBlogService,
  deleteBlogService,
  updateBlogService,
  createBlogPostService,
  fetchSingleBlogPostByIdService,
  deleteBlogPostByIdService,
  updateBlogPostByIdService,
  uploadBlogPostImageService,
  deleteBlogPostImageService
} from "@/services/blog";


export function useBlog() {
  const token = localStorage.getItem("token") || "";

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBlogService();
      setBlog(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
      return null;
    } finally {
      setLoading(false);
    }
  }

  
  // Funktionen für Blog-Operationen

  // Funktion zum Erstellen eines neuen Blogposts
  // Funktion zum Aktualisieren eines bestehenden Blogposts
  // Funktion zum Löschen eines bestehenden Blogposts
  // Funktion zum Aktualisieren des gesamten Blogs
  // Funktion zum Hinzufügen eines neuen leeren Items mit ID
  // Funktion zum Hinzufügen eines neuen leeren Items ohne ID
  // Funktion zum Löschen eines bestehenden Posts anhand der ID
  // Funktion zum Aktualisieren eines bestehenden Posts anhand der ID

  const createNewBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await createBlogService(token);
      setBlog(data); // Setze das gesamte Blog-Objekt
      return data;
    } catch (err: any) {
      setError(err.message || "Fehler beim Erstellen des Blogs");
      return null;
    } finally {
      setLoading(false);
    }
  }

   const updateExistingBlog = async (blog: Partial<Blog>) => {
    if(!token) {
      setError("Kein Auth-Token gefunden! Bitte einloggen.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
        const data = await updateBlogService(token, blog);
        setBlog(data); // <--- Einfach das neue Blog-Objekt setzen!
        setLastSaved(new Date());
        return data;
    } catch (err: any) {
        setError(err.message || "Fehler beim Aktualisieren des Blogs");
        return null;
    } finally {
        setSaving(false);
    }
  };

  const deleteExistingBlog = async () => {
    if(!token) {
      setError("Kein Auth-Token gefunden! Bitte einloggen.");
      return;
    }
    setLoading(true);
    setSaving(true);
    setError(null);
    try {
      await deleteBlogService(token);
      setBlog(null); // Blog wurde gelöscht
      setLastSaved(new Date());
    } catch (err: any) {
      setError(err.message || "Fehler beim Löschen des Blogs");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ============ Blog Post Operations ============

  const createNewBlogPostItem = async (post: BlogItem) => {
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
