export interface TermsSection {
  heading: string;
  text: string;
}

export interface Terms {
  isPage: boolean;
  title: string;
  sections: TermsSection[];
}
