import { storageBucketName } from "@/constants";
import { createClient } from "@/utils/supabase/client";
import { Button, Group } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { saveAs } from "file-saver";
import React from "react";
import { toast } from "react-toastify";

interface FileDownloaderProps {
  fileNames: string[];
}

export const FileDownloader: React.FC<FileDownloaderProps> = ({
  fileNames,
}) => {
  const downloadFile = async (fileName: string) => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase.storage
        .from(storageBucketName)
        .createSignedUrl(fileName, 60);

      if (error) {
        toast.error(`Error downloading file: ${fileName}`);
        console.error("Error creating signed URL:", error.message);
        return;
      }

      if (data) {
        const url = data.signedUrl;

        const response = await fetch(url);
        const blob = await response.blob();

        saveAs(blob, fileName.split("/").pop() || "file");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <Group style={{ overflowX: "hidden" }}>
      {fileNames.map((fileName) => (
        <Button
          key={fileName}
          variant="transparent"
          size="xs"
          color="pink"
          onClick={() => downloadFile(fileName)}
          rightSection={<IconDownload size="0.6rem" className="p-0" />}
          title={`Download ${fileName}`}
        >
          {fileName}
        </Button>
      ))}
    </Group>
  );
};
