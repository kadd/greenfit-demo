import React from "react";

import {  uploadFileToGCSService,
    uploadSingleFileToGCSService,
    deleteFileFromGCSService,
    listFilesInGCSService,
    getGCSFileUrlService,
    fetchPublicGalleryFromGCSService,
    getAreasService

 } from '@/services/gcsUploads';

 import { useContent } from "./useContent";
 import { UploadArea } from "@/types/uploadArea";

import { ContentData } from "@/types/contentData";
import { get } from "http"; 



export function useGCSUpload(token?: string) {  
    const [files, setFiles] = React.useState([]);
    const [areas, setAreas] = React.useState<UploadArea[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [gallery, setGallery] = React.useState(null);
    

    const { data: content } = useContent(token || "");

    // Initial fetch of areas and files
    React.useEffect(() => {
      if (token) {
        getAreas();
        fetchAllFiles();
      }
      fetchPublicGallery();
    }, [token, areas, files]);

    const fetchPublicGallery = async () => {
       setLoading(true);
       try {
         const publicGallery = await fetchPublicGalleryFromGCSService();
         if(publicGallery.success)
           setGallery(publicGallery.files || []);
         return publicGallery;
       } catch (err) {
         setError(err);
         return null;
       } finally {
         setLoading(false);
       }
    };

    const fetchAllFiles = async () => {
      setLoading(true);
      try {
        const files = await listFilesInGCSService(token);
        setFiles(files);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const uploadSingleFile = async (area: string, formData: FormData) => {
      setLoading(true);
      try {
        const response = await uploadSingleFileToGCSService(token, area, formData);
        if (response && response.success) {
          await getAreas(); // Aktualisiere die Dateiliste nach dem Upload
        }
        return response;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const uploadFileToArea = async (area: string, formData: FormData) => {
      setLoading(true);
      try {
        const response = await uploadFileToGCSService(token, area, formData);
        if (response && response.success) {
          await getAreas(); // Aktualisiere die Dateiliste nach dem Upload
        }
        return response;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const deleteFile = async (filename: string) => {
      setLoading(true);
      try {
        const response = await deleteFileFromGCSService(token, filename);
        if (response && response.success) {
          await getAreas(); // Aktualisiere die Dateiliste nach dem Löschen
        }
        return response;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    };

    const getFileUrl = async (filename: string) => {
      try {
        const url = await getGCSFileUrlService(token, filename);
        return url;
      } catch (err) {
        setError(err);
        return null;
      }
    };

    const getAreas = async () => {
        setLoading(true);
        try {
          const areas = await getAreasService(token);
          setAreas(areas.areas || []);
          return areas.areas || [];
        } catch (err) {
          setError(err);
          return [];
        } finally {
          setLoading(false);
        }
    };

    

    return {
      files,
      areas,
      gallery,
      loading,
      error,
      uploadSingleFile,
      uploadFileToArea,
      deleteFile,
      getFileUrl,
      fetchAllFiles,
      getAreas,
      fetchPublicGallery
    };
}           
