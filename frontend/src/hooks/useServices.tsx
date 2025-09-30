import React from "react";
import { UploadArea } from "@/types/uploadArea";

// Beispiel-Services, bitte anpassen!
 import { getServicesDataService, 
    updateServicesDataService, 
    uploadServiceImageService } from "@/services/services";
import { get } from "http";

export function useServices() {
  const [services, setServices] = React.useState({});

  React.useEffect(() => {
    console.log("useEffect läuft");
    // Initial load of services data from a JSON file or API
    const fetchData = async () => {
      const data = await getServicesDataService("");
      setServices(data || {});
    };
    fetchData();
  }, []);

  const updateService = (key: string, updatedService: { title: string; description: string; image?: string }) => {
    // Update the service in state
    setServices((prevServices) => ({
      ...prevServices,
      [key]: updatedService,
    }));
    // Optionally, send the updated services data to the backend
    const updatedServices = {
      ...services,
      [key]: updatedService,
    };
    updateServicesDataService("", { services: updatedServices }).catch((error) =>
      console.error("Error updating services:", error)
    );
    // Aktualisiere den lokalen Zustand sofort  
    setServices((prevServices) => ({
      ...prevServices,
      [key]: updatedService,
    }));
  };

  const uploadImage = async (serviceKey: string, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("serviceKey", serviceKey);

    try {
        const data = await uploadServiceImageService("", serviceKey, file);
      // Assuming the response contains the URL of the uploaded image
      const imageUrl = data.imageUrl;
      // Update the service with the new image URL
      setServices((prevServices) => ({
        ...prevServices,
        [serviceKey]: {
          ...prevServices[serviceKey],
          image: imageUrl,
        },
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  return { services, updateService, uploadImage };
}