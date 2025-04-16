
import { type Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        programiz: {
          dark: "#1e1e1e",
          darker: "#252526",
          border: "#3e3e42", 
          highlight: "#2d2d2d",
          text: "#e1e1e1",
          muted: "#a0a0a0",
          light: {
            bg: "#ffffff",
            darker: "#f5f5f5",
            border: "#e5e5e5",
            highlight: "#f0f0f0",
            text: "#333333",
            muted: "#666666",
          }
        },
        editor: {
          bg: "hsl(var(--editor-bg))",
          text: "hsl(var(--editor-text))",
          line: "hsl(var(--editor-line))",
          comment: "hsl(var(--editor-comment))",
          keyword: "hsl(var(--editor-keyword))",
          function: "hsl(var(--editor-function))",
          string: "hsl(var(--editor-string))",
          number: "hsl(var(--editor-number))",
          operator: "hsl(var(--editor-operator))",
          variable: "hsl(var(--editor-variable))",
          selection: "hsl(var(--editor-selection))",
        },
        assistant: {
          bg: "#8B5CF6",
          hover: "#7C3AED",
          light: "#EDE9FE",
          text: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "colorful-pulse": {
          "0%, 100%": { 
            backgroundColor: "hsl(210 100% 70%)",
            transform: "scale(1)"
          },
          "50%": { 
            backgroundColor: "hsl(290 70% 65%)",
            transform: "scale(1.05)"
          }
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "colorful-pulse": "colorful-pulse 2s ease-in-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
