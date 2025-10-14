import React, { useState, useEffect, useCallback } from "react";
import { HeaderData } from "../types/header";
import { NavigationItem } from "../types/navigation";
import { 
  fetchHeaderDataService, 
  updateHeaderDataService,
  resetHeaderDataService, 
  uploadHeaderImageService,
  setGalleryInactiveIfEmptyService 
} from "../services/header";

export function useHeader(initialHeader: HeaderData) {
  // States im Hook - RICHTIG!
  const [header, setHeader] = useState<HeaderData>(initialHeader);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Memoized fetch function
  const fetchHeader = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHeaderDataService();
      setHeader(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Fehler beim Laden");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchHeader();
    setGalleryStatus();
  }, [fetchHeader]);

  const updateHeader = async (newHeader: HeaderData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedHeader = await updateHeaderDataService(newHeader);
      setHeader(updatedHeader);
      return updatedHeader;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Fehler beim Speichern");
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetHeader = () => {
    setHeader(initialHeader);
    setError(null);
  };

  const setGalleryStatus = async () => {
    try {
      const result = await setGalleryInactiveIfEmptyService();
      // Header neu laden nach Gallery-Status-Update
      await fetchHeader();
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Fehler beim Gallery-Status");
      console.error(error);
    }
  };

  const uploadHeaderImage = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const data = await uploadHeaderImageService(file);

      // Header mit neuer Bild-URL aktualisieren
      if (data.url) {
        const updatedHeader = { ...header, backgroundImage: data.url };
        await updateHeader(updatedHeader);
      }
      
      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Upload fehlgeschlagen");
      console.error(error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Alle States und Funktionen zurückgeben
  return { 
    header, 
    loading, 
    error, 
    uploading,
    updateHeader, 
    resetHeader, 
    setGalleryStatus, 
    uploadHeaderImage,
    refetch: fetchHeader // Für manuelles Neuladen
  };
}