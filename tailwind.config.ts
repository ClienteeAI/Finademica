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
      fontFamily: {
        'serif': ['Bodoni Moda', 'Georgia', 'serif'],
        'sans': ['Jost', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        'bodoni': ['Bodoni Moda', 'Georgia', 'serif'],
        'jost': ['Jost', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
        purple: "var(--purple)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "border-subtle": "var(--border-subtle)",
        "border-hover": "var(--border-hover)",
        "border-glass": "var(--border-glass)",
        // Sidebar colors
        sidebar: {
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          primary: "hsl(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          accent: "hsl(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
        },
        // Luminous Ice specific colors (fallback/legacy)
        aqua: {
          DEFAULT: "#4DE2E8",
          light: "#A7E9FF",
          deep: "#2FB3C6",
        },
        ice: {
          DEFAULT: "#D4E0EC",
          light: "#EDF2F7",
          arctic: "#F6F9FB",
        },
        ocean: {
          DEFAULT: "#1D3557",
          soft: "#4B5563",
          muted: "#6B7280",
        },
        lavender: {
          DEFAULT: "#B5A7FF",
          light: "#D4CBFF",
        },
        // Gold theme colors (fallback/legacy)
        gold: {
          DEFAULT: "rgb(var(--gold-rgb, 212 175 55) / <alpha-value>)",
          light: "rgb(var(--gold-light-rgb, 244 217 140) / <alpha-value>)",
          dark: "rgb(178 150 46 / <alpha-value>)",
          glow: "rgba(212, 175, 55, 0.12)",
        },
        nasr: {
          bg: "#000000",
          navy: "#02040A",
          panel: "#0B0F16",
          border: "rgba(255, 255, 255, 0.06)",
          text: "#F5F5F5",
          "text-muted": "#C9C9C9",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'aqua': '0 0 18px rgba(77, 226, 232, 0.45)',
        'aqua-lg': '0 0 30px rgba(77, 226, 232, 0.6)',
        'ice': '0 10px 40px rgba(15, 23, 42, 0.08)',
        'ice-lg': '0 15px 50px rgba(15, 23, 42, 0.1)',
        'frost': '0 4px 24px rgba(212, 224, 236, 0.4)',
        // Nasr gold shadows
        'gold': '0 0 18px rgba(212, 175, 55, 0.45)',
        'gold-lg': '0 0 30px rgba(212, 175, 55, 0.6)',
        'gold-glow': '0 0 40px rgba(212, 175, 55, 0.4)',
        'nasr-card': '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 1px rgba(212, 175, 55, 0.3)',
        'nasr-card-hover': '0 15px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 175, 55, 0.15)',
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
        "slide-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "underline-expand": {
          "0%": {
            transform: "scaleX(0)",
            transformOrigin: "left center"
          },
          "100%": {
            transform: "scaleX(1)",
            transformOrigin: "left center"
          }
        },
        "cyan-glow": {
          "0%, 100%": {
            boxShadow: "0 0 18px rgba(77, 226, 232, 0.4)"
          },
          "50%": {
            boxShadow: "0 0 28px rgba(77, 226, 232, 0.6)"
          }
        },
        "gold-glow": {
          "0%, 100%": {
            boxShadow: "0 0 18px rgba(212, 175, 55, 0.4)"
          },
          "50%": {
            boxShadow: "0 0 28px rgba(212, 175, 55, 0.6)"
          }
        },
        "gold-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 8px rgba(212, 175, 55, 0.3)"
          },
          "50%": {
            boxShadow: "0 0 16px rgba(212, 175, 55, 0.5)"
          }
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 18px rgba(77, 226, 232, 0.4)"
          },
          "50%": {
            boxShadow: "0 0 28px rgba(77, 226, 232, 0.6)"
          }
        },
        "neon-glow": {
          "0%, 100%": {
            boxShadow: "0 0 18px rgba(77, 226, 232, 0.4)"
          },
          "50%": {
            boxShadow: "0 0 28px rgba(77, 226, 232, 0.6)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "underline-expand": "underline-expand 0.3s ease-out forwards",
        "cyan-glow": "cyan-glow 2s ease-in-out infinite",
        "gold-glow": "gold-glow 2s ease-in-out infinite",
        "gold-pulse": "gold-pulse 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "neon-glow": "neon-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
