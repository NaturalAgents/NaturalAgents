import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="absolute top-2 right-2 p-2"
          aria-label="More options"
        >
          <RiMoreFill className="text-lg" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2">
        {visible ? (
          <DropdownMenuCheckboxItem checked onClick={toggleVisible}>
            Display Output
          </DropdownMenuCheckboxItem>
        ) : (
          <DropdownMenuItem inset onClick={toggleVisible}>
            Display Output
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VisibleMenu;
