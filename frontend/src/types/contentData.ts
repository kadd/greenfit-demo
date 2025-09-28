export type ContentData = {
  title: string;
  metaDescription: string;
  header: {
    logoSrc?: string;
    logoAlt?: string;
   
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
    content: {
      training: { label: string; content: string };
      nutrition: { label: string; content: string };
      group: { label: string; content: string };
  }};
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
