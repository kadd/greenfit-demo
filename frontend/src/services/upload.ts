
const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return `${base}/upload`;
  }
  return "http://localhost:5001/api/upload";
};

const API_URL = getApiUrl();

// Daten für unauthentifizierte Nutzer abrufen
export async function fetchPublicGallery() {
  const res = await fetch(`${API_URL}/public_gallery`);
  if (!res.ok) throw new Error("Failed to fetch public gallery");
  return res.json();
}

// Datei-Upload single file ohne Bereich
export async function uploadFile(token: string, formData: FormData) {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload file");
  return res.json();
}

// Datei-Upload to specific area
export async function uploadFileToArea(token: string, area: string, formData: FormData) {
  const res = await fetch(`${API_URL}/${area}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error(`Failed to upload file to area ${area}`);
  return res.json();
}

export async function deleteFile(token: string, filename: string) {
  const res = await fetch(`${API_URL}/${filename}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete file");
  return res.json();
}
export async function listAllFiles(token: string) {
  const res = await fetch(`${API_URL}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to list files");
  return res.json();
}

export async function listFilesByArea(token: string, area: string) {
  const res = await fetch(`${API_URL}/list/${area}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to list files for area ${area}`);
  return res.json();
}

export async function getFileUrl(token: string, filename: string) {
  // Assuming the API provides a way to get a file URL
  return `${API_URL}/files/${filename}?token=${token}`;
}

export async function getAreas(token: string) {
  const res = await fetch(`${API_URL}/areas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get upload areas");
  return res.json();
}