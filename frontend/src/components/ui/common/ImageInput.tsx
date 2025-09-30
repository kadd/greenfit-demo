import React, { useRef } from "react";

import { getPhotoUrl } from "@/utils/uploads";

type Props = {
  image: string;
  folder: string;
  onChange: (value: string) => void;
  onUpload?: (file: File) => Promise<string>;
};

export default function ImageInput({ image, folder, onChange, onUpload }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      const file = e.target.files[0];
      const uploadedUrl = await onUpload(file);
      if (uploadedUrl) onChange(uploadedUrl);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <input
        type="text"
        value={image ?? ""}
        onChange={e => onChange(e.target.value)}
        className="font-semibold mb-1 text-gray-700 w-full border rounded p-2"
        placeholder="Image URL"
      />
      <label className="cursor-pointer bg-green-700 text-white px-3 py-1 rounded font-semibold hover:bg-green-800 transition">
        Datei hochladen
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileRef}
          onChange={handleFileChange}
        />
      </label>
      {image && (
        <img
          src={getPhotoUrl(folder, image)}
          alt="Vorschau"
          className="w-12 h-12 object-cover rounded shadow border"
        />
      )}
    </div>
  );
}