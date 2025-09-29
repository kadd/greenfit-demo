"use client";
import FaqPage from "@/components/Pages/FaqPage";
import { useContentContext } from "@/contexts/contentContext";

export default function Faq() {
  const content = useContentContext();
  if (!content || !content.faq) {
    return <div className="p-6 text-center text-gray-500">FAQ wird geladen...</div>;
  }
  return <FaqPage faq={content.faq} />;
}