// Beispiel: /src/components/ui/common/FileUpload.tsx
import React, { useRef } from "react";

export default function FileUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    const file = fileInput.current?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.url) onUpload(data.url);
  };

  return (
    <div>
      <input type="file" ref={fileInput} className="mb-2" />
      <button type="button" onClick={handleUpload} className="px-4 py-2 bg-green-600 text-white rounded">
        Datei hochladen
      </button>
    </div>
  );
}