// pages/index.js
import { EditorProvider } from "@/components/context/editorcontext";
import PlaygroundPage from "../components/Playground";

const Home = () => {
  return (
    <EditorProvider>
      <PlaygroundPage />
    </EditorProvider>
  );
};

export default Home;
