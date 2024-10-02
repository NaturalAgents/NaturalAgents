import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { CiUser } from "react-icons/ci";

const InsertBlockCreate = (text: string, styles = {}) => {
  const block: PartialBlock = {
    type: "paragraph",
    content: [
      {
        type: "text",
        text: text,
        styles: styles,
      },
    ],
  };

  return block;
};

export const userInputItem = (editor: BlockNoteEditor) => ({
  title: "Get human user input",
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    const block: PartialBlock = InsertBlockCreate("<command>:user_input", {
      bold: true,
      textColor: "blue",
    });
    editor.insertBlocks([block], currentBlock, "after");
  },
  aliases: ["userinput", "ui"],
  group: "Input",
  icon: <CiUser size={18} />,
  subtext: "Request a human user for input.",
});

export const searchWebItem = (editor: BlockNoteEditor) => ({
  title: "Search the web",
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    const block: PartialBlock = InsertBlockCreate("<command>:search_web", {
      bold: true,
      textColor: "purple",
    });
    editor.insertBlocks([block], currentBlock, "after");
  },
  aliases: ["searchweb", "sw"],
  group: "Tools",
  icon: <CiUser size={18} />,
  subtext: "Search the web for information.",
});

export const scrapeURLItem = (editor: BlockNoteEditor) => ({
  title: "Get formatted information from URL",
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    const block: PartialBlock = InsertBlockCreate("<command>:scrape_url", {
      bold: true,
      textColor: "pink",
    });
    editor.insertBlocks([block], currentBlock, "after");
  },
  aliases: ["scrapeurl", "su"],
  group: "Tools",
  icon: <CiUser size={18} />,
  subtext: "Scrape and format information from URL.",
});

export const imageGenerationItem = (editor: BlockNoteEditor) => ({
  title: "Generate image from description",
  onItemClick: () => {
    const currentBlock = editor.getTextCursorPosition().block;
    const block: PartialBlock = InsertBlockCreate("<command>:generate_image", {
      bold: true,
      textColor: "orange",
    });
    editor.insertBlocks([block], currentBlock, "after");
  },
  aliases: ["generateimage", "gi"],
  group: "Tools",
  icon: <CiUser size={18} />,
  subtext: "Generate image based on description.",
});
