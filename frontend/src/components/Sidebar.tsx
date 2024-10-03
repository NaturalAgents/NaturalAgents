"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CiFileOn } from "react-icons/ci";
import { RiPlayList2Line } from "react-icons/ri";
import { usePathname } from "next/navigation"; // To check current path

// Sidebar Component
export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter(); // Next.js router
  const pathname = usePathname(); // Current URL path

  // Helper function to determine if the button is active
  const isActive = (path: string) => pathname === path;

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center bg-white transition-all duration-300 ease-in-out border-r",
        isExpanded ? "w-32" : "w-16"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Navigation Items */}
      <nav className="flex flex-col items-center space-y-6 mt-6 w-full">
        {/* Agents Button */}
        <Button
          variant="ghost"
          className="flex items-center w-full justify-center"
          onClick={() => router.push("/")}
        >
          <div
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-md transition-all",
              isActive("/")
                ? "bg-black text-white"
                : "bg-transparent text-black"
            )}
          >
            <CiFileOn size={20} className={isActive("/") ? "text-white" : ""} />
          </div>
          {isExpanded && <span className="ml-4">Agents</span>}
        </Button>

        {/* Runs Button */}
        <Button
          variant="ghost"
          className="flex items-center w-full justify-center"
          onClick={() => router.push("/runs")}
        >
          <div
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-md transition-all",
              isActive("/runs")
                ? "bg-black text-white"
                : "bg-transparent text-black"
            )}
          >
            <RiPlayList2Line
              size={20}
              className={isActive("/runs") ? "text-white" : ""}
            />
          </div>
          {isExpanded && <span className="ml-4">Runs</span>}
        </Button>
      </nav>
    </div>
  );
}
