/** @type {import('tailwindcss').Config} */
import formsPlugin from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        dark: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          hover: '#3d3d3d'
        }
      },
      textColor: {
        dark: {
          primary: '#ffffff',
          secondary: '#a0aec0'
        }
      }
    },
  },
  plugins: [formsPlugin],
};