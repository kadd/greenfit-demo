export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
  importedAt?: string; // ISO Datum
}

export interface FAQ {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    isPage: boolean;
    title: string;
    description: string;
    importedAt?: string;
    effectiveDate?: string; // ISO Datum
    items?: FAQItem[];
}

export interface FAQStatistics {
  totalItems: number;
  totalWords: number;
  totalCharacters: number;
  averageWordsPerItem: number;
  lastUpdated: string | null;
  isEmpty: boolean;
}

export interface BulkOperationResult {
  successful: number;
  failed: number;
  total: number;
  results: PromiseSettledResult<any>[];
}