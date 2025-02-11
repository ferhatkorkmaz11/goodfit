import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        popup: "index.html",
        background: "src/scripts/background.ts",
        content: "src/scripts/content.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
