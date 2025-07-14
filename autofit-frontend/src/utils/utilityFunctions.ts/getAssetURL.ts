export function getAssetURL(publicId: string, resourceType: "image" | "raw") {
    return `${import.meta.env.VITE_API_URL}assets/protected?publicId=${encodeURIComponent(publicId)}&resourceType=${resourceType}`;
}