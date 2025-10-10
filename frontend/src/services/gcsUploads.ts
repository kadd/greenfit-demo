const API_URL = process.env.NEXT_PUBLIC_API_URL+'/gcs-upload' || "http://localhost:5000/api/gcs-upload";

export async function fetchPublicGalleryFromGCSService() {
  const res = await fetch(`${API_URL}/public_gallery`);
  if (!res.ok) throw new Error("Failed to fetch public gallery from GCS");
  return res.json();
}

export async function uploadTeammemberPhotoToGCSService(token: string, teamId: string, memberId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/upload-photo/${teamId}/${memberId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload team member photo to GCS");
  return res.json();
};

export async function uploadFileToGCSService(token: string, area: string, formData: FormData) {
  const res = await fetch(`${API_URL}/upload/${area}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error(`Failed to upload file to GCS area ${area}`);
  return res.json();
}

export async function deleteFileFromGCSService(token: string, filename: string) {
  const res = await fetch(`${API_URL}/delete/${filename}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete file from GCS");
  return res.json();
}

export async function listFilesInGCSService(token: string) {
  const res = await fetch(`${API_URL}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to list files in GCS");
  return res.json();
}

export async function getAreasService(token: string) {
  const res = await fetch(`${API_URL}/areas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get areas from GCS");
  return res.json();
}   

export async function createAreaService(token: string, area: string) {
  const res = await fetch(`${API_URL}/areas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ area }),
  });
  if (!res.ok) throw new Error("Failed to create area in GCS");
  return res.json();
}

export async function deleteAreaService(token: string, area: string) {
  const res = await fetch(`${API_URL}/areas/${area}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete area in GCS");
  return res.json();
}

// Weitere GCS-bezogene Dienste können hier hinzugefügt werden
// z.B. fetchPublicGallery, uploadFileToGCS, deleteFileFromGCS etc.
// Diese Funktionen sollten entsprechende API-Endpunkte auf dem Backend ansprechen
// und können Authentifizierungstoken als Parameter akzeptieren, wenn nötig.

export async function getGCSFileUrlService(token: string, filename: string) {
  // Assuming the API provides a way to get a file URL
  const res = await fetch(`${API_URL}/files/${filename}?token=${token}`);
  if (!res.ok) throw new Error("Failed to get file URL from GCS");
  return res.json();
}
