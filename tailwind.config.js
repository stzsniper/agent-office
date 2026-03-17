/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          50: '#f0f1f5',
          100: '#d4d8e5',
          200: '#a9b1cb',
          300: '#7e8ab1',
          400: '#536397',
          500: '#283c7d',
          600: '#203064',
          700: '#18244b',
          800: '#101832',
          900: '#080c19',
          950: '#04060d',
        },
        neon: {
          green: '#00ff88',
          blue: '#00d4ff',
          purple: '#a855f7',
          orange: '#ff6b35',
          red: '#ff3366',
          yellow: '#ffd700',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 136, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
