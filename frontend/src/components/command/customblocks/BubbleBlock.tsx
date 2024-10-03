import { createReactBlockSpec } from "@blocknote/react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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

export const Bubble = createReactBlockSpec(
  {
    type: "bubble",
    propSchema: {
      text: {
        default: "text",
      },
      color: {
        default: "blue",
        values: ["blue", "green", "red", "orange"], // Define allowed colors
      },
    },
    content: "none", // No rich text content; the button itself is the main content
  },
  {
    render: (props) => {
      const { text, color } = props.block.props;
      const colorClass = getColorClass(color);

      return (
        <Card className={`p-4 relative w-full`}>
          <Label
            htmlFor="cardInput" // Associate label with input
            className={`absolute -top-2 left-2 text-xs text-white bg-opacity-75 px-1 ${colorClass}`}
          >
            {text}
          </Label>
          <span className="text-sm underline">Prompt</span>
          <div
            contentEditable
            suppressContentEditableWarning // Prevent React warning for editable content
            id="cardInput"
            className="border-none focus:outline-none w-full min-h-[100px] placeholder-gray-400"
            style={{ padding: "8px" }} // Padding for the editable area
          ></div>
        </Card>
      );
    },
  }
);
