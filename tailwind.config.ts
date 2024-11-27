import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customGreen: 'rgba(62, 238, 154, 1)',
        verdeCjr: '#73c04a',
        azulCjr: '#002f67',
      },
    },
  },
  plugins: [],
} satisfies Config;
