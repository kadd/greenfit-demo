// types/privacy.ts - Erweiterte Types:
export interface Privacy {
  id?: string;
  title: string;
  isPage: boolean;
  description?: string;
  sections: PrivacySection[];
  createdAt?: string;
  updatedAt?: string;
  importedAt?: string;
  effectiveDate: string; // ISO Datum
}

export interface PrivacySection {
  id: string;
  heading: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  importedAt?: string;
}

export interface PrivacyStatistics {
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