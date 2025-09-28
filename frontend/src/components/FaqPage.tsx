"use client";

type FAQItem = {
  question: string;
  answer: string;
};

type Props = {
  faq: {
    title: string;
    items: FAQItem[];
  };
};

export default function FaqPage({ faq }: Props) {
  return (
    <section className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">{faq.title}</h1>
      <ul className="space-y-6">
        {faq.items.map((item, idx) => (
          <li key={idx} className="bg-white rounded shadow p-6">
            <h2 className="font-semibold text-lg mb-2 text-green-800">{item.question}</h2>
            <p className="text-gray-700">{item.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}