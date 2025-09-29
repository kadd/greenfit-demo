import React from "react";

type GalleryProps = {
  files: Array<{ url?: string; name?: string } | string>;
  title?: string;
  area?: string;
  onDelete?: (file: any, area?: string) => void;
};

export default function Gallery({ files, title, area, onDelete }: GalleryProps) {
  if (!files || files.length === 0) return null;
    const pathToUploads = process.env.NEXT_PUBLIC_UPLOADS_URL || "";

  return (
    <section className="w-full py-8">
      {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {files.map((file, idx) => {
          const url = typeof file === "string" ? `${pathToUploads}/${area}/${file}` : file.url || `${pathToUploads}/${file.name}`;
          const name = typeof file === "string" ? file : file.name;
          return (
            <div
              key={idx}
              className="relative flex flex-col items-center group rounded-xl overflow-hidden shadow-lg bg-white"
            >
              <img
                src={url}
                alt={name}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-2 py-2">
                <span className="text-white text-sm font-semibold">{name}</span>
              </div>
              {/* Optional: Overlay mit Icon beim Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0122 9.618V17a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h7.382a2 2 0 011.447.724L17 8" />
                </svg>
                <button
                    onClick={() => onDelete && onDelete(file, area)}
                    className="bg-red-600 rounded-full p-2 hover:bg-red-800 transition"
                    title="Bild löschen"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
              
            </div>
          );
        })}
      </div>
    </section>
  );
}