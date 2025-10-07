"use client";
import React from "react";
import { Impressum } from "@/types/impressum";
import { useImpressum } from "@/hooks/useImpressum";

type Props = {
  impressum?: Impressum;
};

export default function ImpressumPage({ impressum }: Props) {
  const { impressum: impressumData, loading, error } = useImpressum();
  const data = impressum || impressumData || {};
  const { title, description, company, address, email, phone, sections } = data;

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Impressum wird geladen...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Fehler: {error}</div>;
  }

  if (!sections || sections.length === 0) {
    return <div className="p-6 text-center text-gray-500">Kein Impressum hinterlegt.</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-100 py-12 px-4 pt-24">
      <section className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">{title || "Impressum"}</h1>
        {description && (
          <p className="text-lg text-gray-700 mb-6 text-center">{description}</p>
        )}
        <div className="mb-8">
          {company && (
            <div className="mb-2">
              <span className="font-semibold">Firma:</span> {company}
            </div>
          )}
          {address && (
            <div className="mb-2">
              <span className="font-semibold">Adresse:</span> {address}
            </div>
          )}
          {email && (
            <div className="mb-2">
              <span className="font-semibold">E-Mail:</span> <a href={`mailto:${email}`} className="text-green-700 underline">{email}</a>
            </div>
          )}
          {phone && (
            <div className="mb-2">
              <span className="font-semibold">Telefon:</span> {phone}
            </div>
          )}
        </div>
        <div className="prose prose-lg text-gray-800 mx-auto">
          {sections.map((section, idx) => (
            <div key={section.id || idx} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
              <pre className="whitespace-pre-line">{section.text}</pre>
            </div>
          ))}
          <div className="mt-8 text-right text-gray-500">Stand: April 2025</div>
        </div>
      </section>
    </main>
  );
}