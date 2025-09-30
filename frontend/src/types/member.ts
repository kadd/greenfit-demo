export type Member = {
  name: string;
  role?: string;
  photoSrc?: string;
  photoAlt?: string;
  bio?: string;
  socialLinks?: { platform: string; url: string }[];
};