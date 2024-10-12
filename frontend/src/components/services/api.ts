import { MutableRefObject } from "react";
import { schema } from "../command/customschema/Schema";

export const runDocument = async (
  editorRef: MutableRefObject<typeof schema.BlockNoteEditor | null>
) => {
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

export const fetchDirectoryTree = async (path: string) => {
  try {
    const response = await fetch(`/api/directory-tree?path=${path}`);
    const data = await response.json();
    return data.tree;
  } catch (error) {
    console.error("Error fetching directory tree:", error);
    return null;
  }
};

export const handleFolder = async (
  path: string,
  name: string,
  action: string,
  new_name: string = ""
) => {
  await fetch("/api/handle-folder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, name, action, new_name }),
  });
};

export const handleFile = async (
  path: string,
  name: string,
  action: string,
  new_name: string = ""
) => {
  await fetch("/api/handle-file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, name, action, new_name }),
  });
};

export const readFile = async (path: string) => {
  const response = await fetch(`/api/retrieve-file?path=${path}`);
  if (response.ok) {
    const res = await response.json();
    const data = JSON.parse(res.data);
    if (typeof data !== "object") {
      return null;
    }
    return data;
  }
};

export const writeFile = async (
  path: string,
  title: string,
  text: string = ""
) => {
  const response = await fetch("/api/save-file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, title, text }),
  });

  if (response.ok) {
    return true;
  }
  false;
};
