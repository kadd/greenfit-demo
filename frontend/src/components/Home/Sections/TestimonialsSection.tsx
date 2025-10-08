import React from "react";

export default function TestimonialsSection({ testimonials }) {
  if (!testimonials || !testimonials.items || testimonials.items.length === 0) return null;

  return (
    <section id="testimonials" className="py-16 bg-green-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{testimonials.label || "Kundenstimmen"}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              {item.photoSrc && (
                <img
                  src={item.photoSrc}
                  alt={item.photoAlt || item.name}
                  className="w-20 h-20 rounded-full mb-4 object-cover"
                />
              )}
              <p className="text-gray-700 italic mb-4">"{item.feedback}"</p>
              <span className="font-semibold text-green-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}