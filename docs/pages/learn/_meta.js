import { FaExternalLinkAlt } from "react-icons/fa"; // Import an icon from React Icons
import prefix from "../../lib/config";

export default {
  installation: {
    title: "Installation",
  },
  guide: "Basic Guide",
  intermediate: "Intermediate Guide",
  macroseperator: {
    title: "More",
    type: "separator",
  },
  examples_link: {
    title: (
      <>
        Example Recipes <FaExternalLinkAlt className="ml-2 mt-1" />
      </>
    ),
    href: "/examples",
    newWindow: false,
  },
  macro_link: {
    title: (
      <>
        Macro List <FaExternalLinkAlt className="ml-2 mt-1" />
      </>
    ),
    href: "/reference/intro",
    newWindow: false,
  },
};
