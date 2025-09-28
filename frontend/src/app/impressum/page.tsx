"use client";
import ImpressumPage from "@/components/ImpressumPage";

import React from "react";
import { useContentContext } from "@/contexts/contentContext";

export default function Page() {
    const content = useContentContext();
    if (!content || !content.impressumLong?.sections) {
        return <div className="p-6 text-center text-gray-500">Impressum wird geladen...</div>;
    }
    return (
        <ImpressumPage sections={content.impressumLong?.sections} />
    );
}
