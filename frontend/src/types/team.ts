export interface Team {
  members: Array<{
    name: string;
    role?: string;
    photoSrc?: string;
    photoAlt?: string;
    bio?: string;
    socialLinks?: { platform: string; url: string }[];
    image?: string; // Filename des hochgeladenen Bildes
  }>;
}