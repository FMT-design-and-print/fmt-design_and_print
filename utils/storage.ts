import { openDB } from "idb";
import { FileWithPath } from "@mantine/dropzone";

export interface SerializedFile extends Omit<FileWithPath, "path"> {
  url: string;
}

export interface ArtworkFileMetadata {
  createdAt: number;
  lastAccessed: number;
  isTemporary: boolean;
}

export interface ArtworkStorage {
  id: string;
  files?: SerializedFile[];
  filesMap?: Record<string, SerializedFile[]>;
  metadata: ArtworkFileMetadata;
}

const DB_NAME = "fmt_dp_storage";
const STORE_NAME = "artwork_files";
const DB_VERSION = 2;
const CLEANUP_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 2) {
        // Delete old store and create new one with updated schema
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

const createMetadata = (isTemporary = true): ArtworkFileMetadata => ({
  createdAt: Date.now(),
  lastAccessed: Date.now(),
  isTemporary,
});

export const storeArtworkFiles = async (
  itemId: string,
  files: SerializedFile[],
  isTemporary = true
) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const storage: ArtworkStorage = {
      id: itemId,
      files,
      metadata: createMetadata(isTemporary),
    };

    await store.put(storage);
    await tx.done;
  } catch (error) {
    console.error("Error storing artwork files:", error);
    throw new Error("Failed to store artwork files");
  }
};

export const storeArtworkFilesMap = async (
  itemId: string,
  filesMap: Record<string, SerializedFile[]>,
  isTemporary = true
) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const storage: ArtworkStorage = {
      id: itemId,
      filesMap,
      metadata: createMetadata(isTemporary),
    };

    await store.put(storage);
    await tx.done;
  } catch (error) {
    console.error("Error storing artwork files map:", error);
    throw new Error("Failed to store artwork files map");
  }
};

export const getArtworkFiles = async (
  itemId: string
): Promise<SerializedFile[]> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const storage = await store.get(itemId);
    if (!storage) return [];

    // Update last accessed time
    storage.metadata.lastAccessed = Date.now();
    await store.put(storage);
    await tx.done;

    return storage.files || [];
  } catch (error) {
    console.error("Error getting artwork files:", error);
    return [];
  }
};

export const getArtworkFilesMap = async (
  itemId: string,
  labels: string[]
): Promise<Record<string, SerializedFile[]>> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const storage = await store.get(itemId);
    if (!storage || !storage.filesMap) return {};

    // Update last accessed time
    storage.metadata.lastAccessed = Date.now();
    await store.put(storage);
    await tx.done;

    // Filter by requested labels if provided
    if (labels.length > 0) {
      return Object.fromEntries(
        Object.entries(storage.filesMap).filter(([label]) =>
          labels.includes(label)
        )
      ) as Record<string, SerializedFile[]>;
    }

    return storage.filesMap;
  } catch (error) {
    console.error("Error getting artwork files map:", error);
    return {};
  }
};

export const removeArtworkFiles = async (itemId: string) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await store.delete(itemId);
    await tx.done;
  } catch (error) {
    console.error("Error removing artwork files:", error);
    throw new Error("Failed to remove artwork files");
  }
};

export const cleanupOldFiles = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const now = Date.now();
    const allStorages = await store.getAll();

    const toDelete = allStorages.filter((storage) => {
      // Delete temporary files that haven't been accessed in 24 hours
      if (storage.metadata.isTemporary) {
        return now - storage.metadata.lastAccessed > CLEANUP_THRESHOLD;
      }
      return false;
    });

    await Promise.all(toDelete.map((storage) => store.delete(storage.id)));
    await tx.done;

    return toDelete.length;
  } catch (error) {
    console.error("Error cleaning up old files:", error);
    return 0;
  }
};

// Run cleanup periodically (every hour)
if (typeof window !== "undefined") {
  setInterval(cleanupOldFiles, 60 * 60 * 1000);
}
