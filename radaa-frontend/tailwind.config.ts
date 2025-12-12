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
        "radaa-bg": "#0E0F10",
        "radaa-blue": "#3B82F6",
        "radaa-purple": "#9333EA",
        "radaa-mint": "#10B981",
        "radaa-teal": "#0D9488",
        "radaa-gold": "#FBBF24",
        "radaa-orange": "#F97316",
        kenyanGreen: "#00B050",
        sunYellow: "#FFD400",
        safariOrange: "#FF6A00",
        twilightPurple: "#A855F7",
        deepIndigo: "#1D4ED8",

        // Gen-Z Kenya theme palette
        "genz-primary": "#0A84FF", // Electric Blue
        "genz-accent": "#00E18E", // Neon Emerald
        "genz-bg": "#111213", // Midnight Charcoal
        "genz-surface": "#F1F3F4", // Soft Grey
        "genz-accent-yellow": "#FFE074", // Accent Yellow
      },
      borderRadius: {
        card: "18px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 18px 45px -24px rgba(15,23,42,0.9)",
        "glow-blue":
          "0 0 0 1px rgba(59,130,246,0.35), 0 18px 45px -24px rgba(59,130,246,0.75)",
        "glow-mint":
          "0 0 0 1px rgba(16,185,129,0.35), 0 18px 45px -24px rgba(16,185,129,0.75)",
        "glow-kenya":
          "0 0 0 1px rgba(0,176,80,0.4), 0 24px 60px -30px rgba(0,176,80,0.9)",
        "glass-elevated":
          "0 24px 80px -40px rgba(15,23,42,0.95), 0 0 0 1px rgba(148,163,184,0.15)",
      },
      backgroundImage: {
        "gradient-blue-purple":
          "linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)",
        "gradient-mint-teal":
          "linear-gradient(135deg, #10B981 0%, #0D9488 100%)",
        "gradient-gold-orange":
          "linear-gradient(135deg, #FBBF24 0%, #F97316 100%)",
        "gradient-kenya-sun":
          "linear-gradient(135deg, #00B050 0%, #FFD400 50%, #FF6A00 100%)",
        "gradient-kenya-night":
          "radial-gradient(circle at top left, rgba(0,176,80,0.55), transparent 55%), radial-gradient(circle at bottom right, rgba(88,28,135,0.7), rgba(15,23,42,1))",
      },
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
