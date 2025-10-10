import React, { useState } from "react";
import { GroupedContactRequests, ContactRequestStatus } from "@/types/contactRequests";

type Props = {
  contactRequests: GroupedContactRequests;
  deleteContactRequestById: (id: string) => Promise<void>;
  updateContactRequestStatusById: (data: { id: string; status: ContactRequestStatus }) => Promise<void>;
  addCommentToContactRequestById: (data: { id: string; comment: string }) => Promise<void>;
};

export default function ContactRequestEditor({
  contactRequests,
  deleteContactRequestById,
  updateContactRequestStatusById,
  addCommentToContactRequestById,
}: Props) {
  const [comment, setComment] = useState<{ [id: string]: string }>({});
  const statusLabels: ContactRequestStatus[] = ["open", "in progress", "closed"];

  if (!contactRequests || Object.keys(contactRequests).length === 0) {
    return <p>Keine Kontaktanfragen vorhanden.</p>;
  }

  return (
    <div>
      {Object.entries(contactRequests).map(([email, requests]) => (
        <div key={email} className="mb-8 p-4 bg-white rounded shadow">
          <h3 className="font-bold text-green-700 mb-2">{email}</h3>
          {requests.map((req) => (
            <div key={req.id} className="mb-4 border-b pb-4">
              <div className="mb-2">
                <span className="font-semibold">Name:</span> {req.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Nachricht:</span> {req.message}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Status:</span>{" "}
                <select
                  value={req.status || "offen"}
                  onChange={e =>
                    updateContactRequestStatusById({ id: req.id, status: e.target.value as ContactRequestStatus })
                  }
                  className="border rounded px-2 py-1"
                >
                    {Object.values(statusLabels).map(label => (
                     <option key={label} value={label}>
                       {label.charAt(0).toUpperCase() + label.slice(1)}
                     </option>
                    ))}
    
                </select>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Kommentar:</span>
                <textarea
                  value={comment[req.id] || req.comment || ""}
                  onChange={e => setComment({ ...comment, [req.id]: e.target.value })}
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Kommentar hinzufügen"
                />
                <button
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => addCommentToContactRequestById({ id: req.id, comment: comment[req.id] || "" })}
                >
                  Speichern
                </button>
              </div>
              <button
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => deleteContactRequestById(req.id)}
              >
                Anfrage löschen
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}