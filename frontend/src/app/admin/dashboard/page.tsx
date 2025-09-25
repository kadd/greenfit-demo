"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";

import { DashboardData } from "@/types/dashboardData";

export default function DashboardPage() {
  const [content, setContent] = useState<DashboardData>({
    about: "",
    services: {
      training: "",
      nutrition: "",
      group: "",
    },
    contact: {
      email: "",
      phone: "",
    },
  });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const { token } = useAuth();
  const { data, loading, error, updateDashboardData } = useDashboard(token || "");

  // Inhalte vom Backend holen
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/admin/login");
    return;
  }

  // Nur ausführen, wenn data vorhanden ist
  if (data) {
    setContent({
      about: data?.about || "",
      services: {
        training: data?.services?.training || "",
        nutrition: data?.services?.nutrition || "",
        group: data?.services?.group || "",
      },
      contact: {
        email: data?.contact?.email || "",
        phone: data?.contact?.phone || "",
      },
    });

    setMsg("");
    return;
  }

  if (!loading && !data) {
    setMsg("⚠️ Keine Inhalte gefunden");
  }
  if (error) {
    setMsg("⚠️ Inhalte konnten nicht geladen werden");
  }
}, [router, data, loading, error]);

  

  if (loading) {
    return <p className="p-6">Lade Inhalte...</p>;
  }

  // Inhalte speichern
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.success) {
        setMsg("✅ Inhalte gespeichert!");
      } else {
        setMsg("❌ Fehler beim Speichern");
      }
    } catch {
      setMsg("⚠️ Server nicht erreichbar");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        <button
            type="button"
            onClick={() => router.back()}
            className="self-start mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-300 transition "
        >
            ← Zurück
      </button>
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Admin Dashboard
      </h1>
      <form
        onSubmit={handleSave}
        className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl space-y-4"
      >
       {Object.entries(content).map(([key, value]) => (
            <div key={key} className="mb-4">
                <label className="block font-semibold mb-1 text-gray-700">{key}</label>
                {typeof value === "object" && value !== null ? (
                Object.entries(value).map(([subKey, subValue]) => (
                    <div key={subKey} className="mb-2">
                    <label className="block text-gray-600 mb-1">{subKey}</label>
                    <input
                        type="text"
                        value={subValue}
                        onChange={e =>
                        setContent(prev => ({
                            ...prev,
                            [key]: {
                            ...prev[key],
                            [subKey]: e.target.value,
                            },
                        }))
                        }
                        className="w-full border rounded p-2 text-gray-700"
                    />
                    </div>
                ))
                ) : (
                <textarea
                    value={value as string}
                    onChange={e =>
                    setContent(prev => ({
                        ...prev,
                        [key]: e.target.value,
                    }))
                    }
                    className="w-full border rounded p-2 text-gray-700"
                    rows={5}
                />
                )}
            </div>
            ))}
       
        <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
          Speichern
        </button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </main>
  );
}
