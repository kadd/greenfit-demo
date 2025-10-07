export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQ {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    isPage: boolean;
    title: string;
    items?: FAQItem[];
}