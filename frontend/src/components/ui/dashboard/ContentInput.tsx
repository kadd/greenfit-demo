import React from "react";

type Props = {
  content: string;
  onChange: (value: string) => void;
};

export default function ContentInput({ content, onChange }: Props) {
  return content.length > 80 ? (
    <textarea
      value={content}
      onChange={e => onChange(e.target.value)}
      className="w-full border rounded p-2 text-gray-700"
      rows={5}
    />
  ) : (
    <input
      type="text"
      value={content}
      onChange={e => onChange(e.target.value)}
      className="w-full border rounded p-2 text-gray-700"
    />
  );
}