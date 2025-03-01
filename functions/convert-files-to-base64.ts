import { FileWithPath } from "@mantine/dropzone";

export type SerializedFile = {
  url: string;
  name: string;
  size: number;
  type: string;
};

export const convertFilesToBase64 = async (files: File[] | FileWithPath[]) => {
  const serializedArtworkFiles = await Promise.all(
    files.map(async (file) => {
      return new Promise<SerializedFile>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            name: file.name,
            size: file.size,
            type: file.type,
          });
        };
        reader.readAsDataURL(file);
      });
    }) || []
  );

  return serializedArtworkFiles;
};

export const convertFilesMapToBase64 = async (
  filesMap: Record<string, FileWithPath[]>
): Promise<Record<string, SerializedFile[]>> => {
  const result: Record<string, SerializedFile[]> = {};

  for (const [key, files] of Object.entries(filesMap)) {
    result[key] = await convertFilesToBase64(files);
  }

  return result;
};
