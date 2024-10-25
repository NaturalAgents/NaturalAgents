import { ThemeSwitch } from "nextra-theme-docs";

export default {
  logo: (
    <div className="flex items-center space-x-4">
      <img src="/static/images/logo.svg" width={40} height={40} />
      <span className="font-bold">NaturalAgents</span>
    </div>
  ),
  project: {
    link: "https://github.com/NaturalAgents/NaturalAgents",
  },
  nav: [
    {
      name: "Home",
      href: "/", // Links to the landing page
    },
    {
      name: "Docs",
      href: "/docs", // Links to the docs section
    },
  ],
  navbar: {
    extraContent: () => (
      <div className="ml-4">
        <ThemeSwitch />
      </div>
    ),
  },
};
