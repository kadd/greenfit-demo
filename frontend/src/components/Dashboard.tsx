"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useContent } from "@/hooks/useContent";

import { ContentData } from "@/types/contentData";
import DashboardForm from "@/components/ui/dashboard/DashboardForm";

import AdminHeader from "@/components/Navigation/admin/AdminHeader";

import { useContentContext } from "@/contexts/contentContext";



export default function ContentPage() {
  const [content, setContent] = useState<ContentData>({
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
    impressum: "",
    privacy: "",
    terms: "",
  });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const { token } = useAuth();
  const { data, loading, error, updateContentData } = useContent(token || "");

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
        impressum: data?.impressum || "",
        privacy: data?.privacy || "",
        terms: data?.terms || "",
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
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6 w-full">
        <AdminHeader />
       <div className="w-full max-w-4xl">
        <button
            type="button"
            onClick={() => router.back()}
            className="self-start mb-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-300 transition text-white hover:text-gray-800"
        >
            ← Zurück
        </button>
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Admin Content
        </h1>
        <DashboardForm content={content} setContent={setContent} onSubmit={handleSave} />
        {msg && <p className="mt-4">{msg}</p>}
      </div>
    </main>
  );
}
