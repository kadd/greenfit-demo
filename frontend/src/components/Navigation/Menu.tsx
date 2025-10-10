"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useContentContext } from "@/contexts/contentContext";
import { useAuth } from "@/hooks/useAuth";
import { useHeader } from "@/hooks/useHeader";
import HamburgerButton from "./HamburgerButton";
import OverlayMenu from "./OverlayMenu";
import { HeaderData } from "@/types/header";
import { NavigationItem } from "@/types/navigation";
import { mapHeaderData, getEmptyHeaderData } from "@/utils/mapHeaderData";

import NavigationLinks from "./NavigationLinks";

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { content } = useContentContext();
  const { header } = useHeader(getEmptyHeaderData());
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [router.asPath]);

  console.log("Content in Menu:", content);

  if (!content) return null;

  return (
  <header className="w-full bg-green-700 shadow-lg fixed top-0 left-0 z-40">
    <nav className="grid grid-cols-[auto,1fr,auto] items-center px-4 py-3">
        {/* Logo ganz links */}
        <div className="flex justify-start">
          <a href="/" className="text-2xl font-extrabold text-white tracking-wide hover:underline">
            GreenFit
          </a>
        </div>

      {/* Navigation mittig */}
        <div className="hidden md:flex justify-center items-center space-x-8">
          <NavigationLinks />
        </div>

        {/* Dashboard/Login ganz rechts */}
        <div className="hidden md:flex justify-end items-center space-x-2">
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
        <div className="md:hidden flex justify-end items-center col-span-3">
          <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} isOpen={menuOpen} />
        </div>
      </nav>

      {/* Overlay-Menü für Mobil */}
      {menuOpen && (
        <OverlayMenu
          isAuthenticated={isAuthenticated}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}