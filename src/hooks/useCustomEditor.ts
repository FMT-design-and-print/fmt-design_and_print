import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";

const editorOptions: Partial<EditorOptions> = {
  extensions: [
    StarterKit,
    Underline,
    Link,
    Highlight,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
  ],
};

export const useCustomEditor = (content: string) => {
  const editor = useEditor({
    ...editorOptions,
    content,
  });

  return editor;
};

export const useCustomReadOnlyEditor = (content: string) => {
  const editor = useEditor({
    ...editorOptions,
    content,
    editable: false,
  });

  return editor;
};
