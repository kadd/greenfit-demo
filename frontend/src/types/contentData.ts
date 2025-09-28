export type ContentData = {
  title: string;
  metaDescription: string;
  header: {
    home: string;
    about: string;
    services: string;
    contact: string;
    impressum: string;
    privacy: string;
    terms: string;
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
  privacy?: {
    label: string; content: string
  };
  terms?: {
    label: string; content: string
  };
};