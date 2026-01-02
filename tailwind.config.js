/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#24223A',
          50: '#f5f4f7',
          100: '#e8e6ed',
          200: '#d1cedb',
          300: '#b0abc3',
          400: '#8a83a5',
          500: '#6b6388',
          600: '#565070',
          700: '#47415c',
          800: '#3d384e',
          900: '#24223A',
        },
        background: '#FFFFFF',
        'header-text': '#1F2937', // dark gray for headers
        'subtext': '#6B7280', // medium gray for subtext
        'chat-box': '#F3F4F6', // light gray for chat boxes
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
