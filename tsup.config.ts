import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/infrastructure/presentation/http/express/index.ts"],
  format: ["esm"],
  outDir: "dist",
  clean: true,
  splitting: false,
});
