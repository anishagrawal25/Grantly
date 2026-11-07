/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#14201B',
          700: '#3A4A42',
          500: '#6B7A72',
          300: '#C9D1CB',
          100: '#EEF1EC',
        },
        canvas: '#F6F3EC', // warm paper background
        surface: '#FFFFFF',
        line: '#E7E2D6', // hairline card borders
        forest: {
          900: '#0B3B2E',
          800: '#0F4A3A',
          600: '#1F8A5B',
        }, // hero card
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        }, // eligible
        unlock: {
          50: '#FFF8E6',
          100: '#FDEBBD',
          500: '#F2A516',
          600: '#C77F00',
        }, // saffron = unlock
        danger: {
          50: '#FFF1F2',
          500: '#F43F5E',
          600: '#E11D48',
        }, // destructive/overdue only
        info: {
          50: '#EFF6FF',
          500: '#3B82F6',
        },
      },
      fontFamily: {
        money: ['Fraunces', 'Georgia', 'serif'], // big ₹ numbers only
        display: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,32,27,.04), 0 8px 24px rgba(20,32,27,.06)',
        pop: '0 16px 48px rgba(11,59,46,.28)',
      },
    },
  },
  plugins: [],
};
