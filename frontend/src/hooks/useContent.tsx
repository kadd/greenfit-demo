import { useState, useEffect } from "react";

import { getContentData as getContentDataService, updateContentData as updateContentDataService } from "@/services/content";

export function useContent(token?: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        const result = await getContentDataService(token);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContentData();
  }, [token]);

  // Funktion zum Aktualisieren der Inhalte
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  const updateContentData = async (newData: any) => {
    try {
      setUpdateLoading(true);
      const result = await updateContentDataService(token, newData);
      setData(result);
    } finally {
      setUpdateLoading(false);
    }
  };

  return { data, loading, error, getContentDataService, updateContentData };
}
