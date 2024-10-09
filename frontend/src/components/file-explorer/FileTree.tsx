import { FileEntry } from "./FileExplorer";
import FileItem from "./FileItem";

interface FileListProps {
  directoryTree: FileEntry[];
  navigateTo: (path: string) => void;
  getDirectoryTree: () => void;
  currentPath: string;
}

const FileTree: React.FC<FileListProps> = ({
  directoryTree,
  navigateTo,
  getDirectoryTree,
  currentPath,
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
        />
      ))}
    </>
  );
};

export default FileTree;
