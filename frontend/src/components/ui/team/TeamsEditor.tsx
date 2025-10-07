import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Team, TeamMember } from "@/types/team";
import { getPhotoUrl } from "@/utils/uploads";

type Props = {
  team: Team;
  members: TeamMember[];
  setTeam: (team: Team) => void;
  setMembers: (members: TeamMember[]) => void;
  setTeams: (teams: Team[]) => void;
  loading: boolean;
  error: string | null;
  updateExistingTeam: (teamData: Partial<Team>) => Promise<Team | undefined>;
  deleteExistingTeam: () => Promise<void>;
  createNewMember: (memberData: Partial<TeamMember>) => Promise<TeamMember | undefined>;
  deleteExistingTeamMemberById: (memberId: string) => Promise<void>;
  updateExistingTeamMemberById: (memberId: string, memberData: Partial<TeamMember>) => Promise<TeamMember | undefined>;
  uploadTeamMemberPhoto: (memberId: string, file: File) => Promise<void>;
  deleteTeamMemberPhoto: (memberId: string) => Promise<void>;
};

export default function TeamsEditor({
  team,
  members,
  setTeam,
  setMembers,
  setTeams,
  loading,
  error,
  updateExistingTeam,
  deleteExistingTeam,
  createNewMember,
  deleteExistingTeamMemberById,
  updateExistingTeamMemberById,
  uploadTeamMemberPhoto,
  deleteTeamMemberPhoto
}: Props) {
  const { isAuthenticated } = useAuth();
  const [msg, setMsg] = useState<string | null>(null);
  const uploadFolder = "team";

  if (!isAuthenticated) {
    return <p>Sie müssen angemeldet sein, um das Team zu bearbeiten.</p>;
  }



  const handleAddMember = async () => {
    const newMember = await createNewMember({
      name: "Neues Mitglied",
      role: "Rolle",
      bio: "Kurzbeschreibung",
      photoSrc: ""
    });
    if (newMember) {
      //setMembers([...members, newMember]);
      setTeams(prev =>
        prev.map(t =>
          t.id === team.id
            ? { ...t, members: [...(t.members || []), newMember] }
            : t
        )
      );
      setMsg("Neues Mitglied hinzugefügt!");
    }
  };

  const handleDeleteMember = async (idx: number) => {
    const memberToDelete = members[idx];
    if (memberToDelete && memberToDelete.id) {
      await deleteExistingTeamMemberById(memberToDelete.id);
      setMembers(members.filter((_, i) => i !== idx));
      setMsg("Mitglied entfernt!");
    }
  };

  const updateMember = async (member: TeamMember) => {
    if (member.id) {
      const updated = await updateExistingTeamMemberById(member.id, member);
      if (updated) {
        setTeams(prev =>
          prev.map(t =>
            t.id === team.id
              ? {
                  ...t,
                  members: Array.isArray(t.members)
                    ? t.members.map(m => (m.id === updated.id ? updated : m))
                    : []
                }
              : t
          )
        );
        setMsg("Mitglied aktualisiert!");
      }
    }
  };

  const handleSaveTeam = async () => {
    if (!isAuthenticated) {
      alert("Sie müssen angemeldet sein, um das Team zu speichern.");
      return;
    }
    try {
      const updatedTeam = await updateExistingTeam(team);
      if (updatedTeam) {
        setTeam(updatedTeam);
        setMsg("✅ Änderungen gespeichert!");
      }
    } catch {
      setMsg("Fehler beim Speichern");
    }
  };

  const handleChange = (idx: number, field: string, value: string) => {
    const updatedMembers = members.map((m, i) =>
      i === idx ? { ...m, [field]: value } : m
    );
    setMembers(updatedMembers);
  };

  const handlePhotoUpload = async (memberId: string, file: File) => {
    if (file) {
      await uploadTeamMemberPhoto(memberId, file);
      setMsg("✅ Foto hochgeladen!");
      // Optional: Mitgliederliste aktualisieren, falls nötig
      
    }
  };

  return (
  <div className="mb-12">
  {/* Team-Card */}
  <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
    {/* Team-Funktionen: Löschen & Speichern */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <button
          onClick={deleteExistingTeam}
          className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 transition mr-2"
        >
          Team löschen
        </button>
        <button
          onClick={handleSaveTeam}
          className="bg-green-700 text-white px-4 py-2 rounded font-semibold hover:bg-green-800 transition"
        >
          Änderungen speichern
        </button>
      </div>
    </div>
    {/* Team-Infos */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex-1">
        <input
          type="text"
          value={team.label}
          onChange={e => setTeams(prev =>
            prev.map(t =>
              t.id === team.id ? { ...t, label: e.target.value } : t
            )
          )}
          placeholder="Team-Name / Label"
          className="mb-2 px-2 py-1 rounded border w-full font-bold text-xl"
        />
        <textarea
          value={team.description}
          onChange={e => setTeams(prev =>
            prev.map(t =>
              t.id === team.id ? { ...t, description: e.target.value } : t
            )
          )}
          placeholder="Team-Beschreibung"
          className="mb-2 px-2 py-1 rounded border w-full"
          rows={2}
        />
      </div>
    </div>
    <hr className="my-8 border-t-2 border-green-200" />
    {/* Mitglieder-Bereich */}
    <div className="w-full grid md:grid-cols-2 gap-6">
      <h3 className="col-span-full text-lg font-bold text-green-700 mb-4">Mitglieder des Teams "{team.label}"</h3>
      {Array.isArray(members) && members.length === 0 && (
        <p className="col-span-full text-gray-600">Keine Mitglieder im Team. Fügen Sie Mitglieder hinzu.</p>
      )}
      {team.members.map((member: TeamMember, idx) => (
        <div key={member.id || idx} className="bg-gray-50 rounded-lg p-4 flex flex-col items-center shadow">
          <img
            src={getPhotoUrl(uploadFolder, member.photoSrc)}
            alt={member.name || "Teammitglied"}
            className="w-24 h-24 rounded-full mb-2 object-cover"
          />
          <label className="cursor-pointer bg-green-700 text-white px-3 py-1 rounded font-semibold hover:bg-green-800 transition mb-2">
            Foto hochladen
            <input
              type="file"
              className="hidden"
              onChange={e => {
                e.preventDefault(); // Seite nicht neu laden!
                if (e.target.files && e.target.files[0]) {
                  handlePhotoUpload(member.id, e.target.files[0]);
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
          <button
            onClick={() => handleDeleteMember(idx)}
            className="mt-2 px-2 py-1 bg-red-600 text-white rounded"
          >
            Mitglied entfernen
          </button>
          <button
            onClick={() => updateMember(members[idx])}
            className="mt-2 px-2 py-1 bg-blue-600 text-white rounded"
          >
            Mitglied speichern
          </button>
        </div>
      ))}
    </div>
    {/* Mitglieder-Funktion: Hinzufügen */}
    <div className="flex justify-center mt-6">
      <button
        onClick={handleAddMember}
        className="bg-green-700 text-white px-6 py-2 rounded font-semibold hover:bg-green-800 transition"
      >
        Neues Mitglied hinzufügen
      </button>
    </div>
    {msg && <p className="mt-4 text-center">{msg}</p>}
    {loading && <p className="mt-4 text-center">Lade Team-Mitglieder...</p>}
    {error && <p className="mt-4 text-center text-red-600">{error}</p>}
  </div>
</div>
  );
}