import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                base: "var(--bg-base)",
                elevated: "var(--bg-elevated)",
                overlay: "var(--bg-overlay)",
                subtle: "var(--bg-subtle)",
                "text-primary": "var(--text-primary)",
                "text-secondary": "var(--text-secondary)",
                "text-tertiary": "var(--text-tertiary)",
                "text-disabled": "var(--text-disabled)",
                "text-on-accent": "var(--text-on-accent)",
                border: {
                    subtle: "var(--border-subtle)",
                    DEFAULT: "var(--border-default)",
                    strong: "var(--border-strong)",
                },
                emerald: {
                    DEFAULT: "var(--accent-emerald)",
                    dim: "var(--emerald-dim)",
                    glow: "var(--emerald-glow)",
                },
                violet: {
                    DEFAULT: "var(--accent-violet)",
                    dim: "var(--violet-dim)",
                },
                sky: {
                    DEFAULT: "var(--accent-sky)",
                    dim: "var(--sky-dim)",
                },
                amber: {
                    DEFAULT: "var(--accent-amber)",
                    dim: "var(--amber-dim)",
                },
                rose: {
                    DEFAULT: "var(--accent-rose)",
                    dim: "var(--rose-dim)",
                },
            },
            boxShadow: {
                surface: "var(--shadow-sm)",
                panel: "var(--shadow-md)",
            },
            fontFamily: {
                serif: ['"Instrument Serif"', "serif"],
                sans: ['"DM Sans"', "sans-serif"],
                mono: ['"Geist Mono"', "monospace"],
            },
            borderRadius: {
                sm: "4px",
                md: "7px",
                lg: "11px",
                xl: "16px",
            },
            keyframes: {
                wall: {
                    "0%": { transform: "scale(0.3)", opacity: "0.5" },
                    "50%": { transform: "scale(1.2)" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                traversed: {
                    "0%": { transform: "scale(0.85)", opacity: "0.5" },
                    "50%": { transform: "scale(1.05)" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                path: {
                    "0%": {
                        backgroundColor: "var(--emerald-dim)",
                        transform: "scale(0.9)",
                    },
                    "50%": {
                        backgroundColor: "var(--emerald-glow)",
                        transform: "scale(1.1)",
                    },
                    "100%": {
                        backgroundColor: "var(--accent-emerald)",
                        transform: "scale(1)",
                    },
                },
            },
            animation: {
                wall: "wall 0.3s ease-out forwards",
                traversed: "traversed 0.08s ease-in-out forwards",
                path: "path 0.04s ease-in-out forwards",
            },
        },
    },
    plugins: [tailwindcssAnimate],
} satisfies Config;
