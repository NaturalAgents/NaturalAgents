"use client";

import {
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { schema } from "@/components/command/customschema/Schema";
import { FileEntry } from "../file-explorer/FileExplorer";


export type EditorContextType = {
  editorRef: MutableRefObject<typeof schema.BlockNoteEditor | null>;
  title: string;
  setTitle: (title: string) => void;
  document: string;
  setDocument: (content: string) => void;
  selectedFile: FileEntry | null;
  setSelectedFile: (file: FileEntry | null) => void;
};

export const EditorContext = createContext<EditorContextType | undefined>(undefined);


export const EditorProvider = ({ children }: { children: ReactNode }) => {
  // State for the editor title
  const [title, setTitle] = useState("Untitled");
  const [document, setDocument] = useState("[{}]");
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);

  // Ref for the editor instance
  const editorRef = useState<MutableRefObject<typeof schema.BlockNoteEditor | null>>({
    current: null,
  })[0];

  return (
    <EditorContext.Provider
      value={{ editorRef, title, setTitle, document, setDocument, selectedFile, setSelectedFile }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
