import React from "react";

type Props = {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function ContentSection({ id, title, children, className }: Props) {
  return (
    <section id={id} className={`py-12 px-6 ${className || ""}`}>
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">{title}</h2>
      <div>{children}</div>
    </section>
  );
}