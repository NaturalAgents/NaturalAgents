import { createReactBlockSpec } from "@blocknote/react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FaClosedCaptioning } from "react-icons/fa";
import { RiArrowRightSLine, RiCheckLine, RiMoreFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Session } from "@/services/session";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import VisibleMenu from "./utils/visibilityMenu";

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
      return "bg-orange-600";
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
      prompt: {
        default: "Prompt",
      },
      send: {
        default: false,
      },
      vis: {
        default: true,
        values: [true, false],
      },
      sid: {
        default: "",
      },
    },
    content: "inline", // No rich text content; the button itself is the main content
  },
  {
    render: (props) => {
      const { text, color, prompt, send, sid, vis } = props.block.props;
      const colorClass = getColorClass(color);
      const [userInput, setUserInput] = useState("");
      const [disabled, setDisabled] = useState(false);

      const onClick = () => {
        Session.send(
          JSON.stringify({
            action: "ping_agent",
            sid,
            content: { msg: userInput },
          })
        );

        setDisabled(true);
      };

      const updateProp = (visible: boolean) => {
        props.editor.updateBlock(props.block, {
          type: "bubble",
          props: { vis: visible },
        });
      };

      return (
        <Card className={`p-4 relative w-full`}>
          {/* Label with text */}
          <Label
            htmlFor="cardInput" // Associate label with input
            className={`absolute -top-2 left-2 text-xs text-white bg-opacity-75 px-1 ${colorClass}`}
          >
            {text}
          </Label>

          {/* 3-dotted menu button in top-right */}

          <VisibleMenu updateProp={updateProp} defaultVis={vis} />
          <span className="text-sm underline">{prompt}</span>

          {send ? (
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response here..."
              className="mt-2 mb-8"
            />
          ) : (
            <div
              ref={props.contentRef}
              contentEditable
              suppressContentEditableWarning
              id="cardInput"
              className="border-none focus:outline-none w-full min-h-[100px] placeholder-gray-400"
              style={{ padding: "8px" }}
            ></div>
          )}

          {send && (
            <Button
              variant="default"
              size="sm"
              className="absolute bottom-2 right-2 flex items-center gap-2"
              onClick={onClick}
              disabled={disabled}
            >
              <RiArrowRightSLine className="text-xl" />
            </Button>
          )}
        </Card>
      );
    },
  }
);
