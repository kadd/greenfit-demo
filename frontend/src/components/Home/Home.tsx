"use client";
import { use, useEffect, useState } from "react";
import { useContact } from "@/hooks/useContactRequests";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useContent } from "@/hooks/useContent";
import { useServices } from "@/hooks/useServices";
import { useGCSUpload } from "@/hooks/useGCSUpload";

import { ContentData } from "@/types/contentData";
import { ServiceData } from "@/types/service";

import HamburgerButton from "@/components/Navigation/HamburgerButton";
import OverlayMenu from "@/components/Navigation/OverlayMenu";
import ScrollToTopButton from "@/components/Navigation/ScrollToTopButton";

import ContactForm from "@/components/Home/contact/ContactForm";
import ContentSection from "@/components/Home/Sections/ContentSection";
import GallerySection from "@/components/Home/Sections/GallerySection";
import TeamSection from "@/components/Home/Sections/TeamSection";
import TestimonialsSection from "@/components/Home/Sections/TestimonialsSection";
import FaqPage from "@/components/Pages/FaqPage";
import Footer from "@/components/Footer/Footer";

import { getEmptyContentData } from "@/utils/mapCotentData";
import { getPhotoUrl } from "@/utils/uploads";

import Image from "next/image";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [content, setContent] = useState<ContentData>(getEmptyContentData());
  

  const [msg, setMsg] = useState("");

  const { isAuthenticated } = useAuth();
  const { data, loading, error } = useContent("");

  const emptyServices: ServiceData = { label: "", description: "", content: {} };
  const { services = emptyServices } = useServices();

  const { gallery } = useGCSUpload();
  
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

    useEffect(() => {
      if (window.location.hash) {
        const el = document.getElementById(window.location.hash.substring(1));
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, []);


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

  if (error) {
    return <p className="p-6 text-red-500">Fehler beim Laden der Inhalte: {error?.message || String(error)}</p>;
  }

  if (!content) {
    return <p className="p-6 text-red-500">Keine Inhalte verfügbar.</p>;
  }

  if (!services || !services.content || Object.keys(services.content).length === 0) {
    return <p className="p-6 text-red-500">Keine Leistungsdaten verfügbar.</p>;
  }

  // Funktion zum Scrollen nach oben

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <>
    
   
      <main className="flex flex-col items-center">
         {/* Header */}
        
        {menuOpen && (
            <OverlayMenu isAuthenticated={isAuthenticated} onClose={() => setMenuOpen(false)} />
        )}
        {showScrollTop && (
            <ScrollToTopButton onClick={scrollToTop} />
        )}

        {/* Hero */}
        <ContentSection id="hero" title="" className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-200 p-6 text-center relative">
          {/* Optional: Hintergrundbild */}
          {/* <Image src="/hero.jpg" alt="GreenFit Studio" fill className="object-cover opacity-20 absolute inset-0 z-0" /> */}
          <div className="relative z-10">
            <h1 className="text-5xl font-extrabold text-green-700 mb-4 drop-shadow-lg">GreenFit</h1>
            <p className="text-lg text-gray-700 mb-8">
              Personal Training Studio in Hamburg – Fit werden mit individueller Betreuung
            </p>
            <a
              href="#contact"
              className="px-8 py-4 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition transform hover:scale-105 font-bold text-lg"
            >
              Jetzt Termin anfragen
            </a>
          </div>
        </ContentSection>

        {/* Über uns */}
        <ContentSection id="about" title={`${content.about.label}`} className="max-w-3xl mx-auto">
            <p className="text-gray-700 text-center lg:text-lg">
                {content.about.content}
            </p>
        </ContentSection>

        {/* Team */}
        <ContentSection id="team" title={`${content.team.label}`} className="max-w-5xl mx-auto my-8">
           <TeamSection team={content.team} />
        </ContentSection>

        {/* Kundenstimmen */}
        <ContentSection id="testimonials" title={`${content.testimonials.label}`} className="max-w-4xl mx-auto my-8">
           <TestimonialsSection testimonials={content.testimonials} />
        </ContentSection>

        {/* Kontakt */}
        <ContentSection id="contact" title={`${content.contact.label}`} className="max-w-3xl mx-auto bg-green-50 rounded-xl shadow p-8 my-8">
            <p className="text-gray-700 text-center mb-4">
              Bei Fragen oder zur Terminvereinbarung erreichen Sie uns über das <a href="#contact" className="text-green-600 underline">Kontaktformular</a>.
            </p>
       

      
          <ContactForm info_message="Schreiben Sie uns – wir melden uns schnellstmöglich zurück!" />
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

        <GallerySection id="gallery"
          files={gallery || []}
          title={"Impressionen"}
        />

        

      {/* Leistungen */}
       <ContentSection id="services" title={services.label} className="max-w-4xl mx-auto my-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {Object.entries(services.content).map(([key, value]) => (
            <div key={key} className="p-6 bg-white rounded-lg shadow flex flex-col items-center">
              {/* Optional: Icon */}
              {/* <Image src={`/icons/${key}.svg`} alt={value.label} width={48} height={48} className="mb-2" /> */}
              <img src={getPhotoUrl('services', value.image)} alt={value.label} width={48} height={48} className="mb-2" />
              <strong className="text-green-700 text-xl mb-2">{value.label}</strong>
              <span className="text-gray-700 text-center">{value.content}</span>
            </div>
          ))}
        </div>
      </ContentSection>
      
    

     
    </main>
    {/* Footer */}
    <Footer />
    </>
  );
}
