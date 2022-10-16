import { svelte } from '@sveltejs/vite-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve'; // This resolves NPM modules from node_modules.
import preprocess from 'svelte-preprocess';
import {
  postcssConfig,
  terserConfig,
  typhonjsRuntime
} from '@typhonjs-fvtt/runtime/rollup';
import WindiCSS from 'vite-plugin-windicss'
import { windi } from "svelte-windicss-preprocess";

import { searchForWorkspaceRoot } from 'vite'

const s_COMPRESS = false;  // Set to true to compress the module bundle.
const s_SOURCEMAPS = true; // Generate sourcemaps for the bundle (recommended).

// Set to true to enable linking against the TyphonJS Runtime Library module.
// You must add a Foundry module dependency on the `typhonjs` Foundry package or manually install it in Foundry from:
// https://github.com/typhonjs-fvtt-lib/typhonjs/releases/latest/download/module.json
const s_TYPHONJS_MODULE_LIB = false;

// Used in bundling.
const s_RESOLVE_CONFIG = {
  browser: true,
  dedupe: ['svelte']
};

// ATTENTION!
// You must change `base` and the `proxy` strings replacing `/modules/alpha-suit/` with your
// module or system ID.

export default () => {
  /** @type {import('vite').UserConfig} */
  return {
    root: 'src/',                             // Source location / esbuild root.
    base: '/modules/alpha-suit/',    // Base module path that 30001 / served dev directory.
    publicDir: false,                         // No public resources to copy.
    cacheDir: '../.vite-cache',               // Relative from root directory.
    assetInclude: ["./assets/*", "./view/help/**/*"],

    resolve: { conditions: ['import', 'browser'] },

    esbuild: {
      target: ['es2022', 'chrome100'],
      keepNames: true   // Note: doesn't seem to work.
    },

    alias: [
      // {
      //   find: "process.env.NODE_ENV",
      //   replacement: "development",
      // },
    ],

    css: {
      // Creates a standard configuration for PostCSS with autoprefixer & postcss-preset-env.
      postcss: postcssConfig({ compress: s_COMPRESS, sourceMap: s_SOURCEMAPS })
    },

    // About server options:
    // - Set to `open` to boolean `false` to not open a browser window automatically. This is useful if you set up a
    // debugger instance in your IDE and launch it with the URL: 'http://localhost:30001/game'.
    //
    // - The top proxy entry for `lang` will pull the language resources from the main Foundry / 30000 server. This
    // is necessary to reference the dev resources as the root is `/src` and there is no public / static resources
    // served.
    server: {
      port: 30001,
      // open: '/game',
      open: false,
      proxy: {
        '^(/modules/alpha-suit/lang)': 'http://localhost:30000',
        '^(?!/modules/alpha-suit/)': 'http://localhost:30000',
        '/modules/alpha-suit/assets': 'http://localhost:30000',
        '/socket.io': { target: 'ws://localhost:30000', ws: true }
      },
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          '/home/averrin/projects/crew-components/',
        ]
      }
    },

    build: {
      outDir: __dirname,
      emptyOutDir: false,
      sourcemap: s_SOURCEMAPS,
      brotliSize: true,
      minify: s_COMPRESS ? 'terser' : false,
      target: ['es2022', 'chrome100'],
      terserOptions: s_COMPRESS ? { ...terserConfig(), ecma: 2022 } : void 0,
      lib: {
        entry: './index.js',
        formats: ['es'],
        fileName: 'index'
      }
    },

    plugins: [
      WindiCSS(),
      svelte({
        preprocess: [
          windi({}),
          preprocess(),
        ],
        onwarn: (warning, handler) => {
          // Suppress `a11y-missing-attribute` for missing href in <a> links.
          // Foundry doesn't follow accessibility rules.
          if (warning.message.includes(`<a> element should have an href attribute`)) { return; }

          // Let Rollup handle all other warnings normally.
          handler(warning);
        },
      }),

      resolve(s_RESOLVE_CONFIG),    // Necessary when bundling npm-linked packages.

      // When s_TYPHONJS_MODULE_LIB is true transpile against the Foundry module version of TRL.
      s_TYPHONJS_MODULE_LIB && typhonjsRuntime()
    ]
  };
};

