"use client";

import { useState } from "react";
import { useFAQ } from "@/hooks/useFAQ";
import { FAQ, FAQItem } from "@/types/faq";


interface FaqPageProps {
  faq: FAQ;
}


export default function FaqPage() {
const { faqs, loading, error } = useFAQ();

  if (loading) {
    return <div className="p-6 text-center text-gray-500">FAQ wird geladen...</div>;
  }

  if (!faqs || faqs.length === 0) {
    return <div className="p-6 text-center text-gray-500">Keine FAQ verfügbar.</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Fehler: {error}</div>;
  }
  return (
    <section className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">{faqs.title}</h1>
      <ul className="space-y-6">
        {faqs.items.map((item: FAQItem, idx) => (
          <li key={idx} className="bg-white rounded shadow p-6">
            <h2 className="font-semibold text-lg mb-2 text-green-800">{item.question}</h2>
            <p className="text-gray-700">{item.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}