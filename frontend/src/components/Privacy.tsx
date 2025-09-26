"use client";
import React, { useState, useEffect } from "react";



export default function PrivacyPolicyPage({ content, message }: Props) {
   

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-400 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Datenschutzerklärung</h1>
      <div className="max-w-3xl bg-white p-6 rounded-lg shadow-md text-gray-800">

          <div className="prose prose-lg">
            <p>Datenschutzerklärung

1. Verantwortlicher
Verantwortlich für die Datenverarbeitung auf dieser Website ist:
GreenFit
Musterstraße 1
12345 Musterstadt
E-Mail: kontakt@greenfit-demo.de

2. Erhebung und Speicherung personenbezogener Daten
Beim Besuch unserer Website werden automatisch Informationen (z.B. IP-Adresse, Datum und Uhrzeit des Zugriffs) erfasst. Diese Daten dienen ausschließlich der technischen Bereitstellung und Sicherheit der Website.

Wenn Sie unser Kontaktformular nutzen, speichern wir die von Ihnen eingegebenen Daten (Name, E-Mail-Adresse, Nachricht) zur Bearbeitung Ihrer Anfrage. Eine Weitergabe an Dritte erfolgt nicht.

3. Verwendung von Cookies
Unsere Website verwendet keine Cookies zur Nachverfolgung oder Analyse.

4. Ihre Rechte
Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten, deren Berichtigung, Löschung oder Einschränkung der Verarbeitung. Sie können sich jederzeit an uns wenden.

5. Kontakt
Bei Fragen zum Datenschutz erreichen Sie uns unter: kontakt@greenfit-demo.de

6. Änderungen
Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen.</p>
          

            </div>
        </div>
    </main>
  );
}