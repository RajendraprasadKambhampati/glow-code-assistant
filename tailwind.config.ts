
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          PRIMARY: "hsl(var(--sidebar-primary))",
          PRIMARY_FOREGROUND: "hsl(var(--sidebar-primary-foreground))",
          ACCENT: "hsl(var(--sidebar-accent))",
          ACCENT_FOREGROUND: "hsl(var(--sidebar-accent-foreground))",
          BORDER: "hsl(var(--sidebar-border))",
          RING: "hsl(var(--sidebar-ring))",
        },
        editor: {
          bg: "hsl(220 13% 18%)", // VS Code background
          text: "hsl(0 0% 86%)", // VS Code text color
          line: "hsl(220 13% 22% / 50%)", // Line highlight
          comment: "hsl(109 27% 50%)", // Comments - green
          keyword: "hsl(330 65% 62%)", // Keywords - pink
          function: "hsl(187 80% 59%)", // Functions - light blue
          string: "hsl(36 81% 65%)", // Strings - orange
          number: "hsl(187 80% 59%)", // Numbers - light blue
          operator: "hsl(0 0% 86%)", // Operators - white
          variable: "hsl(210 100% 70%)", // Variables - blue
          selection: "hsl(219 28% 35%)", // Selection background
        },
        vscode: {
          bg: "hsl(220 13% 18%)", // VS Code main background
          sidebar: "hsl(220 13% 15%)", // Sidebar background
          border: "hsl(220 13% 10%)", // Border color
          highlight: "hsl(220 13% 25%)", // Highlight background
          activeTab: "hsl(220 13% 20%)", // Active tab background
          selection: "hsl(219 28% 35%)", // Selection background
          titlebar: "hsl(220 13% 10%)", // Title bar background
          focusBorder: "hsl(240 55% 56%)", // Focus border color
          buttonBg: "hsl(214 63% 36%)", // Button background
          buttonHover: "hsl(214 63% 46%)", // Button hover
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-subtle": "pulse-subtle 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
