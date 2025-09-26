import React from "react";

type Props = {
  isAuthenticated: boolean;
  onClose: () => void;
};

export default function OverlayMenu({ isAuthenticated, onClose }: Props) {
  return (
    <nav className="fixed inset-0 bg-black bg-opacity-60 z-40 flex flex-col items-center justify-center">
      <button
        className="absolute top-8 right-8 text-white text-3xl"
        onClick={onClose}
        aria-label="Menü schließen"
      >
        &times;
      </button>
      <ul className="space-y-8 text-2xl font-bold text-white">
        <li>
          <a href="#about" onClick={onClose}>
            Über uns
          </a>
        </li>
        <li>
          <a href="#services" onClick={onClose}>
            Leistungen
          </a>
        </li>
        <li>
          <a href="#contact" onClick={onClose}>
            Kontakt
          </a>
        </li>
        {isAuthenticated ? (
          <li>
            <a href="/admin/dashboard" onClick={onClose}>Dashboard</a>
          </li>
        ) : (
          <li>
            <a href="/admin/login" onClick={onClose}>Login</a>
          </li>
        )}
      </ul>
    </nav>
  );
}