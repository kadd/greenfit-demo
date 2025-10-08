const API_URL = process.env.NEXT_PUBLIC_API_URL + "/services";

import React from "react";
import { UploadArea } from "@/types/uploadArea";
import { Service, ServiceData } from "@/types/service";

// Beispiel-Services, bitte anpassen!
import { 
  getServiceObjectService, 
  updateServiceObjectService, 
  deleteServiceObjectService,
  createServiceObjectService,
  uploadServiceItemImageService,
  deleteServiceItemImageService,
  createServiceContentService,
  updateServiceContentService,
  deleteServiceContentService
} from "@/services/services";


export function useServices(token: string = "") {
  const [services, setServices] = React.useState<ServiceData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Initial load of services data

  React.useEffect(() => {
    console.log("useEffect läuft");
    // Initial load of services data from a JSON file or API
    const fetchData = async () => {
      setLoading(true);
      const data = await getServiceObjectService(token);
      setServices(data || {});
      setLoading(false);
    };
    fetchData();
  }, []);


  // gesamtes Service-Objekt aktualisieren
    const updateService = async (data: ServiceData) => {
        setServices(data);
        try {
            await updateServiceObjectService(token, data);
        } catch (error) {
            console.error("Error updating services data:", error);
            throw error;
        } 
    };

    // gesamt Service-Objekt löschen
    const deleteService = async () => {
        setServices(null);
        try {
            await deleteServiceObjectService(token);
        } catch (error) {
            console.error("Error deleting services data:", error);
            throw error;
        } 
    };

    // neues Service-Objekt erstellen
    const createService = async (data: ServiceData) => {
        setServices(data);
        try {
            await createServiceObjectService(token, data);
        } catch (error) {
            console.error("Error creating services data:", error);
            throw error;
        } 
    };

    // Bild für ein spezifisches Service-Item hochladen
    const uploadServiceImage = async (serviceKey: string, file: File) => {
        if (!services) return;
        try {
            const updatedItem = await uploadServiceItemImageService(token, serviceKey, file);
            const updatedServices = {
                ...services,
                content: {
                    ...services.content,
                    [serviceKey]: updatedItem,
                },
            };
            setServices(updatedServices);
        } catch (error) {
            console.error("Error uploading service image:", error);
            throw error;
        }
    };

    // Bild für ein spezifisches Service-Item löschen
    const deleteServiceImage = async (serviceKey: string) => {
        if (!services) return;
        try {
            await deleteServiceItemImageService(token, serviceKey);
            const updatedItem = { ...services.content[serviceKey] };
            delete updatedItem.image; // Entferne das Bildfeld
            const updatedServices = {
                ...services,
                content: {
                    ...services.content,
                    [serviceKey]: updatedItem,
                },
            };
            setServices(updatedServices);
        } catch (error) {
            console.error("Error deleting service image:", error);
            throw error;
        }
    };

    // spezifische Content-Item eines bestehenden Service-Objekts erstellen
    const createServiceContent = async (contentKey: string, serviceDataForContentKey: Partial<Service>) => {
        if (!services) return;
        try {
            const newItem = await createServiceContentService(token, contentKey, serviceDataForContentKey);
            const updatedServices = {
                ...services,
                content: {
                    ...services.content,
                    [contentKey]: newItem,
                },
            };
            setServices(updatedServices);
        } catch (error) {
            console.error("Error creating service content:", error);
            throw error;
        }
    };

    // spezifische Content-Item eines bestehenden Service-Objekts aktualisieren
    const updateServiceContent = async (contentKey: string, updatedData: Partial<Service>) => {
        if (!services) return;
        const updatedServices = {
            ...services,
            content: {
                ...services.content,
                [contentKey]: {
                    ...services.content[contentKey],
                    ...updatedData,
                },
            },
        };
        setServices(updatedServices);
        try {
            await updateServiceContentService(token, contentKey, updatedData);
        } catch (error) {
            console.error("Error updating service content:", error);
            throw error;
        }
    };

    // spezifische Content-Item eines bestehenden Service-Objekts löschen
    const deleteServiceContent = async (contentKey: string) => {
        if (!services) return;
        try {
            await deleteServiceContentService(token, contentKey);
            const updatedContent = { ...services.content };
            delete updatedContent[contentKey]; // Entferne das Content-Item
            const updatedServices = {
                ...services,
                content: updatedContent,
            };
            setServices(updatedServices);
        } catch (error) {
            console.error("Error deleting service content:", error);
            throw error;
        }
    };

  return {
    services,
    loading,
    error,
    setServices,
    updateService,
    deleteService,
    createService,
    uploadServiceImage,
    deleteServiceImage,
    createServiceContent,
    updateServiceContent,
    deleteServiceContent
  };
}

// Hilfsfunktion zum Aktualisieren der gesamten Services-Daten
async function updateServicesDataService(token: string, data: ServiceData) {
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

// Hilfsfunktion zum Löschen der gesamten Services-Daten
async function deleteServicesDataService(token: string) {
  const res = await fetch(`${API_URL}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete services data");
  return res.json();
} 