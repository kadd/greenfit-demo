"use client";

type Section = {
  heading: string;
  text: string;
};

type Props = {
  sections?: Section[];
};

export default function TermsPage({ sections }: Props) {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-100 py-12 px-4 pt-24">
      <section className="max-w-3xl w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <div className="prose prose-lg text-gray-800 mx-auto">
          {sections && sections.length > 0 ? (
            sections.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
                <p>{section.text}</p>
              </div>
            ))
          ) : (
            <p>Keine AGB-Abschnitte vorhanden.</p>
          )}
          <div className="mt-8 text-right text-gray-500">Stand: April 2025</div>
        </div>
      </section>
    </main>
  );
}