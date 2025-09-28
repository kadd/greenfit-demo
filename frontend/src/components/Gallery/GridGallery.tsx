import React from "react";

type ImageItem = {
  src: string;
  title?: string;
  description?: string;
};

export default function ImageSection({ images, title }: { images: ImageItem[]; title?: string }) {
  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      {title && <h2 className="text-3xl font-bold text-center text-green-700 mb-8">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {images.map((img, idx) => (
          <div key={idx} className="bg-white rounded shadow p-4 flex flex-col items-center">
            <img src={img.src} alt={img.title || ""} className="w-full h-48 object-cover rounded mb-4" />
            {img.title && <h3 className="font-semibold text-lg mb-2">{img.title}</h3>}
            {img.description && <p className="text-gray-600 text-center">{img.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}