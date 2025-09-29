import React, { useState } from "react";

import { uploadFile as uploadFileService,
    uploadFileToArea as uploadFileToAreaService,
    deleteFile as deleteFileService,
    listAllFiles as listAllFilesService,
    getAreas as getAreasService,
    listFilesByArea as listFilesByAreaService,
    getFileUrl as getFileUrlService,
    
 } from '@/services/upload';

 import { useContent } from "./useContent";
 import { UploadArea } from "@/types/uploadArea";

import { ContentData } from "@/types/contentData";
import { get } from "http";
  

 export function useUpload(token) {
   const [files, setFiles] = React.useState([]);
   const [areas, setAreas] = useState<UploadArea[]>([]);
   const [loading, setLoading] = React.useState(false);
   const [error, setError] = React.useState(null);

   const { data: content } = useContent(token);

   const fetchAllFiles = async () => {
     setLoading(true);
     try {
       const files = await listAllFilesService(token);
       setFiles(files);
     } catch (err) {
       setError(err);
     } finally {
       setLoading(false);
     }
   };


   const uploadFile = async (formData: FormData) => {
     setLoading(true);
     try {
       const response = await uploadFileService(token, formData);
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
       const response = await uploadFileToAreaService(token, area, formData);
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
   }

   const deleteFile = async (filename) => {
     setLoading(true);
     try {
       const response = await deleteFileService(token, filename);
       await getAreas(); // Aktualisiere die Dateiliste nach dem Löschen
        
       return response;
     } catch (err) {
       setError(err);
       throw err;
     } finally {
       setLoading(false);
     }
   };

    const getAreas = async () => {
    try {
        const response = await getAreasService(token);
        const areasArray = Array.isArray(response.areas) ? response.areas : [];
        setAreas(areasArray);
        return areasArray;
    } catch (err) {
        setError(err);
        return [];
    }
    }

   const extractUploadAreas = () => {
     const areas = {};

     // Extrahiere relevante Bereiche aus den Content-Daten oder Typ contentData
     // überall wo Bilder verwendet werden
     if (content) {
         if (content.team && Array.isArray(content.team)) {
              areas.team = content.team.map(member => member.photo).filter(Boolean);
            }
           if (content.gallery && Array.isArray(content.gallery)) {
             areas.gallery = content.gallery.map(item => item.src).filter(Boolean);
           }
           if (content.header && content.header.logoSrc) {
             areas.header = [content.header.logoSrc];
           }
            if (content.header && content.header.backgroundImage) {
             areas.header.push(content.header.backgroundImage);
           }
              if (content.testimonials && Array.isArray(content.testimonials)) {
             areas.testimonials = content.testimonials.map(item => item.photo).filter(Boolean);
           }  
        }  
        
     return areas;
   }


    React.useEffect(() => {
        if (token) {
            getAreas().then(data => {
                setAreas(data); // data ist das Array!
                console.log("Fetched Areas:", data);
            });
        }
    }, [token]);

   return {
        files,
        loading,
        error,
        areas,
        uploadFile,
        uploadFileToArea,
        deleteFile,
        fetchAllFiles,
        extractUploadAreas,
        getAreas,
        listFilesByArea: listFilesByAreaService,
        getFileUrl: getFileUrlService,
   };
 }