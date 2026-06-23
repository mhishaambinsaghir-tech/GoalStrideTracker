/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Primary – indigo/violet
        primary: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        // Accent – violet
        accent: {
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
        },
        // Success – emerald
        success: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        // Warning – amber
        warning: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        // Surface tones (dark mode)
        dark: {
          bg:      "#0f0f14",
          surface: "#16161f",
          card:    "#1e1e2e",
          border:  "#2a2a3e",
          muted:   "#3a3a52",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 24px rgba(99, 102, 241, 0.08)",
        "card-hover": "0 8px 40px rgba(99, 102, 241, 0.18)",
        glow: "0 0 20px rgba(99, 102, 241, 0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
