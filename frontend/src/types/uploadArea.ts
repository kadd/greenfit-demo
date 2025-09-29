export type UploadArea = {
  key: string;
  label: string;
  files?: Array<{
    url: string;
    name: string;
    uploadedAt?: string;
  }>;
};