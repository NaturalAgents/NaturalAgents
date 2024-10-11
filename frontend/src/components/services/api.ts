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

export const readWriteFile = async (
  path: string,
  name: string,
  action: string,
  text: string = ""
) => {
  if (action == "read") {
    await fetch("/api/retrieve-file", {
      method: "GET",
    });
  }

  if (action == "write") {
    await fetch("/api/handle-file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, name, text }),
    });
  }
};
