import { createReactBlockSpec } from "@blocknote/react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RiArrowRightSLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Session } from "@/services/session";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LLM_PROVIDERS, PROVIDERS_TYPE } from "@/components/utils/providers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Function to map color to classes
const getColorClass = (color: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-700";
    case "green":
      return "bg-teal-600";
    case "red":
      return "bg-red-500";
    case "orange":
      return "bg-orange-600";
    default:
      return "bg-blue-700"; // Default fallback color
  }
};

export const Bubble = createReactBlockSpec(
  {
    type: "bubble",
    propSchema: {
      text: {
        default: "text",
      },
      color: {
        default: "blue",
        values: ["blue", "green", "red", "orange"], // Define allowed colors
      },
      prompt: {
        default: "Prompt",
      },
      send: {
        default: false,
      },
      vis: {
        default: true,
        values: [true, false],
      },
      sid: {
        default: "",
      },
    },
    content: "inline", // No rich text content; the button itself is the main content
  },
  {
    render: (props) => {
      const { text, color, prompt, send, sid, vis } = props.block.props;
      const colorClass = getColorClass(color);
      const [userInput, setUserInput] = useState("");
      const [disabled, setDisabled] = useState(false);
      const [providers, setProviders] = useState<PROVIDERS_TYPE[]>([]);
      const [selectedProvider, setSelectedProvider] =
        useState<PROVIDERS_TYPE | null>(null);

      const [selectedModel, setSelectedModel] = useState<string>("");

      useEffect(() => {
        const configInfo = async (event: Event) => {
          const customEvent = event as CustomEvent; // Type casting to CustomEvent
          const newMessage = customEvent.detail.data;

          if (newMessage.type == "info") {
            const providers = JSON.parse(newMessage.config);
            const filteredProviders = LLM_PROVIDERS.filter((provider) =>
              providers.includes(provider.name)
            );

            const name = selectedProvider ? selectedProvider.name : "";
            const selectedExists = filteredProviders.filter(
              (provider) => provider.name == name
            );

            setProviders(filteredProviders);
            if (
              filteredProviders.length > 0 &&
              (!selectedProvider || selectedExists.length == 0)
            ) {
              console.log(selectedProvider, selectedExists);
              setSelectedProvider(filteredProviders[0]);
              setSelectedModel(filteredProviders[0].models[0]);
            }
          }
        };

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

      useEffect(() => {
        if (selectedProvider) {
          setSelectedModel(selectedProvider.models[0]);
        } else {
          setSelectedModel("");
        }
      }, [selectedProvider]);

      const onClick = () => {
        Session.send(
          JSON.stringify({
            action: "ping_agent",
            sid,
            content: { msg: userInput },
          })
        );

        setDisabled(true);
      };

      return (
        <Card className={`p-4 relative w-full`}>
          {/* Label with text */}
          <Sheet>
            <SheetTrigger asChild>
              <Label
                htmlFor="cardInput" // Associate label with input
                className={`absolute -top-2 left-2 text-xs text-black bg-opacity-75 px-1 ${colorClass} text-md flex items-center gap-2 cursor-pointer`}
              >
                <span>{vis ? <FaEye /> : <FaEyeSlash />}</span> {text}{" "}
                &lt;model&gt;:
                {selectedModel}
              </Label>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mx-auto w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">
                  Select a Provider
                </h2>
                <div className="flex flex-wrap gap-4">
                  {providers.map((provider) => (
                    <div
                      key={provider.name}
                      onClick={() => setSelectedProvider(provider)}
                      className={`p-2 border rounded-md cursor-pointer ${
                        selectedProvider?.name === provider.name
                          ? "border-green-500"
                          : "border-gray-300"
                      }`}
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
                {selectedProvider && (
                  <div className="mt-4">
                    <h3 className="text-md font-semibold mb-2">
                      Select a Model
                    </h3>
                    <Select
                      value={selectedModel}
                      onValueChange={(value) => setSelectedModel(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={selectedModel} />
                      </SelectTrigger>

                      <SelectContent>
                        {selectedProvider.models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* 3-dotted menu button in top-right */}
          <span className="text-sm underline">{prompt}</span>

          {send ? (
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response here..."
              className="mt-2 mb-8"
            />
          ) : (
            <div
              ref={props.contentRef}
              contentEditable
              suppressContentEditableWarning
              id="cardInput"
              className="border-none focus:outline-none w-full min-h-[100px] placeholder-gray-400"
              style={{ padding: "8px" }}
            ></div>
          )}

          {send && (
            <Button
              variant="default"
              size="sm"
              className="absolute bottom-2 right-2 flex items-center gap-2"
              onClick={onClick}
              disabled={disabled}
            >
              <RiArrowRightSLine className="text-xl" />
            </Button>
          )}
        </Card>
      );
    },
  }
);
