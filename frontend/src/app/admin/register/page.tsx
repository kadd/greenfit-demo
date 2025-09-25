"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMsg("❌ Passwörter stimmen nicht überein");
      return;
    }

    try {
      await register(username, email, password);
      router.push("/admin/login");
    } catch (err: any) {
      setMsg("❌ " + err.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-80"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Registrieren</h1>

        <input
          type="text"
          className="border p-2 w-full mb-2 text-gray-700"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          className="border p-2 w-full mb-2 text-gray-700"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border p-2 w-full mb-2 text-gray-700"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="border p-2 w-full mb-4 text-gray-700"
          placeholder="Passwort bestätigen"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded w-full hover:bg-green-700 transition"
          >
            Registrieren
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="bg-gray-400 text-white py-2 rounded w-full hover:bg-gray-500 transition"
          >
            Zurück
          </button>
        </div>

        {msg && <p className="mt-2 text-center text-sm text-red-500">{msg}</p>}

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Schon registriert?{" "}
            <a
              href="/admin/login"
              className="text-green-600 hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </form>
    </main>
  );
}
