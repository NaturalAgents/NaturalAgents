"use client";

import {
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { schema } from "@/components/command/customschema/Schema";

export type EditorContextType = {
  editorRef: MutableRefObject<typeof schema.BlockNoteEditor | null>;
  title: string;
  setTitle: (title: string) => void;
  document: string;
  setDocument: (content: string) => void;
  ProviderMenu: JSX.Element | null;
  setProviderMenu: (element: JSX.Element | null) => void;
  preview: boolean;
  setPreview: (preview: boolean) => void;
  panelVis: boolean;
  setPanelVis: (vis: boolean) => void;
};

export const EditorContext = createContext<EditorContextType | undefined>(
  undefined
);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  // State for the editor title
  const [title, setTitle] = useState("Untitled");
  const [preview, setPreview] = useState(true);
  const [panelVis, setPanelVis] = useState(false);
  const [document, setDocument] = useState("[{}]");

  const Div = () => {
    return <div>test</div>;
  };
  const [ProviderMenu, setProviderMenu] = useState<JSX.Element | null>(null);

  // Ref for the editor instance
  const editorRef = useState<
    MutableRefObject<typeof schema.BlockNoteEditor | null>
  >({ current: null })[0];

  return (
    <EditorContext.Provider
      value={{
        editorRef,
        title,
        setTitle,
        setDocument,
        document,
        ProviderMenu,
        setProviderMenu,
        preview,
        setPreview,
        panelVis,
        setPanelVis,
      }}
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
