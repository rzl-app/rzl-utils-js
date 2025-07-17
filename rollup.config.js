/* eslint-disable @typescript-eslint/no-unused-vars */
// rollup.config.js
import dts from "rollup-plugin-dts";
import tsconfigPaths from "rollup-plugin-tsconfig-paths";

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  //todo: re-bundle roll-up global utils
  {
    input: "./dist/index.d.ts",
    output: {
      file: "./dist/index.d.ts",
      format: "es",
    },
    // external: ["date-fns/locale", "date-fns"],
    plugins: [tsconfigPaths(), dts()],
  },

  //todo: bundle roll-up umd (disable)
  // {
  //   input: "./src/index.ts",
  //   output: {
  //     // sourcemap: true,
  //     file: "./dist/rzl-utils.umd.js",
  //     format: "umd",
  //     name: "RzlUtilsJs",
  //   },
  //   // external: ["date-fns/locale", "date-fns"],
  //   plugins: [
  //     resolve(),
  //     commonjs(),
  //     tsconfigPaths(),
  //     typescript({
  //       tsconfig: "./tsconfig.json",
  //       useTsconfigDeclarationDir: true,
  //       clean: true,
  //     }),
  //   ],
  // },

  //todo: re-bundle roll-up nextjs-client
  {
    input: "./dist/next/index.d.ts",
    output: {
      file: "./dist/next/index.d.ts",
      format: "es",
    },
    external: [],
    plugins: [tsconfigPaths(), dts()],
  },

  //todo: re-bundle roll-up output of types
  {
    input: "./dist/types/index.d.ts",
    output: {
      file: "./dist/types/index.d.ts",
      format: "es",
    },
    external: [],
    plugins: [tsconfigPaths(), dts()],
  },
];

export default config;
