const { transform } = require('windicss/helpers');
function range(size, startAt = 1) {
  return Array.from(Array(size).keys()).map(i => i + startAt)
}

export default {
  prefix: 'ui-',
  preflight: false,
  extract: {
    include: ["src/**/*.svelte"],
    exclude: ["src/styles/*"]
  },
  plugins: [
    transform('daisyui'),
  ],

  safelist: [
    range(20).map(i => `ml-${i}`), // mt-1 to mt-10
  ],
}
