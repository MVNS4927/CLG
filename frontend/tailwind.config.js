export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#e8f1ff',
          100: '#d5e4ff',
          200: '#a8c4ff',
          300: '#7aa4ff',
          400: '#4d83f6',
          500: '#3b82f6', // secondary blue
          600: '#2f6bd3',
          700: '#234fa8',
          800: '#1e3a8a', // primary deep blue
          900: '#162b68'
        },
        accent: {
          orange: '#f97316',
          orangeLight: '#fb923c'
        }
      },
      boxShadow: {
        soft: '0 12px 40px rgba(30,58,138,0.12)'
      }
    }
  },
  plugins: []
};
