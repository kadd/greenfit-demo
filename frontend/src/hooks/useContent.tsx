import { useState, useEffect } from "react";

import { getContentData as getContentDataService, 
  updateContentData as updateContentDataService,
  updateTerms as updateTermsService,
  updatePrivacy as updatePrivacyService,
  updateFaq as updateFaqService,
  updateBlog as updateBlogService,
  updateImpressum as updateImpressumService
} from "@/services/content";
import { get } from "http";

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
      if (result) {
        const updatedData = await getContentDataService(token);
        setData(updatedData);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const updateTerms = async (terms: string) => {
    try {
      setUpdateLoading(true);
      const result = await updateTermsService(token, terms);
      if (result) {
        const updatedData = await getContentDataService(token);
        setData(updatedData);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const updatePrivacy = async (privacy: string) => {
    try {
      setUpdateLoading(true);
      const result = await updatePrivacyService(token, privacy);
      if (result) {
        const updatedData = await getContentDataService(token);
        setData(updatedData);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const updateFaq = async (faq: any[]) => {
    try {
      setUpdateLoading(true);
      const result = await updateFaqService(token, faq);
      if (result) {
          const updatedData = await getContentDataService(token);
          setData(updatedData);
        }
    } finally {
      setUpdateLoading(false);
    }
  };

  const updateBlog = async (blog: any[]) => {
    try {
      setUpdateLoading(true);
      const result = await updateBlogService(token, blog);
      if (result) {
        const updatedData = await getContentDataService(token);
        setData(updatedData);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const updateImpressum = async (impressum: string) => {
    try {
      setUpdateLoading(true);
      const result = await updateImpressumService(token, impressum);
      if (result) {
        const updatedData = await getContentDataService(token);
        setData(updatedData);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  return { data, loading, error, 
    getContentDataService, 
    updateLoading, 
    updateContentData, 
    updateTerms, 
    updatePrivacy, 
    updateFaq, 
    updateBlog, 
    updateImpressum 
  };
}
