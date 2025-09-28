"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useContentContext } from "@/contexts/contentContext";
import { useAuth } from "@/hooks/useAuth";
import HamburgerButton from "./HamburgerButton";
import OverlayMenu from "./OverlayMenu";

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const content = useContentContext();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.substring(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [router.asPath]);

  if (!content) return null;

  return (
    <header className="w-full bg-green-700 shadow-lg fixed top-0 left-0 z-40">
    <nav className="w-full grid grid-cols-3 items-center px-4 py-3">
        {/* Logo ganz links */}
        <div className="flex justify-start">
          <a href="/" className="text-2xl font-extrabold text-white tracking-wide hover:underline">
            GreenFit
          </a>
        </div>

        {/* Navigation mittig */}
        <div className="hidden md:flex justify-center items-center space-x-8">
          {content.header.navigation &&
            Object.entries(content.header.navigation).map(([key, nav]) => (
              nav.href.startsWith("/#") ? (
                <Link key={key} href={nav.href} scroll={true}>
                  <span className="px-3 py-2 rounded text-white hover:bg-green-800 transition font-semibold cursor-pointer whitespace-nowrap flex items-center">
                    {nav.label}
                  </span>
                </Link>
              ) : (
                <a
                  key={key}
                  href={nav.href}
                  className="px-3 py-2 rounded text-white hover:bg-green-800 transition font-semibold whitespace-nowrap flex items-center"
                >
                  {nav.label}
                </a>
              )
            ))}
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
        <div className="md:hidden flex items-center col-span-3 justify-end">
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