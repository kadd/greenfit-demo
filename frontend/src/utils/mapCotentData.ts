import { ContentData } from "@/types/contentData";

export function getEmptyContentData(): ContentData {
  return {
    title: "",
    metaDescription: "",
    header: {
        title: "",
        subtitle: "",
        cta: "",
        logoSrc: "",
        logoAlt: "",
        backgroundImage: "",
        backgroundAlt: "",
        navigation: {},
    },
    about: { label: "", content: "" },
    
    team: { label: "", members: [] },
    testimonials: { label: "", items: [] },
    contact: {
      label: "",
      content: {
        email: { label: "", content: "" },
        phone: { label: "", content: "" },
      },
    },
    impressum: { label: "", content: "" },
    
    privacy: { label: "", content: "" },
    
    terms: { label: "", content: "" },
    
   

  };
}

export function mapContentData(data: any): ContentData {
  return {
    title: data?.title || "",
    metaDescription: data?.metaDescription || "",
    header: {
        title: data?.header?.title || "",
        subtitle: data?.header?.subtitle || "",
        cta: data?.header?.cta || "",
        logoSrc: data?.header?.logoSrc || "",
        logoAlt: data?.header?.logoAlt || "",
        backgroundImage: data?.header?.backgroundImage || "",
        backgroundAlt: data?.header?.backgroundAlt || "",
        navigation: data?.header?.navigation || {},
    },
    about: {
      label: data?.about?.label || "",
      content: data?.about?.content || "",
    },
    
    team: {
      label: data?.team?.label || "",
      members: Array.isArray(data?.team?.members) ? data.team.members : [],
    },
    testimonials: {
      label: data?.testimonials?.label || "",
      items: Array.isArray(data?.testimonials?.items) ? data.testimonials.items : [],
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
    
    privacy: {
      label: data?.privacy?.label || "",
      content: data?.privacy?.content || "",
    },
    
    terms: {
      label: data?.terms?.label || "",
      content: data?.terms?.content || "",
    },
    
   
  };
}