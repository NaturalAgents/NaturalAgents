import { useEffect, useState } from "react";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { fetchDirectoryTree } from "../services/api";
import FileTree from "./FileTree";
import NewItemInput from "./NewItemInput";

export interface FileEntry {
  name: string;
  path: string;
  is_file: boolean;
  is_directory: boolean;
}

export enum FILETYPE {
  FILE = "file",
  DIR = "dir",
}

const FileExplorer = ({
  setSelectedFile,
}: {
  setSelectedFile: React.Dispatch<React.SetStateAction<FileEntry | null>>;
}) => {
  // format {name: "test", path: ".", is_file: true, is_directory: false}
  const [directoryTree, setDirectoryTree] = useState<FileEntry[]>([
    { name: "test", path: ".", is_file: true, is_directory: false },
  ]);
  const [currentPath, setCurrentPath] = useState<string>(".");
  const [isCreating, setIsCreating] = useState<{
    state: boolean;
    type: FILETYPE;
  }>({ state: false, type: FILETYPE.FILE });

  const getDirectoryTree = async () => {
    const tree = await fetchDirectoryTree(currentPath);
    if (tree) setDirectoryTree(tree);
  };

  useEffect(() => {
    getDirectoryTree();
  }, [currentPath]);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
  };

  const goBack = () => {
    if (currentPath !== ".") {
      const parentPath = currentPath.split("/").slice(0, -1).join("/") || ".";
      setCurrentPath(parentPath);
    }
  };

  const handleCreate = (type: FILETYPE) => {
    setIsCreating({ state: true, type });
  };

  return (
    <div className="min-h-screen w-48 bg-white border-r border-gray-300 flex flex-col items-start py-4">
      <div className="px-4 flex items-center space-x-2 mb-4">
        <VscNewFile
          className="cursor-pointer text-gray-600"
          size={20}
          onClick={() => handleCreate(FILETYPE.FILE)}
        />
        <VscNewFolder
          className="cursor-pointer text-gray-600"
          size={20}
          onClick={() => handleCreate(FILETYPE.DIR)}
        />
      </div>

      <div className="px-4 w-full">
        <h3 className="text-lg font-semibold">Files</h3>
        {currentPath !== "." && (
          <button
            className="flex items-center space-x-2 text-gray-600 mb-4 mt-4"
            onClick={goBack}
          >
            <AiOutlineArrowLeft size={20} />
            <span>Back</span>
          </button>
        )}

        <ul className="mt-4">
          {isCreating.state && (
            <NewItemInput
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              getDirectoryTree={getDirectoryTree}
              currentPath={currentPath}
            />
          )}

        <FileTree
          directoryTree={directoryTree}
          navigateTo={navigateTo}
          getDirectoryTree={getDirectoryTree}
          currentPath={currentPath}
          setSelectedFile={setSelectedFile}
          updateFile={(updatedFile: FileEntry) => {
            setDirectoryTree((prev) =>
              prev.map((file) =>
                file.path === updatedFile.path ? { ...file, ...updatedFile } : file
              )
            );

            setSelectedFile((prev) =>
              prev && prev.path === updatedFile.path ? updatedFile : prev
            );
          }}
        />
        </ul>
      </div>
    </div>
  );
};

export default FileExplorer;
