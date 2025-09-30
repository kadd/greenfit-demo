import { useState, useEffect } from "react";

import { Member } from "@/types/member";

// Beispiel-Services, bitte anpassen!
import { getTeamService, updateTeamMemberService, uploadTeamPhotoService } from "@/services/team";

export function useTeam(token: string) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const getMembers = async () => {
    setLoading(true);
    try {
      const data = await getTeamService(token);
      setMembers(data.members);
    } catch {
      setMsg("Fehler beim Laden der Team-Mitglieder");
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (member: Member) => {
    setLoading(true);
    try {
      await updateTeamMemberService(token, member);
      setMsg("✅ Änderungen gespeichert!");
      await getMembers();
    } catch {
      setMsg("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (memberName: string, file: File) => {
    setLoading(true);
    try {
      await uploadTeamPhotoService(token, memberName, file);
      setMsg("✅ Foto hochgeladen!");
      await getMembers();
    } catch {
      setMsg("Fehler beim Foto-Upload");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     getMembers();
  }, []);

  return { members, getMembers, loading, msg, setMsg, updateMember, uploadPhoto };
}
