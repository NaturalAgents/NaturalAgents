"use client";

import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { SuggestionMenuController } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { schema } from "./customschema/Schema";
import { useEffect, useMemo, useState } from "react";
import { useEditor } from "../context/editorcontext";
import { FileEntry } from "../file-explorer/FileExplorer";
import { readFile } from "../services/api";
import {
  getCustomSlashMenuItems,
  getMentionMenuItems,
  trackReferenceBlocks,
} from "./customblocks/utils/commandEditorMenus";

const Editor = ({ selectedFile }: { selectedFile: FileEntry | null }) => {
  const [initialContent, setInitialContent] = useState<
    (typeof schema.PartialBlock)[] | null
  >(null);

  const [referenceOptions, setReferenceOptions] = useState<any>([]);

  const editor = useMemo(() => {
    if (!initialContent) {
      return BlockNoteEditor.create({ schema });
    }
    return BlockNoteEditor.create({ schema, initialContent });
  }, [initialContent]);

  const { editorRef, setTitle, title, setDocument } = useEditor();
  editorRef.current = editor;

  const read = async () => {
    if (selectedFile) {
      const res = await readFile(selectedFile.path);
      if (res) {
        setTitle(res.title);
        setInitialContent(JSON.parse(res.text));
        setDocument(res.text);
      }
    }
  };

  useEffect(() => {
    read();
  }, [selectedFile]);

  return (
    <div className="flex flex-1 items-center px-4 py-6 w-full">
      {selectedFile && (
        <div className="w-full max-w-4xl min-h-[500px] border border-gray-300 rounded-lg shadow-md p-6 bg-white relative">
          <div>{selectedFile.name}</div>
          <input
            type="text"
            placeholder="Untitled"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold focus:outline-none w-full placeholder-gray-400 mb-4"
          />
          <div className="h-[450px] overflow-y-auto">
            {editor ? (
              <BlockNoteView
                editor={editor}
                slashMenu={false}
                theme={"light"}
                onChange={() => {
                  trackReferenceBlocks(editor, setReferenceOptions); // Track the blocks when document changes
                  setDocument(JSON.stringify(editor.document));
                }}
              >
                <SuggestionMenuController
                  triggerCharacter={"/"}
                  getItems={async (query) =>
                    filterSuggestionItems(
                      [...getCustomSlashMenuItems(editor)],
                      query
                    )
                  }
                />

                <SuggestionMenuController
                  triggerCharacter={"@"}
                  getItems={async (query) =>
                    // Gets the mentions menu items
                    filterSuggestionItems(
                      getMentionMenuItems(editor, referenceOptions),
                      query
                    )
                  }
                />
              </BlockNoteView>
            ) : (
              "Loading ... "
            )}
          </div>
        </div>
      )}

      {!selectedFile && "Open or create a file"}
    </div>
  );
};

export default Editor;
