import { Blog, BlogItem } from "../types/blog";

const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return `${base}/blog`;
  }
  return "http://localhost:5001/api/blog";
};

const API_URL = getApiUrl();


// Fetch all blog data
export async function fetchBlogService() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Fehler beim Laden des Blogs");
    return await res.json(); // Blog
  } catch (err) {
    throw new Error("Fehler beim Laden des Blogs");
  }
}   

//create empty blog
export async function createBlogService(token: string) {
  try {
    const res = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title: "Neuer Blog", description: "Beschreibung", items: [] }),
    });
    if (!res.ok) throw new Error("Fehler beim Erstellen des Blogs");
    return await res.json();
  } catch (err) {
    throw new Error("Fehler beim Erstellen des Blogs");
  }
}

//delete entire blog
export async function deleteBlogService(token: string) {
  try {
    const res = await fetch(`${API_URL}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Fehler beim Löschen des Blogs");
    return await res.json();
  } catch (err) {
    throw new Error("Fehler beim Löschen des Blogs");
  }
}

// update entire blog
export async function updateBlogService(token: string, blog: Partial<Blog>) {
 try {
   const res = await fetch(`${API_URL}`, {
       method: "PUT",
       headers: {
         "Content-Type": "application/json",
         'Authorization': `Bearer ${token}`,
       },
       body: JSON.stringify(blog),
     });

    if (!res.ok) {
      console.log('Response status:', res.status);
      console.log('Response status text:', res.statusText);
      throw new Error("Fehler beim Aktualisieren des Blogs");
    }
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Aktualisieren des Blogs");
  }
}

// Weitere Blog-bezogene Dienste können hier hinzugefügt werden
// z.B. fetchSinglePost, createPost, updatePost, deletePost etc.
// Diese Funktionen sollten entsprechende API-Endpunkte auf dem Backend ansprechen
// und können Authentifizierungstoken als Parameter akzeptieren, wenn nötig.    

// Create a new blog post
export async function createBlogPostService(token: string, postData: Partial<BlogItem>) {
  try {
    const res = await fetch(`${API_URL}/item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error("Fehler beim Erstellen des Blogposts");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Erstellen des Blogposts");
  }
}


// Fetch a single blog post by ID
export async function fetchSingleBlogPostByIdService(postId: string) {
  try {
    const res = await fetch(`${API_URL}/items/${postId}`);
    if (!res.ok) throw new Error("Fehler beim Laden des Blogposts");
    return await res.json(); // BlogPost
  } catch (err) {
    throw new Error("Fehler beim Laden des Blogposts");
  }
}

// delete a blog post by ID
export async function deleteBlogPostByIdService(token: string, postId: string) {
  try {
    const res = await fetch(`${API_URL}/items/${postId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Fehler beim Löschen des Blogposts");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Löschen des Blogposts");
  }
}


// update a blog post by ID
export async function updateBlogPostByIdService(token: string, postId: string, postData: Partial<BlogItem>) {
  try {
    const res = await fetch(`${API_URL}/items/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error("Fehler beim Aktualisieren des Blogposts");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Aktualisieren des Blogposts");
  }
}

// reset blog service - deletes all posts
export async function resetBlogService(token: string) {
  try {
    const res = await fetch(`${API_URL}/reset`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Fehler beim Zurücksetzen des Blogs");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Zurücksetzen des Blogs");
  }
}   

// upload image for a blog post
export async function uploadBlogPostImageService(token: string, postId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_URL}/upload-image/${postId}`, {
      method: "POST",
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Fehler beim Hochladen des Bildes");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Hochladen des Bildes");
  }
}


// delete image from a blog post
export async function deleteBlogPostImageService(token: string, postId: string, imageId: string) {
  try {
    const res = await fetch(`${API_URL}/delete-image/${postId}/${imageId}`, {
    method: "DELETE",
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Fehler beim Löschen des Bildes");
  return res.json();
  } catch (err) {
    throw new Error("Fehler beim Löschen des Bildes");
  }
} 

// reorder blog posts
export async function reorderBlogPostsService(token: string, newOrder: string[]) {
  try {
    const res = await fetch(`${API_URL}/reorder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ order: newOrder }),
    });
    if (!res.ok) throw new Error("Fehler beim Neuordnen der Blogposts");
    return res.json();
  } catch (err) {
    throw new Error("Fehler beim Neuordnen der Blogposts");
  }
}

// Weitere Blog-bezogene Dienste können hier hinzugefügt werden
// z.B. fetchSinglePost, createPost, updatePost, deletePost etc.
// Diese Funktionen sollten entsprechende API-Endpunkte auf dem Backend ansprechen
// und können Authentifizierungstoken als Parameter akzeptieren, wenn nötig.



