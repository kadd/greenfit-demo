const API_URL = process.env.NEXT_PUBLIC_API_URL+'/impressum' || "http://localhost:3000/impressum";

import { Impressum, ImpressumSection } from "@/types/impressum";

export async function fetchImpressumService(): Promise<Impressum> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Fehler beim Laden des Impressums");
  }
  return response.json();
}

export async function createImpressumService(impressum: Impressum): Promise<Impressum | null> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Nicht authentifiziert");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(impressum)
  });

  if (!response.ok) {
    throw new Error("Fehler beim Erstellen des Impressums");
  }

  return response.json();
}

export async function deleteImpressumService(): Promise<boolean> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Nicht authentifiziert");
  }

  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Fehler beim Löschen des Impressums");
  }

  return true;
}

export async function updateImpressumService(impressum: Impressum): Promise<Impressum | null> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Nicht authentifiziert");
  }

  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ impressumLong })
  });

  if (!response.ok) {
    throw new Error("Fehler beim Aktualisieren des Impressums");
  }

  return response.json();
}

export async function deleteImpressumSectionService(key: string): Promise<boolean> {    
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Nicht authentifiziert");
  }

  const response = await fetch(`${API_URL}/sections/${key}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Fehler beim Löschen der Sektion");
  }

  return true;
}

export async function createSectionService(section: ImpressumSection): Promise<ImpressumSection | null> {    
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Nicht authentifiziert");
  }

  const response = await fetch(`${API_URL}/sections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(section)
  });

  if (!response.ok) {
    throw new Error("Fehler beim Erstellen der Sektion");
  }

  return response.json();
}

export async function updateSectionService(key: string, section: Partial<ImpressumSection>): Promise<ImpressumSection | null> {    
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Nicht authentifiziert");
  }

  const response = await fetch(`${API_URL}/sections/${key}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(section)
  });

  if (!response.ok) {
    throw new Error("Fehler beim Aktualisieren der Sektion");
  }

  return response.json();
} 

export async function deleteSectionService(key: string): Promise<boolean> {    
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Nicht authentifiziert");
  }

  const response = await fetch(`${API_URL}/sections/${key}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Fehler beim Löschen der Sektion");
  }

  return true;
} 

export async function getImpressumContactService(): Promise<ImpressumSection | null> {
  const response = await fetch(`${API_URL}/contact`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Kontakt-Sektion");
  }
  return response.json();
} 

export async function getImpressumCompanyInfoService(): Promise<ImpressumSection | null> {
  const response = await fetch(`${API_URL}/company-info`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Firmen-Sektion");
  }
  return response.json();
}

export async function getImpressumUmsatzsteuerService(): Promise<ImpressumSection | null> {
  const response = await fetch(`${API_URL}/umsatzsteuer`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Umsatzsteuer-Sektion");
  }
  return response.json();
} 

export async function getImpressumLegalNoticeService(): Promise<ImpressumSection | null> {
  const response = await fetch(`${API_URL}/legal-notice`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Impressum-Sektion");
  }
  return response.json();
}

export async function getImpressumContentResponsibleService(): Promise<ImpressumSection | null> {
  const response = await fetch(`${API_URL}/content-responsible`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Inhalte-Sektion");
  }
  return response.json();
}

export async function getImpressumAllSectionsService(): Promise<ImpressumSection[]> {
  const response = await fetch(`${API_URL}/sections`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Sektionen");
  }
  return response.json();
}

export async function getImpressumSectionByIdService(id: string): Promise<ImpressumSection | null> {
  const response = await fetch(`${API_URL}/sections/id/${id}`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Sektion");
  }
  return response.json();
}

export async function getImpressumSectionByKeyService(key: string): Promise<ImpressumSection | null> {
  const response = await fetch(`${API_URL}/sections/${key}`);
  if (!response.ok) {
    throw new Error("Fehler beim Laden der Sektion");
  }
  return response.json();
}

