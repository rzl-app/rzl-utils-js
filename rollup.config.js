// rollup.config.js
import dts from "rollup-plugin-dts";
import tsconfigPaths from "rollup-plugin-tsconfig-paths";

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
    external: ["date-fns/locale", "date-fns"],
    plugins: [tsconfigPaths(), dts()],
  },

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
