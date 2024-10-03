import { EditorContextType } from "../context/editorcontext";

export const runDocument = (editorRef: EditorContextType) => {
  console.log(editorRef.current?.document);
};
