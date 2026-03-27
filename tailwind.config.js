/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          '"Hiragino Sans"',
          '"Hiragino Kaku Gothic ProN"',
          '"Yu Gothic"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
