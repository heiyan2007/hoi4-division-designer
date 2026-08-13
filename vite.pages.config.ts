import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/hoi4-division-designer/",
  plugins: [react()],
  build: { outDir: "pages-dist", emptyOutDir: true },
});

