import { NavigationData } from "@/types/navigation";

// Noch defensiver:
const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return `${base}/navigation`;
  }
  return "http://localhost:5001/api/navigation";
};

const API_URL = getApiUrl();

export const fetchNavigationService = async (): Promise<NavigationData> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Fehler beim Laden der Navigationsdaten: ${response.status}`);
  }
  return response.json();
};

export const updateNavigationService = async (navigationData: NavigationData): Promise<NavigationData> => {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(navigationData),
  });
  if (!response.ok) {
    throw new Error(`Fehler beim Aktualisieren der Navigationsdaten: ${response.status}`);
  }
  return response.json();
};