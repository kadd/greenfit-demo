import React, { use, useState } from "react";

import { useUpload } from "@/hooks/useUpload";
import  { UploadArea } from "@/types/uploadArea";
import { useAuth } from "@/hooks/useAuth";

import Gallery from "@/components/ui/gallery/Gallery";
import { get } from "http";

const uploadAreas: UploadArea[] = [
  { key: "gallery", label: "Galerie" },
  { key: "header", label: "Header-Bild" },
  { key: "other", label: "Sonstige Dateien" },
];

export default function UploadEditor({ onUpload }) {
  const [filesToUpload, setFilesToUpload] = useState<{ [key: string]: File | null }>({});
  const [selectedArea, setSelectedArea] = useState(uploadAreas[0].key);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const { token } = useAuth();

  const { areas, files, uploadFileToArea, deleteFile, getAreas } = useUpload(token);

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
    setFile(null);
    setMsg("");
  };

  const handleFileChange = (areaKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setFilesToUpload(prev => ({ ...prev, [areaKey]: file }));
    handleUploadDirect(areaKey, file); // Datei direkt übergeben!
  }
};

const handleUploadDirect = async (areaKey: string, file: File) => {
  if (!file) return setMsg("Bitte eine Datei auswählen!");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("area", areaKey);

  try {
    const res = await uploadFileToArea(areaKey, formData);
    if (res.success) {
      setMsg("✅ Upload erfolgreich!");
      setFilesToUpload(prev => ({ ...prev, [areaKey]: null }));
      await getAreas();
    } else {
      setMsg("❌ Upload fehlgeschlagen");
    }
  } catch (error) {
    setMsg("⚠️ Server nicht erreichbar: " + error.message);
  }
};

  const handleDelete = async (filename, area) => {
    try {
      const res = await deleteFile(filename);
      if (res.success) {
        setMsg("✅ Datei gelöscht");
        await getAreas();
      } else {
        setMsg("❌ Löschen fehlgeschlagen");
      }
    } catch {
      setMsg("⚠️ Server nicht erreichbar");
    }
  };

  const areasArray = Array.isArray(areas) ? areas : [];

  if(!files) return <p>Lade Dateien...</p>;
  if(!areas) return <p>Lade Bereiche...</p>;
  

  return (
    <section className="py-8">
      <div className="mt-12 space-y-8">
        {areasArray.map(area => (
          <div
            key={area.key}
            className="w-full min-h-[120px] bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 text-xl border border-dashed p-8"
          >
            <span>{area.label}</span>
            <div className="mt-4 text-sm text-gray-500">
              {area?.files?.length} Datei{area?.files?.length !== 1 ? 'en' : ''}
              {area?.files?.length > 0 && (
                <Gallery area={area.key} files={area.files} title={area.label} onDelete={handleDelete} />
              )}
            </div>
            {/* Upload für diese Area */}
           <div className="flex flex-col items-center mt-4">
              <label className="mb-2 cursor-pointer bg-green-700 text-white px-4 py-2 rounded font-semibold hover:bg-green-800 transition">
                Datei auswählen
                <input
                  type="file"
                  onChange={e => handleFileChange(area.key, e)}
                  className="hidden"
                />
              </label>
            </div>
          </div>)
        )}
      </div>
      {msg && <p className="mt-4 text-center">{msg}</p>}
    </section>
  );
}