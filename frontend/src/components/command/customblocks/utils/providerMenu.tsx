import { useEffect, useState } from "react";
import { PROVIDERS_TYPE, filterProviders } from "@/components/utils/providers";
import { Session } from "@/services/session";
import { Button } from "@/components/ui/button";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { useEditor } from "@/components/context/editorcontext";

const ProviderMenu = ({
  provider,
  updateProvider,
}: {
  provider: string;
  updateProvider: (provider: string) => void;
}) => {
  const [providers, setProviders] = useState<PROVIDERS_TYPE[]>([]);

  const [selectedModel, setSelectedModel] = useState<null | string>(
    provider == "null" ? null : provider
  );

  const { setProviderMenu, setPanelVis } = useEditor();

  const configInfo = async (event: Event) => {
    const customEvent = event as CustomEvent;
    const newMessage = customEvent.detail.data;

    // Only listen for available providers
    if (newMessage.type == "info") {
      const rawProviders = JSON.parse(newMessage.config);
      const filteredProviders = filterProviders(rawProviders);

      setProviders(filteredProviders);
      if (selectedModel == "null" && filteredProviders.length > 0) {
        updateProvider(
          `${filteredProviders[0].name}/${filteredProviders[0].models[0]}`
        );
      }
    }
  };

  useEffect(() => {
    Session.addEventListener("sessionConfig", configInfo);

    return () => {
      Session.removeEventListener("finished", configInfo);
    };
  }, []);

  useEffect(() => {
    Session.send(
      JSON.stringify({
        action: "get_config",
      })
    );
  }, []);

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
        <div className="text-lg mb-6 px-8">Select Provider</div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center">
          {providers.map((provider) =>
            provider.models.map((model) => (
              <div
                key={`${provider.name}/${model}`}
                onClick={() => {
                  setSelectedModel(`${provider.name}/${model}`);
                  updateProvider(`${provider.name}/${model}`);
                }}
                className={`p-4 border rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all w-32 h-32 flex flex-col items-center justify-center border-2 ${
                  selectedModel && selectedModel === `${provider.name}/${model}`
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                <img
                  src={provider.icon}
                  alt={`${provider.name} icon`}
                  className="h-12 w-12 mb-2"
                />
                <p className="text-center text-sm font-medium">
                  {provider.name}
                </p>
                <p className="text-center text-xs">{model}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderMenu;
