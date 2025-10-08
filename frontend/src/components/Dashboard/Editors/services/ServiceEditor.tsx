import React, { useState } from "react";
import { useServices } from "@/hooks/useServices";
import ImageInput from "@/components/ui/common/ImageInput";
import LabelInput from "../../../ui/content/LabelInput";
import DescriptionInput from "../../../ui/content/DescriptionInput";
import ContentInput from "../../../ui/_dashboard/ContentInput";

import { ServiceData, Service } from "@/types/service";

type ServiceEditorProps = {
  services: ServiceData | null;
  loading?: boolean;
  error?: string;
  setServices: React.Dispatch<React.SetStateAction<ServiceData | null>>;
  createService: (data: ServiceData) => Promise<void>;
  updateService: (key: string, data: Partial<Service>) => Promise<void>;
  deleteServiceContent: (key: string) => Promise<void>;
  uploadServiceImage: (key: string, file: File) => Promise<void>;
  saveAll: () => Promise<void>;
};

// ServiceEditor.tsx
export default function ServiceEditor({
  services,
  loading,
  error,
  setServices,
  createService,
  deleteServiceContent,
  updateService,
  uploadServiceImage,
  saveAll,
}: ServiceEditorProps) {

  const [msg, setMsg] = useState("");

  if (loading) return <div>Lade Dienstleistungen...</div>;
  if (error) return <div className="text-red-600">Fehler: {error}</div>;
  if (!services || !services.content) return <div>Lade Dienstleistungen...</div>;

  // Dienstleistung hinzufügen
  const handleAddService = () => {
    const newKey = `service-${Date.now()}`;
    setServices(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        content: {
          ...prev.content,
          [newKey]: {
            label: "",
            content: "",
            image: "",
          },
        },
      };
    });
  };

  // Dienstleistung löschen
  const handleDeleteService = async (key: string) => {
    await deleteServiceContent(key);
    setMsg("Dienstleistung gelöscht.");
  };

  // Dienstleistung ändern
  const handleChangeService = (key: string, field: string, value: string) => {
    setServices(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        content: {
          ...prev.content,
          [key]: {
            ...prev.content[key],
            [field]: value,
          },
        },
      };
    });
  };
  // Service-Label oder Beschreibung ändern
  const updateServiceField = (field: keyof ServiceData, value: string) => {
    if (!services) return;
    const updatedServices = { ...services, [field]: value };
    setServices(updatedServices);
  };

  // Bild hochladen
  const handleUploadImage = async (key: string, file: File) => {
    await uploadServiceImage(key, file);
    setMsg("Bild hochgeladen.");
  };

  // Alles speichern
  const handleSaveAll = async () => {
    await saveAll();
    setMsg("Alle Änderungen gespeichert.");
  };

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Leistungen bearbeiten</h2>
      <LabelInput
        label={services.label}
        onChange={val => updateServiceField("label", val)}
      />
      <DescriptionInput
        description={services.description}
        onChange={val => updateServiceField("description", val)}
      />
      <h3 className="text-lg font-semibold mt-6 mb-2">Einzelne Dienstleistungen</h3>
     {Object.entries(services.content).map(([key, service]) => (
        <div key={key} className="bg-white rounded shadow p-4 mb-6 flex flex-col gap-2">
          <input
            type="text"
            value={service.label}
            onChange={e => handleChangeService(key, "label", e.target.value)}
            placeholder="Bezeichnung"
            className="border rounded px-2 py-1"
          />
          <textarea
            value={service.content}
            onChange={e => handleChangeService(key, "content", e.target.value)}
            placeholder="Beschreibung"
            className="border rounded px-2 py-1"
          />
          <ImageInput
            image={service.image}
            folder="services"
            onChange={img => handleChangeService(key, "image", img)}
            onUpload={file => handleUploadImage(key, file)}
          />
          <button
            type="button"
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 mt-2 self-end"
            onClick={() => handleDeleteService(key)}
          >
            Dienstleistung löschen
          </button>
        </div>
      ))}
      <div className="flex gap-4 mt-4">
        <button
          type="button"
          className="bg-green-700 text-white px-4 py-2 rounded font-semibold hover:bg-green-800"
          onClick={handleAddService}
        >
          Neue Dienstleistung hinzufügen
        </button>
        <button
          type="button"
          className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800"
          onClick={handleSaveAll}
        >
          Änderungen speichern
        </button>
      </div>
      {msg && <p className="mt-4 text-green-700">{msg}</p>}
    </section>
  );
}