import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTeam } from "@/hooks/useTeam";

import { Member } from "@/types/member";

import {  getPhotoUrl } from "@/utils/uploads";


export default function TeamEditor() {
  const { token } = useAuth();
  const { members, loading, msg, setMsg, updateMember, uploadPhoto } = useTeam(token);
  const [editMembers, setEditMembers] = useState(members);

  const uploadFolder = "team";

  useEffect(() => {
    setEditMembers(members);
  }, [members]);

  const handleChange = (idx: number, field: string, value: string) => {
    setEditMembers(prev =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = async () => {
    for (const member of editMembers) {
      await updateMember(member);
    }
  };

  const handlePhotoUpload = async (memberName: string, file: File) => {
    if (file) await uploadPhoto(memberName, file);
  };

  if (loading) return <p className="text-center">Lade Team-Mitglieder...</p>;
  if (!editMembers.length) return <p>Keine Team-Mitglieder gefunden.</p>;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Team bearbeiten</h2>
      <div className="w-full grid md:grid-cols-2 gap-6">
        {editMembers.map((member: Member, idx) => (
          <div key={member.name || idx} className="bg-white rounded-lg p-4 flex flex-col items-center shadow">
            <img
              src={getPhotoUrl(uploadFolder, member.photoSrc)}
              alt={member.name}
              className="w-24 h-24 rounded-full mb-2 object-cover"
            />
            <label className="cursor-pointer bg-green-700 text-white px-3 py-1 rounded font-semibold hover:bg-green-800 transition mb-2">
              Foto hochladen
              <input
                type="file"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handlePhotoUpload(member.name, e.target.files[0]);
                  }
                }}
              />
            </label>
            <input
              type="text"
              value={member.name}
              onChange={e => handleChange(idx, "name", e.target.value)}
              placeholder="Name"
              className="mb-2 px-2 py-1 rounded border w-full"
            />
            <input
              type="text"
              value={member.role}
              onChange={e => handleChange(idx, "role", e.target.value)}
              placeholder="Rolle"
              className="mb-2 px-2 py-1 rounded border w-full"
            />
            <textarea
              value={member.bio || ""}
              onChange={e => handleChange(idx, "bio", e.target.value)}
              placeholder="Kurzbeschreibung"
              className="mb-2 px-2 py-1 rounded border w-full"
              rows={2}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSave}
          className="bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800 transition"
        >
          Änderungen speichern
        </button>
      </div>
      {msg && <p className="mt-4 text-center">{msg}</p>}
    </section>
  );
}