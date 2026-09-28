/** Pollination Desk — cream/paper light shell + turquoise accent */
module.exports = {
  content: ["./docs/**/*.{html,js}", "./src/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#faf7f1",
          warm: "#f3eee4",
          line: "#e4ddd0",
        },
        cream: {
          DEFAULT: "#faf7f1",
          deep: "#f0ebe1",
        },
        ink: {
          DEFAULT: "#2a322c",
          muted: "#5c665f",
          faint: "#8a928b",
        },
        teal: {
          DEFAULT: "#0B8A8F",
          soft: "#12a3a8",
          mist: "#d8f1f2",
          dim: "#086f73",
        },
        pollen: {
          DEFAULT: "#d4a017",
          soft: "#e8c04a",
          dim: "#9a7512",
        },
        leaf: {
          DEFAULT: "#0B8A8F",
          bright: "#12a3a8",
          dim: "#086f73",
          mist: "#d8f1f2",
        },
        petal: {
          DEFAULT: "#f5e6dc",
          rose: "#d9899b",
        },
        dusk: {
          DEFAULT: "#5c665f",
          soft: "#8a928b",
          ink: "#2a322c",
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', "system-ui", "sans-serif"],
        display: ['"Fraunces"', "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 10px 30px rgba(42, 50, 44, 0.06)",
        lift: "0 16px 40px rgba(42, 50, 44, 0.09)",
      },
    },
  },
  plugins: [],
};
