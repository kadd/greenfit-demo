"use client";
import React from "react";

import { Privacy } from "@/types/privacy";
import { usePrivacy } from "@/hooks/usePrivacy";

type Props = {
  message?: string;
};

export default function PrivacyPolicyPage({ message }: Props) {
  const { privacy, loading, error } = usePrivacy();

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Datenschutz wird geladen...</div>;
  }

  if (!privacy) {
    return <div className="p-6 text-center text-gray-500">Keine Datenschutzbestimmungen verfügbar.</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Fehler: {error}</div>;
  }

  const sections = privacy.sections;
  const { title, description } = privacy;
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-100 py-12 px-4 pt-24">
      <section className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Datenschutzerklärung</h1>
        <div className="prose prose-lg text-gray-800 mx-auto">
          {sections && sections.length > 0 ? (
            sections.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
                <p>{section.text}</p>
              </div>
            ))
          ) : (
            <p>Keine Datenschutz-Abschnitte vorhanden.</p>
          )}
        </div>
        {message && (
          <div className="mt-4 text-green-700 text-center font-semibold">{message}</div>
        )}
      </section>
    </main>
  );
}