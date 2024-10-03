import { Button } from "../ui/button";

const OutputRender = ({
  handleCloseSideView,
}: {
  handleCloseSideView: () => void;
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-start p-4">
        <Button
          className="bg-blue-600 text-white"
          onClick={handleCloseSideView}
        >
          Output Action
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">Output Section</div>
      </div>
    </div>
  );
};

export default OutputRender;
