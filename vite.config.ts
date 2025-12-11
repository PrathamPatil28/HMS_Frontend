import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // This replaces the manual rollup polyfill and handles Dev & Build automatically

  ],
  // You might still need this for react-phone-input-2 specifically
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: [
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/modals",
      "@mantine/notifications",
      "primereact",
      "react-phone-input-2",
    ],
  },
});