"use client";
import { useContentContext } from "@/contexts/contentContext";
import { useEffect, useState } from 'react';

import PrivacyPolicyPage from '@/components/Pages/PrivacyPage';

export default function Page() {
 const content = useContentContext();
  if (!content || !content.privacyLong) {
    return <div className="p-6 text-center text-gray-500">Datenschutz wird geladen...</div>;
  }

  return <PrivacyPolicyPage sections={content.privacyLong.sections} />;
}