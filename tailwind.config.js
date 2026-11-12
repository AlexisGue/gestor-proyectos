import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    darkTheme: false,
    themes: [
      {
        light: {
          primary: "#6d28d9",
          "primary-content": "#f5f3ff",
          secondary: "#0891b2",
          "secondary-content": "#ecfeff",
          accent: "#7c3aed",
          "accent-content": "#f5f3ff",
          neutral: "#1e1b4b",
          "neutral-content": "#e0e7ff",
          "base-100": "#ffffff",
          "base-200": "#f5f3ff",
          "base-300": "#e9e5ff",
          "base-content": "#1e1b4b",
          info: "#0284c7",
          success: "#059669",
          warning: "#d97706",
          error: "#e11d48",
        },
        dark: {
          primary: "#a78bfa",
          "primary-content": "#1e1b4b",
          secondary: "#22d3ee",
          "secondary-content": "#083344",
          accent: "#c4b5fd",
          "accent-content": "#1e1b4b",
          neutral: "#0b1020",
          "neutral-content": "#e0e7ff",
          "base-100": "#12162a",
          "base-200": "#0c1020",
          "base-300": "#1e2440",
          "base-content": "#e7e9f7",
          info: "#38bdf8",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#fb7185",
        },
      },
    ],
  },
}
