import {
  BlockNoteEditor,
  PartialBlock,
  insertOrUpdateBlock,
} from "@blocknote/core";
import { CiUser, CiImageOn, CiSearch } from "react-icons/ci";
import { schema } from "./customschema/Schema";
import { CgWebsite } from "react-icons/cg";

import { BsChatLeftText } from "react-icons/bs";
import { MdOutlineSummarize } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa6";

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

export const userInputItem = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Get human user input",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "bubble",
      props: {
        text: "<command>:userinput",
        color: "orange",
      },
    });
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
  icon: <CiSearch size={18} />,
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
  icon: <CgWebsite size={18} />,
  subtext: "Scrape and format information from URL.",
});

export const imageGenerationItem = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Generate image from description",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "bubble",
      props: {
        text: "<command>:image_generation",
        color: "green",
      },
    });
  },
  aliases: ["generateimage", "gi"],
  group: "Output",
  icon: <CiImageOn size={18} />,
});

export const textGenerationItem = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Generate text",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "bubble",
      props: {
        text: "<command>:generate",
        color: "blue",
      },
    });
  },
  aliases: ["generate", "g"],
  group: "Output",
  icon: <BsChatLeftText size={18} />,
});

export const summarizeItem = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Summarize",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "noparam",
      props: {
        text: "<command>:summarize",
      },
    });
  },
  aliases: ["summarize", "su", "summary"],
  group: "Output",
  icon: <MdOutlineSummarize size={18} />,
});

export const pdfUploadItem = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Upload PDF",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "file",
      props: {},
    });
  },
  aliases: ["pdfupload", "pdf", "upload"],
  group: "Input",
  icon: <FaRegFilePdf size={18} />,
});
