import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
  },
  splitting: false,
  minify: true,
  sourcemap: false,
  bundle: true,
  clean: true,
  esbuildOptions(options) {
    options.legalComments = "none";
  },
});
