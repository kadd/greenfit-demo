import { useState, useEffect } from "react";

import { Privacy } from "@/types/privacy";

import { fetchPrivacy } from "@/services/privacy";


export function usePrivacy() {
  const [privacy, setPrivacy] = useState<Privacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrivacyFnc() {
      setLoading(true);
      setError(null);
      try {
        // Beispiel: Hole Datenschutzbestimmungen von einer API
        const data = await fetchPrivacy();
        setPrivacy(data);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchPrivacyFnc();
  }, []);

  return { privacy, loading, error };
}