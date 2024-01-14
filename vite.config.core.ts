import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    build: {
        lib: {
            entry: "src/main.ts",
            name: "Palette",
            formats: ["iife", "es", "cjs"],
            fileName: (format) => `palette.${format}.js`,
        },
        sourcemap: "hidden"
    },
    server: {
        open: "/test/index.html"
    }
});