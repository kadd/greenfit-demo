import TeamsEditor from "../Editors/team/TeamsEditor";
import React from "react";
import { useTeams } from "@/hooks/useTeams";
import { useAuth } from "@/hooks/useAuth";
import { Team } from "@/types/team";

interface TeamsTabProps {
  router: any;
}

export default function TeamsTab({ router }: TeamsTabProps) {
  const { isAuthenticated } = useAuth();
  const token = isAuthenticated ? (localStorage.getItem("token") || "") : "";
  const {
    teams,
    loading,
    error,
    msg,
    setMsg,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    uploadTeamMemberPhoto,
    deleteTeamMemberPhoto,
    setTeams,
  } = useTeams(token);


  const handleCreateTeam = async () => {
    try {
      await createTeam({ label: "Neues Team", description: "", members: [] })
      setMsg("Neues Team wurde erstellt!");
    } catch {
      setMsg("Fehler beim Erstellen des Teams");
    }
  };

  if (loading) return <p>Teams werden geladen...</p>;
  if (error) return <p>Fehler beim Laden der Teams: {error}</p>;
  if (!teams || teams.length === 0) return <p>Keine Team-Daten verfügbar.</p>;
  

  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-4">Teams verwalten</h2>
      {/* Button klar oberhalb */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleCreateTeam}
          className="bg-blue-700 text-white px-4 py-2 rounded font-semibold hover:bg-blue-800 transition"
        >
          + Neues Team erstellen
        </button>
      </div>
      <div className="flex flex-col gap-8">
        {teams.map(team => (
          <TeamsEditor
            key={team.id}
            team={team}
            members={team.members}
            setTeam={updated => {
              setTeams(prev =>
                prev.map(t => t.id === updated.id ? updated : t)
              );
              // Optional: setTeams auch hier aktualisieren, falls nötig
              console.log("Team updated:", updated);
              setMsg("✅ Team aktualisiert!");
            }}
            setMembers={newMembers => {
              setTeams(prev =>
                prev.map(t =>
                  t.id === team.id ? { ...t, members: newMembers } : t
                )
              );
              console.log("Members updated:", newMembers);
              setMsg("✅ Mitglieder aktualisiert!");
              console.log("team after members update:", teams.find(t => t.id === team.id));
            }}
            setTeams={setTeams}
            loading={loading}
            error={error}
            updateExistingTeam={teamData => updateTeam(team.id, teamData)}
            deleteExistingTeam={() => deleteTeam(team.id)}
            createNewMember={memberData => addTeamMember(team.id, memberData)}
            deleteExistingTeamMemberById={memberId => deleteTeamMember(team.id, memberId)}
            updateExistingTeamMemberById={(memberId, memberData) => updateTeamMember(team.id, memberId, memberData)}
            uploadTeamMemberPhoto={(memberId, file) => uploadTeamMemberPhoto(team.id, memberId, file) }
            deleteTeamMemberPhoto={(memberId) => deleteTeamMemberPhoto(team.id, memberId)}
          />
        ))}
      </div>
      {msg && <p className="mt-4">{msg}</p>}
    </section>
  );
}