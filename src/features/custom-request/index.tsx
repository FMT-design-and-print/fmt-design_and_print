"use client";
import { useCustomEditor } from "@/hooks/useCustomEditor";
import { ArtworkOption, QuoteReceptionMedium } from "@/types";
import { FileWithPath } from "@mantine/dropzone";
import { Editor } from "@tiptap/react";
import DOMPurify from "dompurify";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const content = ``;

export interface ICustomRequestContext {
  isSubmitting: boolean;
  selectedArtworkOption: ArtworkOption;
  artworkFiles: FileWithPath[];
  designInstructions: string;
  quoteReceptionMedium: QuoteReceptionMedium;
  quoteReceptionValue: string;
  editor: Editor | null;
  quantity: number;
  productImageUrl: string;
  contactName: string;
  phone: string;
  email: string;
  setProductImageUrl: (value: string) => void;
  setQuantity: (value: number) => void;
  setQuoteReceptionValue: (value: string) => void;
  setQuoteReceptionMedium: (value: QuoteReceptionMedium) => void;
  setSelectedArtworkOption: (value: ArtworkOption) => void;
  setIsSubmitting: (value: boolean) => void;
  setArtworkFiles: Dispatch<SetStateAction<FileWithPath[]>>;
  setContactName: (value: string) => void;
  setPhone: (value: string) => void;
  setEmail: (value: string) => void;
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
  const [productImageUrl, setProductImageUrl] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const editor = useCustomEditor(content);

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
        productImageUrl,
        isSubmitting,
        contactName,
        phone,
        email,
        setIsSubmitting,
        setSelectedArtworkOption,
        setArtworkFiles,
        setQuoteReceptionValue,
        setQuoteReceptionMedium,
        setQuantity,
        setProductImageUrl,
        setContactName,
        setPhone,
        setEmail,
      }}
    >
      {children}
    </CustomRequestContext.Provider>
  );
};

export const useCustomRequest = () => {
  const context = useContext(CustomRequestContext);
  if (!context) {
    throw new Error(
      "useCustomRequest should be used within a CustomRequestContext provider"
    );
  }
  return context;
};
