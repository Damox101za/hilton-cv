/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan:   '#00d4ff',
          purple: '#a855f7',
          blue:   '#3b82f6',
          green:  '#10b981',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        blink:      { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
        scan:       { '0%': { top: '-2px' }, '100%': { top: '100vh' } },
        pulse_dot:  { '0%,100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.6, transform: 'scale(1.15)' } },
        glow_throb: { '0%,100%': { opacity: 0.6 }, '50%': { opacity: 1 } },
        fade_up:    { '0%': { opacity: 0, transform: 'translateY(18px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        blink:      'blink 1s step-end infinite',
        scan:       'scan 9s linear infinite',
        pulse_dot:  'pulse_dot 2.2s ease-in-out infinite',
        glow_throb: 'glow_throb 3s ease-in-out infinite',
        fade_up:    'fade_up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
