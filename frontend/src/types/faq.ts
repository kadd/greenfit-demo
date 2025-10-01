export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQ {
    isPage: boolean;
    title: string;
    items: FAQItem[];
}