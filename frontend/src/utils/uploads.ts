const pathToUploads = process.env.NEXT_PUBLIC_UPLOADS_URL || "";

export const getPhotoUrl = (photoSrc: string) => {
    return photoSrc ? `${pathToUploads}/team/${photoSrc}` : "/placeholder.png";
};