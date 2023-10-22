module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    "./src/**/*.{html,js}",
    "./node_modules/tw-elements/dist/js/**/*.js",
    "./node_modules/flowbite/**/*.js",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],

  // enable dark mode via class strategy
  darkMode: 'class',

  theme: {
    extend: {
      backgroundColor: {
        'custom-color': '#0D0E20',
        'custom-color-dark': '#0D0E20',
        'custom-modal-bg-color' : '#B3B5E2',
        'custom-modal-text-color' : '#020913'
      },
      // colors: {
      //   black: '#09090c',
      //   darkGray: '#121212',

      //   brightRed: 'hsl(12, 88%, 59%)',
      //   brightRedLight: 'hsl(12, 88%, 69%)',
      //   brightRedSupLight: 'hsl(12, 88%, 95%)',

      //   darkBlue: 'hsl(228, 39%, 23%)',
      //   darkGrayishBlue: 'hsl(227, 12%, 61%)',
      //   veryDarkBlue: 'hsl(233, 12%, 13%)',
      // },
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif'],
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
    require("tw-elements/dist/plugin.cjs"),
    require('flowbite/plugin')
  ],
}