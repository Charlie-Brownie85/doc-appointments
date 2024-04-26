/** @type {import('tailwindcss').Config} */
const preset = require('./tailwind-preset');

module.exports = {
  mode: 'jit',
  presets: [
    preset,
  ],
  content: [
    './src/**/*.{html,vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#EFF3F3',
        },
        logo: '#8AA0A0',
      },
    },
  },
  plugins: [
    function initial({ addVariant }) {
      addVariant('initial', 'html :where(&)');
    },
  ],
};
