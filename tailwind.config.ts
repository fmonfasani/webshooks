import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        electricBlue: '#007BFF',
        successGreen: '#28A745',
        dangerRed: '#DC3545',
        neutralDark: '#333C48',
        neutralLight: '#F8F9FA',
        textPrimary: '#212529',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Poppins',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
      },
      borderRadius: {
        68: '68px',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(0, 123, 255, .18), 0 6px 18px -8px rgba(0,0,0, .12)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 400ms ease-out',
        fadeInDown: 'fadeInDown 400ms ease-out',
        fadeIn: 'fadeIn 300ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
