"use client";
import { useContentContext } from "@/contexts/contentContext";

export default function Footer() {
  const content = useContentContext();
  if (!content) return null;

  return (
    <footer className="w-full bg-gray-800 text-white text-center py-6">
      <div className="flex justify-center mb-2 space-x-4">
        {/* Social Media Icons */}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <svg className="w-6 h-6 fill-green-400 hover:fill-green-600 transition" viewBox="0 0 24 24">
            <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 5.019 3.676 9.163 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.261c-1.243 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.324 21.163 22 17.019 22 12z"/>
          </svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg className="w-6 h-6 fill-green-400 hover:fill-green-600 transition" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.981.981-1.213 2.093-1.272 3.374C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.059 1.281.291 2.393 1.272 3.374.981.981 2.093 1.213 3.374 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.291 3.374-1.272.981-.981 1.213-2.093 1.272-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.059-1.281-.291-2.393-1.272-3.374-.981-.981-2.093-1.213-3.374-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>
        </a>
      </div>
      <div className="mt-2 text-sm flex flex-col items-center space-y-1">
        {content.contact?.email?.content && (
          <span>
            <strong>{content.contact.email.label}:</strong>{" "}
            <a href={`mailto:${content.contact.email.content}`} className="text-green-400 hover:underline">
              {content.contact.email.content}
            </a>
          </span>
        )}
        {content.contact?.phone?.content && (
          <span>
            <strong>{content.contact.phone.label}:</strong>{" "}
            <a href={`tel:${content.contact.phone.content}`} className="text-green-400 hover:underline">
              {content.contact.phone.content}
            </a>
          </span>
        )}
        {content.impressum?.content && (
          <div className="mt-2 text-xs text-gray-300">
            <strong>{content.impressum.label}:</strong> {content.impressum.content}
          </div>
        )}
        {content.privacy?.content && (
          <div className="mt-1 text-xs text-gray-300 max-w-xl mx-auto break-words">
            <strong>{content.privacy.label}:</strong> {content.privacy.content}
            <a href="/privacy" className="text-green-400 hover:underline ml-2">Datenschutzerklärung</a>
          </div>
        )}
        {content.terms?.content && (
          <div className="mt-1 text-xs text-gray-300 max-w-xl mx-auto break-words">
            <strong>{content.terms.label}:</strong> {content.terms.content}
            <a href="/agb" className="text-green-400 hover:underline ml-2">AGB</a>
          </div>
        )}
        {/* Admin Login Link */}
        <a href="/admin/login" className="text-green-400 hover:underline">
          Admin Login
        </a>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        © 2025 GreenFit Hamburg
      </div>
    </footer>
  );
}