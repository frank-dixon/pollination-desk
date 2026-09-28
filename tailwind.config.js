/** Pollination Desk — warm botanical tokens */
module.exports = {
  content: ["./docs/**/*.{html,js}", "./src/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#f7f1e6",
          deep: "#ebe1d0",
        },
        pollen: {
          DEFAULT: "#e0a83a",
          soft: "#f0c96a",
          dim: "#a67a22",
        },
        leaf: {
          DEFAULT: "#2f6b4f",
          bright: "#3f8a66",
          dim: "#1e4634",
          mist: "#d7e8dc",
        },
        dusk: {
          DEFAULT: "#2a3358",
          soft: "#3d4a7a",
          ink: "#161b2e",
        },
        petal: {
          DEFAULT: "#f3d5c8",
          rose: "#d9899b",
        },
        ink: {
          DEFAULT: "#1c241c",
          muted: "#5a645a",
          faint: "#8a948a",
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', "system-ui", "sans-serif"],
        display: ['"Fraunces"', "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 12px 40px rgba(22, 27, 46, 0.08)",
        lift: "0 18px 50px rgba(22, 27, 46, 0.12)",
      },
    },
  },
  plugins: [],
};
