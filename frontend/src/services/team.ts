const API_URL = process.env.NEXT_PUBLIC_API_URL+'/team' || "http://localhost:5001/api/team";

export const getTeamService = async (token: string) => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Failed to fetch team");
  return response.json();
};

export const updateTeamMemberService = async (token: string, member: any) => {
  const response = await fetch(`${API_URL}/${member.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(member)
  });
  if (!response.ok) throw new Error("Failed to update team member");
  return response.json();
};

export async function uploadTeamPhotoService(token: string, memberName: string, file: File) {
  const formData = new FormData();
  formData.append("file", file); // Feldname muss "file" sein!
  const encodedName = encodeURIComponent(memberName);
  const response = await fetch(`${API_URL}/photo/${encodedName}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error("Upload fehlgeschlagen");
  return response.json();
}
