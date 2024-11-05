import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ReactNode, useEffect, useState } from "react";
import {
  LLM_PROVIDERS,
  PROVIDERS_TYPE,
  destringifyProvider,
  stringifyProvider,
} from "@/components/utils/providers";
import { Session } from "@/services/session";
import { Button } from "@/components/ui/button";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { useEditor } from "@/components/context/editorcontext";

const ProviderMenu = ({}: {}) => {
  const [providers, setProviders] = useState<PROVIDERS_TYPE[]>([]);
  const [selectedProvider, setSelectedProvider] =
    useState<PROVIDERS_TYPE | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");

  const { setProviderMenu, setPanelVis } = useEditor();

  const configInfo = async (event: Event) => {
    const customEvent = event as CustomEvent;
    const newMessage = customEvent.detail.data;

    // Only listen for available providers
    if (newMessage.type == "info") {
      const providers = JSON.parse(newMessage.config);
      const filteredProviders = LLM_PROVIDERS.filter((provider) =>
        providers.includes(provider.name)
      );

      //   // Determine is available providers contain current provider
      //   const selectedExists = filteredProviders.filter(
      //     (provider) => provider.name == name
      //   );

      //   setProviders(filteredProviders);

      //   if (
      //     filteredProviders.length > 0 &&
      //     (propsProvider == null || selectedExists.length == 0)
      //   ) {
      //     setSelectedProvider(filteredProviders[0]);
      //     setSelectedModel(filteredProviders[0].models[0]);
      //   }
    }
  };

  useEffect(() => {
    Session.addEventListener("sessionConfig", configInfo);

    return () => {
      Session.removeEventListener("finished", configInfo);
    };
  }, []);

  // If new provider is selected assign default model
  useEffect(() => {
    if (selectedProvider) {
      setSelectedModel(selectedProvider.models[0]);
    } else {
      setSelectedModel("");
    }
  }, [selectedProvider]);

  const handlePanelView = () => {
    setProviderMenu(null);
    setPanelVis(false);
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <Button variant={"ghost"} onClick={handlePanelView}>
          <RiArrowRightDoubleFill size={20} />
        </Button>
        <h1 className="text-lg flex-1 text-center">Macro Settings</h1>
      </div>

      <Separator />

      <div className="flex-1 overflow-auto mb-24 mt-4">
        <div className="flex items-center justify-center"></div>
      </div>
    </div>
  );
};

export default ProviderMenu;
