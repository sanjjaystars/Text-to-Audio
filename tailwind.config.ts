import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050816',
        foreground: '#f8fafc',
        accent: '#7c3aed',
        card: 'rgba(15, 23, 42, 0.72)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(148, 163, 184, 0.12), 0 20px 60px rgba(76, 29, 149, 0.25)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.22) 0, transparent 50%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseSlow: 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
