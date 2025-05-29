/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: 'class', // Uncomment if you implement a theme toggle
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF8C8F',      // Lighter, softer red
          DEFAULT: '#FF5A5F',   // Main vibrant red/coral
          dark: '#E04F53',       // Darker shade for hovers/active
        },
        secondary: {
          light: '#00A0AD',      // Lighter teal
          DEFAULT: '#007782',   // Deep, sophisticated teal
          dark: '#005F69',       // Darker teal
        },
        accent: {
          light: '#FFD15C',      // Lighter gold/yellow
          DEFAULT: '#FFB400',   // Warm, energetic gold/yellow
        },
        neutral: {
          lightest: '#F8F9FA', // Off-white for backgrounds
          lighter: '#F1F3F5',  // Slightly off-white
          light: '#E9ECEF',   // Borders, subtle backgrounds
          DEFAULT: '#DEE2E6', // Default border color, subtle dividers
          medium: '#ADB5BD',   // Medium gray for less important text
          dark: '#495057',    // Main body text
          darker: '#343A40',   // Stronger text
          darkest: '#212529',  // Headings, very strong text
        },
        success: {
          light: '#D4EDDA',
          DEFAULT: '#28A745',
          dark: '#1E7E34',
        },
        error: { // Using a distinct error red
          light: '#F8D7DA',
          DEFAULT: '#D9534F', // Was #DC3545, slightly softer
          dark: '#C82333',
        },
        warning: {
          light: '#FFF3CD',
          DEFAULT: '#FFC107',
          dark: '#D39E00',
        },
        // Gradient specific names for clarity
        gradientPrimaryFrom: '#FF5A5F', // Matches primary.DEFAULT
        gradientPrimaryTo: '#FF8C8F',   // Matches primary.light
        gradientSecondaryFrom: '#007782', // Matches secondary.DEFAULT
        gradientSecondaryTo: '#00A0AD',   // Matches secondary.light
        gradientAccentFrom: '#FFB400',    // Matches accent.DEFAULT
        gradientAccentTo: '#FFD15C',      // Matches accent.light
        gradientCoolFrom: '#007782',      // secondary.DEFAULT (teal)
        gradientCoolTo: '#00A0AD',        // secondary.light (lighter teal)
        gradientWarmFrom: '#FF5A5F',      // primary.DEFAULT (coral)
        gradientWarmTo: '#FFB400',        // accent.DEFAULT (gold)
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        display: ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      keyframes: {
        fadeIn: { 
          '0%': { opacity: '0' }, 
          '100%': { opacity: '1' }, 
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseHalka: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.7', transform: 'scale(0.98)' },
        },
        bounceSlow: { // A slower, more subtle bounce
          '0%, 100%': { transform: 'translateY(-3%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        shimmer: { // For loading skeletons or special highlights
            '0%': { backgroundPosition: '-1000px 0' },
            '100%': { backgroundPosition: '1000px 0' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
        fadeInDown: 'fadeInDown 0.6s ease-out forwards',
        fadeInLeft: 'fadeInLeft 0.6s ease-out forwards',
        fadeInRight: 'fadeInRight 0.6s ease-out forwards',
        pulseHalka: 'pulseHalka 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounceSlow: 'bounceSlow 3s infinite',
        shimmer: 'shimmer 2.5s infinite linear',
      },
      boxShadow: {
        'sleek': '0 4px 12px rgba(0, 0, 0, 0.06)', // Softer
        'sleek-md': '0 8px 16px rgba(0, 0, 0, 0.08)',
        'sleek-lg': '0 15px 30px rgba(0, 0, 0, 0.10)',
        'sleek-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        'primary-glow': '0 0 20px 0 rgba(255, 90, 95, 0.5)', // Using primary.DEFAULT hex
        'secondary-glow': '0 0 20px 0 rgba(0, 119, 130, 0.4)', // Using secondary.DEFAULT hex
      },
      borderRadius: {
        'xl': '1rem',    // 16px
        '2xl': '1.5rem', // 24px
        '3xl': '2rem',   // 32px
        '4xl': '3rem',   // 48px (for large hero section rounding)
      },
      // Example for more complex gradients (use in CSS with bg-gradient-name)
      // backgroundImage: theme => ({
      //   'hero-gradient': `linear-gradient(135deg, ${theme('colors.primary.DEFAULT')} 0%, ${theme('colors.accent.DEFAULT')} 100%)`,
      // }),
      transitionTimingFunction: {
        'cubic-out': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)', // Common easing function
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
        strategy: 'class', // Recommended for better customization
    }),
    // require('@tailwindcss/typography'), // If you add a blog or rich text content
    // require('@tailwindcss/aspect-ratio'), // Useful for image cards
  ],
}