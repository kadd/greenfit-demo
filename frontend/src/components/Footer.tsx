"use client";
import { useContentContext } from "@/contexts/contentContext";

export default function Footer() {
  const content = useContentContext();
  if (!content) return null;

  return (
    <footer className="w-full bg-gray-800 text-white text-center py-6">
      <p>&copy; 2025 GreenFit</p>
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
    </footer>
  );
}