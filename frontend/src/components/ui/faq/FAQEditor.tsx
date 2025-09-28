import React from "react";

export default function FAQEditor({ faq, setFaq }) {
  const handleChange = (idx, field, value) => {
    const updated = faq.items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setFaq({ ...faq, items: updated });
  };

  const handleAdd = () => {
    setFaq({ ...faq, items: [...faq.items, { question: "", answer: "" }] });
  };

  const handleDelete = (idx) => {
    setFaq({ ...faq, items: faq.items.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <input
        type="text"
        value={faq.title}
        onChange={e => setFaq({ ...faq, title: e.target.value })}
        placeholder="FAQ Titel"
        className="mb-2 w-full border rounded p-2"
      />
      {faq.items.map((item, idx) => (
        <div key={idx} className="mb-4 border p-2 rounded">
          <input
            type="text"
            value={item.question}
            onChange={e => handleChange(idx, "question", e.target.value)}
            placeholder="Frage"
            className="mb-1 w-full border rounded p-2"
          />
          <textarea
            value={item.answer}
            onChange={e => handleChange(idx, "answer", e.target.value)}
            placeholder="Antwort"
            className="w-full border rounded p-2"
            rows={2}
          />
          <button
            type="button"
            onClick={() => handleDelete(idx)}
            className="mt-2 px-2 py-1 bg-red-600 text-white rounded"
          >
            Löschen
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Neue Frage hinzufügen
      </button>
    </div>
  );
}