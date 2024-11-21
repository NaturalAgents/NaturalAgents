import { FileEntry } from "./FileExplorer";
import FileItem from "./FileItem";

interface FileListProps {
  directoryTree: FileEntry[];
  navigateTo: (path: string) => void;
  getDirectoryTree: () => void;
  currentPath: string;
  setSelectedFile: (fileentry: FileEntry) => void;
  updateFile: (updatedFile: FileEntry) => void;
}

const FileTree: React.FC<FileListProps> = ({
  directoryTree,
  navigateTo,
  getDirectoryTree,
  currentPath,
  setSelectedFile,
  updateFile,
}) => {
  return (
    <>
      {directoryTree.map((entry) => (
        <FileItem
          key={entry.path}
          entry={entry}
          navigateTo={navigateTo}
          getDirectoryTree={getDirectoryTree}
          currentPath={currentPath}
          setSelectedFile={setSelectedFile}
          updateFile={updateFile}
        />
      ))}
    </>
  );
};

export default FileTree;
