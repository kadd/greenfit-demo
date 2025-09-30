import { Member } from "./member";

export type UploadArea = {
  key: string;
  label: string;
  members?: Array<Member>;
  projects?: Array<{
    title: string;
    description: string;
    imageUrl?: string;
  }>;
  files?: Array<{
    url: string;
    name: string;
    uploadedAt?: string;
  }>;
};