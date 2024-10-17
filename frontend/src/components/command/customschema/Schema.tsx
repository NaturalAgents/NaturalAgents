import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
} from "@blocknote/core";
import { Bubble } from "../customblocks/BubbleBlock";
import { NoParam } from "../customblocks/NoParamBlock";
import { FileBlock } from "../customblocks/FileBlock";
import { Mention } from "../customblocks/Mention";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    bubble: Bubble,
    noparam: NoParam,
    file: FileBlock,
    mention: Mention,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
  },
  styleSpecs: {
    ...defaultStyleSpecs,
  },
});
