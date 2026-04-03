import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: 'rgba(15, 23, 42, 0.6)'
      },
      boxShadow: {
        glass: '0 8px 32px rgba(59, 130, 246, 0.24)'
      }
    }
  },
  plugins: []
};

export default config;
