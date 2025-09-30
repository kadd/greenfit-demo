import React from "react";

type Props = {
  description: string;
  onChange: (value: string) => void;
};

export default function DescriptionInput({ description, onChange }: Props) {
  return (
    <input
      type="text"
      value={description}
      onChange={e => onChange(e.target.value)}
      className="block font-semibold mb-1 text-gray-700 uppercase w-full border rounded p-2"
      placeholder="Beschreibung"
    />
  );
}