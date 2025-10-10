"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/components/Navigation/admin/AdminHeader";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setMsg("❌ " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader  />
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] pt-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg w-80"
        >
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Admin Login</h1>
          <input
            className="border p-2 w-full mb-2 text-gray-700"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="border p-2 w-full mb-4 text-gray-700"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-green-600 text-white py-2 rounded w-full hover:bg-green-700 transition">
            Login
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="bg-gray-400 text-white py-2 rounded w-full hover:bg-gray-500 transition mt-2"
          >
            Zurück
          </button>
          {msg && <p className="mt-2 text-center text-sm text-red-500">{msg}</p>}

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Noch kein Konto?{" "}
              <a
                href="/admin/register"
                className="text-green-600 hover:underline"
              >
                Registrieren
              </a>
            </p>
            <p className="mt-2">
              <a
                href="/admin/forgot-password"
                className="text-green-600 hover:underline"
              >
                Passwort vergessen?
              </a>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
