import {
  IconFileDescription,
  IconFileTypePdf,
  IconFileVector,
  IconPhoto,
} from "@tabler/icons-react";
import { getFileTypeCategory } from "@/utils/file-helpers";

interface FileIconProps {
  fileType: string;
  size?: number;
}

/**
 * Component that renders the appropriate icon for a file based on its type
 */
export const FileIcon = ({ fileType, size = 48 }: FileIconProps) => {
  const fileCategory = getFileTypeCategory(fileType);

  switch (fileCategory) {
    case "pdf":
      return <IconFileTypePdf size={size} color="#e94444" />;
    case "vector":
      return <IconFileVector size={size} color="#ffb020" />;
    case "image":
      return <IconPhoto size={size} color="#37b24d" />;
    default:
      return <IconFileDescription size={size} color="#228be6" />;
  }
};
