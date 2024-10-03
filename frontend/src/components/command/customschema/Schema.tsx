import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
} from "@blocknote/core";
import { Bubble } from "../customblocks/BubbleBlock";

export const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    bubble: Bubble,
  },
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
  },
  styleSpecs: {
    ...defaultStyleSpecs,
  },
});
