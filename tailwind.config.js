/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      boxShadow: {
        'soft': '0 8px 32px rgba(0,0,0,0.05)',
      }
    }
  }
}

