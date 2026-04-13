/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aesthetic Beige/Brown palette
        blush:  '#FAF6F2',
        petal:  '#DED1BD',
        ivory:  '#FAF6F2',   
        cloud:  '#683B2B',   
        brand: {
          50:  '#FAF6F2',
          100: '#F2E8DB',
          200: '#DED1BD',
          300: '#D49E8D',
          400: '#C76A55',
          500: '#D49E8D',  // Rose accent
          600: '#C76A55',
          700: '#683B2B',  // Dark brown
          800: '#4A2A1E',
          900: '#331C14',
        },
        primary: {
          50:  '#FAF6F2',
          100: '#F2E8DB',
          200: '#DED1BD',
          300: '#D49E8D',
          400: '#C76A55',
          500: '#D49E8D',
          600: '#C76A55',
          700: '#683B2B',
          800: '#4A2A1E',
          900: '#331C14',
        },
        accent: {
          light:   '#DED1BD',
          DEFAULT: '#D49E8D',
          dark:    '#C76A55',
          rose:    '#D49E8D'
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        serif:   ['Merriweather', 'serif'],
        sans:    ['Inter', 'sans-serif'],
      },
      animation: {
        blob: "blob 7s infinite",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
      },
      keyframes: {
        blob: {
          "0%":   { transform: "translate(0px, 0px) scale(1)" },
          "33%":  { transform: "translate(30px, -50px) scale(1.1)" },
          "66%":  { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      }
    },
  },
  plugins: [],
}
