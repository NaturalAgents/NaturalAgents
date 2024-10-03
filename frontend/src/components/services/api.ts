import { EditorContextType } from "../context/editorcontext";

export const runDocument = async (editorRef: EditorContextType) => {
  const data = editorRef.current?.document || [];
  const response = await fetch("backend:5000/api/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },

    body: JSON.stringify({ content: data }),
  });

  console.log(response);
};
