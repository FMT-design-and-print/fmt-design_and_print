/**
 * Determines the file type based on MIME type
 * @param fileType MIME type of the file
 * @returns Object with boolean flags for different file types
 */
export const getFileTypeInfo = (fileType: string) => {
  return {
    isImage: fileType.startsWith("image/") && !fileType.includes("svg"),
    isPDF: fileType === "application/pdf",
    isSVG: fileType === "image/svg+xml",
    isAI:
      fileType === "application/illustrator" ||
      fileType === "application/vnd.adobe.illustrator",
    isEPS: fileType === "application/postscript",
    isVector:
      fileType === "image/svg+xml" ||
      fileType === "application/illustrator" ||
      fileType === "application/vnd.adobe.illustrator" ||
      fileType === "application/postscript",
  };
};

/**
 * Gets the file type category for icon selection
 * @param fileType MIME type of the file
 * @returns String indicating the file type category
 */
export const getFileTypeCategory = (
  fileType: string
): "pdf" | "vector" | "image" | "other" => {
  const { isImage, isPDF, isVector } = getFileTypeInfo(fileType);

  if (isPDF) return "pdf";
  if (isVector) return "vector";
  if (isImage) return "image";
  return "other";
};

/**
 * Checks if a URL is a storage path rather than a data URL or full URL
 * @param url The URL to check
 * @returns Boolean indicating if the URL is a storage path
 */
export const isStoragePath = (url: string): boolean => {
  // Check if the URL is a data URL (base64)
  if (url.startsWith("data:")) {
    return false;
  }

  // Check if it's a full URL
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return false;
  }

  // If it's not a data URL or a full URL, assume it's a storage path
  return true;
};

/**
 * Checks if a file has been marked as deleted
 * @param file The file object to check
 * @returns Boolean indicating if the file is marked as deleted
 */
export const isFileDeleted = (file: { isDeleted?: boolean }): boolean => {
  return file && file.isDeleted === true;
};
