import { FileWithPath } from "@mantine/dropzone";

export const convertFilesToBase64 = async (files: File[] | FileWithPath[]) => {
  const serializedArtworkFiles = await Promise.all(
    files.map(async (file) => {
      return new Promise<{
        url: string;
        name: string;
        size: number;
        type: string;
      }>((resolve) => {
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
