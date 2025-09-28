"use client";
import React from "react";

import { ContentData } from "@/types/contentData";
import { useContentContext } from "@/contexts/contentContext";
import { useAuth } from "@/hooks/useAuth";


export default function Menu() {
  const content = useContentContext();
  const { isAuthenticated } = useAuth();
    if (!content) return null;
  return (
    <nav className="w-full bg-green-700 text-white p-4 flex justify-between items-center">
     
    
      <div className="flex space-x-4">

        {Object.entries(content.header).map(([key, value]) => (
          <a key={key} href={`#${key}`} className="mx-2 hover:underline">
            {value}
          </a>
        ))}
        
       
      </div>
      <div>
        {isAuthenticated ? (
          <a href="/admin/dashboard" className="bg-green-900 text-white px-4 py-2 rounded font-bold">Dashboard</a>
        ) : (
          <a
          href="/admin/login"
          className="bg-white text-green-700 px-4 py-2 rounded font-bold hover:bg-green-100 transition"
        >
          Login
        </a>
        )}
      </div>
    </nav>
  );
}