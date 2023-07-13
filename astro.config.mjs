import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import astroI18next from "astro-i18next";

import svelte from "@astrojs/svelte";
import { astroImageTools } from "astro-imagetools";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), astroI18next(), svelte(), astroImageTools],
});
