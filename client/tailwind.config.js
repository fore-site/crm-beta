/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
            DEFAULT: '#4B2E83', // Deep Purple
            dark: '#351e60',
            light: '#6544a3',
        },
        secondary: {
            DEFAULT: '#E6E6FA', // Lavender
            dark: '#C3C3E6',
            foreground: '#4B2E83',
        },
        accent: {
            DEFAULT: '#2ECC71', // Bright Green
            dark: '#27AE60',
            light: '#58D68D',
        },
        slate: {
            ...colors.slate,
            850: '#1e1b2e',
            900: '#161321',
            950: '#0c0a12',
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'scale-in': 'scale-in 0.2s ease-out forwards',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
            '0%': { transform: 'scale(0.95)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    }
  },
  plugins: [],
}