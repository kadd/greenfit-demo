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
  services: {
    label: string;
    description?: string;
    content: {
      training: { label: string; content: string; image?: string };
      nutrition: { label: string; content: string; image?: string };
      group: { label: string; content: string; image?: string };
    };
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
  impressumLong?: {
    isPage?: boolean;
    title: string;
    sections: Array<{
      heading: string;
      text: string;
    }>;
  };
  privacy?: {
    label: string; content: string
  };
  privacyLong?: {
    isPage?: boolean;
    title: string;
    sections: Array<{
      heading: string;
      text: string;
    }>;
  };
  terms?: {
    label: string; content: string
  };
  termsLong?: {
    isPage?: boolean;
    title: string;
    sections: Array<{
      heading: string;
      text: string;
    }>;
  };
  faq?: {
    isPage?: boolean;
    title: string;
    items: Array<{ question: string; answer: string }>
  };
  blog?: {
    isPage?: boolean;
    title: string;
    description: string;
    items: Array<{
        title: string;
        date: string;
        excerpt: string;
      }>
    }
  };
