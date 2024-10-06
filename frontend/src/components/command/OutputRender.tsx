"use client";

import { RiArrowRightDoubleFill } from "react-icons/ri";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect } from "react";

const OutputRender = ({
  handleCloseSideView,
  response,
}: {
  handleCloseSideView: () => void;
  response: string;
}) => {
  const editor = useCreateBlockNote();

  // const image = `# My output\n\n![my image](https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg)`;

  const convertOutputToMarkdown = async () => {
    const blocks = await editor.tryParseMarkdownToBlocks(response);
    editor.replaceBlocks(editor.document, blocks);
  };

  useEffect(() => {
    convertOutputToMarkdown();
  }, [response]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Button variant={"ghost"} onClick={handleCloseSideView}>
          <RiArrowRightDoubleFill size={20} />
        </Button>
        <h1 className="text-lg flex-1 text-center">Results</h1>
      </div>

      <Separator />

      <div className="flex-1 overflow-auto">
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
