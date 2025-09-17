/** tailwind.config.js */
module.exports = {
  content: [
    "./index.html",
    "./src/**/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    }
  },
  plugins: []
}
