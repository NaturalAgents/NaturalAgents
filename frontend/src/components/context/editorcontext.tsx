import { MutableRefObject, createContext, useContext } from "react";
import { schema } from "@/components/command/customschema/Schema";

export type EditorContextType = MutableRefObject<
  typeof schema.BlockNoteEditor | null
>;

export const EditorContext = createContext<EditorContextType | undefined>(
  undefined
);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
