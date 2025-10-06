export interface Team {
  id?: string;
  label: string;
  description: string;
  updatedAt?: string;
  members: Array<TeamMember>;
}

export interface TeamMember {
  id?: string;
  name: string;
  role?: string;
  photoSrc?: string;
  photoAlt?: string;
  bio?: string;
  socialLinks?: { platform: string; url: string }[];
  image?: string; // Filename des hochgeladenen Bildes
}