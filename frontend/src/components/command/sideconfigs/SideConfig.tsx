import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RiArrowRightDoubleFill } from "react-icons/ri";

const SideConfig = () => {
  const handleCloseSideView = () => {};
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Button variant={"ghost"} onClick={handleCloseSideView}>
          <RiArrowRightDoubleFill size={20} />
        </Button>
        <h1 className="text-lg flex-1 text-center">Macro Settings</h1>
      </div>

      <Separator />
    </div>
  );
};

export default SideConfig;
