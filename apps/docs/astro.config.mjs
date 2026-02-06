import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "ClawTrainer Docs",
      social: {
        github: "https://github.com/clawtrainer",
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [{ label: "Introduction", slug: "getting-started" }],
        },
        {
          label: "FAQ",
          items: [
            { label: "General", slug: "faq/general" },
            { label: "Quest Board", slug: "faq/quest-board" },
            { label: "Agents", slug: "faq/agents" },
            { label: "Trainers", slug: "faq/trainers" },
          ],
        },
        {
          label: "API Reference",
          items: [
            { label: "Overview", slug: "api/overview" },
            { label: "Endpoints", slug: "api/endpoints" },
          ],
        },
      ],
      customCss: ["./src/styles/custom.css"],
    }),
  ],
});
