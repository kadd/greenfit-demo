const pathToUploads = process.env.NEXT_PUBLIC_UPLOADS_URL || "";

export const getPhotoUrl = (folder: string, photoSrc: string) => {
    return (photoSrc && folder) ? `${pathToUploads}/${folder}/${photoSrc}` : "/placeholder.png";
};