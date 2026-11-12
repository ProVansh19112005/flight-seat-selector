import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// base "./" lets the build work on GitHub Pages and Vercel without extra config
export default defineConfig({ plugins: [react()], base: "./" });
