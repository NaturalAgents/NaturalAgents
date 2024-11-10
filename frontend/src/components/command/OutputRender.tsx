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
import { useEditor } from "../context/editorcontext";

const processPreviewPayload = (document: string) => {
  const blocks = JSON.parse(document);

  // Recursive function to process the blocks and their children
  const processBlocks = (blockList: any[], isOutermost: boolean): any[] => {
    return blockList.flatMap((block) => {
      // Check if the block type is custom
      if (
        block.type === "bubble" ||
        block.type === "noparam" ||
        block.type === "file" ||
        block.type === "mention"
      ) {
        // If it's an outermost block with a custom type, prepend the custom logic paragraph
        if (isOutermost) {
          return [
            {
              type: "paragraph",
              props: {
                text: "your custom logic",
              },
              content: [
                {
                  type: "text",
                  text: "your custom logic",
                  styles: { italic: true },
                },
              ],
              children: [],
            },
            {
              type: "paragraph",
              props: {
                text: block.type,
              },
              content: [
                { type: "text", text: block.type, styles: { bold: true } },
              ],
              children: processBlocks(block.children, false), // Process children recursively
            },
          ];
        }

        // For non-outermost custom types, simply transform them as before
        return {
          type: "paragraph",
          props: {
            text: block.type,
          },
          content: [{ type: "text", text: block.type, styles: { bold: true } }],
          children: processBlocks(block.children, false), // Process children recursively
        };
      }

      // Process children if they exist
      if (block.children && Array.isArray(block.children)) {
        return {
          ...block,
          children: processBlocks(block.children, false), // Not outermost anymore
        };
      }

      return block; // Return unchanged block if not custom type
    });
  };

  // Process the top-level blocks, marking them as outermost
  const processedBlocks = processBlocks(blocks, true);
  return processedBlocks;
};

const OutputRender = () => {
  const [initialContent, setInitialContent] = useState([{}]);

  const { document, preview, setPanelVis } = useEditor();

  const editor = useCreateBlockNote({ schema, initialContent });
  const sidRef = useRef<string>("");

  useEffect(() => {
    const handleSessionMessage = async (event: Event) => {
      const customEvent = event as CustomEvent; // Type casting to CustomEvent
      const newMessage = customEvent.detail.data;

      console.log("new message", newMessage);

      const currentContent = editor.document;
      const contentCopy = [...currentContent];
      if (newMessage.sid) {
        sidRef.current = newMessage.sid;
      }

      if (newMessage.request && newMessage.request == "userinput") {
        contentCopy.push({
          id: uuidv4(),
          type: "bubble",
          props: {
            text: "User request",
            color: "orange",
            prompt: newMessage.msg,
            send: true,
            sid: sidRef.current,
            vis: true,
            provider: "null",
          },
          content: [],
          children: [],
        });
      }

      if (newMessage.request && newMessage.request == "file") {
        if (newMessage.type == "PDF") {
          contentCopy.push({
            id: uuidv4(),
            type: "file",
            props: {
              fileUrl: "",
              fileType: "PDF",
              send: true,
              sid: sidRef.current,
              vis: true,
            },
            content: [],
            children: [],
          });
        }
      }

      if (newMessage.output) {
        const block = await editor.tryParseMarkdownToBlocks(newMessage.output);
        contentCopy.push(...block);
      }

      setInitialContent(contentCopy);
      editor.replaceBlocks(editor.document, contentCopy);
    };

    Session.addEventListener("sessionMessage", handleSessionMessage);
    Session.setReady(true);

    return () => {
      Session.removeEventListener("sessionMessage", handleSessionMessage);
      Session.setReady(false);
    };
  }, [editor]);

  useEffect(() => {
    if (preview) {
      const blocks = processPreviewPayload(document);
      editor.replaceBlocks(editor.document, blocks);
    }

    if (document == "[{}] override") {
      editor.replaceBlocks(editor.document, [{}]);
    }
  }, [document]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Button variant={"ghost"} onClick={() => setPanelVis(false)}>
          <RiArrowRightDoubleFill size={20} />
        </Button>
        <h1 className="text-lg flex-1 text-center">
          {preview ? "Preview" : "Results"}
        </h1>
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
