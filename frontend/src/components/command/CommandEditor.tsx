import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  userInputItem,
  searchWebItem,
  scrapeURLItem,
  imageGenerationItem,
} from "./CommandOptions";

// List containing all default Slash Menu Items, as well as our custom one.
const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
  userInputItem(editor),
  searchWebItem(editor),
  scrapeURLItem(editor),
  imageGenerationItem(editor),
];

const Editor = () => {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({});

  return (
    <BlockNoteView editor={editor} slashMenu={false} theme={"light"}>
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          filterSuggestionItems(getCustomSlashMenuItems(editor), query)
        }
      />
    </BlockNoteView>
  );
};

export default Editor;
