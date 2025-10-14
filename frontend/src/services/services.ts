const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return `${base}/services`;
  }
  return "http://localhost:5001/api/services";
};

const API_URL = getApiUrl();

export async function getServiceObjectService(token?: string) {
  // ohne Token, wenn öffentlich zugänglich
  if (!token) {
    const res = await fetch(`${API_URL}`);
    if (!res.ok) throw new Error("Failed to fetch services data");
    return res.json();
  }
  const res = await fetch(`${API_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch services data");
  return res.json();
}

// neues Service-Objekt erstellen
export async function createServiceObjectService(token: string, data: any) {
  const res = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create services data");
  return res.json();
}

export async function updateServiceObjectService(token: string, data: any) {
  const res = await fetch(`${API_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update services data");
  return res.json();
}

export async function deleteServiceObjectService(token: string) {
  const res = await fetch(`${API_URL}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete services data");
  return res.json();
}

// create specific content-item of existing service object
export async function createServiceContentService(token: string, contentKey: string, serviceDataForContentKey: any) {
  const res = await fetch(`${API_URL}/create/${contentKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceDataForContentKey),
  });
  if (!res.ok) throw new Error("Failed to create service section");
  return res.json();
}


// update specific content-item of existing service object
export async function updateServiceContentService(token: string, contentKey: string, serviceDataForContentKey: any) {
  const res = await fetch(`${API_URL}/${contentKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceDataForContentKey),
  });
  if (!res.ok) throw new Error("Failed to update service section");
  return res.json();
}

// delete specific content-item of existing service object
export async function deleteServiceContentService(token: string, contentKey: string) {
  const res = await fetch(`${API_URL}/${contentKey}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete service section");
  return res.json();
} 


export async function uploadServiceItemImageService(token: string, contentKey: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("contentKey", contentKey);

  const res = await fetch(`${API_URL}/upload-image/${contentKey}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Image upload failed");
  return res.json();
}

export async function deleteServiceItemImageService(token: string, contentKey: string) {
  const res = await fetch(`${API_URL}/delete-image/${contentKey}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Image deletion failed");
  return res.json();
} 