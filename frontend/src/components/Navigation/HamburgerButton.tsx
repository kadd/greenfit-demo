import React from "react";

type Props = {
  onClick: () => void;
  isOpen: boolean;
};

export default function HamburgerButton({ onClick, isOpen }: Props) {
  return (
    <button
      className=" fixed top-6 left-6 z-50 flex flex-col justify-center items-center w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 focus:outline-none"
      onClick={onClick}
      aria-label={isOpen ? "Menü schließen" : "Menü öffnen"}
    >
     {/* Hamburger-Button für mobiles Menü add md:hidden for mobile view */}
      <span className="block w-6 h-0.5 bg-green-700 mb-1"></span>
      <span className="block w-6 h-0.5 bg-green-700 mb-1"></span>
      <span className="block w-6 h-0.5 bg-green-700"></span>
    </button>
  );
}