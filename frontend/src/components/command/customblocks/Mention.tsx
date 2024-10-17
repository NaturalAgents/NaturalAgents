import { createReactBlockSpec } from "@blocknote/react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FiX } from "react-icons/fi";

const NestedDropdown = ({
  options,
  onSelect,
  path,
  isActive,
}: {
  options: Record<any, any>;
  onSelect: (path: string[]) => void;
  path: string[];
  isActive: boolean; // Whether the dropdown is active or disabled
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [open, setOpen] = useState(true); // Open the dropdown by default

  // If a key is selected and it has children, render the next level of dropdown
  const handleSelect = (key: string) => {
    setSelectedKey(key);
    onSelect([...path, key]); // Always use a fresh path
  };

  return (
    <div>
      <DropdownMenu open={isActive && open} onOpenChange={setOpen}>
        <DropdownMenuTrigger>
          <div
            className={`${isActive ? "cursor-pointer" : "cursor-default"}`}
          ></div>
        </DropdownMenuTrigger>
        {isActive && (
          <DropdownMenuContent className="w-48">
            {Object.keys(options).map((key) => (
              <DropdownMenuItem
                key={key}
                onClick={() => handleSelect(key)}
                className="cursor-pointer"
              >
                {key}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      {/* Recursively render the next level of the dropdown if available */}
      {selectedKey && typeof options[selectedKey] === "object" && (
        <div className="ml-4 mt-2">
          <NestedDropdown
            options={options[selectedKey]}
            onSelect={onSelect}
            path={path} // Pass down the updated path
            isActive={true} // Only the last nested dropdown is active
          />
        </div>
      )}
    </div>
  );
};

// Component for each nest
const NestComponent = ({
  nest,
  options,
  onSelect,
  path,
  onDelete,
  isActive,
}: {
  nest: string;
  options: Record<string, any>; // The full options tree for this level
  onSelect: (path: string[]) => void; // Callback to trigger when a new option is selected
  path: string[]; // Current path
  onDelete: (key: string) => void; // Callback to delete nests from the current one onwards
  isActive: boolean; // Whether the dropdown is active or disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => {
    if (isActive) setIsOpen(!isOpen);
  };

  const handleDelete = () => {
    onDelete(nest);
  };

  return (
    <span className="inline-flex items-center bg-gray-200 py-1 px-2 mx-1 rounded-md cursor-pointer relative">
      {/* NestComponent text */}
      <span onClick={handleToggleDropdown} className="mr-1">
        {nest}
      </span>

      {/* "X" icon for deleting from current nest onwards */}
      <FiX
        onClick={handleDelete}
        className="ml-1 text-red-500 cursor-pointer text-sm"
      />

      {/* Open nested dropdown when clicked */}
      {isOpen && isActive && (
        <div className="absolute left-0 top-full">
          <NestedDropdown
            options={options}
            onSelect={onSelect}
            path={path} // Pass down the current path
            isActive={isActive} // Pass isActive to determine if dropdown should be enabled
          />
        </div>
      )}
    </span>
  );
};

// The Mention inline content spec
export const Mention = createReactBlockSpec(
  {
    type: "mention",
    propSchema: {
      object: {
        default: "", // The referenceOptions object
      },
      parentKey: {
        default: "",
      },
    },
    content: "none", // No additional inline content
  },
  {
    render: (props) => {
      const referenceOptions = JSON.parse(props.block.props.object);
      const [selectedPath, setSelectedPath] = useState([
        props.block.props.parentKey,
      ]);

      // Update the selected path whenever an item is selected from dropdown
      const handleSelection = (path: string[]) => {
        setSelectedPath(path);
      };

      // Handle deletion from the current nest onwards
      const handleDelete = (nest: string) => {
        setSelectedPath((prevPath) => {
          const deleteIndex = prevPath.indexOf(nest);
          return prevPath.slice(0, deleteIndex); // Remove nests from the current one onwards
        });
      };

      return (
        <div className="inline-block relative">
          {/* Display the final selected path */}
          <span className="bg-purple-200 py-1 px-2 rounded-md">
            @
            {selectedPath.length > 0
              ? selectedPath.map((key, index) => (
                  <React.Fragment key={key}>
                    <NestComponent
                      nest={key}
                      options={referenceOptions[key] || {}}
                      onSelect={handleSelection}
                      path={selectedPath}
                      onDelete={handleDelete}
                      isActive={index === selectedPath.length - 1}
                    />
                    {index < selectedPath.length - 1 && (
                      <span className="mx-1">{"->"}</span>
                    )}
                  </React.Fragment>
                ))
              : ""}
          </span>

          {/* Render the nested dropdown for the last item */}
          <div className="absolute top-full left-0">
            <NestedDropdown
              options={referenceOptions}
              onSelect={handleSelection}
              path={selectedPath}
              isActive={true}
            />
          </div>
        </div>
      );
    },
  }
);
