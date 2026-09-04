/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float-slow': 'floatSlow 3.5s ease-in-out infinite',
        'chew': 'chew 0.35s ease-in-out infinite',
        'wobble': 'wobbleGentle 0.6s ease-in-out',
        'pulse-glow': 'pulseGlow 1.8s ease-in-out infinite',
        'fly-in': 'flyIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        chew: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.08, 0.92)' },
          '50%': { transform: 'scale(0.95, 1.05)' },
          '75%': { transform: 'scale(1.06, 0.94)' },
        },
        wobbleGentle: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '20%': { transform: 'translateX(-8px) rotate(-6deg)' },
          '40%': { transform: 'translateX(8px) rotate(6deg)' },
          '60%': { transform: 'translateX(-5px) rotate(-3deg)' },
          '80%': { transform: 'translateX(5px) rotate(3deg)' },
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))' },
          '50%': { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 18px rgba(255, 215, 0, 0.9))' },
        },
        flyIn: {
          '0%': { transform: 'scale(0.3) translateY(60px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
