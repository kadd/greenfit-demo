import React from "react";
import Link from "next/link";
import { useHeader } from "@/hooks/useHeader";
import { getEmptyHeaderData } from "@/utils/mapHeaderData";

type Props = {
  className?: string;
  onLinkClick?: () => void;
};

export default function NavigationLinks({ className = "", onLinkClick }: Props) {
  const { header } = useHeader(getEmptyHeaderData());

  if (!header?.navigation) return null;

  return (
    <>
      {Object.entries(header.navigation)
        .filter(([key, nav]) => nav.isActive)
        .map(([key, nav]) =>
          nav.href.startsWith("/#") ? (
            <Link key={key} href={nav.href} scroll={true} onClick={onLinkClick}>
              <span className={`px-3 py-2 rounded text-white hover:bg-green-800 transition font-semibold cursor-pointer whitespace-nowrap flex items-center ${className}`}>
                {nav.label}
              </span>
            </Link>
          ) : (
            <a
              key={key}
              href={nav.href}
              onClick={onLinkClick}
              className={`px-3 py-2 rounded text-white hover:bg-green-800 transition font-semibold whitespace-nowrap flex items-center ${className}`}
            >
              {nav.label}
            </a>
          )
        )}
    </>
  );
}