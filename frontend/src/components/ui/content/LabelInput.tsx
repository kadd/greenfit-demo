import React from "react";

type Props = {
  label: string;
  onChange: (value: string) => void;
};

export default function LabelInput({ label, onChange }: Props) {
  return (
    <input
      type="text"
      value={label}
      onChange={e => onChange(e.target.value)}
      className="block font-semibold mb-1 text-gray-700 uppercase w-full border rounded p-2"
      placeholder="Label"
    />
  );
}