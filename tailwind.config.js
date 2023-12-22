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
        'custom-modal-bg-color': '#B3B5E2',
        'custom-modal-text-color': '#020913'
      },
      borderWidth: {
        'gradient': '4px',
      },
      borderColor: {
        'gradient': 'linear-gradient(to right, #FF0000, #00FF00)', // Define your gradient colors here
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
    },
    screens: {
      'xs': '0px',
      'custom-sm': '400px',
      'custom-md': '600px',
      'sm': '640px',
      'custom-lg': '900px',
      'md': '768px',
      'custom-xl': '1100px',
      'lg': '1024px',
      'custom-2xl': '1300px',
      'xl': '1280px',
      'custom-3xxl': ' 1380px',
      'custom-4xxl': '1400px',
      'custom-5xxxl': '1440px',
      'custom-5xxl': ' 1480px',
      'custom-3xl': '1500px',
      '2xl': '1536px',
      'custom-4xl': '1600px',
      '3xl': '1680px',
      'custom-5xl': '1780px',
      'custom-6xl': '1880px',
      '4xl': '1920px',
      '5xl': '2560px',
      '6xl': '3840px',

    }
  },
  plugins: [
    require('tailwind-scrollbar'),
    require("tw-elements/dist/plugin.cjs"),
    require('flowbite/plugin')
  ],
}