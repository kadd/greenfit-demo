import { Service } from "./service";

export type ContentData = {
  title: string;
  metaDescription: string;
  header: {
    title: string;
    subtitle: string;
    cta: string;
    logoSrc?: string;
    logoAlt?: string;
    backgroundImage?: string;
    backgroundAlt?: string;
    navigation: {
      [key: string]: {
        label: string;
        href: string;
      };
    };
  };
  about: { label: string; content: string };
  
  team: {
    label: string;
    members: Array<{
      name: string;
      role: string;
      bio: string;
      photoSrc?: string;
      photoAlt?: string;
    }>;
  };
  testimonials: {
    label: string;
    items: Array<{
      name: string;
      feedback: string;
      photoSrc?: string;
      photoAlt?: string;
    }>;
  };
 
  contact: {
      label: string;
      content: {
        email: {
          label: string; content: string
        };
        phone: {
          label: string; content: string
        };
      }
   
  };
  impressum?: {
    label: string; content: string
  };
  
  privacy?: {
    label: string; content: string
  };
  
  terms?: {
    label: string; content: string
  };
 
  
  };
