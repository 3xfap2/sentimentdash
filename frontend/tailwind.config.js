/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1a1a26',
          600: '#22223a',
        },
        accent: {
          cyan: '#00d4ff',
          purple: '#8b5cf6',
          green: '#00ff88',
          red: '#ff4757',
        },
      },
      animation: {
        pulse2: 'pulse2 2s ease-in-out infinite',
        scanline: 'scanline 3s linear infinite',
      },
      keyframes: {
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
