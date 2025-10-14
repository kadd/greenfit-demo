import { useState, useEffect } from "react";
import { Team, TeamMember } from "@/types/team";
import { getPhotoUrl } from "@/utils/uploads";
import {
  fetchTeamsService,
  createTeamService,
  updateTeamService,
  deleteTeamService,
  addTeamMemberService,
  updateTeamMemberService,
  deleteTeamMemberService,
  uploadTeamMemberPhotoService,
  deleteTeamMemberPhotoService
} from "@/services/teams";

export function useTeams(token: string) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const uploadFolder = "team";

  // Teams laden
  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      try {
        const data = await fetchTeamsService();
        setTeams(data);
      } catch (err: any) {
        setError("Fehler beim Laden der Teams");
      } finally {
        setLoading(false);
      }
    };
    loadTeams();
  }, []);

  // Team erstellen
  const createTeam = async (teamData: Partial<Team>) => {
    setLoading(true);
    try {
      const newTeam = await createTeamService(token, teamData);
      setTeams(prev => [...prev, newTeam]);
      setMsg("✅ Team erstellt!");
      return newTeam;
    } catch {
      setError("Fehler beim Erstellen des Teams");
    } finally {
      setLoading(false);
    }
  };

  // Team aktualisieren
  const updateTeam = async (teamId: string, teamData: Partial<Team>) => {
    setLoading(true);
    try {
      const updated = await updateTeamService(token, teamId, teamData);
      setTeams(prev => prev.map(t => t.id === teamId ? updated : t));
      setMsg("✅ Team aktualisiert!");
      return updated;
    } catch {
      setError("Fehler beim Aktualisieren des Teams");
    } finally {
      setLoading(false);
    }
  };

  // Team löschen
  const deleteTeam = async (teamId: string) => {
    setLoading(true);
    try {
      await deleteTeamService(token, teamId);
      setTeams(prev => prev.filter(t => t.id !== teamId));
      setMsg("✅ Team gelöscht!");
    } catch {
      setError("Fehler beim Löschen des Teams");
    } finally {
      setLoading(false);
    }
  };

  // Mitglied zu Team hinzufügen
  const addTeamMember = async (teamId: string, memberData: Partial<TeamMember>) => {
    setLoading(true);
    try {
      const newMember = await addTeamMemberService(token, teamId, memberData);
      setTeams(prev =>
        prev.map(t =>
          t.id === teamId
            ? { ...t, members: [...t.members, newMember] }
            : t
        )
      );
      setMsg("✅ Mitglied hinzugefügt!");
      return newMember;
    } catch {
      setError("Fehler beim Hinzufügen des Mitglieds");
    } finally {
      setLoading(false);
    }
  };

  // Mitglied eines Teams aktualisieren
  const updateTeamMember = async (teamId: string, memberId: string, memberData: Partial<TeamMember>) => {
    setLoading(true);
    try {
      const updatedMember = await updateTeamMemberService(token, teamId, memberId, memberData);
      setTeams(prev =>
        prev.map(t =>
          t.id === teamId
            ? {
                ...t,
                members: t.members.map(m => m.id === memberId ? updatedMember : m),
              }
            : t
        )
      );
      setMsg("✅ Mitglied aktualisiert!");
      return updatedMember;
    } catch {
      setError("Fehler beim Aktualisieren des Mitglieds");
    } finally {
      setLoading(false);
    }
  };

  // Mitglied eines Teams löschen
  const deleteTeamMember = async (teamId: string, memberId: string) => {
    setLoading(true);
    try {
      await deleteTeamMemberService(token, teamId, memberId);
      setTeams(prev =>
        prev.map(t =>
          t.id === teamId
            ? { ...t, members: t.members.filter(m => m.id !== memberId) }
            : t
        )
      );
      setMsg("✅ Mitglied gelöscht!");
    } catch {
      setError("Fehler beim Löschen des Mitglieds");
    } finally {
      setLoading(false);
    }
  };

  const uploadTeamMemberPhoto = async (teamId: string, memberId: string, file: File) => {
    setLoading(true);
    try {
      const updatedMember = await uploadTeamMemberPhotoService(token, teamId, memberId, file);
      //const updatedMember = await uploadTeammemberPhotoToGCSService(token, teamId, memberId, file);
      console.log("Uploaded member:", updatedMember);
      console.log("Upload folder:", uploadFolder);
      console.log("Photo URL:", getPhotoUrl(uploadFolder, updatedMember.filename));
      setTeams(prev =>
        prev.map(t =>
          t.id === teamId
            ? {
                ...t,
                members: Array.isArray(t.members)
                  ? t.members.map(m =>
                      m.id === memberId ? { ...m, photoSrc: updatedMember.url } : m
                    )
                  : []

              }
            : t
        )
      );
      setMsg("✅ Foto hochgeladen!");
      return updatedMember;
    } catch {
      setError("Fehler beim Hochladen des Fotos");
    } finally {
      setLoading(false);
    }
  };

  const deleteTeamMemberPhoto = async (teamId: string, memberId: string) => {
    setLoading(true);
    try {
      const updatedMember = await deleteTeamMemberPhotoService(token, teamId, memberId);
      setTeams(prev =>
        prev.map(t =>
          t.id === teamId
            ? {
                ...t,
                members: t.members.map(m => m.id === memberId ? updatedMember : m),
              }
            : t
        )
      );
      setMsg("✅ Foto gelöscht!");
      return updatedMember;
    } catch {
      setError("Fehler beim Löschen des Fotos");
    } finally {
      setLoading(false);
    }
  };

  return {
    teams,
    setTeams,
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
  };
}