import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"), // @ là alias sẽ thay thế /src
      // __dirname là đường dẫn tuyệt đối
      "@components": path.resolve(__dirname, "src/components/"),
    },
  },
});
