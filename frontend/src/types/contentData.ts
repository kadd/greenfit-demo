export type ContentData = {
  about: string;
  services: {
    training: string;
    nutrition: string;
    group: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  impressum?: string;
  privacy?: string;
  terms?: string;
};