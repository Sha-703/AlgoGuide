import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:           "var(--bg)",
        surface:      "var(--surface)",
        border:       "var(--border)",
        "border-soft":"var(--border-soft)",
        text:         "var(--text)",
        "text-2":     "var(--text-2)",
        "text-3":     "var(--text-3)",
        accent:       "var(--accent)",
        "accent-soft":"var(--accent-soft)",
        "accent-border":"var(--accent-border)",
        "accent-dark":"#15803D",
        primary:      "var(--blue)",
        "primary-soft":"var(--blue-soft)",
        warn:         "var(--yellow)",
        "warn-soft":  "var(--yellow-soft)",
        danger:       "var(--red)",
        "danger-soft":"var(--red-soft)",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card:  "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        modal: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)",
        input: "0 0 0 3px rgba(22,163,74,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
