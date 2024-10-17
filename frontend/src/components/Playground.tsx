"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CiLocationArrow1 } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaRegSave } from "react-icons/fa";
import { VscOpenPreview } from "react-icons/vsc";

import dynamic from "next/dynamic";

import { ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { AiOutlineLoading } from "react-icons/ai";
import { useEditor } from "./context/editorcontext";
import { writeFile } from "./services/api";
import FileExplorer, { FileEntry } from "./file-explorer/FileExplorer";
import { Session } from "@/services/session";
const Editor = dynamic(() => import("./command/CommandEditor"), { ssr: false });
const OutputRender = dynamic(() => import("./command/OutputRender"), {
  ssr: false,
});

export default function PlaygroundPage() {
  const [isSideViewOpen, setIsSideViewOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [preview, setPreview] = useState(true);
  const [loading, setLoading] = useState(false);
  const { editorRef, title, setDocument } = useEditor();
  const { toast } = useToast();

  useEffect(() => {
    Session.startNewSession();

    const finishRun = async (event: Event) => {
      const customEvent = event as CustomEvent; // Type casting to CustomEvent
      const newMessage = customEvent.detail.data;
      if (newMessage.finished) {
        setLoading(false);
      }
    };

    Session.addEventListener("finished", finishRun);

    return () => {
      Session.removeEventListener("finished", finishRun);
    };
  }, []);

  const handleRunClick = async () => {
    setDocument("[{}] override"); // override indicator clears preview component only when "run" is pressed
    setLoading(true);
    setIsSideViewOpen(true); // Open side view when Run is clicked
    setPreview(false);

    if (editorRef) {
      const data = editorRef.current?.document || [];
      Session.send(
        JSON.stringify({ action: "run", content: JSON.stringify(data) })
      );
    }
  };

  const handleCloseSideView = () => {
    setIsSideViewOpen(false); // Close side view
  };

  const handlePreview = () => {
    if (!loading) {
      setPreview(true);
    }
    setIsSideViewOpen(true);
  };

  const handleSaveFile = async () => {
    if (selectedFile) {
      const text = editorRef?.current?.document || [];
      const res = await writeFile(
        selectedFile.path,
        title,
        JSON.stringify(text)
      );
      if (res) {
        toast({
          title: "Save status",
          description: "Successful!",
        });
      } else {
        toast({
          title: "Save status",
          description: "Failed due to unexpected error :(",
        });
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <FileExplorer setSelectedFile={setSelectedFile} />

      <div className="flex-1 h-full">
        <div className="hidden h-full flex-col md:flex ">
          <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16 bg-white">
            <h2 className="text-md font-semibold pl-8">Playground</h2>
            {/* Run button at top-right */}
            <div className="flex space-x-4 justify-end pr-4">
              <Button
                variant={"outline"}
                className="flex items-center space-x-2"
                onClick={handleSaveFile}
              >
                <span>Save File</span>
                <FaRegSave className="h-4 w-4" />
              </Button>
              <Button
                variant={"outline"}
                className="flex items-center space-x-2"
                onClick={handlePreview}
              >
                <span>Preview</span>
                <VscOpenPreview className="h-4 w-4" />
              </Button>
              <Button
                className="bg-green-600 flex items-center space-x-2"
                onClick={handleRunClick}
                disabled={loading}
              >
                {loading ? (
                  <AiOutlineLoading className="animate-spin h-4 w-4" />
                ) : (
                  <>
                    <span>Run</span>
                    <CiLocationArrow1 className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator />

          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <Editor selectedFile={selectedFile} />
            </ResizablePanel>

            {isSideViewOpen && (
              <div className="border border-gray-300 w-1/2 h-screen overflow-y-scroll	bg-white">
                <ResizablePanel>
                  <OutputRender
                    handleCloseSideView={handleCloseSideView}
                    preview={preview}
                    selectedFile={selectedFile}
                  />
                </ResizablePanel>
              </div>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
