import { createReactBlockSpec } from "@blocknote/react";
import { Badge } from "@/components/ui/badge";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Function to map color to classes
const getColorClass = (color: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-700";
    case "green":
      return "bg-teal-600";
    case "red":
      return "bg-red-500";
    case "orange":
      return "bg-orange-500 hover:bg-orange-600";
    default:
      return "bg-blue-700"; // Default fallback color
  }
};

export const NoParam = createReactBlockSpec(
  {
    type: "noparam",
    propSchema: {
      text: {
        default: "<command>:summarize",
        values: ["<command>:summarize"],
      },
      color: {
        default: "blue",
        values: ["blue", "green", "red", "orange"], // Define allowed colors
      },
      vis: {
        default: true,
      },
    },
    content: "inline", // No rich text content; the button itself is the main content
  },
  {
    render: (props) => {
      const { text, vis } = props.block.props;
      return (
        <>
          <span className="inline-block align-middle">
            <Badge
              variant="outline"
              className={`bg-purple-500 text-black flex items-center text-md gap-2`}
            >
              <span>{vis ? <FaEye /> : <FaEyeSlash />}</span>
              {text}
            </Badge>
          </span>
          <div className="inline-content"></div>
        </>
      );
    },
  }
);
