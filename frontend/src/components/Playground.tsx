"use client";

import { useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Editor from "./command/CommandEditor";

export default function PlaygroundPage() {
  const [title, setTitle] = useState(""); // State for the title

  return (
    <div className="flex h-full">
      <div className="flex-1 h-full">
        <div className="hidden h-full flex-col md:flex">
          <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
            <h2 className="text-md font-semibold pl-8">Playground</h2>

            {/* Run button at top-right */}
            <div className="flex space-x-4 justify-end pr-4">
              <Button className="bg-green-600 flex items-center space-x-2">
                <span>Run</span>
                <CiLocationArrow1 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex flex-1 items-center px-4 py-6">
            {/* Card Component */}
            <div className="w-full max-w-4xl min-h-[500px] border border-gray-300 rounded-lg shadow-md p-6 bg-white relative">
              {/* Card Title (Notion-style) */}
              <input
                type="text"
                placeholder="Untitled"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-bold focus:outline-none w-full placeholder-gray-400 mb-4"
              />

              <Editor />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
