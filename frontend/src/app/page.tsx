"use client";
import { use, useEffect, useState } from "react";
import { useContact } from "@/hooks/useContact";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { contactSentStatus, sendContact } = useContact();
  const { isAuthenticated } = useAuth();

  // Zustand für Sichtbarkeit des Buttons
  const [showScrollTop, setShowScrollTop] = useState(false);

  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/services")
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

   useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      
      {/* Hamburger-Menü */}
      <button
        className="fixed top-6 left-6 z-50 flex flex-col justify-center items-center w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menü öffnen"
      >
        <span className="block w-6 h-0.5 bg-green-700 mb-1"></span>
        <span className="block w-6 h-0.5 bg-green-700 mb-1"></span>
        <span className="block w-6 h-0.5 bg-green-700"></span>
      </button>

      {/* Overlay-Menü */}
      {menuOpen && (
        <nav className="fixed inset-0 bg-black bg-opacity-60 z-40 flex flex-col items-center justify-center">
          <button
            className="absolute top-8 right-8 text-white text-3xl"
            onClick={() => setMenuOpen(false)}
            aria-label="Menü schließen"
          >
            &times;
          </button>
          <ul className="space-y-8 text-2xl font-bold text-white">
            <li>
              <a href="#about" onClick={() => setMenuOpen(false)}>
                Über uns
              </a>
            </li>
            <li>
              <a href="#services" onClick={() => setMenuOpen(false)}>
                Leistungen
              </a>
            </li>
            <li>
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Kontakt
              </a>
            </li>
            {isAuthenticated ? (
            <li>
              <a href="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</a>
            </li>
            ) : (
            <li>
              <a href="/admin/login" onClick={() => setMenuOpen(false)}>Login</a>
            </li>
            )}
          </ul>
        </nav>
      )}
      {/* Scroll-to-top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition flex items-center justify-center"
          aria-label="Nach oben scrollen"
        >
          {/* Pfeil-Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
      {/* Scroll-to-top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition flex items-center justify-center"
          aria-label="Nach oben scrollen"
        >
          {/* Pfeil-Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Hero */}
      <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-100 to-green-200 p-6 text-center">
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

      </section>
      

      {/* Über uns */}
      <section id="about" className="max-w-3xl py-20 px-6">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Über uns</h2>
        <p className="text-gray-700 text-center">
          GreenFit bietet seit über 10 Jahren individuelles Personal Training in Hamburg.
          Unser Ziel: Deine Fitnessziele effektiv und nachhaltig erreichen – mit Spaß und Motivation.
        </p>
      </section>

      <section id="contact" className="flex items-center justify-center py-12">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
            Kontakt
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Schreiben Sie uns – wir melden uns schnellstmöglich zurück!
          </p>
          <form
            method="post"
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4"
          >
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
            {contactSentStatus && (
              <div className="mt-4 text-center text-green-700 font-semibold">
                {contactSentStatus}
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Zurück
                </button>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Leistungen */}
      <section id="services" className="bg-green-50 w-full py-20 px-6">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Unsere Leistungen</h2>
      <ul className="max-w-xl mx-auto space-y-4 text-gray-700">
        {services.map(s => (
          <li key={s.id} className="p-4 bg-white rounded-lg shadow">
            <strong>{s.name}</strong> – {s.description}
          </li>
        ))}
      </ul>
    </section>
    

      {/* Backend Test */}
      <p className="py-10 text-gray-500">API: {message}</p>
      <footer className="bg-gray-800 text-white text-center py-6">
        <p>&copy; 2025 GreenFit</p>
        <p className="mt-2 text-sm">
          <a href="/admin/login" className="text-green-400 hover:underline">
            Admin Login
          </a>
        </p>
      </footer>

    </main>
  );
}
