/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'button-coin-default': 'linear-gradient(to right, #3B82F6 0%, #ffffff 30%, #ffffff 70%, #3B82F6 100%)',
        'button-gazed': 'linear-gradient(to right, #4f46e5 0%, #ffffff 30%, #ffffff 70%, #a855f7 100%)',
        'button-gazed-reverse': 'linear-gradient(to right, #ec4899 0%, #ffffff 30%, #ffffff 70%, #4f46e5 100%)',
        'blue-black': 'linear-gradient(to right, #4f46e5, #000)'
      },
      colors: {
        'button-default': 'rgb(59, 130, 246)',
        'title': '#660099',
        'authors': '#006621',
        'operations': '#1a0dab'
      }
    },
    screens: {
      'mb': '0px',
      'md': '768px'
    }
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}

