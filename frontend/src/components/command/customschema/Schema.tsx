import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
} from "@blocknote/core";
import { Bubble } from "../customblocks/BubbleBlock";
import { NoParam } from "../customblocks/NoParamBlock";
import { FileBlock } from "../customblocks/FileBlock";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    bubble: Bubble,
    noparam: NoParam,
    file: FileBlock,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
  },
  styleSpecs: {
    ...defaultStyleSpecs,
  },
});
