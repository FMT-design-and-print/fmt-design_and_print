"use client";
import { ArtworkOption, QuoteReceptionMedium } from "@/types";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Link } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import { FileWithPath } from "@mantine/dropzone";

const content = ``;

interface ICustomRequestContext {
  isSubmitting: boolean;
  selectedArtworkOption: ArtworkOption;
  artworkFiles: FileWithPath[];
  designInstructions: string;
  quoteReceptionMedium: QuoteReceptionMedium;
  quoteReceptionValue: string;
  editor: Editor | null;
  quantity: number;
  setQuantity: (value: number) => void;
  setQuoteReceptionValue: (value: string) => void;
  setQuoteReceptionMedium: (value: QuoteReceptionMedium) => void;
  setSelectedArtworkOption: (value: ArtworkOption) => void;
  setIsSubmitting: (value: boolean) => void;
  setArtworkFiles: Dispatch<SetStateAction<FileWithPath[]>>;
}

export const CustomRequestContext = createContext<ICustomRequestContext | null>(
  null
);

interface Props {
  children: ReactNode;
}

export const CustomRequest = ({ children }: Props) => {
  const [selectedArtworkOption, setSelectedArtworkOption] =
    useState<ArtworkOption>("own-artwork");
  const [artworkFiles, setArtworkFiles] = useState<FileWithPath[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [quoteReceptionMedium, setQuoteReceptionMedium] =
    useState<QuoteReceptionMedium>("email");
  const [quoteReceptionValue, setQuoteReceptionValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
  });

  useEffect(() => {
    if (isSubmitting) {
      const timer = setTimeout(() => {
        setIsSubmitting(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  });

  return (
    <CustomRequestContext.Provider
      value={{
        selectedArtworkOption,
        artworkFiles,
        designInstructions: DOMPurify?.sanitize(editor?.getHTML() || ""),
        quoteReceptionMedium,
        quoteReceptionValue,
        editor,
        quantity,
        isSubmitting,
        setIsSubmitting,
        setSelectedArtworkOption,
        setArtworkFiles,
        setQuoteReceptionValue,
        setQuoteReceptionMedium,
        setQuantity,
      }}
    >
      {children}
    </CustomRequestContext.Provider>
  );
};

export const useCustomRequest = () => {
  const context = useContext(CustomRequestContext);
  return context;
};
