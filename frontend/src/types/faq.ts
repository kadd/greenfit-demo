export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
}

export interface FAQ {
    id?: string;
    isPage: boolean;
    title: string;
    items?: FAQItem[];
}