/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        player: "0 0 5px 1px rgba(1, 1, 1, 0.27)",
      },
      backgroundImage: {
        gradient: "linear-gradient(326deg, #a4508b 0%, #5f0a87 74%)",
        gradient_btn:
          "linear-gradient(112.4deg, rgb(169, 28, 115) 21.6%, rgb(219, 112, 54) 92.2%)",
      },
    },
    screens: {
      sm360: "360px",
      mv: "480px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
