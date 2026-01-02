import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      boxShadow: {
        neon: "0 0 0 2px rgba(0,255,255,.35), 0 0 40px rgba(0,255,255,.18)",
        magenta: "0 0 0 2px rgba(255,0,153,.35), 0 0 40px rgba(255,0,153,.18)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        scan: {
          "0%": { transform: "translateY(-120%)" },
          "100%": { transform: "translateY(120%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.75" },
        },
      },
      animation: {
        floaty: "floaty 2.8s ease-in-out infinite",
        scan: "scan 5s linear infinite",
        flicker: "flicker 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
