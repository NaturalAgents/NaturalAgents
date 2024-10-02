import { useState } from "react";
import { CiFileOn, CiFolderOn } from "react-icons/ci";
import { VscNewFile, VscNewFolder } from "react-icons/vsc";

const FileExplorer = () => {
  const [directories, setDirectories] = useState([
    { type: "folder", name: "Folder 1", children: [] },
  ]);

  // Function to create a new file
  // const createFile = () => {
  //   setDirectories((prev) => [
  //     ...prev,
  //     { type: "file", name: `File ${prev.length + 1}` },
  //   ]);
  // };

  // Function to create a new folder
  const createFolder = () => {
    setDirectories((prev) => [
      ...prev,
      { type: "folder", name: `Folder ${prev.length + 1}`, children: [] },
    ]);
  };

  return (
    <div className="min-h-screen w-48 bg-white border-r border-gray-300 flex flex-col items-start py-4">
      <div className="px-4 flex items-center space-x-2">
        {/* Folder and File icons */}
        <VscNewFile
          className="cursor-pointer text-gray-600"
          size={20}
          // onClick={createFile}
        />
        <VscNewFolder
          className="cursor-pointer text-gray-600"
          size={20}
          onClick={createFolder}
        />
      </div>

      {/* Render Directories */}
      <div className="px-4 mt-6 w-full">
        <h3 className="text-lg font-semibold">Files</h3>
        <ul className="mt-4">
          {directories.map((dir, index) => (
            <li
              key={index}
              className="text-sm text-gray-700 mb-2 flex items-center space-x-2"
            >
              {dir.type === "file" ? (
                <CiFileOn className="text-gray-600" />
              ) : (
                <CiFolderOn className="text-gray-600" />
              )}
              <span>{dir.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileExplorer;
