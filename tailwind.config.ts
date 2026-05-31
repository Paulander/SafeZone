import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        paper: "#f8fafc",
        brand: {
          coral: "#ff5b5f",
          cyan: "#19c7d8",
          lime: "#b9f24d",
          violet: "#7c3aed"
        }
      },
      boxShadow: {
        phone: "0 32px 80px rgba(15, 23, 42, 0.24)"
      }
    }
  },
  plugins: []
};

export default config;
