import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuCheckboxItem,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { useState } from "react";
import { RiMoreFill } from "react-icons/ri";

const VisibleMenu = ({
  updateProp,
  defaultVis,
}: {
  updateProp: (vis: boolean) => void;
  defaultVis: boolean;
}) => {
  const [visible, setVisible] = useState(defaultVis);

  const toggleVisible = () => {
    updateProp(!visible);
    setVisible(!visible);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button
          variant="ghost"
          className="absolute top-2 right-2 p-2"
          aria-label="More options"
        >
          <RiMoreFill className="text-lg" />
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent className="p-2">
        {visible ? (
          <ContextMenuCheckboxItem checked onClick={() => toggleVisible()}>
            Display Output
          </ContextMenuCheckboxItem>
        ) : (
          <ContextMenuItem inset onClick={toggleVisible}>
            Display Output
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default VisibleMenu;
