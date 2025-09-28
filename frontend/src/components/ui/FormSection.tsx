import React from "react";

type Props = {
  title: string;
  message?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

export default function FormSection({ title, message, onSubmit, children }: Props) {
  return (
    <section className="flex items-center justify-center py-12">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">

        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">{title}</h2>
        {message && (
          <p className="text-center text-gray-600 mb-6">
            {message}
          </p>
        )}
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
          {children}
        </form>
      </div>
    </section>
  );
}