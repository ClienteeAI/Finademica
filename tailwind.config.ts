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
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        'playfair': ['Playfair Display', 'Georgia', 'serif'],
        'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
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
        // Luminous Ice specific colors
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
        // Nasr Trade Gold theme colors
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F2C94C",
          dark: "#B8962E",
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
        "cyan-glow": "cyan-glow 2s ease-in-out infinite",
        "gold-glow": "gold-glow 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "neon-glow": "neon-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
