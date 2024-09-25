/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "button-gazed": "linear-gradient(to right, #4f46e5, #a855f7, #ec4899)",
        "button-gazed-reverse": "linear-gradient(to right, #ec4899, #a855f7, #4f46e5)",
        'blue-black': 'linear-gradient(to right, #4f46e5, #000)'
      },
      colors: {
        'button-default': 'rgb(59, 130, 246)'
      }
    },
  },
  plugins: [],
}

