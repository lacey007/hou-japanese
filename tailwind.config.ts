import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#26302c", matcha: "#547565", cream: "#f7f4ed", sakura: "#d99491" } } },
  plugins: []
} satisfies Config;
