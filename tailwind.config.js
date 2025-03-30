/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      boxShadow: {
                'hard-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
      }
    },
    borderOpacity: {
        50: '0.5'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
  }
}

