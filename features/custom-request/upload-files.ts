import { createClient } from "@/utils/supabase/client";
import { FileWithPath } from "@mantine/dropzone";
import { v4 as uid } from "uuid";

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
