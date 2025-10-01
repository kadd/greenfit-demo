import { useState, useEffect } from "react";

import { Terms } from "@/types/terms";

import { fetchTerms } from "@/services/terms";


export function useTerms() {
  const [terms, setTerms] = useState<Terms | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTermsFnc() {
      setLoading(true);
      setError(null);
      try {
        // Beispiel: Hole AGB von einer API
        const data = await fetchTerms();
        setTerms(data);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchTermsFnc();
  }, []);

  return { terms, loading, error };
}