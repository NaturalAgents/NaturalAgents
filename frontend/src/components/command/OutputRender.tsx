"use client";

import { RiArrowRightDoubleFill } from "react-icons/ri";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useRef, useState } from "react";
import { schema } from "./customschema/Schema";
import { Session } from "@/services/session";
import { v4 as uuidv4 } from "uuid";

const OutputRender = ({
  handleCloseSideView,
}: {
  handleCloseSideView: () => void;
}) => {
  const [initialContent, setInitialContent] = useState([{}]);

  const editor = useCreateBlockNote({ schema, initialContent });
  const sidRef = useRef<string>("");

  useEffect(() => {
    const handleSessionMessage = async (event: Event) => {
      const customEvent = event as CustomEvent; // Type casting to CustomEvent
      const newMessage = customEvent.detail.data;

      const currentContent = editor.document;
      const contentCopy = [...currentContent];
      if (newMessage.sid) {
        sidRef.current = newMessage.sid;
      }

      if (newMessage.request) {
        contentCopy.push({
          id: uuidv4(),
          type: "bubble",
          props: {
            text: "User request",
            color: "orange",
            prompt: newMessage.msg,
            send: true,
            sid: sidRef.current,
          },
          content: [],
          children: [],
        });
      }

      if (newMessage.output) {
        const block = await editor.tryParseMarkdownToBlocks(newMessage.output);
        contentCopy.push(...block);
      }

      setInitialContent(contentCopy);
      editor.replaceBlocks(editor.document, contentCopy);
    };

    Session.addEventListener("sessionMessage", handleSessionMessage);

    return () => {
      Session.removeEventListener("sessionMessage", handleSessionMessage);
    };
  }, [editor]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Button variant={"ghost"} onClick={handleCloseSideView}>
          <RiArrowRightDoubleFill size={20} />
        </Button>
        <h1 className="text-lg flex-1 text-center">Results</h1>
      </div>

      <Separator />

      <div className="flex-1 overflow-auto mb-24 mt-4">
        <div className="flex items-center justify-center">
          <BlockNoteView
            editor={editor}
            editable={false}
            theme={"light"}
            className="w-full h-full overflow-y-auto" // Fixed height with scrollable content
          />
        </div>
      </div>
    </div>
  );
};

export default OutputRender;
