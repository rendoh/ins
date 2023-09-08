import { defineConfig, defineGlobalStyles } from '@pandacss/dev';

const globalCss = defineGlobalStyles({
  body: {
    lineHeight: 1.5,
  },
  button: {
    cursor: 'pointer',
  },
});

export default defineConfig({
  globalCss,

  // Whether to use css reset
  preflight: true,

  // The extension for the emitted JavaScript files
  outExtension: 'js',
  // Where to look for your css declarations
  include: ['./app/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
