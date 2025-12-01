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
      },
      backgroundImage: {
        "gradient-blue-purple":
          "linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)",
        "gradient-mint-teal":
          "linear-gradient(135deg, #10B981 0%, #0D9488 100%)",
        "gradient-gold-orange":
          "linear-gradient(135deg, #FBBF24 0%, #F97316 100%)",
      },
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
