export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        elbg: "#0a0a0a",
        elcard: "#111113",
        elborder: "#1f1f23",
        elmuted: "#9ca3af",
        elaccent: "#7c7cff",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,124,255,0.15), 0 10px 40px rgba(0,0,0,0.8)",
      },
    },
  },
  plugins: [],
};
