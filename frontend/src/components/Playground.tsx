"use client";

import { Metadata } from "next";
import { CiLocationArrow1 } from "react-icons/ci";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Playground",
  description: "The OpenAI Playground built using the components.",
};

export default function PlaygroundPage() {
  const [title, setTitle] = useState(""); // State for the title

  return (
    <div className="flex-1 h-full">
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-md font-semibold pl-8">Playground</h2>

          {/* Move the Run button to the top-right of the header with space between text and icon */}
          <div className="ml-auto flex space-x-4 sm:justify-end">
            <Button className="bg-green-600 flex items-center space-x-2">
              <span>Run</span> {/* Add space between text and icon */}
              <CiLocationArrow1 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex flex-1 items-center px-4 py-6">
          {/* Card Component */}
          <div className="w-full max-w-4xl min-h-[500px] border border-gray-300 rounded-lg shadow-md p-6 bg-white">
            {/* Card Title (Notion-style) */}
            <input
              type="text"
              placeholder="Untitled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold focus:outline-none w-full placeholder-gray-400"
            />

            {/* Content area (add your other content here) */}
            <p className="text-gray-500 mt-4">
              <textarea className="h-full w-full " />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
