"use client";

import { useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import dynamic from "next/dynamic";

import { ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import OutputRender from "./command/OutputRender";

const Editor = dynamic(() => import("./command/CommandEditor"), { ssr: false });

export default function PlaygroundPage() {
  const [isSideViewOpen, setIsSideViewOpen] = useState(true); // State for managing side view visibility

  const handleRunClick = () => {
    setIsSideViewOpen(true); // Open side view when Run is clicked
  };

  const handleCloseSideView = () => {
    setIsSideViewOpen(false); // Close side view
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 h-full">
        <div className="hidden h-full flex-col md:flex ">
          <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16 bg-white">
            <h2 className="text-md font-semibold pl-8">Playground</h2>

            {/* Run button at top-right */}
            <div className="flex space-x-4 justify-end pr-4">
              <Button
                className="bg-green-600 flex items-center space-x-2"
                onClick={handleRunClick}
              >
                <span>Run</span>
                <CiLocationArrow1 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <Editor />
            </ResizablePanel>
            {/* {isSideViewOpen && <Separator orientation="vertical" />} */}

            {isSideViewOpen && (
              <div className="border border-gray-300 w-1/2 h-screen overflow-y-scroll	bg-white">
                <ResizablePanel>
                  <OutputRender handleCloseSideView={handleCloseSideView} />
                </ResizablePanel>
              </div>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
