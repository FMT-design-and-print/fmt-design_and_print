import { createClient } from "@/utils/supabase/client";
import { FileWithPath } from "@mantine/dropzone";
import { v4 as uid } from "uuid";
import { SerializedFile } from "@/utils/storage";

export const uploadFile = async (artworkFile: FileWithPath) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("fmt_artworks")
      .upload(`${uid()}-${artworkFile.name}`, artworkFile as File, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

export const uploadArtworkFiles = async (artworkFiles: FileWithPath[]) => {
  const urls = [];

  for (const file of artworkFiles || []) {
    const data = await uploadFile(file);
    if (data) {
      urls.push(data.path);
    }
  }

  return urls;
};

/**
 * Uploads a base64 file to Supabase storage
 * @param serializedFile The serialized file with base64 data
 * @returns The path of the uploaded file in Supabase storage
 */
export const uploadBase64File = async (serializedFile: SerializedFile) => {
  try {
    // Convert base64 to blob
    const base64Response = serializedFile.url;
    const mimeType = base64Response.split(";")[0].split(":")[1];
    const byteString = atob(base64Response.split(",")[1]);
    const byteNumbers = new Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Ensure the filename has the correct extension based on the MIME type
    let filename = serializedFile.name;
    const fileExtension = getFileExtensionFromMimeType(mimeType);

    // If the filename doesn't already have the correct extension, add it
    if (
      fileExtension &&
      !filename.toLowerCase().endsWith(`.${fileExtension}`)
    ) {
      filename = `${filename}.${fileExtension}`;
    }

    // Generate a unique filename
    const uniqueFilename = `${uid()}-${filename}`;

    // Upload to Supabase
    const supabase = createClient();
    const { error } = await supabase.storage
      .from("fmt_artworks")
      .upload(uniqueFilename, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: mimeType,
      });

    if (error) {
      throw error;
    }

    // Return both the path and filename for consistent reference
    return {
      path: uniqueFilename, // Use the exact filename we uploaded with
      filename: filename,
    };
  } catch (error) {
    console.error("Base64 upload failed:", error);
    return null;
  }
};

/**
 * Gets the file extension from a MIME type
 * @param mimeType The MIME type
 * @returns The file extension
 */
const getFileExtensionFromMimeType = (mimeType: string): string | null => {
  const mimeToExtension: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/svg+xml": "svg",
    "application/pdf": "pdf",
    "application/postscript": "eps",
    "application/illustrator": "ai",
    "application/vnd.adobe.illustrator": "ai",
  };

  return mimeToExtension[mimeType] || null;
};

/**
 * Uploads multiple base64 files to Supabase storage
 * @param serializedFiles Array of serialized files with base64 data
 * @returns Array of paths of the uploaded files in Supabase storage
 */
export const uploadBase64Files = async (serializedFiles: SerializedFile[]) => {
  const results = [];

  for (const file of serializedFiles || []) {
    const result = await uploadBase64File(file);
    if (result) {
      results.push(result);
    }
  }

  return results;
};

/**
 * Uploads a map of base64 files to Supabase storage
 * @param filesMap Map of serialized files with base64 data
 * @returns Map of paths of the uploaded files in Supabase storage
 */
export const uploadBase64FilesMap = async (
  filesMap: Record<string, SerializedFile[]>
) => {
  const resultsMap: Record<string, { path: string; filename: string }[]> = {};

  for (const [label, files] of Object.entries(filesMap)) {
    resultsMap[label] = await uploadBase64Files(files);
  }

  return resultsMap;
};
