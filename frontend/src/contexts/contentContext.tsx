"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

import { getContentData as getContentDataService } from "@/services/content";

import { ContentData } from "@/types/contentData";

const ContentContext = createContext<ContentData | null>(null);

export const useContentContext = () => useContext(ContentContext);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Beispiel: Content vom Backend laden
    getContentDataService()
      .then((data) => setContent(data))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
};