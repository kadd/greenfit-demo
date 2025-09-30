import React from "react";
import { UploadArea } from "@/types/uploadArea";

// Beispiel-Services, bitte anpassen!
 import { getServicesDataService, 
    updateServicesDataService, 
    uploadServiceImageService } from "@/services/services";
import { get } from "http";

export function useServices() {
  const [services, setServices] = React.useState({});
    const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    console.log("useEffect läuft");
    // Initial load of services data from a JSON file or API
    const fetchData = async () => {
      setLoading(true);
      const data = await getServicesDataService("");
      setServices(data || {});
      setLoading(false);
    };
    fetchData();
  }, []);

//   const updateService = (key: string, updatedService: { title: string; description: string; image?: string }) => {
//     // Update the service in state
//     setServices((prevServices) => ({
//       ...prevServices,
//       [key]: updatedService,
//     }));
//     // Optionally, send the updated services data to the backend
//     const updatedServices = {
//       ...services,
//       [key]: updatedService,
//     };
//     updateServicesDataService("", { services: updatedServices }).catch((error) =>
//       console.error("Error updating services:", error)
//     );
//     // Aktualisiere den lokalen Zustand sofort  
//     setServices((prevServices) => ({
//       ...prevServices,
//       [key]: updatedService,
//     }));
//   };

  
    const updateService = (key, newData) => {
    // Neuer Service-Stand
    const updatedServices = {
        ...services,
        content: {
        ...services.content,
        [key]: {
            ...services.content[key],
            ...newData,
        },
        },
    };

    // Lokalen State aktualisieren
    setServices(updatedServices);

    // Backend-Update mit dem neuen Wert
    updateServicesDataService("", updatedServices)
        .catch((error) => console.error("Error updating services:", error));
    };

    const uploadImage = async (serviceKey: string, file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("serviceKey", serviceKey);

        try {
            const data = await uploadServiceImageService("", serviceKey, file);
            const imageUrl = data.filename;
            // Backend-Update und lokalen State aktualisieren
            updateService(serviceKey, { image: imageUrl });
            return imageUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

  return { services, updateService, uploadImage };
}