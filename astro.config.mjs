import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import astroI18next from "astro-i18next";
import svelte from "@astrojs/svelte";
import { astroImageTools } from "astro-imagetools";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";

export default defineConfig({
  site: "https://esl-cca.pages.dev",
  integrations: [
    tailwind(),
    astroI18next(),
    svelte(),
    astroImageTools,
    sitemap(),
    robotsTxt(),
  ],
});
