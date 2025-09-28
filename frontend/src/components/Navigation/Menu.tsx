"use client";
import React, { useState } from "react";
import { useContentContext } from "@/contexts/contentContext";
import { useAuth } from "@/hooks/useAuth";
import HamburgerButton from "./HamburgerButton";
import OverlayMenu from "./OverlayMenu";

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const content = useContentContext();
  const { isAuthenticated } = useAuth();
  if (!content) return null;

  return (
    <header className="w-full bg-green-700 shadow-lg fixed top-0 left-0 z-40">
    <nav className="max-w-6xl mx-auto flex items-center px-4 py-3">
        {/* Logo ganz links */}
        <div className="basis-1/4 flex justify-start">
          <a href="/" className="text-2xl font-extrabold text-white tracking-wide hover:underline">
            GreenFit
          </a>
        </div>

        {/* Navigation mittig */}
        <div className="basis-2/4 hidden md:flex justify-center space-x-8">
          {Object.entries(content.header).map(([key, value]) => (
            <a
              key={key}
              href={
                key === "home"
                  ? "/"
                  : key !== "about" && key !== "services" && key !== "contact"
                  ? `/${key}`
                  : `#${key}`
              }
              className="px-3 py-2 rounded text-white hover:bg-green-800 transition font-semibold"
            >
              {value}
            </a>
          ))}
        </div>

        {/* Dashboard/Login ganz rechts */}
        <div className="basis-1/4 hidden md:flex justify-end items-center space-x-2">
          {isAuthenticated ? (
            <a
              href="/admin/dashboard"
              className="bg-green-900 text-white px-4 py-2 rounded font-bold shadow hover:bg-green-800 transition"
            >
              Dashboard
            </a>
          ) : (
            <a
              href="/admin/login"
              className="bg-white text-green-700 px-4 py-2 rounded font-bold shadow hover:bg-green-100 transition"
            >
              Login
            </a>
          )}
        </div>

        {/* Hamburger für Mobil */}
        <div className="md:hidden flex items-center">
          <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} isOpen={menuOpen} />
        </div>
      </nav>

      {/* Overlay-Menü für Mobil */}
      {menuOpen && (
        <OverlayMenu
          isAuthenticated={isAuthenticated}
          onClose={() => setMenuOpen(false)}
          headerLinks={content.header}
        />
      )}
    </header>
  );
}