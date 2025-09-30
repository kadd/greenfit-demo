const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL + '/services'
  : "http://localhost:5001/api/services";

export async function getServicesDataService(token?: string) {
  const res = await fetch(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch services data");
  return res.json();
}

export async function updateServicesDataService(token: string, data: any) {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update services data");
  return res.json();
}

export async function uploadServiceImageService(token: string, serviceKey: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("serviceKey", serviceKey);

  const res = await fetch(`${API_URL}/upload-image/${serviceKey}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Image upload failed");
  return res.json();
}