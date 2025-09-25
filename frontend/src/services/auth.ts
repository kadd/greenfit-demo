// services/authService.ts

const API_URL = "http://localhost:5001/api/auth";

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login fehlgeschlagen");
  }

  return res.json(); // { success: true, token: "..." }
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    throw new Error("Registrierung fehlgeschlagen");
  }

  return res.json(); // { success: true, token: "..." }
}


export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}
export function isAuthenticated(): boolean {
  return !!getToken();
}