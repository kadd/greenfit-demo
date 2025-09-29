"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useContent } from "@/hooks/useContent";
import { useContact } from "@/hooks/useContact";

import { ContentData } from "@/types/contentData";
import DashboardForm from "@/components/ui/dashboard/DashboardForm";

import AdminHeader from "@/components/Navigation/admin/AdminHeader";
import { getEmptyContentData, mapContentData } from "@/utils/mapCotentData";

import { useContentContext } from "@/contexts/contentContext";

import ContentTab from "./ContentTab";
import ContactTab from "./ContactTab";
import FaqTab from "./FaqTab";
import BlogTab from "./BlogTab";
import TermsTab from "./TermsTab";
import ImpressumTab from "./ImpressumTab";
import PrivacyTab from "./PrivacyTab";
import UploadTab from "./UploadTab";
import FileUpload from "../ui/common/FileUpload";


type Props = {};

export default function ContentPage() {
  const [content, setContent] = useState<ContentData>(getEmptyContentData());
  const [activeTab, setActiveTab] = 
  useState<"content" | "upload" | "contacts" | "blog"| "faq" | "terms" 
  | "impressum" | "privacy">("content");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const { token } = useAuth();
  const { data, loading, error, updateContentData, getContentDataService,
    updateBlog, updateFaq, updateTerms, updatePrivacy, updateImpressum
   } = useContent(token || "");

  const { contacts, deleteContact, fetchContactsGroupedByEmail } = useContact();

  const onDelete = async (date: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteContact(date);
      await fetchContactsGroupedByEmail(); // <-- Funktion direkt aus dem Hook
    } catch (error) {
      console.error("Fehler beim Löschen der Nachricht:", error);
    }
  };  

  // Inhalte vom Backend holen
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/admin/login");
        return;
    }

    // Nur ausführen, wenn data vorhanden ist
   if (data) {
      setContent(mapContentData(data));
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
      if (!token) {
        router.push("/admin/login");
        return;
      }
      const result = await updateContentData(content);
      if (result) {
        setMsg("✅ Inhalte gespeichert!");
       
      } else {
        setMsg("❌ Fehler beim Speichern");
      }
    } catch (error) {
      setMsg("⚠️ Server nicht erreichbar");
    }

   
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        router.push("/admin/login");
        return;
      }
      const result = await updateFaq({ faq: content.faq });
      if (result) {
        setMsg("✅ FAQ gespeichert!");
       
      } else {
        setMsg("❌ Fehler beim Speichern");
      }
    } catch (error) {
      setMsg("⚠️ Server nicht erreichbar");
    }
  }

  const handleSaveTerms = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        router.push("/admin/login");
        return;
      }
      const result = await updateTerms(content.termsLong);
      if (result) {
        setMsg("✅ AGB gespeichert!");
       
      } else {
        setMsg("❌ Fehler beim Speichern");
      }
    } catch (error) {
      setMsg("⚠️ Server nicht erreichbar");
    }
  }

  const handleSavePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        router.push("/admin/login");
        return;
      }
      const result = await updatePrivacy(content.privacyLong);
      if (result) {
        setMsg("✅ Datenschutz gespeichert!");
       
      } else {
        setMsg("❌ Fehler beim Speichern");
      }
    } catch (error) {
      setMsg("⚠️ Server nicht erreichbar");
    }
  }

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");  
    try {
      if (!token) {
        router.push("/admin/login");
        return;
      }
      const result = await updateBlog({ blog: content.blog });
      if (result) {
        setMsg("✅ Blog gespeichert!");
       
      } else {
        setMsg("❌ Fehler beim Speichern");
      } 
    } catch (error) {
      setMsg("⚠️ Server nicht erreichbar");
    }
  };

  const handleSaveImpressum = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        router.push("/admin/login");
        return;
      }
      const result = await updateImpressum(content.impressumLong);
      if (result) {
        setMsg("✅ Impressum gespeichert!");
       
      } else {
        setMsg("❌ Fehler beim Speichern");
      }
    } catch (error) {
      setMsg("⚠️ Server nicht erreichbar");
    }
  }

  const onUpload = (fileUrl: string) => {
    // Hier können Sie die Logik zum Aktualisieren des Inhalts mit der neuen Datei-URL implementieren
    setMsg(`✅ Datei hochgeladen: ${fileUrl}`);
    
    // Beispiel: setContent(prev => ({ ...prev, imageUrl: fileUrl }));
  }

  if (error) {
    return <p className="p-6">Fehler beim Laden der Inhalte: {error.message}</p>;
  }

  if (!data) {
    return <p className="p-6">Keine Inhalte gefunden.</p>;
  }

 

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6 w-full">
      <AdminHeader />
     
      <div className="w-full max-w-4xl flex justify-end mb-4">
        <a
          href="/"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
        >
          Zur Webseite
        </a>
      </div>
       <div className="w-full max-w-4xl">
       
  
         {/* Tabs */}
        <div className="w-full max-w-4xl mb-6">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "content" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
              onClick={() => setActiveTab("content")}
            >
              Inhalte bearbeiten
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "upload" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
              onClick={() => setActiveTab("upload")}
            >
              Uploads
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "contacts" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
              onClick={() => setActiveTab("contacts")}
            >
              Kontaktanfragen
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "blog" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
              onClick={() => setActiveTab("blog")}
            >
              Blog verwalten
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "faq" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
              onClick={() => setActiveTab("faq")}
            >
              FAQ verwalten
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "terms" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
              onClick={() => setActiveTab("terms")}
            >
              AGB bearbeiten
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "impressum" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
              onClick={() => setActiveTab("impressum")}
            >
              Impressum bearbeiten
            </button>
            <button
              className={`py-2 px-4 font-semibold ${activeTab === "privacy" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
              onClick={() => setActiveTab("privacy")}
            >
              Datenschutz bearbeiten
            </button>
          </div>
        </div>


       <div>
        {activeTab === "content" && (
          <ContentTab content={content} setContent={setContent} handleSave={handleSave} msg={msg} router={router} />
        )}
        {activeTab === "contacts" && (
          <ContactTab contacts={contacts} onDelete={onDelete} />
        )}
        {activeTab === "blog" && (
          <BlogTab
            blog={content.blog}
            setBlog={newBlog => setContent(prev => ({ ...prev, blog: newBlog }))}
            handleSave={handleSaveBlog}
            msg={msg}
            router={router}
          />
        )}
        {activeTab === "faq" && (
          <FaqTab
            faq={content.faq}
            setFaq={newFaq => setContent(prev => ({ ...prev, faq: newFaq }))}
            handleSave={handleSaveFaq}
            msg={msg}
            router={router}
          />
        )}
        {activeTab === "upload" && <UploadTab onUpload={onUpload} />}
        
        {activeTab === "terms" && (
          <TermsTab content={content} 
          setContent={setContent} 
          handleSave={handleSaveTerms} msg={msg} />
        )}
        {activeTab === "impressum" && (
          <ImpressumTab 
          content={content} 
          setContent={setContent} 
          handleSave={handleSaveImpressum} msg={msg} />
        )}
        {activeTab === "privacy" && (
          <PrivacyTab 
          content={content} 
          setContent={setContent} 
          handleSave={handleSavePrivacy} msg={msg} />
        )}
      </div>
      </div>
       {msg && <p className="mt-4">{msg}</p>}
    </main>
  );
}
