import { CiFileOn, CiFolderOn } from "react-icons/ci";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuContent,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Import ShadCN button component
import { FileEntry } from "./FileExplorer";
import { handleFile, handleFolder } from "../services/api";

interface FileItemProps {
  entry: FileEntry;
  navigateTo: (path: string) => void;
  getDirectoryTree: () => void;
  currentPath: string;
  setSelectedFile: (fileentry: FileEntry) => void;
}

const FileItem: React.FC<FileItemProps & { updateFile: (file: FileEntry) => void }> = ({
  entry,
  navigateTo,
  getDirectoryTree,
  currentPath,
  setSelectedFile,
  updateFile,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(entry.name);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      if (entry.is_file) {
        await handleFile(currentPath, entry.name, "delete");
      } else {
        console.log("path", currentPath);
        await handleFolder(currentPath, entry.name, "delete");
      }
      setShowDeleteDialog(false);
      getDirectoryTree();
    } catch (error) {
      console.error("Error deleting file or folder:", error);
    }
  };

  const handleRename = async () => {
    if (newName.trim() === "") return;

    try {
      if (entry.is_file) {
        await handleFile(currentPath, entry.name, "rename", newName);
      } else {
        await handleFolder(currentPath, entry.name, "rename", newName);
      }
      const updatedEntry = {
        ...entry,
        name: newName,
        path: `${currentPath}/${newName}`,
      };
      updateFile(updatedEntry);
      setIsRenaming(false);
      setSelectedFile({ ...entry, name: newName, path: `${currentPath}/${newName}` });
      getDirectoryTree();
    } catch (error) {
      console.error("Error renaming file or folder:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRename();
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <li
            className="cursor-pointer flex items-center space-x-2 mb-2"
            onClick={() => {
              if (!isRenaming && entry.is_directory) {
                navigateTo(entry.path);
              }
              if (!isRenaming && entry.is_file) {
                setSelectedFile(entry);
              }
            }}
          >
            {entry.is_directory ? (
              <CiFolderOn className="text-gray-600" />
            ) : (
              <CiFileOn className="text-gray-600" />
            )}

            {isRenaming ? (
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyPress}
                autoFocus
                className="text-gray-600"
              />
            ) : (
              <span>{entry.name}</span>
            )}
          </li>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setIsRenaming(true)}>
            Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setShowDeleteDialog(true)}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{entry.name}"? This action cannot
            be undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileItem;
