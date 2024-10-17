import { DefaultReactSuggestionItem } from "@blocknote/react";
import { schema } from "../../customschema/Schema";
import {
  userInputItem,
  imageGenerationItem,
  textGenerationItem,
  summarizeItem,
  pdfUploadItem,
} from "../../CommandOptions";

import { insertOrUpdateBlock } from "@blocknote/core";

// List containing all default Slash Menu Items, as well as our custom one.
export const getCustomSlashMenuItems = (
  editor: typeof schema.BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  userInputItem(editor),
  pdfUploadItem(editor),
  imageGenerationItem(editor),
  textGenerationItem(editor),
  summarizeItem(editor),
];

export const getMentionMenuItems = (
  editor: typeof schema.BlockNoteEditor,
  referenceOptions: any
): DefaultReactSuggestionItem[] => {
  const levelOne = Object.keys(referenceOptions);

  return levelOne.map((key) => ({
    title: key,
    onItemClick: () => {
      insertOrUpdateBlock(editor, {
        type: "mention",
        props: {
          object: JSON.stringify(referenceOptions[key]),
          parentKey: key,
        },
      });
    },
  }));
};

export const trackReferenceBlocks = (
  editor: typeof schema.BlockNoteEditor,
  setReferenceOptions: (objects: any) => void
) => {
  if (!editor) return;

  const currentSelection = editor.getTextCursorPosition();
  if (!currentSelection) return;

  const blocks = editor.document;
  const collectedReferences: any = {};

  const blockCounts: { [key: string]: number } = {
    bubble: 0,
    noparam: 0,
    file: 0,
  };

  // Recursive function to process blocks and their children
  const processBlock = (block: any, depth: number, parentName?: string) => {
    if (!block) return;

    // Process "bubble", "noparam", and "file" types
    if (
      block.type === "bubble" ||
      block.type === "noparam" ||
      block.type === "file"
    ) {
      // Increment the count for the block type
      blockCounts[block.type] += 1;

      // Create the block name, with parentName if the block is nested
      const blockName = `${block.type} ${blockCounts[block.type]}`;

      // Add the block to the collected references
      if (block.type == "file") {
        collectedReferences[blockName] = {
          pages: { 1: "text", 2: "text" },
          text: "output",
          images: "output",
        };
      } else {
        collectedReferences[blockName] = {
          output: "output",
        };
      }

      // Recursively process any children of the block
      if (block.children) {
        block.children.forEach((child: any) =>
          processBlock(child, depth + 1, blockName)
        );
      }
    }
  };

  // Iterate over all blocks until we reach the current cursor's block
  for (const block of blocks) {
    if (block === currentSelection.block) {
      break; // Stop when reaching the current block
    }

    // Process the block at depth 0 (top level)
    processBlock(block, 0);
  }

  setReferenceOptions(collectedReferences); // Update the referenceOptions object
};
