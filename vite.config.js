import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // command akan bernilai 'serve' saat development (npm run dev)
  // dan 'build' saat production (npm run build)
  const isProduction = command === "build";

  // Tentukan base URL berdasarkan mode
  // Pastikan base URL selalu diakhiri dengan slash '/'
  const base = isProduction ? "/Story-app/" : "/";

  return {
    base: base, // Gunakan variabel base yang sudah ditentukan
    root: resolve(__dirname, "src"),
    publicDir: resolve(__dirname, "src", "public"),
    build: {
      outDir: resolve(__dirname, "docs"), // Output direktori untuk build
      emptyOutDir: true, // Kosongkan outDir sebelum build
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"), // Alias untuk path src
      },
    },
    plugins: [
      // Plugin sederhana untuk mengganti placeholder di index.html
      {
        name: "vite-plugin-html-transform-base-url",
        // Hook ini akan berjalan saat Vite memproses index.html
        transformIndexHtml(html) {
          // Ganti placeholder %VITE_BASE_URL% dengan nilai base yang sebenarnya
          // Ini berguna untuk skrip di index.html yang perlu tahu base path
          return html.replace(/%VITE_BASE_URL%/g, base);
        },
      },
    ],
  };
});
