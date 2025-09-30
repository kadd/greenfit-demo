import React from "react";
import { useServices } from "@/hooks/useServices";
import ImageInput from "@/components/ui/common/ImageInput";
import LabelInput from "../content/LabelInput";
import DescriptionInput from "../content/DescriptionInput";
import ContentInput from "../_dashboard/ContentInput";

// ServiceEditor.tsx
export default function ServiceEditor() {
  const { services, updateService, uploadImage } = useServices();
  if (!services || !services.content) return <div>Lade Dienstleistungen...</div>;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Leistungen bearbeiten</h2>
      <LabelInput
        label={services.label}
        onChange={val => updateService("title", val)}
      />
      <DescriptionInput
        description={services.description}
        onChange={val => updateService("description", val)}
      />
      <h3 className="text-lg font-semibold mt-6 mb-2">Einzelne Dienstleistungen</h3>
     {Object.entries(services.content).map(([key, service]) => (
        <div key={key} className="bg-white rounded shadow p-4 mb-6 flex flex-col gap-2">
          <input
            type="text"
            value={service.label}
            onChange={e => updateService(key, { ...service, label: e.target.value })}
            placeholder="Label"
            className="border rounded px-2 py-1"
          />
          <textarea
            value={service.content}
            onChange={e => updateService(key, { ...service, content: e.target.value })}
            placeholder="Beschreibung"
            className="border rounded px-2 py-1"
          />
          <ImageInput
            image={service.image}
            onChange={img => updateService(key, { ...service, image: img })}
            onUpload={file => uploadImage(key, file)}
          />
        </div>
      ))}
    </section>
  );
}