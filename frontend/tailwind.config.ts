import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutralLight: "#F8FAFC",
        textPrimary: "#1E293B",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
