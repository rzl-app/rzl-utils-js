import { defineConfig } from "tsup";

export default defineConfig([
  //todo: bundle global utils
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    minify: true,
    sourcemap: false,
    bundle: true,
    clean: true,
    esbuildOptions(options) {
      options.legalComments = "none";
    },
  },
  //todo: bundle nextjs-client
  {
    entry: ["src/next/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    outDir: "dist/next",
    external: ["next", "next/*", "react", "react/*"],
    splitting: false,
    minify: true,
    sourcemap: false,
    bundle: true,
    clean: true,
    esbuildOptions(options) {
      options.legalComments = "none";
    },
  },
  //todo: bundle nextjs-server
  {
    entry: ["src/next/server/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    outDir: "dist/next/server",
    external: ["next", "next/*", "react", "react/*"],
    splitting: false,
    minify: true,
    sourcemap: false,
    bundle: true,
    clean: true,
    esbuildOptions(options) {
      options.legalComments = "none";
    },
  },
]);
