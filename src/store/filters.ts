import { ITag } from "@/types";
import { create } from "zustand";

type TagsFiltersStore = {
  tags: ITag[];
  addTag: (tag: ITag) => void;
  removeTag: (tagId: string) => void;
  setTag: (tag: ITag) => void;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
};

export const useTagsFilters = create<TagsFiltersStore>((set) => ({
  tags: [],
  addTag: (tag) => set((prevState) => ({ tags: [...prevState.tags, tag] })),
  removeTag: (tagId) =>
    set((prevState) => ({
      tags: prevState.tags.filter((tag) => tag.id !== tagId),
    })),
  setTag: (tag) =>
    set((prevState) => ({
      tags: prevState.tags.some((item) => item.id === tag.id)
        ? prevState.tags.filter((item) => item.id !== tag.id)
        : [...prevState.tags, tag],
    })),
  isExpanded: false,
  setIsExpanded: (value) => set(() => ({ isExpanded: value })),
}));
