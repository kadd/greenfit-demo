export interface Terms {
  id?: string;
  isPage: boolean;
  title: string;
  description: string;
  createdAt: string; // ISO Datum
  updatedAt: string; // ISO Datum
  sections: TermsSection[];
  importedAt?: string; // ISO Datum
  effectiveDate: string; // ISO Datum
}


export interface TermsSection {
  id?: string;
  heading: string;
  text: string;
  createdAt: string; // ISO Datum
  updatedAt: string; // ISO Datum
  importedAt?: string; // ISO Datum
}

export interface TermsStatistics {
  totalSections: number;
  totalWords: number;
  totalCharacters: number;
  averageWordsPerSection: number;
  lastUpdated: string | null;
  isEmpty: boolean;
}

export interface BulkOperationResult {
  successful: number;
  failed: number;
  total: number;
  results: PromiseSettledResult<any>[];
}
