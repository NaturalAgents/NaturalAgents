"use client";

import { useState } from "react";
import { FaCog } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Header = () => {
  const [feedbackOptIn, setFeedbackOptIn] = useState(false);

  const handleToggle = () => {
    setFeedbackOptIn(!feedbackOptIn);
  };

  return (
    <header className="w-full py-2 px-6 shadow-md border-b">
      <div className="container px-2 flex justify-between items-center">
        <h1 className="text-xl font-bold">NaturalAgents</h1>

        {/* Move Settings Icon to the Right */}
        <div className="ml-12">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <FaCog size={24} />
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <Label htmlFor="feedback-toggle">Opt-in for feedback</Label>
                  <Switch
                    id="feedback-toggle"
                    checked={feedbackOptIn}
                    onCheckedChange={handleToggle}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable this option to provide feedback and help us improve the
                  product.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
