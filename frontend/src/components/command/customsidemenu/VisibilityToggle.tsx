import {
  DragHandleMenuProps,
  useBlockNoteEditor,
  useComponentsContext,
  SideMenuProps,
} from "@blocknote/react";
import { schema } from "../customschema/Schema";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

export function VisibleToggle(
  props: DragHandleMenuProps<typeof schema.blockSchema>
) {
  const [custom, setCustom] = useState(false);
  const [localVis, setLocalVis] = useState(true);
  useEffect(() => {
    if (
      props.block.type == "mention" ||
      props.block.type == "bubble" ||
      props.block.type == "noparam"
    ) {
      setCustom(true);
      setLocalVis(props.block.props.vis);
    } else {
      setCustom(false);
    }
  }, [props.block]);
  const editor: typeof schema.BlockNoteEditor = useBlockNoteEditor();

  const Components = useComponentsContext()!;
  const handleToggle = () => {
    if (
      props.block.type == "mention" ||
      props.block.type == "bubble" ||
      props.block.type == "noparam"
    ) {
      editor.updateBlock(props.block, {
        type: props.block.type,
        props: { vis: !props.block.props.vis },
      });
    }
  };

  return (
    <>
      {custom && (
        <Components.Generic.Menu.Item
          className="bg-blue-500"
          onClick={() => {
            handleToggle();
          }}
          checked={localVis}
        >
          Display output
        </Components.Generic.Menu.Item>
      )}

      {!custom && (
        <Components.Generic.Menu.Label className="flex items-center gap-2">
          Display output
          <FaCheck size={10} />
        </Components.Generic.Menu.Label>
      )}
    </>
  );
}
