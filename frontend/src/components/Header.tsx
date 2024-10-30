"use client";

import { useEffect, useState } from "react";
import { FaCog, FaPlus, FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Session } from "@/services/session";
import { toast } from "@/hooks/use-toast";

const LLM_PROVIDERS = [
  { name: "OpenAI", icon: "/static/icons/openai.svg" },
  { name: "Anthropic", icon: "/static/icons/anthropic.svg" },
  // Add more providers as needed
];

const AddProvider = ({
  setIsAddingNew,
}: {
  setIsAddingNew: (value: boolean) => void;
}) => {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const handleSave = async () => {
    setSaved(true);
    if (selectedProvider) {
      Session.send(
        JSON.stringify({
          action: "set_api_key",
          llm_provider: selectedProvider,
          llm_api_key: apiKey,
        })
      );
    }
    setTimeout(() => setSaved(false), 2000); // Reset saved message after 2 seconds
    setIsAddingNew(false);
  };

  return (
    <>
      <div
        className="flex align-right space-x-2 mb-4 cursor-pointer"
        onClick={() => setIsAddingNew(false)}
      >
        <FaArrowLeft size={16} />
        <p className="text-sm font-medium">Back to list</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="new-provider" className="text-sm font-medium">
            LLM Providers
          </label>
          <Select onValueChange={(value) => setSelectedProvider(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select LLM Provider" />
            </SelectTrigger>
            <SelectContent>
              {LLM_PROVIDERS.map((provider) => (
                <SelectItem key={provider.name} value={provider.name}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 mt-4">
          <label htmlFor="new-api-key" className="text-sm font-medium">
            API Key
          </label>
          <Input
            id="new-api-key"
            value={apiKey}
            type="password"
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API Key"
          />
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={!selectedProvider || !apiKey}
        className="mt-4"
      >
        Save
      </Button>
      {saved && <p className="text-sm text-green-500">Settings saved!</p>}
    </>
  );
};

const ViewProvider = ({
  setIsAddingNew,
}: {
  setIsAddingNew: (value: boolean) => void;
}) => {
  const [configuredProviders, setConfiguredProviders] = useState([]);

  useEffect(() => {
    // Get the configured list of api options from backend
  }, []);

  return (
    <>
      <div
        className="flex justify-end items-center space-x-2"
        onClick={() => setIsAddingNew(true)}
      >
        <FaPlus size={16} />
        <p className="text-sm font-medium">Add LLM Provider</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
        {LLM_PROVIDERS.map((provider) => (
          <div
            key={provider.name}
            className={
              "flex flex-col items-center cursor-pointer p-2 border rounded-lg border-green-300"
            }
          >
            <img
              src={provider.icon}
              alt={`${provider.name} icon`}
              className="h-8 w-8 mb-1"
            />
            <p className="text-sm">{provider.name}</p>
          </div>
        ))}
      </div>
    </>
  );
};

const Header = () => {
  const [isAddingNew, setIsAddingNew] = useState(false); // Track "plus" button click

  useEffect(() => {
    Session.startNewSession();

    const configInfo = async (event: Event) => {
      const customEvent = event as CustomEvent; // Type casting to CustomEvent
      const newMessage = customEvent.detail.data;
      if (newMessage.type == "error") {
        toast({
          title: "Error :(",
          description: newMessage.config,
          variant: "destructive",
        });
      } else if (newMessage.type == "sucess") {
        toast({
          title: "Success!",
          description: newMessage.config,
        });
      }
    };

    Session.addEventListener("sessionConfig", configInfo);

    return () => {
      Session.removeEventListener("finished", configInfo);
    };
  }, []);

  return (
    <header className="w-full py-2 shadow-md border-b">
      <div className="w-full px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/static/images/logo.svg" alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold">NaturalAgents</h1>
        </div>

        <div className="ml-12">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <FaCog size={24} />
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configured LLM Providers</DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {!isAddingNew ? (
                  <ViewProvider setIsAddingNew={setIsAddingNew} />
                ) : (
                  <AddProvider setIsAddingNew={setIsAddingNew} />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
