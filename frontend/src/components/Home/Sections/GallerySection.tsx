import Image from "next/image";

import { getPhotoUrl } from "@/utils/uploads";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

type GalleryImage = {
  src: string;
  alt?: string;
  title?: string;
};

type Props = {
  id?: string;
  images: GalleryImage[];
  title?: string;
};

export default function GallerySection({ id, files, title }: Props) {
  const folder = "gallery";

  // format of files: files
  // : Array(1)
  // 0: {name: 'gallery', 
  //      url: 'https://storage.googleapis.com/greenfit-demo-uploads/gallery/'}

  if (files.length === 0) return null;
  return (
    <section id={id} className="max-w-5xl mx-auto my-12">
      {title && <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {files.map((img, idx) => (
          <div key={idx} className="bg-white rounded shadow p-4 flex flex-col items-center">
            <Image
              src={img.url || img.src}
              alt={img.alt || img.title || ""}
              width={400}
              height={300}
              className="w-full h-48 object-cover rounded mb-4"
            />
            {img.title && <h3 className="font-semibold text-lg mb-2">{img.title}</h3>}
          </div>
        ))}
      </div>
    </section>
  );
}