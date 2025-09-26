"use client";

type Props = {
  content: string;
};

export default function AGB({ content }: Props) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-400 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Datenschutzerklärung</h1>
      <div className="max-w-3xl bg-white p-6 rounded-lg shadow-md text-gray-800">

          <div className="prose prose-lg">
            <p>Allgemeine Geschäftsbedingungen (AGB)

1. Geltungsbereich  
Diese Allgemeinen Geschäftsbedingungen gelten für alle Leistungen und Angebote von GreenFit.

2. Vertragsschluss  
Ein Vertrag kommt durch die Buchung einer Dienstleistung und unsere Bestätigung zustande.

3. Leistungen  
GreenFit bietet Personal Training, Ernährungsberatung und Gruppenkurse an. Die genauen Inhalte ergeben sich aus dem jeweiligen Angebot.

4. Zahlungsbedingungen  
Die Vergütung ist nach Rechnungsstellung innerhalb von 14 Tagen zu zahlen.

5. Stornierung  
Eine Stornierung ist bis 24 Stunden vor dem Termin kostenfrei möglich. Danach wird die volle Gebühr fällig.

6. Haftung  
GreenFit haftet nur für Vorsatz und grobe Fahrlässigkeit. Die Teilnahme erfolgt auf eigene Verantwortung.

7. Datenschutz  
Personenbezogene Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.

8. Schlussbestimmungen  
Sollten einzelne Bestimmungen unwirksam sein, bleibt die Gültigkeit der übrigen AGB unberührt.

Stand: April 2025</p></div>
   
        </div>
    </main> 
  );
}