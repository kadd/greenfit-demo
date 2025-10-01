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

// Weitere Blog-bezogene Dienste können hier hinzugefügt werden
// z.B. fetchSinglePost, createPost, updatePost, deletePost etc.
// Diese Funktionen sollten entsprechende API-Endpunkte auf dem Backend ansprechen
// und können Authentifizierungstoken als Parameter akzeptieren, wenn nötig.    
export async function fetchSinglePost(postId: string) {
  try {
    const res = await fetch(`${API_URL}/${postId}`);
    if (!res.ok) throw new Error("Fehler beim Laden des Blogposts");
    return await res.json(); // BlogPost
  } catch (err) {
    throw new Error("Fehler beim Laden des Blogposts");
  }
}

export async function ceateBlog(token: string, blogData: any) {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(blogData),
  });
  if (!res.ok) throw new Error("Fehler beim Erstellen des Blogs");
  return res.json();
}

export async function createPost(token: string, postData: any) {
  const res = await fetch(`${API_URL}/add`, {
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

export async function updatePost(token: string, postId: string, postData: any) {
  const res = await fetch(`${API_URL}/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error("Fehler beim Aktualisieren des Blogposts");
  return res.json();
}

export async function deletePostById(token: string, postId: string) {
  const res = await fetch(`${API_URL}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Fehler beim Löschen des Blogposts");
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

export async function updateBlog(token: string, id: string, blog: any[]) {
    const res = await fetch(`${API_URL}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blog),
    });
    if (!res.ok) throw new Error("Failed to update blog");
    return res.json();
}

export async function updatePostById(token: string, postId: string, postData: any) {
    const res = await fetch(`${API_URL}/${postId}`, {
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



