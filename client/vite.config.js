import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/generate-tests": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/final_ai_test_results.json": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});

// tailwind.config.js
