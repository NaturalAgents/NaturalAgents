import { RiArrowRightDoubleFill } from "react-icons/ri";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const OutputRender = ({
  handleCloseSideView,
  response,
}: {
  handleCloseSideView: () => void;
  response: string;
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Button variant={"ghost"} onClick={handleCloseSideView}>
          <RiArrowRightDoubleFill size={20} />
        </Button>
        <h1 className="text-lg flex-1 text-center">Results</h1>
      </div>

      <Separator />

      <div className="flex flex-1 items-center justify-center">
        <div>{response}</div>
      </div>
    </div>
  );
};

export default OutputRender;
