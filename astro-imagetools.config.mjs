import { defineConfig } from "astro-imagetools/config";

export default defineConfig({
  fallbackFormat: "webp",
  includeSourceFormat: false,
  format: "webp",
  layout: "fill",
  objectFit: "cover",
});
