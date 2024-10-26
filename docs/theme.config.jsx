import Image from "next/image";
import { ThemeSwitch } from "nextra-theme-docs";
import prefix from "./lib/config";

export default {
  logo: (
    <div className="flex items-center space-x-4">
      <Image src={`${prefix}/static/images/logo.svg`} width={40} height={40} />
      <span className="font-bold">NaturalAgents</span>
    </div>
  ),
  project: {
    link: "https://github.com/NaturalAgents/NaturalAgents",
  },
  docsRepositoryBase: "https://github.com/NaturalAgents/NaturalAgents",
  navbar: {
    extraContent: () => (
      <div className="ml-4">
        <ThemeSwitch />
      </div>
    ),
  },
  darkMode: false, // Disables dark mode toggle globally
  editLink: {
    content: null, // Removes the "Edit this page" link
  },
  footer: {
    content: (
      <span>
        Copyright © {new Date().getFullYear()}{" "}
        <a href="https://nextra.site" target="_blank">
          NaturalAgents
        </a>
      </span>
    ),
  },
};
