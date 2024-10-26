import { FaExternalLinkAlt } from "react-icons/fa"; // Import an icon from React Icons

export default {
  installation: {
    title: "Installation",
  },
  getstarted: {
    title: "Get Started",
  },
  guide: "Guide",
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
    href: "/examples/explore",
    newWindow: true,
  },
  macro_link: {
    title: (
      <>
        Macro List <FaExternalLinkAlt className="ml-2 mt-1" />
      </>
    ),
    href: "/reference/MacroReference",
    newWindow: true,
  },
};
