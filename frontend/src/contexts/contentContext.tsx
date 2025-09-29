"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getContentData as getContentDataService } from "@/services/content";
import { ContentData } from "@/types/contentData";

type ContentContextType = {
  content: ContentData | null;
  setContent: React.Dispatch<React.SetStateAction<ContentData | null>>;
  loading: boolean;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContentContext = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContentContext must be used within ContentProvider");
  return ctx;
};

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getContentDataService()
      .then((data) => {
        console.log("Loaded content:", data);
        setContent(data);
      })
      .catch((err) => {
        console.error("Content loading error:", err);
        setContent(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ContentContext.Provider value={{ content, setContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};