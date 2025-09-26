"use client";
import { use, useEffect, useState } from "react";
import { useContact } from "@/hooks/useContact";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useContent } from "@/hooks/useContent";

import { ContentData } from "@/types/contentData";

import HamburgerButton from "@/components/Navigation/HamburgerButton";
import OverlayMenu from "@/components/Navigation/OverlayMenu";
import ScrollToTopButton from "@/components/Navigation/ScrollToTopButton";
import Menu from "@/components/Navigation/Menu";
import FormSection from "@/components/FormSection";
import ContentSection from "@/components/ContentSection";

import Image from "next/image";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
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
  });
  const [msg, setMsg] = useState("");

  const { contactSentStatus, sendContact } = useContact();
  const { isAuthenticated } = useAuth();
  const { data, loading, error } = useContent("");

  // Zustand für Sichtbarkeit des Buttons
  const [showScrollTop, setShowScrollTop] = useState(false);

  const router = useRouter();
 

  // Inhalte vom Backend holen
  useEffect(() => {
    if (data) {
      setContent(prev => ({
        ...prev,
        ...data, // übernimmt alle Felder aus data!
      }));
      setMsg("");
      return;
    }

    if (!loading && !data) {
      setMsg("⚠️ Keine Inhalte gefunden");
    }
    if (error) {
      setMsg("⚠️ Inhalte konnten nicht geladen werden");
    }
  }, [data, loading, error]);


  // Scroll-Event Listener für Button
   useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return <p className="p-6">Lade Inhalte...</p>;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const form = e.currentTarget;
      const data = {
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      };
      await sendContact(data);
    }

  return (

    <main className="flex flex-col items-center">
         {/* Header */}
          <header className="w-full bg-green-700 text-white py-4 text-center font-bold text-xl">
            GreenFit
          </header>
        {/* Menü */}

        <Menu /> {/* Desktop-Menü */} 
        <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} isOpen={menuOpen} />
        {menuOpen && (
            <OverlayMenu isAuthenticated={isAuthenticated} onClose={() => setMenuOpen(false)} />
        )}
        {showScrollTop && (
            <ScrollToTopButton onClick={scrollToTop} />
        )}

        {/* Hero */}
        <ContentSection id="hero" title="" className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-200 p-6 text-center">
            {/* Hero-Bereich */}
            <h1 className="text-5xl font-extrabold text-green-700 mb-4">GreenFit</h1>
            <p className="text-lg text-gray-700 mb-8">
                Personal Training Studio in Hamburg – Fit werden mit individueller Betreuung
            </p>
        <a
            href="#contact"
            className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition"
        >
            Jetzt Termin anfragen
        </a>
        </ContentSection>

        {/* Über uns */}
        <ContentSection id="about" title="Über uns" className="max-w-3xl mx-auto">
            <p className="text-gray-700 text-center">
                GreenFit bietet seit über 10 Jahren individuelles Personal Training in Hamburg.
                Unser Ziel: Deine Fitnessziele effektiv und nachhaltig erreichen – mit Spaß und Motivation.
            </p>
        </ContentSection>

        {/* Kontakt */}
        <ContentSection id="contact" title="Kontakt" className="max-w-3xl mx-auto">
            <p className="text-gray-700 text-center">
                Bei Fragen oder zur Terminvereinbarung erreichen Sie uns über das <a href="#contact" className="text-green-600 underline">Kontaktformular</a>.
            </p>
        </ContentSection>

        {/* Kontaktformular */}
        <FormSection title="Kontakt" message="Schreiben Sie uns – wir melden uns schnellstmöglich zurück!" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Ihr Name"
            className="p-2 border rounded text-gray-700"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Ihre E-Mail"
            className="p-2 border rounded text-gray-700"
            required
          />
          <textarea
            name="message"
            rows={5}
            placeholder="Ihre Nachricht"
            className="p-2 border rounded text-gray-700"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Nachricht senden
          </button>
        </FormSection>

     

      {/* Leistungen */}
      <ContentSection id="services" title="Unsere Leistungen" className="max-w-3xl mx-auto">
        <ul className="space-y-4 text-gray-700">
          {Object.entries(content.services).map(([key, value]) => (
            <li key={key} className="p-4 bg-white rounded-lg shadow">
              <strong>{value.label}</strong> – {value.content}
            </li>
          ))}
        </ul>
      </ContentSection>
    

     
    </main>
  );
}
