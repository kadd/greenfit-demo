const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/blog'
  : "http://localhost:5001/api/blog";

export async function fetchBlog() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Fehler beim Laden des Blogs");
    return await res.json(); // Blog
  } catch (err) {
    throw new Error("Fehler beim Laden des Blogs");
  }
}   