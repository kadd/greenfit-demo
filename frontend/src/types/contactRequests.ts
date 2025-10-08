export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  comment?: string;
  status?:  "open" | "closed" | "in progress";
};

export type GroupedContactRequests = {
  [email: string]: ContactRequest[];
};

export type ContactRequestStatus = "open" | "closed" | "in progress";