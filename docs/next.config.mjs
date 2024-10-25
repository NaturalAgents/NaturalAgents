import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
});

export default {
  ...withNextra(),
  // 1. Set `basePath` since your docs are under a subpath
  basePath: "",
  // 2. Enable static export
  output: "export",
  // 3. When Image Optimization using Next.js default loader is not compatible
  images: { unoptimized: true },
};
