"use client";

import { useEffect, useState } from "react";
import { FaCog, FaPlus, FaArrowLeft, FaEllipsisV } from "react-icons/fa";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LLM_PROVIDERS, PROVIDERS_TYPE } from "./utils/providers";

const updateApiKey = (selectedProvider: string, apiKey: string) => {
  Session.send(
    JSON.stringify({
      action: "set_api_key",
      type: "add",
      llm_provider: selectedProvider,
      llm_api_key: apiKey,
    })
  );
};

const getConfig = () => {
  Session.send(
    JSON.stringify({
      action: "get_config",
    })
  );
};

type Views = "view" | "add" | "update";

const AddProvider = ({
  setCurrentView,
}: {
  setCurrentView: (value: Views) => void;
}) => {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const handleSave = async () => {
    setSaved(true);
    if (selectedProvider) {
      updateApiKey(selectedProvider, apiKey);
    }
    setTimeout(() => setSaved(false), 2000); // Reset saved message after 2 seconds
    setCurrentView("view");
  };

  return (
    <>
      <div
        className="flex align-right space-x-2 mb-4 cursor-pointer"
        onClick={() => setCurrentView("view")}
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
  setCurrentView,
  providers,
  setSelectedProvider,
}: {
  setCurrentView: (value: Views) => void;
  providers: PROVIDERS_TYPE[];
  setSelectedProvider: (provider: PROVIDERS_TYPE) => void;
}) => {
  useEffect(() => {
    // Get the configured list of api options from backend
    getConfig();
  }, []);

  const deleteProvider = (name: string) => {
    Session.send(
      JSON.stringify({
        action: "set_api_key",
        type: "delete",
        llm_provider: name,
      })
    );

    getConfig();
  };

  return (
    <>
      <div
        className="flex justify-end items-center space-x-2 cursor-pointer"
        onClick={() => setCurrentView("add")}
      >
        <FaPlus size={16} />
        <p className="text-sm font-medium">Add LLM Provider</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
        {providers.map((provider) => (
          <div
            key={provider.name}
            className="relative flex flex-col items-center p-2 border rounded-lg border-green-300"
          >
            {/* Dropdown Menu with Trigger */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className="absolute top-2 right-2 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaEllipsisV size={16} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentView("update");
                    setSelectedProvider(provider);
                  }}
                >
                  Update API Key
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProvider(provider.name);
                  }}
                  className="focus:bg-red-500 focus:text-white"
                >
                  Delete Provider
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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

const HandleProvider = ({
  setCurrentView,
  selectedProvider,
}: {
  setCurrentView: (value: Views) => void;
  selectedProvider: PROVIDERS_TYPE | null;
}) => {
  const [apiKey, setApiKey] = useState("");

  const handleUpdate = () => {
    if (selectedProvider) {
      updateApiKey(selectedProvider.name, apiKey);
      setCurrentView("view");
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="flex align-right space-x-2 mb-4 cursor-pointer"
        onClick={() => setCurrentView("view")}
      >
        <FaArrowLeft size={16} />
        <p className="text-sm font-medium">Back to list</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold">
          Update {selectedProvider && `${selectedProvider.name}`} API Key
        </label>
        <Input
          value={apiKey}
          type="password"
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter new API Key"
        />
      </div>

      <Button onClick={handleUpdate} disabled={!apiKey} className="mt-4">
        Update Key
      </Button>
    </div>
  );
};

const Header = () => {
  const [currentView, setCurrentView] = useState<Views>("view"); // Track "plus" button click
  const [configuredProviders, setConfiguredProviders] = useState<
    PROVIDERS_TYPE[]
  >([]);

  const [selectedProvider, setSelectedProvider] =
    useState<PROVIDERS_TYPE | null>(null);

  useEffect(() => {
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
      } else if (newMessage.type == "info") {
        const providers = JSON.parse(newMessage.config);
        const filteredProviders = LLM_PROVIDERS.filter((provider) =>
          providers.includes(provider.name)
        );
        setConfiguredProviders(filteredProviders);
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
                {currentView == "view" ? (
                  <ViewProvider
                    setCurrentView={setCurrentView}
                    providers={configuredProviders}
                    setSelectedProvider={setSelectedProvider}
                  />
                ) : currentView == "add" ? (
                  <AddProvider setCurrentView={setCurrentView} />
                ) : (
                  <HandleProvider
                    setCurrentView={setCurrentView}
                    selectedProvider={selectedProvider}
                  />
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
