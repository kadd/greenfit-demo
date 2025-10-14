import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NavigationData, NavigationItem } from "@/types/navigation";
import { fetchNavigationService, updateNavigationService } from "@/services/navigation";

export function useNavigation(initialNavigation?: NavigationData) {
  const [navigation, setNavigation] = useState<NavigationData | null>(initialNavigation || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Memoized fetch function
  const fetchNavigation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNavigationService();
      setNavigation(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Fehler beim Laden");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!navigation) {
      fetchNavigation();
    }
  }, [navigation, fetchNavigation]);

  const updateNavigation = async (newNavigation: NavigationData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateNavigationService(newNavigation);
      setNavigation(newNavigation);
        return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Fehler beim Aktualisieren");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    navigation,
    loading,
    error,
    refetch: fetchNavigation,
    updateNavigation
  };
}