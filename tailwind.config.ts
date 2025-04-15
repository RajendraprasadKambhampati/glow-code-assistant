
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
        editor: {
          bg: "hsl(240 6% 12%)", // Deep rich background
          text: "hsl(0 0% 90%)", // Soft text color
          line: "hsl(240 5% 20% / 60%)", // Line highlight
          comment: "hsl(120 50% 65%)", // Vibrant green comments
          keyword: "hsl(290 70% 65%)", // Bright magenta keywords
          function: "hsl(190 80% 65%)", // Vivid cyan functions
          string: "hsl(40 90% 65%)", // Bright orange strings
          number: "hsl(160 70% 60%)", // Mint green numbers
          operator: "hsl(0 0% 90%)", // Soft white operators
          variable: "hsl(210 100% 70%)", // Bright blue variables
          selection: "hsl(220 20% 40%)", // Rich selection background
        },
        vscode: {
          bg: "hsl(240 6% 12%)", // Deep background
          sidebar: "hsl(240 5% 10%)", // Dark sidebar
          border: "hsl(240 5% 15%)", // Subtle border
          highlight: "hsl(240 6% 20%)", // Soft highlight
          activeTab: "hsl(240 6% 15%)", // Active tab
          selection: "hsl(220 20% 40%)", // Selection background
          titlebar: "hsl(240 5% 8%)", // Title bar
          focusBorder: "hsl(190 80% 65%)", // Vibrant focus border
          buttonBg: "hsl(210 100% 70%)", // Bright button
          buttonHover: "hsl(190 80% 65%)", // Hover state
        }
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
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "colorful-pulse": "colorful-pulse 2s ease-in-out infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
