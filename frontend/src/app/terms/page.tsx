"use client";
import { useContentContext } from "@/contexts/contentContext";
import { useEffect, useState } from 'react';

import TermsPage from '@/components/TermsPage';

export default function Page() {
 const content = useContentContext();
  if (!content || !content.termsLong) {
    return <div className="p-6 text-center text-gray-500">AGB wird geladen...</div>;
  }

  return <TermsPage sections={content.termsLong.sections} />;
}