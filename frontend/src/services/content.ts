const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return `${base}/content`;
  }
  return "http://localhost:5001/api/content";
};

const API_URL = getApiUrl();
export async function getContentData(token?: string) {
  // ohne Token, wenn öffentlich zugänglich
  if (!token) {
    const res = await fetch(`${API_URL}`);
    if (!res.ok) throw new Error("Failed to fetch content data");
    return res.json();
  }
  const res = await fetch(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch content data");
  return res.json();
}
export async function updateContentData(token: string, data: any) {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update content data");
  return res.json();
}

export async function updateTerms(token: string, terms: string) {
  const res = await fetch(`${API_URL}/terms`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ terms }),
  });
  if (!res.ok) throw new Error("Failed to update terms");
  return res.json();
}

export async function updatePrivacy(token: string, privacy: string) {
  const res = await fetch(`${API_URL}/privacy`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ privacy }),
  });
  if (!res.ok) throw new Error("Failed to update privacy policy");
  return res.json();
}

export async function updateFaq(token: string, faq: any[]) {
  const res = await fetch(`${API_URL}/faq`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ faq }),
  });
  if (!res.ok) throw new Error("Failed to update FAQ");
  return res.json();
}

export async function updateImpressum(token: string, impressum: string) {
  const res = await fetch(`${API_URL}/impressum`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ impressum }),
  });
  if (!res.ok) throw new Error("Failed to update impressum");
  return res.json();
}

export async function updateBlog(token: string, blog: any[]) {
  const res = await fetch(`${API_URL}/blog`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ blog }),
  });
  if (!res.ok) throw new Error("Failed to update blog");
  return res.json();
}



