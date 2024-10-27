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
        <a href="https://naturalagents.github.io/NaturalAgents" target="_blank">
          NaturalAgents
        </a>
      </span>
    ),
  },
  head: ({ title, meta }) => {
    const pageTitle = "NaturalAgents";
    return (
      <>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            meta?.description ||
            "Anyone can build custom agents! (using simple macros)"
          }
        />
        <meta property="og:title" content={pageTitle} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:video"
          content={`${prefix}/showcase/questionassitdemo.mov`}
        />
        <meta property="og:video:type" content="video/mp4" />
        <meta property="og:video:width" content="1280" />
        <meta property="og:video:height" content="720" />
        <meta
          property="og:image"
          content={`${prefix}/showcase/questionassist.png`}
        />
        <meta property="og:image:alt" content="Video thumbnail" />
        <link rel="icon" href={`${prefix}/static/images/logo.ico`} />{" "}
      </>
    );
  },
  defaultShowCopyCode: true,
};
