import { Input } from "@/components/ui/input";
import { handleFile, handleFolder } from "../services/api";
import { CiFileOn, CiFolderOn } from "react-icons/ci";
import { useState } from "react";
import { FILETYPE } from "./FileExplorer";

interface NewItemInputProps {
  isCreating: { state: boolean; type: string };
  setIsCreating: React.Dispatch<
    React.SetStateAction<{ state: boolean; type: FILETYPE }>
  >;
  getDirectoryTree: () => void;
  currentPath: string;
}

const NewItemInput: React.FC<NewItemInputProps> = ({
  isCreating,
  setIsCreating,
  getDirectoryTree,
  currentPath,
}) => {
  const [newFileName, setNewFileName] = useState("");

  const handleSave = async () => {
    if (newFileName.trim() === "") return;

    try {
      if (isCreating.type === "dir") {
        await handleFolder(currentPath, newFileName, "create");
      } else {
        await handleFile(currentPath, newFileName, "create");
      }

      setIsCreating({ state: false, type: FILETYPE.FILE });
      setNewFileName("");
      getDirectoryTree();
    } catch (error) {
      console.error("Error creating file or folder:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <li className="flex items-center space-x-2 mb-2">
      {isCreating.type == "file" ? (
        <CiFileOn className="text-gray-600" />
      ) : (
        <CiFolderOn className="text-gray-600" />
      )}

      <Input
        value={newFileName}
        onChange={(e) => setNewFileName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        autoFocus
        className="text-gray-600"
      />
    </li>
  );
};

export default NewItemInput;
