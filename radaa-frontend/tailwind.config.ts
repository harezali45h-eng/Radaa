import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Radaa core palette remapped to the new visual system.
        // Background stops
        "radaa-bg": "#09141A",
        deepIndigo: "#0E2A36",

        // Text colors
        "radaa-blue": "#EAF6FF", // primary text alias
        "radaa-mint": "#9BB3C7", // secondary text alias
        "radaa-teal": "#6E8A9E", // muted text alias

        // Accent stops (for gradients and legacy aliases)
        "radaa-purple": "#B84CFF",
        "radaa-gold": "#FF8A00",
        "radaa-orange": "#FF8A00",
        kenyanGreen: "#0B1F2A",
        sunYellow: "#FF8A00",
        safariOrange: "#FF8A00",
        twilightPurple: "#B84CFF",

        // Gen-Z Kenya theme palette aligned to Radaa tokens
        "genz-primary": "#FF8A00",
        "genz-accent": "#B84CFF",
        "genz-bg": "#09141A",
        "genz-surface": "#0B1F2A",
        "genz-accent-yellow": "#FF8A00",

        // Override key Tailwind color scales to stay within the Radaa palette.
        slate: {
          50: "#EAF6FF",
          100: "#EAF6FF",
          200: "#9BB3C7",
          300: "#9BB3C7",
          400: "#6E8A9E",
          500: "#6E8A9E",
          600: "#0E2A36",
          700: "#0B1F2A",
          800: "#09141A",
          900: "#09141A",
          950: "#09141A",
        },
        emerald: {
          50: "#FF8A00",
          100: "#FF8A00",
          200: "#FF8A00",
          300: "#FF8A00",
          400: "#FF8A00",
          500: "#FF8A00",
          600: "#B84CFF",
          700: "#B84CFF",
          800: "#B84CFF",
          900: "#B84CFF",
          950: "#B84CFF",
        },
        sky: {
          50: "#EAF6FF",
          100: "#EAF6FF",
          200: "#9BB3C7",
          300: "#9BB3C7",
          400: "#EAF6FF",
          500: "#EAF6FF",
          600: "#9BB3C7",
          700: "#9BB3C7",
          800: "#6E8A9E",
          900: "#6E8A9E",
          950: "#6E8A9E",
        },
        red: {
          50: "#FF8A00",
          100: "#FF8A00",
          200: "#FF8A00",
          300: "#FF8A00",
          400: "#FF8A00",
          500: "#FF8A00",
          600: "#B84CFF",
          700: "#B84CFF",
          800: "#B84CFF",
          900: "#B84CFF",
          950: "#B84CFF",
        },
        amber: {
          50: "#FF8A00",
          100: "#FF8A00",
          200: "#FF8A00",
          300: "#FF8A00",
          400: "#FF8A00",
          500: "#FF8A00",
          600: "#B84CFF",
          700: "#B84CFF",
          800: "#B84CFF",
          900: "#B84CFF",
          950: "#B84CFF",
        },
        indigo: {
          50: "#0E2A36",
          100: "#0E2A36",
          200: "#0E2A36",
          300: "#0E2A36",
          400: "#0E2A36",
          500: "#0E2A36",
          600: "#0B1F2A",
          700: "#0B1F2A",
          800: "#09141A",
          900: "#09141A",
          950: "#09141A",
        },
        white: "#EAF6FF",
        black: "#09141A",
      },
      borderRadius: {
        card: "18px",
        pill: "999px",
      },
      boxShadow: {
        soft:
          "0 18px 45px -24px rgba(9,20,26,0.9)",
        "glow-blue":
          "0 0 0 1px rgba(234,246,255,0.35), 0 18px 45px -24px rgba(234,246,255,0.75)",
        "glow-mint":
          "0 0 0 1px rgba(155,179,199,0.35), 0 18px 45px -24px rgba(155,179,199,0.75)",
        "glow-kenya":
          "0 0 0 1px rgba(110,138,158,0.4), 0 24px 60px -30px rgba(9,20,26,0.9)",
        "glass-elevated":
          "0 24px 80px -40px rgba(9,20,26,0.95), 0 0 0 1px rgba(155,179,199,0.18)",
      },
      backgroundImage: {
        "gradient-blue-purple":
          "linear-gradient(90deg, #FF8A00, #B84CFF)",
        "gradient-mint-teal":
          "linear-gradient(90deg, #FF8A00, #B84CFF)",
        "gradient-gold-orange":
          "linear-gradient(90deg, #FF8A00, #B84CFF)",
        "gradient-kenya-sun":
          "linear-gradient(90deg, #FF8A00, #B84CFF)",
        "gradient-kenya-night":
          "linear-gradient(180deg, #0B1F2A 0%, #0E2A36 50%, #09141A 100%)",
      },
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
