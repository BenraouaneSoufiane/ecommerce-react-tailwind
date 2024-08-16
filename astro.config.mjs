import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  devToolbar: {
    enabled: false
  },
  renderers: ['@astrojs/renderer-react'],
  output: "server",
  adapter: node({
    mode: "middleware"
  }),
  server: {port:3000, host: true}
});