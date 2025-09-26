"use client";
import React from "react";

import { ContentData } from "@/types/contentData";
import { useContentContext } from "@/contexts/contentContext";
import { useAuth } from "@/hooks/useAuth";


export default function Menu() {
  const content = useContentContext();
    if (!content) return null;
  return (
   <nav className="hidden md:flex w-full bg-green-600 text-white p-4 flex justify-between items-center">
      <a href="/" className="text-lg font-bold hover:underline">GreenFit</a>
    
      <div>
        {Object.entries(content).map(([key, value]) => (
          <a key={key} href={`#${key}`} className="mx-2 hover:underline">
            {value.label}
          </a>
        ))}
      </div>
    </nav>
  );
}