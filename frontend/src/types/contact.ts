export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  date: string;
};

export type GroupedContacts = {
  [email: string]: ContactMessage[];
};