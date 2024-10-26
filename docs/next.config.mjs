import nextra from "nextra";

const isDev = process.env.NODE_ENV !== "production";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
});

export default {
  ...withNextra(),
  basePath: isDev ? "" : process.env.NEXT_PUBLIC_BASE_PATH,
  output: "export",
  images: { unoptimized: true },
};
