import { ContentData } from "@/types/contentData";

export function getEmptyContentData(): ContentData {
  return {
    title: "",
    metaDescription: "",
    header: {
      home: "",
      about: "",
      services: "",
      contact: "",
      impressum: "",
      privacy: "",
      terms: "",
      faq: "",
      blog: "",
    },
    about: { label: "", content: "" },
    services: {
      label: "",
      content: {
        training: { label: "", content: "" },
        nutrition: { label: "", content: "" },
        group: { label: "", content: "" },
      },
    },
    contact: {
      label: "",
      content: {
        email: { label: "", content: "" },
        phone: { label: "", content: "" },
      },
    },
    impressum: { label: "", content: "" },
    impressumLong: { 
        isPage: false,
        title: "",
        sections: [] 
    },
    privacy: { label: "", content: "" },
    privacyLong: { 
        isPage: false,
        title: "",
        sections: [] 
    },
    terms: { label: "", content: "" },
    termsLong: { 
        isPage: false,
        title: "",
        sections: [] 
    },
    faq: { title: "", items: [], isPage: true },
    blog: { title: "", description: "", items: [], isPage: true },

  };
}

export function mapContentData(data: any): ContentData {
  return {
    title: data?.title || "",
    metaDescription: data?.metaDescription || "",
    header: {
        home: data?.header?.home || "",
        about: data?.header?.about || "",
        services: data?.header?.services || "",
        contact: data?.header?.contact || "",
        impressum: data?.header?.impressum || "",
        privacy: data?.header?.privacy || "",
        terms: data?.header?.terms || "",
        faq: data?.header?.faq || "",
        blog: data?.header?.blog || "",
    },
    about: {
      label: data?.about?.label || "",
      content: data?.about?.content || "",
    },
    services: {
      label: data?.services?.label || "",
      content: {
        training: data?.services?.content?.training || "",
        nutrition: data?.services?.content?.nutrition || "",
        group: data?.services?.content?.group || "",
      },
    },
    contact: {
      label: data?.contact?.label || "",
      content: {
        email: {
          label: data?.contact?.content?.email?.label || "",
          content: data?.contact?.content?.email?.content || "",
        },
        phone: {
          label: data?.contact?.content?.phone?.label || "",
          content: data?.contact?.content?.phone?.content || "",
        },
      },
    },
    impressum: {
      label: data?.impressum?.label || "",
      content: data?.impressum?.content || "",
    },
    impressumLong: {
      isPage: data?.impressumLong?.isPage || false,
      title: data?.impressumLong?.title || "",
      sections: Array.isArray(data?.impressumLong?.sections) ? data.impressumLong.sections : [],
    },
    privacy: {
      label: data?.privacy?.label || "",
      content: data?.privacy?.content || "",
    },
    privacyLong: {
      isPage: data?.privacyLong?.isPage || false,
      title: data?.privacyLong?.title || "",
      sections: Array.isArray(data?.privacyLong?.sections) ? data.privacyLong.sections : [],
    },
    terms: {
      label: data?.terms?.label || "",
      content: data?.terms?.content || "",
    },
    termsLong: {
    isPage: data?.termsLong?.isPage || false,
      title: data?.termsLong?.title || "",
      sections: Array.isArray(data?.termsLong?.sections) ? data.termsLong.sections : [],
    },
    faq: {
      isPage: data?.faq?.isPage || false,
      title: data?.faq?.title || "",
      items: Array.isArray(data?.faq?.items) ? data.faq.items : [],
    },
    blog: {
        isPage: data?.blog?.isPage || false,
        title: data?.blog?.title || "",
        description: data?.blog?.description || "",
        items: Array.isArray(data?.blog?.items) ? data.blog.items : [],
        },
  };
}