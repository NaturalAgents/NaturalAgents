import { createReactBlockSpec } from "@blocknote/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FaRegFilePdf } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiArrowRightSLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Session } from "@/services/session";

export const FileBlock = createReactBlockSpec(
  {
    type: "file",
    propSchema: {
      fileUrl: {
        default: "",
      },
      fileType: {
        default: "PDF",
        values: ["PDF", "Image", "Audio"],
      },
      send: {
        default: false,
      },
      sid: {
        default: "",
      },
      vis: {
        default: true,
        values: [true],
      },
    },
    content: "inline", // No rich text content
  },
  {
    render: (props) => {
      const { fileUrl, fileType, send, sid } = props.block.props;
      const [selectedFile, setSelectedFile] = useState<File | null>(null);
      const [disabled, setDisabled] = useState<boolean>(false);

      // Set accepted file types based on fileType prop
      const getAcceptedFileTypes = () => {
        switch (fileType) {
          case "Image":
            return "image/*"; // Accept all image types
          case "Audio":
            return "audio/*"; // Accept all audio types
          case "PDF":
          default:
            return "application/pdf"; // Accept PDFs by default
        }
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setSelectedFile(file);
          const fileReader = new FileReader();
          fileReader.onload = (event) => {
            if (event.target?.result) {
              const dataUrl = event.target.result as string;
              props.editor.updateBlock(props.block, {
                type: "file",
                props: { fileUrl: dataUrl },
              });
            }
          };

          fileReader.readAsDataURL(file);
        }
      };

      const sendFile = () => {
        if (fileType == "PDF") {
          Session.send(
            JSON.stringify({
              action: "ping_agent",
              sid,
              content: { msg: fileUrl, type: "pdf" },
            })
          );
        }

        setDisabled(true);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className={`flex p-4 bg-gray-200 w-full rounded-sm ${
                send ? "cursor-pointer hover:bg-gray-300" : "cursor-default"
              }`}
            >
              <FaRegFilePdf size={18} className="mr-2" />
              Add {fileType} {selectedFile && `: ${selectedFile.name}`}
            </div>
          </DropdownMenuTrigger>
          {send && (
            <DropdownMenuContent className="w-96">
              <Tabs defaultValue="upload">
                <TabsList>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="embed">Embed</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <Input
                    type="file"
                    accept={getAcceptedFileTypes()}
                    onChange={handleFileChange}
                    className={`mt-2 cursor-pointer ${selectedFile && "mb-12"}`}
                  />
                </TabsContent>
                <TabsContent value="embed">
                  {/* <Input
                    type="text"
                    placeholder="Enter file URL"
                    // value={fileUrlInput}
                    // onChange={handleUrlChange}
                    className={`mt-2`}
                  /> */}
                  Coming Soon ...
                </TabsContent>
              </Tabs>
              {selectedFile && (
                <Button
                  className="absolute bottom-2 right-2 p-2 gap-2"
                  onClick={sendFile}
                  disabled={disabled}
                >
                  <RiArrowRightSLine size={24} />
                </Button>
              )}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      );
    },
  }
);
