import React from "react";

import { ContentData } from "@/types/contentData";
import { useContentContext } from "@/contexts/contentContext";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  isAuthenticated: boolean;
  onClose: () => void;
};

export default function OverlayMenu({ isAuthenticated, onClose }: Props) {
  const content = useContentContext();
  if (!content) return null;

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
        {isAuthenticated ? (
          <li>
            <a href="/admin/dashboard" onClick={onClose}>Dashboard</a>
          </li>
        ) : (
          <li>
            <a href="/admin/login" onClick={onClose}>Login</a>
          </li>
        )}
       {content.header?.navigation &&
          Object.entries(content.header.navigation).map(([key, nav]) => (
            <a
              key={key}
              href={nav.href}
              className="px-3 py-2 rounded text-white hover:bg-green-800 transition font-semibold"
            >
              {nav.label}
            </a>
          ))
        }
       
        
      </ul>
    </nav>
  );
}