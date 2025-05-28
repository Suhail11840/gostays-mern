/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all JS/TS/JSX/TSX files in src
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF7E5F', // Lighter shade of your primary color
          DEFAULT: '#FE424D', // Your main primary color (from original CSS)
          dark: '#E63946',  // Darker shade
        },
        secondary: {
          light: '#457B9D',
          DEFAULT: '#1D3557',
          dark: '#0C1D36',
        },
        accent: {
          DEFAULT: '#A8DADC',
        },
        neutral: {
          lightest: '#F1FAEE',
          light: '#E0E0E0',
          DEFAULT: '#BDBDBD',
          dark: '#757575',
          darkest: '#424242',
        },
        // Example gradient colors
        gradientFrom: '#FF7E5F',
        gradientTo: '#FEB47B',
      },
      fontFamily: {
        // Add Montserrat and Poppins (ensure you import them via a CSS file or link in index.html)
        sans: ['Poppins', 'sans-serif'], // Default sans-serif
        display: ['Montserrat', 'sans-serif'], // For headings or display text
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseHalka: { // "halka" means light/gentle
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideInUp: 'slideInUp 0.5s ease-out',
        pulseHalka: 'pulseHalka 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'sleek': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'sleek-lg': '0 10px 30px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem', // Default is 0.75rem, making it slightly larger
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // For better default form styling
    // require('@tailwindcss/typography'), // If you need prose styling for rich text
  ],
}