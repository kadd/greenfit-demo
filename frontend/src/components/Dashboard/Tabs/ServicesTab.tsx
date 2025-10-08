import React, { useState } from "react";
import ServiceEditor from "@/components/Dashboard/Editors/services/ServiceEditor";
import { useServices } from "@/hooks/useServices";
import  { useAuth } from "@/hooks/useAuth";

type ServicesTabProps = {
  router: any;
};

// ServicesTab.tsx

export default function ServicesTab({ router }: ServicesTabProps) {
  const { token } = useAuth();
  const {
    services,
    loading,
    error,
    setServices,
    createService,
    updateService,
    deleteServiceContent,
     uploadServiceImage,
    deleteServiceImage,
  } = useServices(token);

  const [msg, setMsg] = useState("");

  // Alle Änderungen speichern
  const saveAll = async () => {
    if (!token || !services) {
      setMsg("Fehler: Kein Token oder keine Dienstleistungen vorhanden.");
      return;
    }
    try {
      await updateService(services);
      setMsg("Alle Änderungen wurden gespeichert.");
    } catch (error) {
      setMsg("Fehler beim Speichern der Änderungen.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dienstleistungen bearbeiten</h2>
      <ServiceEditor
        services={services}
        setServices={setServices}
        createService={createService}
        updateService={updateService}
        deleteServiceContent={deleteServiceContent}
        uploadServiceImage={uploadServiceImage}
        saveAll={saveAll}
      />
      {msg && <p className="mt-4 text-green-700">{msg}</p>}
    </div>
  );
}