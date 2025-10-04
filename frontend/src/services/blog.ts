import { Blog, BlogItem } from "../types/blog";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/blog'
  : "http://localhost:5001/api/blog";


// Fetch all blog data
export async function fetchBlog() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Fehler beim Laden des Blogs");
    return await res.json(); // Blog
  } catch (err) {
    throw new Error("Fehler beim Laden des Blogs");
  }
}   

//create empty blog
export async function createBlog(token: string) {
  const res = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: "Neuer Blog", description: "Beschreibung", items: [] }),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen des Blogs");
  return res.json();
}

//delete entire blog
export async function deleteBlog(token: string) {
  const res = await fetch(`${API_URL}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Fehler beim Löschen des Blogs");
  return res.json();
}

// update entire blog
export async function updateBlog(token: string, blog: Partial<Blog>) {
  // Zeit messen
  
   const res = await fetch(`${API_URL}`, {
       method: "PUT",
       headers: {
       "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blog),
    });
      
    if (!res.ok) {
      console.log('Response status:', res.status);
      console.log('Response status text:', res.statusText);
      throw new Error("Failed to update blog");
    }
    return res.json();
}

// Weitere Blog-bezogene Dienste können hier hinzugefügt werden
// z.B. fetchSinglePost, createPost, updatePost, deletePost etc.
// Diese Funktionen sollten entsprechende API-Endpunkte auf dem Backend ansprechen
// und können Authentifizierungstoken als Parameter akzeptieren, wenn nötig.    

// Create a new blog post
export async function createPost(token: string, postData: Partial<BlogItem>) {
  const res = await fetch(`${API_URL}/items/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen des Blogposts");
  return res.json();
}


// Fetch a single blog post by ID
export async function fetchSinglePostById(postId: string) {
  try {
    const res = await fetch(`${API_URL}/items/${postId}`);
    if (!res.ok) throw new Error("Fehler beim Laden des Blogposts");
    return await res.json(); // BlogPost
  } catch (err) {
    throw new Error("Fehler beim Laden des Blogposts");
  }
}

// delete a blog post by ID
export async function deletePostById(token: string, postId: string) {
  const res = await fetch(`${API_URL}/items/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Fehler beim Löschen des Blogposts");
  return res.json();
}

export async function updatePostById(token: string, postId: string, postData: Partial<BlogItem>) {
    const res = await fetch(`${API_URL}/items/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error("Failed to update post");
    return res.json();
}

export async function uploadPostImage(token: string, postId: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/upload-image/${postId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Fehler beim Hochladen des Bildes");
  return res.json();
}

export async function deletePostImage(token: string, postId: string, imageId: string) { 
    const res = await fetch(`${API_URL}/delete-image/${postId}/${imageId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Fehler beim Löschen des Bildes");
  return res.json();
}







