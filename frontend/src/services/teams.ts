import { Team, TeamMember } from "@/types/team";

const getApiUrl = () => {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return `${base}/teams`;
  }
  return "http://localhost:5001/api/teams";
};

const API_URL = getApiUrl();

// Alle Teams abrufen
export const fetchTeamsService = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Failed to fetch teams");
  return response.json();
};

// Einzelnes Team abrufen
export const fetchTeamByIdService = async (teamId: string) => {
  const response = await fetch(`${API_URL}/${teamId}`);
  if (!response.ok) throw new Error("Failed to fetch team");
  return response.json();
};

// Neues Team erstellen
export const createTeamService = async (token: string, teamData: Partial<Team>) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(teamData),
  });
  if (!response.ok) throw new Error("Failed to create team");
  return response.json();
};

// Team aktualisieren
export const updateTeamService = async (token: string, teamId: string, teamData: Partial<Team>) => {
  const response = await fetch(`${API_URL}/${teamId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(teamData),
  });
  if (!response.ok) throw new Error("Failed to update team");
  return response.json();
};

// Team löschen
export const deleteTeamService = async (token: string, teamId: string) => {
  const response = await fetch(`${API_URL}/${teamId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete team");
  return response.json();
};

// Mitglied zu Team hinzufügen
export const addTeamMemberService = async (token: string, teamId: string, memberData: Partial<TeamMember>) => {
  const response = await fetch(`${API_URL}/${teamId}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(memberData),
  });
  if (!response.ok) throw new Error("Failed to add team member");
  return response.json();
};

// Mitglied eines Teams bearbeiten
export const updateTeamMemberService = async (token: string, teamId: string, memberId: string, memberData: Partial<TeamMember>) => {
  const response = await fetch(`${API_URL}/${teamId}/members/${memberId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(memberData),
  });
  if (!response.ok) throw new Error("Failed to update team member");
  return response.json();
};

// Mitglied eines Teams löschen
export const deleteTeamMemberService = async (token: string, teamId: string, memberId: string) => {
  const response = await fetch(`${API_URL}/${teamId}/members/${memberId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete team member");
  return response.json();
};

// Foto für Team-Mitglied hochladen
export const uploadTeamMemberPhotoService = async (token: string, teamId: string, memberId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("memberId", memberId);

  const response = await fetch(`${API_URL}/upload-photo/${teamId}/${memberId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload team member photo");
  return response.json();
};


// Foto für Team-Mitglied löschen
export const deleteTeamMemberPhotoService = async (token: string, teamId: string, memberId: string) => {
  const response = await fetch(`${API_URL}/delete-photo/${teamId}/${memberId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ memberId }),   
  });
  if (!response.ok) throw new Error("Failed to delete team member photo");
  return response.json();
};

// GCS 
