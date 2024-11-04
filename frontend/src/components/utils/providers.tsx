export const LLM_PROVIDERS = [
  {
    name: "OpenAI",
    icon: "/static/images/openai.svg",
    models: ["gpt-4o", "gpt-4-turbo", "gpt-4o-mini", "o1-mini", "o1-preview"],
  },
  {
    name: "Anthropic",
    icon: "/static/images/anthropic.svg",
    models: ["claude-3-5-sonnet", "claude-3-haiku", "claude-3-opus"],
  },
  {
    name: "Gemini",
    icon: "/static/images/gemini.svg",
    models: ["gemini-pro", "gemini-1.5-pro-latest", "gemini-pro-vision"],
  },
  // Add more providers as needed
];

export type PROVIDERS_TYPE = { name: string; icon: string; models: string[] };
