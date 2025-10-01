import { useState, useEffect } from "react";

import { Impressum } from "@/types/impressum";

import { fetchImpressum } from "@/services/impressum";


export function useImpressum() {
  const [impressum, setImpressum] = useState<Impressum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImpressumFnc() {
      setLoading(true);
      setError(null);
      try {
        // Beispiel: Hole Impressum von einer API
        const data = await fetchImpressum();
        setImpressum(data);
      } catch (err: any) {
        setError(err.message || "Unbekannter Fehler");
      } finally {
        setLoading(false);
      }
    }
    fetchImpressumFnc();
  }, []);

  return { impressum, loading, error };
}