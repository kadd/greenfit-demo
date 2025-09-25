const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function getDashboardData(token: string) {
  const res = await fetch(`${API_URL}/api/content`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}
export async function updateDashboardData(token: string, data: any) {
  const res = await fetch(`${API_URL}/api/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update dashboard data");
  return res.json();
}

