/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dw: {
          bg: 'var(--dw-bg)',
          bg2: 'var(--dw-bg2)',
          primary: 'var(--dw-primary)',
          secondary: 'var(--dw-secondary)',
          accent: 'var(--dw-accent)',
          text: 'var(--dw-text)',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        dw: 'var(--dw-radius)',
      },
      boxShadow: {
        glow: '0 0 var(--dw-glow) 0 var(--dw-primary)',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '50%': { transform: 'translateY(-12px) scaleY(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        drift: {
          '0%': { transform: 'translate(0,0)' },
          '100%': { transform: 'translate(20px,-30px)' },
        },
      },
      animation: {
        wave: 'wave 8s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        fadeUp: 'fadeUp 0.8s ease-out forwards',
        drift: 'drift 12s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};
