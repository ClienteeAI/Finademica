import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        error: "hsl(var(--error))",
        info: "hsl(var(--info))",
        purple: "hsl(var(--purple))",
        "text-primary": "hsl(var(--text-primary))",
        "text-secondary": "hsl(var(--text-secondary))",
        "text-tertiary": "hsl(var(--text-tertiary))",
        "border-subtle": "hsl(var(--border-subtle))",
        "border-hover": "hsl(var(--border-hover))",
        "border-glass": "hsl(var(--border-glass))",
        // Ethereal Gold + Ice specific colors
        gold: {
          DEFAULT: "#E4C776",
          light: "#F4D98C",
          glow: "#F8ECD6",
        },
        ice: {
          DEFAULT: "#DBE6F0",
          light: "#F5F7FA",
          silver: "#C8D6E5",
        },
        graphite: {
          DEFAULT: "#1E1E1F",
          soft: "#4A4A4A",
          muted: "#7D7A72",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'gold': '0 0 18px rgba(228, 199, 118, 0.45)',
        'gold-lg': '0 0 30px rgba(228, 199, 118, 0.6)',
        'ice': '0 8px 40px rgba(219, 230, 240, 0.5)',
        'ice-lg': '0 12px 50px rgba(219, 230, 240, 0.6)',
        'frost': '0 4px 24px rgba(219, 230, 240, 0.4)',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "gold-glow": {
          "0%, 100%": {
            boxShadow: "0 0 18px rgba(228, 199, 118, 0.4)"
          },
          "50%": {
            boxShadow: "0 0 28px rgba(228, 199, 118, 0.6)"
          }
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 18px rgba(228, 199, 118, 0.4)"
          },
          "50%": {
            boxShadow: "0 0 28px rgba(228, 199, 118, 0.6)"
          }
        },
        "neon-glow": {
          "0%, 100%": {
            boxShadow: "0 0 18px rgba(228, 199, 118, 0.4)"
          },
          "50%": {
            boxShadow: "0 0 28px rgba(228, 199, 118, 0.6)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "gold-glow": "gold-glow 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "neon-glow": "neon-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;