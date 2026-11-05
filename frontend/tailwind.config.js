/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif']
      },
      colors: {
        rif: {
          50: '#eef7f6',
          100: '#d3ebe8',
          200: '#a8d7d2',
          300: '#74bdb7',
          400: '#489e99',
          500: '#2f827e',
          600: '#236864',
          700: '#1e5350',
          800: '#1b4341',
          900: '#183937'
        },
        sable: {
          50: '#fdf9f2',
          100: '#f8efdd',
          200: '#efdcb8',
          300: '#e3c48b',
          400: '#d5a65e',
          500: '#c88d3f',
          600: '#ab6f33',
          700: '#89542c',
          800: '#714529',
          900: '#5e3a25'
        }
      }
    }
  },
  plugins: []
};
