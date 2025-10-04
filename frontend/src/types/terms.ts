export interface TermsSection {
  heading: string;
  text: string;
}

export interface Terms {
  id?: string;
  isPage: boolean;
  title: string;
  description: string;
  updatedAt: string; // ISO Datum
  sections: TermsSection[];
}
