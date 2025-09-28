const API_URL = process.env.NEXT_PUBLIC_API_URL+'/content' || "http://localhost:5001/api/content";

export async function getContentData(token?: string) {
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

