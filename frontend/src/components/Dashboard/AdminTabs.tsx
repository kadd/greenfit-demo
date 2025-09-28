import React, { useState } from "react";

type Tab = "content" | "contacts";

export default function AdminTabs({ children }: { children?: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>("content");

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-semibold ${activeTab === "content" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
          onClick={() => setActiveTab("content")}
        >
          Inhalte
        </button>
        <button
          className={`py-2 px-4 font-semibold ${activeTab === "contacts" ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
          onClick={() => setActiveTab("contacts")}
        >
          Kontaktanfragen
        </button>
      </div>
      <div>
        {activeTab === "content" && (
          <div>
            {/* Hier kommt dein Content-Formular */}
            {children}
          </div>
        )}
        {activeTab === "contacts" && (
          <div>
            {/* Hier kannst du die Kontaktanfragen anzeigen */}
            {/* <ContactMessages /> */}
          </div>
        )}
      </div>
    </div>
  );
}