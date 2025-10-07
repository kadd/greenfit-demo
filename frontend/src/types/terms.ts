export interface TermsSection {
  id?: string;
  heading: string;
  text: string;
}

export interface Terms {
  id?: string;
  isPage: boolean;
  title: string;
  description: string;
  createdAt: string; // ISO Datum
  updatedAt: string; // ISO Datum
  sections: TermsSection[];
}
