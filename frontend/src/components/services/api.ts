import { EditorContextType } from "../context/editorcontext";

export const runDocument = async (editorRef: EditorContextType) => {
  const data = editorRef.current?.document || [];
  console.log(JSON.stringify(data));

  const response = await fetch("/api/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },

    body: JSON.stringify({ content: JSON.stringify(data) }),
  });

  if (response.ok) {
    const res = await response.json();
    console.log(res);
    return res;
  }
  return null;
};
