import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Legacy (kept for existing pages until migrated)
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['"Inter"', '"DM Sans"', 'system-ui', 'sans-serif'],
        accent: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        // New "High-End Editorial" tri-font system (DESIGN.md)
        headline: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        editorial: ['"Inter"', 'system-ui', 'sans-serif'],
        label: ['"Space Grotesk"', '"JetBrains Mono"', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // --- High-End Editorial tokens (DESIGN.md) ---
        surface: {
          DEFAULT: "#fafaf5",
          bright: "#fafaf5",
          dim: "#dadad5",
        },
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f4f4ef",
        "surface-container": "#eeeee9",
        "surface-container-high": "#e3e3de",
        "surface-container-highest": "#e3e3de",
        "on-surface": "#1a1c19",
        "on-surface-variant": "#59413c",
        "primary-container": "#c23b22",
        "on-primary": "#ffffff",
        tertiary: {
          DEFAULT: "#5c20df",
          container: "#7544f8",
        },
        "on-tertiary": "#ffffff",
        "outline-variant": "#e1bfb8",
        // --- Existing primary scale (updated: DEFAULT now #a0220b per DESIGN.md) ---
        primary: {
          DEFAULT: "#a0220b",
          foreground: "#FFFFFF",
          50: "#FEF2F0",
          100: "#FDE0DB",
          200: "#F9B8AD",
          300: "#F08F7E",
          400: "#D9614E",
          500: "#C23B22",
          600: "#A3301B",
          700: "#8E2F1D",
          800: "#6B2316",
          900: "#4A180F",
        },
        secondary: {
          DEFAULT: "#B5873A",
          foreground: "#FFFFFF",
        },
        paper: {
          DEFAULT: "#F5F0E8",
          light: "#FFFDF8",
          dark: "#E8E0D2",
        },
        ink: {
          DEFAULT: "#141414",
          soft: "#2A2A2A",
          muted: "#6B6660",
        },
        rule: "#CCC0AD",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "10px",
        md: "6px",
        sm: "3px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out forwards",
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
