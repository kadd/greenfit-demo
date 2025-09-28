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
import ContactForm from "@/components/ui/contact/ContactForm";
import ContentSection from "@/components/ContentSection";

import Footer from "@/components/Footer";

import { getEmptyContentData } from "@/utils/mapCotentData";

import Image from "next/image";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [content, setContent] = useState<ContentData>(getEmptyContentData());

  const [msg, setMsg] = useState("");

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


  return (
    <>
      <header className="w-full bg-green-700 text-white py-4 text-center font-bold text-xl">
        <div className="flex flex-col items-center">
         <a href="/" className="text-2xl font-bold hover:underline">GreenFit</a>
          {/* Menü */}
          <Menu /> {/* Desktop-Menü */}
          <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} isOpen={menuOpen} />
        </div>
      </header>
   
      <main className="flex flex-col items-center">
         {/* Header */}
        
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
        <ContentSection id="about" title={`${content.about.label}`} className="max-w-3xl mx-auto">
            <p className="text-gray-700 text-center">
                {content.about.content}
            </p>
        </ContentSection>

        {/* Kontakt */}
        <ContentSection id="contact" title={`${content.contact.label}`} className="max-w-3xl mx-auto">
            <p className="text-gray-700 text-center">
                Bei Fragen oder zur Terminvereinbarung erreichen Sie uns über das <a href="#contact" className="text-green-600 underline">Kontaktformular</a>.
            </p>
        </ContentSection>

        {/* Kontaktformular */}
        <ContactForm info_message="Schreiben Sie uns – wir melden uns schnellstmöglich zurück!" />

        {/* Kontaktinformationen */}

        <ContentSection id="contact-info" title={`${content.contact.label}`} className="max-w-3xl mx-auto">
            <div className="text-center text-gray-700 space-y-2">
                {content.contact.content.email && (
                    <p>
                        <strong>{content.contact.content.email.label}:</strong>{" "}
                        <a href={`mailto:${content.contact.content.email.content}`} className="text-green-600 underline">
                            {content.contact.content.email.content}
                        </a>
                    </p>
                )}
                {content.contact.content.phone && (
                    <p>
                        <strong>{content.contact.content.phone.label}:</strong>{" "}
                        <a href={`tel:${content.contact.content.phone.content}`} className="text-green-600 underline">
                            {content.contact.content.phone.content}
                        </a>
                    </p>
                )}
            </div>
        </ContentSection>

        

      {/* Leistungen */}
        <ContentSection id="services" title={`${content.services.label}`} className="max-w-3xl mx-auto">
             <ul className="space-y-4 text-gray-700">
          {Object.entries(content.services.content).map(([key, value]) => (
            <li key={key} className="p-4 bg-white rounded-lg shadow">
              <strong>{value.label}</strong> – {value.content}
            </li>
          ))}
        </ul>
        </ContentSection>
      
    

     
    </main>
    {/* Footer */}
    <Footer />
    </>
  );
}
