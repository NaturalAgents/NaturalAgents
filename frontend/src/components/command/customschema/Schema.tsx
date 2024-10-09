import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
} from "@blocknote/core";
import { Bubble } from "../customblocks/BubbleBlock";
import { NoParam } from "../customblocks/NoParamBlock";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    bubble: Bubble,
    noparam: NoParam,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
  },
  styleSpecs: {
    ...defaultStyleSpecs,
  },
});
