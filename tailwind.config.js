/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0B1220',
          light: '#F8FAFC',
        },
        surface: {
          dark: '#111C30',
          darker: '#080D17',
          light: '#FFFFFF',
          lightCard: '#F1F5F9',
        },
        border: {
          dark: '#1E293B',
          glow: '#1E3A5F',
        },
        brand: {
          cyan: '#22D3EE',
          cyanGlow: '#06B6D4',
          indigo: '#6366F1',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
        // IMD Standard Rainfall Palette
        rainfall: {
          none: 'rgba(255, 255, 255, 0.05)',
          veryLight: '#BAE6FD', // 0.1 - 2.4 mm
          light: '#38BDF8',     // 2.5 - 15.5 mm
          moderate: '#22C55E',  // 15.6 - 64.4 mm
          heavy: '#EAB308',     // 64.5 - 115.5 mm
          veryHeavy: '#F97316', // 115.6 - 204.4 mm
          extreme: '#EF4444',   // 204.5 - 300 mm
          disastrous: '#9333EA',// > 300 mm
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.25)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'card': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
