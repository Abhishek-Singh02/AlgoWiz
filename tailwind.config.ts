import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            keyframes: {
                wall: {
                    "0%": {
                        transform: "scale(0.3)",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(2px)",
                        pointerEvents: "none",
                    },
                    "50%": {
                        transform: "scale(1.2)",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        backdropFilter: "blur(4px)",
                        pointerEvents: "none",
                    },
                    "75%": {
                        transform: "scale(1.5)",
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        backdropFilter: "blur(6px)",
                        pointerEvents: "none",
                    },
                    "100%": {
                        transform: "scale(1)",
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        backdropFilter: "blur(3px)",
                        pointerEvents: "auto",
                    },
                },
                traversed: {
                    "0%": {
                        transform: "scale(0.3)",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(2px)",
                        borderRadius: "100%",
                    },
                    "50%": {
                        transform: "scale(1.2)",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        backdropFilter: "blur(4px)",
                    },
                    "75%": {
                        transform: "scale(1.5)",
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        backdropFilter: "blur(6px)",
                    },
                    "100%": {
                        transform: "scale(1)",
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                        backdropFilter: "blur(3px)",
                    },
                },
                path: {
                    "0%": {
                        backgroundColor: "rgba(74, 222, 128, 0.2)", // Pastel green (soft)
                        transform: "scale(0.9)",
                    },
                    "50%": {
                        backgroundColor: "rgba(74, 222, 128, 0.4)", // Brighter pastel green
                        transform: "scale(1.1)",
                    },
                    "100%": {
                        backgroundColor: "rgba(74, 222, 128, 0.6)", // Final pastel green
                        transform: "scale(1)",
                    },
                },
            },
            animation: {
                wall: "wall 0.3s ease-out 0s 1 alternate forwards",
                traversed: "traversed 1.2s ease-in-out 0s 1 forwards",
                path: "path 0.4s ease-in-out 0s 1 forwards",
            },
        },
    },
    plugins: [],
} satisfies Config;
